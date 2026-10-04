import type { ComponentType } from 'react';

type MapPageModule = {
  default: ComponentType;
};

let mapPagePromise: Promise<MapPageModule> | undefined;

export const loadMapPage = (): Promise<MapPageModule> => {
  mapPagePromise ??= import('@/pages/map-pages');
  return mapPagePromise;
};
