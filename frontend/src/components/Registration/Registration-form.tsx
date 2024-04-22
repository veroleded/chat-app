import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useAppStore } from '../../store.ts/store-provider';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { SyncLoader } from 'react-spinners';
import { observer } from 'mobx-react-lite';
import { Modal } from '../ModalContainer/Modal';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Введите правильный адрес электронной почты').required('Укажите email'),
  nickname: Yup.string()
    .min(4, 'Минимум 4 символа')
    .max(16, 'Максимум 16 символов')
    .required('Как вас называть?'),
  password: Yup.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .required('Укажите пароль'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
});

export const RegistrationForm = observer(() => {
  const { authStore } = useAppStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '', nickname: '' },
    validationSchema,
    onSubmit: async ({ email, password, nickname }) => {
      await authStore.registration(email, nickname, password);
      if (authStore.isAuth) {
        navigate('/activate');
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
    { 'disabled:bg-gray-600': authStore.isLoading },
  );

  return (
    <Modal>
      <div className='flex flex-col items-center h-full py-5'>
        <h2 className='text-2xl md:text-3xl text-center font-bold mb-4'>Создайте учетную запись</h2>
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
            <label htmlFor='nickname' className='mb-2'>
              <span className='font-light text-sm uppercase'>ПСЕВДОНИМ*</span>
            </label>
            <input
              type='text'
              id='nickname'
              name='nickname'
              className={getInputClass(formik.errors.nickname)}
              placeholder=''
              onChange={formik.handleChange}
              value={formik.values.nickname}
            />
            {formik.errors.nickname && <div className='text-red-500'>{formik.errors.nickname}</div>}
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
          </div>

          <div className='md:w-2/3 mx-2 md:mx-auto flex flex-col'>
            <label htmlFor='confirmPassword' className='mb-2'>
              <span className='font-light text-sm uppercase'>Подтверждение пароля*</span>
            </label>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              className={getInputClass(formik.errors.confirmPassword)}
              placeholder=''
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
            {formik.errors.confirmPassword && (
              <div className='text-red-500'>{formik.errors.confirmPassword}</div>
            )}
            {authStore.error && <p className='mx-auto text-red-500 text-center mt-5'>{authStore.error}</p>}
          </div>

          <button
            disabled={authStore.isLoading || (Object.keys(formik.errors).length !== 0 && formSubmitted)}
            type='submit'
            className={submitButtonClass}>
            {authStore.isLoading ? (
              <SyncLoader size={5} color='white' className='p-2' />
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
});
