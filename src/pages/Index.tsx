import { useState, useCallback, useEffect, useRef } from 'react';
import { ThreeSkyScene } from '@/components/ThreeSkyScene';
import { ControlPanel } from '@/components/ControlPanel';
import { ObjectInfo } from '@/components/ObjectInfo';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CompassOverlay } from '@/components/CompassOverlay';
import { ARCameraBackground } from '@/components/ARCameraBackground';
import { SearchBox } from '@/components/SearchBox';
import { JoystickController } from '@/components/JoystickController';
import { MobileControlsPanel } from '@/components/MobileControlsPanel';
import { TimeLapseController } from '@/components/TimeLapseController';
import { VROverlay } from '@/components/VRMode';
import { DeviceOrientationController } from '@/components/DeviceOrientationController';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Zap, GitBranch, Clock, Satellite } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [baseDate] = useState(new Date());
  const [location, setLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
  });
  const [showConstellations, setShowConstellations] = useState(true);
  const [showConstellationLines, setShowConstellationLines] = useState(true);
  const [showPlanets, setShowPlanets] = useState(true);
  const [showDeepSky, setShowDeepSky] = useState(true);
  const [showMilkyWay, setShowMilkyWay] = useState(true);
  const [showNorthernLights, setShowNorthernLights] = useState(false);
  const [expansiveAurora, setExpansiveAurora] = useState(false);
  const [showShootingStars, setShowShootingStars] = useState(true);
  const [showISS, setShowISS] = useState(true);
  const [timeLapseEnabled, setTimeLapseEnabled] = useState(false);
  const [selectedObject, setSelectedObject] = useState<{
    type: string;
    name: string;
    data: any;
  } | null>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<string | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<{
    alpha: number;
    beta: number;
    gamma: number;
  } | null>(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [arMode, setArMode] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [compassMode, setCompassMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const cameraRef = useRef<{ rotate: (dx: number, dy: number) => void; setAngles: (azimuth: number, polar: number) => void }>(null);

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
    if (obj?.type === 'constellation') {
      setSelectedConstellation(obj.name);
    }
  }, []);

  const handleSearchSelect = useCallback((result: any) => {
    setSelectedObject({
      type: result.type,
      name: result.name,
      data: result,
    });
    if (result.type === 'constellation') {
      setSelectedConstellation(result.name);
    }
    setSearchOpen(false);
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
          showConstellationLines={showConstellationLines}
          showPlanets={showPlanets}
          showDeepSky={showDeepSky}
          showMilkyWay={showMilkyWay}
          showNorthernLights={showNorthernLights}
          showShootingStars={showShootingStars}
          showISS={showISS}
          vrMode={vrMode}
          expansiveAurora={expansiveAurora}
          selectedConstellation={selectedConstellation}
          onObjectSelect={handleObjectSelect}
          cameraRef={cameraRef}
        />
      </div>

      {/* VR Mode Overlay */}
      <VROverlay 
        enabled={vrMode} 
        onExit={() => setVrMode(false)}
        location={location}
        date={date}
        showConstellations={showConstellations}
        showConstellationLines={showConstellationLines}
        showPlanets={showPlanets}
        showDeepSky={showDeepSky}
        showMilkyWay={showMilkyWay}
        showNorthernLights={showNorthernLights}
        showShootingStars={showShootingStars}
        showISS={showISS}
        expansiveAurora={expansiveAurora}
        selectedConstellation={selectedConstellation}
      />

      {/* Device Orientation Controller */}
      <DeviceOrientationController
        enabled={compassMode}
        onOrientationChange={setDeviceOrientation}
        onCompassChange={setCompassHeading}
        cameraRef={cameraRef}
      />

      {/* Search Box - Desktop */}
      <div className="hidden md:block">
        <SearchBox onSelectObject={handleSearchSelect} />
      </div>

      {/* Search Box - Mobile (triggered by button) */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div className="pt-4">
            <SearchBox onSelectObject={handleSearchSelect} />
          </div>
          <button 
            className="absolute inset-0 -z-10" 
            onClick={() => setSearchOpen(false)}
          />
        </div>
      )}

      {/* Compass overlay */}
      <CompassOverlay 
        azimuth={deviceOrientation?.alpha || 180}
        deviceHeading={compassHeading}
        compassModeEnabled={compassMode}
      />

      {/* Control panel - Desktop */}
      <div className="hidden md:block">
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
      </div>

      {/* Object info panel */}
      <ObjectInfo
        object={selectedObject}
        onClose={() => {
          setSelectedObject(null);
          setSelectedConstellation(null);
        }}
      />

      {/* Joystick Controller */}
      <JoystickController onMove={handleJoystickMove} />

      {/* Desktop Controls - Bottom Right */}
      <div className="hidden md:flex fixed bottom-20 right-4 z-50 flex-row gap-2 items-end">
        {/* Quick Toggles Row */}
        <div className="glass rounded-xl p-3 flex flex-row gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <Label htmlFor="aurora" className="text-xs text-foreground/80">Aurora</Label>
            <Switch
              id="aurora"
              checked={showNorthernLights}
              onCheckedChange={setShowNorthernLights}
              className="scale-90"
            />
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <Label htmlFor="meteors" className="text-xs text-foreground/80">Meteors</Label>
            <Switch
              id="meteors"
              checked={showShootingStars}
              onCheckedChange={setShowShootingStars}
              className="scale-90"
            />
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-400" />
            <Label htmlFor="lines" className="text-xs text-foreground/80">Lines</Label>
            <Switch
              id="lines"
              checked={showConstellationLines}
              onCheckedChange={setShowConstellationLines}
              className="scale-90"
            />
          </div>
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-orange-400" />
            <Label htmlFor="iss" className="text-xs text-foreground/80">ISS</Label>
            <Switch
              id="iss"
              checked={showISS}
              onCheckedChange={setShowISS}
              className="scale-90"
            />
          </div>
        </div>

        {/* Time-Lapse & VR Controls */}
        <div className="flex flex-col gap-2">
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <Label htmlFor="timelapse" className="text-xs text-foreground/80">Time-Lapse</Label>
            <Switch
              id="timelapse"
              checked={timeLapseEnabled}
              onCheckedChange={setTimeLapseEnabled}
              className="scale-90"
            />
          </div>
          <TimeLapseController
            enabled={timeLapseEnabled}
            onToggle={() => setTimeLapseEnabled(!timeLapseEnabled)}
            onDateChange={setDate}
            baseDate={baseDate}
            isVisible={timeLapseEnabled}
          />
        </div>

        {/* Mode Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setArMode(!arMode)}
            className={`glass rounded-full px-4 py-2 text-sm transition-all ${
              arMode ? 'bg-primary/30 text-primary' : 'text-muted-foreground'
            }`}
          >
            {arMode ? 'AR ON' : 'AR OFF'}
          </button>
          <button
            onClick={() => setVrMode(!vrMode)}
            className={`glass rounded-full px-4 py-2 text-sm transition-all ${
              vrMode ? 'bg-purple-500/30 text-purple-400' : 'text-muted-foreground'
            }`}
          >
            VR Mode
          </button>
        </div>
      </div>

      {/* Mobile Controls Panel */}
      <MobileControlsPanel
        showConstellations={showConstellations}
        onShowConstellationsChange={setShowConstellations}
        showPlanets={showPlanets}
        onShowPlanetsChange={setShowPlanets}
        showDeepSky={showDeepSky}
        onShowDeepSkyChange={setShowDeepSky}
        showMilkyWay={showMilkyWay}
        onShowMilkyWayChange={setShowMilkyWay}
        showNorthernLights={showNorthernLights}
        onShowNorthernLightsChange={setShowNorthernLights}
        showShootingStars={showShootingStars}
        onShowShootingStarsChange={setShowShootingStars}
        showConstellationLines={showConstellationLines}
        onShowConstellationLinesChange={setShowConstellationLines}
        showISS={showISS}
        onShowISSChange={setShowISS}
        expansiveAurora={expansiveAurora}
        onExpansiveAuroraChange={setExpansiveAurora}
        arMode={arMode}
        onArModeChange={setArMode}
        vrMode={vrMode}
        onVrModeChange={setVrMode}
        compassMode={compassMode}
        onCompassModeChange={setCompassMode}
        timeLapseEnabled={timeLapseEnabled}
        onTimeLapseToggle={() => setTimeLapseEnabled(!timeLapseEnabled)}
        onDateChange={setDate}
        baseDate={baseDate}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Instructions hint - Desktop only */}
      <div className="hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
        <div className="glass rounded-full px-6 py-2 text-sm text-muted-foreground">
          Drag to explore • Use joystick to navigate • Search for objects
        </div>
      </div>
    </div>
  );
};

export default Index;
