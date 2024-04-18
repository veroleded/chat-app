import { useFormik } from 'formik';
import React, { useState } from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import * as Yup from 'yup';
import { useAppStore } from '../../../store.ts/store-provider';
import classNames from 'classnames';

const validationSchema = Yup.object().shape({
  birthday: Yup.date().max(new Date()),
});

const MiniFormDate = () => {
  const { authStore } = useAppStore();
  const formik = useFormik({
    initialValues: { birthday: authStore.user?.birthday },
    validationSchema,
    onSubmit: async (values) => {
      const normalizeDate = new Date(values.birthday as string).toISOString();
      await authStore.updateCurrentUser({ birthday: normalizeDate });
    },
  });

  const [error, setError] = useState(false);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formik.errors.birthday) {
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
      className={classNames('flex justify-between items-center w-full', { shake: error })}
      onSubmit={submitHandler}>
      <input
        type='date'
        className='w-full mr-4 text-lg text-blue-800 border-b-2 border-blue-800 bg-inherit px-2 focus:outline-none cursor-pointer'
        autoFocus
        id='birthday'
        name='birthday'
        onChange={formik.handleChange}
      />
      <button type='submit' disabled={error}>
        <IoMdCheckmark size={25} className='text-indigo-800' />
      </button>
    </form>
  );
};

export default MiniFormDate;
