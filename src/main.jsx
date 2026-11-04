import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/Common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Proactively clear stale legacy Service Worker caches
if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== 'karnataka-gym-v3-clean') {
        caches.delete(key);
      }
    });
  }).catch(() => {});
}

// Register Progressive Web App (PWA) Service Worker with automatic updates
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates on every page visit
        registration.update();
      })
      .catch(() => {});
  });
}
