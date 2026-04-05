import { formatStage } from '../lib/capture';
import type { CaptureSlot } from '../types/capture';

type CaptureCardProps = {
  isDarkMode: boolean;
  slot: CaptureSlot;
  canCapture: boolean;
  canEncode: boolean;
  onAttachFile: (slotId: CaptureSlot['id'], file: File | null) => void;
  onEncode: (slotId: CaptureSlot['id']) => void;
  onResetError: (slotId: CaptureSlot['id']) => void;
};

export function CaptureCard({
  isDarkMode,
  slot,
  canCapture,
  canEncode,
  onAttachFile,
  onEncode,
  onResetError,
}: CaptureCardProps) {
  const showReset = slot.stage === 'error';
  const captureLabel = slot.selectedFile ? 'Replace BMP' : 'Attach BMP';
  const encodeLabel =
    slot.isBusy && slot.stage === 'encoding_json'
      ? 'Encoding JSON...'
      : 'Encode to JSON';
  const cardDescription =
    slot.id === 'image-a'
      ? 'Reference sample for the baseline encoding.'
      : 'Candidate sample to compare against the reference.';

  function openBlobPreview(blob: Blob) {
    const previewUrl = URL.createObjectURL(blob);
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(previewUrl), 60_000);
  }

  function handleOpenBmpPreview() {
    if (!slot.selectedFile) {
      return;
    }

    openBlobPreview(slot.selectedFile);
  }

  function handleOpenJsonPreview() {
    if (!slot.fingerprintData) {
      return;
    }

    const jsonBlob = new Blob([JSON.stringify(slot.fingerprintData, null, 2)], {
      type: 'application/json',
    });
    openBlobPreview(jsonBlob);
  }

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border p-6 ${
        isDarkMode
          ? 'border-orange-800 bg-stone-950'
          : 'border-orange-300 bg-orange-50/30'
      }`}>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p
            className={`text-sm font-medium uppercase tracking-[0.16em] ${
              isDarkMode ? 'text-orange-300' : 'text-orange-700'
            }`}>
            {slot.label}
          </p>
          <h3
            className={`mt-2 text-xl font-semibold ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            {slot.id === 'image-a' ? 'Image A' : 'Image B'}
          </h3>
          <p
            className={`mt-2 text-sm leading-6 ${
              isDarkMode ? 'text-stone-300' : 'text-stone-600'
            }`}>
            {cardDescription}
          </p>
        </div>
        <span
          className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 py-1 text-center text-xs font-medium uppercase tracking-[0.14em] ${
            isDarkMode
              ? 'border-stone-700 bg-stone-800 text-stone-300'
              : 'border-stone-200 bg-white text-stone-600'
          }`}>
          {formatStage(slot.stage)}
        </span>
      </div>

      <dl
        className={`mt-6 grid flex-1 gap-4 text-sm ${
          isDarkMode ? 'text-stone-300' : 'text-stone-600'
        }`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isDarkMode ? 'bg-stone-800/90' : 'bg-white/80'
          }`}>
          <dt
            className={`font-medium ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            Attached file
          </dt>
          <dd className='mt-1'>
            {slot.selectedFile?.name ?? 'No file attached'}
          </dd>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isDarkMode ? 'bg-stone-800/90' : 'bg-white/80'
          }`}>
          <dt
            className={`font-medium ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            BMP output
          </dt>
          <dd className='mt-1'>
            {slot.bmpFileName ? (
              <button
                type='button'
                onClick={handleOpenBmpPreview}
                className={`cursor-pointer text-left underline decoration-1 underline-offset-2 ${
                  isDarkMode
                    ? 'text-orange-200 hover:text-orange-100'
                    : 'text-orange-700 hover:text-orange-800'
                }`}>
                {slot.bmpFileName}
              </button>
            ) : (
              'Not captured yet'
            )}
          </dd>
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isDarkMode ? 'bg-stone-800/90' : 'bg-white/80'
          }`}>
          <dt
            className={`font-medium ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            JSON output
          </dt>
          <dd className='mt-1'>
            {slot.jsonFileName ? (
              <button
                type='button'
                onClick={handleOpenJsonPreview}
                className={`cursor-pointer text-left underline decoration-1 underline-offset-2 ${
                  isDarkMode
                    ? 'text-orange-200 hover:text-orange-100'
                    : 'text-orange-700 hover:text-orange-800'
                }`}>
                {slot.jsonFileName}
              </button>
            ) : (
              'Not encoded yet'
            )}
          </dd>
        </div>
      </dl>

      {slot.errorMessage ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            isDarkMode
              ? 'border-rose-900/70 bg-rose-950/40 text-rose-200'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}>
          {slot.errorMessage}
        </div>
      ) : null}

      <div className='mt-6 flex flex-wrap gap-3'>
        <button
          type='button'
          onClick={() =>
            document.getElementById(`bmp-upload-${slot.id}`)?.click()
          }
          disabled={!canCapture || slot.isBusy}
          className='cursor-pointer rounded-xl border border-orange-200 bg-orange-100 px-4 py-2.5 text-sm font-medium text-orange-700 disabled:cursor-not-allowed disabled:border-orange-100 disabled:bg-orange-50 disabled:text-orange-400'>
          {captureLabel}
        </button>
        <input
          id={`bmp-upload-${slot.id}`}
          type='file'
          accept='.bmp,image/bmp'
          className='hidden'
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            onAttachFile(slot.id, file);
            event.currentTarget.value = '';
          }}
        />
        <button
          type='button'
          onClick={() => onEncode(slot.id)}
          disabled={!canEncode || slot.isBusy}
          className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed ${
            isDarkMode
              ? 'border-stone-700 bg-stone-800 text-stone-200 disabled:border-stone-800 disabled:bg-stone-900 disabled:text-stone-500'
              : 'border-stone-200 bg-white text-stone-500 disabled:border-stone-100 disabled:bg-stone-50 disabled:text-stone-400'
          }`}>
          {encodeLabel}
        </button>
        {showReset ? (
          <button
            type='button'
            onClick={() => onResetError(slot.id)}
            className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium ${
              isDarkMode
                ? 'border-rose-900/70 bg-stone-900 text-rose-200'
                : 'border-rose-200 bg-white text-rose-700'
            }`}>
            Clear Error
          </button>
        ) : null}
      </div>
    </article>
  );
}
