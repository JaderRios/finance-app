import { Trash2 } from 'lucide-react';
import Pagination from '../ui/Pagination';

function CategoryBadge({ type }) {
  return (
    <span
      className={[
        'rounded-full px-3 py-1 text-xs font-semibold',
        type === 'income'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
          : 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300',
      ].join(' ')}
    >
      {type === 'income' ? 'Ingreso' : 'Gasto'}
    </span>
  );
}

export default function CategoryList({
  categories,
  loading,
  deletingId,
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) {
  return (
    <section className="rounded-[32px] border border-white/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categorias registradas</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ten a mano todas las categorias que usas en tu dia a dia.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          Cargando categorias...
        </div>
      ) : null}

      {!loading ? (
        <>
        <div className="space-y-3">
          {categories.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              Aun no tienes categorias personalizadas.
            </div>
          ) : null}

          {categories.map((category) => (
            <article
              key={category.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 px-4 py-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{category.name}</p>
                  <CategoryBadge type={category.type} />
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.icon || 'Sin detalle adicional'}</p>
              </div>

              <button
                type="button"
                onClick={() => onDelete(category)}
                disabled={deletingId === category.id}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
              >
                <Trash2 size={16} />
                {deletingId === category.id ? 'Borrando...' : 'Borrar'}
              </button>
            </article>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems ?? categories.length}
          onPageChange={onPageChange}
          itemLabel="categorias"
        />
        </>
      ) : null}
    </section>
  );
}
