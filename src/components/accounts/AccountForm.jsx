import { useState } from 'react';
import { Plus } from 'lucide-react';

const initialForm = {
  name: '',
  currency: 'PEN',
  type: 'bank',
  initial_balance: '',
};

export default function AccountForm({ onCreate, submitting }) {
  const [form, setForm] = useState(initialForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreate(form);
    setForm(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nueva cuenta</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Separa tus saldos en soles y dolares para llevar mejor control.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Nombre</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ej. Cuenta Soles"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Moneda</span>
            <select
              value={form.currency}
              onChange={(event) => updateField('currency', event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="PEN">PEN</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Tipo</span>
            <select
              value={form.type}
              onChange={(event) => updateField('type', event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="bank">Banco</option>
              <option value="cash">Efectivo</option>
              <option value="wallet">Billetera</option>
              <option value="savings">Ahorro</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Saldo inicial</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.initial_balance}
            onChange={(event) => updateField('initial_balance', event.target.value)}
            placeholder="0.00"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Plus size={16} />
        {submitting ? 'Guardando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
