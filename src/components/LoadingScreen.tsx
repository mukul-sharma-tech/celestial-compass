import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const steps = [
      { progress: 20, status: 'Loading star catalog...' },
      { progress: 40, status: 'Calculating positions...' },
      { progress: 60, status: 'Mapping constellations...' },
      { progress: 80, status: 'Rendering Milky Way...' },
      { progress: 100, status: 'Ready' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-[0.3em] text-foreground text-glow">
            CELESTIA
          </h1>
          <p className="text-center text-muted-foreground mt-2 tracking-widest text-sm">
            NIGHT SKY EXPLORER
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {status}
        </p>
      </div>
    </div>
  );
};
