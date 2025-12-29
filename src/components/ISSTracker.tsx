import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { equatorialToHorizontal, getLocalSiderealTime } from '@/lib/astronomy';

interface ISSTrackerProps {
  enabled: boolean;
  location: { latitude: number; longitude: number };
  date: Date;
}

interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
}

// Convert geographic coordinates to RA/Dec approximation for sky position
function geoToEquatorial(lat: number, lon: number, observerLat: number, observerLon: number) {
  // Calculate the ISS position relative to observer
  const dLon = lon - observerLon;
  const dLat = lat - observerLat;
  
  // Approximate RA based on longitude difference (1 hour = 15 degrees)
  const ra = (dLon / 15 + 12) % 24;
  
  // Dec is approximately the latitude
  const dec = lat;
  
  return { ra, dec };
}

// ISS vertex shader with pulsing glow
const issVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const issFragmentShader = `
  uniform float time;
  uniform vec3 issColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float pulse = 0.8 + 0.2 * sin(time * 3.0);
    
    // Glow effect
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    
    vec3 glow = issColor * pulse;
    float alpha = 0.8 + 0.2 * pulse;
    
    gl_FragColor = vec4(glow, alpha);
  }
`;

export function ISSTracker({ enabled, location, date }: ISSTrackerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Line>(null);
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [issVisible, setIssVisible] = useState(false);
  const trailPositions = useRef<THREE.Vector3[]>([]);
  
  // Fetch ISS position every 5 seconds
  useEffect(() => {
    if (!enabled) return;
    
    const fetchISSPosition = async () => {
      try {
        // Using the open-notify API which is CORS-enabled
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        
        setIssPosition({
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude,
          timestamp: data.timestamp,
        });
      } catch (error) {
        console.log('ISS fetch error, using simulated position');
        // Simulate ISS position if API fails
        const now = Date.now() / 1000;
        const orbitalPeriod = 92.68 * 60; // 92.68 minutes in seconds
        const angle = (now % orbitalPeriod) / orbitalPeriod * Math.PI * 2;
        
        setIssPosition({
          latitude: 51.6 * Math.sin(angle), // ISS inclination ~51.6 degrees
          longitude: ((now / 60) * 4) % 360 - 180, // ~4 degrees per minute
          altitude: 420,
          timestamp: now,
        });
      }
    };
    
    fetchISSPosition();
    const interval = setInterval(fetchISSPosition, 5000);
    
    return () => clearInterval(interval);
  }, [enabled]);
  
  // Calculate ISS position in sky
  const skyPosition = useMemo(() => {
    if (!issPosition) return null;
    
    const lst = getLocalSiderealTime(date, location.longitude);
    
    // Calculate ISS's local horizontal coordinates
    // ISS is at ~420km altitude, we need to calculate where it appears in our sky
    const issLat = issPosition.latitude;
    const issLon = issPosition.longitude;
    
    // Calculate angular distance from observer
    const dLat = (issLat - location.latitude) * Math.PI / 180;
    const dLon = (issLon - location.longitude) * Math.PI / 180;
    const lat1 = location.latitude * Math.PI / 180;
    const lat2 = issLat * Math.PI / 180;
    
    // Haversine formula for angular distance
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const angularDistance = c * 180 / Math.PI;
    
    // ISS is visible when it's within ~81 degrees (horizon at 420km altitude)
    const maxVisibleAngle = 81;
    const visible = angularDistance < maxVisibleAngle;
    setIssVisible(visible);
    
    if (!visible) return null;
    
    // Calculate azimuth (bearing to ISS)
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let azimuth = Math.atan2(y, x) * 180 / Math.PI;
    azimuth = (azimuth + 360) % 360;
    
    // Calculate altitude (elevation angle) based on geometry
    // Earth radius ~6371km, ISS altitude ~420km
    const earthRadius = 6371;
    const issAltitude = issPosition.altitude;
    const observerDistance = angularDistance * Math.PI / 180 * earthRadius;
    const issHeight = issAltitude;
    
    // Simple elevation calculation
    const elevation = 90 - angularDistance * (90 / maxVisibleAngle);
    
    // Convert to 3D position
    const altRad = (elevation * Math.PI) / 180;
    const azRad = ((azimuth - 180) * Math.PI) / 180;
    const radius = 300;
    
    const position = new THREE.Vector3(
      radius * Math.cos(altRad) * Math.sin(azRad),
      radius * Math.sin(altRad),
      -radius * Math.cos(altRad) * Math.cos(azRad)
    );
    
    return { position, azimuth, elevation };
  }, [issPosition, location, date]);
  
  // Update trail
  useFrame(({ clock }) => {
    if (!enabled || !groupRef.current || !skyPosition) return;
    
    // Update ISS position
    groupRef.current.position.copy(skyPosition.position);
    groupRef.current.lookAt(0, 0, 0);
    
    // Add to trail
    const now = clock.getElapsedTime();
    if (trailPositions.current.length === 0 || 
        trailPositions.current[trailPositions.current.length - 1].distanceTo(skyPosition.position) > 2) {
      trailPositions.current.push(skyPosition.position.clone());
      if (trailPositions.current.length > 100) {
        trailPositions.current.shift();
      }
      
      // Update trail geometry
      if (trailRef.current && trailPositions.current.length > 1) {
        const geometry = trailRef.current.geometry as THREE.BufferGeometry;
        const positions = new Float32Array(trailPositions.current.length * 3);
        trailPositions.current.forEach((pos, i) => {
          positions[i * 3] = pos.x;
          positions[i * 3 + 1] = pos.y;
          positions[i * 3 + 2] = pos.z;
        });
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setDrawRange(0, trailPositions.current.length);
      }
    }
  });
  
  if (!enabled || !skyPosition) return null;
  
  return (
    <>
      {/* ISS Trail */}
      <line ref={trailRef as any}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(300)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          linewidth={1}
        />
      </line>
      
      {/* ISS Object */}
      <group ref={groupRef}>
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[8, 16, 16]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Middle glow */}
        <mesh>
          <sphereGeometry args={[4, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* ISS core */}
        <mesh>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#ffffee" />
        </mesh>
        
        {/* Solar panels representation */}
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[15, 0.5, 3]} />
          <meshBasicMaterial
            color="#4a5568"
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </>
  );
}

// ISS Info overlay component for 2D UI
export function ISSInfoOverlay({ 
  issPosition, 
  isVisible 
}: { 
  issPosition: ISSPosition | null; 
  isVisible: boolean;
}) {
  if (!issPosition) return null;
  
  return (
    <div className="fixed top-20 right-4 z-50 glass rounded-xl p-3 max-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-sm font-medium">ISS Tracker</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <div>Lat: {issPosition.latitude.toFixed(2)}°</div>
        <div>Lon: {issPosition.longitude.toFixed(2)}°</div>
        <div>Alt: {issPosition.altitude.toFixed(0)} km</div>
        <div className="text-xs mt-1">
          {isVisible ? '✓ Visible from your location' : '✗ Below horizon'}
        </div>
      </div>
    </div>
  );
}
