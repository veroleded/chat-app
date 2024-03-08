import { Button } from '../UI';
import { FcGoogle } from 'react-icons/fc';
import { TbBrandYandex } from 'react-icons/tb';
import { Modal } from '.';
import { useState } from 'react';
import { RegistrationForm } from './Registration-form';

const AuthBtnGroup = () => {
  const googleHref = 'http://localhost:3000/api/auth/google';
  const yandexHref = 'http://localhost:3000/api/auth/yandex';

  const [isModal, setIsModal] = useState(false);
  const [modalType, setModalType] = useState<'login' | 'registration'>('login');
  const openLoginModalHandler = () => {
    setModalType('login');
    setIsModal(true);
  };
  const openRegistrationModalHandler = () => {
    setModalType('registration');
    setIsModal(true);
  };

  return (
    <div className='w-fit'>
      <Button
        href={googleHref}
        target='_blank'
        className='mb-5 flex items-center justify-start bg-gray-200 hover:bg-white text-black font-bold py-2 px-6 rounded-3xl transition-colors'>
        <FcGoogle size={30} className='mr-5' />
        <p className='font-extralight text-sm 2xl:text-lg'>
          Регистрация с помощью <span className=' font-light'>Google</span>
        </p>
      </Button>
      <Button
        target='_blank'
        href={yandexHref}
        className='mb-5 flex items-center justify-start bg-gray-200 hover:bg-white  text-black font-bold py-2 px-6 rounded-3xl transition-colors'>
        <TbBrandYandex size={30} color='red' className='mr-5' />
        <p className='font-extralight text-sm 2xl:text-lg'>
          Регистрация с помощью <span className='font-bold'>Yandex</span>
        </p>
      </Button>
      <div className='mb-5 flex items-center'>
        <div className='border border-gray-300 flex-1 h-0'></div>
        <div className='px-2'>или</div>
        <div className='border border-gray-300 flex-1 h-0'></div>
      </div>
      <Button
        onCLick={openRegistrationModalHandler}
        className='mb-7 md:mb-10 w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-3xl transition-colors'>
        <p className='text-sm 2xl:text-lg font-bold'>Зарегистрироваться</p>
      </Button>
      <p className='mb-5 text-xl md:text-2xl'>Уже зарегистрированы?</p>
      <Button
        onCLick={openLoginModalHandler}
        className='mb-7 md:mb-10 w-full flex items-center justify-center border border-white hover:border-blue-600 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-3xl transition-colors'>
        <p className='text-sm 2xl:text-lg font-bold'>Войти</p>
      </Button>
      <Modal isOpen={isModal} close={() => setIsModal(false)}>
        <RegistrationForm />
      </Modal>
    </div>
  );
};

export default AuthBtnGroup;
