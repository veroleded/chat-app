import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import Chat from '../MainChat/Chat';
import { Outlet } from 'react-router-dom';

type Props = {
  chatIsOpen: boolean;
  wight: number;
};
const Aside = ({ chatIsOpen, wight }: Props) => {
  const [tab, setTab] = useState<'chats' | 'profile' | 'chat' | 'contacts'>('chats');

  useEffect(() => {
    if (chatIsOpen) {
      setTab('chat');
    }
  }, [chatIsOpen]);
  return (
    <aside className='bg-gray-200 h-screen w-full md:w-1/3 md:border-r flex-col-reverse flex md:flex-col relative'>
      <Header />
      <Outlet />
      {chatIsOpen && wight < 768 && <Chat />}
    </aside>
  );
};

export default Aside;
