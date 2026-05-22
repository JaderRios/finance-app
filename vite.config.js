import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const envDir = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, envDir, '');

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), tailwindcss()],
  };
});
