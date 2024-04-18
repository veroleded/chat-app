import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppStore } from '../../../store.ts/store-provider';
import { User } from '../../../models/User';
import { IoMdCheckmark } from 'react-icons/io';
import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  type: 'name' | 'nickname' | 'lastname' | 'description';
};

const validationSchemas = {
  nickname: Yup.object().shape({
    nickname: Yup.string()
      .min(4, 'Минимум 4 символа')
      .max(20, 'Максимум 20 символов')
      .required('Как вас называть?'),
  }),
  name: Yup.object().shape({
    name: Yup.string().min(2, 'Минимум 2 символа').max(20, 'Максимум 20 символов'),
  }),
  lastname: Yup.object().shape({
    lastname: Yup.string().min(2, 'Минимум 2 символа').max(20, 'Максимум 20 символов'),
  }),
  description: Yup.object().shape({
    description: Yup.string().min(1, 'Минимум 2 символа').max(100, 'Максимум 100 символов'),
  }),
  birthday: Yup.object().shape({
    description: Yup.string().min(1, 'Минимум 2 символа').max(100, 'Максимум 100 символов'),
  }),
};

const MiniForm = ({ type }: Props) => {
  const { authStore } = useAppStore();
  const { user } = authStore;
  const initialValues = { [type]: (user as User)[type] ?? '' };

  const maxLength = type === 'description' ? 100 : 20;

  const [symbolsCount, setSymbolsCount] = useState(maxLength - (user as User)[type].toLocaleString().length);
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[type],
    onSubmit: async (values) => {
      await authStore.updateCurrentUser(values);
    },
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setSymbolsCount(maxLength - e.currentTarget.value.length);
    formik.handleChange(e);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'nickname' && formik.errors[type]?.length) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 200);
    } else {
      formik.handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className={classNames('flex justify-between items-center w-full', { shake: error })}>
      {type === 'description' ? (
        <textarea
          autoFocus
          className='w-full mr-4 text-lg text-blue-800 border-b-2 border-l-2 border-blue-700 bg-inherit px-2 focus:outline-none resize-none'
          id={type}
          rows={5}
          name={type}
          onChange={changeHandler}
          value={formik.values[type]}
          maxLength={100}
        />
      ) : (
        <input
          autoFocus
          className='w-full mr-4 text-lg text-blue-800 border-b-2 border-blue-800 bg-inherit px-2 focus:outline-none'
          type='text'
          id={type}
          name={type}
          onChange={changeHandler}
          value={formik.values[type]}
          maxLength={20}
        />
      )}
      <span
        className={`font-bold relative right-7 ${
          type === 'nickname' && symbolsCount > 16 ? 'text-red-500' : 'text-gray-400'
        }`}>
        {symbolsCount}
      </span>
      <button type='submit' disabled={error}>
        <IoMdCheckmark size={25} className='text-indigo-800' />
      </button>
    </form>
  );
};

export default MiniForm;
