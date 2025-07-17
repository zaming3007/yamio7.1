import { motion } from 'framer-motion';
import { Home, ArrowLeft, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedBackground from '../components/common/EnhancedBackground';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <EnhancedBackground intensity="medium" />

      <div className="relative z-10 text-center max-w-lg px-6">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold text-[#1A1033] opacity-20 mb-4"
            animate={{
              textShadow: [
                "0 0 20px rgba(26, 16, 51, 0.3)",
                "0 0 40px rgba(26, 16, 51, 0.5)",
                "0 0 20px rgba(26, 16, 51, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Floating stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              <Star size={16 + i * 2} className="text-[#1A1033] opacity-40" />
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="relative">
              <Heart className="text-rose-500" size={48} />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Star className="text-amber-400" size={20} />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1033] mb-4">
            Trang không tồn tại
          </h2>

          {/* Description */}
          <div className="glassmorphism-card p-6 mb-8">
            <p className="text-lg text-[#1A1033] leading-relaxed mb-4">
              Có vẻ như bạn đã lạc vào một vùng không gian chưa được khám phá...
            </p>
            <p className="text-[#1A1033] opacity-80">
              Đừng lo lắng, hãy quay về trang chủ để tiếp tục hành trình khám phá của chúng mình nhé! ✨
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="group flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-[#1A1033] bg-opacity-80 text-white font-medium hover:bg-opacity-90 transition-all duration-300"
            >
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Home size={20} />
              </motion.div>
              <span>Về trang chủ</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-[#1A1033] font-medium hover:bg-opacity-30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft size={20} />
              </motion.div>
              <span>Quay lại</span>
            </button>
          </div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#1A1033] opacity-60 italic">
            "Đôi khi lạc đường cũng là một cách để khám phá những điều mới mẻ"
          </p>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#1A1033] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFoundPage;
