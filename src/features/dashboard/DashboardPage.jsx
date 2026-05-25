import { useEffect, useRef, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, RefreshCw, TrendingDown, Wallet } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import CategoryBreakdownChart from '../../components/dashboard/CategoryBreakdownChart';
import InsightCards from '../../components/dashboard/InsightCards';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import SpendingTrendChart from '../../components/dashboard/SpendingTrendChart';
import SummaryCard from '../../components/dashboard/SummaryCard';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { fetchMonthlySummary } from '../../services/dashboardService';
import { fetchTransactions } from '../../services/transactionService';
import { formatMoneyByCurrency } from '../../utils/money';

const DASHBOARD_CURRENCY = 'PEN';

function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDashboardAmount(transaction) {
  const amount = Number(transaction.amount ?? 0);
  const amountBase = Number(transaction.amount_base ?? 0);
  const exchangeRate = Number(transaction.exchange_rate ?? 0);
  const transactionCurrency = transaction.currency || transaction.accounts?.currency || DASHBOARD_CURRENCY;

  if (transaction.base_currency === DASHBOARD_CURRENCY && transaction.amount_base != null) {
    return amountBase;
  }

  if (transactionCurrency === DASHBOARD_CURRENCY) {
    return amount;
  }

  if (transactionCurrency === 'USD' && exchangeRate > 0) {
    return amount * exchangeRate;
  }

  return amountBase || amount;
}

function buildDashboardInsights(transactions) {
  const recentTransactions = transactions.slice(0, 5);
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = toLocalDateKey(date);
    const label = date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '');

    const value = expenseTransactions
      .filter((transaction) => transaction.date === key)
      .reduce((sum, transaction) => sum + getDashboardAmount(transaction), 0);

    return { key, label, value };
  });

  const categoryMap = expenseTransactions.reduce((accumulator, transaction) => {
    const categoryName = transaction.categories?.name || 'Sin categoria';
    accumulator[categoryName] = (accumulator[categoryName] || 0) + getDashboardAmount(transaction);
    return accumulator;
  }, {});

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const totalExpense = expenseTransactions.reduce(
    (sum, transaction) => sum + getDashboardAmount(transaction),
    0
  );
  const averageExpense = last7Days.length > 0
    ? last7Days.reduce((sum, point) => sum + point.value, 0) / last7Days.length
    : 0;

  return {
    recentTransactions,
    last7Days,
    categoryBreakdown,
    totalExpense,
    topCategory: categoryBreakdown[0] ?? null,
    averageExpense,
  };
}

export default function DashboardPage() {
  const { version } = useTransactionEvents();
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    currency: 'PEN',
    balancesByCurrency: { PEN: 0, USD: 0 },
    user: null,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isSyncingRef = useRef(false);

  async function syncDashboard(options = {}) {
    const { silent = false } = options;

    if (isSyncingRef.current) {
      return;
    }

    try {
      isSyncingRef.current = true;

      if (!silent) {
        setLoading(true);
      }

      setError('');

      const [summaryData, transactionData] = await Promise.all([
        fetchMonthlySummary(),
        fetchTransactions({ limit: 180 }),
      ]);

      setSummary(summaryData);
      setTransactions(transactionData);
    } catch {
      setError('No pudimos cargar tu informacion por el momento.');
    } finally {
      isSyncingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      syncDashboard();
    });
  }, [version]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        syncDashboard({ silent: true });
      }
    }

    function handleWindowFocus() {
      syncDashboard({ silent: true });
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const insights = buildDashboardInsights(transactions);
  const savingsRate =
    summary.income > 0 ? Math.max(((summary.income - summary.expense) / summary.income) * 100, 0) : 0;
  const savingsVisual =
    savingsRate >= 30
      ? {
          icon: ArrowUpCircle,
          tone: 'emerald',
          subtitle: 'Estas conservando una parte saludable de tus ingresos.',
        }
      : savingsRate >= 10
        ? {
            icon: PiggyBank,
            tone: 'amber',
            subtitle: 'Vas guardando algo, pero aun tienes margen para mejorar.',
          }
        : {
            icon: ArrowDownCircle,
            tone: 'rose',
            subtitle: 'Tu margen de ahorro esta apretado en este periodo.',
          };
  const dashboardCurrency = DASHBOARD_CURRENCY;
  const balances = summary.balancesByCurrency ?? { PEN: summary.balance ?? 0, USD: 0 };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        eyebrow="Resumen"
        title="Tu panorama financiero"
        description="Consulta tu balance, sigue la tendencia de tus gastos y descubre en que categorias se concentra tu dinero."
        action={
          <button
            onClick={() => syncDashboard()}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        }
      />

      {error ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 2xl:grid-cols-4 lg:gap-6">
        <SummaryCard
          title="Saldos disponibles"
          value={
            loading ? (
              '...'
            ) : (
              <div className="space-y-1 text-3xl">
                <p>{formatMoneyByCurrency(balances.PEN, 'PEN')}</p>
                <p className="text-2xl text-slate-600 dark:text-slate-300">
                  {formatMoneyByCurrency(balances.USD, 'USD')}
                </p>
              </div>
            )
          }
          icon={Wallet}
          tone="blue"
          subtitle="Separado por moneda para no mezclar soles con dolares."
        />
        <SummaryCard
          title="Gasto del mes"
          value={loading ? '...' : formatMoneyByCurrency(summary.expense, dashboardCurrency)}
          icon={TrendingDown}
          tone="rose"
          subtitle="Todo lo que has registrado como gasto en este periodo."
        />
        <SummaryCard
          title="Ingresos acumulados"
          value={loading ? '...' : formatMoneyByCurrency(summary.income, dashboardCurrency)}
          icon={ArrowUpCircle}
          tone="emerald"
          subtitle="Tus entradas de dinero registradas hasta ahora."
        />
        <SummaryCard
          title="Tasa de ahorro"
          value={loading ? '...' : `${savingsRate.toFixed(0)}%`}
          icon={savingsVisual.icon}
          tone={savingsVisual.tone}
          subtitle={savingsVisual.subtitle}
        />
      </section>

      <div className="hidden rounded-[24px] border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-200 sm:block">
        El dashboard muestra gastos, ingresos e indicadores en soles. El historial conserva la moneda real de cada movimiento.
      </div>

      <InsightCards
        topCategory={insights.topCategory}
        averageExpense={insights.averageExpense}
        savingsRate={savingsRate}
        currency={dashboardCurrency}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)] 2xl:grid-cols-[minmax(0,1.6fr)_minmax(380px,0.8fr)]">
        <SpendingTrendChart points={insights.last7Days} currency={dashboardCurrency} />
        <CategoryBreakdownChart
          categories={insights.categoryBreakdown}
          totalExpense={insights.totalExpense}
          currency={dashboardCurrency}
        />
      </section>

      <RecentTransactions transactions={insights.recentTransactions} />
    </div>
  );
}
