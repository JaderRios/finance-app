import { BrowserRouter, HashRouter } from 'react-router-dom';
import { appConfig } from './config/appConfig';

export default function RouterProvider({ children }) {
  if (appConfig.isHashRouter) {
    return <HashRouter>{children}</HashRouter>;
  }

  return <BrowserRouter basename={appConfig.basePath}>{children}</BrowserRouter>;
}
