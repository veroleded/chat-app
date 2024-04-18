import { Outlet, useNavigate } from 'react-router-dom';
import icon from '../../assets/images/logo.png';
import AuthBtnGroup from './AuthBtnGroup';
import { useEffect } from 'react';
import { useAppStore } from '../../store.ts/store-provider';
import { observer } from 'mobx-react-lite';
import Loading from '../../components/Loading';
const Welcome = observer(() => {
  const { authStore } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        console.log(localStorage.getItem('token'));
        await authStore.checkAuth();
      }
      if (authStore.isAuth) {
        if (authStore.user?.isActivated) {
          navigate('main');
        } else {
          navigate('activate');
        }
      }
    };
    checkAuth();
  }, []);

  return authStore.isLoading ? (
    <Loading />
  ) : (
    <main className='container h-full md:h-screen mx-auto flex flex-col md:flex-row gap-3 overflow-hidden bg-blue-950 text-blue-50'>
      <section className=' flex'>
        <img src={icon} alt='Логотип' className=' mt-[-35px] mb-[-45px] md:mt-auto md:mb-auto' />
      </section>
      <section className='flex flex-col justify-center md:flex-1 mx-2'>
        <h1 className='mt-5 mb-8 mb:mt-16 text-wrap text-5xl lg:text-6xl xl:text-8xl 3xl:text-9xl font-bold'>
          Добро
          <br /> пожаловать!
        </h1>
        <p className='mb-5 md:mb-9 text-wrap text-3xl lg:text-5xl xl:text-6xl font-bold'>
          Присоединяйтесь сегодня.
        </p>
        <AuthBtnGroup />
        <Outlet />
      </section>
    </main>
  );
});
export default Welcome;
