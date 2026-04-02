import { formatTimestamp } from '../lib/format'
import type { CaptureSlot } from '../types/capture'

type SessionSummaryProps = {
  slots: CaptureSlot[]
}

function countCompletedItems(slots: CaptureSlot[]) {
  return slots.reduce(
    (count, slot) => count + (slot.jsonFileName ? 1 : 0),
    0,
  )
}

export function SessionSummary({ slots }: SessionSummaryProps) {
  const completedItems = countCompletedItems(slots)

  return (
    <section className="rounded-[2rem] border border-orange-100 bg-white/85 p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Session Summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Snapshot of the current capture and encoding outputs.
          </p>
        </div>
        <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
          {completedItems} / {slots.length} encoded
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {slots.map((slot) => (
          <article
            key={slot.id}
            className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-stone-900">
                {slot.label}
              </h3>
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                {slot.id}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-4 py-3">
                <dt className="font-medium text-stone-900">BMP file</dt>
                <dd className="mt-1">{slot.bmpFileName ?? 'Pending'}</dd>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <dt className="font-medium text-stone-900">JSON file</dt>
                <dd className="mt-1">{slot.jsonFileName ?? 'Pending'}</dd>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <dt className="font-medium text-stone-900">Captured at</dt>
                <dd className="mt-1">{formatTimestamp(slot.capturedAt)}</dd>
              </div>
              <div className="rounded-xl bg-white px-4 py-3">
                <dt className="font-medium text-stone-900">Encoded at</dt>
                <dd className="mt-1">{formatTimestamp(slot.encodedAt)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}
