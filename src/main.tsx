import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ServiceProvider } from './context/ServiceContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ServiceProvider>
          <App />
        </ServiceProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
