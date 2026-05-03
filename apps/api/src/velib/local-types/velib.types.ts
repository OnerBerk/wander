export interface VelibStationRaw {
  stationcode: string;
  name: string;
  is_installed: 'OUI' | 'NON';
  capacity: number;
  numdocksavailable: number;
  numbikesavailable: number;
  mechanical: number;
  ebike: number;
  is_renting: 'OUI' | 'NON';
  is_returning: 'OUI' | 'NON';
  duedate: string;
  coordonnees_geo: {lat: number; lon: number} | null;
  nom_arrondissement_communes: string;
  code_insee_commune: string;
  station_opening_hours: string | null;
}

export interface VelibApiResponse {
  total_count: number;
  results: VelibStationRaw[];
}
