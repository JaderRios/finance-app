import {
  ArrowRightLeft,
  FolderTree,
  Landmark,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Menu,
  Moon,
  Settings,
  SunMedium,
  UserCircle2,
  Wallet,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { navigationRoutes } from '../config/routes';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const navIconMap = {
  dashboard: LayoutDashboard,
  accounts: Wallet,
  categories: FolderTree,
  transfers: ArrowRightLeft,
  transactions: Landmark,
  history: ListFilter,
  settings: Settings,
};

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
          isActive
            ? 'border border-dashed border-blue-400 bg-blue-50 text-blue-700 shadow-sm dark:border-sky-400/70 dark:bg-sky-500/15 dark:text-sky-200'
            : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/80',
        ].join(' ')
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayName = user?.user_metadata?.full_name || user?.email || 'Usuario';

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dfeaff,_#f8fbff_44%,_#f2f6ff_100%)] p-2 text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_#10203b,_#0f172a_44%,_#111827_100%)] dark:text-slate-100 md:p-5">
      <div className="grid h-full w-full grid-cols-1 gap-3 rounded-[26px] border border-white/60 bg-white/45 p-2 shadow-[0_25px_100px_rgba(37,99,235,0.10)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/55 sm:rounded-[30px] sm:p-3 lg:gap-5 lg:rounded-[34px] lg:p-5 lg:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => setSidebarOpen((current) => !current)}
          className="sticky top-0 z-30 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 lg:hidden"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          {sidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
        </button>

        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Cerrar menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          />
        ) : null}

        <aside
          className={[
            'z-30 h-full overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,255,0.92))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.88))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.45)] sm:rounded-[30px] sm:p-5',
            sidebarOpen ? 'fixed inset-x-2 bottom-2 top-16 block lg:static lg:inset-auto' : 'hidden lg:block',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="mb-6 flex items-center gap-3 lg:mb-10">
              <div className="grid size-11 place-items-center rounded-[16px] bg-[linear-gradient(180deg,#2f6df6,#1e54df)] text-white shadow-lg shadow-blue-200 lg:size-12 lg:rounded-[18px]">
                <Landmark size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-blue-700 dark:text-sky-300 lg:text-3xl">Balanzx</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 lg:text-sm">Control financiero personal</p>
              </div>
            </div>

            <nav className="space-y-3">
              {navigationRoutes.map((item) => (
                <NavItem
                  key={item.to}
                  {...item}
                  icon={navIconMap[item.icon]}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </nav>

          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto px-0 lg:px-1 2xl:px-2">
          <div className="sticky top-0 z-20 mb-4 py-1">
            <div className="flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/82 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-sky-500/20 dark:text-sky-300">
                  <UserCircle2 size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bienvenido a Balanzx</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
                  {isDark ? 'Modo claro' : 'Modo oscuro'}
                </button>

                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  <LogOut size={16} />
                  Salir
                </button>
              </div>
            </div>
          </div>
          <div className="pb-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
