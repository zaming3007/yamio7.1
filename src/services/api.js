// API Service for Mio Couple Website
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload request
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`File upload failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Memory Wall API methods
  async getMemoryPhotos() {
    return this.get('/memory-photos');
  }

  async uploadMemoryPhoto(photoData) {
    const formData = new FormData();
    formData.append('image', photoData.file);
    formData.append('title', photoData.title);
    formData.append('description', photoData.description || '');
    formData.append('uploaded_by', photoData.uploaded_by);
    formData.append('tags', JSON.stringify(photoData.tags || []));
    formData.append('location', photoData.location || '');

    return this.uploadFile('/memory-photos', formData);
  }

  async deleteMemoryPhoto(photoId) {
    return this.delete(`/memory-photos/${photoId}`);
  }

  async togglePhotoFavorite(photoId) {
    return this.put(`/memory-photos/${photoId}/favorite`);
  }

  // Feedback API methods
  async getFeedbacks(filters = {}) {
    return this.get('/feedbacks', filters);
  }

  async createFeedback(feedbackData) {
    return this.post('/feedbacks', feedbackData);
  }

  async likeFeedback(feedbackId) {
    return this.put(`/feedbacks/${feedbackId}/like`);
  }

  async deleteFeedback(feedbackId) {
    return this.delete(`/feedbacks/${feedbackId}`);
  }

  async updateFeedbackStatus(feedbackId, status) {
    return this.put(`/feedbacks/${feedbackId}/status`, { status });
  }

  // Couple Goals API methods
  async getCoupleGoals() {
    return this.get('/couple-goals');
  }

  async createCoupleGoal(goalData) {
    return this.post('/couple-goals', goalData);
  }

  async updateCoupleGoal(goalId, updates) {
    return this.put(`/couple-goals/${goalId}`, updates);
  }

  async deleteCoupleGoal(goalId) {
    return this.delete(`/couple-goals/${goalId}`);
  }

  async updateGoalProgress(goalId, progress) {
    return this.put(`/couple-goals/${goalId}/progress`, { progress });
  }

  // Love Messages API methods
  async getLoveMessages(userId) {
    return this.get('/love-messages', { user_id: userId });
  }

  async sendLoveMessage(messageData) {
    return this.post('/love-messages', messageData);
  }

  async markMessageAsRead(messageId) {
    return this.put(`/love-messages/${messageId}/read`);
  }

  async deleteMessage(messageId) {
    return this.delete(`/love-messages/${messageId}`);
  }

  // Weather Preferences API methods
  async getWeatherPreferences(userId) {
    return this.get(`/weather-preferences/${userId}`);
  }

  async updateWeatherPreferences(userId, preferences) {
    return this.put(`/weather-preferences/${userId}`, preferences);
  }

  // Activity Logs API methods
  async getActivityLogs(userId, limit = 50) {
    return this.get('/activity-logs', { user_id: userId, limit });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export individual methods for convenience
export const {
  // Memory Wall
  getMemoryPhotos,
  uploadMemoryPhoto,
  deleteMemoryPhoto,
  togglePhotoFavorite,
  
  // Feedback
  getFeedbacks,
  createFeedback,
  likeFeedback,
  deleteFeedback,
  updateFeedbackStatus,
  
  // Couple Goals
  getCoupleGoals,
  createCoupleGoal,
  updateCoupleGoal,
  deleteCoupleGoal,
  updateGoalProgress,
  
  // Love Messages
  getLoveMessages,
  sendLoveMessage,
  markMessageAsRead,
  deleteMessage,
  
  // Weather Preferences
  getWeatherPreferences,
  updateWeatherPreferences,
  
  // Activity Logs
  getActivityLogs,
  
  // Health
  healthCheck
} = apiService;

export default apiService;
