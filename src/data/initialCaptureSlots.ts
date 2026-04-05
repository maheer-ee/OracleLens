import type { CaptureSlot } from '../types/capture'

export const initialCaptureSlots: CaptureSlot[] = [
  {
    id: 'image-a',
    label: 'Reference Image',
    selectedFile: null,
    bmpFileName: null,
    jsonFileName: null,
    capturedAt: null,
    encodedAt: null,
    fingerprintData: null,
    stage: 'idle',
    statusMessage: 'Waiting for camera connection.',
    errorMessage: null,
    isBusy: false,
    attemptCount: 0,
  },
  {
    id: 'image-b',
    label: 'Candidate Image',
    selectedFile: null,
    bmpFileName: null,
    jsonFileName: null,
    capturedAt: null,
    encodedAt: null,
    fingerprintData: null,
    stage: 'idle',
    statusMessage: 'Waiting for camera connection.',
    errorMessage: null,
    isBusy: false,
    attemptCount: 0,
  },
]
