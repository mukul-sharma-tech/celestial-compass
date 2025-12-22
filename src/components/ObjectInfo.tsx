import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStarColor } from '@/lib/astronomy';

interface ObjectInfoProps {
  object: {
    type: string;
    name: string;
    data: any;
  } | null;
  onClose: () => void;
}

export const ObjectInfo = ({ object, onClose }: ObjectInfoProps) => {
  if (!object) return null;

  const getSpectralTypeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'O': 'Blue supergiant - Extremely hot and luminous',
      'B': 'Blue-white star - Hot and bright',
      'A': 'White star - Medium-hot with strong hydrogen lines',
      'F': 'Yellow-white star - Slightly hotter than the Sun',
      'G': 'Yellow star - Similar to our Sun',
      'K': 'Orange star - Cooler than the Sun',
      'M': 'Red dwarf or giant - Cool, reddish stars',
    };
    return descriptions[type] || 'Unknown spectral type';
  };

  const getMagnitudeDescription = (mag: number) => {
    if (mag < 0) return 'Exceptionally bright';
    if (mag < 1) return 'Very bright, easily visible';
    if (mag < 2) return 'Bright star';
    if (mag < 3) return 'Moderately bright';
    if (mag < 4) return 'Visible in suburban skies';
    if (mag < 5) return 'Visible in rural skies';
    return 'Faint, requires dark skies';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="glass rounded-xl p-5 min-w-[280px] max-w-[320px]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full star-glow"
              style={{ backgroundColor: getStarColor(object.data.spectralType) }}
            />
            <h3 className="text-lg font-medium">{object.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 -mr-2 -mt-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          {object.type === 'star' && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">
                  Class {object.data.spectralType} Star
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {getSpectralTypeDescription(object.data.spectralType)}
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Magnitude</span>
                <span className="text-foreground">
                  {object.data.magnitude.toFixed(2)}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {getMagnitudeDescription(object.data.magnitude)}
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Right Ascension</span>
                <span className="text-foreground">
                  {object.data.ra.toFixed(2)}h
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Declination</span>
                <span className="text-foreground">
                  {object.data.dec.toFixed(2)}°
                </span>
              </div>

              {object.data.constellation && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Constellation</span>
                  <span className="text-foreground">
                    {object.data.constellation}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
