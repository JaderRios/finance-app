export default function SummaryCard({ title, value, icon: Icon, tone = 'blue', subtitle }) {
  const tones = {
    blue: {
      card: 'bg-[linear-gradient(135deg,#dbe7ff_0%,#bed2ff_100%)] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.22),rgba(30,64,175,0.38))]',
      icon: 'bg-white/70 text-blue-700 dark:bg-slate-800/75 dark:text-sky-200',
    },
    violet: {
      card: 'bg-[linear-gradient(135deg,#ece0ff_0%,#dcc7ff_100%)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.20),rgba(91,33,182,0.38))]',
      icon: 'bg-white/70 text-violet-700 dark:bg-slate-800/75 dark:text-violet-200',
    },
    emerald: {
      card: 'bg-[linear-gradient(135deg,#dcfce7_0%,#bbf7d0_100%)] dark:bg-[linear-gradient(135deg,rgba(22,163,74,0.18),rgba(21,128,61,0.34))]',
      icon: 'bg-white/70 text-emerald-700 dark:bg-slate-800/75 dark:text-emerald-200',
    },
    amber: {
      card: 'bg-[linear-gradient(135deg,#fef3c7_0%,#fde68a_100%)] dark:bg-[linear-gradient(135deg,rgba(217,119,6,0.20),rgba(180,83,9,0.34))]',
      icon: 'bg-white/70 text-amber-700 dark:bg-slate-800/75 dark:text-amber-200',
    },
    rose: {
      card: 'bg-[linear-gradient(135deg,#ffe4e6_0%,#fecdd3_100%)] dark:bg-[linear-gradient(135deg,rgba(225,29,72,0.16),rgba(190,24,93,0.32))]',
      icon: 'bg-white/70 text-rose-700 dark:bg-slate-800/75 dark:text-rose-200',
    },
    white: {
      card: 'bg-white dark:bg-slate-900/90',
      icon: 'bg-slate-100 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200',
    },
  };
  const activeTone = tones[tone] ?? tones.white;

  return (
    <article className={`rounded-[26px] border border-white/60 p-4 shadow-sm dark:border-slate-800 sm:rounded-[28px] sm:p-5 lg:rounded-[32px] lg:p-6 ${activeTone.card}`}>
      <div className="mb-4 flex items-center gap-3 text-slate-700 dark:text-slate-200 lg:mb-5">
        <div className={`grid size-10 place-items-center rounded-full lg:size-11 ${activeTone.icon}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium sm:text-base">{title}</span>
      </div>
      <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{value}</div>
      {subtitle ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:mt-3">{subtitle}</p> : null}
    </article>
  );
}
