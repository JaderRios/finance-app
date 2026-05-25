import TransactionForm from '../../components/transactions/TransactionForm';

export default function NewTransactionPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <TransactionForm />

        <aside className="hidden xl:block">
          <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-6 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(30,41,59,0.86))]">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Guia rapida</h3>
            <div className="mt-5 space-y-3">
              {[
                'Registra el movimiento apenas ocurra para no perder precision.',
                'Usa categorias claras para que el dashboard te ayude de verdad.',
                'Si operas entre monedas, revisa el valor de dashboard antes de guardar.',
              ].map((tip, index) => (
                <div
                  key={tip}
                  className="rounded-2xl border border-slate-100 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Tip {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
