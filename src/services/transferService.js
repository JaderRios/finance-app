import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

export async function createTransfer(payload) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa.');
  }

  const { error } = await supabase.from('transfers').insert({
    user_id: user.id,
    from_account_id: payload.from_account_id,
    to_account_id: payload.to_account_id,
    from_amount: Number(payload.from_amount),
    to_amount: Number(payload.to_amount),
    exchange_rate: Number(payload.exchange_rate),
    description: payload.description?.trim() || null,
    date: payload.date,
  });

  if (error) {
    throw error;
  }
}

export async function fetchTransfers(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa.');
  }

  let query = supabase
    .from('transfers')
    .select('id, from_amount, to_amount, exchange_rate, description, date, from_account_id, to_account_id')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
