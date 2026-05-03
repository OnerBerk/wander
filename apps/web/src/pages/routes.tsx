import Layout from '@/components/layout/layout';
import {type RouteObject} from 'react-router-dom';
import MapPage from './map-pages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MapPage />,
      },
    ],
  },
];
