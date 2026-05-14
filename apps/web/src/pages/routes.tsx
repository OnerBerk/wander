import MapLayout from '@/components/layout/map-layout';
import RootLayout from '@/components/layout/root-layout';
import { type RouteObject } from 'react-router-dom';
import AboutPage from './about-page';
import MapPage from './map-pages';
import NotFoundPage from './not-found-page';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <MapLayout />,
        children: [
          {
            index: true,
            element: <MapPage />,
          },
        ],
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
