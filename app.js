const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'testdb'
};

let connection;

// Initialize database connection
async function initDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to MySQL database');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    setTimeout(initDB, 5000); // Retry after 5 seconds
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Docker DB App - Node.js + MySQL',
    endpoints: {
      'GET /users': 'Get all users',
      'GET /users/:id': 'Get user by ID',
      'POST /users': 'Create a new user (body: {name, email})',
      'GET /health': 'Health check'
    }
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await connection.ping();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// READ: Get all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    res.json({ count: rows.length, users: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WRITE: Create new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const [result] = await connection.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

// Start server
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
});
