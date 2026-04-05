import type { CameraConnectionState, ComparisonState } from '../types/capture';

type SystemStatusPanelProps = {
  cameraConnectionState: CameraConnectionState;
  comparisonState: ComparisonState;
  isDarkMode: boolean;
  sessionMessage: string;
  onResetSession: () => void;
};

export function SystemStatusPanel({
  cameraConnectionState,
  comparisonState,
  isDarkMode,
  sessionMessage,
  onResetSession,
}: SystemStatusPanelProps) {
  return (
    <section
      className={`rounded-4xl border p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8 ${
        isDarkMode
          ? 'border-orange-900/70 bg-stone-900/85 shadow-[0_16px_60px_rgba(0,0,0,0.28)]'
          : 'border-orange-100 bg-white/85'
      }`}>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h2
            className={`text-2xl font-semibold tracking-tight ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            System Status
          </h2>
          <p
            className={`mt-2 text-sm leading-6 ${
              isDarkMode ? 'text-stone-300' : 'text-stone-600'
            }`}>
            Guard rails for retries, failure handling, and session reset.
          </p>
        </div>
        <button
          type='button'
          onClick={onResetSession}
          className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium ${
            isDarkMode
              ? 'border-stone-700 bg-stone-800 text-stone-100'
              : 'border-stone-200 bg-white text-stone-700'
          }`}>
          Reset Session
        </button>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isDarkMode ? 'bg-stone-800' : 'bg-orange-50/70'
          }`}>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.14em] ${
              isDarkMode ? 'text-stone-400' : 'text-stone-500'
            }`}>
            Camera State
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            {cameraConnectionState}
          </p>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isDarkMode ? 'bg-stone-800' : 'bg-orange-50/70'
          }`}>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.14em] ${
              isDarkMode ? 'text-stone-400' : 'text-stone-500'
            }`}>
            Comparison State
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            {comparisonState}
          </p>
        </div>
      </div>

      <p
        className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${
          isDarkMode
            ? 'bg-stone-800 text-stone-200'
            : 'bg-white/80 text-stone-700'
        }`}>
        {sessionMessage}
      </p>
    </section>
  );
}
