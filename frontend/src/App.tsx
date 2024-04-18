import './index.css';
import { observer } from 'mobx-react-lite';
import Welcome from './pages/Welcome/Welcome';
import NotFound from './pages/NotFound/NotFound';
import { LoginForm } from './components/Login/LoginForm';
import Activate from './pages/Activate/Activate';
import Main from './pages/Main/Main';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RegistrationForm } from './components/Registration/Registration-form';
import Profile from './components/MainAside/Profile/Profile';

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
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

const App = observer(() => {
  return (
    <div>
      <RouterProvider router={router} />
      {/* <button onClick={() => authStore.logout()}>выйти</button> */}
    </div>
  );
});

export default App;
