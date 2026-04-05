export const integrationConfig = {
  cameraProvider: 'Flir BlackFly',
  cameraTransport: 'local-backend-adapter',
  workflowTransport: 'application-api',
  workflowBaseUrl: 'http://127.0.0.1:8000',
  manualUploadTesting: true,
  cameraNotes:
    'The browser should not talk directly to the Flir BlackFly camera. A local service or backend process should own camera access and expose a safe API boundary.',
}
