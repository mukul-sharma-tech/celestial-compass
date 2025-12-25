import { useState, useCallback, useEffect, useRef } from 'react';
import { ThreeSkyScene } from '@/components/ThreeSkyScene';
import { ControlPanel } from '@/components/ControlPanel';
import { ObjectInfo } from '@/components/ObjectInfo';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CompassOverlay } from '@/components/CompassOverlay';
import { ARCameraBackground } from '@/components/ARCameraBackground';
import { SearchBox } from '@/components/SearchBox';
import { JoystickController } from '@/components/JoystickController';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

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
  const [showNorthernLights, setShowNorthernLights] = useState(false);
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
  
  const cameraRef = useRef<{ rotate: (dx: number, dy: number) => void }>(null);

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

  const handleSearchSelect = useCallback((result: any) => {
    setSelectedObject({
      type: result.type,
      name: result.name,
      data: result,
    });
  }, []);

  const handleJoystickMove = useCallback((dx: number, dy: number) => {
    if (cameraRef.current) {
      cameraRef.current.rotate(dx, dy);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* AR Camera Background */}
      <ARCameraBackground enabled={arMode} />

      {/* Three.js Sky Scene */}
      <div className={`absolute inset-0 ${arMode ? 'opacity-70' : ''}`}>
        <ThreeSkyScene
          location={location}
          date={date}
          showConstellations={showConstellations}
          showPlanets={showPlanets}
          showDeepSky={showDeepSky}
          showMilkyWay={showMilkyWay}
          showNorthernLights={showNorthernLights}
          onObjectSelect={handleObjectSelect}
          cameraRef={cameraRef}
        />
      </div>

      {/* Search Box */}
      <SearchBox onSelectObject={handleSearchSelect} />

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

      {/* Joystick Controller */}
      <JoystickController onMove={handleJoystickMove} />

      {/* Northern Lights Toggle */}
      <div className="fixed bottom-20 left-4 z-50 glass rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-green-400" />
          <Label htmlFor="aurora" className="text-sm text-foreground/80">Aurora</Label>
          <Switch
            id="aurora"
            checked={showNorthernLights}
            onCheckedChange={setShowNorthernLights}
          />
        </div>
      </div>

      {/* AR Mode toggle */}
      <button
        onClick={() => setArMode(!arMode)}
        className={`fixed bottom-36 right-4 z-50 glass rounded-full px-4 py-2 text-sm transition-all ${
          arMode ? 'bg-primary/30 text-primary' : 'text-muted-foreground'
        }`}
      >
        {arMode ? 'AR ON' : 'AR OFF'}
      </button>

      {/* Instructions hint */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
        <div className="glass rounded-full px-6 py-2 text-sm text-muted-foreground">
          Drag to explore • Use joystick to navigate • Search for objects
        </div>
      </div>
    </div>
  );
};

export default Index;