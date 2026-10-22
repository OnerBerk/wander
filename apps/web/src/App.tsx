import { useRoutes } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { routes } from '@/pages/routes';
import Hummingbird from './components/hummingbird/hummingbird';
import colibriUrl from '@/assets/glb/colibri.glb?url';

const App = () => {
  return (
    <>
      <SpeedInsights />
      <Hummingbird targetSelector="[data-colibri-cible]" src={colibriUrl} />
      {useRoutes(routes)}
    </>
  );
};

export default App;
