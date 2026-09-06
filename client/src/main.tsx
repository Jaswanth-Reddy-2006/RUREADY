import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import AuthBootstrap from './components/auth/AuthBootstrap';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthBootstrap />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#FAF8F4',
                fontFamily: '"DM Sans", sans-serif',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              },
              success: {
                iconTheme: {
                  primary: '#00897B',
                  secondary: '#FAF8F4',
                },
              },
              error: {
                iconTheme: {
                  primary: '#D93025',
                  secondary: '#FAF8F4',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
