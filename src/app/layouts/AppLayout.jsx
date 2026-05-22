import {
  ArrowRightLeft,
  FolderTree,
  Landmark,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Menu,
  Moon,
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

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dfeaff,_#f8fbff_44%,_#f2f6ff_100%)] p-3 text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_#10203b,_#0f172a_44%,_#111827_100%)] dark:text-slate-100 md:p-5">
      <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 gap-4 rounded-[34px] border border-white/60 bg-white/45 p-3 shadow-[0_25px_100px_rgba(37,99,235,0.10)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/55 lg:grid-cols-[280px_1fr] lg:p-5">
        <button
          type="button"
          onClick={() => setSidebarOpen((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 lg:hidden"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          {sidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
        </button>

        <aside
          className={[
            'h-full overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,255,0.92))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.88))] dark:shadow-[0_18px_50px_rgba(2,6,23,0.45)]',
            sidebarOpen ? 'block' : 'hidden lg:block',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="mb-10 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-[18px] bg-[linear-gradient(180deg,#2f6df6,#1e54df)] text-white shadow-lg shadow-blue-200">
                <Landmark size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-blue-700 dark:text-sky-300">FinanzasApp</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Control personal</p>
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

            <div className="mt-6 rounded-[24px] border border-slate-100 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Apariencia</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isDark ? 'Modo oscuro' : 'Modo claro'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
                  {isDark ? 'Claro' : 'Oscuro'}
                </button>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#f8fbff,#f3f6fb)] p-4 dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.8),rgba(15,23,42,0.8))]">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-sky-500/20 dark:text-sky-300">
                    <UserCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {user?.user_metadata?.full_name || user?.email || 'Usuario'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mi espacio</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <LogOut size={16} />
                  Cerrar sesion
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto pr-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
