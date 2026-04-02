import type { CameraConnectionState, ComparisonState } from '../types/capture'

type SystemStatusPanelProps = {
  cameraConnectionState: CameraConnectionState
  comparisonState: ComparisonState
  sessionMessage: string
  onResetSession: () => void
}

export function SystemStatusPanel({
  cameraConnectionState,
  comparisonState,
  sessionMessage,
  onResetSession,
}: SystemStatusPanelProps) {
  return (
    <section className="rounded-[2rem] border border-orange-100 bg-white/85 p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            System Status
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Guard rails for retries, failure handling, and session reset.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetSession}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700"
        >
          Reset Session
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-orange-50/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Camera State
          </p>
          <p className="mt-1 text-sm font-medium text-stone-900">
            {cameraConnectionState}
          </p>
        </div>
        <div className="rounded-2xl bg-orange-50/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Comparison State
          </p>
          <p className="mt-1 text-sm font-medium text-stone-900">
            {comparisonState}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-stone-700">
        {sessionMessage}
      </p>
    </section>
  )
}
