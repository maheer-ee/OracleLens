import type { ComparisonState } from './capture'

export type EncodeImageRequest = {
  slotId: 'image-a' | 'image-b'
  bmpFileName: string
}

export type EncodeImageResponse = {
  jsonFileName: string
  encodedAt: string
}

export type CompareEncodedOutputsRequest = {
  referenceJsonFileName: string
  candidateJsonFileName: string
}

export type CompareEncodedOutputsResponse = {
  comparisonState: Extract<ComparisonState, 'complete'>
  summary: string
  comparedAt: string
  similarityScore: number
  outcome: 'match' | 'mismatch'
}
