import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, BookOpen, ArrowRight, Heart, Camera, Link as LinkIcon, Archive } from 'lucide-react';
import AnimatedRoute from '../components/common/AnimatedRoute';

const HomePage = () => {
  // Define icon styles with direct colors instead of gradients
  const iconStyles = {
    planets: "text-amber-500",
    camera: "text-pink-500",
    link: "text-indigo-500",
    archive: "text-yellow-500",
    heart: "text-rose-500",
  };

  const features = [
    {
      path: '/planets',
      icon: <Star className={`text-4xl mb-3 ${iconStyles.planets}`} size={36} strokeWidth={1.5} />,
      title: 'Các Hành Tinh',
      description: 'Tìm hiểu về ảnh hưởng của từng hành tinh lên tính cách của bạn',
    },
    {
      path: '/personality',
      icon: <Camera className={`text-4xl mb-3 ${iconStyles.camera}`} size={36} strokeWidth={1.5} />,
      title: 'Love Look',
      description: 'Yamin import cho Mio đó, gọi là tham khảo tr',
    },
    {
      path: '/insights',
      icon: <LinkIcon className={`text-4xl mb-3 ${iconStyles.link}`} size={36} strokeWidth={1.5} />,
      title: 'Kết Hợp',
      description: 'Kết nối và khám phá sự tương thích giữa hai người',
    },
    {
      path: '/archive',
      icon: <Archive className={`text-4xl mb-3 ${iconStyles.archive}`} size={36} strokeWidth={1.5} />,
      title: 'Lưu Trữ',
      description: 'Lưu giữ những kỷ niệm đáng nhớ của hai người',
    },
  ];

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

  return (
    <AnimatedRoute>
      <div className="container pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient">Văn Bảo Ngọc</h1>
          <p className="text-overlay content-backdrop">Mio - 2/10/2002</p>
        </motion.div>

        <motion.div
          className="glass-card relative overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Link to="/love-timer" className="block relative z-10 p-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Heart className={`mr-2 ${iconStyles.heart}`} size={24} strokeWidth={1.5} />
                  <h3 className="text-xl font-display text-[#1a1033]">Tình Yêu</h3>
                </div>
                <p className="text-[#1a1033] text-opacity-70 text-sm mb-4">
                  Đếm ngày yêu nhau và những khoảnh khắc đáng nhớ
                </p>
              </div>
              <motion.div
                className="flex items-center space-x-1 bg-white bg-opacity-25 px-3 py-2 rounded-full text-sm text-[#1a1033]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Xem ngay</span>
                <ArrowRight size={16} />
              </motion.div>
            </div>

            {/* Decorative background */}
            <div className="absolute inset-0 opacity-30 z-0">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-r from-pink-300 to-red-300 blur-xl"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-r from-red-300 to-pink-300 blur-xl"></div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card hover:shadow-glow transition-all duration-300"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Link to={feature.path} className="block text-center">
                {feature.icon}
                <h3 className="text-xl font-display mb-2 text-[#1a1033]">{feature.title}</h3>
                <p className="text-[#1a1033] text-opacity-70 text-sm">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedRoute>
  );
};

export default HomePage; 