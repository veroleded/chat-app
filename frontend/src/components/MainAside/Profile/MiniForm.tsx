import { useFormik } from 'formik';
import React from 'react';
import AuthStore from '../../../store.ts/auth-store';
import { useAppStore } from '../../../store.ts/store-provider';

type Props = {
  type: null | 'name' | 'nickname' | 'lastname' | 'description' | 'date';
};

const MiniForm = ({ type }: Props) => {
  const {
    authStore: { user },
  } = useAppStore();
  const initialValues = { [type as string]: user[type] };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {},
  });
  return <div>MiniForm</div>;
};

export default MiniForm;
