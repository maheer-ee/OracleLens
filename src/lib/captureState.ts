import type { CaptureSlot, CaptureStage } from '../types/capture'

type SlotId = CaptureSlot['id']

export function updateSlot(
  slots: CaptureSlot[],
  slotId: SlotId,
  updater: (slot: CaptureSlot) => CaptureSlot,
) {
  return slots.map((slot) => (slot.id === slotId ? updater(slot) : slot))
}

export function buildBmpFileName(slotId: SlotId) {
  return `${slotId}-${Date.now()}.bmp`
}

export function buildJsonFileName(slotId: SlotId) {
  return `${slotId}-${Date.now()}.json`
}

export function buildStageMessage(stage: CaptureStage) {
  switch (stage) {
    case 'idle':
      return 'Waiting for camera connection.'
    case 'waiting_for_camera':
      return 'Waiting for the camera to become available.'
    case 'ready_to_capture':
      return 'Ready to capture a BMP image.'
    case 'capturing_bmp':
      return 'Capturing BMP image.'
    case 'encoding_json':
      return 'Encoding BMP output into JSON.'
    case 'ready_for_comparison':
      return 'Capture and encoding complete.'
    case 'comparison_complete':
      return 'Comparison has completed.'
    case 'error':
      return 'The step failed. Review the error details and retry.'
  }
}
