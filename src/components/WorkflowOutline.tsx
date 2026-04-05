import { sessionSteps } from '../data/sessionSteps';
import type { SessionStepId } from '../types/session';

type WorkflowOutlineProps = {
  activeStepId: SessionStepId;
  isDarkMode: boolean;
};

const stepColors = [
  'border-orange-300 bg-orange-200/70',
  'border-orange-300 bg-orange-200/70',
  'border-orange-300 bg-orange-200/70',
  'border-orange-300 bg-orange-200/70',
  'border-orange-300 bg-orange-200/70',
  'border-orange-300 bg-orange-200/70',
];

export function WorkflowOutline({
  activeStepId,
  isDarkMode,
}: WorkflowOutlineProps) {
  void activeStepId;

  return (
    <section
      className={`rounded-[2rem] border p-5 sm:p-6 ${
        isDarkMode
          ? 'border-orange-800 bg-stone-900'
          : 'border-orange-300 bg-white'
      }`}>
      <h2
        className={`text-lg font-semibold tracking-tight ${
          isDarkMode ? 'text-stone-100' : 'text-stone-900'
        }`}>
        Workflow
      </h2>
      <p
        className={`mt-2 text-sm leading-6 ${
          isDarkMode ? 'text-stone-300' : 'text-stone-600'
        }`}>
        Six quick steps from BMP upload to final match check.
      </p>
      <ol className='mt-4 flex items-center justify-center gap-1.5 overflow-x-auto lg:flex-nowrap'>
        {sessionSteps.map((step, index) => (
          <li
            key={step.id}
            className='contents'>
            <div
              className={`inline-flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-2 ${
                isDarkMode
                  ? 'border border-orange-900/70 bg-orange-950/45'
                  : stepColors[index]
              }`}
              title={step.description}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDarkMode
                    ? 'bg-orange-200/90 text-stone-950'
                    : 'bg-white/90 text-orange-900'
                }`}>
                {index + 1}
              </span>
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-orange-100' : 'text-orange-950'
                }`}>
                {step.title}
              </span>
            </div>
            {index < sessionSteps.length - 1 ? (
              <span
                className={`shrink-0 px-0.5 text-sm font-semibold ${
                  isDarkMode ? 'text-stone-600' : 'text-stone-400'
                }`}>
                -&gt;
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
