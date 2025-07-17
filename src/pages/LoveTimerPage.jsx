import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Upload, Camera, Calendar, Clock, Sparkles, Star, Download } from 'lucide-react';
import AnimatedRoute from '../components/common/AnimatedRoute';

const LoveTimerPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [yaminImage, setYaminImage] = useState(null);
  const [mioImage, setMioImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null); // 'yamin' or 'mio'
  const yaminInputRef = useRef(null);
  const mioInputRef = useRef(null);

  // Start date: June 14, 2025
  const startDate = useMemo(() => new Date('2025-06-14T23:00:00'), []);

  // Load saved images from localStorage
  useEffect(() => {
    const savedYaminImage = localStorage.getItem('yamin-image');
    const savedMioImage = localStorage.getItem('mio-image');
    if (savedYaminImage) setYaminImage(savedYaminImage);
    if (savedMioImage) setMioImage(savedMioImage);
  }, []);

  // Update the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle image upload
  const handleImageUpload = (event, target) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        if (target === 'yamin') {
          setYaminImage(imageData);
          localStorage.setItem('yamin-image', imageData);
        } else {
          setMioImage(imageData);
          localStorage.setItem('mio-image', imageData);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowUploadModal(false);
  };

  // Open upload modal
  const openUploadModal = (target) => {
    setUploadTarget(target);
    setShowUploadModal(true);
  };

  // Remove image
  const removeImage = (target) => {
    if (target === 'yamin') {
      setYaminImage(null);
      localStorage.removeItem('yamin-image');
    } else {
      setMioImage(null);
      localStorage.removeItem('mio-image');
    }
  };

  // Calculate time difference
  const getTimeDifference = () => {
    const difference = currentTime - startDate;

    // For future dates (negative difference)
    if (difference < 0) {
      const totalSeconds = Math.floor(-difference / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return {
        days, hours, minutes, seconds,
        isCountdown: true
      };
    }

    // For past dates (positive difference)
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    return {
      days, hours, minutes, seconds,
      years, months, remainingDays,
      isCountdown: false
    };
  };

  const timeDiff = getTimeDifference();

  // Calculate important milestone dates
  const getMilestones = () => {
    const milestones = [];

    // Add 3 months, 6 months, 1 year, etc.
    const intervals = [
      { months: 3, label: 'Kỷ niệm 3 tháng' },
      { months: 6, label: 'Kỷ niệm 6 tháng' },
      { months: 9, label: 'Kỷ niệm 9 tháng' },
      { years: 1, label: 'Kỷ niệm 1 năm' },
      { years: 1, months: 6, label: 'Kỷ niệm 1 năm 6 tháng' },
      { years: 2, label: 'Kỷ niệm 2 năm' },
    ];

    intervals.forEach(interval => {
      const date = new Date(startDate);
      if (interval.years) {
        date.setFullYear(date.getFullYear() + interval.years);
      }
      if (interval.months) {
        date.setMonth(date.getMonth() + interval.months);
      }

      const diffTime = date - currentTime;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      milestones.push({
        date,
        label: interval.label,
        daysAway: diffDays,
        isPast: diffDays < 0
      });
    });

    return milestones;
  };

  const milestones = getMilestones();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // Format date to Vietnamese format
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AnimatedRoute>
      <div className="min-h-screen relative overflow-hidden">
        {/* Floating hearts background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <Heart size={12 + Math.random() * 8} className="text-rose-400" />
            </motion.div>
          ))}
        </div>

        <div className="container pt-8 pb-20 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <motion.div
              className="flex items-center justify-center mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="text-rose-500 mr-2" size={32} />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient">
                Our Love Story
              </h1>
              <Sparkles className="text-rose-500 ml-2" size={32} />
            </motion.div>
            <p className="text-[#1a1033] opacity-70 max-w-md mx-auto">
              Khoảnh khắc đẹp nhất của chúng mình ✨
            </p>
          </motion.div>

          {/* Photo Frames */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto"
          >
            {/* Yamin's Photo Frame */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="glassmorphism-card p-6 text-center">
                <h3 className="text-xl font-bold text-[#1a1033] mb-4 flex items-center justify-center">
                  <span className="mr-2">🦁</span>
                  Yamin
                </h3>
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="w-full h-full rounded-full border-4 border-white border-opacity-30 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {yaminImage ? (
                      <img
                        src={yaminImage}
                        alt="Yamin"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-[#1a1033] opacity-40 mx-auto mb-2" size={32} />
                        <p className="text-[#1a1033] opacity-60 text-sm">Thêm ảnh của Yamin</p>
                      </div>
                    )}
                  </div>
                  {/* Upload/Remove buttons */}
                  <div className="absolute -bottom-2 -right-2 flex space-x-2">
                    <motion.button
                      onClick={() => openUploadModal('yamin')}
                      className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Upload size={16} />
                    </motion.button>
                    {yaminImage && (
                      <motion.button
                        onClick={() => removeImage('yamin')}
                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ×
                      </motion.button>
                    )}
                  </div>
                </div>
                <p className="text-[#1a1033] opacity-70 text-sm">30/07/2004</p>
              </div>
            </motion.div>

            {/* Mio's Photo Frame */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="glassmorphism-card p-6 text-center">
                <h3 className="text-xl font-bold text-[#1a1033] mb-4 flex items-center justify-center">
                  <span className="mr-2">🌸</span>
                  Mio
                </h3>
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="w-full h-full rounded-full border-4 border-white border-opacity-30 overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                    {mioImage ? (
                      <img
                        src={mioImage}
                        alt="Mio"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-[#1a1033] opacity-40 mx-auto mb-2" size={32} />
                        <p className="text-[#1a1033] opacity-60 text-sm">Thêm ảnh của Mio</p>
                      </div>
                    )}
                  </div>
                  {/* Upload/Remove buttons */}
                  <div className="absolute -bottom-2 -right-2 flex space-x-2">
                    <motion.button
                      onClick={() => openUploadModal('mio')}
                      className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Upload size={16} />
                    </motion.button>
                    {mioImage && (
                      <motion.button
                        onClick={() => removeImage('mio')}
                        className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ×
                      </motion.button>
                    )}
                  </div>
                </div>
                <p className="text-[#1a1033] opacity-70 text-sm">02/10/2002</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Love Connection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block"
            >
              <Heart className="text-rose-500 mx-auto mb-4" size={48} fill="currentColor" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#1a1033] mb-2">
              Yamin ❤️ Mio
            </h2>
            <p className="text-[#1a1033] opacity-70">
              Tình yêu bắt đầu từ {formatDate(startDate)}
            </p>
          </motion.div>

          {/* Timer Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="glassmorphism-card p-8 mb-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="mr-2 text-purple-500" size={20} />
                <span className="text-[#1a1033] font-semibold">Ngày bắt đầu: {formatDate(startDate)}</span>
              </div>

              {timeDiff.isCountdown ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-[#1a1033]">
                    Còn <span className="text-rose-500">{timeDiff.days}</span> ngày nữa
                  </h2>
                  <p className="text-[#1a1033] opacity-70 mb-6">
                    Đếm ngược đến ngày chúng mình chính thức yêu nhau
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-[#1a1033]">
                    Chúng mình đã yêu nhau được
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white bg-opacity-30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#1a1033]">{timeDiff.years}</div>
                      <div className="text-sm text-[#1a1033] opacity-70">Năm</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#1a1033]">{timeDiff.months}</div>
                      <div className="text-sm text-[#1a1033] opacity-70">Tháng</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#1a1033]">{timeDiff.remainingDays}</div>
                      <div className="text-sm text-[#1a1033] opacity-70">Ngày</div>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white bg-opacity-30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-[#1a1033]">{timeDiff.days}</div>
                  <div className="text-xs text-[#1a1033] opacity-70">Ngày</div>
                </div>
                <div className="bg-white bg-opacity-30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-[#1a1033]">{timeDiff.hours}</div>
                  <div className="text-xs text-[#1a1033] opacity-70">Giờ</div>
                </div>
                <div className="bg-white bg-opacity-30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-[#1a1033]">{timeDiff.minutes}</div>
                  <div className="text-xs text-[#1a1033] opacity-70">Phút</div>
                </div>
                <div className="bg-white bg-opacity-30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-[#1a1033]">{timeDiff.seconds}</div>
                  <div className="text-xs text-[#1a1033] opacity-70">Giây</div>
                </div>
              </div>

              <p className="text-[#1a1033] text-lg mb-4">
                <span className="font-semibold">Tổng cộng:</span> {timeDiff.days} ngày yêu nhau
              </p>

              <div className="flex justify-center items-center space-x-2">
                <FaRegClock className={iconStyles.clock} />
                <span className="text-[#1a1033] text-sm opacity-80">
                  Cập nhật: {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Milestones section */}
          <motion.div
            className="mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-center mb-6">
              <FaHistory className={`mr-2 ${iconStyles.history}`} />
              <h2 className="text-2xl font-display font-semibold text-[#1a1033]">
                Các cột mốc quan trọng
              </h2>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`glass-card ${milestone.isPast ? 'bg-opacity-10' : ''}`}
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${milestone.isPast ? 'text-[#1a1033] opacity-60' : 'text-[#1a1033]'}`}>
                        {milestone.label}
                      </h3>
                      <div className="text-sm text-[#1a1033] opacity-70">
                        {formatDate(milestone.date)}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${milestone.isPast ? 'bg-gray-200 text-gray-500' : 'bg-white bg-opacity-30 text-[#1a1033]'}`}>
                      {milestone.isPast
                        ? 'Đã qua'
                        : `Còn ${milestone.daysAway} ngày`}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div >

        {/* Upload Modal */}
        < AnimatePresence >
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glassmorphism-card p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#1a1033] mb-4 text-center">
                  Thêm ảnh cho {uploadTarget === 'yamin' ? 'Yamin 🦁' : 'Mio 🌸'}
                </h3>

                <div className="space-y-4">
                  <input
                    ref={uploadTarget === 'yamin' ? yaminInputRef : mioInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, uploadTarget)}
                    className="hidden"
                  />

                  <motion.button
                    onClick={() => {
                      if (uploadTarget === 'yamin') {
                        yaminInputRef.current?.click();
                      } else {
                        mioInputRef.current?.click();
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload size={20} />
                    <span>Chọn ảnh từ thiết bị</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowUploadModal(false)}
                    className="w-full py-3 px-6 rounded-xl bg-white bg-opacity-20 text-[#1a1033] font-medium hover:bg-opacity-30 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hủy
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence >
      </div >
    </AnimatedRoute >
  );
};

export default LoveTimerPage; 