export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5">
          <span className="text-2xl font-semibold uppercase tracking-[0.3em]">
            my-rights
          </span>
          <span className="text-sm text-white/70">Know your protections</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <section className="w-full max-w-2xl rounded-3xl bg-white p-10 text-slate-900 shadow-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Understand your rights in any situation
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Describe what is happening, and we will generate a plain-language
            summary of the protections that may apply.
          </p>
          <form className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
              placeholder="e.g., I was denied accommodation at work"
              type="text"
            />
            <button
              type="button"
              className="rounded-2xl bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Generate
            </button>
          </form>
          <p className="mt-5 text-xs text-slate-500">
            my-rights does not store your input. Always consult a legal
            professional for official guidance.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-1 px-6 py-4 text-sm text-white/70 sm:flex-row sm:justify-between">
          <span>© {year} my-rights</span>
          <span>Your everyday legal companion</span>
        </div>
      </footer>
    </div>
  );
}
