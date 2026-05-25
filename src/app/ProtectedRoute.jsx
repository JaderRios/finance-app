import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_#e9f1ff,_#f8fbff_50%,_#eef3ff_100%)] p-6 dark:bg-[radial-gradient(circle_at_top_left,_#10203b,_#0f172a_44%,_#111827_100%)]">
      <div className="rounded-[32px] border border-white/60 bg-white/95 px-8 py-7 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/92">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-sky-300">Supabase</p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Validando sesion</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Estamos comprobando tu acceso para cargar el escritorio.</p>
      </div>
    </div>
  );
}

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
