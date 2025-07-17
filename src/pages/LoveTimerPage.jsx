import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaCalendarAlt, FaRegClock, FaRegCalendarAlt, FaHistory } from 'react-icons/fa';
import AnimatedRoute from '../components/common/AnimatedRoute';

const LoveTimerPage = () => {
  // Define icon styles with direct colors instead of gradients
  const iconStyles = {
    heart: "text-rose-500",
    calendar: "text-purple-500",
    clock: "text-blue-500",
    history: "text-amber-500"
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Start date: June 14, 2025
  const startDate = useMemo(() => new Date('2025-06-14T23:00:00'), []);
  
  // Update the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
      <div className="container pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Văn Bảo Ngọc
          </h1>
          <p className="text-overlay content-backdrop max-w-md mx-auto">
            Mio - 2/10/2002
          </p>
        </motion.div>
        
        {/* Yamin heart Mio text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Yamin <span className={`${iconStyles.heart} inline-block animate-pulse`}><FaHeart /></span> Mio
          </h2>
        </motion.div>
        
        {/* Main timer card */}
        <motion.div
          className="glass-card mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative overflow-hidden p-4">
            {/* Floating hearts background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${iconStyles.heart} opacity-10`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: Math.random() * 2,
                  }}
                >
                  <FaHeart />
                </motion.div>
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <FaCalendarAlt className={`mr-2 ${iconStyles.calendar}`} />
                <span className="text-[#1a1033] font-semibold">Ngày bắt đầu: 14.06.2025</span>
              </div>
              
              {timeDiff.isCountdown ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-[#1a1033]">
                    Còn <span className={iconStyles.heart}>{timeDiff.days}</span> ngày nữa
                  </h2>
                  
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-2xl md:text-3xl font-bold text-[#1a1033]">{timeDiff.days}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Ngày</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-2xl md:text-3xl font-bold text-[#1a1033]">{timeDiff.hours}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Giờ</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-2xl md:text-3xl font-bold text-[#1a1033]">{timeDiff.minutes}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Phút</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-2xl md:text-3xl font-bold text-[#1a1033]">{timeDiff.seconds}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Giây</div>
                    </div>
                  </div>
                  
                  <p className="text-[#1a1033] text-lg mb-4">
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
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-xl font-bold text-[#1a1033]">{timeDiff.hours}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Giờ</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-xl font-bold text-[#1a1033]">{timeDiff.minutes}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Phút</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-3">
                      <div className="text-xl font-bold text-[#1a1033]">{timeDiff.seconds}</div>
                      <div className="text-xs text-[#1a1033] opacity-70">Giây</div>
                    </div>
                  </div>
                  
                  <p className="text-[#1a1033] text-lg mb-4">
                    <span className="font-semibold">Tổng cộng:</span> {timeDiff.days} ngày yêu nhau
                  </p>
                </>
              )}
              
              <div className="flex justify-center items-center space-x-2">
                <FaRegClock className={iconStyles.clock} />
                <span className="text-[#1a1033] text-sm opacity-80">
                  Cập nhật: {currentTime.toLocaleTimeString()}
                </span>
              </div>
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
      </div>
    </AnimatedRoute>
  );
};

export default LoveTimerPage; 