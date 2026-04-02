import type {
  CameraConnectionState,
  CaptureSlot,
  ComparisonState,
} from '../types/capture'
import type {
  SessionStatus,
  SessionStepId,
  SlotPermissions,
} from '../types/session'

function buildPermissions(canCapture: boolean, canEncode: boolean): SlotPermissions {
  return { canCapture, canEncode }
}

export function deriveSessionStatus(
  slots: CaptureSlot[],
  cameraConnectionState: CameraConnectionState,
  comparisonState: ComparisonState,
): SessionStatus {
  if (cameraConnectionState !== 'connected') {
    return {
      activeStepId: 'connect_camera',
      flowLabel: 'Connect the camera to start the capture session.',
      comparisonState,
      permissionsBySlot: {
        'image-a': buildPermissions(false, false),
        'image-b': buildPermissions(false, false),
      },
    }
  }

  const referenceSlot = slots.find((slot) => slot.id === 'image-a')
  const candidateSlot = slots.find((slot) => slot.id === 'image-b')

  if (!referenceSlot || !candidateSlot) {
    return {
      activeStepId: 'connect_camera',
      flowLabel: 'Session data is incomplete.',
      comparisonState: 'error',
      permissionsBySlot: {
        'image-a': buildPermissions(false, false),
        'image-b': buildPermissions(false, false),
      },
    }
  }

  if (!referenceSlot.bmpFileName) {
    return {
      activeStepId: 'capture_reference',
      flowLabel: 'Capture the reference BMP image first.',
      comparisonState: 'blocked',
      permissionsBySlot: {
        'image-a': buildPermissions(true, false),
        'image-b': buildPermissions(false, false),
      },
    }
  }

  if (!referenceSlot.jsonFileName) {
    return {
      activeStepId: 'encode_reference',
      flowLabel: 'Encode the reference BMP into JSON before moving to the candidate image.',
      comparisonState: 'blocked',
      permissionsBySlot: {
        'image-a': buildPermissions(false, true),
        'image-b': buildPermissions(false, false),
      },
    }
  }

  if (!candidateSlot.bmpFileName) {
    return {
      activeStepId: 'capture_candidate',
      flowLabel: 'Capture the candidate BMP after the reference image is fully encoded.',
      comparisonState: 'blocked',
      permissionsBySlot: {
        'image-a': buildPermissions(false, false),
        'image-b': buildPermissions(true, false),
      },
    }
  }

  if (!candidateSlot.jsonFileName) {
    return {
      activeStepId: 'encode_candidate',
      flowLabel: 'Encode the candidate BMP into JSON before comparison.',
      comparisonState: 'blocked',
      permissionsBySlot: {
        'image-a': buildPermissions(false, false),
        'image-b': buildPermissions(false, true),
      },
    }
  }

  if (comparisonState === 'complete') {
    return {
      activeStepId: 'complete',
      flowLabel: 'The session is complete. Both JSON outputs have been compared.',
      comparisonState,
      permissionsBySlot: {
        'image-a': buildPermissions(false, false),
        'image-b': buildPermissions(false, false),
      },
    }
  }

  if (comparisonState === 'retryable') {
    return {
      activeStepId: 'compare_outputs',
      flowLabel: 'Comparison can be retried without recapturing or re-encoding the current outputs.',
      comparisonState,
      permissionsBySlot: {
        'image-a': buildPermissions(false, false),
        'image-b': buildPermissions(false, false),
      },
    }
  }

  return {
    activeStepId: 'compare_outputs',
    flowLabel: 'Both JSON outputs are ready. Run the comparison step.',
    comparisonState: 'ready',
    permissionsBySlot: {
      'image-a': buildPermissions(false, false),
      'image-b': buildPermissions(false, false),
    },
  }
}

export function isSlotActionAllowed(
  sessionStatus: SessionStatus,
  slotId: CaptureSlot['id'],
  action: 'capture' | 'encode',
) {
  const permissions = sessionStatus.permissionsBySlot[slotId]
  return action === 'capture' ? permissions.canCapture : permissions.canEncode
}

export function isSessionStepActive(
  activeStepId: SessionStepId,
  stepId: SessionStepId,
) {
  return activeStepId === stepId
}
