import type { CameraConnectionState } from '../types/capture';

type CameraStatusBannerProps = {
  connectionState: CameraConnectionState;
  cameraName: string | null;
  integrationStatus: string;
  isDarkMode: boolean;
  transport: string;
  notes: string;
  connectDisabled: boolean;
  onConnect: () => void;
};

const connectionLabel: Record<CameraConnectionState, string> = {
  disconnected: 'Camera disconnected',
  connecting: 'Connecting to Flir BlackFly',
  connected: 'Camera connected',
  error: 'Camera connection error',
};

const connectionMessage: Record<CameraConnectionState, string> = {
  disconnected:
    'Camera connection is disabled for testing. Attach BMP files manually to continue.',
  connecting:
    'This is a placeholder connection step for the upcoming camera integration.',
  connected:
    'The UI is ready to allow BMP capture actions for both image slots.',
  error:
    'The camera did not connect. Retry the UI flow before wiring real hardware logic.',
};

export function CameraStatusBanner({
  connectionState,
  cameraName,
  integrationStatus,
  isDarkMode,
  transport,
  notes,
  connectDisabled,
  onConnect,
}: CameraStatusBannerProps) {
  const isBusy = connectionState === 'connecting';
  const isConnected = connectionState === 'connected';
  const buttonDisabled = connectDisabled || isBusy || isConnected;

  return (
    <section
      className={`rounded-4xl border p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8 ${
        isDarkMode
          ? 'border-orange-900/70 bg-stone-900/85 shadow-[0_16px_60px_rgba(0,0,0,0.28)]'
          : 'border-orange-100 bg-white/85'
      }`}>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h2
            className={`text-2xl font-semibold tracking-tight ${
              isDarkMode ? 'text-stone-100' : 'text-stone-900'
            }`}>
            Camera Session
          </h2>
          <p
            className={`mt-3 text-sm leading-6 ${
              isDarkMode ? 'text-stone-300' : 'text-stone-600'
            }`}>
            {connectionMessage[connectionState]}
          </p>
          {cameraName ? (
            <p
              className={`mt-2 text-sm font-medium ${
                isDarkMode ? 'text-stone-200' : 'text-stone-700'
              }`}>
              Active camera: {cameraName}
            </p>
          ) : null}
          <div
            className={`mt-4 grid gap-3 text-sm sm:grid-cols-2 ${
              isDarkMode ? 'text-stone-200' : 'text-stone-700'
            }`}>
            <div
              className={`rounded-2xl px-4 py-3 ${
                isDarkMode ? 'bg-stone-800' : 'bg-orange-50/70'
              }`}>
              <p
                className={`font-medium ${
                  isDarkMode ? 'text-stone-100' : 'text-stone-900'
                }`}>
                Integration status
              </p>
              <p className='mt-1'>{integrationStatus}</p>
            </div>
            <div
              className={`rounded-2xl px-4 py-3 ${
                isDarkMode ? 'bg-stone-800' : 'bg-orange-50/70'
              }`}>
              <p
                className={`font-medium ${
                  isDarkMode ? 'text-stone-100' : 'text-stone-900'
                }`}>
                Transport
              </p>
              <p className='mt-1'>{transport}</p>
            </div>
          </div>
          <p
            className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-6 ${
              isDarkMode
                ? 'bg-stone-800 text-stone-300'
                : 'bg-white/80 text-stone-600'
            }`}>
            {notes}
          </p>
        </div>
        <span
          className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 py-1 text-center text-sm font-medium ${
            isDarkMode
              ? 'border-orange-800 bg-orange-950/70 text-orange-200'
              : 'border-orange-200 bg-orange-50 text-orange-700'
          }`}>
          {connectionLabel[connectionState]}
        </span>
      </div>

      <div className='mt-6 flex flex-wrap gap-3'>
        <button
          type='button'
          onClick={onConnect}
          disabled={buttonDisabled}
          className='cursor-pointer rounded-xl border border-orange-200 bg-orange-100 px-4 py-2.5 text-sm font-medium text-orange-700 disabled:cursor-not-allowed disabled:border-orange-100 disabled:bg-orange-50 disabled:text-orange-400'>
          {connectDisabled
            ? 'Camera Disabled'
            : isConnected
              ? 'Camera Ready'
              : isBusy
                ? 'Connecting...'
                : 'Connect Camera'}
        </button>
      </div>
    </section>
  );
}
