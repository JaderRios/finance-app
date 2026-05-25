import { ArrowRightLeft, ChevronRight, FolderTree, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { appRoutes } from '../../app/config/routes';

const settingsCards = [
  {
    title: 'Cuentas',
    description: 'Administra tus bolsillos por banco, efectivo o billetera y define sus saldos iniciales.',
    to: appRoutes.accounts,
    icon: Wallet,
  },
  {
    title: 'Categorias',
    description: 'Ajusta como etiquetas ingresos y gastos para que el historial y el dashboard hablen tu idioma.',
    to: appRoutes.categories,
    icon: FolderTree,
  },
  {
    title: 'Transferencias',
    description: 'Registra movimientos entre cuentas cuando necesites pasar dinero o manejar cambio de moneda.',
    to: appRoutes.transfers,
    icon: ArrowRightLeft,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        eyebrow="Configuracion"
        title="Ajustes de tu sistema personal"
        description="El menu principal queda enfocado en consultar y registrar. Todo lo de soporte vive aqui para que la app se sienta mas ligera."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {settingsCards.map(({ title, description, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,255,0.92))] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(30,41,59,0.86))]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-12 place-items-center rounded-[18px] bg-blue-100 text-blue-700 dark:bg-sky-500/20 dark:text-sky-300">
                <Icon size={22} />
              </div>
              <ChevronRight
                size={18}
                className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-sky-300"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
