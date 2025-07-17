import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Home, Leaf, Sun, Moon, Star, Heart } from 'lucide-react';
import JourneyProgress from '../components/common/JourneyProgress';
import CanvasStarfield from '../components/common/CanvasStarfield';

// Define icon styles with direct colors instead of gradients
const iconStyles = {
  home: "text-blue-500",
  leaf: "text-green-500",
  sun: "text-amber-500",
  moon: "text-slate-300",
  star: "text-amber-500",
  heart: "text-rose-500",
};

// Section components for the journey
const IntroSection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden" ref={ref}>
      {/* Simple starfield background */}
      <CanvasStarfield starCount={50} />

      {/* Constellation lines with enhanced styling */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <motion.line
          x1="20%" y1="20%"
          x2="40%" y2="40%"
          stroke="#ffffff"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.line
          x1="40%" y1="40%"
          x2="60%" y2="30%"
          stroke="#ffffff"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 1.0 }}
        />
        <motion.line
          x1="60%" y1="30%"
          x2="80%" y2="60%"
          stroke="#ffffff"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <motion.line
          x1="35%" y1="70%"
          x2="60%" y2="65%"
          stroke="#ffffff"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 2.0 }}
        />
        <motion.line
          x1="60%" y1="65%"
          x2="75%" y2="80%"
          stroke="#ffffff"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 2.5 }}
        />

        {/* Star points at connection vertices */}
        {[
          { cx: "20%", cy: "20%" },
          { cx: "40%", cy: "40%" },
          { cx: "60%", cy: "30%" },
          { cx: "80%", cy: "60%" },
          { cx: "35%", cy: "70%" },
          { cx: "60%", cy: "65%" },
          { cx: "75%", cy: "80%" },
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.cx}
            cy={point.cy}
            r="1.5"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.7] }}
            transition={{
              duration: 2,
              delay: i * 0.3 + 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 5 + i
            }}
          />
        ))}
      </svg>

      <motion.div
        className="text-center max-w-xl px-6 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="flex justify-center mb-4">
          <Leaf className={iconStyles.leaf} size={24} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-heading font-bold mb-8 text-[#1A1033] tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]"
          style={{
            scale: useTransform(progress, [0, 0.1], [1, 1.2]),
            opacity: useTransform(progress, [0, 0.1, 0.2], [1, 1, 0])
          }}
          whileInView={{
            letterSpacing: ['.08em', '.05em'],
            transition: { duration: 1.5, ease: 'easeOut' }
          }}
        >
          Em
        </motion.h1>

        <motion.div
          className="space-y-5 p-10 rounded-xl border border-white border-opacity-10 shadow-glass backdrop-blur-sm"
          style={{ opacity: useTransform(progress, [0, 0.1, 0.2], [1, 1, 0]) }}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-xl md:text-2xl font-heading italic text-[#1A1033] leading-relaxed">
            "Hành trình của em"
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
          >
            <p className="text-lg md:text-xl font-body text-[#1A1033] leading-relaxed">
              Văn Bảo Ngọc
            </p>
            <p className="text-lg md:text-xl font-body text-[#1A1033] leading-relaxed mt-2">
              Mio - 2/10/2002
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="fixed left-1/2 transform -translate-x-1/2 bottom-6 flex flex-col items-center"
          style={{ opacity: useTransform(progress, [0, 0.1], [1, 0]) }}
        >
          <motion.div
            className="px-6 py-2 rounded-full flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm"
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <ChevronDown className="text-[#1A1033] opacity-80" size={18} />
            </motion.div>
            <span className="text-sm text-[#1A1033] font-body font-medium opacity-80">
              Cuộn xuống để bắt đầu hành trình
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Additional section for emotions
const EmotionsSection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const opacityValue = useTransform(
    progress,
    [0.375, 0.4, 0.475, 0.5],
    [0, 1, 1, 0]
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20">
      <motion.div
        ref={ref}
        className="max-w-lg px-6 relative z-10 rounded-xl border border-white border-opacity-10 bg-white bg-opacity-20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        style={{ opacity: opacityValue }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ rotate: [-5, 5, -5], scale: 1.1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14 text-[#1A1033] opacity-80"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-heading font-semibold mb-3 text-[#1A1033]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Em Nghĩ Nhiều
          </motion.h2>
        </motion.div>

        <motion.div
          className="space-y-5 text-[#1a1033] text-lg pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-heading italic text-center">
            "Em nghĩ nhiều, anh cũng thế"
          </p>

          <p>
            Em có Sao Thủy Xử Nữ đi lùi trong nhà 4 – một trí óc tinh tường, phân tích sắc bén, nhưng thường hướng vào bên trong. Em thường tự nhai lại một chuyện trong đầu nhiều lần, chỉ vì muốn hiểu nó thật kỹ trước khi nói ra.
          </p>

          <p>
            Anh cũng vậy.
          </p>

          <p>
            Cả hai đứa mình đều thuộc kiểu: nghĩ trước khi nói, chọn từ thật kỹ, và đôi khi chọn im lặng khi không chắc điều mình nói có đúng không, hoặc có lẽ chỉ muốn giữ hòa khí. Nhưng rồi, bằng cách nào đó – anh thấy em bắt đầu nói nhiều hơn, bộc lộ hơn, và rõ ràng hơn về những gì em thấy, em muốn, em không chấp nhận.
          </p>

          <motion.div
            className="mt-6 p-4 rounded-lg border-l-2 border-[#1A1033] border-opacity-30 italic"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            Không phải vì em thay đổi.
            Mà vì em đang dần tin rằng: cảm xúc của mình cũng xứng đáng được hiện diện.
            Và anh cũng sẽ là người ở bên chứng kiến điều đó.
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const SunSection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const opacityValue = useTransform(
    progress,
    [0.1, 0.125, 0.2, 0.25],
    [0, 1, 1, 0]
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20">
      <motion.div
        ref={ref}
        className="max-w-lg px-6 relative z-10 rounded-xl border border-white border-opacity-10 bg-white bg-opacity-20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        style={{ opacity: opacityValue }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14 text-[#1A1033] opacity-80"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-heading font-semibold mb-3 text-[#1A1033]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hành Trình Về Với Chính Mình
          </motion.h2>

          <motion.div
            className="inline-block px-4 py-1 rounded-full text-[#1a1033] font-medium mb-4 border border-[#1A1033] border-opacity-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Mặt Trời: Thiên Bình ♎︎ • Nhà 4
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-5 text-[#1a1033] text-lg pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-heading italic text-center">
            "Em sinh ra để giữ sự hài hòa – nhưng hành trình em đi là để tìm lại mình"
          </p>

          <p>
            Em mang trong mình ánh sáng Thiên Bình – dịu dàng, tinh tế, có khả năng làm mềm đi những góc cứng của thế giới. Em luôn để tâm đến cảm xúc người khác, luôn cố gắng giữ không khí yên ổn, ấm áp.
          </p>

          <p>
            Nhưng em không phải là người dễ dàng.
            Mặt Trời trong nhà 4 nói rằng: em sống sâu, sống thật. Em cần sự ổn định – nhưng không phải sự ổn định từ bên ngoài. Em tìm kiếm một "ngôi nhà" từ bên trong: nơi em được thở đúng với mình, được sống đúng với những gì em cảm mà không phải chỉnh sửa nó cho vừa vặn với ai.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Venus section
const VenusSection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const opacityValue = useTransform(
    progress,
    [0.625, 0.65, 0.725, 0.75],
    [0, 1, 1, 0]
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20">
      <motion.div
        ref={ref}
        className="max-w-lg px-6 relative z-10 rounded-xl border border-white border-opacity-10 bg-white bg-opacity-20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        style={{ opacity: opacityValue }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5 }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14 text-[#1A1033] opacity-80"
              >
                <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                <path d="M12 13v9"></path>
                <path d="M12 2v4"></path>
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-heading font-semibold mb-3 text-[#1A1033]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hành Trình Về Lại
          </motion.h2>

          <motion.div
            className="inline-block px-4 py-1 rounded-full text-[#1a1033] font-medium mb-4 border border-[#1A1033] border-opacity-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Nhà 4 - Cội nguồn và nội tâm
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-5 text-[#1a1033] text-lg pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-heading italic text-center">
            "Hành trình của em là hành trình về lại – không phải vươn ra"
          </p>

          <p>
            Với ba hành tinh trọng yếu nằm trong nhà 4 – em không sống vì ánh đèn sân khấu, danh vọng hay sự công nhận bên ngoài.
            Thứ em tìm kiếm là một nền tảng cảm xúc vững chắc, một chốn riêng bên trong mà dù cuộc đời có xô lệch đến đâu, em cũng có thể quay về đó và thở thật sâu.
          </p>

          <motion.div
            className="mt-6 p-4 rounded-lg border-l-2 border-[#1A1033] border-opacity-30 italic"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            Anh biết, em cần một nơi – không phải để chạy trốn, mà để trở về.
            Một không gian không có vai diễn, không có ánh mắt dò xét, không cần phải “đúng mực” hay “đủ tốt”.
            Ở đó, em chỉ cần thở. Chỉ cần hiện diện – là đủ.
            Anh luôn ở đó, anh luôn là chỗ dựa cho em mà, anh vẫn thường nói cho em nghe về điều đó, em biết chứ? Anh muốn là chỗ để em dựa dẫm, như là gia đình vậyyy.          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Life Path section
const LifePathSection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const opacityValue = useTransform(
    progress,
    [0.75, 0.775, 0.85, 0.875],
    [0, 1, 1, 0]
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20">
      <motion.div
        ref={ref}
        className="max-w-lg px-6 relative z-10 rounded-xl border border-white border-opacity-10 bg-white bg-opacity-20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        style={{ opacity: opacityValue }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14 text-[#1A1033] opacity-80"
              >
                <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-heading font-semibold mb-3 text-[#1A1033]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Đường Về
          </motion.h2>
        </motion.div>

        <motion.div
          className="space-y-5 text-[#1a1033] text-lg pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p>
            Em mang trong mình vẻ ngoài Song Tử linh hoạt, trí thông minh nhanh nhẹn, nhưng điểm đến lại là sự tĩnh lặng, ổn định, có gốc rễ. Hành trình này – sẽ không phải là đi tìm điều gì ở bên ngoài. Nó là cuộc trở về, là tự hiểu mình sâu sắc.
          </p>

          <p>
            Em sẽ đối diện với những cảm xúc thật, nhu cầu thật, và cả những nỗi sợ hãi thật – những thứ đã bị chối bỏ hoặc đè nén. Và hành trình ấy rất đáng để đi, dù nó có những lúc không dễ dàng gì.
          </p>

          <motion.div
            className="mt-6 p-4 rounded-lg border-l-2 border-[#1A1033] border-opacity-30 italic"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            Anh nghĩ… tình yêu thực sự chỉ đến khi em không còn phải cố trở thành một “phiên bản tốt hơn” cho ai khác.
            Khi em được là chính mình – với tất cả sự mâu thuẫn, sâu sắc, nhạy cảm và lấp lánh của em – thì tình yêu mới thật sự bắt đầu.
            Anh cảm nhận điều đó trong em, anh xuất hiện để đưa em trở về lại, được yêu được sống, luôn tích cực lạc quan chứ không như quá khứ trước kia nữa.          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const MoonSection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const opacityValue = useTransform(
    progress,
    [0.25, 0.275, 0.35, 0.375],
    [0, 1, 1, 0]
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20">
      <motion.div
        ref={ref}
        className="max-w-lg px-6 relative z-10 rounded-xl border border-white border-opacity-10 bg-white bg-opacity-20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        style={{ opacity: opacityValue }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ rotate: [-5, 5, -5], scale: 1.1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14 text-[#1A1033] opacity-80"
              >
                <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-heading font-semibold mb-3 text-[#1A1033]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Khi Ở Bên Nhau
          </motion.h2>

          <motion.div
            className="inline-block px-4 py-1 rounded-full text-[#1a1033] font-medium mb-4 border border-[#1A1033] border-opacity-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Cung Mọc: Song Tử
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-5 text-[#1a1033] text-lg pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-heading italic text-center">
            "Em không còn phải giữ nữa. Em được là chính em, một cách trọn vẹn"
          </p>

          <p>
            Cung Mọc Song Tử khiến em lanh lợi, lí lắc, thích nói chuyện, thích chơi chữ, thích biến những điều bình thường thành thú vị.
          </p>

          <p>
            Nhưng anh biết, những lúc em "tăng động", "khùm điên", bày trò, phá lên cười, lắc người nhún vai,.. hay nói những câu nghe "kì quặc" – không phải vì em đang cố "làm vui"…
            Mà vì em đang thả lỏng. Đang được là mình – không cần giữ hình ảnh, không cần đo từng hành vi. Anh vui vì em được là mình khi ở bên anh.
          </p>

          <motion.div
            className="mt-6 p-4 rounded-lg border-l-2 border-[#1A1033] border-opacity-30 italic"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            Anh thấy trong em có một ánh sáng không ai có thể bắt chước. Nó ấm, rực rỡ, chân thành – không phải kiểu cố để tỏa sáng, mà là vì em thật sự có một ngọn lửa sống động bên trong.

            Mỗi khi em thấy an toàn, em bộc lộ hết – không ngần ngại, không chỉnh sửa. Có thể hơi "ồn ào", có thể nhiều năng lượng đến mức "quá tay" một chút, nhưng anh chưa từng nghĩ đó là quá nhiều.

            Ngược lại, anh thấy đó là lúc em đẹp nhất. Không cần kiểm soát, không cần "đúng mực". Chỉ cần được là em – và được cháy rực lên như chính em vốn thế.          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const MercurySection = ({ progress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const opacityValue = useTransform(
    progress,
    [0.5, 0.525, 0.6, 0.625],
    [0, 1, 1, 0]
  );

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20">
      <motion.div
        ref={ref}
        className="max-w-lg px-6 relative z-10 rounded-xl border border-white border-opacity-10 bg-white bg-opacity-20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        style={{ opacity: opacityValue }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-14 h-14 text-[#1A1033] opacity-80"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M12 9a3 3 0 0 0 0 6"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </motion.svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-heading font-semibold mb-3 text-[#1A1033]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Em Yêu Sâu
          </motion.h2>

          <motion.div
            className="inline-block px-4 py-1 rounded-full text-[#1a1033] font-medium mb-4 border border-[#1A1033] border-opacity-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Sao Kim: Bọ Cạp • Nhà 5
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-5 text-[#1a1033] text-lg pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="font-heading italic text-center">
            "Em yêu sâu – và không giấu nổi điều gì trong ánh mắt"
          </p>

          <p>
            Sao Kim ở Bọ Cạp – nhà 5 làm cho em yêu một cách toàn tâm, toàn ý. Em không biết yêu kiểu "tạm thời". Không biết "vui là được". Em chỉ biết trao – và trao hết.
          </p>

          <p>
            Điều khiến em dễ tổn thương không phải vì em yếu lòng. Mà vì em chân thành. Em để tâm, em tin – và em mong người ta cũng vậy.
            Chuyện tình cảm với em không chỉ là cảm xúc, nó là một phần rất gốc trong con người em – là nơi em khám phá chính mình thông qua người kia.
          </p>

          <motion.div
            className="mt-6 p-4 rounded-lg border-l-2 border-[#1A1033] border-opacity-30 italic"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            Có thể người khác không hiểu, nhưng anh biết: với em, tình cảm không phải thứ để thử. Đúng không? Nó là phần gốc rễ – nơi em soi mình vào người khác, để hiểu chính mình sâu hơn. Và khi em bị tổn thương, không phải vì em yếu đuối, mà vì em quá thật lòng.

            Anh nhìn thấy điều đó, và anh trân trọng nó – hơn cả những lời yêu thương bình thường đó.
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Update the ConclusionSection to use direct color icons
const ConclusionSection = ({ progress, onJourneyComplete }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      onJourneyComplete();
    }
  }, [isInView, onJourneyComplete]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative py-20" ref={ref}>
      <motion.div
        className="max-w-lg px-6 relative z-10 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1, rotate: [0, 360] } : { scale: 0 }}
          transition={{ duration: 1.5 }}
        >
          <Heart className={iconStyles.heart} size={40} strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-[#1A1033]">
          Hành Trình Kết Thúc
        </h2>

        <div className="glassmorphism-card mb-8">
          <p className="text-lg font-body text-[#1A1033] leading-relaxed mb-6">
            Yamin biết, mọi điều Yamin viết ở đây đều bắt nguồn từ bản đồ sao, chiêm tinh – một thứ Yamin học hỏi để hiểu Mio hơn.
          </p>
          <p className="text-lg font-body text-[#1A1033] leading-relaxed mb-6">
            Anh không biết thổ lộ cảm xúc với em thế nào, anh muốn dựa vào cái bản đồ sao gì đó, để mượn lời nói những suy nghĩ về em.               Anh mong mình đã nói đúng, đủ, và thật. Còn nếu có điều gì anh chưa chạm tới, thì anh sẽ lặng lẽ học thêm, lắng nghe thêm – rồi bổ sung sau nháaaaa.
            <p>
            </p>
            <p className="text-lg font-body text-[#1A1033] leading-relaxed">
            </p>
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center space-x-2 hover:bg-opacity-30 transition-all"
            onClick={handleHomeClick}
          >
            <Home className={iconStyles.home} size={18} strokeWidth={1.5} />
            <span className="text-[#1A1033] font-medium">Quay về trang chủ</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

const JourneyPage = () => {
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const navigate = useNavigate();

  const sections = [
    "Giới thiệu",
    "Hành trình",
    "Bên nhau",
    "Suy nghĩ",
    "Yêu sâu",
    "Về lại",
    "Đường về",
    "Lời nhắn"
  ];

  const handleJourneyComplete = () => {
    setJourneyComplete(true);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const navigateToSection = (index) => {
    sectionRefs[index].current.scrollIntoView({
      behavior: 'smooth'
    });
    setCurrentSection(index);
  };

  // Thêm sự kiện bấm phím Escape để quay về trang chủ
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Monitor scroll to update current section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const viewportHeight = window.innerHeight;

      sectionRefs.forEach((ref, index) => {
        if (!ref.current) return;

        const { offsetTop, offsetHeight } = ref.current;
        const sectionTop = offsetTop;
        const sectionBottom = offsetTop + offsetHeight;

        // Check if the section is in view
        if (
          currentScrollPos >= sectionTop - viewportHeight / 3 &&
          currentScrollPos < sectionBottom - viewportHeight / 3
        ) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSectionWithRef = (Section, index, props = {}) => (
    <div ref={sectionRefs[index]} key={index}>
      <Section progress={smoothProgress} {...props} />
    </div>
  );

  return (
    <div className="journey-container bg-gradient-to-br from-[#f8fafc] via-[#f0f7ff] to-[#eef2ff]">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-[#1a1033] z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Section navigation */}
      <JourneyProgress
        progress={smoothProgress}
        sections={sections}
        currentSection={currentSection}
        onNavigate={navigateToSection}
      />

      {/* Navigation toggle button - only visible on desktop and when journey is complete */}
      {journeyComplete && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 hidden md:flex"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <button
            onClick={handleHomeClick}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm text-[#1a1033] opacity-80 hover:opacity-100 border border-[#1a1033] border-opacity-10"
          >
            <Home size={20} />
          </button>
        </motion.div>
      )}

      {/* Journey sections */}
      {renderSectionWithRef(IntroSection, 0)}
      {renderSectionWithRef(SunSection, 1)}
      {renderSectionWithRef(MoonSection, 2)}
      {renderSectionWithRef(EmotionsSection, 3)}
      {renderSectionWithRef(MercurySection, 4)}
      {renderSectionWithRef(VenusSection, 5)}
      {renderSectionWithRef(LifePathSection, 6)}
      {renderSectionWithRef(
        // Sử dụng một function để render ConclusionSection để tránh vòng lặp vô hạn
        props => <ConclusionSection {...props} />,
        7,
        { onJourneyComplete: handleJourneyComplete }
      )}
    </div>
  );
};

export default JourneyPage; 