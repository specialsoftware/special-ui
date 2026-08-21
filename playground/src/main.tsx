import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted Inter. The library only declares `--font-sans`; loading the face
// is the app's job, which keeps the package free of network dependencies.
import '@fontsource-variable/inter';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
