import { integrationConfig } from '../config/integration'
import type {
  CompareEncodedOutputsRequest,
  CompareEncodedOutputsResponse,
  EncodeImageRequest,
  EncodeImageResponse,
} from '../types/workflow'

export type OracleLensWorkflowService = {
  transport: string
  encodeImage: (request: EncodeImageRequest) => Promise<EncodeImageResponse>
  compareEncodedOutputs: (
    request: CompareEncodedOutputsRequest,
  ) => Promise<CompareEncodedOutputsResponse>
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string }
    return payload.detail ?? `Request failed with status ${response.status}.`
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

const httpOracleLensWorkflow: OracleLensWorkflowService = {
  transport: integrationConfig.workflowTransport,
  async encodeImage({ slotId, file }) {
    const formData = new FormData()
    formData.append('slotId', slotId)
    formData.append('file', file)

    const response = await fetch(`${integrationConfig.workflowBaseUrl}/encode`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(await readErrorMessage(response))
    }

    return (await response.json()) as EncodeImageResponse
  },
  async compareEncodedOutputs(request) {
    const response = await fetch(`${integrationConfig.workflowBaseUrl}/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(await readErrorMessage(response))
    }

    return (await response.json()) as CompareEncodedOutputsResponse
  },
}

export const oracleLensWorkflow = httpOracleLensWorkflow
