# FinanzasApp Desktop

MVP de escritorio para finanzas personales construido con React, Vite, Electron, Tailwind CSS y Supabase.

## Scripts

- `npm run dev`: levanta Vite y Electron en desarrollo.
- `npm run build`: genera el build web.
- `npm run build:desktop`: empaqueta la app de escritorio.
- `npm run start`: abre Electron usando el build existente.

## Variables de entorno

1. Copia `.env.example` a `.env`
2. Configura:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Estructura

- `electron/`: proceso principal y preload.
- `src/app/`: router y layout principal.
- `src/features/`: páginas por dominio.
- `src/components/`: componentes reutilizables.
- `src/services/`: consultas a Supabase.
- `src/lib/`: configuración compartida.
