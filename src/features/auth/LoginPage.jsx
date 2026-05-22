import { useState } from 'react';
import { ArrowRight, Landmark } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const loginInitialForm = {
  email: '',
  password: '',
};

const registerInitialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function LoginPage() {
  const { signIn, signUp, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(loginInitialForm);
  const [registerForm, setRegisterForm] = useState(registerInitialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function updateLoginField(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateRegisterField(field, value) {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setSuccess('');
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      await signIn(loginForm);
    } catch (requestError) {
      setError(requestError.message || 'No fue posible iniciar sesion.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Las contrasenas no coinciden.');
      setSuccess('');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const result = await signUp({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
      });

      if (result.session) {
        setSuccess('Cuenta creada correctamente. Ya puedes empezar.');
      } else {
        setSuccess('Cuenta creada. Revisa tu correo si necesitas confirmar el acceso.');
        setMode('login');
        setLoginForm({
          email: registerForm.email,
          password: '',
        });
      }

      setRegisterForm(registerInitialForm);
    } catch (requestError) {
      setError(requestError.message || 'No fue posible crear la cuenta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dfeaff,_#f8fbff_48%,_#eef3ff_100%)] p-3 dark:bg-[radial-gradient(circle_at_top_left,_#10203b,_#0f172a_44%,_#111827_100%)] md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-3 rounded-[32px] border border-white/50 bg-white/45 p-3 shadow-[0_25px_100px_rgba(37,99,235,0.10)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/45 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-6 lg:rounded-[40px] lg:p-6">
        <section className="order-2 relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#e8f0ff_0%,#f8fbff_60%,#eae1ff_100%)] p-5 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.95),rgba(49,46,129,0.55))] sm:p-6 lg:order-1 lg:rounded-[36px] lg:p-10">
          <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-500/10" />

          <div className="relative max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm dark:bg-slate-900/70 dark:text-sky-300 sm:px-4 sm:text-sm">
              <span className="grid size-8 place-items-center rounded-full bg-blue-600 text-white sm:size-9">
                <Landmark size={16} />
              </span>
              FinanzasApp
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl lg:mt-8 lg:text-5xl">
              Tu centro de control financiero personal
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7 lg:mt-5">
              Inicia sesion o crea tu cuenta para llevar el control de tu dinero con una experiencia simple,
              visual y siempre a mano.
            </p>
          </div>

          <div className="relative mt-8 hidden gap-4 md:grid-cols-3 lg:grid">
            <div className="rounded-[28px] bg-white/75 p-5 shadow-sm dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Dashboard</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">Ingresos vs gastos</p>
            </div>
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#dbe7ff_0%,#c7d9ff_100%)] p-5 shadow-sm dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.20),rgba(29,78,216,0.30))]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Registro</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">Todo ordenado</p>
            </div>
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#ece0ff_0%,#dcc7ff_100%)] p-5 shadow-sm dark:bg-[linear-gradient(135deg,rgba(99,102,241,0.22),rgba(79,70,229,0.30))]">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Historial</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">Decisiones claras</p>
            </div>
          </div>
        </section>

        <section className="order-1 rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-900/92 sm:p-6 lg:order-2 lg:rounded-[36px] lg:p-8">
          <div className="mb-5 flex items-center gap-3 lg:hidden">
            <div className="grid size-11 place-items-center rounded-[16px] bg-[linear-gradient(180deg,#2f6df6,#1e54df)] text-white shadow-lg shadow-blue-200">
              <Landmark size={20} />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">FinanzasApp</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Control claro desde tu celular</p>
            </div>
          </div>

          <div className="inline-flex w-full rounded-full bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={[
                'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition',
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-sky-200'
                  : 'text-slate-500 dark:text-slate-400',
              ].join(' ')}
            >
              Iniciar sesion
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={[
                'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition',
                mode === 'register'
                  ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-sky-200'
                  : 'text-slate-500 dark:text-slate-400',
              ].join(' ')}
            >
              Crear cuenta
            </button>
          </div>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300 sm:text-xs sm:tracking-[0.24em]">
            {mode === 'login' ? 'Acceso' : 'Registro'}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:mt-3 sm:text-3xl">
            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear usuario'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Accede para ver tu resumen, registrar movimientos y revisar tu historial.'
              : 'Al crear tu cuenta dejaremos listo tu espacio para que empieces de inmediato.'}
          </p>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Correo
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(event) => updateLoginField('email', event.target.value)}
                  placeholder="tu-correo@dominio.com"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 sm:px-5 sm:py-4"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Contrasena
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(event) => updateLoginField('password', event.target.value)}
                  placeholder="Tu contrasena"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 sm:px-5 sm:py-4"
                  required
                />
              </label>

              {error ? (
                <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>
              ) : null}
              {success ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:py-4"
              >
                <ArrowRight size={16} />
                {submitting ? 'Ingresando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Nombre completo
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={registerForm.fullName}
                  onChange={(event) => updateRegisterField('fullName', event.target.value)}
                  placeholder="Jader Rios"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 sm:px-5 sm:py-4"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Correo
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  value={registerForm.email}
                  onChange={(event) => updateRegisterField('email', event.target.value)}
                  placeholder="tu-correo@dominio.com"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 sm:px-5 sm:py-4"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Contrasena
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={registerForm.password}
                  onChange={(event) => updateRegisterField('password', event.target.value)}
                  placeholder="Minimo 6 caracteres"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 sm:px-5 sm:py-4"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Confirmar contrasena
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={registerForm.confirmPassword}
                  onChange={(event) => updateRegisterField('confirmPassword', event.target.value)}
                  placeholder="Repite tu contrasena"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none transition focus:border-blue-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900 sm:px-5 sm:py-4"
                  required
                />
              </label>

              {error ? (
                <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>
              ) : null}
              {success ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:py-4"
              >
                <ArrowRight size={16} />
                {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
