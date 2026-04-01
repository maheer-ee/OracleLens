function App() {
  return (
    <main className="min-h-screen bg-transparent text-stone-900">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24 sm:px-10 lg:px-12">
        <div className="w-full rounded-[2rem] border border-orange-200/70 bg-white/85 p-8 shadow-[0_20px_80px_rgba(251,146,60,0.12)] backdrop-blur sm:p-12">
          <div className="mb-6 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700">
            Light theme with peach accents
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Oracle Lens
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            This project is ready for application code. Replace this placeholder
            layout with your actual pages and components.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
                Direction
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Soft neutrals, bright surfaces, and restrained peach highlights.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">
                Baseline
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                A clean starting point for your actual pages, flows, and components.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
