import treeMarkerImageUrl from './marker-tree.png';

export const createTreeMarkerElement = (): HTMLElement => {
  const image = document.createElement('img');

  image.src = treeMarkerImageUrl;
  image.alt = '';
  image.className = 'h-11 w-11 object-contain';

  return image;
};
