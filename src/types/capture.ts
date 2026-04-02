export type CaptureStage =
  | 'idle'
  | 'waiting_for_camera'
  | 'ready_to_capture'
  | 'capturing_bmp'
  | 'encoding_json'
  | 'ready_for_comparison'
  | 'comparison_complete'
  | 'error'

export type CaptureSlot = {
  id: 'image-a' | 'image-b'
  label: string
  bmpFileName: string | null
  jsonFileName: string | null
  capturedAt: string | null
  encodedAt: string | null
  stage: CaptureStage
  statusMessage: string
  errorMessage: string | null
  isBusy: boolean
  attemptCount: number
}

export type CameraConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'

export type ComparisonState =
  | 'blocked'
  | 'ready'
  | 'comparing'
  | 'complete'
  | 'error'
  | 'retryable'

export type ComparisonResult = {
  summary: string
  comparedAt: string
  similarityScore: number
  outcome: 'match' | 'mismatch'
} | null
