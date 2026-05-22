import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import {
  getCurrentSession,
  onAuthStateChange,
  signInWithPassword,
  signUpWithPassword,
  signOut as signOutRequest,
} from '../services/authService';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrapSession() {
      try {
        const currentSession = await getCurrentSession();

        if (mounted) {
          setSession(currentSession);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrapSession();

    const subscription = onAuthStateChange((nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      loading,
      signIn: signInWithPassword,
      signUp: signUpWithPassword,
      signOut: signOutRequest,
    }),
    [loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
