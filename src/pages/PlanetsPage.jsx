import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import AnimatedRoute from '../components/common/AnimatedRoute';

const PlanetsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Chi tiết về từng hành tinh
  const astrologyData = [
    {
      id: "sun",
      title: "Mặt Trời",
      sign: "Thiên Bình",
      house: "Nhà 4", 
      icon: "☀️",
      color: "planet-sun",
      signColor: "sign-libra",
      content: [
        "Tính cách cốt lõi của Bảo Ngọc mang năng lượng Thiên Bình: yêu cái đẹp, công bằng, sự hài hòa và rất giỏi trong việc làm trung gian, hòa giải mâu thuẫn.",
        "Ở nhà 4, Mặt Trời cho thấy Bảo Ngọc có sự gắn kết mạnh với gia đình, tổ tiên, cội nguồn. Có thể rất quan tâm đến việc xây dựng một tổ ấm êm đềm hoặc tìm sự ổn định trong đời sống nội tâm.",
        "Tuy nhiên, Mặt Trời rơi vào thế suy yếu (fall) ở Thiên Bình, nên người này dễ hy sinh chính kiến để làm vừa lòng người khác – đây là bài học về việc khẳng định bản thân mà không phá vỡ hòa khí."
      ],
      insight: "Bài học cân bằng giữa đứng lên cho chính mình và duy trì sự hòa hợp."
    },
    {
      id: "moon",
      title: "Mặt Trăng",
      sign: "Sư Tử",
      house: "Nhà 3", 
      icon: "🌙",
      color: "planet-moon",
      signColor: "sign-leo",
      content: [
        "Trái tim của Bảo Ngọc rất ấm áp, cần được công nhận, yêu thương và được \"tỏa sáng\".",
        "Ở nhà 3 – ngôi nhà của giao tiếp, học hành, tư duy – điều này thể hiện một năng lực biểu đạt cảm xúc mạnh mẽ, có thể qua viết lách, nói chuyện, kể chuyện hoặc làm việc trong lĩnh vực truyền thông.",
        "Mặt Trăng Sư Tử cũng khiến Bảo Ngọc giàu lòng tự tôn, đôi lúc hơi nhạy cảm trước sự từ chối, nhưng lại rất chung thủy với người mình yêu thương."
      ],
      insight: "Khả năng truyền đạt cảm xúc mạnh mẽ và nhu cầu được công nhận."
    },
    {
      id: "mercury",
      title: "Sao Thủy",
      sign: "Xử Nữ",
      house: "Nhà 4", 
      icon: "☿",
      color: "planet-mercury",
      signColor: "sign-virgo",
      content: [
        "Đây là vị trí mạnh nhất của Sao Thủy vì Xử Nữ là cung \"ngôi nhà\" của hành tinh này. Bảo Ngọc có tư duy phân tích tuyệt vời, khả năng quan sát chi tiết, sắc bén, thực tế và rất biết cách trình bày vấn đề.",
        "Tuy nhiên, khi đi lùi (Retrograde), cách suy nghĩ và giao tiếp có xu hướng hướng nội. Người này dễ \"tự nói chuyện với chính mình\", có xu hướng suy tư sâu và tự phê bình bản thân rất nhiều.",
        "Sao Thủy nhà 4 nhấn mạnh lại chủ đề: trí tuệ và sự nhận thức bắt nguồn từ môi trường gia đình hoặc ảnh hưởng từ cha mẹ."
      ],
      insight: "Tư duy phân tích sắc bén, nhưng cần cẩn thận với xu hướng phê bình nội tâm."
    },
    {
      id: "venus",
      title: "Sao Kim",
      sign: "Bọ Cạp",
      house: "Nhà 5", 
      icon: "♀️",
      color: "planet-venus",
      signColor: "sign-scorpio",
      content: [
        "Một tâm hồn yêu mãnh liệt, trung thành, nhưng cũng cực kỳ sâu sắc và kín đáo trong tình cảm.",
        "Có thể có xu hướng yêu theo kiểu \"tất cả hoặc không gì cả\". Rất khó để yêu qua loa. Khi yêu, người này thường bị cuốn hút bởi sự bí ẩn, chiều sâu cảm xúc và thậm chí là các tình huống \"nguy hiểm\" về mặt cảm xúc.",
        "Nhà 5 là nhà của tình yêu, nghệ thuật, giải trí – đây là người có sáng tạo mạnh mẽ, có thể là nghệ sĩ, nhà viết kịch bản, làm phim, v.v."
      ],
      insight: "Khả năng yêu sâu sắc và sáng tạo đầy đam mê trong nghệ thuật."
    },
    {
      id: "mars",
      title: "Sao Hỏa",
      sign: "Xử Nữ",
      house: "Nhà 4", 
      icon: "♂️",
      color: "planet-mars",
      signColor: "sign-virgo",
      content: [
        "Bảo Ngọc làm việc rất chăm chỉ, có tính tổ chức cao và kiên trì theo đuổi mục tiêu một cách có chiến lược.",
        "Tuy nhiên, dễ bị quá cầu toàn, đòi hỏi bản thân (và cả người khác) phải làm việc hoàn hảo, điều này dễ dẫn đến căng thẳng.",
        "Trong môi trường gia đình có thể từng chịu áp lực lớn hoặc là người bảo vệ gia đình, hy sinh nhiều vì người thân."
      ],
      insight: "Sức mạnh nội tâm và khả năng vượt khó thông qua sự tỉ mỉ, kiên nhẫn."
    },
    {
      id: "jupiter",
      title: "Sao Mộc",
      sign: "Sư Tử",
      house: "Nhà 3", 
      icon: "♃",
      color: "planet-jupiter",
      signColor: "sign-leo",
      content: [
        "Cho thấy trí tuệ tự nhiên, khả năng truyền cảm hứng, nói chuyện hấp dẫn và đầy lôi cuốn. Đây là người dễ thành công trong giáo dục, viết lách, giảng dạy, PR hoặc truyền thông.",
        "Suy nghĩ tích cực, có lòng tin lớn vào bản thân và lý tưởng sống."
      ],
      insight: "Khả năng mở rộng kiến thức và lan tỏa năng lượng tích cực cho người khác."
    },
    {
      id: "saturn",
      title: "Sao Thổ",
      sign: "Song Tử",
      house: "Nhà 1", 
      icon: "♄",
      color: "planet-saturn",
      signColor: "sign-gemini",
      content: [
        "Một mặt thể hiện tính cách chín chắn, tự lập sớm, sống có trách nhiệm, nhưng đôi khi cũng tạo nên cảm giác ngại ngùng, thiếu tự tin hoặc rụt rè khi mới tiếp xúc.",
        "Người này có thể gặp thách thức trong việc thể hiện bản thân ra bên ngoài, nhưng một khi vượt qua, sẽ trở nên rất bản lĩnh và đáng tin cậy."
      ],
      insight: "Bài học về kỷ luật bản thân và vượt qua những giới hạn tự áp đặt."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Touch swipe handling
  const handleSwipe = (direction) => {
    if (direction === 'left' && selectedTab < astrologyData.length - 1) {
      setSelectedTab(selectedTab + 1);
    } else if (direction === 'right' && selectedTab > 0) {
      setSelectedTab(selectedTab - 1);
    }
  };

  // Swipe props for the content area
  const swipeProps = {
    onDragEnd: (e, { offset, velocity }) => {
      const swipe = Math.abs(offset.x) > 50;
      if (swipe) {
        const direction = offset.x > 0 ? 'right' : 'left';
        handleSwipe(direction);
      }
    },
    drag: 'x',
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.7
  };

  return (
    <AnimatedRoute>
      <div className="container mb-20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold mb-3 text-gradient">Các Hành Tinh</h1>
          <p className="text-overlay content-backdrop max-w-lg mx-auto">
            Mỗi hành tinh đại diện cho một khía cạnh khác nhau trong tính cách và cuộc sống của bạn. 
            Khám phá ý nghĩa của từng hành tinh trong bản đồ sao của bạn.
          </p>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          {/* Tabs */}
          <motion.div 
            className="sticky top-0 pt-2 pb-4 z-10 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tab.List className="flex p-2 rounded-xl glass-card overflow-x-auto hide-scrollbar">
              <div className="flex space-x-2 w-full">
                {astrologyData.map((planet) => (
                  <Tab
                    key={planet.id}
                    className={({ selected }) =>
                      `tab-button flex-shrink-0 outline-none ${
                        selected ? 'bg-white bg-opacity-30 shadow-sm text-[#1a1033] font-semibold' : 'text-[#1a1033] text-opacity-70'
                      }`
                    }
                  >
                    <span className={`tab-icon ${planet.color}`}>{planet.icon}</span>
                    <span className="tab-label">{planet.title}</span>
                  </Tab>
                ))}
              </div>
            </Tab.List>
          </motion.div>

          {/* Planet indicator */}
          <div className="flex justify-center my-4">
            <div className="flex space-x-2">
              {astrologyData.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === selectedTab 
                      ? 'bg-[#1a1033] scale-125' 
                      : 'bg-[#1a1033] bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tab content with swipe support */}
          <Tab.Panels className="mt-4">
            <AnimatePresence mode="wait">
              {astrologyData.map((planet, idx) => (
                <Tab.Panel
                  key={planet.id}
                  className="focus:outline-none"
                  static={idx === selectedTab}
                >
                  {idx === selectedTab && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="planet-card"
                      {...swipeProps}
                    >
                      <span className={`planet-icon ${planet.color}`}>{planet.icon}</span>
                      
                      <motion.div className="planet-header" variants={itemVariants}>
                        <span className={`text-2xl ${planet.color}`}>{planet.icon}</span>
                        <div>
                          <h3 className="text-xl text-[#1a1033] font-bold">{planet.title}</h3>
                          {planet.sign && (
                            <div className="flex flex-wrap mt-1 gap-2">
                              <span className={`planet-badge border-${planet.signColor}`}>
                                {planet.sign}
                              </span>
                              {planet.house && (
                                <span className="planet-badge">
                                  {planet.house}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      <div className="space-y-3 relative z-10 content-backdrop">
                        {planet.content.map((paragraph, pIdx) => (
                          <motion.p 
                            key={pIdx} 
                            className="text-sm md:text-base text-overlay"
                            variants={itemVariants}
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </div>
                      
                      {planet.insight && (
                        <motion.div 
                          className={`insight-box border-${planet.color}`}
                          variants={itemVariants}
                        >
                          <span className="block font-semibold text-[#1a1033] mb-1">Insight:</span>
                          <span className="text-[#1a1033]">{planet.insight}</span>
                        </motion.div>
                      )}

                      {/* Swipe indicator */}
                      <div className="mt-6 text-center text-xs text-[#1a1033] text-opacity-60 font-medium">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex items-center justify-center"
                        >
                          {selectedTab > 0 && <span className="mr-2">← Lướt qua trái</span>}
                          <span className="inline-block mx-1 w-1 h-1 rounded-full bg-[#1a1033] bg-opacity-30"></span>
                          {selectedTab < astrologyData.length - 1 && <span className="ml-2">Lướt qua phải →</span>}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </Tab.Panel>
              ))}
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </AnimatedRoute>
  );
};

export default PlanetsPage; 