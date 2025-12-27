import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TimeLapseControllerProps {
  enabled: boolean;
  onToggle: () => void;
  onDateChange: (date: Date) => void;
  baseDate: Date;
  isVisible: boolean;
}

export function TimeLapseController({ 
  enabled, 
  onToggle, 
  onDateChange, 
  baseDate,
  isVisible 
}: TimeLapseControllerProps) {
  const [speed, setSpeed] = useState(60); // Minutes per second
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const resetTimeLapse = useCallback(() => {
    setElapsedMinutes(0);
    setIsPlaying(false);
    onDateChange(baseDate);
  }, [baseDate, onDateChange]);
  
  useEffect(() => {
    if (!enabled || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = timestamp;
      
      setElapsedMinutes(prev => {
        const newMinutes = prev + deltaTime * speed;
        const newDate = new Date(baseDate.getTime() + newMinutes * 60 * 1000);
        onDateChange(newDate);
        return newMinutes;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, isPlaying, speed, baseDate, onDateChange]);
  
  useEffect(() => {
    if (!enabled) {
      resetTimeLapse();
    }
  }, [enabled, resetTimeLapse]);
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  if (!enabled || !isVisible) return null;
  
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Time-Lapse</span>
        </div>
        <span className="text-xs text-muted-foreground">
          +{formatTime(elapsedMinutes)}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setIsPlaying(!isPlaying);
            lastTimeRef.current = 0;
          }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={resetTimeLapse}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <div className="flex-1">
          <Slider
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
            min={10}
            max={360}
            step={10}
            className="w-full"
          />
        </div>
        
        <span className="text-xs text-muted-foreground w-16 text-right">
          {speed}x
        </span>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        {speed < 60 ? `${speed} min/sec` : `${(speed / 60).toFixed(1)} hr/sec`}
      </p>
    </div>
  );
}
