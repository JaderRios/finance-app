const routerMode = import.meta.env.VITE_ROUTER_MODE?.trim().toLowerCase() || 'browser';
const normalizedBasePath = import.meta.env.VITE_BASE_PATH?.trim() || '/';

export const appConfig = {
  routerMode: routerMode === 'hash' ? 'hash' : 'browser',
  basePath: normalizedBasePath,
  isHashRouter: routerMode === 'hash',
};
