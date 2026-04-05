import { formatTimestamp } from '../lib/format'
import type { ComparisonResult, ComparisonState } from '../types/capture'

type ComparisonPanelProps = {
  comparisonState: ComparisonState
  comparisonResult: ComparisonResult
  flowLabel: string
  onCompare: () => void
}

const comparisonMessage: Record<ComparisonState, string> = {
  blocked: 'The compare action stays disabled until both image slots finish BMP capture and JSON encoding.',
  ready: 'Both encoded outputs are prepared. The compare action is now available in the UI contract.',
  comparing: 'Comparison is in progress.',
  complete: 'Comparison has completed.',
  error: 'Comparison failed.',
  retryable: 'Comparison failed, but the existing encoded outputs are still available for retry.',
}

export function ComparisonPanel({
  comparisonState,
  comparisonResult,
  flowLabel,
  onCompare,
}: ComparisonPanelProps) {
  const canCompare =
    comparisonState === 'ready' || comparisonState === 'retryable'

  return (
    <section className="rounded-[2rem] border border-orange-100 bg-white/85 p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
        Comparison Stage
      </h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        {comparisonMessage[comparisonState]}
      </p>
      <p className="mt-3 rounded-2xl bg-orange-50/70 px-4 py-3 text-sm leading-6 text-stone-700">
        {flowLabel}
      </p>
      {comparisonResult ? (
        <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-4 text-sm text-stone-700">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-stone-900">Latest result</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                comparisonResult.outcome === 'match'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {comparisonResult.outcome}
            </span>
          </div>
          <p className="mt-2">{comparisonResult.summary}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Similarity Score
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-900">
                {comparisonResult.similarityScore}%
              </p>
            </div>
            <div className="rounded-xl bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Compared At
              </p>
              <p className="mt-1 text-sm text-stone-900">
                {formatTimestamp(comparisonResult.comparedAt)}
              </p>
            </div>
            <div className="rounded-xl bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Hash Match
              </p>
              <p className="mt-1 text-sm text-stone-900">
                {comparisonResult.hashMatch ? 'True' : 'False'}
              </p>
            </div>
            <div className="rounded-xl bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                MSE Check
              </p>
              <p className="mt-1 text-sm text-stone-900">
                {comparisonResult.msePass
                  ? `Pass (${comparisonResult.mse.toFixed(2)} / ${comparisonResult.mseThreshold.toFixed(2)})`
                  : `Fail (${comparisonResult.mse.toFixed(2)} / ${comparisonResult.mseThreshold.toFixed(2)})`}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">
            Raw timestamp: {comparisonResult.comparedAt}
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={onCompare}
        disabled={!canCompare}
        className="mt-6 w-full cursor-pointer rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm font-medium text-stone-500 disabled:cursor-not-allowed disabled:border-stone-100 disabled:bg-stone-50 disabled:text-stone-400"
      >
        {comparisonState === 'comparing'
          ? 'Comparing Encoded Outputs...'
          : comparisonState === 'retryable'
            ? 'Retry Comparison'
            : 'Compare Encoded Outputs'}
      </button>
    </section>
  )
}
