import z from 'zod';

export const parisEventRawSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  lead_text: z.string().nullable(),
  description: z.string().nullable(),
  date_start: z.string(),
  date_end: z.string().nullable(),
  occurrences: z.string().nullable(),
  cover_url: z.string().nullable(),
  cover_alt: z.string().nullable(),
  price_type: z.string().nullable(),
  price_detail: z.string().nullable(),
  qfap_tags: z.string().nullable(),
  address_name: z.string().nullable(),
  address_street: z.string().nullable(),
  address_zipcode: z.string().nullable(),
  address_city: z.string().nullable(),
  lat_lon: z.object({ lat: z.number(), lon: z.number() }),
  audience: z.string().nullable(),
  event_indoor: z.number(),
  event_pets_allowed: z.number(),
  contact_url: z.string().nullable(),
  contact_phone: z.string().nullable(),
  access_type: z.string().nullable(),
  access_link: z.string().nullable(),
});

export const parisEventsApiResponseSchema = z.object({
  total_count: z.number(),
  results: z.array(parisEventRawSchema),
});

export type ParisEventRaw = z.infer<typeof parisEventRawSchema>;
export type ParisEventsApiResponse = z.infer<typeof parisEventsApiResponseSchema>;
