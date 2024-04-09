import icon from './icon.png';
import { CgProfile } from 'react-icons/cg';
import { IoMdContacts } from 'react-icons/io';

const Header = () => {
  return (
    <header className='bg-blue-900 text-white py-4 px-2 order-2 md:order-1 flex items-center justify-between'>
      <img src={icon} alt='logo' className='w-10 h-10 mr-1' />
      <nav className='flex items-center gap-2'>
        <button className='flex items-center gap-2'>
          <IoMdContacts size={20} />
          <span className='md:hidden lg:block lg:text-sm xl:text-lg'>Профиль</span>
        </button>
        <button className='flex items-center gap-1'>
          <CgProfile size={20} />
          <span className='md:hidden lg:block lg:text-sm xl:text-lg'>Контакты</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
