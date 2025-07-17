import { motion } from 'framer-motion';
import { designSystem, getPersonTheme } from '../../styles/designSystem';

/**
 * Reusable Button Component with consistent styling and animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style: 'primary', 'secondary', 'ghost', 'glass'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.personTheme - Person theme: 'giaminh', 'baongoc', 'couple'
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type for forms
 * @param {Object} props.motionProps - Additional Framer Motion props
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  personTheme = 'couple',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  motionProps = {},
  ...rest
}) => {
  // Get theme colors
  const theme = personTheme === 'couple' 
    ? { gradient: designSystem.gradients.couple }
    : getPersonTheme(personTheme);

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: `${designSystem.spacing[2]} ${designSystem.spacing[3]}`,
      fontSize: designSystem.typography.fontSize.sm,
      borderRadius: designSystem.borderRadius.md
    },
    md: {
      padding: `${designSystem.spacing[3]} ${designSystem.spacing[4]}`,
      fontSize: designSystem.typography.fontSize.base,
      borderRadius: designSystem.borderRadius.lg
    },
    lg: {
      padding: `${designSystem.spacing[4]} ${designSystem.spacing[6]}`,
      fontSize: designSystem.typography.fontSize.lg,
      borderRadius: designSystem.borderRadius.xl
    },
    xl: {
      padding: `${designSystem.spacing[5]} ${designSystem.spacing[8]}`,
      fontSize: designSystem.typography.fontSize.xl,
      borderRadius: designSystem.borderRadius['2xl']
    }
  };

  // Variant styles
  const variantStyles = {
    primary: {
      background: theme.gradient.primary,
      color: 'white',
      border: 'none',
      boxShadow: designSystem.shadows.md,
      fontWeight: designSystem.typography.fontWeight.semibold
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: designSystem.colors.neutral[800],
      border: `1px solid rgba(255, 255, 255, 0.2)`,
      backdropFilter: 'blur(10px)',
      fontWeight: designSystem.typography.fontWeight.medium
    },
    ghost: {
      background: 'transparent',
      color: designSystem.colors.neutral[700],
      border: 'none',
      fontWeight: designSystem.typography.fontWeight.medium
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      color: designSystem.colors.neutral[800],
      border: `1px solid rgba(255, 255, 255, 0.25)`,
      backdropFilter: 'blur(16px)',
      fontWeight: designSystem.typography.fontWeight.medium
    }
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantStyles[variant];

  const buttonStyle = {
    ...currentSize,
    ...currentVariant,
    fontFamily: designSystem.typography.fontFamily.body.join(', '),
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: `all ${designSystem.animations.duration.normal} ${designSystem.animations.easing.easeOut}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designSystem.spacing[2],
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  };

  const hoverAnimation = !disabled && !loading ? {
    scale: designSystem.animations.scale.hover,
    transition: {
      duration: designSystem.animations.duration.fast,
      ease: designSystem.animations.easing.easeOut
    }
  } : {};

  const tapAnimation = !disabled && !loading ? {
    scale: designSystem.animations.scale.active
  } : {};

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <motion.button
      className={`relative ${className}`}
      style={buttonStyle}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      {...motionProps}
      {...rest}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: currentVariant.background,
            borderRadius: currentSize.borderRadius
          }}
        >
          <div 
            className="animate-spin rounded-full border-2 border-white border-t-transparent"
            style={{
              width: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px',
              height: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px'
            }}
          />
        </motion.div>
      )}
      
      {/* Button content */}
      <span style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
