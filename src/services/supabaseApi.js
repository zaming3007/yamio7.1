// Supabase API Service for Mio Couple Website
import { supabase } from '../lib/supabase';

class SupabaseApiService {
  constructor() {
    this.supabase = supabase;
  }

  // Generate unique ID
  generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}_${random}`;
  }

  // Memory Wall API methods
  async getMemoryPhotos() {
    try {
      const { data, error } = await this.supabase
        .from('memory_photos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching memory photos:', error);
      throw error;
    }
  }

  async uploadMemoryPhoto(photoData) {
    try {
      // Upload image to Supabase Storage
      const fileExt = photoData.file.name.split('.').pop();
      const fileName = `${this.generateId('photo_')}.${fileExt}`;
      const filePath = `memory-photos/${fileName}`;

      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('memory-photos')
        .upload(filePath, photoData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('memory-photos')
        .getPublicUrl(filePath);

      // Save photo metadata to database
      const photoId = this.generateId('photo_');
      const { data, error } = await this.supabase
        .from('memory_photos')
        .insert([{
          photo_id: photoId,
          title: photoData.title,
          description: photoData.description,
          image_url: publicUrl,
          uploaded_by: photoData.uploaded_by,
          tags: photoData.tags || [],
          location: photoData.location
        }])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity(photoData.uploaded_by, 'upload_photo', 'photo', photoId, {
        title: photoData.title,
        filename: fileName
      });

      return { success: true, photoId, imageUrl: publicUrl };
    } catch (error) {
      console.error('Error uploading memory photo:', error);
      throw error;
    }
  }

  async deleteMemoryPhoto(photoId) {
    try {
      // Get photo info first
      const { data: photo, error: fetchError } = await this.supabase
        .from('memory_photos')
        .select('image_url')
        .eq('photo_id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // Extract file path from URL
      const url = new URL(photo.image_url);
      const filePath = url.pathname.split('/').slice(-2).join('/'); // Get last 2 parts

      // Delete file from storage
      const { error: deleteFileError } = await this.supabase.storage
        .from('memory-photos')
        .remove([filePath]);

      if (deleteFileError) console.warn('File deletion warning:', deleteFileError);

      // Delete from database
      const { error: deleteDbError } = await this.supabase
        .from('memory_photos')
        .delete()
        .eq('photo_id', photoId);

      if (deleteDbError) throw deleteDbError;

      return { success: true };
    } catch (error) {
      console.error('Error deleting memory photo:', error);
      throw error;
    }
  }

  // Feedback API methods
  async getFeedbacks(filters = {}) {
    try {
      let query = this.supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.author) {
        query = query.eq('author', filters.author);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
    }
  }

  async createFeedback(feedbackData) {
    try {
      const feedbackId = this.generateId('feedback_');

      const { data, error } = await this.supabase
        .from('feedbacks')
        .insert([{
          feedback_id: feedbackId,
          type: feedbackData.type,
          category: feedbackData.category,
          title: feedbackData.title,
          content: feedbackData.content,
          author: feedbackData.author,
          priority: feedbackData.priority || 'medium'
        }])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.logActivity(feedbackData.author, 'create_feedback', 'feedback', feedbackId, {
        type: feedbackData.type,
        category: feedbackData.category,
        title: feedbackData.title
      });

      return { success: true, feedbackId };
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  }

  async likeFeedback(feedbackId) {
    try {
      const { data, error } = await this.supabase
        .from('feedbacks')
        .update({ likes: this.supabase.sql`likes + 1` })
        .eq('feedback_id', feedbackId)
        .select()
        .single();

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error liking feedback:', error);
      throw error;
    }
  }

  async deleteFeedback(feedbackId) {
    try {
      const { error } = await this.supabase
        .from('feedbacks')
        .delete()
        .eq('feedback_id', feedbackId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }

  // Couple Goals API methods
  async getCoupleGoals() {
    try {
      const { data, error } = await this.supabase
        .from('couple_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching couple goals:', error);
      throw error;
    }
  }

  async createCoupleGoal(goalData) {
    try {
      const goalId = this.generateId('goal_');

      const { data, error } = await this.supabase
        .from('couple_goals')
        .insert([{
          goal_id: goalId,
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          priority: goalData.priority || 'medium',
          target_date: goalData.target_date,
          created_by: goalData.created_by,
          assigned_to: goalData.assigned_to,
          notes: goalData.notes
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, goalId };
    } catch (error) {
      console.error('Error creating couple goal:', error);
      throw error;
    }
  }

  // Activity logging
  async logActivity(userId, action, resourceType, resourceId, details) {
    try {
      const { error } = await this.supabase
        .from('activity_logs')
        .insert([{
          user_id: userId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details
        }]);

      if (error) console.warn('Activity log warning:', error);
    } catch (error) {
      console.warn('Activity logging failed:', error);
    }
  }

  // Weather preferences
  async getWeatherPreferences(userId) {
    try {
      const { data, error } = await this.supabase
        .from('weather_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found
      return data;
    } catch (error) {
      console.error('Error fetching weather preferences:', error);
      throw error;
    }
  }

  async updateWeatherPreferences(userId, preferences) {
    try {
      const { data, error } = await this.supabase
        .from('weather_preferences')
        .upsert([{
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating weather preferences:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) throw error;
      return { status: 'OK', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const supabaseApiService = new SupabaseApiService();

// Export individual methods for convenience
export const {
  getMemoryPhotos,
  uploadMemoryPhoto,
  deleteMemoryPhoto,
  getFeedbacks,
  createFeedback,
  likeFeedback,
  deleteFeedback,
  getCoupleGoals,
  createCoupleGoal,
  getWeatherPreferences,
  updateWeatherPreferences,
  healthCheck
} = supabaseApiService;

export default supabaseApiService;
