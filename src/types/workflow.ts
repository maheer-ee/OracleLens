import type { ComparisonState } from './capture'

export type EncodeImageRequest = {
  slotId: 'image-a' | 'image-b'
  file: File
}

export type EncodeImageResponse = {
  jsonFileName: string
  encodedAt: string
  fingerprint: Record<string, unknown>
}

export type CompareEncodedOutputsRequest = {
  referenceFingerprint: Record<string, unknown>
  candidateFingerprint: Record<string, unknown>
}

export type CompareEncodedOutputsResponse = {
  comparisonState: Extract<ComparisonState, 'complete'>
  summary: string
  comparedAt: string
  similarityScore: number
  outcome: 'match' | 'mismatch'
  algorithm: string
  rawMatches: number
  geometricInliers: number
  matchThreshold: number
  verified: boolean
}
