import { Compass as CompassIcon } from 'lucide-react';

interface CompassOverlayProps {
  azimuth: number;
}

export const CompassOverlay = ({ azimuth }: CompassOverlayProps) => {
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

  // Find the closest cardinal direction
  const normalizedAz = ((azimuth % 360) + 360) % 360;
  const closestDir = directions.reduce((prev, curr) => {
    const prevDiff = Math.abs(((prev.deg - normalizedAz + 180) % 360) - 180);
    const currDiff = Math.abs(((curr.deg - normalizedAz + 180) % 360) - 180);
    return currDiff < prevDiff ? curr : prev;
  });

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <div className="glass rounded-xl p-4 flex flex-col items-center">
        <div className="relative w-20 h-20">
          {/* Compass ring */}
          <div className="absolute inset-0 rounded-full border border-glass-border" />
          
          {/* Direction markers */}
          {directions.map(({ deg, label, primary }) => {
            const angle = ((deg - normalizedAz) * Math.PI) / 180;
            const radius = 32;
            const x = 40 + radius * Math.sin(angle);
            const y = 40 - radius * Math.cos(angle);
            
            return (
              <span
                key={deg}
                className={`absolute text-xs transform -translate-x-1/2 -translate-y-1/2 ${
                  primary ? 'text-foreground font-medium' : 'text-muted-foreground'
                } ${deg === 0 ? 'text-primary' : ''}`}
                style={{ left: x, top: y }}
              >
                {label}
              </span>
            );
          })}
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CompassIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {/* Pointer */}
          <div 
            className="absolute left-1/2 top-1/2 w-0.5 h-6 bg-primary origin-bottom transform -translate-x-1/2 -translate-y-full"
            style={{ transform: 'translateX(-50%) translateY(-50%) rotate(0deg)' }}
          />
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          {Math.round(normalizedAz)}° {closestDir.label}
        </div>
      </div>
    </div>
  );
};
