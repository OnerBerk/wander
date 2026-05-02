import defaultMarkerImageUrl from './marker-default.png';

export const createDefaultMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = defaultMarkerImageUrl;
  image.alt = '';
  image.className = 'h-14 w-14 object-contain';

  return image;
};
