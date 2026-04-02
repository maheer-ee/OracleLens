import { integrationConfig } from '../config/integration'
import { buildJsonFileName } from '../lib/captureState'
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

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const mockOracleLensWorkflow: OracleLensWorkflowService = {
  transport: integrationConfig.workflowTransport,
  async encodeImage({ slotId }) {
    await delay(500)
    return {
      jsonFileName: buildJsonFileName(slotId),
      encodedAt: new Date().toISOString(),
    }
  },
  async compareEncodedOutputs(request) {
    await delay(700)
    return {
      comparisonState: 'complete',
      summary: `Compared ${request.referenceJsonFileName} against ${request.candidateJsonFileName}.`,
      comparedAt: new Date().toISOString(),
      similarityScore: 94,
      outcome: 'match',
    }
  },
}

export const oracleLensWorkflow = mockOracleLensWorkflow
