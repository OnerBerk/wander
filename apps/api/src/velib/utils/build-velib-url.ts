import {GeoDto} from '../../common-dtos/geo.dto';

const BASE_URL =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records';

export const buildVelibUrl = (query: GeoDto): string => {
  const conditions: string[] = [
    `within_distance(coordonnees_geo, geom'POINT(${query.lng} ${query.lat})', ${query.radius}km)`,
  ];

  const params = new URLSearchParams({
    where: conditions.join(' AND '),
    limit: '100',
  });

  return `${BASE_URL}?${params.toString()}`;
};
