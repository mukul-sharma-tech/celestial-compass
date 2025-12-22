import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Settings, Eye, Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ControlPanelProps {
  date: Date;
  onDateChange: (date: Date) => void;
  location: { latitude: number; longitude: number };
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
  showConstellations: boolean;
  onShowConstellationsChange: (show: boolean) => void;
  showPlanets: boolean;
  onShowPlanetsChange: (show: boolean) => void;
  showDeepSky: boolean;
  onShowDeepSkyChange: (show: boolean) => void;
  showMilkyWay: boolean;
  onShowMilkyWayChange: (show: boolean) => void;
}

export const ControlPanel = ({
  date,
  onDateChange,
  location,
  onLocationChange,
  showConstellations,
  onShowConstellationsChange,
  showPlanets,
  onShowPlanetsChange,
  showDeepSky,
  onShowDeepSkyChange,
  showMilkyWay,
  onShowMilkyWayChange,
}: ControlPanelProps) => {
  const [timeSpeed, setTimeSpeed] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  // Time animation
  useEffect(() => {
    if (timeSpeed === 0) return;

    const interval = setInterval(() => {
      onDateChange(new Date(date.getTime() + timeSpeed * 60000));
    }, 50);

    return () => clearInterval(interval);
  }, [timeSpeed, date, onDateChange]);

  const requestLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationChange({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    }
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const setToNow = () => {
    onDateChange(new Date());
    setTimeSpeed(0);
  };

  const adjustHours = (hours: number) => {
    onDateChange(new Date(date.getTime() + hours * 3600000));
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-3 animate-fade-in">
      {/* Time Display */}
      <div className="glass rounded-xl p-4 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">Time</span>
        </div>
        
        <div className="text-2xl font-light tracking-wider mb-1">
          {formatTime(date)}
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {formatDate(date)}
        </div>

        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustHours(-1)}
            className="flex-1 text-xs"
          >
            -1h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={setToNow}
            className="flex-1 text-xs"
          >
            Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustHours(1)}
            className="flex-1 text-xs"
          >
            +1h
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Time Speed</Label>
          <Slider
            value={[timeSpeed]}
            min={-60}
            max={60}
            step={1}
            onValueChange={([v]) => setTimeSpeed(v)}
            className="w-full"
          />
          <div className="text-xs text-center text-muted-foreground">
            {timeSpeed === 0 ? 'Paused' : `${timeSpeed > 0 ? '+' : ''}${timeSpeed} min/s`}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Location</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={requestLocation}
            disabled={isLocating}
            className="h-7 px-2"
          >
            {isLocating ? '...' : 'Detect'}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {location.latitude.toFixed(2)}° {location.latitude >= 0 ? 'N' : 'S'}, {' '}
          {Math.abs(location.longitude).toFixed(2)}° {location.longitude >= 0 ? 'E' : 'W'}
        </div>
      </div>

      {/* View Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="glass border-glass-border justify-start">
            <Eye className="w-4 h-4 mr-2 text-primary" />
            View Options
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 glass border-glass-border" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="constellations" className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-constellation-line" />
                Constellations
              </Label>
              <Switch
                id="constellations"
                checked={showConstellations}
                onCheckedChange={onShowConstellationsChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="planets" className="text-sm flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-planet-jupiter" />
                Planets
              </Label>
              <Switch
                id="planets"
                checked={showPlanets}
                onCheckedChange={onShowPlanetsChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="deepsky" className="text-sm flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-milky-core to-milky-dust opacity-70" />
                Deep Sky Objects
              </Label>
              <Switch
                id="deepsky"
                checked={showDeepSky}
                onCheckedChange={onShowDeepSkyChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="milkyway" className="text-sm flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-milky-glow to-milky-core opacity-50" />
                Milky Way
              </Label>
              <Switch
                id="milkyway"
                checked={showMilkyWay}
                onCheckedChange={onShowMilkyWayChange}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
