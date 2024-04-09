import icon from './icon.png';
import { CgProfile } from 'react-icons/cg';
import { IoMdContacts } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className='bg-blue-900 text-white py-4 px-2 flex items-center justify-between'>
      <img src={icon} alt='logo' className='w-10 h-10 mr-1' />
      <nav className='flex items-center gap-2'>
        <NavLink to={'profile'} className='flex items-center gap-2'>
          <IoMdContacts size={20} />
          <span className='lg:block lg:text-sm xl:text-lg'>Профиль</span>
        </NavLink>
        <NavLink to={'contacts'} className='flex items-center gap-1'>
          <CgProfile size={20} />
          <span className='lg:block lg:text-sm xl:text-lg'>Контакты</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
