export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="relative overflow-hidden rounded-[26px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,246,255,0.92))] p-4 shadow-[0_18px_60px_rgba(37,99,235,0.08)] dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] sm:rounded-[30px] sm:p-5 lg:rounded-[34px] lg:p-6">
      <div className="absolute -right-12 top-0 hidden h-36 w-36 rounded-full bg-blue-100/60 blur-2xl dark:bg-sky-500/10 sm:block" />
      <div className="absolute bottom-0 left-12 hidden h-24 w-24 rounded-full bg-indigo-100/50 blur-2xl dark:bg-indigo-500/10 sm:block" />

      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {eyebrow ? (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300 sm:text-xs sm:tracking-[0.24em]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:leading-6">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="w-full lg:w-auto">{action}</div> : null}
      </div>
    </header>
  );
}
