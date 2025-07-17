import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const LottieBackground = ({ className = "", opacity = 0.15 }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // A cosmic/space-themed animation
    fetch("https://assets9.lottiefiles.com/packages/lf20_XZ3pkn.json")
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Error loading Lottie animation:", error));
  }, []);

  if (!animationData) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      <Lottie
        animationData={animationData}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: opacity,
        }}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default LottieBackground; 