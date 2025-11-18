CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password) VALUES
  ('Alice Dupont', 'alice@example.com', 'password123'),
  ('Bob Martin', 'bob@example.com', 'password123'),
  ('Claire Bernard', 'claire@example.com', 'password123');


CREATE TABLE IF NOT EXISTS animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  name VARCHAR(100),
  species VARCHAR(100),
  description TEXT,
)

INSERT INTO animals (image, name, species, description) VALUES
  ('https://hips.hearstapps.com/hmg-prod/images/grey-cat-playing-royalty-free-image-1721750423.jpg?crop=0.751xw:1.00xh;0.191xw,0&resize=1200:*', 'Luna', 'Chat', 'Un petit chat gris très joueur et curieux.'),
  ('https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3V0ZSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D', 'Max', 'Chien', 'Un chien fidèle et affectueux qui adore courir.'),
  ('https://eu-central-1.graphassets.com/AnwjgMYRvQfWK3bRPjoq3z/resize=height:360,width:500/output=format:webp/KTpAEvTuQtahv76H0WI5', 'Émeraude', 'Tortue', 'Une tortue terrestre calme et très gourmande.'),
  ('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/%E0%B4%AE%E0%B5%81%E0%B4%AF%E0%B5%BD_0016.JPG/1200px-%E0%B4%AE%E0%B5%81%E0%B4%AF%E0%B5%BD_0016.JPG', 'Ruby', 'Lapin', 'Un lapin blanc aux yeux rouges, très énergique.'),
  ('https://exoticdirect.co.uk/wp-content/uploads/2025/01/Colourful-Parrot-Names.png', 'Soleil', 'Perroquet', 'Un perroquet coloré qui répète quelques mots.');