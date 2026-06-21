/**
 * Découpage IDF pour l'ingestion des events Que Faire à Paris.
 * Chaque zone = un point (lat/lng) + un rayon en km.
 * Grande couronne : 1 zone par département (faible densité d'events).
 * Petite couronne : 2 zones par département (densité moyenne → coupé nord/sud ou est/ouest).
 * Paris : 2 zones par arrondissement (haute densité → coupé nord/sud).
 */

export interface GeoZone {
  id: string;
  label: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

// ─── GRANDE COURONNE ────────────────────────────────────────────────────────
// 1 zone par département, rayon large (~20-30 km)

const grandeCouronne: GeoZone[] = [
  // Seine-et-Marne (77) — vaste, centre autour de Melun
  { id: 'dep-77', label: 'Seine-et-Marne', lat: 48.5388, lng: 2.6589, radiusKm: 40 },

  // Yvelines (78) — centre autour de Versailles
  { id: 'dep-78', label: 'Yvelines', lat: 48.8014, lng: 1.9875, radiusKm: 30 },

  // Essonne (91) — centre autour de Évry-Courcouronnes
  { id: 'dep-91', label: 'Essonne', lat: 48.6273, lng: 2.4444, radiusKm: 25 },

  // Val-d'Oise (95) — centre autour de Cergy
  { id: 'dep-95', label: "Val-d'Oise", lat: 49.036, lng: 2.0761, radiusKm: 25 },
];

// ─── PETITE COURONNE ─────────────────────────────────────────────────────────
// 2 zones par département, coupé nord/sud, rayon ~8-10 km

const petiteCouronne: GeoZone[] = [
  // Hauts-de-Seine (92)
  { id: 'dep-92-nord', label: 'Hauts-de-Seine Nord', lat: 48.92, lng: 2.25, radiusKm: 8 },
  { id: 'dep-92-sud', label: 'Hauts-de-Seine Sud', lat: 48.82, lng: 2.23, radiusKm: 8 },

  // Seine-Saint-Denis (93)
  { id: 'dep-93-nord', label: 'Seine-Saint-Denis Nord', lat: 48.96, lng: 2.47, radiusKm: 8 },
  { id: 'dep-93-sud', label: 'Seine-Saint-Denis Sud', lat: 48.89, lng: 2.43, radiusKm: 8 },

  // Val-de-Marne (94)
  { id: 'dep-94-nord', label: 'Val-de-Marne Nord', lat: 48.82, lng: 2.47, radiusKm: 8 },
  { id: 'dep-94-sud', label: 'Val-de-Marne Sud', lat: 48.76, lng: 2.46, radiusKm: 8 },
];

// ─── PARIS — 20 ARRONDISSEMENTS × 2 ZONES ───────────────────────────────────
// Coupé nord/sud, rayon ~1.2 km par demi-arrondissement

const parisArrondissements: GeoZone[] = [
  // 1er
  { id: 'arr-01-n', label: '1er Nord', lat: 48.862, lng: 2.345, radiusKm: 1.2 },
  { id: 'arr-01-s', label: '1er Sud', lat: 48.856, lng: 2.345, radiusKm: 1.2 },
  // 2e
  { id: 'arr-02-n', label: '2e Nord', lat: 48.868, lng: 2.347, radiusKm: 1.2 },
  { id: 'arr-02-s', label: '2e Sud', lat: 48.863, lng: 2.35, radiusKm: 1.2 },
  // 3e
  { id: 'arr-03-n', label: '3e Nord', lat: 48.864, lng: 2.359, radiusKm: 1.2 },
  { id: 'arr-03-s', label: '3e Sud', lat: 48.859, lng: 2.361, radiusKm: 1.2 },
  // 4e
  { id: 'arr-04-n', label: '4e Nord', lat: 48.856, lng: 2.353, radiusKm: 1.2 },
  { id: 'arr-04-s', label: '4e Sud', lat: 48.851, lng: 2.357, radiusKm: 1.2 },
  // 5e
  { id: 'arr-05-n', label: '5e Nord', lat: 48.852, lng: 2.349, radiusKm: 1.2 },
  { id: 'arr-05-s', label: '5e Sud', lat: 48.846, lng: 2.352, radiusKm: 1.2 },
  // 6e
  { id: 'arr-06-n', label: '6e Nord', lat: 48.852, lng: 2.334, radiusKm: 1.2 },
  { id: 'arr-06-s', label: '6e Sud', lat: 48.846, lng: 2.336, radiusKm: 1.2 },
  // 7e
  { id: 'arr-07-n', label: '7e Nord', lat: 48.859, lng: 2.313, radiusKm: 1.2 },
  { id: 'arr-07-s', label: '7e Sud', lat: 48.851, lng: 2.308, radiusKm: 1.2 },
  // 8e
  { id: 'arr-08-n', label: '8e Nord', lat: 48.878, lng: 2.312, radiusKm: 1.2 },
  { id: 'arr-08-s', label: '8e Sud', lat: 48.871, lng: 2.31, radiusKm: 1.2 },
  // 9e
  { id: 'arr-09-n', label: '9e Nord', lat: 48.883, lng: 2.338, radiusKm: 1.2 },
  { id: 'arr-09-s', label: '9e Sud', lat: 48.877, lng: 2.336, radiusKm: 1.2 },
  // 10e
  { id: 'arr-10-n', label: '10e Nord', lat: 48.88, lng: 2.362, radiusKm: 1.2 },
  { id: 'arr-10-s', label: '10e Sud', lat: 48.872, lng: 2.36, radiusKm: 1.2 },
  // 11e
  { id: 'arr-11-n', label: '11e Nord', lat: 48.865, lng: 2.379, radiusKm: 1.2 },
  { id: 'arr-11-s', label: '11e Sud', lat: 48.856, lng: 2.378, radiusKm: 1.2 },
  // 12e
  { id: 'arr-12-n', label: '12e Nord', lat: 48.849, lng: 2.39, radiusKm: 1.2 },
  { id: 'arr-12-s', label: '12e Sud', lat: 48.839, lng: 2.402, radiusKm: 1.2 },
  // 13e
  { id: 'arr-13-n', label: '13e Nord', lat: 48.838, lng: 2.357, radiusKm: 1.2 },
  { id: 'arr-13-s', label: '13e Sud', lat: 48.828, lng: 2.361, radiusKm: 1.2 },
  // 14e
  { id: 'arr-14-n', label: '14e Nord', lat: 48.836, lng: 2.328, radiusKm: 1.2 },
  { id: 'arr-14-s', label: '14e Sud', lat: 48.826, lng: 2.325, radiusKm: 1.2 },
  // 15e
  { id: 'arr-15-n', label: '15e Nord', lat: 48.848, lng: 2.296, radiusKm: 1.2 },
  { id: 'arr-15-s', label: '15e Sud', lat: 48.836, lng: 2.299, radiusKm: 1.2 },
  // 16e
  { id: 'arr-16-n', label: '16e Nord', lat: 48.868, lng: 2.278, radiusKm: 1.2 },
  { id: 'arr-16-s', label: '16e Sud', lat: 48.849, lng: 2.265, radiusKm: 1.2 },
  // 17e
  { id: 'arr-17-n', label: '17e Nord', lat: 48.895, lng: 2.321, radiusKm: 1.2 },
  { id: 'arr-17-s', label: '17e Sud', lat: 48.884, lng: 2.316, radiusKm: 1.2 },
  // 18e
  { id: 'arr-18-n', label: '18e Nord', lat: 48.894, lng: 2.349, radiusKm: 1.2 },
  { id: 'arr-18-s', label: '18e Sud', lat: 48.884, lng: 2.349, radiusKm: 1.2 },
  // 19e
  { id: 'arr-19-n', label: '19e Nord', lat: 48.889, lng: 2.383, radiusKm: 1.2 },
  { id: 'arr-19-s', label: '19e Sud', lat: 48.878, lng: 2.379, radiusKm: 1.2 },
  // 20e
  { id: 'arr-20-n', label: '20e Nord', lat: 48.872, lng: 2.4, radiusKm: 1.2 },
  { id: 'arr-20-s', label: '20e Sud', lat: 48.861, lng: 2.399, radiusKm: 1.2 },
];

export const IDF_ZONES: GeoZone[] = [...grandeCouronne, ...petiteCouronne, ...parisArrondissements];
