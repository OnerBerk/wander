export interface ParisEventRaw {
  id: string;
  url: string;
  title: string;
  lead_text: string;
  date_start: string | null;
  date_end: string | null;
  occurrences: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  price_type: 'gratuit' | 'payant' | null;
  price_detail: string | null;
  qfap_tags: string | null;
  address_name: string;
  address_street: string;
  address_zipcode: string;
  address_city: string;
  lat_lon: {lat: number; lon: number} | null;
  audience: string | null;
  event_indoor: number;
  event_pets_allowed: number;
  contact_url: string | null;
  contact_phone: string | null;
  access_type: string | null;
  access_link: string | null;
}

export interface ParisEventsApiResponse {
  total_count: number;
  results: ParisEventRaw[];
}

export type FieldMapper = Record<string, (value: string) => string>;
