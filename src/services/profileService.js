import { supabase } from '../lib/supabaseClient';
import { getCurrentUser } from './authService';

export async function fetchProfile() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No hay una sesion activa.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, currency')
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
