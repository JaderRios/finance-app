import { useMemo, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransferForm({ accounts, onCreate, submitting }) {
  const initialFrom = accounts[0]?.id ?? '';
  const initialTo = accounts[1]?.id ?? accounts[0]?.id ?? '';

  const [form, setForm] = useState({
    from_account_id: initialFrom,
    to_account_id: initialTo,
    from_amount: '',
    exchange_rate: '',
    description: '',
    date: getToday(),
  });

  const fromAccount = useMemo(
    () => accounts.find((account) => account.id === form.from_account_id),
    [accounts, form.from_account_id]
  );

  const toAccount = useMemo(
    () => accounts.find((account) => account.id === form.to_account_id),
    [accounts, form.to_account_id]
  );

  const toAmount = useMemo(() => {
    const fromAmount = Number(form.from_amount || 0);
    const rate = Number(form.exchange_rate || 0);

    if (!fromAmount) {
      return 0;
    }

    if (!fromAccount || !toAccount || fromAccount.currency === toAccount.currency) {
      return fromAmount;
    }

    if (fromAccount.currency === 'USD' && toAccount.currency === 'PEN') {
      return fromAmount * rate;
    }

    if (fromAccount.currency === 'PEN' && toAccount.currency === 'USD') {
      return rate ? fromAmount / rate : 0;
    }

    return fromAmount;
  }, [form.exchange_rate, form.from_amount, fromAccount, toAccount]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await onCreate({
      ...form,
      to_amount: toAmount,
      exchange_rate: form.exchange_rate || 1,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mover dinero</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Registra cambios entre cuentas y conserva el tipo de cambio real.
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Desde</span>
            <select
              value={form.from_account_id}
              onChange={(event) => updateField('from_account_id', event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            >
              <option value="">Selecciona cuenta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Hacia</span>
            <select
              value={form.to_account_id}
              onChange={(event) => updateField('to_account_id', event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            >
              <option value="">Selecciona cuenta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Monto origen
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.from_amount}
              onChange={(event) => updateField('from_amount', event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Tipo de cambio
            </span>
            <input
              type="number"
              min="0"
              step="0.0001"
              value={form.exchange_rate}
              onChange={(event) => updateField('exchange_rate', event.target.value)}
              placeholder="1"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Resultado
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">
            {toAmount.toFixed(2)} {toAccount?.currency || ''}
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Descripcion</span>
          <input
            type="text"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Ej. Paso 30% del pago"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Fecha</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <ArrowRightLeft size={16} />
        {submitting ? 'Guardando...' : 'Registrar transferencia'}
      </button>
    </form>
  );
}
