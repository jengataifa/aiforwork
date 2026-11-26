import { useEffect, useRef } from 'react';

interface FireworksCelebrationProps {
  active: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
}

const CELEBRATION_COLORS = ['#ffd700', '#22c55e', '#4ade80', '#ffffff', '#f59e0b', '#38bdf8'];

export function FireworksCelebration({
  active,
  onComplete,
  durationMs = 3000,
}: FireworksCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const t = window.setTimeout(() => onCompleteRef.current?.(), Math.min(durationMs, 1200));
      return () => window.clearTimeout(t);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    const spawnBurst = (cx: number, cy: number, count = 64) => {
      const baseColor = CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
        const speed = 2.2 + Math.random() * 6.2;
        const useAlt = Math.random() > 0.35;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.016 + Math.random() * 0.018,
          color: useAlt
            ? CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)]
            : baseColor,
          size: 2.2 + Math.random() * 2.8,
          gravity: 0.068,
        });
      }
    };

    const launchRocket = () => {
      const w = canvas.width;
      const h = canvas.height;
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h + 10,
        targetY: h * (0.14 + Math.random() * 0.34),
        vy: -(10 + Math.random() * 4.5),
        color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      });
    };

    // Immediate opening salute bursts when exam pass happens
    spawnBurst(canvas.width * 0.26, canvas.height * 0.28, 70);
    spawnBurst(canvas.width * 0.74, canvas.height * 0.25, 70);
    spawnBurst(canvas.width * 0.5, canvas.height * 0.2, 85);

    const startTime = performance.now();
    let lastRocketAt = startTime;
    let rafId = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onCompleteRef.current?.();
    };

    const hardStopTimer = window.setTimeout(finish, durationMs);

    const frame = (now: number) => {
      if (finished) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed >= durationMs) {
        finish();
        return;
      }

      const fadeWindowMs = 350;
      const globalFade =
        elapsed > durationMs - fadeWindowMs
          ? Math.max(0, (durationMs - elapsed) / fadeWindowMs)
          : 1;

      if (elapsed < durationMs - 1100 && now - lastRocketAt > 340) {
        launchRocket();
        lastRocketAt = now;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;

        ctx.save();
        ctx.globalAlpha = globalFade;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY || r.vy > -1.8) {
          spawnBurst(r.x, r.y, 64);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 + p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha * globalFade);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      finished = true;
      window.clearTimeout(hardStopTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] pointer-events-none w-full h-full"
    />
  );
}
