import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShootingStarsProps {
  enabled: boolean;
  intensity?: number; // Controls frequency of meteors
}

const meteorVertexShader = `
  attribute float size;
  attribute float alpha;
  attribute float trailPosition;
  
  varying float vAlpha;
  varying float vTrailPosition;
  
  void main() {
    vAlpha = alpha;
    vTrailPosition = trailPosition;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const meteorFragmentShader = `
  varying float vAlpha;
  varying float vTrailPosition;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Bright core
    float core = exp(-dist * dist * 50.0);
    
    // Soft glow
    float glow = exp(-dist * dist * 10.0) * 0.5;
    
    float intensity = (core + glow) * vAlpha;
    
    // White-hot core fading to orange/red in trail
    vec3 coreColor = vec3(1.0, 1.0, 1.0);
    vec3 trailColor = vec3(1.0, 0.6, 0.2);
    vec3 color = mix(coreColor, trailColor, vTrailPosition);
    
    if (intensity < 0.01) discard;
    
    gl_FragColor = vec4(color, intensity);
  }
`;

interface Meteor {
  active: boolean;
  startTime: number;
  duration: number;
  startPos: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  trailLength: number;
}

export function ShootingStars({ enabled, intensity = 1 }: ShootingStarsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const maxMeteors = 5;
  const trailPoints = 30; // Points per meteor trail
  const totalPoints = maxMeteors * trailPoints;
  
  const meteorsRef = useRef<Meteor[]>(
    Array(maxMeteors).fill(null).map(() => ({
      active: false,
      startTime: 0,
      duration: 0,
      startPos: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      speed: 0,
      trailLength: 0,
    }))
  );
  
  const { positions, sizes, alphas, trailPositions } = useMemo(() => {
    return {
      positions: new Float32Array(totalPoints * 3),
      sizes: new Float32Array(totalPoints),
      alphas: new Float32Array(totalPoints),
      trailPositions: new Float32Array(totalPoints),
    };
  }, [totalPoints]);
  
  useFrame(({ clock }) => {
    if (!enabled || !pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const sizeAttr = geometry.attributes.size as THREE.BufferAttribute;
    const alphaAttr = geometry.attributes.alpha as THREE.BufferAttribute;
    
    // Spawn new meteors
    meteorsRef.current.forEach((meteor, meteorIndex) => {
      if (!meteor.active) {
        // Random chance to spawn based on intensity
        if (Math.random() < 0.002 * intensity) {
          // Random start position on sky dome
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI * 0.4 + 0.2; // Upper hemisphere
          const radius = 400;
          
          meteor.startPos.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );
          
          // Direction - generally downward with some variation
          meteor.direction.set(
            (Math.random() - 0.5) * 0.5,
            -0.8 - Math.random() * 0.2,
            (Math.random() - 0.5) * 0.5
          ).normalize();
          
          meteor.active = true;
          meteor.startTime = time;
          meteor.duration = 0.5 + Math.random() * 1;
          meteor.speed = 150 + Math.random() * 200;
          meteor.trailLength = 20 + Math.random() * 40;
        }
      }
      
      // Update active meteors
      if (meteor.active) {
        const elapsed = time - meteor.startTime;
        const progress = elapsed / meteor.duration;
        
        if (progress >= 1) {
          meteor.active = false;
          // Hide points
          for (let i = 0; i < trailPoints; i++) {
            const idx = meteorIndex * trailPoints + i;
            alphaAttr.array[idx] = 0;
          }
        } else {
          // Calculate head position
          const headPos = meteor.startPos.clone().add(
            meteor.direction.clone().multiplyScalar(elapsed * meteor.speed)
          );
          
          // Update trail points
          for (let i = 0; i < trailPoints; i++) {
            const trailProgress = i / trailPoints;
            const idx = meteorIndex * trailPoints + i;
            
            // Trail position behind the head
            const trailOffset = meteor.direction.clone().multiplyScalar(-trailProgress * meteor.trailLength);
            const pos = headPos.clone().add(trailOffset);
            
            posAttr.array[idx * 3] = pos.x;
            posAttr.array[idx * 3 + 1] = pos.y;
            posAttr.array[idx * 3 + 2] = pos.z;
            
            // Size - larger at head, smaller at tail
            sizeAttr.array[idx] = (1 - trailProgress) * 3 + 0.5;
            
            // Alpha - fade in and out, plus trail fade
            const fadeIn = Math.min(1, progress * 4);
            const fadeOut = Math.max(0, 1 - (progress - 0.7) / 0.3);
            const trailFade = 1 - trailProgress * 0.9;
            alphaAttr.array[idx] = fadeIn * fadeOut * trailFade;
            
            // Trail position for color gradient
            (geometry.attributes.trailPosition as THREE.BufferAttribute).array[idx] = trailProgress;
          }
        }
      }
    });
    
    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-alpha" args={[alphas, 1]} />
        <bufferAttribute attach="attributes-trailPosition" args={[trailPositions, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={meteorVertexShader}
        fragmentShader={meteorFragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
