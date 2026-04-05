import { useState } from 'react'
import { integrationConfig } from '../config/integration'
import { initialCaptureSlots } from '../data/initialCaptureSlots'
import { buildStageMessage, updateSlot } from '../lib/captureState'
import { deriveSessionStatus, isSlotActionAllowed } from '../lib/sessionFlow'
import { flirBlackFlyCamera } from '../services/flirBlackFlyCamera'
import { oracleLensWorkflow } from '../services/oracleLensWorkflow'
import type {
  CameraConnectionState,
  ComparisonResult,
  ComparisonState,
  CaptureSlot,
} from '../types/capture'

export function useOracleLensSession() {
  const [cameraConnectionState, setCameraConnectionState] =
    useState<CameraConnectionState>('disconnected')
  const [slots, setSlots] = useState<CaptureSlot[]>(initialCaptureSlots)
  const [cameraName, setCameraName] = useState<string | null>(null)
  const [comparisonState, setComparisonState] =
    useState<ComparisonState>('blocked')
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult>(null)

  const sessionStatus = deriveSessionStatus(
    slots,
    cameraConnectionState,
    comparisonState,
    integrationConfig.manualUploadTesting,
  )

  function syncComparisonState(nextSlots: CaptureSlot[]) {
    setComparisonState(
      nextSlots.every((slot) => slot.stage === 'ready_for_comparison')
        ? 'ready'
        : 'blocked',
    )
  }

  function setSlotError(
    slotId: CaptureSlot['id'],
    message: string,
    preserveOutputs = true,
  ) {
    setSlots((currentSlots) => {
      const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
        ...slot,
        selectedFile: preserveOutputs ? slot.selectedFile : null,
        bmpFileName: preserveOutputs ? slot.bmpFileName : null,
        jsonFileName: preserveOutputs ? slot.jsonFileName : null,
        capturedAt: preserveOutputs ? slot.capturedAt : null,
        encodedAt: preserveOutputs ? slot.encodedAt : null,
        fingerprintData: preserveOutputs ? slot.fingerprintData : null,
        stage: 'error',
        statusMessage: buildStageMessage('error'),
        errorMessage: message,
        isBusy: false,
      }))
      syncComparisonState(nextSlots)
      return nextSlots
    })
  }

  function handleResetSession() {
    setCameraConnectionState('disconnected')
    setCameraName(null)
    setSlots(initialCaptureSlots)
    setComparisonState('blocked')
    setComparisonResult(null)
  }

  async function handleConnectCamera() {
    if (integrationConfig.manualUploadTesting) {
      return
    }

    if (
      cameraConnectionState === 'connecting' ||
      cameraConnectionState === 'connected'
    ) {
      return
    }

    setCameraConnectionState('connecting')
    setComparisonResult(null)
    try {
      const response = await flirBlackFlyCamera.connect()
      setCameraName(response.cameraName)
      setCameraConnectionState('connected')
      setSlots((currentSlots) =>
        currentSlots.map((slot) => ({
          ...slot,
          stage: 'ready_to_capture',
          statusMessage: buildStageMessage('ready_to_capture'),
          errorMessage: null,
          isBusy: false,
        })),
      )
    } catch {
      setCameraConnectionState('error')
    }
  }

  function handleAttachFile(slotId: CaptureSlot['id'], file: File | null) {
    if (!file) {
      return
    }

    if (!isSlotActionAllowed(sessionStatus, slotId, 'capture')) {
      return
    }

    setComparisonResult(null)
    setSlots((currentSlots) => {
      const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
        ...slot,
        selectedFile: file,
        bmpFileName: file.name,
        capturedAt: new Date().toISOString(),
        jsonFileName: null,
        encodedAt: null,
        fingerprintData: null,
        stage: 'ready_to_capture',
        statusMessage: 'BMP file attached. Ready to encode JSON.',
        errorMessage: null,
        isBusy: false,
        attemptCount: slot.attemptCount + 1,
      }))
      syncComparisonState(nextSlots)
      return nextSlots
    })
  }

  async function handleEncode(slotId: CaptureSlot['id']) {
    if (!isSlotActionAllowed(sessionStatus, slotId, 'encode')) {
      return
    }

    const currentSlot = slots.find((slot) => slot.id === slotId)
    if (!currentSlot?.selectedFile) {
      setSlots((currentSlots) => {
        const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
          ...slot,
          stage: 'error',
          statusMessage: buildStageMessage('error'),
          errorMessage: 'Attach a BMP image before encoding to JSON.',
        }))
        syncComparisonState(nextSlots)
        return nextSlots
      })
      return
    }

    setComparisonResult(null)
    setSlots((currentSlots) => {
      const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
        ...slot,
        stage: 'encoding_json',
        statusMessage: buildStageMessage('encoding_json'),
        errorMessage: null,
        isBusy: true,
        attemptCount: slot.attemptCount + 1,
      }))
      syncComparisonState(nextSlots)
      return nextSlots
    })

    try {
      const response = await oracleLensWorkflow.encodeImage({
        slotId,
        file: currentSlot.selectedFile,
      })
      setSlots((currentSlots) => {
        const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
          ...slot,
          stage: 'ready_for_comparison',
          jsonFileName: response.jsonFileName,
          encodedAt: response.encodedAt,
          fingerprintData: response.fingerprint,
          statusMessage: buildStageMessage('ready_for_comparison'),
          errorMessage: null,
          isBusy: false,
        }))
        syncComparisonState(nextSlots)
        return nextSlots
      })
    } catch (error) {
      setSlotError(
        slotId,
        `JSON encoding failed. ${
          error instanceof Error ? error.message : 'Retry with the attached BMP file.'
        }`,
      )
    }
  }

  function handleResetError(slotId: CaptureSlot['id']) {
    setSlots((currentSlots) => {
      const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
        ...slot,
        stage: slot.jsonFileName
          ? 'ready_for_comparison'
          : slot.bmpFileName
            ? 'ready_to_capture'
            : 'waiting_for_camera',
        statusMessage: slot.jsonFileName
          ? buildStageMessage('ready_for_comparison')
          : buildStageMessage(
              slot.bmpFileName ? 'ready_to_capture' : 'waiting_for_camera',
            ),
        errorMessage: null,
        isBusy: false,
      }))
      syncComparisonState(nextSlots)
      return nextSlots
    })
  }

  async function handleCompare() {
    const referenceSlot = slots.find((slot) => slot.id === 'image-a')
    const candidateSlot = slots.find((slot) => slot.id === 'image-b')

    if (!referenceSlot?.fingerprintData || !candidateSlot?.fingerprintData) {
      setComparisonState('error')
      setComparisonResult({
        summary: 'Both JSON outputs must exist before comparison can start.',
        comparedAt: new Date().toISOString(),
        similarityScore: 0,
        outcome: 'mismatch',
        hashMatch: false,
        msePass: false,
        mse: 0,
        mseThreshold: 0,
      })
      return
    }

    setComparisonState('comparing')
    setComparisonResult(null)
    try {
      const response = await oracleLensWorkflow.compareEncodedOutputs({
        referenceFingerprint: referenceSlot.fingerprintData,
        candidateFingerprint: candidateSlot.fingerprintData,
      })
      setComparisonState(response.comparisonState)
      setComparisonResult({
        summary: response.summary,
        comparedAt: response.comparedAt,
        similarityScore: response.similarityScore,
        outcome: response.outcome,
        hashMatch: response.hashMatch,
        msePass: response.msePass,
        mse: response.mse,
        mseThreshold: response.mseThreshold,
      })
      setSlots((currentSlots) =>
        currentSlots.map((slot) => ({
          ...slot,
          stage: 'comparison_complete',
          statusMessage: buildStageMessage('comparison_complete'),
        })),
      )
    } catch (error) {
      setComparisonState('retryable')
      setComparisonResult({
        summary: `Comparison failed. ${
          error instanceof Error
            ? error.message
            : 'Existing encoded outputs are still available for retry.'
        }`,
        comparedAt: new Date().toISOString(),
        similarityScore: 0,
        outcome: 'mismatch',
        hashMatch: false,
        msePass: false,
        mse: 0,
        mseThreshold: 0,
      })
    }
  }

  return {
    cameraConnectionState,
    cameraName,
    comparisonResult,
    comparisonState,
    sessionStatus,
    slots,
    handleAttachFile,
    handleCompare,
    handleConnectCamera,
    handleEncode,
    handleResetError,
    handleResetSession,
  }
}
