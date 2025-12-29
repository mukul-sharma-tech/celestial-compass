import { Compass as CompassIcon, Navigation } from 'lucide-react';

interface CompassOverlayProps {
  azimuth: number;
  deviceHeading?: number;
  compassModeEnabled?: boolean;
}

export const CompassOverlay = ({ 
  azimuth, 
  deviceHeading,
  compassModeEnabled = false 
}: CompassOverlayProps) => {
  const directions = [
    { deg: 0, label: 'N', primary: true },
    { deg: 45, label: 'NE', primary: false },
    { deg: 90, label: 'E', primary: true },
    { deg: 135, label: 'SE', primary: false },
    { deg: 180, label: 'S', primary: true },
    { deg: 225, label: 'SW', primary: false },
    { deg: 270, label: 'W', primary: true },
    { deg: 315, label: 'NW', primary: false },
  ];

  // Use device heading if compass mode is enabled, otherwise use provided azimuth
  const heading = compassModeEnabled && deviceHeading !== undefined ? deviceHeading : azimuth;
  const normalizedAz = ((heading % 360) + 360) % 360;
  
  const closestDir = directions.reduce((prev, curr) => {
    const prevDiff = Math.abs(((prev.deg - normalizedAz + 180) % 360) - 180);
    const currDiff = Math.abs(((curr.deg - normalizedAz + 180) % 360) - 180);
    return currDiff < prevDiff ? curr : prev;
  });

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-2 sm:left-4 z-40 animate-fade-in">
      <div className="glass rounded-xl p-2 sm:p-4 flex flex-col items-center">
        <div className="relative w-14 h-14 sm:w-20 sm:h-20">
          {/* Compass ring */}
          <div className="absolute inset-0 rounded-full border border-glass-border" />
          
          {/* Animated ring when compass mode active */}
          {compassModeEnabled && (
            <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse" />
          )}
          
          {/* Direction markers */}
          {directions.map(({ deg, label, primary }) => {
            const angle = ((deg - normalizedAz) * Math.PI) / 180;
            const radius = window.innerWidth < 640 ? 22 : 32;
            const center = window.innerWidth < 640 ? 28 : 40;
            const x = center + radius * Math.sin(angle);
            const y = center - radius * Math.cos(angle);
            
            return (
              <span
                key={deg}
                className={`absolute text-[10px] sm:text-xs transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
                  primary ? 'text-foreground font-medium' : 'text-muted-foreground'
                } ${deg === 0 ? 'text-primary font-bold' : ''}`}
                style={{ left: x, top: y }}
              >
                {label}
              </span>
            );
          })}
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {compassModeEnabled ? (
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
            ) : (
              <CompassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            )}
          </div>
          
          {/* Pointer */}
          <div 
            className="absolute left-1/2 top-1/2 w-0.5 h-4 sm:h-6 bg-primary origin-bottom transform -translate-x-1/2 -translate-y-full"
            style={{ transform: 'translateX(-50%) translateY(-50%) rotate(0deg)' }}
          />
        </div>
        
        <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
          <span className="font-medium text-foreground">{Math.round(normalizedAz)}°</span>
          <span>{closestDir.label}</span>
          {compassModeEnabled && (
            <span className="text-[8px] sm:text-[10px] text-primary ml-1">LIVE</span>
          )}
        </div>
      </div>
    </div>
  );
};
