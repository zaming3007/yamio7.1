import { motion } from 'framer-motion';
import { useEffect } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const AnimatedRoute = ({ children }) => {
  // Scroll to top when component mounts (page changes)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="pb-20 md:pb-0" // Padding bottom cho mobile để tránh bị navigation che nội dung
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute; 