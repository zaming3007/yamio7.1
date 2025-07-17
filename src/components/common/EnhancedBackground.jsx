import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EnhancedBackground = ({ intensity = 'medium', className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Intensity settings for the parallax effect
  const intensitySettings = {
    light: 5,
    medium: 15,
    strong: 30
  };
  
  const parallaxFactor = intensitySettings[intensity] || intensitySettings.medium;

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position as percentage of window size
      const x = e.clientX / windowSize.width - 0.5;
      const y = e.clientY / windowSize.height - 0.5;
      setMousePosition({ x, y });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [windowSize.width, windowSize.height]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* First layer - Gradient orbs */}
      <motion.div
        className="absolute w-full h-full"
        style={{
          x: mousePosition.x * -parallaxFactor,
          y: mousePosition.y * -parallaxFactor,
        }}
      >
        {/* Purple orb */}
        <motion.div
          className="absolute w-[50vw] h-[50vh] rounded-full bg-gradient-radial from-mystic-purple/20 to-transparent blur-3xl"
          style={{
            top: '15%',
            right: '10%',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        {/* Peach orb */}
        <motion.div
          className="absolute w-[40vw] h-[40vh] rounded-full bg-gradient-radial from-mystic-peach/20 to-transparent blur-3xl"
          style={{
            bottom: '20%',
            left: '10%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2,
          }}
        />
        
        {/* Blue orb */}
        <motion.div
          className="absolute w-[35vw] h-[35vh] rounded-full bg-gradient-radial from-mystic-blue/20 to-transparent blur-3xl"
          style={{
            top: '50%',
            left: '60%',
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 4,
          }}
        />
      </motion.div>
      
      {/* Stars effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, index) => {
          const size = Math.random() * 2 + 1;
          return (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 3,
              }}
            />
          );
        })}
      </div>
      
      {/* Third layer - Subtle vignette */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.3) 150%)'
        }}
      />
    </div>
  );
};

export default EnhancedBackground; 