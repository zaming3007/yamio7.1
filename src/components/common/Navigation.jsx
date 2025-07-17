import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaHome, FaStar, FaMagic, FaHeart, FaCamera, FaEllipsisH, FaBullseye, FaImages, FaCog, FaCloudSun, FaComments } from 'react-icons/fa';

const Navigation = () => {
  const [showMore, setShowMore] = useState(false);

  // Tất cả các icon sẽ có màu đơn sắc
  const iconColor = "text-[#1a1033]";

  // Main navigation items (most important)
  const mainNavItems = [
    { path: '/', label: 'Trang Chủ', icon: <FaHome className={iconColor} /> },
    { path: '/planets', label: 'Các Hành Tinh', icon: <FaStar className={iconColor} /> },
    { path: '/love-timer', label: 'Tình Yêu', icon: <FaHeart className={iconColor} /> },
  ];

  // Secondary navigation items (in More menu)
  const moreNavItems = [
    { path: '/personality', label: 'Love Look', icon: <FaCamera className={iconColor} /> },
    { path: '/weather', label: 'Weather', icon: <FaCloudSun className={iconColor} /> },
    { path: '/feedback', label: 'Feedback', icon: <FaComments className={iconColor} /> },
    { path: '/couple-goals', label: 'Couple Goals', icon: <FaBullseye className={iconColor} /> },
    { path: '/memory-wall', label: 'Memory Wall', icon: <FaImages className={iconColor} /> },
    { path: '/admin/messages', label: 'Tin Nhắn', icon: <FaCog className={iconColor} /> },
  ];

  return (
    <motion.nav
      className="main-nav"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex justify-center items-center w-full relative">
        {/* Main navigation items */}
        <div className="flex space-x-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <motion.span
                className="nav-icon"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                {item.icon}
              </motion.span>
              <span className="nav-text">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Special journey button */}
        <NavLink
          to="/journey"
          className={({ isActive }) =>
            `journey-nav-item mx-2 ${isActive ? 'active' : ''}`
          }
        >
          <motion.div
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-mystic-peach to-mystic-blue rounded-full text-[#1a1033] font-semibold shadow-glow"
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 15px rgba(159, 111, 255, 0.7)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1, 1.05, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <FaMagic className={iconColor} />
          </motion.div>
          <span className="block text-xs mt-1 text-[#1a1033] font-medium">Hành Trình</span>
        </NavLink>

        {/* More button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowMore(!showMore)}
            className="nav-item"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.span
              className="nav-icon"
              animate={{ rotate: showMore ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaEllipsisH className={iconColor} />
            </motion.span>
            <span className="nav-text">Thêm</span>
          </motion.button>

          {/* More menu dropdown */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 right-0 bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-xl border border-white border-opacity-30 p-2 min-w-[120px]"
                style={{ zIndex: 1000 }}
              >
                {moreNavItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive
                          ? 'bg-[#1a1033] bg-opacity-10 text-[#1a1033] font-semibold'
                          : 'text-[#1a1033] text-opacity-70 hover:bg-[#1a1033] hover:bg-opacity-5 hover:text-opacity-100'
                        }`
                      }
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Backdrop to close more menu */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation; 