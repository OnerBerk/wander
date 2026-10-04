import bikeMarkerImageUrl from './marker-bike.webp';

export const createBikeMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = bikeMarkerImageUrl;
  image.alt = '';
  image.width = 40;
  image.height = 40;
  image.className = 'h-full w-full object-contain';

  return image;
};
