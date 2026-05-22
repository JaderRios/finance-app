import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';
import { fetchAccounts } from './accountService';
import { fetchProfile } from './profileService';

export async function fetchMonthlySummary() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesión activa en Supabase.');
  }

  const [{ data, error }, accounts, profile] = await Promise.all([
    supabase.from('resumen_mensual').select('type, total').eq('user_id', user.id),
    fetchAccounts(),
    fetchProfile(),
  ]);

  if (error) {
    throw error;
  }

  const income = Number(data.find((item) => item.type === 'income')?.total ?? 0);
  const expense = Number(data.find((item) => item.type === 'expense')?.total ?? 0);
  const baseCurrency = profile?.currency ?? 'USD';
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
