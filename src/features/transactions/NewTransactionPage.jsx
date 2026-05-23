import PageHeader from '../../components/ui/PageHeader';
import TransactionForm from '../../components/transactions/TransactionForm';

export default function NewTransactionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Movimiento"
        title="Registrar movimiento"
        description="Guarda tus ingresos y gastos de forma clara para mantener tu control financiero al dia."
      />

      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <TransactionForm />

        <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-6 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(30,41,59,0.86))]">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Consejos rapidos</h3>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p>
              Registra cada movimiento apenas ocurra para que tu balance siempre refleje tu realidad.
            </p>
            <p>
              Usa categorias precisas para entender mejor en que se va tu dinero y de donde llega.
            </p>
            <p>
              Si te faltan opciones en el selector, puedes crear nuevas categorias desde el menu lateral.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
