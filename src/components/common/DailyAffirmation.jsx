import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Star, Sparkles } from 'lucide-react';

const DailyAffirmation = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const affirmations = [
    {
      text: "Tình yêu của chúng mình ngày càng mạnh mẽ và sâu sắc hơn.",
      author: "💕 Cho Yamin & Mio"
    },
    {
      text: "Mỗi ngày bên nhau là một món quà quý giá.",
      author: "✨ Dành cho tình yêu"
    },
    {
      text: "Chúng mình là đôi bạn tâm giao và người yêu hoàn hảo.",
      author: "🌟 Cho cặp đôi"
    },
    {
      text: "Tình yêu của chúng mình vượt qua mọi thử thách.",
      author: "💖 Yamin & Mio"
    },
    {
      text: "Chúng mình luôn ủng hộ và tin tương nhau.",
      author: "🦋 Cho tình yêu đích thực"
    },
    {
      text: "Mỗi khoảnh khắc bên nhau đều đáng trân trọng.",
      author: "🌹 Dành cho hai người"
    },
    {
      text: "Tình yêu của chúng mình là nguồn cảm hứng cho nhau.",
      author: "💫 Yamin & Mio"
    },
    {
      text: "Chúng mình cùng nhau tạo nên những kỷ niệm đẹp.",
      author: "🎈 Cho tương lai"
    },
    {
      text: "Tình yêu chân thành luôn chiến thắng mọi khó khăn.",
      author: "🌸 Dành cho chúng mình"
    },
    {
      text: "Chúng mình là hai nửa hoàn hảo của một tổng thể.",
      author: "💝 Yamin & Mio"
    },
    {
      text: "Mỗi ngày chúng mình yêu nhau nhiều hơn ngày hôm qua.",
      author: "🌺 Cho tình yêu vĩnh cửu"
    },
    {
      text: "Tình yêu của chúng mình là ánh sáng dẫn đường.",
      author: "⭐ Dành cho hai trái tim"
    }
  ];

  useEffect(() => {
    // Get today's affirmation based on date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const affirmationIndex = dayOfYear % affirmations.length;
    setCurrentAffirmation(affirmations[affirmationIndex]);

    // Show affirmation after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  };

  const dismissAffirmation = () => {
    setIsVisible(false);
  };

  if (!currentAffirmation) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <motion.div
            className="glassmorphism-card p-6 shadow-2xl border-2 border-white border-opacity-20"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="text-rose-500" size={20} fill="currentColor" />
                </motion.div>
                <span className="text-sm font-semibold text-[#1a1033] opacity-80">
                  Lời động viên hôm nay
                </span>
              </div>
              <button
                onClick={dismissAffirmation}
                className="text-[#1a1033] opacity-50 hover:opacity-80 transition-opacity"
              >
                ×
              </button>
            </div>

            {/* Affirmation Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <p className="text-[#1a1033] font-medium leading-relaxed mb-2">
                "{currentAffirmation.text}"
              </p>
              <p className="text-[#1a1033] opacity-60 text-sm italic">
                {currentAffirmation.author}
              </p>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <motion.button
                onClick={getRandomAffirmation}
                className="flex items-center space-x-2 text-[#1a1033] opacity-70 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={14} />
                <span className="text-sm">Khác</span>
              </motion.button>

              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                >
                  <Star className="text-amber-400" size={12} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                >
                  <Sparkles className="text-purple-400" size={12} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                >
                  <Heart className="text-rose-400" size={12} />
                </motion.div>
              </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-rose-400 rounded-full opacity-30"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyAffirmation;
