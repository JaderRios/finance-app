# FinanzasApp

Aplicacion web para gestionar finanzas personales construida con React, Vite, Tailwind CSS y Supabase.

## Scripts

- `npm run dev`: levanta la app web en desarrollo.
- `npm run build`: genera el build web.
- `npm run preview`: sirve el build generado localmente.

## Variables de entorno

1. Copia `.env.example` a `.env`.
2. Configura:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Despliegue en GitHub Pages

El repositorio incluye un workflow en `.github/workflows/deploy.yml`.

Para publicarlo:

1. En GitHub ve a `Settings` -> `Pages`.
2. En `Source`, selecciona `GitHub Actions`.
3. En `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`, crea:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

El despliegue se ejecuta automaticamente cuando haces push a `main`.

## Estructura

- `src/app/`: router, configuracion y layout principal.
- `src/features/`: paginas por dominio.
- `src/components/`: componentes reutilizables.
- `src/services/`: consultas a Supabase.
- `src/lib/`: configuracion compartida.
