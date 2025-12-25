import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { allStars, deepSkyObjects } from '@/data/starCatalog';
import {
  getLocalSiderealTime,
  equatorialToHorizontal,
  getStarColor,
  getMoonPosition,
  getPlanetPositions,
} from '@/lib/astronomy';

interface ThreeSkySceneProps {
  location: { latitude: number; longitude: number };
  date: Date;
  showConstellations: boolean;
  showPlanets: boolean;
  showDeepSky: boolean;
  showMilkyWay: boolean;
  onObjectSelect: (object: { type: string; name: string; data: any } | null) => void;
}

// Enhanced star vertex shader with atmospheric scintillation
const starVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float twinklePhase;
  attribute float twinkleSpeed;
  attribute float brightness;
  
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vBrightness;
  
  uniform float time;
  
  void main() {
    vColor = customColor;
    vBrightness = brightness;
    
    // Multi-frequency atmospheric scintillation
    float t1 = sin(time * twinkleSpeed + twinklePhase) * 0.15;
    float t2 = sin(time * twinkleSpeed * 1.3 + twinklePhase * 0.7) * 0.1;
    float t3 = sin(time * twinkleSpeed * 2.1 + twinklePhase * 1.3) * 0.05;
    float twinkle = 0.7 + t1 + t2 + t3;
    vTwinkle = twinkle;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (350.0 / -mvPosition.z) * twinkle;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vBrightness;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Bright core
    float core = exp(-dist * dist * 80.0);
    
    // Soft glow layers
    float glow1 = exp(-dist * dist * 15.0) * 0.6;
    float glow2 = exp(-dist * dist * 5.0) * 0.3;
    float glow3 = exp(-dist * dist * 2.0) * 0.15;
    
    // Subtle diffraction spikes for bright stars
    float angle = atan(center.y, center.x);
    float spikes = pow(abs(sin(angle * 2.0)), 12.0) * exp(-dist * 3.0) * vBrightness * 0.4;
    float spikes2 = pow(abs(sin(angle * 2.0 + 0.785)), 12.0) * exp(-dist * 3.0) * vBrightness * 0.2;
    
    float intensity = core + glow1 + glow2 + glow3 + spikes + spikes2;
    intensity *= vTwinkle;
    
    // Color with white-hot core
    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.7);
    
    if (intensity < 0.01) discard;
    
    gl_FragColor = vec4(finalColor, intensity);
  }
`;

// Volumetric Milky Way shader
const milkyWayVertexShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const milkyWayFragmentShader = `
  uniform float time;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  // Noise functions for procedural texturing
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec3 pos = normalize(vPosition);
    
    // Galactic plane - tilted band across the sky
    float galacticLat = pos.y * 0.7 + pos.z * 0.3;
    float bandWidth = 0.35;
    float band = 1.0 - smoothstep(0.0, bandWidth, abs(galacticLat));
    band = pow(band, 1.5);
    
    // Multi-octave noise for structure
    vec3 noisePos = pos * 3.0 + vec3(time * 0.002, 0.0, 0.0);
    float noise1 = fbm(noisePos);
    float noise2 = fbm(noisePos * 2.0 + 10.0);
    float noise3 = fbm(noisePos * 4.0 + 20.0);
    
    // Dark dust lanes
    float dust = smoothstep(-0.2, 0.3, noise1) * 0.7 + 0.3;
    
    // Star clouds
    float starClouds = pow(max(0.0, noise2 * 0.5 + 0.5), 2.0);
    
    // Fine detail
    float detail = noise3 * 0.3 + 0.7;
    
    // Galactic core brightness (brighter toward center)
    float coreGlow = exp(-pow(pos.x + 0.3, 2.0) * 2.0) * band;
    
    // Combine
    float brightness = band * dust * starClouds * detail;
    brightness += coreGlow * 0.5;
    
    // Milky Way colors - bluish-white with warm core
    vec3 coolColor = vec3(0.7, 0.75, 0.9);
    vec3 warmColor = vec3(1.0, 0.9, 0.7);
    vec3 dustColor = vec3(0.4, 0.35, 0.3);
    
    vec3 color = mix(coolColor, warmColor, coreGlow);
    color = mix(color, dustColor, (1.0 - dust) * 0.5);
    
    // Add subtle color variation
    color += vec3(noise2 * 0.1, noise2 * 0.08, noise2 * 0.15);
    
    float alpha = brightness * 0.25;
    
    if(alpha < 0.005) discard;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Deep sky object shader (nebulae, galaxies)
const dsoFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float objectType; // 0 = nebula, 1 = galaxy
  varying vec2 vUv;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    
    float noise1 = snoise(vec3(uv * 4.0, time * 0.02)) * 0.5 + 0.5;
    float noise2 = snoise(vec3(uv * 8.0 + 50.0, time * 0.015)) * 0.5 + 0.5;
    
    float shape;
    if(objectType > 0.5) {
      // Galaxy - elliptical with spiral hints
      vec2 rotUv = uv;
      float angle = atan(rotUv.y, rotUv.x) + dist * 5.0 + time * 0.01;
      float spiral = sin(angle * 2.0) * 0.3 + 0.7;
      shape = exp(-dist * dist * 8.0) * spiral;
    } else {
      // Nebula - more diffuse
      shape = exp(-dist * dist * 4.0);
    }
    
    float detail = noise1 * 0.6 + noise2 * 0.4;
    float brightness = shape * detail;
    
    vec3 color = mix(color1, color2, noise1);
    color += vec3(0.1) * (1.0 - dist * 2.0);
    
    float alpha = brightness * 0.5;
    if(alpha < 0.01) discard;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const dsoVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Generate additional faint background stars
function generateBackgroundStars(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const radius = 900;
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  return positions;
}

// Background star field - thousands of faint stars
function BackgroundStarField() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 15000;
    const positions = generateBackgroundStars(count);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Slight color variation
      const temp = 0.8 + Math.random() * 0.4;
      colors[i * 3] = temp;
      colors[i * 3 + 1] = temp * 0.95;
      colors[i * 3 + 2] = temp * (0.9 + Math.random() * 0.2);
      
      sizes[i] = 0.3 + Math.random() * 0.7;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Main star field with realistic rendering
function RealisticStars({ location, date }: { location: { latitude: number; longitude: number }; date: Date }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const starData = useMemo(() => {
    const lst = getLocalSiderealTime(date, location.longitude);
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const twinklePhases: number[] = [];
    const twinkleSpeeds: number[] = [];
    const brightness: number[] = [];

    allStars.forEach(star => {
      const { altitude, azimuth } = equatorialToHorizontal(
        star.ra, star.dec, location.latitude, lst
      );

      if (altitude < -5) return;

      const altRad = (altitude * Math.PI) / 180;
      const azRad = ((azimuth - 180) * Math.PI) / 180;
      const radius = 500;

      const x = radius * Math.cos(altRad) * Math.sin(azRad);
      const y = radius * Math.sin(altRad);
      const z = -radius * Math.cos(altRad) * Math.cos(azRad);

      positions.push(x, y, z);

      // Parse star color with better accuracy
      const colorStr = getStarColor(star.spectralType);
      const hslMatch = colorStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const h = parseInt(hslMatch[1]) / 360;
        const s = parseInt(hslMatch[2]) / 100 * 0.7; // Reduce saturation for realism
        const l = Math.min(1, parseInt(hslMatch[3]) / 100 + 0.2);
        const color = new THREE.Color().setHSL(h, s, l);
        colors.push(color.r, color.g, color.b);
      } else {
        colors.push(1, 0.98, 0.95);
      }

      // Size based on magnitude
      const mag = star.magnitude;
      const size = Math.max(0.8, 6 - mag * 0.8);
      sizes.push(size);

      // Brightness for shader effects
      const bright = Math.max(0, 1 - mag / 6);
      brightness.push(bright);

      twinklePhases.push(Math.random() * Math.PI * 2);
      twinkleSpeeds.push(2 + Math.random() * 4);
    });

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      twinklePhases: new Float32Array(twinklePhases),
      twinkleSpeeds: new Float32Array(twinkleSpeeds),
      brightness: new Float32Array(brightness),
    };
  }, [location, date]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starData.positions, 3]} />
        <bufferAttribute attach="attributes-customColor" args={[starData.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[starData.sizes, 1]} />
        <bufferAttribute attach="attributes-twinklePhase" args={[starData.twinklePhases, 1]} />
        <bufferAttribute attach="attributes-twinkleSpeed" args={[starData.twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-brightness" args={[starData.brightness, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={{ time: { value: 0 } }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Volumetric Milky Way on a sphere
function MilkyWay() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = clock.getElapsedTime();
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[600, 64, 64]} />
      <shaderMaterial
        vertexShader={milkyWayVertexShader}
        fragmentShader={milkyWayFragmentShader}
        uniforms={{ time: { value: 0 } }}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Deep Sky Objects (Nebulae and Galaxies)
function DeepSkyObjects({ location, date }: { location: { latitude: number; longitude: number }; date: Date }) {
  const lst = getLocalSiderealTime(date, location.longitude);

  const objects = useMemo(() => {
    return deepSkyObjects
      .map(dso => {
        const { altitude, azimuth } = equatorialToHorizontal(
          dso.ra, dso.dec, location.latitude, lst
        );

        if (altitude < 0) return null;

        const altRad = (altitude * Math.PI) / 180;
        const azRad = ((azimuth - 180) * Math.PI) / 180;
        const radius = 450;

        return {
          ...dso,
          position: [
            radius * Math.cos(altRad) * Math.sin(azRad),
            radius * Math.sin(altRad),
            -radius * Math.cos(altRad) * Math.cos(azRad),
          ] as [number, number, number],
        };
      })
      .filter(Boolean);
  }, [location, date, lst]);

  return (
    <>
      {objects.map((obj, i) => (
        <DSOObject key={i} dso={obj!} />
      ))}
    </>
  );
}

function DSOObject({ dso }: { dso: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => {
    const isGalaxy = dso.type === 'galaxy';
    return {
      time: { value: 0 },
      color1: { value: isGalaxy ? new THREE.Color(0.9, 0.85, 0.7) : new THREE.Color(0.9, 0.4, 0.5) },
      color2: { value: isGalaxy ? new THREE.Color(0.5, 0.45, 0.7) : new THREE.Color(0.4, 0.3, 0.9) },
      objectType: { value: isGalaxy ? 1.0 : 0.0 },
    };
  }, [dso.type]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = clock.getElapsedTime();
      }
      meshRef.current.lookAt(0, 0, 0);
    }
  });

  const size = Math.max(8, dso.size / 2);

  return (
    <mesh ref={meshRef} position={dso.position}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        vertexShader={dsoVertexShader}
        fragmentShader={dsoFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Planets with realistic glow
function Planets({ location, date }: { location: { latitude: number; longitude: number }; date: Date }) {
  const lst = getLocalSiderealTime(date, location.longitude);
  const planets = getPlanetPositions(date);

  return (
    <>
      {planets.map(planet => {
        const { altitude, azimuth } = equatorialToHorizontal(
          planet.ra, planet.dec, location.latitude, lst
        );

        if (altitude < 0) return null;

        const altRad = (altitude * Math.PI) / 180;
        const azRad = ((azimuth - 180) * Math.PI) / 180;
        const radius = 400;

        const position: [number, number, number] = [
          radius * Math.cos(altRad) * Math.sin(azRad),
          radius * Math.sin(altRad),
          -radius * Math.cos(altRad) * Math.cos(azRad),
        ];

        const color = new THREE.Color(planet.color);

        return (
          <group key={planet.name} position={position}>
            {/* Outer glow */}
            <mesh>
              <sphereGeometry args={[planet.size * 4, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.08}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Inner glow */}
            <mesh>
              <sphereGeometry args={[planet.size * 2, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Planet body */}
            <mesh>
              <sphereGeometry args={[planet.size * 0.8, 32, 32]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// Moon with realistic appearance
function Moon({ location, date }: { location: { latitude: number; longitude: number }; date: Date }) {
  const lst = getLocalSiderealTime(date, location.longitude);
  const moon = getMoonPosition(date);
  
  const { altitude, azimuth } = equatorialToHorizontal(
    moon.rightAscension, moon.declination, location.latitude, lst
  );

  if (altitude < 0) return null;

  const altRad = (altitude * Math.PI) / 180;
  const azRad = ((azimuth - 180) * Math.PI) / 180;
  const radius = 350;

  const position: [number, number, number] = [
    radius * Math.cos(altRad) * Math.sin(azRad),
    radius * Math.sin(altRad),
    -radius * Math.cos(altRad) * Math.cos(azRad),
  ];

  return (
    <group position={position}>
      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial
          color={0xffffee}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial
          color={0xfffff5}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Moon surface */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color={0xf0f0e8} />
      </mesh>
    </group>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 0.1);
    camera.lookAt(0, 0, -1);
  }, [camera]);

  return (
    <OrbitControls
      enableZoom
      enablePan={false}
      enableRotate
      rotateSpeed={0.4}
      zoomSpeed={0.5}
      minDistance={0.01}
      maxDistance={0.1}
      target={[0, 0, 0]}
    />
  );
}

// Sky gradient atmosphere
function SkyGradient() {
  return (
    <mesh>
      <sphereGeometry args={[950, 32, 32]} />
      <meshBasicMaterial
        color={0x000308}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export function ThreeSkyScene({
  location,
  date,
  showPlanets,
  showDeepSky,
  showMilkyWay,
}: ThreeSkySceneProps) {
  return (
    <Canvas
      camera={{ fov: 75, near: 0.001, far: 2000, position: [0, 0, 0.1] }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{ background: '#000005' }}
    >
      <CameraController />
      
      {/* Dark sky background */}
      <SkyGradient />
      
      {/* Volumetric Milky Way */}
      {showMilkyWay && <MilkyWay />}
      
      {/* Background faint stars */}
      <BackgroundStarField />
      
      {/* Main catalog stars with twinkling */}
      <RealisticStars location={location} date={date} />
      
      {/* Deep sky objects */}
      {showDeepSky && <DeepSkyObjects location={location} date={date} />}
      
      {/* Planets and Moon */}
      {showPlanets && (
        <>
          <Planets location={location} date={date} />
          <Moon location={location} date={date} />
        </>
      )}
    </Canvas>
  );
}
