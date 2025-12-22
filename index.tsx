
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Immediate polyfill for the process object used by the Gemini SDK.
// Electron doesn't expose 'process' to the renderer for security reasons
// by default, so we define it here for the SDK to function.
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { 
    env: { 
      API_KEY: '' 
    } 
  };
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Desktop App Critical Failure: Root mount point not found.");
}
