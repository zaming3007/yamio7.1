import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="pt-10 pb-6 relative overflow-hidden">
      <div className="container px-4 mx-auto max-w-md md:max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <motion.h1 
            className="font-display text-4xl md:text-5xl font-bold text-white"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Văn Bảo Ngọc
          </motion.h1>
          <motion.p
            className="mt-2 text-white text-opacity-90 font-medium text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Yamin <span className="text-rose-500">❤</span> Mio
          </motion.p>
          
          <motion.div 
            className="mt-4 flex justify-center space-x-2 text-xs md:text-sm text-white text-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span>2/10/2002</span>
            <span>•</span>
            <span>22:00</span>
            <span>•</span>
            <span>TP. Hồ Chí Minh</span>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative stars */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </header>
  );
};

export default Header; 