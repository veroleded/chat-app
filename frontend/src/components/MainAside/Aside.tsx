import React, { useEffect, useState } from 'react';
import Header from './Header/Header';
import Chat from '../MainChat/Chat';

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
    <aside className='bg-gray-200 h-screen w-full md:w-1/4 md:border-r flex flex-col'>
      <Header />
      {chatIsOpen && wight < 768 && <Chat />}
      {/* <ul className='h-full order-1 md:order-2'>
        <li className='py-2 border-b'>Contact 1</li>
        <li className='py-2 border-b'>Contact 2</li>
        <li className='py-2 border-b'>Contact 3</li>
      </ul> */}
    </aside>
  );
};

export default Aside;
