import {useRoutes} from 'react-router-dom';
import {SpeedInsights} from '@vercel/speed-insights/react';
import {routes} from '@/pages/routes';

const App = () => {
  return (
    <>
      <SpeedInsights />
      {useRoutes(routes)}
    </>
  );
};

export default App;
