import bikeMarkerImageUrl from './marker-bike.png';

export const createBikeMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = bikeMarkerImageUrl;
  image.alt = '';
  image.className = 'h-20 w-20 object-contain md:h-20 md:w-20';

  return image;
};
