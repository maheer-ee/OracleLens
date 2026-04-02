import { CameraStatusBanner } from '../components/CameraStatusBanner'
import { CaptureCard } from '../components/CaptureCard'
import { ComparisonPanel } from '../components/ComparisonPanel'
import { SessionSummary } from '../components/SessionSummary'
import { SystemStatusPanel } from '../components/SystemStatusPanel'
import { WorkflowOutline } from '../components/WorkflowOutline'
import { integrationConfig } from '../config/integration'
import { useOracleLensSession } from '../hooks/useOracleLensSession'
import { flirBlackFlyCamera } from '../services/flirBlackFlyCamera'
import { isSlotActionAllowed } from '../lib/sessionFlow'

export function OracleLensPage() {
  const {
    cameraConnectionState,
    cameraName,
    comparisonResult,
    comparisonState,
    sessionStatus,
    slots,
    handleCompare,
    handleConnectCamera,
    handleCapture,
    handleEncode,
    handleResetError,
    handleResetSession,
  } = useOracleLensSession()

  return (
    <main className="min-h-screen bg-transparent text-stone-900">
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <header className="rounded-[2rem] border border-orange-200/70 bg-white/85 p-8 shadow-[0_20px_80px_rgba(251,146,60,0.12)] backdrop-blur sm:p-10">
          <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700">
            Oracle Lens
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Camera capture and image comparison workflow
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 sm:text-lg">
            This frontend guides the user through capturing BMP images from a
            Flir BlackFly camera, encoding each image into JSON through the
            backend, and comparing the resulting encoded outputs.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
          <div className="space-y-6">
            <CameraStatusBanner
              connectionState={cameraConnectionState}
              cameraName={cameraName}
              integrationStatus={flirBlackFlyCamera.integrationStatus}
              transport={flirBlackFlyCamera.transport}
              notes={flirBlackFlyCamera.notes}
              onConnect={handleConnectCamera}
            />

            <div className="rounded-[2rem] border border-orange-100 bg-white/85 p-7 shadow-[0_16px_60px_rgba(251,146,60,0.08)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
                    Capture Sessions
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    The app keeps camera control, encoding, comparison, and
                    session recovery in separate layers so integration remains
                    explicit and debuggable.
                  </p>
                </div>
                <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                  Session UI
                </div>
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-2">
                {slots.map((slot) => (
                  <CaptureCard
                    key={slot.id}
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
                    actionHint={sessionStatus.flowLabel}
                    onCapture={handleCapture}
                    onEncode={handleEncode}
                    onResetError={handleResetError}
                  />
                ))}
              </div>
            </div>

            <SessionSummary slots={slots} />
            <SystemStatusPanel
              cameraConnectionState={cameraConnectionState}
              comparisonState={comparisonState}
              sessionMessage={sessionStatus.flowLabel}
              onResetSession={handleResetSession}
            />
          </div>

          <aside className="space-y-6">
            <WorkflowOutline activeStepId={sessionStatus.activeStepId} />
            <ComparisonPanel
              comparisonState={comparisonState}
              comparisonResult={comparisonResult}
              flowLabel={`${sessionStatus.flowLabel} Workflow transport: ${integrationConfig.workflowTransport}.`}
              onCompare={handleCompare}
            />
          </aside>
        </section>
      </section>
    </main>
  )
}
