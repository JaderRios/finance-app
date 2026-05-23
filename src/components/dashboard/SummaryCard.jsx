export default function SummaryCard({ title, value, icon: Icon, tone = 'blue', subtitle }) {
  const tones = {
    blue: 'bg-[linear-gradient(135deg,#dbe7ff_0%,#bed2ff_100%)] dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.22),rgba(30,64,175,0.38))]',
    violet: 'bg-[linear-gradient(135deg,#ece0ff_0%,#dcc7ff_100%)] dark:bg-[linear-gradient(135deg,rgba(124,58,237,0.20),rgba(91,33,182,0.38))]',
    white: 'bg-white dark:bg-slate-900/90',
  };

  return (
    <article className={`rounded-[32px] border border-white/60 p-6 shadow-sm dark:border-slate-800 ${tones[tone]}`}>
      <div className="mb-5 flex items-center gap-3 text-slate-700 dark:text-slate-200">
        <div className="grid size-11 place-items-center rounded-full bg-white/65 dark:bg-slate-800/70">
          <Icon size={18} />
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <div className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
      {subtitle ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </article>
  );
}
