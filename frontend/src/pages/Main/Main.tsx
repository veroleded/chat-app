import React, { useEffect, useState } from 'react';
import Aside from '../../components/MainAside/Aside';
import Chat from '../../components/MainChat/Chat';
import { useAppStore } from '../../store.ts/store-provider';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Loading from '../../components/Loading';

const Main = observer(() => {
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [wight, setWight] = useState(window.innerWidth);
  const { authStore } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        await authStore.checkAuth();
      }

      if (!authStore.isAuth) {
        navigate('/');
      } else if (!authStore.user?.isActivated) {
        navigate('/activate');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const updateWight = () => setWight(window.innerWidth);
    window.addEventListener('resize', updateWight);
    return () => window.removeEventListener('resize', updateWight);
  });

  return authStore.isLoading ? (
    <Loading />
  ) : (
    <div className='font-sans flex flex-col md:flex-row h-screen'>
      <Aside chatIsOpen={chatIsOpen} wight={wight} />
      {chatIsOpen && wight >= 768 && <Chat />}
    </div>
  );
});

export default Main;
