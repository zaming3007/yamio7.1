const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'mio_couple.db');
    this.schemaPath = path.join(__dirname, 'schema.sql');
  }

  // Initialize database connection
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeSchema()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  // Initialize database schema
  async initializeSchema() {
    return new Promise((resolve, reject) => {
      const schema = fs.readFileSync(this.schemaPath, 'utf8');
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('Error initializing schema:', err.message);
          reject(err);
        } else {
          console.log('Database schema initialized');
          resolve();
        }
      });
    });
  }

  // Generic query method
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Generic run method for INSERT, UPDATE, DELETE
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Database run error:', err.message);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            changes: this.changes
          });
        }
      });
    });
  }

  // Get single row
  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Database get error:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Close database connection
  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Transaction support
  async transaction(callback) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.run('BEGIN TRANSACTION');
        const result = await callback(this);
        await this.run('COMMIT');
        resolve(result);
      } catch (error) {
        await this.run('ROLLBACK');
        reject(error);
      }
    });
  }

  // Utility methods for common operations
  
  // Generate unique ID
  generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}_${random}`;
  }

  // Format date for SQLite
  formatDate(date = new Date()) {
    return date.toISOString();
  }

  // Parse JSON safely
  parseJSON(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return defaultValue;
    }
  }

  // Stringify JSON safely
  stringifyJSON(obj) {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      return null;
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
