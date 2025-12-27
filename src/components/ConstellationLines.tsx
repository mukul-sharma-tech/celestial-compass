import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brightStars, constellations } from '@/data/starCatalog';
import { getLocalSiderealTime, equatorialToHorizontal } from '@/lib/astronomy';

interface ConstellationLinesProps {
  enabled: boolean;
  location: { latitude: number; longitude: number };
  date: Date;
  selectedConstellation?: string | null;
}

const lineVertexShader = `
  attribute float lineProgress;
  varying float vProgress;
  varying vec3 vPosition;
  
  void main() {
    vProgress = lineProgress;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragmentShader = `
  uniform float time;
  uniform float animationProgress;
  uniform vec3 lineColor;
  uniform float isSelected;
  
  varying float vProgress;
  varying vec3 vPosition;
  
  void main() {
    // Animated glow effect
    float glow = sin(time * 2.0 + vProgress * 10.0) * 0.2 + 0.8;
    
    // Draw animation
    float drawProgress = smoothstep(0.0, animationProgress, vProgress);
    
    // Base opacity
    float baseOpacity = isSelected > 0.5 ? 0.7 : 0.35;
    float alpha = baseOpacity * glow * drawProgress;
    
    // Color with subtle variation
    vec3 color = lineColor * (0.9 + glow * 0.1);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export function ConstellationLines({ enabled, location, date, selectedConstellation }: ConstellationLinesProps) {
  const linesRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const animationRef = useRef(0);
  
  const lst = useMemo(() => getLocalSiderealTime(date, location.longitude), [date, location.longitude]);
  
  const starPositions = useMemo(() => {
    const positions: Record<string, THREE.Vector3> = {};
    const radius = 495;
    
    brightStars.forEach(star => {
      const { altitude, azimuth } = equatorialToHorizontal(
        star.ra, star.dec, location.latitude, lst
      );
      
      if (altitude < -10) return;
      
      const altRad = (altitude * Math.PI) / 180;
      const azRad = ((azimuth - 180) * Math.PI) / 180;
      
      positions[star.id] = new THREE.Vector3(
        radius * Math.cos(altRad) * Math.sin(azRad),
        radius * Math.sin(altRad),
        -radius * Math.cos(altRad) * Math.cos(azRad)
      );
    });
    
    return positions;
  }, [location, lst]);
  
  const constellationData = useMemo(() => {
    return constellations.map(constellation => {
      const lines: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
      
      constellation.lines.forEach(([startId, endId]) => {
        const startPos = starPositions[startId];
        const endPos = starPositions[endId];
        
        if (startPos && endPos) {
          lines.push({ start: startPos.clone(), end: endPos.clone() });
        }
      });
      
      return {
        id: constellation.id,
        name: constellation.name,
        lines,
      };
    }).filter(c => c.lines.length > 0);
  }, [starPositions]);
  
  useFrame(({ clock }) => {
    if (!enabled) return;
    
    // Animate drawing
    animationRef.current = Math.min(1, animationRef.current + 0.01);
    
    materialsRef.current.forEach((material, index) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = clock.getElapsedTime();
        material.uniforms.animationProgress.value = animationRef.current;
        
        const constellation = constellationData[index];
        const isSelected = selectedConstellation && 
          (constellation?.id === selectedConstellation || 
           constellation?.name.toLowerCase() === selectedConstellation.toLowerCase());
        material.uniforms.isSelected.value = isSelected ? 1.0 : 0.0;
      }
    });
  });
  
  if (!enabled) return null;
  
  return (
    <group ref={linesRef}>
      {constellationData.map((constellation, constIndex) => (
        <group key={constellation.id}>
          {constellation.lines.map((line, lineIndex) => {
            const points = [line.start, line.end];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Add line progress attribute
            const progress = new Float32Array([0, 1]);
            geometry.setAttribute('lineProgress', new THREE.BufferAttribute(progress, 1));
            
            return (
              <line key={`${constellation.id}-${lineIndex}`}>
                <bufferGeometry attach="geometry">
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([
                      line.start.x, line.start.y, line.start.z,
                      line.end.x, line.end.y, line.end.z
                    ]), 3]}
                  />
                  <bufferAttribute
                    attach="attributes-lineProgress"
                    args={[new Float32Array([0, 1]), 1]}
                  />
                </bufferGeometry>
                <shaderMaterial
                  ref={(el) => {
                    if (el && !materialsRef.current.includes(el)) {
                      materialsRef.current[constIndex * 100 + lineIndex] = el;
                    }
                  }}
                  vertexShader={lineVertexShader}
                  fragmentShader={lineFragmentShader}
                  uniforms={{
                    time: { value: 0 },
                    animationProgress: { value: 0 },
                    lineColor: { value: new THREE.Color(0.4, 0.6, 0.9) },
                    isSelected: { value: 0 },
                  }}
                  transparent
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </line>
            );
          })}
        </group>
      ))}
    </group>
  );
}
