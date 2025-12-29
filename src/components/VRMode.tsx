import { useState, useEffect, useCallback } from 'react';
import { Glasses, X, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VRModeProps {
  enabled: boolean;
  onToggle: () => void;
  onEnterVR: () => void;
  onExitVR: () => void;
}

export function VRModeButton({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  const [vrSupported, setVrSupported] = useState(false);
  
  useEffect(() => {
    // Check for WebXR support
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported?.('immersive-vr').then((supported: boolean) => {
        setVrSupported(supported);
      }).catch(() => {
        setVrSupported(false);
      });
    }
  }, []);
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-10 w-10 ${enabled ? 'text-purple-400 bg-purple-500/20' : ''}`}
      onClick={onToggle}
      title={vrSupported ? 'Enter VR Mode' : 'VR Cardboard Mode'}
    >
      <Glasses className="w-5 h-5" />
    </Button>
  );
}

export function VROverlay({ 
  enabled, 
  onExit 
}: { 
  enabled: boolean; 
  onExit: () => void;
}) {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  
  useEffect(() => {
    if (!enabled) return;
    
    // Request fullscreen
    const requestFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        // Lock to landscape
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
    
    return () => {
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
  
  return (
    <>
      {/* VR Stereoscopic divider line */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black" />
        
        {/* Left eye crosshair */}
        <div className="absolute left-[25%] top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-white/30 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/50 rounded-full" />
          </div>
        </div>
        
        {/* Right eye crosshair */}
        <div className="absolute left-[75%] top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-white/30 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/50 rounded-full" />
          </div>
        </div>
        
        {/* Cardboard frame indicators */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
          <div className="w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
        </div>
        <div className="absolute bottom-2 left-2 right-2 flex justify-between">
          <div className="w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
          <div className="w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
        </div>
      </div>
      
      {/* Exit button - positioned for easy tap */}
      <button
        onClick={onExit}
        className="fixed top-4 left-4 z-[110] glass rounded-full p-3 pointer-events-auto"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* VR instructions - shows briefly */}
      <VRInstructions />
    </>
  );
}

function VRInstructions() {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center pointer-events-none">
      <div className="glass rounded-2xl p-6 max-w-sm mx-4 text-center animate-fade-in">
        <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-bold mb-2">VR Mode Active</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Place your phone in a VR headset or cardboard viewer.
          Move your head to look around the sky.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Tap the X to exit VR mode</span>
        </div>
      </div>
    </div>
  );
}

// Stereoscopic camera setup for Three.js
export function useVRCamera(enabled: boolean) {
  const [eyeSeparation] = useState(0.064); // Standard IPD in meters
  
  const getLeftEyeMatrix = useCallback((camera: THREE.Camera) => {
    if (!enabled) return camera.matrixWorld;
    
    const leftEyeMatrix = camera.matrixWorld.clone();
    leftEyeMatrix.elements[12] -= eyeSeparation / 2;
    return leftEyeMatrix;
  }, [enabled, eyeSeparation]);
  
  const getRightEyeMatrix = useCallback((camera: THREE.Camera) => {
    if (!enabled) return camera.matrixWorld;
    
    const rightEyeMatrix = camera.matrixWorld.clone();
    rightEyeMatrix.elements[12] += eyeSeparation / 2;
    return rightEyeMatrix;
  }, [enabled, eyeSeparation]);
  
  return { getLeftEyeMatrix, getRightEyeMatrix, eyeSeparation };
}

import * as THREE from 'three';
