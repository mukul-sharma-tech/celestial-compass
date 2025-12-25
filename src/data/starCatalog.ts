import { Star, Constellation } from '@/lib/astronomy';

// Bright stars catalog (extended Yale Bright Star Catalog)
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
  { id: 'dschubba', name: 'Dschubba', ra: 16.01, dec: -22.62, magnitude: 2.32, spectralType: 'B', constellation: 'Sco' },
  { id: 'graffias', name: 'Graffias', ra: 16.09, dec: -19.81, magnitude: 2.64, spectralType: 'B', constellation: 'Sco' },
  
  // Lyra
  { id: 'vega', name: 'Vega', ra: 18.62, dec: 38.78, magnitude: 0.03, spectralType: 'A', constellation: 'Lyr' },
  { id: 'sheliak', name: 'Sheliak', ra: 18.83, dec: 33.36, magnitude: 3.52, spectralType: 'A', constellation: 'Lyr' },
  { id: 'sulafat', name: 'Sulafat', ra: 18.98, dec: 32.69, magnitude: 3.25, spectralType: 'B', constellation: 'Lyr' },
  
  // Cygnus
  { id: 'deneb', name: 'Deneb', ra: 20.69, dec: 45.28, magnitude: 1.25, spectralType: 'A', constellation: 'Cyg' },
  { id: 'sadr', name: 'Sadr', ra: 20.37, dec: 40.26, magnitude: 2.23, spectralType: 'F', constellation: 'Cyg' },
  { id: 'albireo', name: 'Albireo', ra: 19.51, dec: 27.96, magnitude: 3.08, spectralType: 'K', constellation: 'Cyg' },
  { id: 'gienah-cyg', name: 'Gienah', ra: 20.77, dec: 33.97, magnitude: 2.48, spectralType: 'K', constellation: 'Cyg' },
  
  // Aquila
  { id: 'altair', name: 'Altair', ra: 19.85, dec: 8.87, magnitude: 0.77, spectralType: 'A', constellation: 'Aql' },
  { id: 'tarazed', name: 'Tarazed', ra: 19.77, dec: 10.61, magnitude: 2.72, spectralType: 'K', constellation: 'Aql' },
  { id: 'alshain', name: 'Alshain', ra: 19.92, dec: 6.41, magnitude: 3.71, spectralType: 'G', constellation: 'Aql' },
  
  // Leo
  { id: 'regulus', name: 'Regulus', ra: 10.14, dec: 11.97, magnitude: 1.35, spectralType: 'B', constellation: 'Leo' },
  { id: 'denebola', name: 'Denebola', ra: 11.82, dec: 14.57, magnitude: 2.14, spectralType: 'A', constellation: 'Leo' },
  { id: 'algieba', name: 'Algieba', ra: 10.33, dec: 19.84, magnitude: 2.01, spectralType: 'K', constellation: 'Leo' },
  { id: 'zosma', name: 'Zosma', ra: 11.24, dec: 20.52, magnitude: 2.56, spectralType: 'A', constellation: 'Leo' },
  
  // Virgo
  { id: 'spica', name: 'Spica', ra: 13.42, dec: -11.16, magnitude: 0.97, spectralType: 'B', constellation: 'Vir' },
  { id: 'porrima', name: 'Porrima', ra: 12.69, dec: -1.45, magnitude: 2.74, spectralType: 'F', constellation: 'Vir' },
  { id: 'vindemiatrix', name: 'Vindemiatrix', ra: 13.04, dec: 10.96, magnitude: 2.83, spectralType: 'G', constellation: 'Vir' },
  
  // Canis Major
  { id: 'sirius', name: 'Sirius', ra: 6.75, dec: -16.72, magnitude: -1.46, spectralType: 'A', constellation: 'CMa' },
  { id: 'mirzam', name: 'Mirzam', ra: 6.38, dec: -17.96, magnitude: 1.98, spectralType: 'B', constellation: 'CMa' },
  { id: 'wezen', name: 'Wezen', ra: 7.14, dec: -26.39, magnitude: 1.84, spectralType: 'F', constellation: 'CMa' },
  { id: 'adhara', name: 'Adhara', ra: 6.98, dec: -28.97, magnitude: 1.50, spectralType: 'B', constellation: 'CMa' },
  { id: 'aludra', name: 'Aludra', ra: 7.40, dec: -29.30, magnitude: 2.45, spectralType: 'B', constellation: 'CMa' },
  
  // Canis Minor
  { id: 'procyon', name: 'Procyon', ra: 7.66, dec: 5.22, magnitude: 0.34, spectralType: 'F', constellation: 'CMi' },
  { id: 'gomeisa', name: 'Gomeisa', ra: 7.45, dec: 8.29, magnitude: 2.90, spectralType: 'B', constellation: 'CMi' },
  
  // Gemini
  { id: 'pollux', name: 'Pollux', ra: 7.76, dec: 28.03, magnitude: 1.14, spectralType: 'K', constellation: 'Gem' },
  { id: 'castor', name: 'Castor', ra: 7.58, dec: 31.89, magnitude: 1.58, spectralType: 'A', constellation: 'Gem' },
  { id: 'alhena', name: 'Alhena', ra: 6.63, dec: 16.40, magnitude: 1.93, spectralType: 'A', constellation: 'Gem' },
  { id: 'wasat', name: 'Wasat', ra: 7.07, dec: 21.98, magnitude: 3.53, spectralType: 'F', constellation: 'Gem' },
  { id: 'mebsuta', name: 'Mebsuta', ra: 6.73, dec: 25.13, magnitude: 3.06, spectralType: 'G', constellation: 'Gem' },
  
  // Taurus
  { id: 'aldebaran', name: 'Aldebaran', ra: 4.60, dec: 16.51, magnitude: 0.85, spectralType: 'K', constellation: 'Tau' },
  { id: 'elnath', name: 'El Nath', ra: 5.44, dec: 28.61, magnitude: 1.65, spectralType: 'B', constellation: 'Tau' },
  { id: 'alcyone', name: 'Alcyone', ra: 3.79, dec: 24.11, magnitude: 2.87, spectralType: 'B', constellation: 'Tau' },
  { id: 'electra', name: 'Electra', ra: 3.75, dec: 24.11, magnitude: 3.70, spectralType: 'B', constellation: 'Tau' },
  { id: 'maia', name: 'Maia', ra: 3.76, dec: 24.37, magnitude: 3.87, spectralType: 'B', constellation: 'Tau' },
  
  // Auriga
  { id: 'capella', name: 'Capella', ra: 5.28, dec: 45.99, magnitude: 0.08, spectralType: 'G', constellation: 'Aur' },
  { id: 'menkalinan', name: 'Menkalinan', ra: 5.99, dec: 44.95, magnitude: 1.90, spectralType: 'A', constellation: 'Aur' },
  { id: 'mahasim', name: 'Mahasim', ra: 5.99, dec: 37.21, magnitude: 2.62, spectralType: 'A', constellation: 'Aur' },
  
  // Perseus
  { id: 'mirfak', name: 'Mirfak', ra: 3.41, dec: 49.86, magnitude: 1.79, spectralType: 'F', constellation: 'Per' },
  { id: 'algol', name: 'Algol', ra: 3.14, dec: 40.96, magnitude: 2.12, spectralType: 'B', constellation: 'Per' },
  
  // Bootes
  { id: 'arcturus', name: 'Arcturus', ra: 14.26, dec: 19.18, magnitude: -0.05, spectralType: 'K', constellation: 'Boo' },
  { id: 'izar', name: 'Izar', ra: 14.75, dec: 27.07, magnitude: 2.37, spectralType: 'K', constellation: 'Boo' },
  { id: 'muphrid', name: 'Muphrid', ra: 13.91, dec: 18.40, magnitude: 2.68, spectralType: 'G', constellation: 'Boo' },
  
  // Centaurus
  { id: 'alpha-centauri', name: 'Alpha Centauri', ra: 14.66, dec: -60.83, magnitude: -0.27, spectralType: 'G', constellation: 'Cen' },
  { id: 'hadar', name: 'Hadar', ra: 14.06, dec: -60.37, magnitude: 0.61, spectralType: 'B', constellation: 'Cen' },
  { id: 'menkent', name: 'Menkent', ra: 14.11, dec: -36.37, magnitude: 2.06, spectralType: 'K', constellation: 'Cen' },
  
  // Crux (Southern Cross)
  { id: 'acrux', name: 'Acrux', ra: 12.44, dec: -63.10, magnitude: 0.76, spectralType: 'B', constellation: 'Cru' },
  { id: 'gacrux', name: 'Gacrux', ra: 12.52, dec: -57.11, magnitude: 1.63, spectralType: 'M', constellation: 'Cru' },
  { id: 'mimosa', name: 'Mimosa', ra: 12.80, dec: -59.69, magnitude: 1.25, spectralType: 'B', constellation: 'Cru' },
  { id: 'imai', name: 'Imai', ra: 12.35, dec: -58.75, magnitude: 2.79, spectralType: 'B', constellation: 'Cru' },
  
  // Carina
  { id: 'canopus', name: 'Canopus', ra: 6.40, dec: -52.70, magnitude: -0.72, spectralType: 'F', constellation: 'Car' },
  { id: 'miaplacidus', name: 'Miaplacidus', ra: 9.22, dec: -69.72, magnitude: 1.68, spectralType: 'A', constellation: 'Car' },
  { id: 'avior', name: 'Avior', ra: 8.38, dec: -59.51, magnitude: 1.86, spectralType: 'K', constellation: 'Car' },
  
  // Eridanus
  { id: 'achernar', name: 'Achernar', ra: 1.63, dec: -57.24, magnitude: 0.46, spectralType: 'B', constellation: 'Eri' },
  { id: 'cursa', name: 'Cursa', ra: 5.13, dec: -5.09, magnitude: 2.79, spectralType: 'A', constellation: 'Eri' },
  
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
  
  // Ursa Minor
  { id: 'polaris', name: 'Polaris', ra: 2.53, dec: 89.26, magnitude: 2.02, spectralType: 'F', constellation: 'UMi' },
  { id: 'kochab', name: 'Kochab', ra: 14.85, dec: 74.16, magnitude: 2.08, spectralType: 'K', constellation: 'UMi' },
  { id: 'pherkad', name: 'Pherkad', ra: 15.35, dec: 71.83, magnitude: 3.00, spectralType: 'A', constellation: 'UMi' },
  
  // Draco
  { id: 'eltanin', name: 'Eltanin', ra: 17.94, dec: 51.49, magnitude: 2.23, spectralType: 'K', constellation: 'Dra' },
  { id: 'rastaban', name: 'Rastaban', ra: 17.51, dec: 52.30, magnitude: 2.79, spectralType: 'G', constellation: 'Dra' },
  { id: 'thuban', name: 'Thuban', ra: 14.07, dec: 64.38, magnitude: 3.65, spectralType: 'A', constellation: 'Dra' },
  
  // Sagittarius
  { id: 'kaus-australis', name: 'Kaus Australis', ra: 18.40, dec: -34.38, magnitude: 1.85, spectralType: 'B', constellation: 'Sgr' },
  { id: 'nunki', name: 'Nunki', ra: 18.92, dec: -26.30, magnitude: 2.05, spectralType: 'B', constellation: 'Sgr' },
  { id: 'ascella', name: 'Ascella', ra: 19.04, dec: -29.88, magnitude: 2.60, spectralType: 'A', constellation: 'Sgr' },
  
  // Capricornus
  { id: 'deneb-algedi', name: 'Deneb Algedi', ra: 21.78, dec: -16.13, magnitude: 2.87, spectralType: 'A', constellation: 'Cap' },
  { id: 'dabih', name: 'Dabih', ra: 20.35, dec: -14.78, magnitude: 3.08, spectralType: 'F', constellation: 'Cap' },
  
  // Aquarius
  { id: 'sadalsuud', name: 'Sadalsuud', ra: 21.53, dec: -5.57, magnitude: 2.91, spectralType: 'G', constellation: 'Aqr' },
  { id: 'sadalmelik', name: 'Sadalmelik', ra: 22.10, dec: -0.32, magnitude: 2.96, spectralType: 'G', constellation: 'Aqr' },
  
  // Pisces
  { id: 'alrescha', name: 'Alrescha', ra: 2.03, dec: 2.76, magnitude: 3.82, spectralType: 'A', constellation: 'Psc' },
  
  // Aries
  { id: 'hamal', name: 'Hamal', ra: 2.12, dec: 23.46, magnitude: 2.00, spectralType: 'K', constellation: 'Ari' },
  { id: 'sheratan', name: 'Sheratan', ra: 1.91, dec: 20.81, magnitude: 2.64, spectralType: 'A', constellation: 'Ari' },
  
  // Corona Borealis
  { id: 'alphecca', name: 'Alphecca', ra: 15.58, dec: 26.71, magnitude: 2.23, spectralType: 'A', constellation: 'CrB' },
  
  // Hercules
  { id: 'rasalgethi', name: 'Rasalgethi', ra: 17.24, dec: 14.39, magnitude: 2.78, spectralType: 'M', constellation: 'Her' },
  { id: 'kornephoros', name: 'Kornephoros', ra: 16.50, dec: 21.49, magnitude: 2.77, spectralType: 'G', constellation: 'Her' },
  
  // Ophiuchus
  { id: 'rasalhague', name: 'Rasalhague', ra: 17.58, dec: 12.56, magnitude: 2.07, spectralType: 'A', constellation: 'Oph' },
  { id: 'sabik', name: 'Sabik', ra: 17.17, dec: -15.72, magnitude: 2.43, spectralType: 'A', constellation: 'Oph' },
  
  // Serpens
  { id: 'unukalhai', name: 'Unukalhai', ra: 15.74, dec: 6.43, magnitude: 2.65, spectralType: 'K', constellation: 'Ser' },
  
  // Libra
  { id: 'zubenelgenubi', name: 'Zubenelgenubi', ra: 14.85, dec: -16.04, magnitude: 2.75, spectralType: 'A', constellation: 'Lib' },
  { id: 'zubeneschamali', name: 'Zubeneschamali', ra: 15.28, dec: -9.38, magnitude: 2.61, spectralType: 'B', constellation: 'Lib' },
  
  // Corvus
  { id: 'gienah', name: 'Gienah', ra: 12.26, dec: -17.54, magnitude: 2.59, spectralType: 'B', constellation: 'Crv' },
  { id: 'kraz', name: 'Kraz', ra: 12.57, dec: -23.40, magnitude: 2.65, spectralType: 'G', constellation: 'Crv' },
  
  // Crater
  { id: 'alkes', name: 'Alkes', ra: 10.99, dec: -18.30, magnitude: 4.08, spectralType: 'K', constellation: 'Crt' },
  
  // Hydra
  { id: 'alphard', name: 'Alphard', ra: 9.46, dec: -8.66, magnitude: 2.00, spectralType: 'K', constellation: 'Hya' },
  
  // Puppis
  { id: 'naos', name: 'Naos', ra: 8.06, dec: -40.00, magnitude: 2.25, spectralType: 'O', constellation: 'Pup' },
  
  // Vela
  { id: 'suhail', name: 'Suhail', ra: 9.13, dec: -43.43, magnitude: 2.21, spectralType: 'K', constellation: 'Vel' },
  { id: 'regor', name: 'Regor', ra: 8.16, dec: -47.34, magnitude: 1.78, spectralType: 'O', constellation: 'Vel' },
  
  // Columba
  { id: 'phact', name: 'Phact', ra: 5.66, dec: -34.07, magnitude: 2.64, spectralType: 'B', constellation: 'Col' },
  
  // Lepus
  { id: 'arneb', name: 'Arneb', ra: 5.55, dec: -17.82, magnitude: 2.58, spectralType: 'F', constellation: 'Lep' },
  { id: 'nihal', name: 'Nihal', ra: 5.47, dec: -20.76, magnitude: 2.84, spectralType: 'G', constellation: 'Lep' },
  
  // Monoceros
  { id: 'beta-mon', name: 'Beta Mon', ra: 6.48, dec: -7.03, magnitude: 3.74, spectralType: 'B', constellation: 'Mon' },
  
  // Cepheus
  { id: 'alderamin', name: 'Alderamin', ra: 21.31, dec: 62.59, magnitude: 2.51, spectralType: 'A', constellation: 'Cep' },
  { id: 'errai', name: 'Errai', ra: 23.66, dec: 77.63, magnitude: 3.21, spectralType: 'K', constellation: 'Cep' },
  
  // Lacerta
  { id: 'alpha-lac', name: 'Alpha Lac', ra: 22.52, dec: 50.28, magnitude: 3.77, spectralType: 'A', constellation: 'Lac' },
  
  // Camelopardalis
  { id: 'beta-cam', name: 'Beta Cam', ra: 5.06, dec: 60.44, magnitude: 4.03, spectralType: 'G', constellation: 'Cam' },
  
  // Lynx
  { id: 'alpha-lyn', name: 'Alpha Lyn', ra: 9.35, dec: 34.39, magnitude: 3.13, spectralType: 'K', constellation: 'Lyn' },
  
  // Cancer
  { id: 'acubens', name: 'Acubens', ra: 8.98, dec: 11.86, magnitude: 4.25, spectralType: 'A', constellation: 'Cnc' },
  { id: 'asellus-australis', name: 'Asellus Australis', ra: 8.72, dec: 18.15, magnitude: 3.94, spectralType: 'K', constellation: 'Cnc' },
  
  // Triangulum
  { id: 'beta-tri', name: 'Beta Tri', ra: 2.16, dec: 34.99, magnitude: 3.00, spectralType: 'A', constellation: 'Tri' },
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

// Extended constellation line data
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
    stars: ['deneb', 'sadr', 'albireo', 'gienah-cyg'],
    lines: [
      ['deneb', 'sadr'],
      ['sadr', 'albireo'],
      ['sadr', 'gienah-cyg'],
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    abbr: 'Leo',
    stars: ['regulus', 'denebola', 'algieba', 'zosma'],
    lines: [
      ['regulus', 'algieba'],
      ['algieba', 'zosma'],
      ['zosma', 'denebola'],
    ]
  },
  {
    id: 'gem',
    name: 'Gemini',
    abbr: 'Gem',
    stars: ['pollux', 'castor', 'alhena', 'wasat', 'mebsuta'],
    lines: [
      ['pollux', 'castor'],
      ['castor', 'mebsuta'],
      ['pollux', 'alhena'],
      ['alhena', 'wasat'],
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
  {
    id: 'sco',
    name: 'Scorpius',
    abbr: 'Sco',
    stars: ['antares', 'shaula', 'sargas', 'dschubba', 'graffias'],
    lines: [
      ['graffias', 'dschubba'],
      ['dschubba', 'antares'],
      ['antares', 'shaula'],
      ['shaula', 'sargas'],
    ]
  },
  {
    id: 'sgr',
    name: 'Sagittarius',
    abbr: 'Sgr',
    stars: ['kaus-australis', 'nunki', 'ascella'],
    lines: [
      ['kaus-australis', 'ascella'],
      ['ascella', 'nunki'],
    ]
  },
  {
    id: 'lyr',
    name: 'Lyra',
    abbr: 'Lyr',
    stars: ['vega', 'sheliak', 'sulafat'],
    lines: [
      ['vega', 'sheliak'],
      ['sheliak', 'sulafat'],
      ['sulafat', 'vega'],
    ]
  },
  {
    id: 'aql',
    name: 'Aquila',
    abbr: 'Aql',
    stars: ['altair', 'tarazed', 'alshain'],
    lines: [
      ['tarazed', 'altair'],
      ['altair', 'alshain'],
    ]
  },
  {
    id: 'vir',
    name: 'Virgo',
    abbr: 'Vir',
    stars: ['spica', 'porrima', 'vindemiatrix'],
    lines: [
      ['spica', 'porrima'],
      ['porrima', 'vindemiatrix'],
    ]
  },
  {
    id: 'umi',
    name: 'Ursa Minor',
    abbr: 'UMi',
    stars: ['polaris', 'kochab', 'pherkad'],
    lines: [
      ['polaris', 'kochab'],
      ['kochab', 'pherkad'],
    ]
  },
  {
    id: 'dra',
    name: 'Draco',
    abbr: 'Dra',
    stars: ['eltanin', 'rastaban', 'thuban'],
    lines: [
      ['eltanin', 'rastaban'],
      ['rastaban', 'thuban'],
    ]
  },
  {
    id: 'boo',
    name: 'Boötes',
    abbr: 'Boo',
    stars: ['arcturus', 'izar', 'muphrid'],
    lines: [
      ['arcturus', 'izar'],
      ['arcturus', 'muphrid'],
    ]
  },
  {
    id: 'crb',
    name: 'Corona Borealis',
    abbr: 'CrB',
    stars: ['alphecca'],
    lines: []
  },
  {
    id: 'her',
    name: 'Hercules',
    abbr: 'Her',
    stars: ['rasalgethi', 'kornephoros'],
    lines: [
      ['rasalgethi', 'kornephoros'],
    ]
  },
  {
    id: 'oph',
    name: 'Ophiuchus',
    abbr: 'Oph',
    stars: ['rasalhague', 'sabik'],
    lines: [
      ['rasalhague', 'sabik'],
    ]
  },
  {
    id: 'lib',
    name: 'Libra',
    abbr: 'Lib',
    stars: ['zubenelgenubi', 'zubeneschamali'],
    lines: [
      ['zubenelgenubi', 'zubeneschamali'],
    ]
  },
  {
    id: 'tau',
    name: 'Taurus',
    abbr: 'Tau',
    stars: ['aldebaran', 'elnath', 'alcyone'],
    lines: [
      ['aldebaran', 'elnath'],
    ]
  },
  {
    id: 'aur',
    name: 'Auriga',
    abbr: 'Aur',
    stars: ['capella', 'menkalinan', 'mahasim'],
    lines: [
      ['capella', 'menkalinan'],
      ['menkalinan', 'mahasim'],
    ]
  },
  {
    id: 'cma',
    name: 'Canis Major',
    abbr: 'CMa',
    stars: ['sirius', 'mirzam', 'wezen', 'adhara', 'aludra'],
    lines: [
      ['sirius', 'mirzam'],
      ['sirius', 'adhara'],
      ['adhara', 'wezen'],
      ['wezen', 'aludra'],
    ]
  },
  {
    id: 'cru',
    name: 'Crux',
    abbr: 'Cru',
    stars: ['acrux', 'gacrux', 'mimosa', 'imai'],
    lines: [
      ['acrux', 'gacrux'],
      ['mimosa', 'imai'],
    ]
  },
  {
    id: 'cen',
    name: 'Centaurus',
    abbr: 'Cen',
    stars: ['alpha-centauri', 'hadar', 'menkent'],
    lines: [
      ['alpha-centauri', 'hadar'],
      ['hadar', 'menkent'],
    ]
  },
  {
    id: 'ari',
    name: 'Aries',
    abbr: 'Ari',
    stars: ['hamal', 'sheratan'],
    lines: [
      ['hamal', 'sheratan'],
    ]
  },
  {
    id: 'cep',
    name: 'Cepheus',
    abbr: 'Cep',
    stars: ['alderamin', 'errai'],
    lines: [
      ['alderamin', 'errai'],
    ]
  },
  {
    id: 'per',
    name: 'Perseus',
    abbr: 'Per',
    stars: ['mirfak', 'algol'],
    lines: [
      ['mirfak', 'algol'],
    ]
  },
  {
    id: 'hya',
    name: 'Hydra',
    abbr: 'Hya',
    stars: ['alphard'],
    lines: []
  },
  {
    id: 'crv',
    name: 'Corvus',
    abbr: 'Crv',
    stars: ['gienah', 'kraz'],
    lines: [
      ['gienah', 'kraz'],
    ]
  },
];

// Extended deep sky objects (nebulae, galaxies, clusters)
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
  // Galaxies
  { id: 'm31', name: 'Andromeda Galaxy', type: 'galaxy', ra: 0.71, dec: 41.27, magnitude: 3.4, size: 180, description: 'Nearest major galaxy, 2.5 million light-years away' },
  { id: 'm33', name: 'Triangulum Galaxy', type: 'galaxy', ra: 1.56, dec: 30.66, magnitude: 5.7, size: 70, description: 'Third-largest member of Local Group' },
  { id: 'm51', name: 'Whirlpool Galaxy', type: 'galaxy', ra: 13.50, dec: 47.20, magnitude: 8.4, size: 11, description: 'Classic face-on spiral galaxy' },
  { id: 'm81', name: "Bode's Galaxy", type: 'galaxy', ra: 9.93, dec: 69.07, magnitude: 6.9, size: 27, description: 'Grand design spiral in Ursa Major' },
  { id: 'm82', name: 'Cigar Galaxy', type: 'galaxy', ra: 9.93, dec: 69.68, magnitude: 8.4, size: 11, description: 'Starburst galaxy near M81' },
  { id: 'm101', name: 'Pinwheel Galaxy', type: 'galaxy', ra: 14.05, dec: 54.35, magnitude: 7.9, size: 29, description: 'Face-on spiral in Ursa Major' },
  { id: 'm104', name: 'Sombrero Galaxy', type: 'galaxy', ra: 12.67, dec: -11.62, magnitude: 8.0, size: 9, description: 'Edge-on spiral with prominent dust lane' },
  { id: 'ngc253', name: 'Sculptor Galaxy', type: 'galaxy', ra: 0.79, dec: -25.29, magnitude: 7.1, size: 25, description: 'Starburst galaxy in Sculptor' },
  { id: 'm83', name: 'Southern Pinwheel', type: 'galaxy', ra: 13.62, dec: -29.87, magnitude: 7.5, size: 13, description: 'Barred spiral galaxy' },
  { id: 'lmc', name: 'Large Magellanic Cloud', type: 'galaxy', ra: 5.39, dec: -69.76, magnitude: 0.9, size: 650, description: 'Satellite galaxy of Milky Way' },
  { id: 'smc', name: 'Small Magellanic Cloud', type: 'galaxy', ra: 0.88, dec: -72.80, magnitude: 2.7, size: 320, description: 'Dwarf satellite galaxy' },
  
  // Nebulae
  { id: 'm42', name: 'Orion Nebula', type: 'nebula', ra: 5.59, dec: -5.39, magnitude: 4.0, size: 85, description: 'Bright emission nebula visible to naked eye' },
  { id: 'm43', name: "De Mairan's Nebula", type: 'nebula', ra: 5.59, dec: -5.27, magnitude: 9.0, size: 20, description: 'Part of Orion Nebula complex' },
  { id: 'ngc7000', name: 'North America Nebula', type: 'nebula', ra: 20.98, dec: 44.33, magnitude: 4.0, size: 120, description: 'Large emission nebula near Deneb' },
  { id: 'm1', name: 'Crab Nebula', type: 'nebula', ra: 5.58, dec: 22.01, magnitude: 8.4, size: 6, description: 'Supernova remnant from 1054 AD' },
  { id: 'm8', name: 'Lagoon Nebula', type: 'nebula', ra: 18.06, dec: -24.38, magnitude: 6.0, size: 90, description: 'Emission nebula in Sagittarius' },
  { id: 'm20', name: 'Trifid Nebula', type: 'nebula', ra: 18.04, dec: -23.03, magnitude: 6.3, size: 28, description: 'Emission and reflection nebula' },
  { id: 'm17', name: 'Omega Nebula', type: 'nebula', ra: 18.35, dec: -16.18, magnitude: 6.0, size: 46, description: 'Swan-shaped emission nebula' },
  { id: 'm16', name: 'Eagle Nebula', type: 'nebula', ra: 18.31, dec: -13.78, magnitude: 6.0, size: 35, description: 'Famous Pillars of Creation' },
  { id: 'ic1396', name: 'Elephant Trunk Nebula', type: 'nebula', ra: 21.63, dec: 57.50, magnitude: 3.5, size: 170, description: 'Emission nebula in Cepheus' },
  { id: 'ngc2024', name: 'Flame Nebula', type: 'nebula', ra: 5.68, dec: -1.85, magnitude: 7.2, size: 30, description: 'Emission nebula near Alnitak' },
  { id: 'ic434', name: 'Horsehead Nebula', type: 'nebula', ra: 5.68, dec: -2.46, magnitude: 6.8, size: 8, description: 'Iconic dark nebula silhouette' },
  { id: 'ngc7293', name: 'Helix Nebula', type: 'nebula', ra: 22.49, dec: -20.84, magnitude: 7.3, size: 25, description: 'Nearest planetary nebula to Earth' },
  { id: 'ngc6960', name: 'Veil Nebula', type: 'nebula', ra: 20.76, dec: 30.72, magnitude: 7.0, size: 180, description: 'Supernova remnant in Cygnus' },
  { id: 'm78', name: 'Reflection Nebula', type: 'nebula', ra: 5.78, dec: 0.05, magnitude: 8.3, size: 8, description: 'Bright reflection nebula in Orion' },
  
  // Planetary Nebulae
  { id: 'm57', name: 'Ring Nebula', type: 'planetary', ra: 18.89, dec: 33.03, magnitude: 8.8, size: 1.4, description: 'Famous planetary nebula in Lyra' },
  { id: 'm27', name: 'Dumbbell Nebula', type: 'planetary', ra: 19.99, dec: 22.72, magnitude: 7.5, size: 8, description: 'Large planetary nebula in Vulpecula' },
  { id: 'ngc6543', name: "Cat's Eye Nebula", type: 'planetary', ra: 17.98, dec: 66.63, magnitude: 8.1, size: 0.4, description: 'Complex planetary nebula in Draco' },
  { id: 'm97', name: 'Owl Nebula', type: 'planetary', ra: 11.25, dec: 55.02, magnitude: 9.9, size: 3.4, description: 'Planetary nebula in Ursa Major' },
  
  // Star Clusters
  { id: 'm45', name: 'Pleiades', type: 'cluster', ra: 3.79, dec: 24.12, magnitude: 1.6, size: 110, description: 'The Seven Sisters, bright open star cluster' },
  { id: 'm13', name: 'Hercules Cluster', type: 'cluster', ra: 16.69, dec: 36.46, magnitude: 5.8, size: 20, description: 'Great globular cluster in Hercules' },
  { id: 'm22', name: 'Sagittarius Cluster', type: 'cluster', ra: 18.61, dec: -23.90, magnitude: 5.1, size: 32, description: 'Bright globular cluster' },
  { id: 'm5', name: 'Rose Cluster', type: 'cluster', ra: 15.31, dec: 2.08, magnitude: 5.6, size: 23, description: 'Globular cluster in Serpens' },
  { id: 'm3', name: 'Canes Venatici Cluster', type: 'cluster', ra: 13.70, dec: 28.38, magnitude: 6.2, size: 18, description: 'Bright globular cluster' },
  { id: 'm4', name: 'Scorpius Cluster', type: 'cluster', ra: 16.39, dec: -26.53, magnitude: 5.6, size: 36, description: 'Nearest globular to Earth' },
  { id: 'm44', name: 'Beehive Cluster', type: 'cluster', ra: 8.67, dec: 19.67, magnitude: 3.1, size: 95, description: 'Praesepe open cluster in Cancer' },
  { id: 'm67', name: 'King Cobra Cluster', type: 'cluster', ra: 8.84, dec: 11.82, magnitude: 6.9, size: 30, description: 'Old open cluster in Cancer' },
  { id: 'm35', name: 'Shoe-Buckle Cluster', type: 'cluster', ra: 6.15, dec: 24.35, magnitude: 5.1, size: 28, description: 'Open cluster in Gemini' },
  { id: 'm37', name: 'Auriga Cluster', type: 'cluster', ra: 5.87, dec: 32.55, magnitude: 5.6, size: 24, description: 'Rich open cluster in Auriga' },
  { id: 'm38', name: 'Starfish Cluster', type: 'cluster', ra: 5.48, dec: 35.83, magnitude: 6.4, size: 21, description: 'Open cluster in Auriga' },
  { id: 'm36', name: 'Pinwheel Cluster', type: 'cluster', ra: 5.60, dec: 34.13, magnitude: 6.0, size: 12, description: 'Open cluster in Auriga' },
  { id: 'ngc869', name: 'Double Cluster h', type: 'cluster', ra: 2.33, dec: 57.13, magnitude: 4.3, size: 30, description: 'Half of famous Double Cluster' },
  { id: 'ngc884', name: 'Double Cluster χ', type: 'cluster', ra: 2.37, dec: 57.15, magnitude: 4.4, size: 30, description: 'Half of famous Double Cluster' },
  { id: 'omega-centauri', name: 'Omega Centauri', type: 'cluster', ra: 13.45, dec: -47.48, magnitude: 3.9, size: 55, description: 'Largest globular cluster visible from Earth' },
  { id: '47-tucanae', name: '47 Tucanae', type: 'cluster', ra: 0.40, dec: -72.08, magnitude: 4.0, size: 50, description: 'Second brightest globular cluster' },
];

// All stars combined with more background stars for denser field
export const allStars = [...brightStars, ...generateBackgroundStars(4000)];