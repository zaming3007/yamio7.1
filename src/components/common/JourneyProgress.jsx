import { motion } from "framer-motion";
import { Circle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const JourneyProgress = ({ progress, sections, currentSection, onNavigate }) => {
  return (
    <>
      {/* Desktop navigation */}
      <motion.div 
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col items-center justify-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="h-full py-2">
          <div className="relative flex flex-col items-center">
            {/* Progress line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-[#1a1033] bg-opacity-20"></div>
            
            {/* Active progress line */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 w-px bg-[#1a1033] origin-top"
              style={{ 
                height: progress.get() * 100 + '%',
                top: 0
              }}
            />
            
            {/* Section dots */}
            <div className="h-full flex flex-col justify-between">
              {sections.map((section, index) => {
                const dotProgress = (index / (sections.length - 1));
                const isActive = progress.get() >= dotProgress;
                const isCurrent = currentSection === index;
                
                return (
                  <motion.div
                    key={index}
                    className="relative py-4 cursor-pointer"
                    onClick={() => onNavigate(index)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className={`h-3 w-3 rounded-full border flex items-center justify-center transition-colors duration-300 ${isCurrent ? 'border-[#1a1033]' : 'border-[#1a1033] border-opacity-40'}`}
                        animate={{
                          scale: isCurrent ? 1.2 : 1,
                        }}
                      >
                        {isActive && (
                          <motion.div 
                            className="h-1.5 w-1.5 rounded-full bg-[#1a1033]"
                            layoutId="activeDot"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>
                      
                      <motion.span 
                        className={`ml-3 text-xs opacity-80 ${isCurrent ? 'text-[#1a1033]' : 'text-[#1a1033] text-opacity-60'}`}
                        animate={{ 
                          opacity: isCurrent ? 1 : 0.6,
                          x: isCurrent ? 0 : -5
                        }}
                      >
                        {section}
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile navigation - always visible */}
      <motion.div 
        className="fixed bottom-6 left-6 z-50 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link 
          to="/"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm text-[#1a1033] opacity-80 hover:opacity-100 border border-[#1a1033] border-opacity-10"
        >
          <Home size={20} />
        </Link>
      </motion.div>
    </>
  );
};

export default JourneyProgress; 