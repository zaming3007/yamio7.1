import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dspwontafqokgeoyzoet.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcHdvbnRhZnFva2dlb3l6b2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDM2MzQsImV4cCI6MjA2ODMxOTYzNH0.-W5Sg3ARNKdDhSv1UeHYl5vVLSG2kvr6UBrd-sl1hcM'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for messages
export const messageService = {
  // Lấy tất cả tin nhắn
  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Thêm tin nhắn mới
  async addMessage(content, senderInfo = null, journeySection = null) {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          content,
          sender_info: senderInfo,
          journey_section: journeySection,
          created_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Subscribe to real-time changes
  subscribeToMessages(callback) {
    return supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        callback
      )
      .subscribe()
  },

  // Unsubscribe from real-time changes
  unsubscribeFromMessages(subscription) {
    supabase.removeChannel(subscription)
  }
}
