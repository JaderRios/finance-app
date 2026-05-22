import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import RouterProvider from './app/RouterProvider.jsx';
import './styles/app.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>
);
