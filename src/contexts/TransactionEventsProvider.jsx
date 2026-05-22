import { useMemo, useState } from 'react';
import { TransactionEventsContext } from './transactionEventsContext';

export default function TransactionEventsProvider({ children }) {
  const [version, setVersion] = useState(0);

  const value = useMemo(
    () => ({
      version,
      notifyTransactionsChanged() {
        setVersion((current) => current + 1);
      },
    }),
    [version]
  );

  return (
    <TransactionEventsContext.Provider value={value}>
      {children}
    </TransactionEventsContext.Provider>
  );
}
