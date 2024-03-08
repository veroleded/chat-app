import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AppStoreProvider } from './store.ts/store-provider.tsx';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppStoreProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppStoreProvider>,
);
