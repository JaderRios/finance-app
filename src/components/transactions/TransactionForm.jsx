import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { fetchAccounts } from '../../services/accountService';
import { fetchCategories } from '../../services/categoryService';
import { fetchProfile } from '../../services/profileService';
import { createTransaction } from '../../services/transactionService';

const initialState = {
  type: 'expense',
  account_id: '',
  amount: '',
  category_id: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  exchange_rate: '',
};

export default function TransactionForm() {
  const { notifyTransactionsChanged } = useTransactionEvents();
  const [form, setForm] = useState(initialState);
  const [accounts, setAccounts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === form.account_id),
    [accounts, form.account_id]
  );

  const baseCurrency = profile?.currency || 'PEN';
  const shouldConvert = selectedAccount && selectedAccount.currency !== baseCurrency;
  const amountBase = useMemo(() => {
    const amount = Number(form.amount || 0);
    const exchangeRate = Number(form.exchange_rate || 0);

    if (!selectedAccount) {
      return 0;
    }

    if (!shouldConvert) {
      return amount;
    }

    if (selectedAccount.currency === 'USD' && baseCurrency === 'PEN') {
      return amount * exchangeRate;
    }

    if (selectedAccount.currency === 'PEN' && baseCurrency === 'USD') {
      return exchangeRate ? amount / exchangeRate : 0;
    }

    return amount;
  }, [baseCurrency, form.amount, form.exchange_rate, selectedAccount, shouldConvert]);

  useEffect(() => {
    let ignore = false;

    async function bootstrap() {
      try {
        const [accountsData, profileData] = await Promise.all([fetchAccounts(), fetchProfile()]);

        if (!ignore) {
          setAccounts(accountsData);
          setProfile(profileData);
          setForm((current) => ({
            ...current,
            account_id: current.account_id || accountsData[0]?.id || '',
          }));
        }
      } catch (error) {
        if (!ignore) {
          setFeedback({ type: 'error', message: error.message });
        }
      }
    }

    bootstrap();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function syncCategories() {
      try {
        setLoadingCategories(true);
        const data = await fetchCategories(form.type);

        if (ignore) {
          return;
        }

        setCategories(data);
        setForm((current) => ({
          ...current,
          category_id: data[0]?.id ?? '',
        }));
      } catch (error) {
        if (ignore) {
          return;
        }

        setFeedback({ type: 'error', message: error.message });
        setCategories([]);
      } finally {
        if (!ignore) {
          setLoadingCategories(false);
        }
      }
    }

    syncCategories();

    return () => {
      ignore = true;
    };
  }, [form.type]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFeedback({ type: '', message: '' });

      await createTransaction({
        ...form,
        currency: selectedAccount?.currency,
        amount_base: amountBase,
        base_currency: baseCurrency,
        exchange_rate: shouldConvert ? form.exchange_rate : 1,
      });

      notifyTransactionsChanged();
      setFeedback({ type: 'success', message: 'Movimiento guardado correctamente.' });
      setForm((current) => ({
        ...initialState,
        type: current.type,
        account_id: current.account_id,
        category_id: categories[0]?.id ?? '',
      }));
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90" onSubmit={handleSubmit}>
      <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Registrar movimiento</h3>

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
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Cuenta</span>
          <select
            value={form.account_id}
            onChange={(event) => updateField('account_id', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          >
            <option value="">Selecciona una cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Monto</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) => updateField('amount', event.target.value)}
            placeholder="0.00"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-3xl font-black tracking-tight outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>

        {shouldConvert ? (
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
              placeholder="Ej. 3.75"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </label>
        ) : null}

        <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Resumen</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {selectedAccount?.currency || '--'} {form.amount || '0.00'}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Valor para el dashboard: {baseCurrency} {amountBase.toFixed(2)}
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Categoria</span>
          <select
            value={form.category_id}
            onChange={(event) => updateField('category_id', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
            disabled={loadingCategories || categories.length === 0}
          >
            <option value="">
              {loadingCategories ? 'Cargando categorias...' : 'Selecciona una categoria'}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Descripcion</span>
          <input
            type="text"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Ej. Pago de internet"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Fecha</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>
      </div>

      {feedback.message ? (
        <div
          className={[
            'mt-5 rounded-2xl p-4 text-sm',
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
          ].join(' ')}
        >
          {feedback.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Save size={16} />
        {submitting ? 'Guardando...' : 'Guardar movimiento'}
      </button>
    </form>
  );
}
