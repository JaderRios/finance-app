import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';
import { fetchAccounts } from './accountService';
import { fetchProfile } from './profileService';

export async function fetchMonthlySummary() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesión activa en Supabase.');
  }

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().slice(0, 10);

  const [{ data, error }, accounts, profile] = await Promise.all([
    supabase
      .from('transactions')
      .select('type, amount, amount_base')
      .eq('user_id', user.id)
      .gte('date', monthStart)
      .lt('date', nextMonthStart),
    fetchAccounts(),
    fetchProfile(),
  ]);

  if (error) {
    throw error;
  }

  const baseCurrency = profile?.currency ?? 'PEN';
  const income = (data ?? [])
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + Number(transaction.amount_base ?? transaction.amount ?? 0), 0);
  const expense = (data ?? [])
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Number(transaction.amount_base ?? transaction.amount ?? 0), 0);
  const accountsInBaseCurrency = accounts.filter((account) => account.currency === baseCurrency);
  const openingBalance = accountsInBaseCurrency.reduce(
    (sum, account) => sum + Number(account.initial_balance ?? 0),
    0
  );
  const excludedOpeningBalances = accounts.length - accountsInBaseCurrency.length;

  return {
    income,
    expense,
    balance: openingBalance + income - expense,
    openingBalance,
    currency: baseCurrency,
    excludedOpeningBalances,
    user,
  };
}
