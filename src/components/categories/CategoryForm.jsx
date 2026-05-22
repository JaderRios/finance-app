import { useState } from 'react';
import { Plus } from 'lucide-react';

const initialForm = {
  name: '',
  type: 'expense',
  icon: '',
};

export default function CategoryForm({ onCreate, submitting }) {
  const [form, setForm] = useState(initialForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreate(form);
    setForm((current) => ({
      ...initialForm,
      type: current.type,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nueva categoria</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Personaliza la forma en que organizas tu dinero.
      </p>

      <div className="mt-6 inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { label: 'Gasto', value: 'expense' },
          { label: 'Ingreso', value: 'income' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => updateField('type', item.value)}
            className={[
              'min-w-28 rounded-full px-5 py-2 text-sm font-semibold transition',
              form.type === item.value
                ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-sky-200'
                : 'text-slate-500 dark:text-slate-400',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Nombre
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ej. Suscripciones"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Icono
          </span>
          <input
            type="text"
            value={form.icon}
            onChange={(event) => updateField('icon', event.target.value)}
            placeholder="Opcional"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Plus size={16} />
        {submitting ? 'Guardando...' : 'Crear categoria'}
      </button>
    </form>
  );
}
