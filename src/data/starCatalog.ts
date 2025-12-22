import { Star, Constellation } from '@/lib/astronomy';

// Bright stars catalog (subset of Yale Bright Star Catalog)
// RA in hours, Dec in degrees, Magnitude (apparent)
export const brightStars: Star[] = [
  // Orion
  { id: 'betelgeuse', name: 'Betelgeuse', ra: 5.92, dec: 7.41, magnitude: 0.5, spectralType: 'M', constellation: 'Ori' },
  { id: 'rigel', name: 'Rigel', ra: 5.24, dec: -8.20, magnitude: 0.13, spectralType: 'B', constellation: 'Ori' },
  { id: 'bellatrix', name: 'Bellatrix', ra: 5.42, dec: 6.35, magnitude: 1.64, spectralType: 'B', constellation: 'Ori' },
  { id: 'alnilam', name: 'Alnilam', ra: 5.60, dec: -1.20, magnitude: 1.69, spectralType: 'B', constellation: 'Ori' },
  { id: 'alnitak', name: 'Alnitak', ra: 5.68, dec: -1.94, magnitude: 1.77, spectralType: 'O', constellation: 'Ori' },
  { id: 'mintaka', name: 'Mintaka', ra: 5.53, dec: -0.30, magnitude: 2.23, spectralType: 'B', constellation: 'Ori' },
  { id: 'saiph', name: 'Saiph', ra: 5.80, dec: -9.67, magnitude: 2.06, spectralType: 'B', constellation: 'Ori' },
  
  // Ursa Major (Big Dipper)
  { id: 'dubhe', name: 'Dubhe', ra: 11.06, dec: 61.75, magnitude: 1.79, spectralType: 'K', constellation: 'UMa' },
  { id: 'merak', name: 'Merak', ra: 11.03, dec: 56.38, magnitude: 2.37, spectralType: 'A', constellation: 'UMa' },
  { id: 'phecda', name: 'Phecda', ra: 11.90, dec: 53.69, magnitude: 2.44, spectralType: 'A', constellation: 'UMa' },
  { id: 'megrez', name: 'Megrez', ra: 12.26, dec: 57.03, magnitude: 3.31, spectralType: 'A', constellation: 'UMa' },
  { id: 'alioth', name: 'Alioth', ra: 12.90, dec: 55.96, magnitude: 1.77, spectralType: 'A', constellation: 'UMa' },
  { id: 'mizar', name: 'Mizar', ra: 13.40, dec: 54.93, magnitude: 2.27, spectralType: 'A', constellation: 'UMa' },
  { id: 'alkaid', name: 'Alkaid', ra: 13.79, dec: 49.31, magnitude: 1.86, spectralType: 'B', constellation: 'UMa' },
  
  // Cassiopeia
  { id: 'schedar', name: 'Schedar', ra: 0.68, dec: 56.54, magnitude: 2.24, spectralType: 'K', constellation: 'Cas' },
  { id: 'caph', name: 'Caph', ra: 0.15, dec: 59.15, magnitude: 2.28, spectralType: 'F', constellation: 'Cas' },
  { id: 'gamma-cas', name: 'Gamma Cas', ra: 0.95, dec: 60.72, magnitude: 2.47, spectralType: 'B', constellation: 'Cas' },
  { id: 'ruchbah', name: 'Ruchbah', ra: 1.43, dec: 60.24, magnitude: 2.68, spectralType: 'A', constellation: 'Cas' },
  { id: 'segin', name: 'Segin', ra: 1.91, dec: 63.67, magnitude: 3.37, spectralType: 'B', constellation: 'Cas' },
  
  // Scorpius
  { id: 'antares', name: 'Antares', ra: 16.49, dec: -26.43, magnitude: 0.96, spectralType: 'M', constellation: 'Sco' },
  { id: 'shaula', name: 'Shaula', ra: 17.56, dec: -37.10, magnitude: 1.63, spectralType: 'B', constellation: 'Sco' },
  { id: 'sargas', name: 'Sargas', ra: 17.62, dec: -42.99, magnitude: 1.87, spectralType: 'F', constellation: 'Sco' },
  
  // Lyra
  { id: 'vega', name: 'Vega', ra: 18.62, dec: 38.78, magnitude: 0.03, spectralType: 'A', constellation: 'Lyr' },
  
  // Cygnus
  { id: 'deneb', name: 'Deneb', ra: 20.69, dec: 45.28, magnitude: 1.25, spectralType: 'A', constellation: 'Cyg' },
  { id: 'sadr', name: 'Sadr', ra: 20.37, dec: 40.26, magnitude: 2.23, spectralType: 'F', constellation: 'Cyg' },
  { id: 'albireo', name: 'Albireo', ra: 19.51, dec: 27.96, magnitude: 3.08, spectralType: 'K', constellation: 'Cyg' },
  
  // Aquila
  { id: 'altair', name: 'Altair', ra: 19.85, dec: 8.87, magnitude: 0.77, spectralType: 'A', constellation: 'Aql' },
  
  // Leo
  { id: 'regulus', name: 'Regulus', ra: 10.14, dec: 11.97, magnitude: 1.35, spectralType: 'B', constellation: 'Leo' },
  { id: 'denebola', name: 'Denebola', ra: 11.82, dec: 14.57, magnitude: 2.14, spectralType: 'A', constellation: 'Leo' },
  
  // Virgo
  { id: 'spica', name: 'Spica', ra: 13.42, dec: -11.16, magnitude: 0.97, spectralType: 'B', constellation: 'Vir' },
  
  // Canis Major
  { id: 'sirius', name: 'Sirius', ra: 6.75, dec: -16.72, magnitude: -1.46, spectralType: 'A', constellation: 'CMa' },
  { id: 'mirzam', name: 'Mirzam', ra: 6.38, dec: -17.96, magnitude: 1.98, spectralType: 'B', constellation: 'CMa' },
  { id: 'wezen', name: 'Wezen', ra: 7.14, dec: -26.39, magnitude: 1.84, spectralType: 'F', constellation: 'CMa' },
  { id: 'adhara', name: 'Adhara', ra: 6.98, dec: -28.97, magnitude: 1.50, spectralType: 'B', constellation: 'CMa' },
  
  // Canis Minor
  { id: 'procyon', name: 'Procyon', ra: 7.66, dec: 5.22, magnitude: 0.34, spectralType: 'F', constellation: 'CMi' },
  
  // Gemini
  { id: 'pollux', name: 'Pollux', ra: 7.76, dec: 28.03, magnitude: 1.14, spectralType: 'K', constellation: 'Gem' },
  { id: 'castor', name: 'Castor', ra: 7.58, dec: 31.89, magnitude: 1.58, spectralType: 'A', constellation: 'Gem' },
  
  // Taurus
  { id: 'aldebaran', name: 'Aldebaran', ra: 4.60, dec: 16.51, magnitude: 0.85, spectralType: 'K', constellation: 'Tau' },
  { id: 'elnath', name: 'El Nath', ra: 5.44, dec: 28.61, magnitude: 1.65, spectralType: 'B', constellation: 'Tau' },
  
  // Auriga
  { id: 'capella', name: 'Capella', ra: 5.28, dec: 45.99, magnitude: 0.08, spectralType: 'G', constellation: 'Aur' },
  
  // Perseus
  { id: 'mirfak', name: 'Mirfak', ra: 3.41, dec: 49.86, magnitude: 1.79, spectralType: 'F', constellation: 'Per' },
  { id: 'algol', name: 'Algol', ra: 3.14, dec: 40.96, magnitude: 2.12, spectralType: 'B', constellation: 'Per' },
  
  // Bootes
  { id: 'arcturus', name: 'Arcturus', ra: 14.26, dec: 19.18, magnitude: -0.05, spectralType: 'K', constellation: 'Boo' },
  
  // Centaurus
  { id: 'alpha-centauri', name: 'Alpha Centauri', ra: 14.66, dec: -60.83, magnitude: -0.27, spectralType: 'G', constellation: 'Cen' },
  { id: 'hadar', name: 'Hadar', ra: 14.06, dec: -60.37, magnitude: 0.61, spectralType: 'B', constellation: 'Cen' },
  
  // Crux (Southern Cross)
  { id: 'acrux', name: 'Acrux', ra: 12.44, dec: -63.10, magnitude: 0.76, spectralType: 'B', constellation: 'Cru' },
  { id: 'gacrux', name: 'Gacrux', ra: 12.52, dec: -57.11, magnitude: 1.63, spectralType: 'M', constellation: 'Cru' },
  { id: 'mimosa', name: 'Mimosa', ra: 12.80, dec: -59.69, magnitude: 1.25, spectralType: 'B', constellation: 'Cru' },
  
  // Carina
  { id: 'canopus', name: 'Canopus', ra: 6.40, dec: -52.70, magnitude: -0.72, spectralType: 'F', constellation: 'Car' },
  
  // Eridanus
  { id: 'achernar', name: 'Achernar', ra: 1.63, dec: -57.24, magnitude: 0.46, spectralType: 'B', constellation: 'Eri' },
  
  // Piscis Austrinus
  { id: 'fomalhaut', name: 'Fomalhaut', ra: 22.96, dec: -29.62, magnitude: 1.16, spectralType: 'A', constellation: 'PsA' },
  
  // Pegasus
  { id: 'enif', name: 'Enif', ra: 21.74, dec: 9.88, magnitude: 2.39, spectralType: 'K', constellation: 'Peg' },
  { id: 'markab', name: 'Markab', ra: 23.08, dec: 15.21, magnitude: 2.49, spectralType: 'B', constellation: 'Peg' },
  { id: 'scheat', name: 'Scheat', ra: 23.06, dec: 28.08, magnitude: 2.42, spectralType: 'M', constellation: 'Peg' },
  { id: 'algenib', name: 'Algenib', ra: 0.22, dec: 15.18, magnitude: 2.83, spectralType: 'B', constellation: 'Peg' },
  
  // Andromeda
  { id: 'alpheratz', name: 'Alpheratz', ra: 0.14, dec: 29.09, magnitude: 2.06, spectralType: 'B', constellation: 'And' },
  { id: 'mirach', name: 'Mirach', ra: 1.16, dec: 35.62, magnitude: 2.06, spectralType: 'M', constellation: 'And' },
  { id: 'almach', name: 'Almach', ra: 2.06, dec: 42.33, magnitude: 2.26, spectralType: 'K', constellation: 'And' },
  
  // Polaris and nearby
  { id: 'polaris', name: 'Polaris', ra: 2.53, dec: 89.26, magnitude: 2.02, spectralType: 'F', constellation: 'UMi' },
  { id: 'kochab', name: 'Kochab', ra: 14.85, dec: 74.16, magnitude: 2.08, spectralType: 'K', constellation: 'UMi' },
];

// Generate additional fainter stars for a richer sky
export const generateBackgroundStars = (count: number): Star[] => {
  const stars: Star[] = [];
  const spectralTypes: Array<'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M'> = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
  const typeWeights = [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.24]; // Approximate stellar distribution
  
  for (let i = 0; i < count; i++) {
    const ra = Math.random() * 24;
    const dec = Math.asin(Math.random() * 2 - 1) * (180 / Math.PI);
    
    // Random magnitude between 2 and 6 (fainter stars)
    const magnitude = 2 + Math.random() * 4;
    
    // Random spectral type with weighted distribution
    let rand = Math.random();
    let cumulative = 0;
    let spectralType: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' = 'G';
    for (let j = 0; j < typeWeights.length; j++) {
      cumulative += typeWeights[j];
      if (rand < cumulative) {
        spectralType = spectralTypes[j];
        break;
      }
    }
    
    stars.push({
      id: `bg-${i}`,
      ra,
      dec,
      magnitude,
      spectralType
    });
  }
  
  return stars;
};

// Constellation line data
export const constellations: Constellation[] = [
  {
    id: 'ori',
    name: 'Orion',
    abbr: 'Ori',
    stars: ['betelgeuse', 'rigel', 'bellatrix', 'alnilam', 'alnitak', 'mintaka', 'saiph'],
    lines: [
      ['betelgeuse', 'bellatrix'],
      ['betelgeuse', 'alnilam'],
      ['bellatrix', 'mintaka'],
      ['alnilam', 'alnitak'],
      ['alnilam', 'mintaka'],
      ['alnitak', 'saiph'],
      ['rigel', 'saiph'],
      ['rigel', 'alnilam'],
    ]
  },
  {
    id: 'uma',
    name: 'Ursa Major',
    abbr: 'UMa',
    stars: ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'],
    lines: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
    ]
  },
  {
    id: 'cas',
    name: 'Cassiopeia',
    abbr: 'Cas',
    stars: ['schedar', 'caph', 'gamma-cas', 'ruchbah', 'segin'],
    lines: [
      ['caph', 'schedar'],
      ['schedar', 'gamma-cas'],
      ['gamma-cas', 'ruchbah'],
      ['ruchbah', 'segin'],
    ]
  },
  {
    id: 'cyg',
    name: 'Cygnus',
    abbr: 'Cyg',
    stars: ['deneb', 'sadr', 'albireo'],
    lines: [
      ['deneb', 'sadr'],
      ['sadr', 'albireo'],
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    abbr: 'Leo',
    stars: ['regulus', 'denebola'],
    lines: [
      ['regulus', 'denebola'],
    ]
  },
  {
    id: 'gem',
    name: 'Gemini',
    abbr: 'Gem',
    stars: ['pollux', 'castor'],
    lines: [
      ['pollux', 'castor'],
    ]
  },
  {
    id: 'peg',
    name: 'Pegasus',
    abbr: 'Peg',
    stars: ['enif', 'markab', 'scheat', 'algenib'],
    lines: [
      ['markab', 'scheat'],
      ['scheat', 'algenib'],
      ['algenib', 'markab'],
      ['markab', 'enif'],
    ]
  },
  {
    id: 'and',
    name: 'Andromeda',
    abbr: 'And',
    stars: ['alpheratz', 'mirach', 'almach'],
    lines: [
      ['alpheratz', 'mirach'],
      ['mirach', 'almach'],
    ]
  },
];

// Deep sky objects (nebulae, galaxies, clusters)
export interface DeepSkyObject {
  id: string;
  name: string;
  type: 'nebula' | 'galaxy' | 'cluster' | 'planetary';
  ra: number;
  dec: number;
  magnitude: number;
  size: number; // Apparent size in arcminutes
  description: string;
}

export const deepSkyObjects: DeepSkyObject[] = [
  { id: 'm31', name: 'Andromeda Galaxy', type: 'galaxy', ra: 0.71, dec: 41.27, magnitude: 3.4, size: 180, description: 'Nearest major galaxy, 2.5 million light-years away' },
  { id: 'm42', name: 'Orion Nebula', type: 'nebula', ra: 5.59, dec: -5.39, magnitude: 4.0, size: 85, description: 'Bright emission nebula visible to naked eye' },
  { id: 'm45', name: 'Pleiades', type: 'cluster', ra: 3.79, dec: 24.12, magnitude: 1.6, size: 110, description: 'The Seven Sisters, bright open star cluster' },
  { id: 'm13', name: 'Hercules Cluster', type: 'cluster', ra: 16.69, dec: 36.46, magnitude: 5.8, size: 20, description: 'Great globular cluster in Hercules' },
  { id: 'm57', name: 'Ring Nebula', type: 'planetary', ra: 18.89, dec: 33.03, magnitude: 8.8, size: 1.4, description: 'Famous planetary nebula in Lyra' },
  { id: 'ngc7000', name: 'North America Nebula', type: 'nebula', ra: 20.98, dec: 44.33, magnitude: 4.0, size: 120, description: 'Large emission nebula near Deneb' },
  { id: 'm33', name: 'Triangulum Galaxy', type: 'galaxy', ra: 1.56, dec: 30.66, magnitude: 5.7, size: 70, description: 'Third-largest member of Local Group' },
  { id: 'm1', name: 'Crab Nebula', type: 'nebula', ra: 5.58, dec: 22.01, magnitude: 8.4, size: 6, description: 'Supernova remnant from 1054 AD' },
];

// All stars combined
export const allStars = [...brightStars, ...generateBackgroundStars(2500)];
