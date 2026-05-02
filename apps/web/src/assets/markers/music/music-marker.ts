import musicMarkerImageUrl from './music-marker.png';

export const createMusicMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = musicMarkerImageUrl;
  image.alt = '';
  image.className = 'h-14 w-14 object-contain';

  return image;
};
