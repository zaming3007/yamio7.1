import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Lightbulb,
  Send,
  User,
  Calendar,
  Star,
  Plus,
  Filter,
  Search,
  Trash2
} from 'lucide-react';
import AnimatedRoute from '../components/common/AnimatedRoute';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { designSystem, getPersonTheme } from '../styles/designSystem';
import { getFeedbacks, createFeedback, likeFeedback, deleteFeedback } from '../services/supabaseApi';

const FeedbackPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('couple'); // 'couple' or 'system'
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    type: 'couple',
    category: 'general',
    title: '',
    content: '',
    author: 'giaminh', // or 'baongoc'
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const persons = [
    { id: 'giaminh', ...getPersonTheme('giaminh') },
    { id: 'baongoc', ...getPersonTheme('baongoc') }
  ];

  const categories = {
    couple: [
      { id: 'general', label: 'Chung', icon: '💬' },
      { id: 'relationship', label: 'Tình cảm', icon: '💕' },
      { id: 'activities', label: 'Hoạt động', icon: '🎯' },
      { id: 'communication', label: 'Giao tiếp', icon: '📞' }
    ],
    system: [
      { id: 'feature', label: 'Tính năng mới', icon: '✨' },
      { id: 'improvement', label: 'Cải thiện', icon: '🔧' },
      { id: 'bug', label: 'Lỗi', icon: '🐛' },
      { id: 'ui', label: 'Giao diện', icon: '🎨' }
    ]
  };

  const priorities = [
    { id: 'low', label: 'Thấp', color: 'green' },
    { id: 'medium', label: 'Trung bình', color: 'yellow' },
    { id: 'high', label: 'Cao', color: 'red' }
  ];

  // Load feedbacks from database
  useEffect(() => {
    loadFeedbacks();
  }, [activeTab]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getFeedbacks({ type: activeTab });
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      toast.error('Không thể tải feedbacks', {
        title: 'Lỗi kết nối'
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove saveFeedbacks function - using API now

  // Submit new feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.title.trim() || !newFeedback.content.trim()) return;

    try {
      setLoading(true);

      await createFeedback({
        type: activeTab,
        category: newFeedback.category,
        title: newFeedback.title,
        content: newFeedback.content,
        author: newFeedback.author,
        priority: newFeedback.priority
      });

      // Show success toast
      toast.success(
        activeTab === 'couple' ? 'Góp ý đã được gửi thành công!' : 'Đề xuất đã được gửi thành công!',
        { title: 'Thành công' }
      );

      // Reset form but keep current author
      setNewFeedback(prev => ({
        type: activeTab,
        category: 'general',
        title: '',
        content: '',
        author: prev.author, // Keep current selected author
        priority: 'medium'
      }));

      // Reload feedbacks
      await loadFeedbacks();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Không thể gửi feedback', {
        title: 'Lỗi gửi'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesTab = feedback.type === activeTab;
    const matchesFilter = filter === 'all' || feedback.category === filter;
    const matchesSearch = feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesFilter && matchesSearch;
  });

  // Like feedback
  const handleLike = async (feedbackId) => {
    try {
      await likeFeedback(feedbackId);

      // Update local state
      setFeedbacks(prev => prev.map(feedback =>
        feedback.feedback_id === feedbackId
          ? { ...feedback, likes: feedback.likes + 1 }
          : feedback
      ));
    } catch (error) {
      console.error('Error liking feedback:', error);
      toast.error('Không thể like feedback');
    }
  };

  // Delete feedback
  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) return;

    try {
      await deleteFeedback(feedbackId);
      toast.success('Feedback đã được xóa');

      // Remove from local state
      setFeedbacks(prev => prev.filter(feedback => feedback.feedback_id !== feedbackId));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Không thể xóa feedback');
    }
  };

  const getPersonInfo = (authorId) => {
    return persons.find(p => p.id === authorId) || persons[0];
  };

  const getCategoryInfo = (type, categoryId) => {
    return categories[type]?.find(c => c.id === categoryId) || categories[type]?.[0];
  };

  const getPriorityInfo = (priorityId) => {
    return priorities.find(p => p.id === priorityId) || priorities[1];
  };

  return (
    <AnimatedRoute>
      <div className="container pt-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            💬 Feedback & Suggestions
          </h1>
          <p className="text-[#1a1033] opacity-80 max-w-2xl mx-auto text-lg">
            Nơi để chúng mình góp ý cho nhau và đề xuất cải thiện hệ thống ✨
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
            <motion.button
              onClick={() => setActiveTab('couple')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'couple'
                ? 'bg-gradient-to-r from-pink-300 to-blue-300 text-white shadow-lg'
                : 'text-[#1a1033] opacity-70 hover:opacity-100'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={18} className="inline mr-2" />
              Góp ý cho nhau
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('system')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'system'
                ? 'bg-gradient-to-r from-blue-300 to-purple-300 text-white shadow-lg'
                : 'text-[#1a1033] opacity-70 hover:opacity-100'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lightbulb size={18} className="inline mr-2" />
              Cải thiện hệ thống
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a1033] opacity-50" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-[#1a1033] focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">Tất cả danh mục</option>
            {categories[activeTab]?.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <GlassCard variant="heavy" shadow="xl" className="p-6 sticky top-8">
              <h3 className="text-xl font-bold text-[#1a1033] mb-6 flex items-center">
                <Plus size={20} className="mr-2" />
                {activeTab === 'couple' ? 'Góp ý mới' : 'Đề xuất mới'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Author Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1033] mb-2">Người gửi</label>
                  <div className="flex space-x-2">
                    {persons.map(person => (
                      <motion.button
                        key={person.id}
                        type="button"
                        onClick={() => setNewFeedback(prev => ({ ...prev, author: person.id }))}
                        className={`flex-1 px-3 py-2 rounded-lg border transition-all ${newFeedback.author === person.id
                          ? 'bg-gradient-to-r from-blue-200/20 to-pink-200/20 border-blue-300'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-lg">{person.emoji}</span>
                        <div className="text-xs text-[#1a1033] font-medium">{person.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1033] mb-2">Danh mục</label>
                  <select
                    value={newFeedback.category}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-[#1a1033] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {categories[activeTab]?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority (for system feedback) */}
                {activeTab === 'system' && (
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] mb-2">Độ ưu tiên</label>
                    <div className="flex space-x-2">
                      {priorities.map(priority => (
                        <motion.button
                          key={priority.id}
                          type="button"
                          onClick={() => setNewFeedback(prev => ({ ...prev, priority: priority.id }))}
                          className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${newFeedback.priority === priority.id
                            ? `bg-${priority.color}-200/20 border-${priority.color}-300 text-${priority.color}-700`
                            : 'bg-white/10 border-white/20 text-[#1a1033] hover:bg-white/20'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {priority.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1033] mb-2">Tiêu đề</label>
                  <input
                    type="text"
                    value={newFeedback.title}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={activeTab === 'couple' ? 'Góp ý về...' : 'Đề xuất tính năng...'}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-[#1a1033] mb-2">Nội dung</label>
                  <textarea
                    value={newFeedback.content}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={activeTab === 'couple' ? 'Chia sẻ suy nghĩ của bạn...' : 'Mô tả chi tiết đề xuất...'}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  personTheme="couple"
                  disabled={!newFeedback.title.trim() || !newFeedback.content.trim()}
                  loading={loading}
                  className="w-full"
                >
                  <Send size={16} />
                  Gửi {activeTab === 'couple' ? 'góp ý' : 'đề xuất'}
                </Button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Feedback List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {filteredFeedbacks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="mx-auto text-[#1a1033] opacity-30 mb-4" size={48} />
                  <p className="text-[#1a1033] opacity-60 text-lg">
                    {searchQuery || filter !== 'all'
                      ? 'Không tìm thấy feedback nào phù hợp'
                      : `Chưa có ${activeTab === 'couple' ? 'góp ý' : 'đề xuất'} nào`
                    }
                  </p>
                  <p className="text-[#1a1033] opacity-40 text-sm mt-2">
                    Hãy là người đầu tiên chia sẻ suy nghĩ! 💭
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredFeedbacks.map((feedback, index) => {
                    const author = getPersonInfo(feedback.author);
                    const category = getCategoryInfo(feedback.type, feedback.category);
                    const priority = getPriorityInfo(feedback.priority);

                    return (
                      <GlassCard
                        key={feedback.id}
                        variant="medium"
                        shadow="lg"
                        className="p-6"
                        motionProps={{
                          initial: { opacity: 0, y: 20 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -20 },
                          transition: { delay: index * 0.1 }
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${author.color === 'blue'
                              ? 'from-blue-200 to-blue-300'
                              : 'from-pink-200 to-pink-300'
                              } flex items-center justify-center`}>
                              <span className="text-lg">{author.emoji}</span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-[#1a1033]">{author.name}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-[#1a1033] opacity-70">
                                  {category?.icon} {category?.label}
                                </span>
                                {feedback.type === 'system' && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${priority.color === 'red' ? 'bg-red-200/30 text-red-700' :
                                    priority.color === 'yellow' ? 'bg-yellow-200/30 text-yellow-700' :
                                      'bg-green-200/30 text-green-700'
                                    }`}>
                                    {priority.label}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-[#1a1033] opacity-60 mt-1">
                                <Calendar size={12} />
                                <span>{new Date(feedback.created_at).toLocaleDateString('vi-VN')}</span>
                                <span>{new Date(feedback.created_at).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {/* Like Button */}
                            <motion.button
                              onClick={() => handleLike(feedback.feedback_id)}
                              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Heart
                                size={14}
                                className={`${feedback.likes > 0 ? 'text-red-500 fill-current' : 'text-[#1a1033] opacity-60'}`}
                              />
                              <span className="text-xs text-[#1a1033] font-medium">{feedback.likes}</span>
                            </motion.button>

                            {/* Delete Button */}
                            <motion.button
                              onClick={() => handleDelete(feedback.feedback_id)}
                              className="p-2 rounded-full bg-red-100/20 hover:bg-red-200/30 transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Xóa feedback"
                            >
                              <Trash2
                                size={14}
                                className="text-red-500 hover:text-red-600"
                              />
                            </motion.button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-[#1a1033] mb-2 text-lg">{feedback.title}</h4>
                          <p className="text-[#1a1033] opacity-80 leading-relaxed">{feedback.content}</p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${feedback.status === 'open' ? 'bg-blue-200/30 text-blue-700' :
                            feedback.status === 'in-progress' ? 'bg-yellow-200/30 text-yellow-700' :
                              'bg-green-200/30 text-green-700'
                            }`}>
                            {feedback.status === 'open' ? '📝 Mở' :
                              feedback.status === 'in-progress' ? '⏳ Đang xử lý' :
                                '✅ Hoàn thành'}
                          </span>

                          {feedback.replies?.length > 0 && (
                            <span className="text-xs text-[#1a1033] opacity-60">
                              💬 {feedback.replies.length} phản hồi
                            </span>
                          )}
                        </div>
                      </GlassCard>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedRoute>
  );
};

export default FeedbackPage;
