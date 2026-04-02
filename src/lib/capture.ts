import type { CaptureStage } from '../types/capture'

export function formatStage(stage: CaptureStage) {
  return stage.replaceAll('_', ' ')
}

export function canCapture(stage: CaptureStage) {
  return stage === 'ready_to_capture' || stage === 'error'
}

export function canEncode(stage: CaptureStage, bmpFileName: string | null) {
  return stage === 'capturing_bmp' || (stage === 'ready_to_capture' && bmpFileName !== null)
}
