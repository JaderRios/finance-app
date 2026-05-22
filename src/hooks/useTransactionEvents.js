import { useContext } from 'react';
import { TransactionEventsContext } from '../contexts/transactionEventsContext';

export function useTransactionEvents() {
  const context = useContext(TransactionEventsContext);

  if (!context) {
    throw new Error('useTransactionEvents debe usarse dentro de TransactionEventsProvider');
  }

  return context;
}
