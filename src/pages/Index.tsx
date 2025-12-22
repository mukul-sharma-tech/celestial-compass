import { useState, useCallback, useEffect } from 'react';
import { ThreeSkyScene } from '@/components/ThreeSkyScene';
import { ControlPanel } from '@/components/ControlPanel';
import { ObjectInfo } from '@/components/ObjectInfo';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CompassOverlay } from '@/components/CompassOverlay';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
  });
  const [showConstellations, setShowConstellations] = useState(true);
  const [showPlanets, setShowPlanets] = useState(true);
  const [showDeepSky, setShowDeepSky] = useState(true);
  const [showMilkyWay, setShowMilkyWay] = useState(true);
  const [selectedObject, setSelectedObject] = useState<{
    type: string;
    name: string;
    data: any;
  } | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<{
    alpha: number;
    beta: number;
    gamma: number;
  } | null>(null);
  const [arMode, setArMode] = useState(false);

  // Request device orientation for AR mode
  useEffect(() => {
    if (!arMode) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        setDeviceOrientation({
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
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [arMode]);

  // Get user's real location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const handleObjectSelect = useCallback((obj: { type: string; name: string; data: any } | null) => {
    setSelectedObject(obj);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Three.js Sky Scene */}
      <div className="absolute inset-0">
        <ThreeSkyScene
          location={location}
          date={date}
          showConstellations={showConstellations}
          showPlanets={showPlanets}
          showDeepSky={showDeepSky}
          showMilkyWay={showMilkyWay}
          onObjectSelect={handleObjectSelect}
        />
      </div>

      {/* Compass overlay */}
      <CompassOverlay 
        azimuth={deviceOrientation?.alpha || 180} 
      />

      {/* Control panel */}
      <ControlPanel
        date={date}
        onDateChange={setDate}
        location={location}
        onLocationChange={setLocation}
        showConstellations={showConstellations}
        onShowConstellationsChange={setShowConstellations}
        showPlanets={showPlanets}
        onShowPlanetsChange={setShowPlanets}
        showDeepSky={showDeepSky}
        onShowDeepSkyChange={setShowDeepSky}
        showMilkyWay={showMilkyWay}
        onShowMilkyWayChange={setShowMilkyWay}
      />

      {/* Object info panel */}
      <ObjectInfo
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
      />

      {/* AR Mode toggle */}
      <button
        onClick={() => setArMode(!arMode)}
        className={`fixed bottom-20 right-4 z-50 glass rounded-full px-4 py-2 text-sm transition-all ${
          arMode ? 'bg-primary/30 text-primary' : 'text-muted-foreground'
        }`}
      >
        {arMode ? 'AR ON' : 'AR OFF'}
      </button>

      {/* Instructions hint */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
        <div className="glass rounded-full px-6 py-2 text-sm text-muted-foreground">
          Drag to explore • Pinch to zoom • Stars twinkle realistically
        </div>
      </div>
    </div>
  );
};

export default Index;
