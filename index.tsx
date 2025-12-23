import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * PRODUCTION NOTE FOR CPANEL:
 * 1. Open this file in the cPanel File Manager Editor.
 * 2. Paste your Gemini API Key between the empty quotes below.
 * 3. Save the file.
 * 
 * WARNING: Since this is client-side code, your key will be visible 
 * to anyone who views the page source. Keep this URL private.
 */
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { 
    env: { 
      API_KEY: '' // <-- PASTE YOUR KEY HERE
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
  console.error("Critical Failure: Root mount point not found.");
}