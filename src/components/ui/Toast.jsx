import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { designSystem } from '../../styles/designSystem';

// Toast Context
const ToastContext = createContext();

/**
 * Toast Provider Component
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      ...toast,
      duration: toast.duration || 4000
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * Hook to use Toast
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { addToast, removeToast, removeAllToasts } = context;

  const toast = {
    success: (message, options = {}) => addToast({
      type: 'success',
      message,
      ...options
    }),
    error: (message, options = {}) => addToast({
      type: 'error',
      message,
      ...options
    }),
    warning: (message, options = {}) => addToast({
      type: 'warning',
      message,
      ...options
    }),
    info: (message, options = {}) => addToast({
      type: 'info',
      message,
      ...options
    }),
    custom: (content, options = {}) => addToast({
      type: 'custom',
      content,
      ...options
    })
  };

  return { toast, removeToast, removeAllToasts };
};

/**
 * Toast Container Component
 */
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2"
      style={{ zIndex: designSystem.zIndex.toast }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Individual Toast Item Component
 */
const ToastItem = ({ toast, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      color: designSystem.colors.semantic.success,
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    error: {
      icon: XCircle,
      color: designSystem.colors.semantic.error,
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    warning: {
      icon: AlertCircle,
      color: designSystem.colors.semantic.warning,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    info: {
      icon: Info,
      color: designSystem.colors.semantic.info,
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    custom: {
      icon: null,
      color: designSystem.colors.neutral[600],
      bgColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(0, 0, 0, 0.1)'
    }
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      className="relative max-w-sm w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="p-4 rounded-xl backdrop-blur-md border shadow-lg"
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          boxShadow: `${designSystem.shadows.lg}, 0 0 20px ${config.color}20`
        }}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          {Icon && (
            <div className="flex-shrink-0 mt-0.5">
              <Icon 
                size={20} 
                style={{ color: config.color }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p 
                className="text-sm font-semibold mb-1"
                style={{ color: config.color }}
              >
                {toast.title}
              </p>
            )}
            {toast.message && (
              <p 
                className="text-sm"
                style={{ color: designSystem.colors.neutral[700] }}
              >
                {toast.message}
              </p>
            )}
            {toast.content && toast.content}
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onRemove}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X 
              size={16} 
              style={{ color: designSystem.colors.neutral[500] }}
            />
          </motion.button>
        </div>

        {/* Progress Bar */}
        {toast.duration > 0 && !isHovered && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 rounded-b-xl"
            style={{ backgroundColor: config.color }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ 
              duration: toast.duration / 1000,
              ease: 'linear'
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ToastItem;
