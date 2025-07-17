import { motion } from 'framer-motion';
import { designSystem } from '../../styles/designSystem';

/**
 * Reusable Loading Spinner Component
 * @param {Object} props
 * @param {string} props.size - Spinner size: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.color - Spinner color theme: 'blue', 'pink', 'purple', 'neutral'
 * @param {string} props.variant - Spinner variant: 'circle', 'dots', 'pulse'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Loading text
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  variant = 'circle',
  className = '',
  text = null
}) => {
  const sizeConfig = {
    sm: { width: '16px', height: '16px', borderWidth: '2px' },
    md: { width: '24px', height: '24px', borderWidth: '2px' },
    lg: { width: '32px', height: '32px', borderWidth: '3px' },
    xl: { width: '48px', height: '48px', borderWidth: '4px' }
  };

  const colorConfig = {
    blue: designSystem.colors.primary.blue[500],
    pink: designSystem.colors.primary.pink[500],
    purple: designSystem.colors.primary.purple[500],
    neutral: designSystem.colors.neutral[500]
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  if (variant === 'circle') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className="rounded-full border-transparent"
          style={{
            width: currentSize.width,
            height: currentSize.height,
            borderWidth: currentSize.borderWidth,
            borderTopColor: currentColor,
            borderRightColor: `${currentColor}40`,
            borderBottomColor: `${currentColor}20`,
            borderLeftColor: `${currentColor}60`
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        {text && (
          <motion.p
            className="mt-3 text-sm font-medium"
            style={{ color: currentColor }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="rounded-full"
              style={{
                width: parseInt(currentSize.width) / 2,
                height: parseInt(currentSize.width) / 2,
                backgroundColor: currentColor
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
        {text && (
          <p
            className="mt-3 text-sm font-medium"
            style={{ color: currentColor }}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className="rounded-full"
          style={{
            width: currentSize.width,
            height: currentSize.height,
            backgroundColor: currentColor
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {text && (
          <p
            className="mt-3 text-sm font-medium"
            style={{ color: currentColor }}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};

/**
 * Full Page Loading Overlay
 */
export const LoadingOverlay = ({ 
  text = 'Đang tải...', 
  color = 'blue',
  variant = 'circle'
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
      style={{ zIndex: designSystem.zIndex.overlay }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner 
        size="xl" 
        color={color} 
        variant={variant}
        text={text}
      />
    </motion.div>
  );
};

/**
 * Skeleton Loading Component
 */
export const SkeletonLoader = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  variant = 'rounded' 
}) => {
  const borderRadius = variant === 'rounded' ? designSystem.borderRadius.md : 
                      variant === 'circle' ? designSystem.borderRadius.full :
                      designSystem.borderRadius.none;

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundSize: '200% 100%'
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

export default LoadingSpinner;
