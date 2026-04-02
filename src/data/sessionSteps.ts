import type { SessionStep } from '../types/session'

export const sessionSteps: SessionStep[] = [
  {
    id: 'connect_camera',
    title: 'Connect Camera',
    description: 'Begin the session by connecting the Flir BlackFly camera.',
  },
  {
    id: 'capture_reference',
    title: 'Capture Reference BMP',
    description: 'Capture the first BMP image for the reference sample.',
  },
  {
    id: 'encode_reference',
    title: 'Encode Reference JSON',
    description: 'Send the reference BMP into the backend encoding pipeline.',
  },
  {
    id: 'capture_candidate',
    title: 'Capture Candidate BMP',
    description: 'Capture the second BMP image for the comparison sample.',
  },
  {
    id: 'encode_candidate',
    title: 'Encode Candidate JSON',
    description: 'Encode the candidate BMP into its JSON representation.',
  },
  {
    id: 'compare_outputs',
    title: 'Compare Encoded Outputs',
    description: 'Run the backend comparison between both JSON outputs.',
  },
]
