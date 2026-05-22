import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import TransactionList from '../../components/transactions/TransactionList';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { fetchAccounts } from '../../services/accountService';
import { fetchCategories } from '../../services/categoryService';
import { fetchTransactions } from '../../services/transactionService';

const initialFilters = {
  type: 'all',
  categoryId: '',
  accountId: '',
  search: '',
  startDate: '',
  endDate: '',
};

export default function HistoryPage() {
  const { version } = useTransactionEvents();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function syncHistory() {
      try {
        const [transactionData, categoryData, accountData] = await Promise.all([
          fetchTransactions({
            limit: 100,
            type: filters.type,
            categoryId: filters.categoryId,
            accountId: filters.accountId,
            search: filters.search.trim(),
            startDate: filters.startDate,
            endDate: filters.endDate,
          }),
          fetchCategories(),
          fetchAccounts(),
        ]);

        if (!ignore) {
          setTransactions(transactionData);
          setCategories(categoryData);
          setAccounts(accountData);
          setError('');
        }
      } catch {
        if (!ignore) {
          setError('No pudimos cargar tus movimientos.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    syncHistory();

    return () => {
      ignore = true;
    };
  }, [filters, version]);

  function updateFilter(field, value) {
    setLoading(true);
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setLoading(true);
    setFilters(initialFilters);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Historial"
        title="Todos tus movimientos"
        description="Explora tu actividad con filtros simples para encontrar compras, ingresos, cuentas o periodos concretos."
      />

      <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-6 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Tipo
            </span>
            <select
              value={filters.type}
              onChange={(event) => updateFilter('type', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">Todos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Cuenta
            </span>
            <select
              value={filters.accountId}
              onChange={(event) => updateFilter('accountId', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Todas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Categoria
            </span>
            <select
              value={filters.categoryId}
              onChange={(event) => updateFilter('categoryId', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Desde
            </span>
            <input
              type="date"
              value={filters.startDate}
              onChange={(event) => updateFilter('startDate', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Hasta
            </span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(event) => updateFilter('endDate', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Buscar
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Descripcion"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <TransactionList transactions={transactions} loading={loading} error={error} />
    </div>
  );
}
