import { formatTimestamp } from '../lib/format';
import type { ComparisonResult, ComparisonState } from '../types/capture';

type ComparisonPanelProps = {
  comparisonState: ComparisonState;
  comparisonResult: ComparisonResult;
  flowLabel: string;
  isDarkMode: boolean;
  onCompare: () => void;
};

const comparisonMessage: Record<ComparisonState, string> = {
  blocked:
    'The compare action stays disabled until both image slots finish BMP capture and JSON encoding.',
  ready: 'Both JSON outputs are ready. You can compare them now.',
  comparing: 'Comparison is in progress.',
  complete: 'Comparison has completed.',
  error: 'Comparison failed.',
  retryable:
    'Comparison failed, but the existing encoded outputs are still available for retry.',
};

function formatDetailedTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(timestamp));
}

export function ComparisonPanel({
  comparisonState,
  comparisonResult,
  flowLabel,
  isDarkMode,
  onCompare,
}: ComparisonPanelProps) {
  const canCompare =
    comparisonState === 'ready' || comparisonState === 'retryable';

  return (
    <section
      className={`rounded-[2rem] border p-7 sm:p-8 ${
        isDarkMode
          ? 'border-orange-800 bg-stone-900'
          : 'border-orange-300 bg-white'
      }`}>
      <h2
        className={`text-2xl font-semibold tracking-tight ${
          isDarkMode ? 'text-stone-100' : 'text-stone-900'
        }`}>
        Comparison Stage
      </h2>
      <p
        className={`mt-2 text-sm leading-6 ${
          isDarkMode ? 'text-stone-300' : 'text-stone-600'
        }`}>
        See whether both encoded outputs line up cleanly.
      </p>
      <p
        className={`mt-3 text-sm leading-6 ${
          isDarkMode ? 'text-stone-300' : 'text-stone-600'
        }`}>
        {comparisonMessage[comparisonState]}
      </p>
      <p
        className={`mt-3 rounded-2xl px-4 py-3 text-sm leading-6 ${
          isDarkMode
            ? 'bg-stone-800 text-stone-200'
            : 'bg-orange-50/70 text-stone-700'
        }`}>
        {flowLabel}
      </p>
      {comparisonResult ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-4 text-sm ${
            isDarkMode
              ? 'border-orange-900/50 bg-orange-950/20 text-stone-200'
              : 'border-orange-100 bg-orange-50/70 text-stone-700'
          }`}>
          <div className='flex items-center justify-between gap-3'>
            <p
              className={`font-medium ${
                isDarkMode ? 'text-stone-100' : 'text-stone-900'
              }`}>
              Latest result
            </p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                comparisonResult.outcome === 'match'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
              {comparisonResult.outcome}
            </span>
          </div>
          <div
            className={`mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm ${
              isDarkMode ? 'text-stone-200' : 'text-stone-700'
            }`}>
            <p className='flex items-center justify-between gap-2'>
              <span
                className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>
                Hash Match:
              </span>
              <span
                className={isDarkMode ? 'text-stone-100' : 'text-stone-900'}>
                {comparisonResult.hashMatch ? 'True' : 'False'}
              </span>
            </p>
            <p className='flex items-center justify-between gap-2'>
              <span
                className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>
                MSE Pass:
              </span>
              <span
                className={isDarkMode ? 'text-stone-100' : 'text-stone-900'}>
                {comparisonResult.msePass ? 'True' : 'False'}
              </span>
            </p>
            <p className='flex items-center justify-between gap-2'>
              <span
                className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>
                MSE:
              </span>
              <span
                className={isDarkMode ? 'text-stone-100' : 'text-stone-900'}>
                {comparisonResult.mse.toFixed(2)} /{' '}
                {comparisonResult.mseThreshold.toFixed(2)}
              </span>
            </p>
          </div>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <div
              className={`rounded-xl px-4 py-3 ${
                isDarkMode ? 'bg-stone-800' : 'bg-white'
              }`}>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? 'text-stone-400' : 'text-stone-500'
                }`}>
                Similarity Score
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  isDarkMode ? 'text-stone-100' : 'text-stone-900'
                }`}>
                {comparisonResult.similarityScore}%
              </p>
            </div>
            <div
              className={`rounded-xl px-4 py-3 ${
                isDarkMode ? 'bg-stone-800' : 'bg-white'
              }`}>
              <p
                className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                  isDarkMode ? 'text-stone-400' : 'text-stone-500'
                }`}>
                Compared At
              </p>
              <p
                className={`mt-1 text-sm ${
                  isDarkMode ? 'text-stone-100' : 'text-stone-900'
                }`}>
                {formatTimestamp(comparisonResult.comparedAt)}
              </p>
            </div>
          </div>
          <p
            className={`mt-3 text-xs uppercase tracking-[0.14em] ${
              isDarkMode ? 'text-stone-400' : 'text-stone-500'
            }`}>
            Raw timestamp:{' '}
            {formatDetailedTimestamp(comparisonResult.comparedAt)}
          </p>
        </div>
      ) : null}
      <button
        type='button'
        onClick={onCompare}
        disabled={!canCompare}
        className={`mt-6 w-full cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium disabled:cursor-not-allowed ${
          isDarkMode
            ? 'border-stone-700 bg-stone-800 text-stone-200 disabled:border-stone-800 disabled:bg-stone-900 disabled:text-stone-500'
            : 'border-stone-200 bg-stone-100 text-stone-500 disabled:border-stone-100 disabled:bg-stone-50 disabled:text-stone-400'
        }`}>
        {comparisonState === 'comparing'
          ? 'Comparing Encoded Outputs...'
          : comparisonState === 'retryable'
            ? 'Retry Comparison'
            : 'Compare Encoded Outputs'}
      </button>
    </section>
  );
}
