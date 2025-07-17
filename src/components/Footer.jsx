import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-8 relative">
      <div className="container px-4 mx-auto max-w-md md:max-w-2xl text-center">
        <motion.p 
          className="text-xs text-white text-opacity-70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          © {new Date().getFullYear()} Văn Bảo Ngọc - Yamio
        </motion.p>
        
        <motion.div 
          className="mt-2 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a href="#" className="text-white text-opacity-70 text-xs hover:text-opacity-100 transition-opacity">
            Liên hệ
          </a>
          <span className="text-white text-opacity-50">•</span>
          <a href="#" className="text-white text-opacity-70 text-xs hover:text-opacity-100 transition-opacity">
            Thông tin thêm
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 