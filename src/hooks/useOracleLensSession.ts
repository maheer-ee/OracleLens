import { useState } from 'react'
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
        bmpFileName: preserveOutputs ? slot.bmpFileName : null,
        jsonFileName: preserveOutputs ? slot.jsonFileName : null,
        capturedAt: preserveOutputs ? slot.capturedAt : null,
        encodedAt: preserveOutputs ? slot.encodedAt : null,
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

  async function handleCapture(slotId: CaptureSlot['id']) {
    if (!isSlotActionAllowed(sessionStatus, slotId, 'capture')) {
      return
    }

    setComparisonResult(null)
    setSlots((currentSlots) => {
      const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
        ...slot,
        stage: 'capturing_bmp',
        jsonFileName: null,
        encodedAt: null,
        statusMessage: buildStageMessage('capturing_bmp'),
        errorMessage: null,
        isBusy: true,
        attemptCount: slot.attemptCount + 1,
      }))
      syncComparisonState(nextSlots)
      return nextSlots
    })

    try {
      const response = await flirBlackFlyCamera.captureBmp({ slotId })
      setSlots((currentSlots) => {
        const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
          ...slot,
          bmpFileName: response.bmpFileName,
          capturedAt: response.capturedAt,
          stage: 'ready_to_capture',
          statusMessage: 'BMP capture complete. Ready to encode JSON.',
          errorMessage: null,
          isBusy: false,
        }))
        syncComparisonState(nextSlots)
        return nextSlots
      })
    } catch {
      setSlotError(slotId, 'BMP capture failed. Retry the camera capture step.')
    }
  }

  async function handleEncode(slotId: CaptureSlot['id']) {
    if (!isSlotActionAllowed(sessionStatus, slotId, 'encode')) {
      return
    }

    const currentSlot = slots.find((slot) => slot.id === slotId)
    if (!currentSlot?.bmpFileName) {
      setSlots((currentSlots) => {
        const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
          ...slot,
          stage: 'error',
          statusMessage: buildStageMessage('error'),
          errorMessage: 'Capture a BMP image before encoding to JSON.',
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
        bmpFileName: currentSlot.bmpFileName,
      })
      setSlots((currentSlots) => {
        const nextSlots = updateSlot(currentSlots, slotId, (slot) => ({
          ...slot,
          stage: 'ready_for_comparison',
          jsonFileName: response.jsonFileName,
          encodedAt: response.encodedAt,
          statusMessage: buildStageMessage('ready_for_comparison'),
          errorMessage: null,
          isBusy: false,
        }))
        syncComparisonState(nextSlots)
        return nextSlots
      })
    } catch {
      setSlotError(
        slotId,
        'JSON encoding failed. Retry encoding with the existing BMP output.',
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

    if (!referenceSlot?.jsonFileName || !candidateSlot?.jsonFileName) {
      setComparisonState('error')
      setComparisonResult({
        summary: 'Both JSON outputs must exist before comparison can start.',
        comparedAt: new Date().toISOString(),
        similarityScore: 0,
        outcome: 'mismatch',
      })
      return
    }

    setComparisonState('comparing')
    setComparisonResult(null)
    try {
      const response = await oracleLensWorkflow.compareEncodedOutputs({
        referenceJsonFileName: referenceSlot.jsonFileName,
        candidateJsonFileName: candidateSlot.jsonFileName,
      })
      setComparisonState(response.comparisonState)
      setComparisonResult({
        summary: response.summary,
        comparedAt: response.comparedAt,
        similarityScore: response.similarityScore,
        outcome: response.outcome,
      })
      setSlots((currentSlots) =>
        currentSlots.map((slot) => ({
          ...slot,
          stage: 'comparison_complete',
          statusMessage: buildStageMessage('comparison_complete'),
        })),
      )
    } catch {
      setComparisonState('retryable')
      setComparisonResult({
        summary:
          'Comparison failed. Existing encoded outputs are still available for retry.',
        comparedAt: new Date().toISOString(),
        similarityScore: 0,
        outcome: 'mismatch',
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
    handleCompare,
    handleConnectCamera,
    handleCapture,
    handleEncode,
    handleResetError,
    handleResetSession,
  }
}
