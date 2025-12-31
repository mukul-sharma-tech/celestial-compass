import { useState, useEffect, useRef } from 'react';
import { Glasses, X, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Canvas } from '@react-three/fiber';
import { ThreeSkyScene } from './ThreeSkyScene';
import * as THREE from 'three';

interface VROverlayProps {
  enabled: boolean;
  onExit: () => void;
  location: { latitude: number; longitude: number };
  date: Date;
  showConstellations: boolean;
  showConstellationLines: boolean;
  showPlanets: boolean;
  showDeepSky: boolean;
  showMilkyWay: boolean;
  showNorthernLights: boolean;
  showShootingStars: boolean;
  showISS: boolean;
  expansiveAurora: boolean;
  selectedConstellation: string | null;
}

export function VRModeButton({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-10 w-10 ${enabled ? 'text-purple-400 bg-purple-500/20' : ''}`}
      onClick={onToggle}
      title="VR Cardboard Mode"
    >
      <Glasses className="w-5 h-5" />
    </Button>
  );
}

export function VROverlay({ 
  enabled, 
  onExit,
  location,
  date,
  showConstellations,
  showConstellationLines,
  showPlanets,
  showDeepSky,
  showMilkyWay,
  showNorthernLights,
  showShootingStars,
  showISS,
  expansiveAurora,
  selectedConstellation,
}: VROverlayProps) {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [showInstructions, setShowInstructions] = useState(true);
  const leftCameraRef = useRef<any>(null);
  const rightCameraRef = useRef<any>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    // Request fullscreen and lock to landscape
    const requestFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        if (screen.orientation && 'lock' in screen.orientation) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch (e) {
            console.log('Could not lock orientation');
          }
        }
      } catch (e) {
        console.log('Fullscreen not available');
      }
    };
    
    requestFullscreen();
    
    // Device orientation for head tracking
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        setOrientation({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        });
        
        // Sync camera rotation to both views
        const alphaRad = THREE.MathUtils.degToRad(event.alpha);
        const betaRad = THREE.MathUtils.degToRad(event.beta - 90);
        const gammaRad = THREE.MathUtils.degToRad(event.gamma);
        
        if (leftCameraRef.current?.rotate) {
          leftCameraRef.current.rotate(gammaRad * 0.02, betaRad * 0.02);
        }
        if (rightCameraRef.current?.rotate) {
          rightCameraRef.current.rotate(gammaRad * 0.02, betaRad * 0.02);
        }
      }
    };
    
    // Request permission on iOS
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        });
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    
    // Hide instructions after delay
    const timer = setTimeout(() => setShowInstructions(false), 4000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock?.();
      }
    };
  }, [enabled]);
  
  if (!enabled) return null;

  const sceneProps = {
    location,
    date,
    showConstellations,
    showConstellationLines,
    showPlanets,
    showDeepSky,
    showMilkyWay,
    showNorthernLights,
    showShootingStars,
    showISS,
    expansiveAurora,
    selectedConstellation,
    vrMode: true,
    onObjectSelect: () => {},
  };
  
  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Split screen container - landscape layout */}
      <div className="w-full h-full flex flex-row">
        {/* Left eye view */}
        <div className="w-1/2 h-full relative overflow-hidden">
          <ThreeSkyScene 
            {...sceneProps} 
            cameraRef={leftCameraRef}
            eyeOffset={-0.032}
          />
          {/* Left eye lens distortion overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0" 
              style={{
                background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4) 100%)'
              }}
            />
          </div>
          {/* Left crosshair */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border border-white/20 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Center divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10 -translate-x-1/2" />
        
        {/* Right eye view */}
        <div className="w-1/2 h-full relative overflow-hidden">
          <ThreeSkyScene 
            {...sceneProps} 
            cameraRef={rightCameraRef}
            eyeOffset={0.032}
          />
          {/* Right eye lens distortion overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0" 
              style={{
                background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4) 100%)'
              }}
            />
          </div>
          {/* Right crosshair */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border border-white/20 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Exit button */}
      <button
        onClick={onExit}
        className="fixed top-3 left-3 z-[110] bg-black/50 backdrop-blur-sm rounded-full p-2 pointer-events-auto border border-white/20"
      >
        <X className="w-5 h-5 text-white/80" />
      </button>
      
      {/* VR Instructions */}
      {showInstructions && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 max-w-xs mx-4 text-center border border-white/10">
            <Smartphone className="w-10 h-10 mx-auto mb-3 text-purple-400" />
            <h3 className="text-base font-bold text-white mb-2">VR Mode Active</h3>
            <p className="text-xs text-white/70 mb-3">
              Place phone in VR headset. Move your head to explore the sky.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-white/50">
              <AlertCircle className="w-3 h-3" />
              <span>Tap X to exit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for stereoscopic camera offset
export function useVRCamera(enabled: boolean) {
  const [eyeSeparation] = useState(0.064);
  
  return { eyeSeparation };
}
