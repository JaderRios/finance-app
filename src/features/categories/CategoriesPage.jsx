import { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import CategoryForm from '../../components/categories/CategoryForm';
import CategoryList from '../../components/categories/CategoryList';
import { createCategory, deleteCategory, fetchCategories } from '../../services/categoryService';

export default function CategoriesPage() {
  const pageSize = 8;
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const data = await fetchCategories();

        if (!ignore) {
          setCategories(data);
        }
      } catch {
        if (!ignore) {
          setFeedback({ type: 'error', message: 'No pudimos cargar tus categorias.' });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(form) {
    try {
      setCreating(true);
      setFeedback({ type: '', message: '' });
      const created = await createCategory(form);
      setCategories((current) =>
        [...current, created].sort((a, b) => {
          if (a.type !== b.type) {
            return a.type.localeCompare(b.type);
          }

          return a.name.localeCompare(b.name);
        })
      );
      setCurrentPage(1);
      setFeedback({ type: 'success', message: 'Categoria creada correctamente.' });
    } catch {
      setFeedback({ type: 'error', message: 'No pudimos crear la categoria.' });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(`¿Deseas borrar la categoria "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);
      setFeedback({ type: '', message: '' });
      await deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      setCurrentPage(1);
      setFeedback({ type: 'success', message: 'Categoria eliminada correctamente.' });
    } catch {
      setFeedback({ type: 'error', message: 'No pudimos borrar la categoria.' });
    } finally {
      setDeletingId('');
    }
  }

  const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        eyebrow="Categorias"
        title="Organiza tu dinero a tu manera"
        description="Crea categorias propias para que cada movimiento quede bien clasificado y sea facil de entender."
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
        <CategoryForm onCreate={handleCreate} submitting={creating} />
        <CategoryList
          categories={paginatedCategories}
          loading={loading}
          deletingId={deletingId}
          onDelete={handleDelete}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={categories.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
