export type CameraProvider = 'Flir BlackFly'

export type CameraIntegrationStatus =
  | 'unconfigured'
  | 'mocked'
  | 'backend_ready'

export type CameraConnection = {
  cameraName: CameraProvider
  connectedAt: string
}

export type CaptureFrameRequest = {
  slotId: 'image-a' | 'image-b'
}

export type CaptureFrameResponse = {
  bmpFileName: string
  capturedAt: string
}
