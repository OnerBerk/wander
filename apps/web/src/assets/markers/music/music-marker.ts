import musicMarkerImageUrl from './music-marker.png';

export const createMusicMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = musicMarkerImageUrl;
  image.alt = '';
  image.className = 'h-11 w-11 object-contain';

  return image;
};
