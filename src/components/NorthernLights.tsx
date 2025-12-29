import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const auroraVertexShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform float expansive;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  // Simplex noise functions
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
    vec3 pos = normalize(vPosition);
    
    // Expansive mode - aurora spans entire sky like milky way
    float verticalCoverage;
    if(expansive > 0.5) {
      // Full sky coverage - wraps around like milky way band
      verticalCoverage = 1.0;
    } else {
      // Traditional northern aurora - only in upper hemisphere
      verticalCoverage = smoothstep(0.2, 0.7, pos.y);
      if(pos.y < 0.1) discard;
    }
    
    // Horizontal position for curtain/band effect
    float angle = atan(pos.x, pos.z);
    float height = expansive > 0.5 ? (pos.y * 0.5 + 0.5) : pos.y;
    
    // Multi-layered flowing noise - more layers for expansive mode
    float t = time * 0.15;
    float noise1 = snoise(vec3(angle * 3.0, height * 4.0 + t, t * 0.4)) * 0.5 + 0.5;
    float noise2 = snoise(vec3(angle * 6.0 + 100.0, height * 7.0 + t * 1.2, t * 0.25)) * 0.5 + 0.5;
    float noise3 = snoise(vec3(angle * 12.0 + 200.0, height * 12.0 + t * 1.8, t * 0.15)) * 0.5 + 0.5;
    float noise4 = snoise(vec3(angle * 2.0 + t * 0.3, height * 2.0 - t * 0.2, t * 0.5)) * 0.5 + 0.5;
    
    // Different patterns for expansive vs traditional
    float pattern;
    if(expansive > 0.5) {
      // Milky way style - sweeping band across sky
      float bandAngle = atan(pos.z, pos.x);
      float bandPos = sin(bandAngle * 0.5 + pos.y * 2.0) * 0.5 + 0.5;
      float band = exp(-pow((bandPos - 0.5), 2.0) * 4.0);
      
      // Flowing ribbons
      float ribbons = sin(angle * 5.0 + noise1 * 4.0 + t * 2.0) * 0.5 + 0.5;
      ribbons = pow(ribbons, 1.5);
      
      // Vertical streamers
      float streamers = pow(noise2 * noise3, 0.8);
      
      // Combine for expansive aurora
      pattern = (band * 0.6 + ribbons * 0.3 + streamers * 0.4) * noise4;
      pattern = pow(pattern, 0.9) * 1.5;
    } else {
      // Traditional curtain effect
      float curtains = sin(angle * 8.0 + noise1 * 3.0 + t) * 0.5 + 0.5;
      curtains = pow(curtains, 2.0);
      float rays = pow(noise2, 1.5) * noise3;
      float verticalFade = exp(-pow((height - 0.4), 2.0) * 3.0);
      pattern = curtains * rays * verticalFade * verticalCoverage;
    }
    
    float aurora = pattern * intensity;
    
    // Enhanced vibrant color palette
    vec3 brightGreen = vec3(0.2, 1.0, 0.4);
    vec3 cyan = vec3(0.1, 0.9, 1.0);
    vec3 magenta = vec3(1.0, 0.2, 0.6);
    vec3 purple = vec3(0.6, 0.1, 1.0);
    vec3 pink = vec3(1.0, 0.4, 0.7);
    vec3 blue = vec3(0.2, 0.4, 1.0);
    
    // Dynamic color mixing based on position and noise
    vec3 color;
    if(expansive > 0.5) {
      // More vibrant, varied colors for expansive mode
      color = mix(brightGreen, cyan, noise1);
      color = mix(color, magenta, noise2 * 0.6);
      color = mix(color, purple, pow(abs(pos.y), 1.5) * noise3 * 0.7);
      color = mix(color, pink, noise4 * 0.4);
      color = mix(color, blue, (1.0 - noise1) * 0.3);
      color *= 1.2 + noise1 * 0.6;
    } else {
      // Traditional green-dominant aurora
      color = mix(brightGreen, cyan, noise1 * 0.5);
      color = mix(color, purple, pow(height, 2.0) * noise2 * 0.6);
      color = mix(color, pink, pow(height, 3.0) * noise3 * 0.3);
      color *= 0.8 + noise1 * 0.4;
    }
    
    float alpha = aurora * (expansive > 0.5 ? 0.7 : 0.6);
    if(alpha < 0.01) discard;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

interface NorthernLightsProps {
  enabled: boolean;
  intensity?: number;
  expansive?: boolean;
}

export function NorthernLights({ enabled, intensity = 1.0, expansive = false }: NorthernLightsProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    intensity: { value: intensity },
    expansive: { value: expansive ? 1.0 : 0.0 },
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current && enabled) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = clock.getElapsedTime();
        mat.uniforms.intensity.value = intensity;
        mat.uniforms.expansive.value = expansive ? 1.0 : 0.0;
      }
    }
  });

  if (!enabled) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[550, 64, 64]} />
      <shaderMaterial
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}