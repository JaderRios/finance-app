import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_#e9f1ff,_#f8fbff_50%,_#eef3ff_100%)] p-6">
      <div className="rounded-[32px] bg-white px-8 py-7 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Supabase</p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Validando sesion</h1>
        <p className="mt-2 text-sm text-slate-500">Estamos comprobando tu acceso para cargar el escritorio.</p>
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
