import { useRef, useEffect } from 'react';

const CanvasStarfield = ({ starCount = 200, className = "" }) => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  
  // Initialize star data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
    
    // Initialize stars with random positions and properties
    const initStars = () => {
      starsRef.current = Array(starCount).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.05 + 0.01,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1
      }));
    };
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [starCount]);
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw each star
      starsRef.current.forEach(star => {
        // Update star properties for animation
        star.opacity += star.twinkleSpeed * star.twinkleDirection;
        
        // Reverse direction if opacity limits reached
        if (star.opacity > 0.9 || star.opacity < 0.3) {
          star.twinkleDirection *= -1;
        }
        
        // Very subtle movement
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Add glow effect for some stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.2})`;
          ctx.fill();
        }
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
    />
  );
};

export default CanvasStarfield; 