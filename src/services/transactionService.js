import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

export async function createTransaction(payload) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa en Supabase.');
  }

  const transaction = {
    user_id: user.id,
    account_id: payload.account_id,
    category_id: payload.category_id,
    amount: Number(payload.amount),
    currency: payload.currency,
    exchange_rate: payload.exchange_rate ? Number(payload.exchange_rate) : null,
    amount_base: Number(payload.amount_base),
    base_currency: payload.base_currency,
    description: payload.description?.trim() || null,
    date: payload.date,
    type: payload.type,
  };

  const { error } = await supabase.from('transactions').insert(transaction);

  if (error) {
    throw error;
  }

  return transaction;
}

export async function updateTransaction(transactionId, payload) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa en Supabase.');
  }

  const transaction = {
    account_id: payload.account_id,
    category_id: payload.category_id || null,
    amount: Number(payload.amount),
    currency: payload.currency,
    exchange_rate: payload.exchange_rate ? Number(payload.exchange_rate) : null,
    amount_base: Number(payload.amount_base),
    base_currency: payload.base_currency,
    description: payload.description?.trim() || null,
    date: payload.date,
    type: payload.type,
  };

  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', transactionId)
    .eq('user_id', user.id)
    .select('id, account_id, category_id, amount, currency, exchange_rate, amount_base, base_currency, description, date, type, created_at, categories(name, icon), accounts(name, currency)')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchTransactions(options = {}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa en Supabase.');
  }

  const limit = Object.prototype.hasOwnProperty.call(options, 'limit') ? options.limit : 12;
  const { type, categoryId, search, startDate, endDate, accountId } = options;

  let query = supabase
    .from('transactions')
    .select('id, account_id, category_id, amount, currency, exchange_rate, amount_base, base_currency, description, date, type, created_at, categories(name, icon), accounts(name, currency)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  if (type && type !== 'all') {
    query = query.eq('type', type);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (accountId) {
    query = query.eq('account_id', accountId);
  }

  if (search) {
    query = query.ilike('description', `%${search}%`);
  }

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
