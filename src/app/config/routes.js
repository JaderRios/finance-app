export const appRoutes = {
  login: '/login',
  dashboard: '/dashboard',
  settings: '/configuracion',
  accounts: '/cuentas',
  categories: '/categorias',
  transfers: '/transferencias',
  newTransaction: '/movimientos/nuevo',
  history: '/historial',
};

export const navigationRoutes = [
  { to: appRoutes.dashboard, label: 'Dashboard', icon: 'dashboard' },
  { to: appRoutes.newTransaction, label: 'Registrar', icon: 'transactions' },
  { to: appRoutes.history, label: 'Historial', icon: 'history' },
  { to: appRoutes.settings, label: 'Configuracion', icon: 'settings' },
];
