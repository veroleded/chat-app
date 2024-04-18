import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { User } from '../../../models/User';
import MiniForm from './MiniForm';
import MiniFormDate from './MiniFormDate';

type Props = {
  user: User;
};

const ProfileInner = ({ user }: Props) => {
  const [editor, setEditor] = useState<null | 'name' | 'nickname' | 'lastname' | 'description' | 'birthday'>(
    null,
  );
  return (
    <div className='flex-column'>
      <div className='my-7'>
        <p className='text-sm text-blue-900 mb-2 font-bold'>Псевдоним</p>
        <div className='flex justify-between items-center'>
          {editor !== 'nickname' ? (
            <>
              <p className='text-lg text-blue-800'>{user?.nickname}</p>
              <button onClick={() => setEditor('nickname')}>
                <MdEdit size={25} className='text-indigo-800' />
              </button>
            </>
          ) : (
            <MiniForm type='nickname' />
          )}
        </div>
      </div>
      <div className='my-7'>
        <p className='text-sm text-blue-900 mb-2 font-bold'>Имя</p>
        <div className='flex justify-between items-center'>
          {editor !== 'name' ? (
            <>
              <p className='text-lg text-blue-800'>{user?.name}</p>
              <button onClick={() => setEditor('name')}>
                <MdEdit size={25} className='text-indigo-800' />
              </button>
            </>
          ) : (
            <MiniForm type='name' />
          )}
        </div>
      </div>
      <div className='my-7'>
        <p className='text-sm text-blue-900 mb-2 font-bold'>Фамилия</p>
        <div className='flex justify-between items-center'>
          {editor !== 'lastname' ? (
            <>
              <p className='text-lg text-blue-800'>{user?.lastname}</p>
              <button onClick={() => setEditor('lastname')}>
                <MdEdit size={25} className='text-indigo-800' />
              </button>
            </>
          ) : (
            <MiniForm type='lastname' />
          )}
        </div>
      </div>
      <div className='my-7'>
        <p className='text-sm text-blue-900 mb-2 font-bold'>О себе</p>
        <div className='flex justify-between items-center'>
          {editor !== 'description' ? (
            <>
              <p className='text-lg text-blue-800 text-wrap overflow-hidden text-ellipsis'>
                {user?.description}
              </p>
              <button onClick={() => setEditor('description')}>
                <MdEdit size={25} className='text-indigo-800' />
              </button>
            </>
          ) : (
            <MiniForm type='description' />
          )}
        </div>
        <div className='my-7'>
          <p className='text-sm text-blue-900 mb-2 font-bold'>Дата рождения</p>
          <div className='flex justify-between items-center'>
            {editor !== 'birthday' ? (
              <>
                <p className='text-lg text-blue-800 text-wrap overflow-hidden text-ellipsis'>
                  {new Date(user?.birthday as string).toLocaleDateString('ru-Ru')}
                </p>
                <button onClick={() => setEditor('birthday')}>
                  <MdEdit size={25} className='text-indigo-800' />
                </button>
              </>
            ) : (
              <MiniFormDate />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInner;
