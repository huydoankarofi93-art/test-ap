import React, { useEffect, useRef } from 'react';

interface BackgroundParticlesProps {
  lowPerf?: boolean;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ lowPerf = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || lowPerf) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const isMobile = window.innerWidth < 768;
      const density = isMobile ? 30000 : 15000;
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / density);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isMobile = window.innerWidth < 768;
      
      // Draw subtle light beams - only on desktop for performance
      if (!isMobile) {
        const time = Date.now() * 0.0005;
        const beamCount = 3;
        for (let i = 0; i < beamCount; i++) {
          const x = canvas.width * (0.2 + i * 0.3 + Math.sin(time + i) * 0.1);
          const gradient = ctx.createLinearGradient(x, 0, x + 100, canvas.height);
          gradient.addColorStop(0, 'rgba(212, 175, 55, 0)');
          gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.03)');
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(x - 100, 0);
          ctx.lineTo(x + 100, 0);
          ctx.lineTo(x + 300, canvas.height);
          ctx.lineTo(x - 100, canvas.height);
          ctx.fill();
        }
      }

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      resize();
      init();
    });

    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};

export default BackgroundParticles;
