import { Funnel, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import TransactionForm from '../../components/transactions/TransactionForm';
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
  const pageSize = 10;
  const { version } = useTransactionEvents();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function syncHistory() {
      try {
        const [transactionData, categoryData, accountData] = await Promise.all([
          fetchTransactions({
            limit: null,
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
    setCurrentPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setLoading(true);
    setCurrentPage(1);
    setFilters(initialFilters);
  }

  const paginatedTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Historial"
        title="Todos tus movimientos"
        description="Encuentra compras, ingresos o errores rapido, y corrige la informacion sin volver a registrar desde cero."
      />

      <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,255,0.92))] p-5 shadow-sm dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.84))] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-sky-500/20 dark:text-sky-300">
              <Funnel size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Filtrar historial</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ajusta la vista sin perder espacio ni contraste.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <X size={16} />
            Limpiar filtros
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Tipo
            </span>
            <select
              value={filters.type}
              onChange={(event) => updateFilter('type', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100"
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
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100"
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
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100"
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
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100"
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
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100"
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
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100"
            />
          </label>
        </div>
      </section>

      <TransactionList
        transactions={paginatedTransactions}
        loading={loading}
        error={error}
        onEdit={setEditingTransaction}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={transactions.length}
        onPageChange={setCurrentPage}
      />

      {editingTransaction ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[34px]">
            <TransactionForm
              key={editingTransaction.id}
              mode="edit"
              transaction={editingTransaction}
              title="Corregir movimiento"
              description="Ajusta fecha, cuenta, categoria o monto y guarda el cambio inmediatamente."
              submitLabel="Actualizar movimiento"
              onCancel={() => setEditingTransaction(null)}
              onSaved={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
