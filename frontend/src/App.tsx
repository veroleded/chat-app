import './index.css';
import { observer } from 'mobx-react-lite';
import Welcome from './pages/Welcome/Welcome';
import NotFound from './pages/NotFound/NotFound';
import { LoginForm } from './components/Login/LoginForm';
import Activate from './pages/Activate/Activate';
import Main from './pages/Main/Main';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAppStore } from './store.ts/store-provider';
import { RegistrationForm } from './components/Registration/Registration-form';
import { useEffect } from 'react';

const router = createBrowserRouter([
  { path: '*', element: <NotFound /> },
  {
    path: '/',
    element: <Welcome />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'registration',
        element: <RegistrationForm />,
      },
    ],
  },
  { path: '/activate', element: <Activate /> },
  { path: '/chat', element: <Main /> },
]);

const App = observer(() => {
  const { authStore } = useAppStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        await authStore.checkAuth();
      }
    };
    checkAuth();
  }, []);

  return (
    <div>
      <RouterProvider router={router} />
      <button onClick={() => authStore.logout()}>выйти</button>
    </div>
  );
});

export default App;
