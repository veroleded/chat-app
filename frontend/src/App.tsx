import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import NotFound from './pages/NotFound';
import Welcome from './pages/Welcome';
import { observer } from 'mobx-react-lite';
import { useAppStore } from './store.ts/store-provider';
import { useEffect } from 'react';
import Activate from './pages/Activate';

const App = observer(() => {
  const { authStore } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      authStore.checkAuth();
    }
  }, []);

  useEffect(() => {
    if (!authStore.isAuth) {
      if (localStorage.getItem('token')) {
        navigate('/activate');
      } else {
        navigate('/welcome');
      }
    }
  });
  console.log(authStore.isAuth, localStorage.getItem('token'));

  return (
    <div>
      <Routes>
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/activate' element={<Activate />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <button onClick={() => authStore.logout()}>выйти</button>
    </div>
  );
});

export default App;
