import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Trash2, RefreshCw, Download, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import MessageDisplay from '../components/common/MessageDisplay';
import { messageService } from '../lib/supabase';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'moon-section', etc.
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0
  });

  useEffect(() => {
    loadMessages();
    
    // Subscribe to real-time updates
    const subscription = messageService.subscribeToMessages((payload) => {
      const newMessage = payload.new;
      setMessages(prev => [newMessage, ...prev]);
      updateStats([newMessage, ...messages]);
    });

    return () => {
      messageService.unsubscribeFromMessages(subscription);
    };
  }, []);

  useEffect(() => {
    updateStats(messages);
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (messageList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = messageList.filter(msg => 
      new Date(msg.created_at) >= today
    ).length;

    const weekCount = messageList.filter(msg => 
      new Date(msg.created_at) >= weekAgo
    ).length;

    setStats({
      total: messageList.length,
      today: todayCount,
      thisWeek: weekCount
    });
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(msg => msg.journey_section === filter);

  const exportMessages = () => {
    const csvContent = [
      ['Thời gian', 'Tên', 'Tin nhắn', 'Section'],
      ...filteredMessages.map(msg => [
        new Date(msg.created_at).toLocaleString('vi-VN'),
        msg.sender_info?.name || 'Ẩn danh',
        msg.content.replace(/"/g, '""'), // Escape quotes for CSV
        msg.journey_section || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `messages_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getSectionName = (section) => {
    const sectionNames = {
      'moon-section': 'Khi Ở Bên Nhau',
      'sun-section': 'Hành Trình Về Với Chính Mình',
      'mercury-section': 'Em Yêu Sâu',
      'venus-section': 'Hành Trình Về Lại',
      'emotions-section': 'Em Nghĩ Nhiều',
      'lifepath-section': 'Đường Về'
    };
    return sectionNames[section] || section;
  };

  const uniqueSections = [...new Set(messages.map(msg => msg.journey_section))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f0f7ff] to-[#eef2ff] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-[#1A1033] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f0f7ff] to-[#eef2ff]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-[#1A1033] hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={20} />
              <span>Quay lại</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#1A1033] flex items-center space-x-2">
                <MessageCircle size={32} />
                <span>Quản lý tin nhắn</span>
              </h1>
              <p className="text-[#1A1033] opacity-70 mt-1">
                Xem và quản lý tất cả tin nhắn từ người đọc
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadMessages}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all"
            >
              <RefreshCw size={16} />
              <span>Làm mới</span>
            </button>
            <button
              onClick={exportMessages}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1A1033] bg-opacity-80 text-white hover:bg-opacity-90 transition-all"
            >
              <Download size={16} />
              <span>Xuất CSV</span>
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <h3 className="text-lg font-semibold text-[#1A1033] mb-2">Tổng tin nhắn</h3>
            <p className="text-3xl font-bold text-[#1A1033]">{stats.total}</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <h3 className="text-lg font-semibold text-[#1A1033] mb-2">Hôm nay</h3>
            <p className="text-3xl font-bold text-[#1A1033]">{stats.today}</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-30">
            <h3 className="text-lg font-semibold text-[#1A1033] mb-2">Tuần này</h3>
            <p className="text-3xl font-bold text-[#1A1033]">{stats.thisWeek}</p>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
            <Filter size={20} className="text-[#1A1033]" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-[#1A1033] font-medium focus:outline-none"
            >
              <option value="all">Tất cả sections ({messages.length})</option>
              {uniqueSections.map(section => (
                <option key={section} value={section}>
                  {getSectionName(section)} ({messages.filter(msg => msg.journey_section === section).length})
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MessageDisplay adminView={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMessagesPage;
