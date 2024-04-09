import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useAppStore } from '../../store.ts/store-provider';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { SyncLoader } from 'react-spinners';
import { Button } from '../../UI';
import { FcGoogle } from 'react-icons/fc';
import { TbBrandYandex } from 'react-icons/tb';
import { observer } from 'mobx-react-lite';
import { Modal } from '../ModalContainer/Modal';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Введите правильный адрес электронной почты').required('Укажите email'),
  password: Yup.string().required('Укажите пароль'),
});

export const LoginForm = observer(() => {
  const { authStore } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const googleHref = 'http://localhost:3000/api/auth/google';
  const yandexHref = 'http://localhost:3000/api/auth/yandex';

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async ({ email, password }) => {
      setError(null);

      await authStore.login(email, password);

      if (authStore.isAuth) {
        setError(null);
        if (authStore.user?.isActivated) {
          navigate('/chat');
        }
        navigate('/activate');
      } else {
        setError(authStore.error);
      }
    },
    validateOnBlur: formSubmitted,
    validateOnChange: formSubmitted,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    formik.handleSubmit(e);
  };
  const getInputClass = (errors: string | undefined) => {
    return classNames('border border-2 bg-blue-900 focus:bg-blue-900 rounded-md px-4 py-3', {
      'border-blue-950': !errors,
      'border-red-500': errors,
      'focus:border-blue-500': !errors,
      'focus:border-red-500': errors,
    });
  };

  const submitButtonClass = classNames(
    'w-fit mx-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-light transition-all py-2 px-6 rounded-3xl',
    { 'disabled:bg-gray-600': !authStore.isLoading },
  );

  return (
    <Modal close={() => navigate('/')}>
      <div className='flex flex-col items-center h-full py-10'>
        <h2 className='text-2xl md:text-3xl text-center font-bold mb-4'>Войти в VeroledChat</h2>
        <Button
          href={googleHref}
          target='_blank'
          className='mb-5 flex items-center justify-start bg-gray-200 hover:bg-white text-black font-bold py-2 px-6 rounded-3xl transition-colors'>
          <FcGoogle size={30} className='mr-5' />
          <p className='font-extralight text-sm 2xl:text-lg'>
            Войти с помощью <span className=' font-light'>Google</span>
          </p>
        </Button>
        <Button
          target='_blank'
          href={yandexHref}
          className='mb-5 flex items-center justify-start bg-gray-200 hover:bg-white  text-black font-bold py-2 px-6 rounded-3xl transition-colors'>
          <TbBrandYandex size={30} color='red' className='mr-5' />
          <p className='font-extralight text-sm 2xl:text-lg'>
            Войти с помощью <span className='font-bold'>Yandex</span>
          </p>
        </Button>
        <div className='mb-5 flex w-2/3 items-center'>
          <div className='border border-gray-300 flex-1 h-0'></div>
          <div className='px-2'>или</div>
          <div className='border border-gray-300 flex-1 h-0'></div>
        </div>
        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <div className='md:w-2/3 mx-2 md:mx-auto flex flex-col'>
            <label htmlFor='email' className='mb-2'>
              <span className='font-light text-sm uppercase'>Адрес электронной почты*</span>
            </label>
            <input
              type='text'
              id='email'
              name='email'
              className={getInputClass(formik.errors.email)}
              placeholder=''
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && <div className='text-red-500'>{formik.errors.email}</div>}
          </div>

          <div className='md:w-2/3 mx-2 md:mx-auto flex flex-col'>
            <label htmlFor='password' className='mb-2'>
              <span className='font-light text-sm uppercase'>ПАРОЛЬ*</span>
            </label>
            <input
              id='password'
              name='password'
              type='password'
              className={getInputClass(formik.errors.password)}
              placeholder=''
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password && <div className='text-red-500'>{formik.errors.password}</div>}
            {error && <p className='mx-auto text-red-500 text-center mt-5'>{error}</p>}
          </div>

          <button
            disabled={authStore.isLoading || (Object.keys(formik.errors).length !== 0 && formSubmitted)}
            type='submit'
            className={submitButtonClass}>
            {authStore.isLoading ? <SyncLoader size={5} color='white' className='p-2' /> : 'Войти'}
          </button>
        </form>
        <div className='mt-5'>
          <span>Нет учетной записи? </span>
          <Link to='/registration' className='text-blue-400 hover:text-blue-100'>
            Зарегистрируйтесь!
          </Link>
        </div>
      </div>
    </Modal>
  );
});
