export type InvadersOverpassElement = {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags: {
    ref?: string;
    artist_name?: string;
    artwork_type?: string;
    artwork_subject?: string;
    tourism?: string;
    panoramax?: string;
    website?: string;
    description?: string;
    'artist:wikidata'?: string;
    'artist:wikipedia'?: string;
    indoor?: string;
    support?: string;
    'survey:date'?: string;
    source?: string;
    'contact:street'?: string;
    'contact:housenumber'?: string;
    'contact:postcode'?: string;
    'contact:city'?: string;
  };
};
