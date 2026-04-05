import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { CaptureCard } from '../components/CaptureCard';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { SessionSummary } from '../components/SessionSummary';
import { WorkflowOutline } from '../components/WorkflowOutline';
import { integrationConfig } from '../config/integration';
import { useOracleLensSession } from '../hooks/useOracleLensSession';
import { isSlotActionAllowed } from '../lib/sessionFlow';

export function OracleLensPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const {
    comparisonResult,
    comparisonState,
    sessionStatus,
    slots,
    handleCompare,
    handleAttachFile,
    handleEncode,
    handleResetError,
    handleResetSession,
  } = useOracleLensSession();

  return (
    <main
      className={`min-h-screen ${
        isDarkMode
          ? 'dark bg-stone-950 text-stone-100'
          : 'bg-orange-50/40 text-stone-900'
      }`}>
      <section className='mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16'>
        <header className='px-1 py-3'>
          <div className='flex items-center justify-between gap-4'>
            <h1
              className={`max-w-3xl text-5xl tracking-[-0.04em] sm:text-6xl ${
                isDarkMode ? 'text-orange-100' : 'text-orange-950'
              }`}>
              <span
                style={{ fontFamily: '"Fraunces", "Times New Roman", serif' }}>
                Oracle Lens
              </span>
            </h1>
            <button
              type='button'
              onClick={() => setIsDarkMode((current) => !current)}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className={`inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[999px] border text-sm font-medium transition ${
                isDarkMode
                  ? 'border-stone-700 bg-stone-950 text-stone-100 hover:bg-stone-900'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}>
              {isDarkMode ? (
                <Sun
                  size={18}
                  strokeWidth={2}
                />
              ) : (
                <Moon
                  size={18}
                  strokeWidth={2}
                />
              )}
            </button>
          </div>
          <p
            className={`mt-5 max-w-3xl text-base leading-7 sm:text-lg ${
              isDarkMode ? 'text-stone-300' : 'text-stone-600'
            }`}>
            Capture two BMP images, turn them into encoded fingerprints, and
            compare the outputs to check for a match.
          </p>
        </header>

        <div className='mt-8'>
          <WorkflowOutline
            activeStepId={sessionStatus.activeStepId}
            isDarkMode={isDarkMode}
          />
        </div>

        <section className='mt-8 space-y-6'>
          <div
            className={`rounded-4xl border p-7 sm:p-8 ${
              isDarkMode
                ? 'border-orange-800 bg-stone-900'
                : 'border-orange-300 bg-white'
            }`}>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div>
                <h2
                  className={`text-2xl font-semibold tracking-tight ${
                    isDarkMode ? 'text-stone-100' : 'text-stone-900'
                  }`}>
                  Capture Sessions
                </h2>
                <p
                  className={`mt-2 max-w-3xl text-sm leading-6 ${
                    isDarkMode ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                  Add two BMP samples, encode them, and move straight to
                  comparison.
                </p>
              </div>
              <button
                type='button'
                onClick={handleResetSession}
                className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 py-1 text-center text-sm font-medium transition ${
                  isDarkMode
                    ? 'cursor-pointer border-orange-800 bg-orange-950/70 text-orange-200 hover:bg-orange-950'
                    : 'cursor-pointer border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}>
                Reset Session
              </button>
            </div>

            <div className='mt-8 grid gap-5 xl:grid-cols-2 xl:auto-rows-fr'>
              {slots.map((slot) => (
                <CaptureCard
                  key={slot.id}
                  isDarkMode={isDarkMode}
                  slot={slot}
                  canCapture={isSlotActionAllowed(
                    sessionStatus,
                    slot.id,
                    'capture',
                  )}
                  canEncode={isSlotActionAllowed(
                    sessionStatus,
                    slot.id,
                    'encode',
                  )}
                  onAttachFile={handleAttachFile}
                  onEncode={handleEncode}
                  onResetError={handleResetError}
                />
              ))}
            </div>
          </div>

          <div className='grid gap-6 lg:grid-cols-2'>
            <ComparisonPanel
              comparisonState={comparisonState}
              comparisonResult={comparisonResult}
              flowLabel={`${sessionStatus.flowLabel} Workflow transport: ${integrationConfig.workflowTransport}.`}
              isDarkMode={isDarkMode}
              onCompare={handleCompare}
            />
            <SessionSummary
              isDarkMode={isDarkMode}
              slots={slots}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
