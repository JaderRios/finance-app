import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';
import { fetchAccounts } from './accountService';

const DASHBOARD_CURRENCY = 'PEN';

function getTransactionCurrency(transaction) {
  return transaction.currency || transaction.accounts?.currency || DASHBOARD_CURRENCY;
}

function getSignedAmount(transaction) {
  const amount = Number(transaction.amount ?? 0);
  return transaction.type === 'income' ? amount : -amount;
}

function getDashboardAmount(transaction) {
  const amount = Number(transaction.amount ?? 0);
  const amountBase = Number(transaction.amount_base ?? 0);
  const exchangeRate = Number(transaction.exchange_rate ?? 0);
  const transactionCurrency = getTransactionCurrency(transaction);

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

export async function fetchMonthlySummary() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesión activa en Supabase.');
  }

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().slice(0, 10);

  const [
    { data: transactionsData, error: transactionsError },
    { data: transfersData, error: transfersError },
    accounts,
  ] = await Promise.all([
    supabase
      .from('transactions')
      .select('type, amount, currency, exchange_rate, amount_base, base_currency, date, accounts(currency)')
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
    supabase
      .from('transfers')
      .select('from_account_id, to_account_id, from_amount, to_amount')
      .eq('user_id', user.id),
    fetchAccounts(),
  ]);

  if (transactionsError) {
    throw transactionsError;
  }

  if (transfersError) {
    throw transfersError;
  }

  const baseCurrency = DASHBOARD_CURRENCY;
  const transactions = transactionsData ?? [];
  const transfers = transfersData ?? [];
  const monthlyTransactions = transactions.filter(
    (transaction) => transaction.date >= monthStart && transaction.date < nextMonthStart
  );
  const income = monthlyTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + getDashboardAmount(transaction), 0);
  const expense = monthlyTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + getDashboardAmount(transaction), 0);
  const balancesByCurrency = accounts.reduce(
    (balances, account) => ({
      ...balances,
      [account.currency]: balances[account.currency] + Number(account.initial_balance ?? 0),
    }),
    { PEN: 0, USD: 0 }
  );

  transactions.forEach((transaction) => {
    const transactionCurrency = getTransactionCurrency(transaction);
    balancesByCurrency[transactionCurrency] =
      (balancesByCurrency[transactionCurrency] ?? 0) + getSignedAmount(transaction);
  });

  const accountCurrencyById = new Map(accounts.map((account) => [account.id, account.currency]));

  transfers.forEach((transfer) => {
    const fromCurrency = accountCurrencyById.get(transfer.from_account_id);
    const toCurrency = accountCurrencyById.get(transfer.to_account_id);

    if (fromCurrency) {
      balancesByCurrency[fromCurrency] =
        (balancesByCurrency[fromCurrency] ?? 0) - Number(transfer.from_amount ?? 0);
    }

    if (toCurrency) {
      balancesByCurrency[toCurrency] =
        (balancesByCurrency[toCurrency] ?? 0) + Number(transfer.to_amount ?? 0);
    }
  });

  const openingBalance = balancesByCurrency.PEN;

  return {
    income,
    expense,
    balance: balancesByCurrency.PEN,
    balancesByCurrency,
    openingBalance,
    currency: baseCurrency,
    user,
  };
}
