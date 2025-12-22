import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars as DreiStars } from '@react-three/drei';
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

// Custom shader for realistic twinkling stars
const starVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  attribute float twinklePhase;
  attribute float twinkleSpeed;
  
  varying vec3 vColor;
  varying float vTwinkle;
  
  uniform float time;
  
  void main() {
    vColor = customColor;
    
    // Atmospheric scintillation effect
    float twinkle = sin(time * twinkleSpeed + twinklePhase) * 0.3 + 0.7;
    twinkle *= sin(time * twinkleSpeed * 1.7 + twinklePhase * 0.7) * 0.2 + 0.8;
    vTwinkle = twinkle;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z) * twinkle;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;
  
  void main() {
    // Create soft circular star with glow
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Core
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    
    // Inner glow
    float innerGlow = 1.0 - smoothstep(0.0, 0.35, dist);
    
    // Outer glow
    float outerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Diffraction spikes (subtle)
    float angle = atan(center.y, center.x);
    float spikes = pow(abs(sin(angle * 2.0)), 8.0) * (1.0 - dist * 2.0);
    spikes = max(0.0, spikes) * 0.3;
    
    float alpha = core + innerGlow * 0.5 + outerGlow * 0.2 + spikes;
    alpha *= vTwinkle;
    
    vec3 finalColor = vColor * (core + 0.5) + vec3(1.0) * core * 0.3;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Nebula shader for volumetric effects
const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
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
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    
    // Animated noise
    float noise1 = snoise(vec3(uv * 3.0, time * 0.05)) * 0.5 + 0.5;
    float noise2 = snoise(vec3(uv * 5.0 + 100.0, time * 0.03)) * 0.5 + 0.5;
    float noise3 = snoise(vec3(uv * 8.0 + 200.0, time * 0.02)) * 0.5 + 0.5;
    
    float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // Radial falloff
    float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
    falloff = pow(falloff, 1.5);
    
    // Color mixing
    vec3 color = mix(color1, color2, combinedNoise);
    
    float alpha = combinedNoise * falloff * 0.4;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Star field component with realistic rendering
function RealisticStars({ location, date }: { location: { latitude: number; longitude: number }; date: Date }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, colors, sizes, twinklePhases, twinkleSpeeds } = useMemo(() => {
    const lst = getLocalSiderealTime(date, location.longitude);
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const twinklePhases: number[] = [];
    const twinkleSpeeds: number[] = [];

    allStars.forEach(star => {
      const { altitude, azimuth } = equatorialToHorizontal(
        star.ra, star.dec, location.latitude, lst
      );

      if (altitude < -5) return;

      // Convert to 3D coordinates on a sphere
      const altRad = (altitude * Math.PI) / 180;
      const azRad = ((azimuth - 180) * Math.PI) / 180;
      const radius = 500;

      const x = radius * Math.cos(altRad) * Math.sin(azRad);
      const y = radius * Math.sin(altRad);
      const z = -radius * Math.cos(altRad) * Math.cos(azRad);

      positions.push(x, y, z);

      // Parse star color
      const colorStr = getStarColor(star.spectralType);
      const hslMatch = colorStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const h = parseInt(hslMatch[1]) / 360;
        const s = parseInt(hslMatch[2]) / 100;
        const l = parseInt(hslMatch[3]) / 100;
        const color = new THREE.Color().setHSL(h, s, l);
        colors.push(color.r, color.g, color.b);
      } else {
        colors.push(1, 1, 1);
      }

      // Size based on magnitude (brighter = larger)
      const size = Math.max(0.5, 4 - star.magnitude * 0.5);
      sizes.push(size);

      // Random twinkle parameters
      twinklePhases.push(Math.random() * Math.PI * 2);
      twinkleSpeeds.push(1.5 + Math.random() * 3);
    });

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      twinklePhases: new Float32Array(twinklePhases),
      twinkleSpeeds: new Float32Array(twinkleSpeeds),
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-customColor"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-twinklePhase"
          args={[twinklePhases, 1]}
        />
        <bufferAttribute
          attach="attributes-twinkleSpeed"
          args={[twinkleSpeeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Background stars using drei
function BackgroundStars() {
  return (
    <DreiStars
      radius={800}
      depth={100}
      count={8000}
      factor={3}
      saturation={0.3}
      fade
      speed={0.5}
    />
  );
}

// Milky Way band
function MilkyWay() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = clock.getElapsedTime();
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 50, -400]} rotation={[0.3, 0, 0.5]}>
      <planeGeometry args={[600, 200, 1, 1]} />
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={{
          time: { value: 0 },
          color1: { value: new THREE.Color(0.6, 0.5, 0.4) },
          color2: { value: new THREE.Color(0.3, 0.25, 0.5) },
        }}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Nebulae
function Nebulae({ location, date }: { location: { latitude: number; longitude: number }; date: Date }) {
  const lst = getLocalSiderealTime(date, location.longitude);

  const nebulae = useMemo(() => {
    return deepSkyObjects
      .filter(dso => dso.type === 'nebula' || dso.type === 'galaxy')
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
      {nebulae.map((nebula, i) => (
        <NebulaObject key={i} nebula={nebula!} />
      ))}
    </>
  );
}

function NebulaObject({ nebula }: { nebula: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colors = useMemo(() => {
    if (nebula.type === 'galaxy') {
      return {
        color1: new THREE.Color(0.8, 0.7, 0.5),
        color2: new THREE.Color(0.4, 0.35, 0.6),
      };
    }
    return {
      color1: new THREE.Color(0.9, 0.3, 0.5),
      color2: new THREE.Color(0.3, 0.2, 0.8),
    };
  }, [nebula.type]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = clock.getElapsedTime();
      }
      meshRef.current.lookAt(0, 0, 0);
    }
  });

  const size = Math.max(10, nebula.size / 3);

  return (
    <mesh ref={meshRef} position={nebula.position}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={{
          time: { value: 0 },
          color1: { value: colors.color1 },
          color2: { value: colors.color2 },
        }}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Planets with glow
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
            {/* Glow */}
            <mesh>
              <sphereGeometry args={[planet.size * 3, 16, 16]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.2}
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

// Moon with glow
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
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial
          color={0xffffee}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Moon body */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color={0xf5f5dc} />
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
      rotateSpeed={0.3}
      zoomSpeed={0.5}
      minDistance={0.01}
      maxDistance={0.1}
      target={[0, 0, 0]}
    />
  );
}

// Ambient atmosphere
function Atmosphere() {
  return (
    <>
      {/* Ambient light for subtle illumination */}
      <ambientLight intensity={0.01} color={0x101020} />
      
      {/* Horizon glow */}
      <mesh position={[0, -250, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[600, 64]} />
        <meshBasicMaterial
          color={0x0a0a20}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
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
      camera={{ fov: 75, near: 0.01, far: 2000, position: [0, 0, 0.1] }}
      style={{ background: 'linear-gradient(to bottom, #000005, #020210, #000005)' }}
      gl={{ antialias: true, alpha: false }}
    >
      <CameraController />
      <Atmosphere />
      
      {/* Background layer of faint stars */}
      <BackgroundStars />
      
      {/* Main star field with realistic rendering */}
      <RealisticStars location={location} date={date} />
      
      {/* Milky Way */}
      {showMilkyWay && <MilkyWay />}
      
      {/* Deep sky objects */}
      {showDeepSky && <Nebulae location={location} date={date} />}
      
      {/* Planets */}
      {showPlanets && (
        <>
          <Planets location={location} date={date} />
          <Moon location={location} date={date} />
        </>
      )}
    </Canvas>
  );
}
