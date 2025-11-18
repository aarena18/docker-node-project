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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample animals
INSERT INTO animals (name, species, age) VALUES
  ('Max', 'Dog', 5),
  ('Whiskers', 'Cat', 3),
  ('Goldie', 'Fish', 1);
