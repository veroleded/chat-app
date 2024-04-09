import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import AsideContainer from '../../AsideContainer/AsideContainer';
import { useAppStore } from '../../../store.ts/store-provider';

const Profile = () => {
  const {
    authStore: { user },
  } = useAppStore();

  const [editor, setEditor] = useState<null | 'name' | 'nickname' | 'lastname' | 'description' | 'date'>(
    null,
  );
  return (
    <AsideContainer headerName='Профиль'>
      <div className='flex flex-col px-3 pt-3'>
        <div>
          <p className='text-sm text-blue-900 mb-2 font-bold'>Псевдоним</p>
          <div className='flex justify-between items-center'>
            <p className='text-lg text-blue-800'>{user?.nickname}</p>
            <button onClick={() => setEditor('nickname')}>
              <MdEdit size={25} className='text-indigo-800' />
            </button>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default Profile;
