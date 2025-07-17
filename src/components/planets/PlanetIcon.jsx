import { motion } from 'framer-motion';

const PlanetIcon = ({ planetType, size = 'md', className = '', orbitClass = '' }) => {
  // Planet configurations with CSS gradients instead of images
  const planetConfigs = {
    sun: {
      gradient: 'bg-gradient-radial from-yellow-300 via-orange-400 to-amber-600',
      shadow: 'shadow-[0_0_30px_rgba(255,167,38,0.5)]',
      alt: 'Mặt Trời',
    },
    moon: {
      gradient: 'bg-gradient-radial from-gray-100 via-gray-200 to-gray-300',
      shadow: 'shadow-[0_0_25px_rgba(225,225,225,0.4)]',
      alt: 'Mặt Trăng',
    },
    mercury: {
      gradient: 'bg-gradient-radial from-lime-300 via-green-400 to-lime-700',
      shadow: 'shadow-[0_0_20px_rgba(139,195,74,0.4)]',
      alt: 'Sao Thủy',
    },
    venus: {
      gradient: 'bg-gradient-radial from-orange-200 via-orange-400 to-orange-600',
      shadow: 'shadow-[0_0_25px_rgba(255,112,67,0.5)]',
      alt: 'Sao Kim',
    },
    mars: {
      gradient: 'bg-gradient-radial from-red-300 via-red-500 to-red-800',
      shadow: 'shadow-[0_0_20px_rgba(229,57,53,0.45)]',
      alt: 'Sao Hỏa',
    },
    jupiter: {
      gradient: 'bg-gradient-radial from-indigo-300 via-indigo-500 to-indigo-800',
      shadow: 'shadow-[0_0_20px_rgba(92,107,192,0.4)]',
      alt: 'Sao Mộc',
    },
    saturn: {
      gradient: 'bg-gradient-radial from-amber-200 via-amber-500 to-amber-800',
      shadow: 'shadow-[0_0_20px_rgba(141,110,99,0.4)]',
      alt: 'Sao Thổ',
      hasRing: true,
    },
    default: {
      gradient: 'bg-gradient-radial from-white via-gray-200 to-gray-400',
      shadow: 'shadow-[0_0_15px_rgba(255,255,255,0.4)]',
      alt: 'Hành tinh',
    },
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const config = planetConfigs[planetType] || planetConfigs.default;

  return (
    <motion.div 
      className={`relative ${orbitClass}`}
      animate={{ 
        rotate: [0, 360] 
      }}
      transition={{ 
        duration: 30,
        repeat: Infinity, 
        ease: "linear"
      }}
    >
      <motion.div 
        className={`${sizeClasses[size]} ${config.shadow} ${className} rounded-full overflow-hidden relative`}
        whileHover={{ 
          scale: 1.1,
        }}
        animate={{ 
          rotate: [-10, 10, -10],
        }}
        transition={{ 
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Planet body */}
        <div 
          className={`w-full h-full ${config.gradient} rounded-full`}
          title={config.alt}
        >
          {/* Surface details for some planets */}
          {planetType === 'jupiter' && (
            <>
              <div className="absolute inset-0 opacity-40">
                <div className="w-full h-1 bg-amber-400 relative top-1/3"></div>
                <div className="w-full h-1 bg-amber-300 relative top-1/2 opacity-80"></div>
              </div>
            </>
          )}

          {planetType === 'saturn' && (
            <>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-1 bg-amber-200 opacity-80 rounded-full"></div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140%] h-3 bg-transparent border-t border-b border-amber-100 opacity-30 rounded-full"></div>
            </>
          )}
          
          {/* Add craters to moon */}
          {planetType === 'moon' && (
            <>
              <div className="absolute w-2 h-2 rounded-full bg-gray-300 top-1/4 left-1/4"></div>
              <div className="absolute w-1 h-1 rounded-full bg-gray-300 bottom-1/3 right-1/3"></div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanetIcon; 