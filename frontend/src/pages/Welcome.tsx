import icon from '../assets/images/icon.png';
import AuthBtnGroup from '../modules/AuthBtnGroup';
const Welcome = () => (
  <main className='container h-screen mx-auto flex flex-col md:flex-row gap-3 overflow-hidden bg-blue-950 text-blue-50'>
    <section className='md:flex-1'>
      <img src={icon} alt='Логотип' className='w-16 h-16' />
    </section>
    <section className='flex flex-col justify-center md:flex-1 mx-2'>
      <h1 className='mt-5 mb-8 mb:mt-16 text-wrap text-5xl lg:text-6xl xl:text-8xl 3xl:text-9xl font-bold'>
        Добро
        <br /> пожаловать!
      </h1>
      <p className='mb-5 md:mb-9 text-wrap text-3xl lg:text-5xl xl:text-6xl font-bold'>
        Присоединяйтесь сегодня.
      </p>
      <AuthBtnGroup />
    </section>
  </main>
);
export default Welcome;
