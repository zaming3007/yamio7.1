import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, MessageCircle, Check, X, Smile } from 'lucide-react';
import { messageService } from '../../lib/supabase';

const MessageForm = ({ journeySection = 'moon-section', onFormStateChange, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [charCount, setCharCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const maxChars = 500;

  const emojis = ['❤️', '😍', '🥰', '😘', '💕', '💖', '💗', '💝', '💞', '💓', '🌹', '🌸', '🌺', '🦋', '✨', '💫', '⭐', '🌟', '💎', '🎀', '🎈', '🎉', '🎊', '🥳', '😊', '😄', '😁', '🤗', '🤭', '😌', '🙈', '🙉', '🙊'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const newMessage = await messageService.addMessage(
        message.trim(),
        { name: senderName.trim() || 'Ẩn danh', timestamp: new Date().toISOString() },
        journeySection
      );

      setSubmitStatus('success');
      setMessage('');
      setSenderName('');
      setCharCount(0);
      setShowEmojiPicker(false);

      // Notify parent component about new message
      if (onMessageSent) {
        onMessageSent(newMessage);
      }

      // Auto hide form after success
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus(null);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const addEmoji = (emoji) => {
    const newMessage = message + emoji;
    if (newMessage.length <= maxChars) {
      setMessage(newMessage);
      setCharCount(newMessage.length);
    }
    setShowEmojiPicker(false);
  };

  const toggleForm = () => {
    const newShowForm = !showForm;
    setShowForm(newShowForm);
    setSubmitStatus(null);

    // Notify parent component about form state change
    if (onFormStateChange) {
      onFormStateChange(newShowForm);
    }
  };

  // Notify parent when form closes after successful submission
  useEffect(() => {
    if (submitStatus === 'success' && onFormStateChange) {
      setTimeout(() => {
        onFormStateChange(false);
      }, 2000);
    }
  }, [submitStatus, onFormStateChange]);

  return (
    <div className="mt-8 w-full">
      {/* Toggle Button */}
      <motion.div
        className="flex justify-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={toggleForm}
          className="flex items-center space-x-2 px-6 py-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={18} className="text-[#1A1033]" />
          <span className="text-[#1A1033] font-medium">
            {showForm ? 'Đóng tin nhắn' : 'Gửi lời nhắn'}
          </span>
        </motion.button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 p-6 shadow-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <Heart className="mx-auto text-rose-500 mb-2" size={24} />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-[#1A1033] mb-1">
                    Gửi lời nhắn
                  </h3>
                  <p className="text-sm text-[#1A1033] opacity-70">
                    Chia sẻ cảm xúc của bạn về box suy nghĩ này
                  </p>
                </div>

                {/* Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1A1033] opacity-80">
                    Tên của bạn (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Nhập tên hoặc để trống để ẩn danh"
                    className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1A1033] placeholder-[#1A1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1A1033] focus:ring-opacity-30 focus:border-opacity-50 transition-all"
                    maxLength={50}
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-[#1A1033] opacity-80">
                      Lời nhắn *
                    </label>
                    <span className={`text-xs ${charCount > maxChars * 0.8 ? 'text-rose-500' : 'text-[#1A1033] opacity-50'}`}>
                      {charCount}/{maxChars}
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={handleMessageChange}
                      placeholder="Chia sẻ cảm xúc, suy nghĩ của bạn về box suy nghĩ này..."
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1A1033] placeholder-[#1A1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1A1033] focus:ring-opacity-30 focus:border-opacity-50 transition-all resize-none"
                      rows={4}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-3 text-[#1A1033] opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Smile size={20} />
                    </button>
                  </div>

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-3 border border-white border-opacity-40 max-h-32 overflow-y-auto shadow-lg"
                      >
                        <div className="grid grid-cols-8 gap-1">
                          {emojis.map((emoji, index) => (
                            <motion.button
                              key={index}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="text-lg hover:bg-white hover:bg-opacity-50 rounded p-1 transition-all"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#1A1033] bg-opacity-80 text-white font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Gửi lời nhắn</span>
                    </>
                  )}
                </motion.button>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-xl ${submitStatus === 'success'
                        ? 'bg-green-500 bg-opacity-20 text-green-700'
                        : 'bg-red-500 bg-opacity-20 text-red-700'
                        }`}
                    >
                      {submitStatus === 'success' ? (
                        <>
                          <Check size={16} />
                          <span className="text-sm font-medium">Gửi thành công! Cảm ơn bạn ❤️</span>
                        </>
                      ) : (
                        <>
                          <X size={16} />
                          <span className="text-sm font-medium">Có lỗi xảy ra. Vui lòng thử lại!</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageForm;
