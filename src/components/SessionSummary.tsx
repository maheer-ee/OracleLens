import type { CaptureSlot } from '../types/capture'

type SessionSummaryProps = {
  isDarkMode: boolean
  slots: CaptureSlot[]
}

function countCompletedItems(slots: CaptureSlot[]) {
  return slots.reduce(
    (count, slot) => count + (slot.jsonFileName ? 1 : 0),
    0,
  )
}

function formatTargetSize(fingerprintData: CaptureSlot['fingerprintData']) {
  const targetSize = fingerprintData?.target_size

  if (!Array.isArray(targetSize) || targetSize.length !== 2) {
    return 'Pending'
  }

  const [height, width] = targetSize
  return `${width} x ${height}`
}

function formatHashPreview(fingerprintData: CaptureSlot['fingerprintData']) {
  const hash = fingerprintData?.hash_sha256

  if (typeof hash !== 'string' || hash.length < 12) {
    return 'Pending'
  }

  return `${hash.slice(0, 12)}...`
}

export function SessionSummary({ isDarkMode, slots }: SessionSummaryProps) {
  const completedItems = countCompletedItems(slots)

  return (
    <section
      className={`rounded-[2rem] border p-7 sm:p-8 ${
        isDarkMode
          ? 'border-orange-800 bg-stone-900'
          : 'border-orange-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            className={`text-2xl font-semibold tracking-tight ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}
          >
            Session Summary
          </h2>
          <p
            className={`mt-2 text-sm leading-6 ${
              isDarkMode ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Quick view of what each slot has already produced.
          </p>
        </div>
        <div
          className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 py-1 text-center text-sm font-medium ${
            isDarkMode
              ? 'border-orange-800 bg-orange-950/70 text-orange-200'
              : 'border-orange-200 bg-orange-50 text-orange-700'
          }`}
        >
          {completedItems} / {slots.length} encoded
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {slots.map((slot) => (
          <article
            key={slot.id}
            className={`rounded-2xl border p-5 ${
              isDarkMode
                ? 'border-orange-800/70 bg-stone-950'
                : 'border-orange-200 bg-orange-50/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3
                className={`text-base font-semibold ${
                  isDarkMode ? 'text-stone-100' : 'text-stone-900'
                }`}
              >
                {slot.label}
              </h3>
              <span
                className={`text-xs font-medium uppercase tracking-[0.14em] ${
                  isDarkMode ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                {slot.id}
              </span>
            </div>

            <dl
              className={`mt-4 grid gap-3 text-sm sm:grid-cols-2 ${
                isDarkMode ? 'text-stone-300' : 'text-stone-700'
              }`}
            >
              <div
                className={`rounded-xl px-4 py-3 ${
                  isDarkMode ? 'bg-stone-800' : 'bg-white'
                }`}
              >
                <dt
                  className={`font-medium ${
                    isDarkMode ? 'text-stone-100' : 'text-stone-900'
                  }`}
                >
                  BMP file
                </dt>
                <dd className="mt-1">{slot.bmpFileName ?? 'Pending'}</dd>
              </div>
              <div
                className={`rounded-xl px-4 py-3 ${
                  isDarkMode ? 'bg-stone-800' : 'bg-white'
                }`}
              >
                <dt
                  className={`font-medium ${
                    isDarkMode ? 'text-stone-100' : 'text-stone-900'
                  }`}
                >
                  JSON file
                </dt>
                <dd className="mt-1">{slot.jsonFileName ?? 'Pending'}</dd>
              </div>
              <div
                className={`rounded-xl px-4 py-3 ${
                  isDarkMode ? 'bg-stone-800' : 'bg-white'
                }`}
              >
                <dt
                  className={`font-medium ${
                    isDarkMode ? 'text-stone-100' : 'text-stone-900'
                  }`}
                >
                  JSON size
                </dt>
                <dd className="mt-1">{formatTargetSize(slot.fingerprintData)}</dd>
              </div>
              <div
                className={`rounded-xl px-4 py-3 ${
                  isDarkMode ? 'bg-stone-800' : 'bg-white'
                }`}
              >
                <dt
                  className={`font-medium ${
                    isDarkMode ? 'text-stone-100' : 'text-stone-900'
                  }`}
                >
                  Hash preview
                </dt>
                <dd className="mt-1">{formatHashPreview(slot.fingerprintData)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}
