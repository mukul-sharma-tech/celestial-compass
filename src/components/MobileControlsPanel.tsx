import { useState } from 'react';
import { ChevronUp, ChevronDown, Settings, Sparkles, Camera, Clock, Search, Eye, EyeOff } from 'lucide-react';
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
  arMode: boolean;
  onArModeChange: (value: boolean) => void;
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
  arMode,
  onArModeChange,
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
        className="fixed bottom-4 right-4 z-50 glass rounded-full h-12 w-12"
        onClick={() => setIsHidden(false)}
      >
        <Eye className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Collapsed bar */}
      <div 
        className={`glass transition-all duration-300 ${
          isExpanded ? 'rounded-t-2xl' : 'rounded-t-2xl'
        }`}
      >
        {/* Quick action buttons - always visible */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={onSearchOpen}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${arMode ? 'text-primary' : ''}`}
              onClick={() => onArModeChange(!arMode)}
            >
              <Camera className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${showNorthernLights ? 'text-green-400' : ''}`}
              onClick={() => onShowNorthernLightsChange(!showNorthernLights)}
            >
              <Sparkles className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${timeLapseEnabled ? 'text-primary' : ''}`}
              onClick={onTimeLapseToggle}
            >
              <Clock className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsHidden(true)}
            >
              <EyeOff className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Expanded controls */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 animate-fade-in">
            {/* Time-lapse controller */}
            <TimeLapseController
              enabled={timeLapseEnabled}
              onToggle={onTimeLapseToggle}
              onDateChange={onDateChange}
              baseDate={baseDate}
              isVisible={isExpanded}
            />
            
            {/* Toggle switches */}
            <div className="grid grid-cols-2 gap-3">
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
    <div className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2">
      <Label htmlFor={id} className="text-xs text-foreground/80">
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="scale-75"
      />
    </div>
  );
}
