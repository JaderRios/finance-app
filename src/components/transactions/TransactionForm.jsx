import { useEffect, useMemo, useState } from 'react';
import { PencilLine, Save, X } from 'lucide-react';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { fetchAccounts } from '../../services/accountService';
import { fetchCategories } from '../../services/categoryService';
import { createTransaction, updateTransaction } from '../../services/transactionService';

const DASHBOARD_CURRENCY = 'PEN';

function buildInitialState(transaction) {
  if (!transaction) {
    return {
      type: 'expense',
      account_id: '',
      amount: '',
      category_id: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      exchange_rate: '',
    };
  }

  return {
    type: transaction.type ?? 'expense',
    account_id: transaction.account_id ?? '',
    amount: transaction.amount != null ? String(transaction.amount) : '',
    category_id: transaction.category_id ?? '',
    description: transaction.description ?? '',
    date: transaction.date ?? new Date().toISOString().slice(0, 10),
    exchange_rate: transaction.exchange_rate != null ? String(transaction.exchange_rate) : '',
  };
}

export default function TransactionForm({
  transaction = null,
  mode = 'create',
  title,
  description,
  submitLabel,
  onCancel,
  onSaved,
}) {
  const isEditing = mode === 'edit';
  const { notifyTransactionsChanged } = useTransactionEvents();
  const [form, setForm] = useState(() => buildInitialState(transaction));
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === form.account_id),
    [accounts, form.account_id]
  );

  const baseCurrency = DASHBOARD_CURRENCY;
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
        const accountsData = await fetchAccounts();

        if (!ignore) {
          setAccounts(accountsData);
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
        setForm((current) => {
          const hasCurrentCategory = data.some((category) => category.id === current.category_id);

          return {
            ...current,
            category_id: hasCurrentCategory ? current.category_id : data[0]?.id ?? '',
          };
        });
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

      const payload = {
        ...form,
        currency: selectedAccount?.currency,
        amount_base: amountBase,
        base_currency: baseCurrency,
        exchange_rate: shouldConvert ? form.exchange_rate : 1,
      };

      if (isEditing) {
        await updateTransaction(transaction.id, payload);
      } else {
        await createTransaction(payload);
      }

      notifyTransactionsChanged();
      setFeedback({
        type: 'success',
        message: isEditing ? 'Movimiento actualizado correctamente.' : 'Movimiento guardado correctamente.',
      });

      if (isEditing) {
        onSaved?.();
        return;
      }

      setForm((current) => ({
        ...buildInitialState(),
        type: current.type,
        account_id: current.account_id,
        category_id: categories[0]?.id ?? '',
      }));
      onSaved?.();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  const resolvedTitle = title || (isEditing ? 'Editar movimiento' : 'Registrar movimiento');
  const resolvedDescription =
    description ||
    (isEditing
      ? 'Corrige fecha, cuenta, categoria, monto o descripcion sin volver a registrar el movimiento.'
      : 'Guarda tus ingresos y gastos de forma clara para mantener tu control financiero al dia.');
  const resolvedSubmitLabel = submitLabel || (isEditing ? 'Guardar cambios' : 'Guardar movimiento');

  return (
    <form
      className="rounded-[32px] border border-white/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {resolvedTitle}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            {resolvedDescription}
          </p>
        </div>

        {isEditing && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <X size={16} />
            Cerrar
          </button>
        ) : null}
      </div>

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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="block lg:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Cuenta
          </span>
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
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Monto
          </span>
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

        <div className="rounded-[28px] border border-slate-100 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-800/70">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Resumen
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {selectedAccount?.currency || '--'} {form.amount || '0.00'}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Valor para dashboard: {baseCurrency} {amountBase.toFixed(2)}
          </p>
        </div>

        {shouldConvert ? (
          <label className="block lg:col-span-2">
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

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Categoria
          </span>
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
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Fecha
          </span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Descripcion
          </span>
          <input
            type="text"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Ej. Pago de internet"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {isEditing && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <X size={16} />
            Cancelar
          </button>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isEditing ? <PencilLine size={16} /> : <Save size={16} />}
          {submitting ? (isEditing ? 'Guardando...' : 'Registrando...') : resolvedSubmitLabel}
        </button>
      </div>
    </form>
  );
}
