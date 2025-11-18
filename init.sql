-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
  ('Alice Dupont', 'alice@example.com'),
  ('Bob Martin', 'bob@example.com'),
  ('Claire Bernard', 'claire@example.com');

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(100) NOT NULL,
  age INT,
  user_id INT DEFAULT NULL,
  adopted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample animals (some adopted, some available)
INSERT INTO animals (name, species, age, user_id, adopted_at) VALUES
  ('Max', 'Dog', 5, 1, '2024-01-15 10:30:00'),
  ('Whiskers', 'Cat', 3, 1, '2024-02-20 14:45:00'),
  ('Goldie', 'Fish', 1, 2, '2024-03-10 09:15:00'),
  ('Buddy', 'Dog', 2, NULL, NULL),
  ('Luna', 'Cat', 4, NULL, NULL);
