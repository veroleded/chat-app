import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Button } from '../../UI';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  close: () => void;
};

export const Modal = ({ children, close }: Props) => {
  const escKeyHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', escKeyHandler);
    return () => {
      window.removeEventListener('keydown', escKeyHandler);
    };
  }, []);

  return (
    <div className='absolute top-0 left-0 w-screen h-screen backdrop-blur'>
      <div
        tabIndex={-1}
        className='flex flex-col bg-blue-900 w-screen md:w-2/3 xl:w-1/3 h-full md:h-fit md:rounded-lg md:mt-10 mx-auto'>
        <div className='flex justify-end'>
          <Button
            onCLick={() => close()}
            className='mr-2 mt-2 rounded-full hover:bg-blue-800 p-1'
            ariaLabel='Закрыть модальное окно'>
            <IoMdClose size={30} className='text-white' />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
