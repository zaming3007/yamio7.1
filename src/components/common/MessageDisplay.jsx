import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, User, Clock, Trash2, MoreHorizontal } from 'lucide-react';
import { messageService } from '../../lib/supabase';

const MessageDisplay = ({ journeySection = 'moon-section', adminView = false, onRefresh }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessages, setShowMessages] = useState(true); // Hiển thị mặc định
  const [deletingMessage, setDeletingMessage] = useState(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Subscribe to real-time updates
    const subscription = messageService.subscribeToMessages((payload) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new;

        // Only show messages for current section (unless admin view)
        if (adminView || newMessage.journey_section === journeySection) {
          setMessages(prev => [newMessage, ...prev]);
        }
      } else if (payload.eventType === 'DELETE') {
        // Remove deleted message from state
        setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
      }
    });

    return () => {
      messageService.unsubscribeFromMessages(subscription);
    };
  }, [journeySection, adminView]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages();

      // Filter messages by section (unless admin view)
      const filteredMessages = adminView
        ? data
        : data.filter(msg => msg.journey_section === journeySection);

      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function to parent
  useEffect(() => {
    if (onRefresh) {
      onRefresh(loadMessages);
    }
  }, [onRefresh]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Vừa xong' : `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  const handleDeleteMessage = async (messageId) => {
    if (deletingMessage) return; // Prevent multiple deletes

    // Confirmation dialog
    if (!window.confirm('Bạn có chắc muốn xóa tin nhắn này không?')) {
      return;
    }

    setDeletingMessage(messageId);
    try {
      // Optimistically remove from UI first
      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      // Then delete from database
      await messageService.deleteMessage(messageId);

      // Real-time subscription should handle this, but we've already updated UI
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Không thể xóa tin nhắn. Vui lòng thử lại!');

      // If delete failed, reload messages to restore UI state
      loadMessages();
    } finally {
      setDeletingMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-6 h-6 border-2 border-[#1A1033] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      {/* Toggle Button */}
      {!adminView && (
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={toggleMessages}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white bg-opacity-15 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={16} className="text-[#1A1033]" />
            <span className="text-sm text-[#1A1033] font-medium">
              {showMessages ? 'Thu gọn tin nhắn' : `Xem tin nhắn (${messages.length})`}
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Messages List */}
      <AnimatePresence>
        {(showMessages || adminView) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20 p-4 shadow-lg max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="mx-auto text-[#1A1033] opacity-50 mb-2" size={24} />
                  <p className="text-[#1A1033] opacity-70 text-sm">
                    Chưa có tin nhắn nào. Hãy là người đầu tiên!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                        className="bg-white bg-opacity-20 rounded-xl p-4 border border-white border-opacity-10"
                      >
                        {/* Message Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User size={14} className="text-[#1A1033] opacity-60" />
                            <span className="text-sm font-medium text-[#1A1033] opacity-80">
                              {message.sender_info?.name || 'Ẩn danh'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Clock size={12} className="text-[#1A1033] opacity-50" />
                              <span className="text-xs text-[#1A1033] opacity-60">
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                            {/* Delete Button */}
                            <motion.button
                              onClick={() => handleDeleteMessage(message.id)}
                              disabled={deletingMessage === message.id}
                              className="p-1 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition-all group"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {deletingMessage === message.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-3 h-3 border border-red-500 border-t-transparent rounded-full"
                                />
                              ) : (
                                <Trash2
                                  size={12}
                                  className="text-[#1A1033] opacity-40 group-hover:text-red-500 group-hover:opacity-80 transition-all"
                                />
                              )}
                            </motion.button>
                          </div>
                        </div>

                        {/* Message Content */}
                        <p className="text-[#1A1033] text-sm leading-relaxed">
                          {message.content}
                        </p>

                        {/* Admin Info */}
                        {adminView && (
                          <div className="mt-2 pt-2 border-t border-white border-opacity-10">
                            <span className="text-xs text-[#1A1033] opacity-50">
                              Section: {message.journey_section}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageDisplay;
