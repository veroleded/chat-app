import React, { useState } from 'react';
import { MdEdit, MdPhotoCamera } from 'react-icons/md';
import { User } from '../../../models/User';
import MiniForm from './MiniForm';
import MiniFormDate from './MiniFormDate';
import { observer } from 'mobx-react-lite';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { HiOutlinePlus } from 'react-icons/hi';
import { Link, Outlet } from 'react-router-dom';

type Props = {
  user: User;
};

const ProfileInner = observer(({ user }: Props) => {
  const [editor, setEditor] = useState<null | 'name' | 'nickname' | 'lastname' | 'description' | 'birthday'>(
    null,
  );

  return (
    <div className='flex-column'>
      <div className='h-[200px] w-[200px] mt-[75px] text-blue-900 relative rounded-full border border-gray-300 m-auto'>
        <IoPersonCircleOutline size={200} className='m-auto' />
        <Link
          to={'photo'}
          className='h-[200px] w-[200px] flex flex-col items-center justify-center text-black bg-gray-100 rounded-full border border-gray-300 m-auto absolute top-0 opacity-0 hover:opacity-70'>
          <MdPhotoCamera size={50} />
          <p className='text-center'>
            Изменить фото
            <br /> профиля
          </p>
        </Link>
      </div>
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
            <MiniForm type='nickname' close={setEditor} />
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
            <MiniForm type='name' close={setEditor} />
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
            <MiniForm type='lastname' close={setEditor} />
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
            <MiniForm type='description' close={setEditor} />
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
              <MiniFormDate close={setEditor} />
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
});

export default ProfileInner;
