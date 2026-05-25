import { useEffect, useState } from 'react';
import AccountForm from '../../components/accounts/AccountForm';
import AccountList from '../../components/accounts/AccountList';
import PageHeader from '../../components/ui/PageHeader';
import { createAccount, deactivateAccount, fetchAccounts } from '../../services/accountService';

export default function AccountsPage() {
  const pageSize = 6;
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    let ignore = false;

    async function loadAccounts() {
      try {
        const data = await fetchAccounts();
        if (!ignore) {
          setAccounts(data);
        }
      } catch {
        if (!ignore) {
          setFeedback({ type: 'error', message: 'No pudimos cargar tus cuentas.' });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAccounts();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(form) {
    try {
      setCreating(true);
      setFeedback({ type: '', message: '' });
      const created = await createAccount(form);
      setAccounts((current) =>
        [...current, created].sort((a, b) => {
          if (a.currency !== b.currency) {
            return a.currency.localeCompare(b.currency);
          }
          return a.name.localeCompare(b.name);
        })
      );
      setCurrentPage(1);
      setFeedback({ type: 'success', message: 'Cuenta creada correctamente.' });
    } catch {
      setFeedback({ type: 'error', message: 'No pudimos crear la cuenta.' });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(account) {
    const confirmed = window.confirm(`¿Ocultar la cuenta "${account.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(account.id);
      setFeedback({ type: '', message: '' });
      await deactivateAccount(account.id);
      setAccounts((current) => current.filter((item) => item.id !== account.id));
      setCurrentPage(1);
      setFeedback({ type: 'success', message: 'Cuenta ocultada correctamente.' });
    } catch {
      setFeedback({ type: 'error', message: 'No pudimos ocultar la cuenta.' });
    } finally {
      setDeletingId('');
    }
  }

  const paginatedAccounts = accounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        eyebrow="Cuentas"
        title="Tus bolsillos de dinero"
        description="Crea una cuenta para soles, otra para dolares y cualquier otro espacio que uses en tu dia a dia."
      />

      {feedback.message ? (
        <div
          className={[
            'rounded-[28px] p-5 text-sm',
            feedback.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300',
          ].join(' ')}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(360px,460px)_minmax(0,1fr)]">
        <AccountForm onCreate={handleCreate} submitting={creating} />
        <AccountList
          accounts={paginatedAccounts}
          loading={loading}
          deletingId={deletingId}
          onDelete={handleDelete}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={accounts.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
