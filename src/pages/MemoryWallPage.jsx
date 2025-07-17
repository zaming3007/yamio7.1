import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, Calendar, MapPin, Camera, Edit, Trash2, Save, X } from 'lucide-react';
import AnimatedRoute from '../components/common/AnimatedRoute';
import { messageService } from '../lib/supabase';

const MemoryWallPage = () => {
  const [memories, setMemories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: null,
    mood: '😊'
  });

  const moods = ['😊', '🥰', '😍', '🤗', '😘', '💕', '🌟', '✨', '🎉', '🎈', '🌹', '🦋'];

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      setLoading(true);
      // Using messages table with a special journey_section for memories
      const data = await messageService.getMessages();
      const memoryData = data
        .filter(msg => msg.journey_section === 'memory-wall')
        .map(msg => ({
          id: msg.id,
          ...JSON.parse(msg.content),
          created_at: msg.created_at
        }));
      setMemories(memoryData);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMemory = async () => {
    if (!newMemory.title.trim()) return;

    try {
      const memoryData = {
        ...newMemory,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      await messageService.addMessage(
        JSON.stringify(memoryData),
        { name: 'Memory System', timestamp: new Date().toISOString() },
        'memory-wall'
      );

      setMemories(prev => [memoryData, ...prev]);
      setNewMemory({ title: '', description: '', date: '', location: '', image: null, mood: '😊' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  };

  const deleteMemory = async (memoryId) => {
    if (!window.confirm('Bạn có chắc muốn xóa kỷ niệm này không?')) return;

    try {
      // Find the message ID that contains this memory
      const allMessages = await messageService.getMessages();
      const messageToDelete = allMessages.find(msg => {
        if (msg.journey_section === 'memory-wall') {
          try {
            const memoryData = JSON.parse(msg.content);
            return memoryData.id === memoryId;
          } catch {
            return false;
          }
        }
        return false;
      });

      if (messageToDelete) {
        await messageService.deleteMessage(messageToDelete.id);
        setMemories(prev => prev.filter(memory => memory.id !== memoryId));
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const handleImageUpload = (event, isEditing = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isEditing) {
          setEditingMemory(prev => ({ ...prev, image: e.target.result }));
        } else {
          setNewMemory(prev => ({ ...prev, image: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <AnimatedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#1A1033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1A1033] opacity-70">Đang tải kỷ niệm...</p>
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
            <Heart className="mr-3 text-rose-500" size={32} />
            Memory Wall
            <Heart className="ml-3 text-rose-500" size={32} />
          </h1>
          <p className="text-[#1a1033] opacity-70 max-w-lg mx-auto">
            Nơi lưu giữ những khoảnh khắc đẹp nhất của chúng mình ✨
          </p>
        </motion.div>

        {/* Add Memory Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Thêm kỷ niệm mới</span>
          </motion.button>
        </motion.div>

        {/* Memories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphism-card p-6 group hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                {/* Memory Image */}
                {memory.image && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={memory.image} 
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Memory Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-[#1a1033] flex items-center">
                      <span className="mr-2 text-xl">{memory.mood}</span>
                      {memory.title}
                    </h3>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingMemory(memory)}
                        className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                      >
                        <Edit size={14} className="text-[#1a1033] opacity-60" />
                      </button>
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="p-1 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition-all"
                      >
                        <Trash2 size={14} className="text-red-500 opacity-60" />
                      </button>
                    </div>
                  </div>

                  {memory.description && (
                    <p className="text-[#1a1033] opacity-80 text-sm leading-relaxed">
                      {memory.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs">
                    {memory.date && (
                      <div className="flex items-center space-x-1 text-[#1a1033] opacity-60">
                        <Calendar size={12} />
                        <span>{new Date(memory.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {memory.location && (
                      <div className="flex items-center space-x-1 text-[#1a1033] opacity-60">
                        <MapPin size={12} />
                        <span>{memory.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {memories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Heart className="mx-auto text-[#1a1033] opacity-30 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-[#1a1033] opacity-70 mb-2">
              Chưa có kỷ niệm nào
            </h3>
            <p className="text-[#1a1033] opacity-50">
              Hãy thêm kỷ niệm đầu tiên của chúng mình!
            </p>
          </motion.div>
        )}

        {/* Add Memory Modal */}
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
                  Thêm kỷ niệm mới
                </h3>

                <div className="space-y-4">
                  {/* Mood Selector */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Tâm trạng
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {moods.map(mood => (
                        <button
                          key={mood}
                          onClick={() => setNewMemory(prev => ({ ...prev, mood }))}
                          className={`text-2xl p-2 rounded-lg transition-all ${
                            newMemory.mood === mood 
                              ? 'bg-white bg-opacity-30 scale-110' 
                              : 'hover:bg-white hover:bg-opacity-20'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      value={newMemory.title}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Tên kỷ niệm..."
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
                      value={newMemory.description}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Chia sẻ về kỷ niệm này..."
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30 resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Ngày
                    </label>
                    <input
                      type="date"
                      value={newMemory.date}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      value={newMemory.location}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Nơi diễn ra..."
                      className="w-full px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1033] opacity-80 mb-2">
                      Hình ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                      id="memory-image-upload"
                    />
                    <label
                      htmlFor="memory-image-upload"
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] cursor-pointer hover:bg-opacity-30 transition-all"
                    >
                      <Camera size={16} />
                      <span>Chọn ảnh</span>
                    </label>
                    {newMemory.image && (
                      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden">
                        <img src={newMemory.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
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
                      onClick={saveMemory}
                      disabled={!newMemory.title.trim()}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

export default MemoryWallPage;
