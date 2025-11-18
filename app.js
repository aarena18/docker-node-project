const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Root endpoint - render home page
app.get('/', async (req, res) => {
  try {
    const [users] = await connection.query('SELECT * FROM users');
    res.render('index', { users });
  } catch (error) {
    res.render('index', { users: [], error: error.message });
  }
});

// API endpoint (for JSON responses)
app.get('/api', (req, res) => {
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

// === ANIMALS/PETS ENDPOINTS ===

// READ: Get all animals
app.get('/animals', async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT a.*, u.name as owner_name, u.email as owner_email 
      FROM animals a 
      LEFT JOIN users u ON a.user_id = u.id
    `);
    res.json({ count: rows.length, animals: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get available animals (not adopted)
app.get('/animals/available', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM animals WHERE user_id IS NULL');
    res.json({ count: rows.length, animals: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get animal by ID
app.get('/animals/:id', async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT a.*, u.name as owner_name, u.email as owner_email 
      FROM animals a 
      LEFT JOIN users u ON a.user_id = u.id 
      WHERE a.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get user's pets
app.get('/users/:id/pets', async (req, res) => {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM animals WHERE user_id = ?',
      [req.params.id]
    );
    res.json({ count: rows.length, pets: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WRITE: Create new animal
app.post('/animals', async (req, res) => {
  try {
    const { name, species, age } = req.body;
    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required' });
    }
    
    const [result] = await connection.query(
      'INSERT INTO animals (name, species, age) VALUES (?, ?, ?)',
      [name, species, age || null]
    );
    
    res.status(201).json({
      message: 'Animal created successfully',
      animal: { id: result.insertId, name, species, age }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WRITE: Adopt an animal (assign to user)
app.post('/animals/:animalId/adopt', async (req, res) => {
  try {
    const { animalId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Check if user exists
    const [users] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if animal exists and is available
    const [animals] = await connection.query('SELECT * FROM animals WHERE id = ?', [animalId]);
    if (animals.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    if (animals[0].user_id !== null) {
      return res.status(400).json({ error: 'Animal is already adopted' });
    }
    
    // Adopt the animal
    await connection.query(
      'UPDATE animals SET user_id = ?, adopted_at = NOW() WHERE id = ?',
      [userId, animalId]
    );
    
    res.json({
      message: 'Animal adopted successfully',
      animal: { id: animalId, owner: users[0].name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WRITE: Release an animal (remove from user)
app.post('/animals/:animalId/release', async (req, res) => {
  try {
    const { animalId } = req.params;
    
    // Check if animal exists
    const [animals] = await connection.query('SELECT * FROM animals WHERE id = ?', [animalId]);
    if (animals.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    if (animals[0].user_id === null) {
      return res.status(400).json({ error: 'Animal is not adopted' });
    }
    
    // Release the animal
    await connection.query(
      'UPDATE animals SET user_id = NULL, adopted_at = NULL WHERE id = ?',
      [animalId]
    );
    
    res.json({
      message: 'Animal released successfully',
      animal: { id: animalId, name: animals[0].name }
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
