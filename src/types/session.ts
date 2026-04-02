import type { CaptureSlot, ComparisonState } from './capture'

export type SessionStepId =
  | 'connect_camera'
  | 'capture_reference'
  | 'encode_reference'
  | 'capture_candidate'
  | 'encode_candidate'
  | 'compare_outputs'
  | 'complete'

export type SessionStep = {
  id: SessionStepId
  title: string
  description: string
}

export type SlotPermissions = {
  canCapture: boolean
  canEncode: boolean
}

export type SessionStatus = {
  activeStepId: SessionStepId
  flowLabel: string
  comparisonState: ComparisonState
  permissionsBySlot: Record<CaptureSlot['id'], SlotPermissions>
}
