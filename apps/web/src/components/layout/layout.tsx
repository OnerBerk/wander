import {Outlet} from 'react-router-dom';
import Header from '../header/header';

const Layout = () => {
  return (
    <div className='flex h-full min-h-0 flex-col'>
      <Header />
      <main className='min-h-0 flex-1'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
