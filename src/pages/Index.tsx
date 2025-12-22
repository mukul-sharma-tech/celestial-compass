import { useState, useCallback } from 'react';
import { SkyCanvas } from '@/components/SkyCanvas';
import { ControlPanel } from '@/components/ControlPanel';
import { ObjectInfo } from '@/components/ObjectInfo';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState({
    latitude: 40.7128, // Default to NYC
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

  const handleObjectSelect = useCallback((obj: { type: string; name: string; data: any } | null) => {
    setSelectedObject(obj);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Sky canvas */}
      <SkyCanvas
        location={location}
        date={date}
        showConstellations={showConstellations}
        showPlanets={showPlanets}
        showDeepSky={showDeepSky}
        showMilkyWay={showMilkyWay}
        onObjectSelect={handleObjectSelect}
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

      {/* Instructions hint */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
        <div className="glass rounded-full px-6 py-2 text-sm text-muted-foreground">
          Drag to pan • Scroll to zoom • Click stars for info
        </div>
      </div>
    </div>
  );
};

export default Index;
