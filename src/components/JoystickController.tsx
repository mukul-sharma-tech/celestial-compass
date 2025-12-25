import { useRef, useState, useCallback, useEffect } from 'react';
import { Move } from 'lucide-react';

interface JoystickControllerProps {
  onMove: (dx: number, dy: number) => void;
}

export function JoystickController({ onMove }: JoystickControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const maxDistance = 40;

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = Math.max(-maxDistance, Math.min(maxDistance, clientX - centerX));
    const y = Math.max(-maxDistance, Math.min(maxDistance, clientY - centerY));
    
    setPosition({ x, y });
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = clientX - centerX;
    let y = clientY - centerY;

    // Constrain to circle
    const distance = Math.sqrt(x * x + y * y);
    if (distance > maxDistance) {
      x = (x / distance) * maxDistance;
      y = (y / distance) * maxDistance;
    }

    setPosition({ x, y });
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Animation loop for smooth camera movement
  useEffect(() => {
    const animate = () => {
      if (position.x !== 0 || position.y !== 0) {
        // Normalize and scale movement
        const dx = position.x / maxDistance;
        const dy = position.y / maxDistance;
        onMove(dx * 0.02, dy * 0.02);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position, onMove]);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onMouseUp = () => handleEnd();
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 right-4 z-50 w-24 h-24 rounded-full glass border-2 border-glass-border/50 flex items-center justify-center touch-none select-none"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Background circles */}
      <div className="absolute w-20 h-20 rounded-full border border-muted-foreground/20" />
      <div className="absolute w-12 h-12 rounded-full border border-muted-foreground/10" />
      
      {/* Direction indicators */}
      <div className="absolute top-2 text-xs text-muted-foreground/50">N</div>
      <div className="absolute bottom-2 text-xs text-muted-foreground/50">S</div>
      <div className="absolute left-2 text-xs text-muted-foreground/50">W</div>
      <div className="absolute right-2 text-xs text-muted-foreground/50">E</div>

      {/* Joystick knob */}
      <div
        className={`w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center shadow-lg transition-transform ${isDragging ? 'scale-110' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${isDragging ? 1.1 : 1})`,
        }}
      >
        <Move className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
  );
}