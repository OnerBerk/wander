import MapLayout from '@/components/layout/map-layout';
import RootLayout from '@/components/layout/root-layout';
import WanderAppTourGuard from '@/components/guards/wander-app-tour-guard';
import { type RouteObject } from 'react-router-dom';
import AboutPage from './about-page';
import MapPage from './map-pages';
import MapTourPage from './map-tour-page';
import NotFoundPage from './not-found-page';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <WanderAppTourGuard requireWelcomeSeen={true} />,
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
        ],
      },
      {
        path: 'map-tour',
        element: <WanderAppTourGuard requireWelcomeSeen={false} />,
        children: [
          {
            index: true,
            element: <MapTourPage />,
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
