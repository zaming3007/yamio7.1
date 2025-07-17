import { motion } from 'framer-motion';

const AnimatedWaves = () => {
  return (
    <div className="wave-bg">
      <motion.div 
        className="wave"
        animate={{
          borderRadius: ["45%", "40%", "43%", "40%", "42%", "45%"],
          scale: [1, 1.02, 0.98, 1.01, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="wave"
        animate={{
          borderRadius: ["45%", "42%", "44%", "42%", "45%"],
          scale: [1, 0.98, 1.02, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="wave"
        animate={{
          borderRadius: ["45%", "43%", "41%", "44%", "45%"],
          scale: [1, 1.01, 0.99, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
};

export default AnimatedWaves; 