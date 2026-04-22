import {Outlet} from 'react-router-dom';
import Header from '../header/header';

const Layout = () => {
  return (
    <div className='h-screen'>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
