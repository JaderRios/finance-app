import { useEffect, useState } from 'react';
import { RefreshCw, TrendingDown, Wallet } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import CategoryBreakdownChart from '../../components/dashboard/CategoryBreakdownChart';
import InsightCards from '../../components/dashboard/InsightCards';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import SpendingTrendChart from '../../components/dashboard/SpendingTrendChart';
import SummaryCard from '../../components/dashboard/SummaryCard';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';
import { fetchMonthlySummary } from '../../services/dashboardService';
import { fetchTransactions } from '../../services/transactionService';

const money = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'USD',
});

function buildDashboardInsights(transactions) {
  const recentTransactions = transactions.slice(0, 5);
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '');

    const value = expenseTransactions
      .filter((transaction) => transaction.date === key)
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return { key, label, value };
  });

  const categoryMap = expenseTransactions.reduce((accumulator, transaction) => {
    const categoryName = transaction.categories?.name || 'Sin categoria';
    accumulator[categoryName] = (accumulator[categoryName] || 0) + Number(transaction.amount);
    return accumulator;
  }, {});

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const totalExpense = expenseTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const averageExpense = expenseTransactions.length > 0 ? totalExpense / expenseTransactions.length : 0;

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
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, user: null });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function syncDashboard() {
      try {
        setLoading(true);
        setError('');

        const [summaryData, transactionData] = await Promise.all([
          fetchMonthlySummary(),
          fetchTransactions({ limit: 180 }),
        ]);

        if (!ignore) {
          setSummary(summaryData);
          setTransactions(transactionData);
        }
      } catch {
        if (!ignore) {
          setError('No pudimos cargar tu informacion por el momento.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    syncDashboard();

    return () => {
      ignore = true;
    };
  }, [version]);

  async function handleRefresh() {
    try {
      setLoading(true);
      setError('');

      const [summaryData, transactionData] = await Promise.all([
        fetchMonthlySummary(),
        fetchTransactions({ limit: 180 }),
      ]);

      setSummary(summaryData);
      setTransactions(transactionData);
    } catch {
      setError('No pudimos actualizar tu informacion por el momento.');
    } finally {
      setLoading(false);
    }
  }

  const insights = buildDashboardInsights(transactions);
  const savingsRate = summary.income > 0 ? Math.max((summary.balance / summary.income) * 100, 0) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resumen"
        title="Tu panorama financiero"
        description="Consulta tu balance, sigue la tendencia de tus gastos y descubre en que categorias se concentra tu dinero."
        action={
          <button
            onClick={handleRefresh}
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

      <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
        <SummaryCard
          title="Saldo disponible"
          value={loading ? '...' : money.format(summary.balance)}
          icon={Wallet}
          tone="blue"
          subtitle="La diferencia entre lo que entra y lo que sale."
        />
        <SummaryCard
          title="Gasto del mes"
          value={loading ? '...' : money.format(summary.expense)}
          icon={TrendingDown}
          tone="violet"
          subtitle="Todo lo que has registrado como gasto en este periodo."
        />
        <SummaryCard
          title="Ingresos acumulados"
          value={loading ? '...' : money.format(summary.income)}
          icon={Wallet}
          tone="white"
          subtitle="Tus entradas de dinero registradas hasta ahora."
        />
        <SummaryCard
          title="Ahorro estimado"
          value={loading ? '...' : `${savingsRate.toFixed(0)}%`}
          icon={TrendingDown}
          tone="white"
          subtitle="Porcentaje de tus ingresos que logras conservar."
        />
      </section>

      <InsightCards
        topCategory={insights.topCategory}
        averageExpense={insights.averageExpense}
        savingsRate={savingsRate}
      />

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <SpendingTrendChart points={insights.last7Days} />
        <CategoryBreakdownChart
          categories={insights.categoryBreakdown}
          totalExpense={insights.totalExpense}
        />
      </section>

      <RecentTransactions transactions={insights.recentTransactions} />
    </div>
  );
}
