import bikeMarkerImageUrl from './marker-bike.png';

export const createBikeMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = bikeMarkerImageUrl;
  image.alt = '';
  image.className = 'h-9 w-9 object-contain';

  return image;
};
