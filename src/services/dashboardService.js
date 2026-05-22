import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';
import { fetchAccounts } from './accountService';

export async function fetchMonthlySummary() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesión activa en Supabase.');
  }

  const [{ data, error }, accounts] = await Promise.all([
    supabase.from('resumen_mensual').select('type, total').eq('user_id', user.id),
    fetchAccounts(),
  ]);

  if (error) {
    throw error;
  }

  const income = Number(data.find((item) => item.type === 'income')?.total ?? 0);
  const expense = Number(data.find((item) => item.type === 'expense')?.total ?? 0);
  const openingBalance = accounts.reduce(
    (sum, account) => sum + Number(account.initial_balance ?? 0),
    0
  );

  return {
    income,
    expense,
    balance: openingBalance + income - expense,
    openingBalance,
    user,
  };
}
