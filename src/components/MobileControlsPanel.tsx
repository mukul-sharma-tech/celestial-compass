import { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles, Camera, Clock, Search, Eye, EyeOff, Glasses, Navigation, Satellite } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TimeLapseController } from './TimeLapseController';

interface MobileControlsPanelProps {
  showConstellations: boolean;
  onShowConstellationsChange: (value: boolean) => void;
  showPlanets: boolean;
  onShowPlanetsChange: (value: boolean) => void;
  showDeepSky: boolean;
  onShowDeepSkyChange: (value: boolean) => void;
  showMilkyWay: boolean;
  onShowMilkyWayChange: (value: boolean) => void;
  showNorthernLights: boolean;
  onShowNorthernLightsChange: (value: boolean) => void;
  showShootingStars: boolean;
  onShowShootingStarsChange: (value: boolean) => void;
  showConstellationLines: boolean;
  onShowConstellationLinesChange: (value: boolean) => void;
  showISS: boolean;
  onShowISSChange: (value: boolean) => void;
  arMode: boolean;
  onArModeChange: (value: boolean) => void;
  vrMode: boolean;
  onVrModeChange: (value: boolean) => void;
  compassMode: boolean;
  onCompassModeChange: (value: boolean) => void;
  timeLapseEnabled: boolean;
  onTimeLapseToggle: () => void;
  onDateChange: (date: Date) => void;
  baseDate: Date;
  onSearchOpen: () => void;
}

export function MobileControlsPanel({
  showConstellations,
  onShowConstellationsChange,
  showPlanets,
  onShowPlanetsChange,
  showDeepSky,
  onShowDeepSkyChange,
  showMilkyWay,
  onShowMilkyWayChange,
  showNorthernLights,
  onShowNorthernLightsChange,
  showShootingStars,
  onShowShootingStarsChange,
  showConstellationLines,
  onShowConstellationLinesChange,
  showISS,
  onShowISSChange,
  arMode,
  onArModeChange,
  vrMode,
  onVrModeChange,
  compassMode,
  onCompassModeChange,
  timeLapseEnabled,
  onTimeLapseToggle,
  onDateChange,
  baseDate,
  onSearchOpen,
}: MobileControlsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 glass rounded-full h-12 w-12 md:hidden"
        onClick={() => setIsHidden(false)}
      >
        <Eye className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
      {/* Collapsed bar */}
      <div 
        className={`glass transition-all duration-300 rounded-t-2xl`}
      >
        {/* Quick action buttons - always visible */}
        <div className="flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
              onClick={onSearchOpen}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ${arMode ? 'text-primary bg-primary/20' : ''}`}
              onClick={() => onArModeChange(!arMode)}
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ${vrMode ? 'text-purple-400 bg-purple-500/20' : ''}`}
              onClick={() => onVrModeChange(!vrMode)}
            >
              <Glasses className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ${compassMode ? 'text-blue-400 bg-blue-500/20' : ''}`}
              onClick={() => onCompassModeChange(!compassMode)}
            >
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ${showISS ? 'text-yellow-400 bg-yellow-500/20' : ''}`}
              onClick={() => onShowISSChange(!showISS)}
            >
              <Satellite className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ${showNorthernLights ? 'text-green-400 bg-green-500/20' : ''}`}
              onClick={() => onShowNorthernLightsChange(!showNorthernLights)}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 ${timeLapseEnabled ? 'text-primary bg-primary/20' : ''}`}
              onClick={onTimeLapseToggle}
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsHidden(true)}
            >
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Expanded controls */}
        {isExpanded && (
          <div className="px-3 pb-4 space-y-3 animate-fade-in max-h-[50vh] overflow-y-auto">
            {/* Time-lapse controller */}
            <TimeLapseController
              enabled={timeLapseEnabled}
              onToggle={onTimeLapseToggle}
              onDateChange={onDateChange}
              baseDate={baseDate}
              isVisible={isExpanded}
            />
            
            {/* Toggle switches */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <ToggleItem
                id="constellations-m"
                label="Constellations"
                checked={showConstellations}
                onChange={onShowConstellationsChange}
              />
              <ToggleItem
                id="lines-m"
                label="Const. Lines"
                checked={showConstellationLines}
                onChange={onShowConstellationLinesChange}
              />
              <ToggleItem
                id="planets-m"
                label="Planets"
                checked={showPlanets}
                onChange={onShowPlanetsChange}
              />
              <ToggleItem
                id="deepsky-m"
                label="Deep Sky"
                checked={showDeepSky}
                onChange={onShowDeepSkyChange}
              />
              <ToggleItem
                id="milkyway-m"
                label="Milky Way"
                checked={showMilkyWay}
                onChange={onShowMilkyWayChange}
              />
              <ToggleItem
                id="meteors-m"
                label="Meteors"
                checked={showShootingStars}
                onChange={onShowShootingStarsChange}
              />
              <ToggleItem
                id="iss-m"
                label="ISS Track"
                checked={showISS}
                onChange={onShowISSChange}
              />
              <ToggleItem
                id="compass-m"
                label="Compass"
                checked={compassMode}
                onChange={onCompassModeChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleItem({ 
  id, 
  label, 
  checked, 
  onChange 
}: { 
  id: string; 
  label: string; 
  checked: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-secondary/30 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
      <Label htmlFor={id} className="text-[10px] sm:text-xs text-foreground/80 truncate">
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="scale-[0.65] sm:scale-75"
      />
    </div>
  );
}
