import { useEffect, useState } from 'react';
import { useAppStore } from '../../store.ts/store-provider';
import { RingLoader } from 'react-spinners';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';

const Activate = observer(() => {
  const { authStore } = useAppStore();
  const [isMailSent, setIsMailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    authStore.setError(null);
    if (authStore.user?.isActivated) {
      navigate('/main');
    }
  });

  const sendMailButtonHandler = async () => {
    setIsMailSent(false);
    await authStore.sendActivationMail();
    setIsMailSent(true);
  };

  const normalizeEmail = () => {
    const user = authStore.user;
    const arr = (user?.email ?? 'asd').split('@');
    return [arr[0].slice(0, 3), '***', '@', arr[1]].join('');
  };

  return authStore.isLoading ? (
    <Loading />
  ) : (
    <div className='text-white container m-auto'>
      <div className='m-auto w-full h-screen md:min-h-96 md:h-full sm:mt-20 sm:w-2/3 lg:w-1/2 sm:border border-blue-900 bg-blue-800 sm:rounded-md flex flex-col items-center'>
        <h1 className='mt-10 md:text-3xl font-bold'>Активация аккаунта</h1>
        <h2 className='p-3 md:text-2xl text-center'>{'Спасибо за регистрацию в нашем чате.'}</h2>
        <p className='p-5 md:text-xl text-center'>
          <span>{'На вашу почту '}</span>
          <span className='font-bold'>{normalizeEmail()}</span>
          {` было отправлено письмо с ссылкой активации. 
            Если письмо не было получено, возможно оно попало в папку спам. 
            В ином случае убедитесь, что вы ввели верный email при регистрации.
            Обновите страницу, если уже активировали профиль.`}
        </p>
        {authStore.error && <p className=' text-red-600'>{authStore.error}</p>}
        <button
          disabled={authStore.isLoading}
          className='mb-5 text-white font-bold p-2 min-w-max bg-blue-950 rounded-md border-2 hover:scale-110 transition-all flex items-center'
          onClick={sendMailButtonHandler}>
          {authStore.isLoading && <RingLoader color='white' size={25} />}
          <span className='ml-2'>{'Отправить письмо повторно'}</span>
        </button>
        {isMailSent && (
          <p className='mb-2 mt-[-0.5rem] text-green-400 border-collapse'>{'Письмо успешно отправлено'}</p>
        )}
      </div>
    </div>
  );
});

export default Activate;
