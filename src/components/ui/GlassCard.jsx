import { motion } from 'framer-motion';
import { createGlassStyle, createShadowStyle, designSystem } from '../../styles/designSystem';

/**
 * Reusable Glass Card Component with consistent styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Glass effect variant: 'light', 'medium', 'heavy'
 * @param {string} props.shadow - Shadow variant: 'sm', 'base', 'md', 'lg', 'xl', '2xl'
 * @param {string} props.glowColor - Glow color: 'blue', 'pink', 'purple'
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.hover - Enable hover animations
 * @param {function} props.onClick - Click handler
 * @param {Object} props.motionProps - Additional Framer Motion props
 */
const GlassCard = ({
  children,
  variant = 'medium',
  shadow = 'lg',
  glowColor = null,
  className = '',
  style = {},
  hover = true,
  onClick,
  motionProps = {},
  ...rest
}) => {
  const glassStyle = createGlassStyle(variant);
  const shadowStyle = createShadowStyle(shadow, glowColor);

  const combinedStyle = {
    ...glassStyle,
    ...shadowStyle,
    ...style
  };

  const hoverAnimation = hover ? {
    scale: designSystem.animations.scale.hover,
    transition: {
      duration: designSystem.animations.duration.normal,
      ease: designSystem.animations.easing.easeOut
    }
  } : {};

  const tapAnimation = hover ? {
    scale: designSystem.animations.scale.active
  } : {};

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={combinedStyle}
      whileHover={hoverAnimation}
      whileTap={onClick ? tapAnimation : {}}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
