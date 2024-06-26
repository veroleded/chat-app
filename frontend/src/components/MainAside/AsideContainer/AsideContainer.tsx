import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  headerName: string;
};

const AsideContainer = observer(({ children, headerName }: Props) => {
  const [isCLose, setIsClose] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setIsClose(true);
    setTimeout(() => {
      navigate('/main');
    }, 200); // 200 миллисекунд (0.2 секунды)
  };

  return (
    <div
      className={`h-screen w-full overflow-scroll z-10 bg-neutral-200 ${isCLose ? 'slideOut' : 'slideIn'}`}>
      <header className='w-full md:w-1/3 fixed p-3 flex items-center justify-between text-blue-900'>
        <a onClick={handleClick} className=' cursor-pointer'>
          <IoIosArrowRoundBack size={45} />
        </a>
        <h1 className='text-xl'>{headerName}</h1>
      </header>
      {children}
    </div>
  );
});

export default AsideContainer;
