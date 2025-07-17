# Mio Couple Website - Database Setup

## 🗄️ Database Integration

Hệ thống Mio-ver2.0 đã được tích hợp database SQLite để lưu trữ dữ liệu thực sự thay vì localStorage.

## 📋 Features Integrated with Database

### ✅ **Memory Wall (Tường Kỷ Niệm)**
- **Upload ảnh** - Lưu file và metadata vào database
- **Quản lý ảnh** - Title, description, tags, location
- **Delete ảnh** - Xóa cả file và database record
- **User tracking** - Theo dõi ai upload ảnh nào

### ✅ **Feedback & Suggestions**
- **Couple feedback** - Góp ý cho nhau
- **System feedback** - Đề xuất cải thiện hệ thống
- **Like system** - Đếm likes cho feedback
- **Delete feedback** - Xóa feedback không cần thiết

### 🔄 **Ready for Integration**
- **Couple Goals** - Mục tiêu chung của cặp đôi
- **Love Messages** - Tin nhắn tình yêu
- **Weather Preferences** - Cài đặt thời tiết
- **Activity Logs** - Theo dõi hoạt động

## 🚀 Quick Start

### 1. **Install Server Dependencies**
```bash
cd server
npm install
```

### 2. **Start API Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. **Start Frontend**
```bash
# In root directory
npm run dev
```

### 4. **Access Application**
- **Frontend:** http://localhost:5173
- **API Server:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 📊 Database Schema

### **Tables Created:**
- `users` - Thông tin người dùng (Gia Minh, Bảo Ngọc)
- `memory_photos` - Ảnh kỷ niệm
- `feedbacks` - Feedback và suggestions
- `feedback_replies` - Phản hồi feedback
- `couple_goals` - Mục tiêu cặp đôi
- `love_messages` - Tin nhắn tình yêu
- `weather_preferences` - Cài đặt thời tiết
- `activity_logs` - Nhật ký hoạt động

### **Key Features:**
- **Auto-incrementing IDs** - Primary keys
- **Unique identifiers** - Custom IDs cho frontend
- **Foreign key relationships** - Data integrity
- **Indexes** - Performance optimization
- **JSON support** - Flexible data storage

## 🔧 API Endpoints

### **Memory Wall**
```
GET    /api/memory-photos          # Lấy tất cả ảnh
POST   /api/memory-photos          # Upload ảnh mới
DELETE /api/memory-photos/:id      # Xóa ảnh
```

### **Feedback System**
```
GET    /api/feedbacks              # Lấy feedbacks
POST   /api/feedbacks              # Tạo feedback mới
PUT    /api/feedbacks/:id/like     # Like feedback
DELETE /api/feedbacks/:id          # Xóa feedback
```

### **Couple Goals**
```
GET    /api/couple-goals           # Lấy goals
POST   /api/couple-goals           # Tạo goal mới
PUT    /api/couple-goals/:id       # Cập nhật goal
DELETE /api/couple-goals/:id       # Xóa goal
```

## 💾 Data Migration

### **From localStorage to Database:**
1. **Memory Wall** - ✅ Migrated
2. **Feedback** - ✅ Migrated
3. **Couple Goals** - 🔄 Ready for migration
4. **Weather Settings** - 🔄 Ready for migration

### **Benefits:**
- **Persistent storage** - Data không bị mất
- **Multi-device sync** - Access từ nhiều thiết bị
- **Backup capability** - Có thể backup database
- **Performance** - Faster queries với indexes
- **Scalability** - Có thể mở rộng features

## 🛡️ Security Features

### **File Upload Security:**
- **File type validation** - Chỉ cho phép ảnh
- **File size limits** - Max 10MB
- **Secure file storage** - Organized upload directory
- **Path sanitization** - Prevent directory traversal

### **API Security:**
- **CORS protection** - Cross-origin requests
- **Input validation** - Validate all inputs
- **Error handling** - Safe error messages
- **SQL injection prevention** - Parameterized queries

## 📱 Frontend Integration

### **API Service:**
```javascript
import { uploadMemoryPhoto, getMemoryPhotos } from '../services/api';

// Upload ảnh
const result = await uploadMemoryPhoto({
  title: 'Kỷ niệm đẹp',
  description: 'Mô tả ảnh',
  uploaded_by: 'giaminh',
  file: imageFile
});

// Lấy danh sách ảnh
const photos = await getMemoryPhotos();
```

### **Toast Notifications:**
- **Success messages** - Upload thành công
- **Error handling** - Lỗi kết nối, validation
- **User feedback** - Thông báo rõ ràng

## 🔄 Development Workflow

### **Adding New Features:**
1. **Update schema.sql** - Add new tables
2. **Create API endpoints** - Server routes
3. **Add API service methods** - Frontend integration
4. **Update UI components** - Use new APIs
5. **Test thoroughly** - Ensure data integrity

### **Database Management:**
```bash
# Backup database
cp server/database/mio_couple.db backup/

# Reset database (development only)
rm server/database/mio_couple.db
# Server will recreate on next start

# View database
sqlite3 server/database/mio_couple.db
.tables
.schema memory_photos
```

## 🎯 Next Steps

### **Immediate:**
1. **Test Memory Wall** - Upload và delete ảnh
2. **Test Feedback** - Create, like, delete
3. **Verify data persistence** - Restart server

### **Future Enhancements:**
1. **Couple Goals migration** - Move to database
2. **Love Messages system** - Real-time messaging
3. **User authentication** - Login system
4. **Cloud storage** - AWS S3 integration
5. **Real-time sync** - WebSocket updates

## 🐛 Troubleshooting

### **Common Issues:**
- **Port conflicts** - Change PORT in .env
- **Permission errors** - Check file permissions
- **Database locked** - Close other connections
- **Upload failures** - Check disk space

### **Debug Commands:**
```bash
# Check server logs
npm run dev

# Test API endpoints
curl http://localhost:3001/api/health

# Check database
sqlite3 server/database/mio_couple.db ".tables"
```

Database integration hoàn tất! 🎉 Mio Couple Website giờ đây có backend thực sự với SQLite database.
