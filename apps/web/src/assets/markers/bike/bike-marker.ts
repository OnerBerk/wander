import bikeMarkerImageUrl from './marker-bike.png';

export const createBikeMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = bikeMarkerImageUrl;
  image.alt = '';
  image.className = 'h-7 w-7 object-contain md:h-9 md:w-9';

  return image;
};
