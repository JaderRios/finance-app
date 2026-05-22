import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import { appRoutes } from './config/routes';
import AccountsPage from '../features/accounts/AccountsPage';
import LoginPage from '../features/auth/LoginPage';
import CategoriesPage from '../features/categories/CategoriesPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import TransfersPage from '../features/transfers/TransfersPage';
import NewTransactionPage from '../features/transactions/NewTransactionPage';
import HistoryPage from '../features/history/HistoryPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path={appRoutes.login} element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={appRoutes.dashboard} replace />} />
          <Route path={appRoutes.dashboard} element={<DashboardPage />} />
          <Route path={appRoutes.accounts} element={<AccountsPage />} />
          <Route path={appRoutes.categories} element={<CategoriesPage />} />
          <Route path={appRoutes.transfers} element={<TransfersPage />} />
          <Route path={appRoutes.newTransaction} element={<NewTransactionPage />} />
          <Route path={appRoutes.history} element={<HistoryPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={appRoutes.dashboard} replace />} />
    </Routes>
  );
}
