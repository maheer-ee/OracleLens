import { formatTimestamp } from '../lib/format'
import { formatStage } from '../lib/capture'
import type { CaptureSlot } from '../types/capture'

type CaptureCardProps = {
  slot: CaptureSlot
  canCapture: boolean
  canEncode: boolean
  actionHint: string
  onCapture: (slotId: CaptureSlot['id']) => void
  onEncode: (slotId: CaptureSlot['id']) => void
  onResetError: (slotId: CaptureSlot['id']) => void
}

export function CaptureCard({
  slot,
  canCapture,
  canEncode,
  actionHint,
  onCapture,
  onEncode,
  onResetError,
}: CaptureCardProps) {
  const showReset = slot.stage === 'error'
  const captureLabel = slot.isBusy && slot.stage === 'capturing_bmp'
    ? 'Capturing BMP...'
    : 'Capture BMP'
  const encodeLabel = slot.isBusy && slot.stage === 'encoding_json'
    ? 'Encoding JSON...'
    : 'Encode to JSON'

  return (
    <article className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-b from-white to-orange-50/40 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-orange-700">
            {slot.label}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">
            {slot.id === 'image-a' ? 'Image A' : 'Image B'}
          </h3>
        </div>
        <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-stone-600">
          {formatStage(slot.stage)}
        </span>
      </div>

      <dl className="mt-6 space-y-4 text-sm text-stone-600">
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <dt className="font-medium text-stone-900">Status</dt>
          <dd className="mt-1">{slot.statusMessage}</dd>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <dt className="font-medium text-stone-900">Attempts</dt>
          <dd className="mt-1">{slot.attemptCount}</dd>
        </div>
        <div className="rounded-2xl bg-orange-50/80 px-4 py-3">
          <dt className="font-medium text-stone-900">Next action</dt>
          <dd className="mt-1">{actionHint}</dd>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <dt className="font-medium text-stone-900">BMP output</dt>
          <dd className="mt-1">{slot.bmpFileName ?? 'Not captured yet'}</dd>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <dt className="font-medium text-stone-900">BMP timestamp</dt>
          <dd className="mt-1">{formatTimestamp(slot.capturedAt)}</dd>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <dt className="font-medium text-stone-900">JSON output</dt>
          <dd className="mt-1">{slot.jsonFileName ?? 'Not encoded yet'}</dd>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <dt className="font-medium text-stone-900">JSON timestamp</dt>
          <dd className="mt-1">{formatTimestamp(slot.encodedAt)}</dd>
        </div>
      </dl>

      {slot.errorMessage ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {slot.errorMessage}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onCapture(slot.id)}
          disabled={!canCapture || slot.isBusy}
          className="rounded-xl border border-orange-200 bg-orange-100 px-4 py-2.5 text-sm font-medium text-orange-700 disabled:cursor-not-allowed disabled:border-orange-100 disabled:bg-orange-50 disabled:text-orange-400"
        >
          {captureLabel}
        </button>
        <button
          type="button"
          onClick={() => onEncode(slot.id)}
          disabled={!canEncode || slot.isBusy}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-500 disabled:cursor-not-allowed disabled:border-stone-100 disabled:bg-stone-50 disabled:text-stone-400"
        >
          {encodeLabel}
        </button>
        {showReset ? (
          <button
            type="button"
            onClick={() => onResetError(slot.id)}
            className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-700"
          >
            Clear Error
          </button>
        ) : null}
      </div>
    </article>
  )
}
