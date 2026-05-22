import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

export async function fetchCategories(type) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa en Supabase.');
  }

  let query = supabase
    .from('categories')
    .select('id, name, type, icon')
    .eq('user_id', user.id)
    .order('type', { ascending: true })
    .order('name', { ascending: true });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function createCategory(payload) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa en Supabase.');
  }

  const category = {
    user_id: user.id,
    name: payload.name.trim(),
    type: payload.type,
    icon: payload.icon?.trim() || null,
  };

  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select('id, name, type, icon')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCategory(categoryId) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa en Supabase.');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
}
