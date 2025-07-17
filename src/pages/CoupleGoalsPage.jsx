import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Star, Calendar, Heart, Edit, Trash2, Save, X } from 'lucide-react';
import AnimatedRoute from '../components/common/AnimatedRoute';
import { messageService } from '../lib/supabase';

const CoupleGoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'relationship',
    priority: 'medium',
    targetDate: '',
    completed: false
  });

  const categories = [
    { id: 'relationship', name: 'Tình cảm', emoji: '💕', color: 'rose' },
    { id: 'travel', name: 'Du lịch', emoji: '✈️', color: 'blue' },
    { id: 'health', name: 'Sức khỏe', emoji: '🏃‍♀️', color: 'green' },
    { id: 'finance', name: 'Tài chính', emoji: '💰', color: 'yellow' },
    { id: 'personal', name: 'Cá nhân', emoji: '🌟', color: 'purple' },
    { id: 'family', name: 'Gia đình', emoji: '👨‍👩‍👧‍👦', color: 'orange' }
  ];

  const priorities = [
    { id: 'low', name: 'Thấp', color: 'gray' },
    { id: 'medium', name: 'Trung bình', color: 'blue' },
    { id: 'high', name: 'Cao', color: 'red' }
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await messageService.getMessages();
      const goalData = data
        .filter(msg => msg.journey_section === 'couple-goals')
        .map(msg => ({
          id: msg.id,
          ...JSON.parse(msg.content),
          created_at: msg.created_at
        }));
      setGoals(goalData);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGoal = async () => {
    if (!newGoal.title.trim()) return;

    try {
      const goalData = {
        ...newGoal,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      await messageService.addMessage(
        JSON.stringify(goalData),
        { name: 'Goals System', timestamp: new Date().toISOString() },
        'couple-goals'
      );

      setGoals(prev => [goalData, ...prev]);
      setNewGoal({ title: '', description: '', category: 'relationship', priority: 'medium', targetDate: '', completed: false });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const toggleGoalCompletion = async (goalId) => {
    try {
      const goalToUpdate = goals.find(g => g.id === goalId);
      if (!goalToUpdate) return;

      const updatedGoal = { ...goalToUpdate, completed: !goalToUpdate.completed };
      
      // Find and update the message
      const allMessages = await messageService.getMessages();
      const messageToUpdate = allMessages.find(msg => {
        if (msg.journey_section === 'couple-goals') {
          try {
            const goalData = JSON.parse(msg.content);
            return goalData.id === goalId;
          } catch {
            return false;
          }
        }
        return false;
      });

      if (messageToUpdate) {
        // Delete old message and create new one (since we can't update)
        await messageService.deleteMessage(messageToUpdate.id);
        await messageService.addMessage(
          JSON.stringify(updatedGoal),
          { name: 'Goals System', timestamp: new Date().toISOString() },
          'couple-goals'
        );

        setGoals(prev => prev.map(goal => 
          goal.id === goalId ? updatedGoal : goal
        ));
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục tiêu này không?')) return;

    try {
      const allMessages = await messageService.getMessages();
      const messageToDelete = allMessages.find(msg => {
        if (msg.journey_section === 'couple-goals') {
          try {
            const goalData = JSON.parse(msg.content);
            return goalData.id === goalId;
          } catch {
            return false;
          }
        }
        return false;
      });

      if (messageToDelete) {
        await messageService.deleteMessage(messageToDelete.id);
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getPriorityInfo = (priorityId) => {
    return priorities.find(pri => pri.id === priorityId) || priorities[1];
  };

  const completedGoals = goals.filter(goal => goal.completed);
  const pendingGoals = goals.filter(goal => !goal.completed);

  if (loading) {
    return (
      <AnimatedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#1A1033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1A1033] opacity-70">Đang tải mục tiêu...</p>
          </div>
        </div>
      </AnimatedRoute>
    );
  }

  return (
    <AnimatedRoute>
      <div className="container pt-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-3 text-gradient flex items-center justify-center">
            <Target className="mr-3 text-blue-500" size={32} />
            Couple Goals
            <Target className="ml-3 text-blue-500" size={32} />
          </h1>
          <p className="text-[#1a1033] opacity-70 max-w-lg mx-auto">
            Những mục tiêu chung của chúng mình để cùng nhau phấn đấu 🎯
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glassmorphism-card p-4 text-center">
            <div className="text-2xl font-bold text-[#1a1033]">{goals.length}</div>
            <div className="text-sm text-[#1a1033] opacity-70">Tổng mục tiêu</div>
          </div>
          <div className="glassmorphism-card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <div className="text-sm text-[#1a1033] opacity-70">Đã hoàn thành</div>
          </div>
          <div className="glassmorphism-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingGoals.length}</div>
            <div className="text-sm text-[#1a1033] opacity-70">Đang thực hiện</div>
          </div>
          <div className="glassmorphism-card p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
            </div>
            <div className="text-sm text-[#1a1033] opacity-70">Tiến độ</div>
          </div>
        </motion.div>

        {/* Add Goal Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Thêm mục tiêu mới</span>
          </motion.button>
        </motion.div>

        {/* Goals List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Pending Goals */}
          {pendingGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1a1033] mb-4 flex items-center">
                <Star className="mr-2 text-yellow-500" size={20} />
                Đang thực hiện ({pendingGoals.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingGoals.map((goal, index) => {
                  const category = getCategoryInfo(goal.category);
                  const priority = getPriorityInfo(goal.priority);
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glassmorphism-card p-6 group hover:shadow-lg transition-all"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{category.emoji}</span>
                          <span className={`text-xs px-2 py-1 rounded-full bg-${priority.color}-100 text-${priority.color}-600`}>
                            {priority.name}
                          </span>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className="p-1 rounded-full hover:bg-green-500 hover:bg-opacity-20 transition-all"
                          >
                            <Check size={14} className="text-green-500" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition-all"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#1a1033] mb-2">
                        {goal.title}
                      </h3>

                      {goal.description && (
                        <p className="text-[#1a1033] opacity-80 text-sm mb-3 leading-relaxed">
                          {goal.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full bg-${category.color}-100 text-${category.color}-600`}>
                          {category.name}
                        </span>
                        {goal.targetDate && (
                          <div className="flex items-center space-x-1 text-[#1a1033] opacity-60">
                            <Calendar size={12} />
                            <span>{new Date(goal.targetDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1a1033] mb-4 flex items-center">
                <Check className="mr-2 text-green-500" size={20} />
                Đã hoàn thành ({completedGoals.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal, index) => {
                  const category = getCategoryInfo(goal.category);
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glassmorphism-card p-6 opacity-75 group hover:opacity-100 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{category.emoji}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                            Hoàn thành
                          </span>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className="p-1 rounded-full hover:bg-yellow-500 hover:bg-opacity-20 transition-all"
                          >
                            <X size={14} className="text-yellow-500" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition-all"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#1a1033] mb-2 line-through">
                        {goal.title}
                      </h3>

                      {goal.description && (
                        <p className="text-[#1a1033] opacity-60 text-sm mb-3 leading-relaxed">
                          {goal.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full bg-${category.color}-100 text-${category.color}-600`}>
                          {category.name}
                        </span>
                        <div className="flex items-center space-x-1 text-green-600">
                          <Heart size={12} />
                          <span>Đã đạt được!</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {goals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Target className="mx-auto text-[#1a1033] opacity-30 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-[#1a1033] opacity-70 mb-2">
              Chưa có mục tiêu nào
            </h3>
            <p className="text-[#1a1033] opacity-50">
              Hãy đặt mục tiêu đầu tiên cho chúng mình!
            </p>
          </motion.div>
        )}

        {/* Add Goal Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glassmorphism-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#1a1033] mb-4 text-center">
                  Thêm mục tiêu mới
                </h3>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Tên mục tiêu..."
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Chi tiết về mục tiêu..."
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Độ ưu tiên
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                    >
                      {priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                          {priority.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Date */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Ngày mục tiêu
                    </label>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-3 px-4 rounded-xl bg-white bg-opacity-20 text-[#1a1033] font-medium hover:bg-opacity-30 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      onClick={saveGoal}
                      disabled={!newGoal.title.trim()}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={16} />
                      <span>Lưu</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedRoute>
  );
};

export default CoupleGoalsPage;
