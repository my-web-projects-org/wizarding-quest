import React, { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  life: number;
  age: number;
  reset: () => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

interface MagicalFirefliesLoaderProps {
  className?: string;
  style?: React.CSSProperties;
}

const MagicalFirefliesLoader: React.FC<MagicalFirefliesLoaderProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Firefly[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const MAX = 150;
    const colors = ['#ffeaa7', '#ffd573', '#fff7c2'];

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    class FireflyClass implements Firefly {
      x!: number;
      y!: number;
      size!: number;
      speedX!: number;
      speedY!: number;
      color!: string;
      opacity!: number;
      life!: number;
      age!: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = 1 + Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 0;
        this.life = Math.random() * 200 + 100;
        this.age = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.age++;
        this.opacity = Math.sin((this.age / this.life) * Math.PI);
        if (this.age >= this.life || this.y > (canvas?.height || window.innerHeight)) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 4;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    const init = () => {
      resize();
      particlesRef.current = [];
      for (let i = 0; i < MAX; i++) {
        particlesRef.current.push(new FireflyClass());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      animationRef.current = window.requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        pointerEvents: 'none',
        ...style
      }}
    />
  );
};

export default MagicalFirefliesLoader; 