// Astronomical calculation utilities

export interface CelestialPosition {
  rightAscension: number; // in hours (0-24)
  declination: number;    // in degrees (-90 to 90)
  altitude?: number;      // in degrees (0-90, horizon to zenith)
  azimuth?: number;       // in degrees (0-360, N=0, E=90, S=180, W=270)
}

export interface Star {
  id: string;
  name?: string;
  ra: number;        // Right ascension in hours
  dec: number;       // Declination in degrees
  magnitude: number; // Apparent magnitude (lower = brighter)
  spectralType: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  constellation?: string;
}

export interface Planet {
  id: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  color: string;
  size: number;
}

export interface Constellation {
  id: string;
  name: string;
  abbr: string;
  stars: string[];
  lines: [string, string][];
}

// Convert degrees to radians
export const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// Convert radians to degrees
export const toDegrees = (radians: number): number => radians * (180 / Math.PI);

// Calculate Julian Date from Date object
export const getJulianDate = (date: Date): number => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  return jdn + (hour - 12) / 24;
};

// Calculate Local Sidereal Time
export const getLocalSiderealTime = (date: Date, longitude: number): number => {
  const jd = getJulianDate(date);
  const t = (jd - 2451545.0) / 36525.0;
  
  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
             0.000387933 * t * t - t * t * t / 38710000.0;
  
  // Normalize to 0-360
  gmst = ((gmst % 360) + 360) % 360;
  
  // Local Sidereal Time
  let lst = gmst + longitude;
  lst = ((lst % 360) + 360) % 360;
  
  return lst / 15; // Convert to hours
};

// Convert equatorial coordinates to horizontal (alt/az)
export const equatorialToHorizontal = (
  ra: number,        // Right ascension in hours
  dec: number,       // Declination in degrees
  lat: number,       // Observer latitude in degrees
  lst: number        // Local sidereal time in hours
): { altitude: number; azimuth: number } => {
  const hourAngle = (lst - ra) * 15; // Convert to degrees
  
  const latRad = toRadians(lat);
  const decRad = toRadians(dec);
  const haRad = toRadians(hourAngle);
  
  // Calculate altitude
  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + 
                 Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const altitude = toDegrees(Math.asin(Math.max(-1, Math.min(1, sinAlt))));
  
  // Calculate azimuth
  const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / 
                (Math.cos(latRad) * Math.cos(toRadians(altitude)));
  const sinAz = -Math.cos(decRad) * Math.sin(haRad) / Math.cos(toRadians(altitude));
  
  let azimuth = toDegrees(Math.atan2(sinAz, cosAz));
  azimuth = ((azimuth % 360) + 360) % 360;
  
  return { altitude, azimuth };
};

// Convert horizontal to screen coordinates
export const horizontalToScreen = (
  altitude: number,
  azimuth: number,
  viewAz: number,      // Current view azimuth (center of screen)
  viewAlt: number,     // Current view altitude (center of screen)
  fov: number,         // Field of view in degrees
  width: number,
  height: number
): { x: number; y: number; visible: boolean } => {
  // Calculate angular distance from view center
  const deltaAz = ((azimuth - viewAz + 180) % 360) - 180;
  const deltaAlt = altitude - viewAlt;
  
  // Check if within field of view
  const angularDistance = Math.sqrt(deltaAz * deltaAz + deltaAlt * deltaAlt);
  const visible = angularDistance < fov / 1.5;
  
  // Project to screen
  const scale = Math.min(width, height) / fov;
  const x = width / 2 + deltaAz * scale;
  const y = height / 2 - deltaAlt * scale;
  
  return { x, y, visible };
};

// Get star color from spectral type
export const getStarColor = (spectralType: string): string => {
  const type = spectralType.charAt(0).toUpperCase();
  const colors: Record<string, string> = {
    'O': 'hsl(210, 100%, 85%)',
    'B': 'hsl(210, 80%, 80%)',
    'A': 'hsl(200, 30%, 95%)',
    'F': 'hsl(45, 30%, 90%)',
    'G': 'hsl(45, 60%, 75%)',
    'K': 'hsl(30, 70%, 60%)',
    'M': 'hsl(10, 80%, 50%)',
  };
  return colors[type] || colors['G'];
};

// Get star size from magnitude
export const getStarSize = (magnitude: number): number => {
  // Magnitude scale: -1.5 (brightest like Sirius) to 6 (dimmest visible)
  // Map to radius 0.5 to 4 pixels
  const minMag = -1.5;
  const maxMag = 6;
  const minSize = 0.5;
  const maxSize = 4;
  
  const normalizedMag = (magnitude - minMag) / (maxMag - minMag);
  return maxSize - normalizedMag * (maxSize - minSize);
};

// Get star opacity from magnitude
export const getStarOpacity = (magnitude: number): number => {
  const minMag = -1.5;
  const maxMag = 6;
  const normalizedMag = (magnitude - minMag) / (maxMag - minMag);
  return 1 - normalizedMag * 0.6;
};

// Calculate approximate Sun position
export const getSunPosition = (date: Date): CelestialPosition => {
  const jd = getJulianDate(date);
  const n = jd - 2451545.0;
  
  // Mean longitude
  let L = (280.460 + 0.9856474 * n) % 360;
  
  // Mean anomaly
  let g = toRadians((357.528 + 0.9856003 * n) % 360);
  
  // Ecliptic longitude
  let lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  
  // Obliquity of ecliptic
  const epsilon = toRadians(23.439 - 0.0000004 * n);
  
  // Convert to equatorial
  const lambdaRad = toRadians(lambda);
  const ra = toDegrees(Math.atan2(Math.cos(epsilon) * Math.sin(lambdaRad), Math.cos(lambdaRad))) / 15;
  const dec = toDegrees(Math.asin(Math.sin(epsilon) * Math.sin(lambdaRad)));
  
  return {
    rightAscension: ((ra % 24) + 24) % 24,
    declination: dec
  };
};

// Calculate approximate Moon position
export const getMoonPosition = (date: Date): CelestialPosition & { phase: number } => {
  const jd = getJulianDate(date);
  const t = (jd - 2451545.0) / 36525.0;
  
  // Moon's mean longitude
  let L = (218.316 + 481267.8813 * t) % 360;
  
  // Moon's mean anomaly
  let M = (134.963 + 477198.8676 * t) % 360;
  
  // Moon's mean elongation
  let D = (297.850 + 445267.1115 * t) % 360;
  
  // Sun's mean anomaly
  let Ms = (357.529 + 35999.0503 * t) % 360;
  
  // Moon's argument of latitude
  let F = (93.272 + 483202.0175 * t) % 360;
  
  // Perturbations
  const dL = 6.289 * Math.sin(toRadians(M));
  const dB = 5.128 * Math.sin(toRadians(F));
  
  // Ecliptic longitude and latitude
  const lambda = L + dL;
  const beta = dB;
  
  // Obliquity
  const epsilon = toRadians(23.439);
  
  // Convert to equatorial
  const lambdaRad = toRadians(lambda);
  const betaRad = toRadians(beta);
  
  const ra = toDegrees(Math.atan2(
    Math.sin(lambdaRad) * Math.cos(epsilon) - Math.tan(betaRad) * Math.sin(epsilon),
    Math.cos(lambdaRad)
  )) / 15;
  
  const dec = toDegrees(Math.asin(
    Math.sin(betaRad) * Math.cos(epsilon) + 
    Math.cos(betaRad) * Math.sin(epsilon) * Math.sin(lambdaRad)
  ));
  
  // Calculate phase (0 = new, 0.5 = full, 1 = new)
  const phase = (1 - Math.cos(toRadians(D))) / 2;
  
  return {
    rightAscension: ((ra % 24) + 24) % 24,
    declination: dec,
    phase
  };
};

// Simplified planetary positions (approximate for visual purposes)
export const getPlanetPositions = (date: Date): Planet[] => {
  const jd = getJulianDate(date);
  const t = (jd - 2451545.0) / 36525.0;
  
  // Simplified orbital elements (mean values)
  const planets: Array<{
    name: string;
    L0: number; // Mean longitude at epoch
    n: number;  // Daily motion
    color: string;
    mag: number;
    size: number;
  }> = [
    { name: 'Mercury', L0: 252.251, n: 4.092317, color: '#b5a7a7', mag: -0.4, size: 3 },
    { name: 'Venus', L0: 181.980, n: 1.602136, color: '#f5e6c8', mag: -4.4, size: 4 },
    { name: 'Mars', L0: 355.433, n: 0.524039, color: '#e27b58', mag: 0.7, size: 3 },
    { name: 'Jupiter', L0: 34.351, n: 0.083056, color: '#d4c4a8', mag: -2.5, size: 5 },
    { name: 'Saturn', L0: 50.077, n: 0.033371, color: '#e8dcc0', mag: 0.5, size: 4 },
  ];
  
  return planets.map((p, i) => {
    // Very simplified - just for visualization
    const days = jd - 2451545.0;
    const L = (p.L0 + p.n * days) % 360;
    
    // Convert ecliptic to equatorial (simplified)
    const epsilon = toRadians(23.439);
    const lambdaRad = toRadians(L);
    
    // Add some variation based on inclination (simplified)
    const beta = Math.sin(toRadians(L * 0.1)) * 3;
    const betaRad = toRadians(beta);
    
    const ra = toDegrees(Math.atan2(
      Math.sin(lambdaRad) * Math.cos(epsilon) - Math.tan(betaRad) * Math.sin(epsilon),
      Math.cos(lambdaRad)
    )) / 15;
    
    const dec = toDegrees(Math.asin(
      Math.sin(betaRad) * Math.cos(epsilon) + 
      Math.cos(betaRad) * Math.sin(epsilon) * Math.sin(lambdaRad)
    ));
    
    return {
      id: p.name.toLowerCase(),
      name: p.name,
      ra: ((ra % 24) + 24) % 24,
      dec,
      magnitude: p.mag,
      color: p.color,
      size: p.size
    };
  });
};
