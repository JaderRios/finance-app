export const appRoutes = {
  login: '/login',
  dashboard: '/dashboard',
  accounts: '/cuentas',
  categories: '/categorias',
  transfers: '/transferencias',
  newTransaction: '/movimientos/nuevo',
  history: '/historial',
};

export const navigationRoutes = [
  { to: appRoutes.dashboard, label: 'Dashboard', icon: 'dashboard' },
  { to: appRoutes.accounts, label: 'Cuentas', icon: 'accounts' },
  { to: appRoutes.categories, label: 'Categorias', icon: 'categories' },
  { to: appRoutes.transfers, label: 'Transferencias', icon: 'transfers' },
  { to: appRoutes.newTransaction, label: 'Registrar', icon: 'transactions' },
  { to: appRoutes.history, label: 'Historial', icon: 'history' },
];
