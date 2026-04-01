function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 lg:px-12">
        <span className="mb-6 inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
          Vite + React + TypeScript + Tailwind CSS
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Frontend foundation for Senior Design.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          The project is scaffolded and Tailwind is wired into Vite. Start
          building components in <code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">src/App.tsx</code>{' '}
          and styles in <code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">src/index.css</code>.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            className="rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
            href="https://vite.dev/guide/"
            target="_blank"
            rel="noreferrer"
          >
            Vite docs
          </a>
          <a
            className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noreferrer"
          >
            Tailwind docs
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
