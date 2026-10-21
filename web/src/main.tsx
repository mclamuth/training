import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, missingEntraSettings } from './config';
import { initMsal } from './auth/msal';
import { AuthGate } from './auth/AuthGate';
import { routes } from './app/routes';
import './styles/tokens.css';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const router = createBrowserRouter(routes);

async function start() {
  if (config.authMode === 'entra' && missingEntraSettings().length === 0) {
    await initMsal();
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Missing #root element in index.html');

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <RouterProvider router={router} />
        </AuthGate>
      </QueryClientProvider>
    </StrictMode>,
  );
}

void start();
