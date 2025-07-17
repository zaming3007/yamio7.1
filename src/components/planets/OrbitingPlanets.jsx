import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PlanetIcon from './PlanetIcon';

const OrbitingPlanets = () => {
  const [scale, setScale] = useState(1);
  
  // Adjust scale based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(0.6); // Small screens
      } else if (width < 1024) {
        setScale(0.8); // Medium screens
      } else {
        setScale(1); // Large screens
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Define orbits with different planets, sizes, and paths
  const orbits = [
    // Inner orbit
    {
      planets: [
        { type: 'moon', size: 'md', position: 30, delay: 0, duration: 35 },
        { type: 'mercury', size: 'sm', position: 150, delay: 5, duration: 40 }
      ],
      radius: 120 * scale,
      rotationDuration: 40,
      reverse: false
    },
    // Middle orbit
    {
      planets: [
        { type: 'venus', size: 'md', position: 90, delay: 2, duration: 40 },
        { type: 'mars', size: 'sm', position: 270, delay: 0, duration: 35 }
      ],
      radius: 180 * scale,
      rotationDuration: 60,
      reverse: true
    },
    // Outer orbit
    {
      planets: [
        { type: 'jupiter', size: 'lg', position: 60, delay: 3, duration: 50 },
        { type: 'saturn', size: 'md', position: 220, delay: 8, duration: 45 }
      ],
      radius: 250 * scale,
      rotationDuration: 80,
      reverse: false
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central sun */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <PlanetIcon 
          planetType="sun" 
          size={scale < 0.8 ? "lg" : "xl"} 
          className="animate-glow"
        />
      </div>

      {/* Orbits */}
      {orbits.map((orbit, orbitIndex) => (
        <div key={orbitIndex} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Orbit path (subtle) */}
          <div 
            className="rounded-full border border-white border-opacity-5"
            style={{ 
              width: orbit.radius * 2, 
              height: orbit.radius * 2,
              marginLeft: -orbit.radius,
              marginTop: -orbit.radius
            }}
          />
          
          {/* Planets on this orbit */}
          {orbit.planets.map((planet, planetIndex) => {
            // Calculate position along the orbit (in degrees)
            const angle = planet.position * (Math.PI / 180);
            const x = Math.cos(angle) * orbit.radius;
            const y = Math.sin(angle) * orbit.radius;
            
            // Adjust size based on screen scale
            const sizeMap = {
              sm: scale < 0.8 ? 'sm' : 'sm',
              md: scale < 0.8 ? 'sm' : 'md',
              lg: scale < 0.8 ? 'md' : 'lg',
            };
            
            return (
              <motion.div
                key={planetIndex}
                className="absolute"
                style={{
                  left: orbit.radius,
                  top: orbit.radius,
                }}
                animate={{
                  rotate: orbit.reverse ? -360 : 360
                }}
                transition={{
                  duration: orbit.rotationDuration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: planet.delay
                }}
              >
                <div 
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <PlanetIcon 
                    planetType={planet.type} 
                    size={sizeMap[planet.size] || planet.size} 
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default OrbitingPlanets; 