import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

export async function fetchAccounts() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa.');
  }

  const { data, error } = await supabase
    .from('accounts')
    .select('id, name, currency, type, initial_balance, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('currency', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function createAccount(payload) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa.');
  }

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      user_id: user.id,
      name: payload.name.trim(),
      currency: payload.currency,
      type: payload.type,
      initial_balance: Number(payload.initial_balance || 0),
    })
    .select('id, name, currency, type, initial_balance, is_active')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deactivateAccount(accountId) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa.');
  }

  const { error } = await supabase
    .from('accounts')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', accountId)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
}
