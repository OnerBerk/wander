import defaultMarkerImageUrl from './marker-default.png';

export const createDefaultMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = defaultMarkerImageUrl;
  image.alt = '';
  image.className = 'h-11 w-11 object-contain';

  return image;
};
