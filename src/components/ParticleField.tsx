import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  twinkle: number;
  hue: 'green' | 'white';
};

/**
 * Lightweight canvas particle field. Renders glowing green + white motes that
 * drift upward and twinkle. Pauses when the tab is hidden and respects
 * prefers-reduced-motion (renders nothing in that case).
 */
export default function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;

    const COUNT = () => Math.min(70, Math.floor((width * height) / 16000));

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const n = COUNT();
      particles = Array.from({ length: n }, () => createParticle());
    }

    function createParticle(): Particle {
      const isGreen = Math.random() > 0.35;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(0.15 + Math.random() * 0.35),
        size: 1.5 + Math.random() * 3.5,
        baseAlpha: 0.25 + Math.random() * 0.45,
        twinkle: Math.random() * Math.PI * 2,
        hue: isGreen ? 'green' : 'white',
      };
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.02;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        const r = p.size;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        if (p.hue === 'green') {
          grad.addColorStop(0, `rgba(0, 226, 122, ${alpha})`);
          grad.addColorStop(0.5, `rgba(0, 226, 122, ${alpha * 0.3})`);
          grad.addColorStop(1, 'rgba(0, 226, 122, 0)');
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.25})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        raf = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
