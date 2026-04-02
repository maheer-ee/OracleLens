import { integrationConfig } from '../config/integration'
import { buildBmpFileName } from '../lib/captureState'
import type {
  CameraConnection,
  CameraIntegrationStatus,
  CaptureFrameRequest,
  CaptureFrameResponse,
} from '../types/camera'

export type FlirBlackFlyCamera = {
  provider: 'Flir BlackFly'
  integrationStatus: CameraIntegrationStatus
  transport: string
  notes: string
  connect: () => Promise<CameraConnection>
  captureBmp: (request: CaptureFrameRequest) => Promise<CaptureFrameResponse>
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const mockFlirBlackFlyCamera: FlirBlackFlyCamera = {
  provider: 'Flir BlackFly',
  integrationStatus: 'mocked',
  transport: integrationConfig.cameraTransport,
  notes: integrationConfig.cameraNotes,
  async connect() {
    await delay(600)
    return {
      cameraName: 'Flir BlackFly',
      connectedAt: new Date().toISOString(),
    }
  },
  async captureBmp({ slotId }) {
    await delay(500)
    return {
      bmpFileName: buildBmpFileName(slotId),
      capturedAt: new Date().toISOString(),
    }
  },
}

export const flirBlackFlyCamera = mockFlirBlackFlyCamera
