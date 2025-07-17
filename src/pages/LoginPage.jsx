import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, Eye, EyeOff, Star, Sparkles } from 'lucide-react';
import EnhancedBackground from '../components/common/EnhancedBackground';

const LoginPage = ({ onLogin }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const validPins = ['300704', '021002']; // Yamin: 30/07/04, Mio: 02/10/02

  useEffect(() => {
    // Auto-focus first input
    const firstInput = document.querySelector('.pin-input');
    if (firstInput) firstInput.focus();
  }, []);

  const handlePinChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 6) {
      setTimeout(() => handleSubmit(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
      }
    }
  };

  const handleSubmit = async (pinValue = pin.join('')) => {
    if (isLocked) return;

    setIsLoading(true);
    setError('');

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (validPins.includes(pinValue)) {
      // Success
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', Date.now().toString());
      onLogin(true);
    } else {
      // Failed attempt
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsLocked(true);
        setError('Quá nhiều lần thử sai. Vui lòng thử lại sau 5 phút.');
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, 300000); // 5 minutes
      } else {
        setError(`Mã PIN không đúng. Còn ${5 - newAttempts} lần thử.`);
      }

      // Clear PIN
      setPin(['', '', '', '', '', '']);
      const firstInput = document.querySelector('.pin-input');
      if (firstInput) firstInput.focus();
    }

    setIsLoading(false);
  };

  const clearPin = () => {
    setPin(['', '', '', '', '', '']);
    setError('');
    const firstInput = document.querySelector('.pin-input');
    if (firstInput) firstInput.focus();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <EnhancedBackground intensity="high" />

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8
            }}
          >
            <Heart size={12 + i * 2} className="text-rose-400" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="flex justify-center mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="relative">
              <Lock className="text-[#1A1033]" size={48} />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="text-rose-500" size={20} />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-3xl font-heading font-bold text-[#1A1033] mb-2">
            Chào mừng về nhà
          </h1>
          <p className="text-[#1A1033] opacity-70">
            Nhập mã PIN để vào không gian riêng của chúng mình
          </p>
        </motion.div>

        {/* PIN Input */}
        <motion.div
          className="glassmorphism-card p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-center space-x-3 mb-6">
            {pin.map((digit, index) => (
              <motion.input
                key={index}
                data-index={index}
                type={showPin ? "text" : "password"}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="pin-input w-12 h-12 text-center text-xl font-bold bg-white bg-opacity-30 border-2 border-white border-opacity-40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1033] focus:ring-opacity-50 focus:border-opacity-60 transition-all text-[#1A1033]"
                maxLength={1}
                disabled={isLoading || isLocked}
                whileFocus={{ scale: 1.1 }}
                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>

          {/* Show/Hide PIN Toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowPin(!showPin)}
              className="flex items-center space-x-2 text-[#1A1033] opacity-70 hover:opacity-100 transition-opacity"
              disabled={isLoading || isLocked}
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="text-sm">{showPin ? 'Ẩn' : 'Hiện'} mã PIN</span>
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-red-600 text-sm mb-4 bg-red-100 bg-opacity-50 rounded-lg p-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={clearPin}
              disabled={isLoading || isLocked}
              className="flex-1 py-3 px-4 rounded-xl bg-white bg-opacity-20 text-[#1A1033] font-medium hover:bg-opacity-30 disabled:opacity-50 transition-all"
            >
              Xóa
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={pin.some(digit => !digit) || isLoading || isLocked}
              className="flex-1 py-3 px-4 rounded-xl bg-[#1A1033] bg-opacity-80 text-white font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <Heart size={16} />
                  <span>Vào</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-[#1A1033] opacity-60 italic">
            💡 Gợi ý: hỏng biết nữa, tự mò i bà chã
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Star className="text-[#1A1033] opacity-20" size={24} />
        </motion.div>
      </div>
      <div className="absolute top-10 right-10">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="text-rose-400 opacity-30" size={28} />
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
