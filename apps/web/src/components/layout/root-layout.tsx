import { Outlet } from 'react-router-dom';
import Header from '@/components/header/header';

const RootLayout = () => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Header />
      <Outlet />
    </div>
  );
};

export default RootLayout;
