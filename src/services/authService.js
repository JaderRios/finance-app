import { supabase } from '../lib/supabaseClient';

async function ensureDefaultData(user, fullName) {
  const profilePayload = {
    id: user.id,
    full_name: fullName,
    currency: 'PEN',
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, {
    onConflict: 'id',
  });

  if (profileError) {
    throw profileError;
  }

  const defaultCategories = [
    { user_id: user.id, name: 'Salario', type: 'income', icon: 'wallet' },
    { user_id: user.id, name: 'Freelance', type: 'income', icon: 'briefcase' },
    { user_id: user.id, name: 'Ventas', type: 'income', icon: 'badge-dollar-sign' },
    { user_id: user.id, name: 'Comida', type: 'expense', icon: 'utensils' },
    { user_id: user.id, name: 'Transporte', type: 'expense', icon: 'car' },
    { user_id: user.id, name: 'Servicios', type: 'expense', icon: 'receipt' },
    { user_id: user.id, name: 'Salud', type: 'expense', icon: 'heart-pulse' },
    { user_id: user.id, name: 'Entretenimiento', type: 'expense', icon: 'film' },
    { user_id: user.id, name: 'Educacion', type: 'expense', icon: 'book-open' },
    { user_id: user.id, name: 'Hogar', type: 'expense', icon: 'home' },
  ];

  const { data: existingCategories, error: categoriesReadError } = await supabase
    .from('categories')
    .select('name, type')
    .eq('user_id', user.id);

  if (categoriesReadError) {
    throw categoriesReadError;
  }

  const existingKeys = new Set(
    (existingCategories ?? []).map((category) => `${category.type}:${category.name}`)
  );

  const categoriesToInsert = defaultCategories.filter(
    (category) => !existingKeys.has(`${category.type}:${category.name}`)
  );

  if (categoriesToInsert.length > 0) {
    const { error: categoriesInsertError } = await supabase
      .from('categories')
      .insert(categoriesToInsert);

    if (categoriesInsertError) {
      throw categoriesInsertError;
    }
  }
}

function getUserDisplayName(user, fallbackName = '') {
  const metadataName = user?.user_metadata?.full_name;

  if (typeof metadataName === 'string' && metadataName.trim()) {
    return metadataName.trim();
  }

  return fallbackName.trim();
}

async function provisionUserData(user, fullName) {
  if (!user) {
    return;
  }

  const profileName = getUserDisplayName(user, fullName);

  if (!profileName) {
    return;
  }

  await ensureDefaultData(user, profileName);
}

export async function signUpWithPassword({ fullName, email, password }) {
  const trimmedName = fullName.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: trimmedName,
      },
    },
  });

  if (error) {
    throw error;
  }

  const user = data.user;

  if (!user) {
    throw new Error('No fue posible crear el usuario.');
  }

  if (data.session) {
    try {
      await provisionUserData(user, trimmedName);
    } catch (provisionError) {
      console.error('No se pudo completar la inicializacion del usuario tras el registro.', provisionError);
    }
  }

  return {
    user,
    session: data.session,
  };
}

export async function signInWithPassword({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  try {
    await provisionUserData(data.user);
  } catch (provisionError) {
    console.error('No se pudo completar la inicializacion del usuario tras iniciar sesion.', provisionError);
  }

  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return data.subscription;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}
