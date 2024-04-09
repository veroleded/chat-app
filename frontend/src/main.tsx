import ReactDOM from 'react-dom/client';
import { AppStoreProvider } from './store.ts/store-provider.tsx';
import App from './App.tsx';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppStoreProvider>
    <App />
  </AppStoreProvider>,
);
