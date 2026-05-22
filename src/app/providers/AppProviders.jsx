import AuthProvider from '../../contexts/AuthProvider';
import ThemeProvider from '../../contexts/ThemeProvider';
import TransactionEventsProvider from '../../contexts/TransactionEventsProvider';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TransactionEventsProvider>{children}</TransactionEventsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
