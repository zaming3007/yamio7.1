import { motion } from 'framer-motion';
import { useRef } from 'react';

const NebulaEffect = ({ className = "" }) => {
  const ref = useRef(null);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} ref={ref}>
      <motion.div 
        className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(159, 111, 255, 0.6) 0%, rgba(159, 111, 255, 0) 70%)',
          top: '20%',
          left: '10%',
          opacity: 0.1
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute w-[30vw] h-[30vw] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(250, 208, 196, 0.5) 0%, rgba(250, 208, 196, 0) 70%)',
          bottom: '15%',
          right: '10%',
          opacity: 0.15
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div 
        className="absolute w-[25vw] h-[25vw] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(161, 196, 253, 0.5) 0%, rgba(161, 196, 253, 0) 70%)',
          top: '60%',
          left: '60%',
          opacity: 0.1
        }}
        animate={{
          scale: [1, 0.9, 1],
          x: [0, 20, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );
};

export default NebulaEffect; 