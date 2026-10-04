import { Outlet, useMatch } from 'react-router-dom';
import Header from '@/components/header/header';
import HeaderList from '../header/header-list';

const RootLayout = () => {
  const isList = Boolean(useMatch({ path: '/', end: true }));
  return (
    <div className="flex h-full min-h-0 flex-col">
      {!isList && <Header />}
      {isList && <HeaderList />}
      <Outlet />
    </div>
  );
};

export default RootLayout;
