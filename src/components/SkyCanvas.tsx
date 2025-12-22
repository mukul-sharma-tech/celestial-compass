import { useEffect, useRef, useState, useCallback } from 'react';
import {
  getLocalSiderealTime,
  equatorialToHorizontal,
  horizontalToScreen,
  getStarColor,
  getStarSize,
  getStarOpacity,
  getSunPosition,
  getMoonPosition,
  getPlanetPositions,
  Star,
  Planet,
} from '@/lib/astronomy';
import { allStars, constellations, deepSkyObjects, brightStars } from '@/data/starCatalog';

interface SkyCanvasProps {
  location: { latitude: number; longitude: number };
  date: Date;
  showConstellations: boolean;
  showPlanets: boolean;
  showDeepSky: boolean;
  showMilkyWay: boolean;
  onObjectSelect: (object: { type: string; name: string; data: any } | null) => void;
}

export const SkyCanvas = ({
  location,
  date,
  showConstellations,
  showPlanets,
  showDeepSky,
  showMilkyWay,
  onObjectSelect,
}: SkyCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewAz, setViewAz] = useState(180); // Looking south by default
  const [viewAlt, setViewAlt] = useState(45);
  const [fov, setFov] = useState(90);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Star twinkle offsets for animation
  const twinkleOffsetsRef = useRef<Map<string, { phase: number; speed: number }>>(new Map());

  // Initialize twinkle data
  useEffect(() => {
    allStars.forEach(star => {
      twinkleOffsetsRef.current.set(star.id, {
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    });
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const lst = getLocalSiderealTime(date, location.longitude);
    const time = Date.now() / 1000;

    // Clear canvas with deep space gradient
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    gradient.addColorStop(0, 'hsl(220, 50%, 4%)');
    gradient.addColorStop(0.5, 'hsl(220, 50%, 2%)');
    gradient.addColorStop(1, 'hsl(220, 50%, 1%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Milky Way band if enabled
    if (showMilkyWay) {
      drawMilkyWay(ctx, width, height, lst);
    }

    // Calculate screen positions for all visible stars
    const starPositions: Map<string, { x: number; y: number; star: Star }> = new Map();

    allStars.forEach(star => {
      const { altitude, azimuth } = equatorialToHorizontal(
        star.ra, star.dec, location.latitude, lst
      );

      if (altitude < -5) return; // Below horizon

      const { x, y, visible } = horizontalToScreen(
        altitude, azimuth, viewAz, viewAlt, fov, width, height
      );

      if (!visible) return;

      starPositions.set(star.id, { x, y, star });

      // Draw star
      const twinkle = twinkleOffsetsRef.current.get(star.id);
      const twinkleValue = twinkle
        ? 0.7 + 0.3 * Math.sin(time * twinkle.speed + twinkle.phase)
        : 1;

      const size = getStarSize(star.magnitude) * (90 / fov);
      const opacity = getStarOpacity(star.magnitude) * twinkleValue;
      const color = getStarColor(star.spectralType);

      // Glow effect for bright stars
      if (star.magnitude < 2) {
        const glowSize = size * 4;
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glowGradient.addColorStop(0, color.replace(')', `, ${opacity * 0.5})`).replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star point
      ctx.fillStyle = color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw constellation lines if enabled
    if (showConstellations) {
      ctx.strokeStyle = 'hsla(200, 60%, 50%, 0.25)';
      ctx.lineWidth = 1;

      constellations.forEach(constellation => {
        constellation.lines.forEach(([star1Id, star2Id]) => {
          const pos1 = starPositions.get(star1Id);
          const pos2 = starPositions.get(star2Id);

          if (pos1 && pos2) {
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.stroke();
          }
        });
      });

      // Draw constellation labels
      ctx.font = '12px Outfit';
      ctx.fillStyle = 'hsla(200, 40%, 70%, 0.6)';
      ctx.textAlign = 'center';

      constellations.forEach(constellation => {
        const visibleStars = constellation.stars
          .map(id => starPositions.get(id))
          .filter(Boolean) as Array<{ x: number; y: number; star: Star }>;

        if (visibleStars.length > 0) {
          const centerX = visibleStars.reduce((sum, p) => sum + p.x, 0) / visibleStars.length;
          const centerY = visibleStars.reduce((sum, p) => sum + p.y, 0) / visibleStars.length;
          ctx.fillText(constellation.name, centerX, centerY - 20);
        }
      });
    }

    // Draw deep sky objects if enabled
    if (showDeepSky) {
      deepSkyObjects.forEach(dso => {
        const { altitude, azimuth } = equatorialToHorizontal(
          dso.ra, dso.dec, location.latitude, lst
        );

        if (altitude < 0) return;

        const { x, y, visible } = horizontalToScreen(
          altitude, azimuth, viewAz, viewAlt, fov, width, height
        );

        if (!visible) return;

        const size = Math.max(4, (dso.size / 60) * (90 / fov) * 2);

        // Draw fuzzy ellipse for galaxies/nebulae
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        
        if (dso.type === 'galaxy') {
          gradient.addColorStop(0, 'hsla(45, 20%, 80%, 0.3)');
          gradient.addColorStop(0.5, 'hsla(45, 20%, 60%, 0.15)');
          gradient.addColorStop(1, 'transparent');
        } else if (dso.type === 'nebula') {
          gradient.addColorStop(0, 'hsla(340, 50%, 60%, 0.3)');
          gradient.addColorStop(0.5, 'hsla(280, 40%, 50%, 0.15)');
          gradient.addColorStop(1, 'transparent');
        } else if (dso.type === 'cluster') {
          gradient.addColorStop(0, 'hsla(200, 30%, 90%, 0.4)');
          gradient.addColorStop(0.5, 'hsla(200, 30%, 80%, 0.2)');
          gradient.addColorStop(1, 'transparent');
        } else {
          gradient.addColorStop(0, 'hsla(180, 60%, 70%, 0.4)');
          gradient.addColorStop(0.5, 'hsla(180, 60%, 50%, 0.2)');
          gradient.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw planets if enabled
    if (showPlanets) {
      const planets = getPlanetPositions(date);

      planets.forEach(planet => {
        const { altitude, azimuth } = equatorialToHorizontal(
          planet.ra, planet.dec, location.latitude, lst
        );

        if (altitude < 0) return;

        const { x, y, visible } = horizontalToScreen(
          altitude, azimuth, viewAz, viewAlt, fov, width, height
        );

        if (!visible) return;

        const size = planet.size * (90 / fov);

        // Glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
        glowGradient.addColorStop(0, planet.color + '80');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '11px Outfit';
        ctx.fillStyle = 'hsla(0, 0%, 80%, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y + size + 15);
      });

      // Draw Moon
      const moon = getMoonPosition(date);
      const moonHoriz = equatorialToHorizontal(
        moon.rightAscension, moon.declination, location.latitude, lst
      );

      if (moonHoriz.altitude > 0) {
        const { x, y, visible } = horizontalToScreen(
          moonHoriz.altitude, moonHoriz.azimuth, viewAz, viewAlt, fov, width, height
        );

        if (visible) {
          const moonSize = 12 * (90 / fov);

          // Moon glow
          const moonGlow = ctx.createRadialGradient(x, y, 0, x, y, moonSize * 4);
          moonGlow.addColorStop(0, 'hsla(45, 10%, 90%, 0.3)');
          moonGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = moonGlow;
          ctx.beginPath();
          ctx.arc(x, y, moonSize * 4, 0, Math.PI * 2);
          ctx.fill();

          // Moon body
          ctx.fillStyle = 'hsl(45, 10%, 90%)';
          ctx.beginPath();
          ctx.arc(x, y, moonSize, 0, Math.PI * 2);
          ctx.fill();

          // Moon phase shadow
          if (moon.phase < 0.95) {
            ctx.fillStyle = 'hsla(220, 50%, 5%, 0.8)';
            ctx.beginPath();
            const phaseOffset = (1 - moon.phase) * moonSize * 2;
            ctx.arc(x + phaseOffset - moonSize, y, moonSize, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.font = '11px Outfit';
          ctx.fillStyle = 'hsla(0, 0%, 80%, 0.8)';
          ctx.textAlign = 'center';
          ctx.fillText('Moon', x, y + moonSize + 15);
        }
      }

      // Draw Sun (if above horizon, sky should be bright, but we'll show position)
      const sun = getSunPosition(date);
      const sunHoriz = equatorialToHorizontal(
        sun.rightAscension, sun.declination, location.latitude, lst
      );

      if (sunHoriz.altitude > -18 && sunHoriz.altitude < 0) {
        // Twilight glow on horizon
        const { x, y } = horizontalToScreen(
          0, sunHoriz.azimuth, viewAz, viewAlt, fov, width, height
        );

        const twilightGradient = ctx.createRadialGradient(x, height, 0, x, height, height / 2);
        const intensity = (sunHoriz.altitude + 18) / 18;
        twilightGradient.addColorStop(0, `hsla(30, 80%, 50%, ${intensity * 0.3})`);
        twilightGradient.addColorStop(0.3, `hsla(280, 40%, 40%, ${intensity * 0.15})`);
        twilightGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = twilightGradient;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Draw horizon line
    const horizonY = height / 2 + viewAlt * (Math.min(width, height) / fov);
    if (horizonY > 0 && horizonY < height) {
      ctx.strokeStyle = 'hsla(200, 30%, 30%, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw cardinal directions
    const directions = [
      { az: 0, label: 'N' },
      { az: 90, label: 'E' },
      { az: 180, label: 'S' },
      { az: 270, label: 'W' },
    ];

    ctx.font = '14px Outfit';
    ctx.fillStyle = 'hsla(200, 60%, 70%, 0.7)';
    ctx.textAlign = 'center';

    directions.forEach(({ az, label }) => {
      const { x, y, visible } = horizontalToScreen(
        0, az, viewAz, viewAlt, fov, width, height
      );
      if (visible && y > 0 && y < height) {
        ctx.fillText(label, x, Math.min(y + 5, height - 20));
      }
    });

    animationRef.current = requestAnimationFrame(render);
  }, [location, date, viewAz, viewAlt, fov, showConstellations, showPlanets, showDeepSky, showMilkyWay]);

  const drawMilkyWay = (ctx: CanvasRenderingContext2D, width: number, height: number, lst: number) => {
    // Milky Way approximate path (galactic equator)
    const milkyWayPoints: Array<{ ra: number; dec: number }> = [];
    
    // Generate points along the galactic plane
    for (let l = 0; l < 360; l += 5) {
      // Convert galactic coordinates to equatorial (simplified)
      const lRad = (l * Math.PI) / 180;
      const bRad = 0; // On the galactic plane
      
      // Galactic north pole: RA = 12.85h, Dec = 27.13°
      // Galactic center: RA = 17.76h, Dec = -29°
      const ra = (17.76 + (l / 360) * 24) % 24;
      const dec = -29 + 60 * Math.sin(lRad * 2); // Approximate wave
      
      milkyWayPoints.push({ ra, dec });
    }

    // Draw milky way as a gradient band
    ctx.globalCompositeOperation = 'lighter';
    
    milkyWayPoints.forEach((point, i) => {
      const { altitude, azimuth } = equatorialToHorizontal(
        point.ra, point.dec, location.latitude, lst
      );

      if (altitude < -10) return;

      const { x, y, visible } = horizontalToScreen(
        altitude, azimuth, viewAz, viewAlt, fov, width, height
      );

      if (!visible) return;

      // Create fuzzy glow
      const size = 80 + Math.sin(i * 0.3) * 30;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      
      // Vary colors along the milky way
      const hue = 25 + Math.sin(i * 0.1) * 20;
      const saturation = 30 + Math.sin(i * 0.2) * 20;
      
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 70%, 0.08)`);
      gradient.addColorStop(0.5, `hsla(${hue + 20}, ${saturation - 10}%, 60%, 0.04)`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start render loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(render);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);

  // Mouse/touch handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    const sensitivity = fov / 500;
    setViewAz(prev => (prev - deltaX * sensitivity + 360) % 360);
    setViewAlt(prev => Math.max(-90, Math.min(90, prev + deltaY * sensitivity)));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Zoom with scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    setFov(prev => Math.max(20, Math.min(120, prev * zoomFactor)));
  };

  // Click to select objects
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lst = getLocalSiderealTime(date, location.longitude);

    // Check for star clicks
    let closestStar: Star | null = null;
    let closestDist = Infinity;

    brightStars.forEach(star => {
      const { altitude, azimuth } = equatorialToHorizontal(
        star.ra, star.dec, location.latitude, lst
      );

      if (altitude < 0) return;

      const pos = horizontalToScreen(
        altitude, azimuth, viewAz, viewAlt, fov, canvas.width, canvas.height
      );

      if (!pos.visible) return;

      const dist = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      if (dist < 20 && dist < closestDist) {
        closestDist = dist;
        closestStar = star;
      }
    });

    if (closestStar) {
      onObjectSelect({
        type: 'star',
        name: closestStar.name || closestStar.id,
        data: closestStar,
      });
    } else {
      onObjectSelect(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="sky-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onClick={handleClick}
    />
  );
};
