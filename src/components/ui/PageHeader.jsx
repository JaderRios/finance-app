export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="relative overflow-hidden rounded-[24px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,246,255,0.92))] p-4 shadow-[0_14px_45px_rgba(37,99,235,0.08)] dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] sm:rounded-[28px] sm:p-4 lg:rounded-[30px] lg:p-5">
      <div className="absolute -right-10 top-0 hidden h-28 w-28 rounded-full bg-blue-100/55 blur-2xl dark:bg-sky-500/10 sm:block" />
      <div className="absolute bottom-0 left-10 hidden h-20 w-20 rounded-full bg-indigo-100/45 blur-2xl dark:bg-indigo-500/10 sm:block" />

      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {eyebrow ? (
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300 sm:text-[11px] sm:tracking-[0.24em]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[1.85rem] font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-[2.15rem] lg:text-[2.35rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:mt-2 sm:leading-6 2xl:max-w-4xl">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="w-full lg:w-auto lg:self-start">{action}</div> : null}
      </div>
    </header>
  );
}
