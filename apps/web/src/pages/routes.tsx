import BrowseLayout from '@/components/layout/browse-layout';
import MapLayout from '@/components/layout/map-layout';
import RootLayout from '@/components/layout/root-layout';
import { type RouteObject } from 'react-router-dom';
import AboutPage from './about-page';
import ListPage from './list-page';
import NotFoundPage from './not-found-page';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <BrowseLayout />,
        children: [
          {
            index: true,
            element: <ListPage />,
          },
          {
            path: 'map',
            element: <MapLayout />,
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
