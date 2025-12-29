import { useEffect, useState, useCallback, useRef } from 'react';
import { Compass, Navigation, RotateCcw, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeviceOrientationControllerProps {
  enabled: boolean;
  onOrientationChange: (orientation: { alpha: number; beta: number; gamma: number }) => void;
  onCompassChange: (heading: number) => void;
  cameraRef?: React.RefObject<{ rotate: (dx: number, dy: number) => void }>;
}

export function DeviceOrientationController({
  enabled,
  onOrientationChange,
  onCompassChange,
  cameraRef,
}: DeviceOrientationControllerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [compassHeading, setCompassHeading] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const lastOrientation = useRef({ alpha: 0, beta: 0 });
  const smoothedOrientation = useRef({ alpha: 0, beta: 0 });
  
  const requestPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setHasPermission(permissionState === 'granted');
        return permissionState === 'granted';
      } catch (error) {
        console.error('Device orientation permission error:', error);
        setHasPermission(false);
        return false;
      }
    } else {
      // Non-iOS devices don't require permission
      setHasPermission(true);
      return true;
    }
  }, []);
  
  useEffect(() => {
    if (!enabled || isLocked) return;
    
    let animationFrame: number;
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null || event.beta === null || event.gamma === null) return;
      
      const newOrientation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };
      
      setOrientation(newOrientation);
      onOrientationChange(newOrientation);
      
      // Calculate compass heading
      // webkitCompassHeading is more accurate on iOS
      const heading = (event as any).webkitCompassHeading || 
                     (360 - event.alpha);
      setCompassHeading(heading);
      onCompassChange(heading);
      
      // Apply smooth camera rotation based on device movement
      if (cameraRef?.current) {
        // Calculate deltas for smooth movement
        const alphaDelta = newOrientation.alpha - lastOrientation.current.alpha;
        const betaDelta = newOrientation.beta - lastOrientation.current.beta;
        
        // Handle wrap-around for alpha (0-360)
        const normalizedAlphaDelta = alphaDelta > 180 ? alphaDelta - 360 :
                                     alphaDelta < -180 ? alphaDelta + 360 : alphaDelta;
        
        // Smooth the values
        const smoothFactor = 0.1;
        smoothedOrientation.current.alpha += (normalizedAlphaDelta - smoothedOrientation.current.alpha) * smoothFactor;
        smoothedOrientation.current.beta += (betaDelta - smoothedOrientation.current.beta) * smoothFactor;
        
        // Apply rotation (scaled down for subtle movement)
        const rotationScale = 0.003;
        cameraRef.current.rotate(
          smoothedOrientation.current.alpha * rotationScale,
          smoothedOrientation.current.beta * rotationScale
        );
        
        lastOrientation.current = { alpha: newOrientation.alpha, beta: newOrientation.beta };
      }
    };
    
    const initOrientation = async () => {
      const granted = await requestPermission();
      if (granted) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };
    
    initOrientation();
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [enabled, isLocked, onOrientationChange, onCompassChange, cameraRef, requestPermission]);
  
  if (!enabled) return null;
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {/* Compass display */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
        <div className="relative w-12 h-12">
          {/* Compass rose */}
          <div 
            className="absolute inset-0 transition-transform duration-150"
            style={{ transform: `rotate(${-compassHeading}deg)` }}
          >
            {/* N marker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
                            border-l-[6px] border-r-[6px] border-b-[10px] 
                            border-l-transparent border-r-transparent border-b-primary" />
            {/* S marker */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 
                            border-l-[4px] border-r-[4px] border-t-[6px] 
                            border-l-transparent border-r-transparent border-t-muted-foreground" />
            {/* E marker */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 
                            border-t-[4px] border-b-[4px] border-l-[6px] 
                            border-t-transparent border-b-transparent border-l-muted-foreground" />
            {/* W marker */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 
                            border-t-[4px] border-b-[4px] border-r-[6px] 
                            border-t-transparent border-b-transparent border-r-muted-foreground" />
            {/* Circle outline */}
            <div className="absolute inset-1 rounded-full border border-muted-foreground/30" />
          </div>
          {/* Center point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">
            {Math.round(compassHeading)}°
          </span>
          <span className="text-xs text-muted-foreground">
            {getCardinalDirection(compassHeading)}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsLocked(!isLocked)}
        >
          {isLocked ? (
            <Lock className="w-4 h-4 text-primary" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {/* Orientation indicators */}
      <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="text-foreground/60">Tilt:</span>
          <span>{Math.round(orientation.beta)}°</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-foreground/60">Roll:</span>
          <span>{Math.round(orientation.gamma)}°</span>
        </div>
      </div>
      
      {hasPermission === false && (
        <Button
          variant="outline"
          size="sm"
          onClick={requestPermission}
          className="glass"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Enable Compass
        </Button>
      )}
    </div>
  );
}

function getCardinalDirection(heading: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((heading % 360) / 22.5)) % 16;
  return directions[index];
}
