import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import TransferForm from '../../components/transfers/TransferForm';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { fetchAccounts } from '../../services/accountService';
import { createTransfer, fetchTransfers } from '../../services/transferService';

export default function TransfersPage() {
  const { notifyTransactionsChanged, version } = useTransactionEvents();
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [accountsData, transfersData] = await Promise.all([fetchAccounts(), fetchTransfers()]);
        if (!ignore) {
          setAccounts(accountsData);
          setTransfers(transfersData);
        }
      } catch {
        if (!ignore) {
          setFeedback({ type: 'error', message: 'No pudimos cargar tus transferencias.' });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [version]);

  async function handleCreate(form) {
    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });
      await createTransfer(form);
      notifyTransactionsChanged();
      setFeedback({ type: 'success', message: 'Transferencia registrada correctamente.' });
    } catch {
      setFeedback({ type: 'error', message: 'No pudimos guardar la transferencia.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        eyebrow="Transferencias"
        title="Mover entre dolares y soles"
        description="Registra el dinero que pasas de una cuenta a otra y conserva el tipo de cambio de ese momento."
      />

      {feedback.message ? (
        <div
          className={[
            'rounded-[28px] p-5 text-sm',
            feedback.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300',
          ].join(' ')}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[460px_1fr]">
        <TransferForm accounts={accounts} onCreate={handleCreate} submitting={submitting} />

        <section className="rounded-[26px] border border-white/60 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:rounded-[30px] sm:p-5 lg:rounded-[32px] lg:p-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">Ultimas transferencias</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Te sirve para revisar cuando moviste dinero entre monedas.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              Cargando transferencias...
            </div>
          ) : null}

          {!loading ? (
            <div className="space-y-3">
              {transfers.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  Aun no registras transferencias.
                </div>
              ) : null}

              {transfers.map((transfer) => (
                <article
                  key={transfer.id}
                  className="rounded-2xl border border-slate-100 px-4 py-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {transfer.description || 'Transferencia entre cuentas'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {transfer.date} · TC {Number(transfer.exchange_rate).toFixed(4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {Number(transfer.from_amount).toFixed(2)} → {Number(transfer.to_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
