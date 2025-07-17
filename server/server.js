const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const database = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize database
database.connect().catch(console.error);

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Memory Wall API
app.get('/api/memory-photos', async (req, res) => {
  try {
    const photos = await database.query(`
      SELECT * FROM memory_photos 
      ORDER BY upload_date DESC
    `);
    
    // Parse tags JSON
    const processedPhotos = photos.map(photo => ({
      ...photo,
      tags: database.parseJSON(photo.tags, [])
    }));
    
    res.json(processedPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

app.post('/api/memory-photos', upload.single('image'), async (req, res) => {
  try {
    const { title, description, uploaded_by, tags, location } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const photoId = database.generateId('photo_');
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const result = await database.run(`
      INSERT INTO memory_photos (
        photo_id, title, description, image_url, uploaded_by, 
        tags, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      photoId, title, description, imageUrl, uploaded_by,
      database.stringifyJSON(JSON.parse(tags || '[]')), location
    ]);
    
    // Log activity
    await database.run(`
      INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
      VALUES (?, ?, ?, ?, ?)
    `, [
      uploaded_by, 'upload_photo', 'photo', photoId,
      database.stringifyJSON({ title, filename: req.file.filename })
    ]);
    
    res.json({ 
      success: true, 
      photoId,
      imageUrl,
      message: 'Photo uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

app.delete('/api/memory-photos/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    
    // Get photo info first
    const photo = await database.get(`
      SELECT * FROM memory_photos WHERE photo_id = ?
    `, [photoId]);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Delete file from filesystem
    const filePath = path.join(__dirname, photo.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await database.run(`
      DELETE FROM memory_photos WHERE photo_id = ?
    `, [photoId]);
    
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Feedback API
app.get('/api/feedbacks', async (req, res) => {
  try {
    const { type, category, author } = req.query;
    
    let sql = 'SELECT * FROM feedbacks WHERE 1=1';
    const params = [];
    
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    if (author) {
      sql += ' AND author = ?';
      params.push(author);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const feedbacks = await database.query(sql, params);
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { type, category, title, content, author, priority } = req.body;
    
    const feedbackId = database.generateId('feedback_');
    
    await database.run(`
      INSERT INTO feedbacks (
        feedback_id, type, category, title, content, author, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [feedbackId, type, category, title, content, author, priority || 'medium']);
    
    // Log activity
    await database.run(`
      INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
      VALUES (?, ?, ?, ?, ?)
    `, [
      author, 'create_feedback', 'feedback', feedbackId,
      database.stringifyJSON({ type, category, title })
    ]);
    
    res.json({ 
      success: true, 
      feedbackId,
      message: 'Feedback created successfully' 
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

app.put('/api/feedbacks/:feedbackId/like', async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    await database.run(`
      UPDATE feedbacks SET likes = likes + 1 WHERE feedback_id = ?
    `, [feedbackId]);
    
    res.json({ success: true, message: 'Feedback liked' });
  } catch (error) {
    console.error('Error liking feedback:', error);
    res.status(500).json({ error: 'Failed to like feedback' });
  }
});

app.delete('/api/feedbacks/:feedbackId', async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    await database.run(`
      DELETE FROM feedbacks WHERE feedback_id = ?
    `, [feedbackId]);
    
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Couple Goals API
app.get('/api/couple-goals', async (req, res) => {
  try {
    const goals = await database.query(`
      SELECT * FROM couple_goals ORDER BY created_at DESC
    `);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

app.post('/api/couple-goals', async (req, res) => {
  try {
    const { 
      title, description, category, priority, target_date, 
      created_by, assigned_to, notes 
    } = req.body;
    
    const goalId = database.generateId('goal_');
    
    await database.run(`
      INSERT INTO couple_goals (
        goal_id, title, description, category, priority, target_date,
        created_by, assigned_to, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      goalId, title, description, category, priority || 'medium',
      target_date, created_by, assigned_to, notes
    ]);
    
    res.json({ 
      success: true, 
      goalId,
      message: 'Goal created successfully' 
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mio Couple API Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await database.close();
  process.exit(0);
});
