import { sessionSteps } from '../data/sessionSteps'
import { isSessionStepActive } from '../lib/sessionFlow'
import type { SessionStepId } from '../types/session'

type WorkflowOutlineProps = {
  activeStepId: SessionStepId
}

export function WorkflowOutline({ activeStepId }: WorkflowOutlineProps) {
  return (
    <section className="rounded-[2rem] border border-rose-100 bg-white/85 p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
        Workflow Outline
      </h2>
      <ol className="mt-6 space-y-4">
        {sessionSteps.map((step, index) => (
          <li
            key={step.id}
            className={`flex gap-4 rounded-2xl px-4 py-4 ${
              isSessionStepActive(activeStepId, step.id)
                ? 'border border-rose-200 bg-rose-100/80'
                : 'bg-rose-50/70'
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-rose-700">
              {index + 1}
            </span>
            <span>
              <span className="block text-sm font-semibold text-stone-900">
                {step.title}
              </span>
              <span className="mt-1 block text-sm leading-6 text-stone-700">
                {step.description}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
