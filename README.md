# Refuge de l'IIM🐾 - Application Web Dockerisée

> Application full-stack de gestion d'adoptions d'animaux utilisant Node.js, Express, MySQL, et Docker

## 📖 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture](#-architecture)
- [Pourquoi Docker ?](#-pourquoi-docker-)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation et démarrage](#-installation-et-démarrage)
- [Explication détaillée de Docker](#-explication-détaillée-de-docker)
- [Structure du projet](#-structure-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [API Endpoints](#-api-endpoints)
- [Tests et vérification](#-tests-et-vérification)
- [Dépannage](#-dépannage)

---

## 🎯 Vue d'ensemble

**Le refuge de l'IIM** est une application web complète permettant aux utilisateurs de consulter des animaux disponibles à l'adoption, de créer un compte, de se connecter, et d'adopter des animaux. L'application est entièrement dockerisée pour garantir un déploiement cohérent et reproductible.

### Caractéristiques principales :
- 🐕 Visualisation des animaux disponibles à l'adoption
- 👤 Système d'authentification (inscription/connexion)
- ❤️ Adoption et gestion de ses animaux
- 🎨 Interface moderne et responsive
- 🐳 Entièrement containerisée avec Docker
- 📊 Base de données persistante MySQL

---

## 🏗️ Architecture

L'application suit une architecture **3-tiers** containerisée :

```
┌─────────────────────────────────────────────┐
│           Navigateur (Client)               │
│         http://localhost:3000               │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST API
                   ↓
┌─────────────────────────────────────────────┐
│      Container: node-app (Port 3000)        │
│  ┌─────────────────────────────────────┐   │
│  │   Frontend (HTML/CSS/JS)            │   │
│  │   - index.html                       │   │
│  │   - profile.html                     │   │
│  │   - connexion.html                   │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │   Backend (Node.js/Express)         │   │
│  │   - API REST                         │   │
│  │   - Routes /users, /animals         │   │
│  │   - CORS activé                      │   │
│  └─────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │ MySQL Protocol
                   ↓
┌─────────────────────────────────────────────┐
│      Container: mysql-db (Port 3306)        │
│  ┌─────────────────────────────────────┐   │
│  │   Base de données MySQL 8.0         │   │
│  │   - Table: users                     │   │
│  │   - Table: animals                   │   │
│  │   - Volume persistant: db-data      │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Communication entre conteneurs :
- **Frontend ↔ Backend** : Requêtes HTTP via Fetch API
- **Backend ↔ Database** : Connexion MySQL via le driver `mysql2`
- **Réseau Docker** : Les conteneurs communiquent via un réseau bridge interne
- **Volumes** : Persistance des données MySQL même après arrêt des conteneurs

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js 18** - Runtime JavaScript
- **Express.js 4** - Framework web
- **MySQL2** - Driver MySQL pour Node.js
- **EJS** - Moteur de template (compatibilité)

### Frontend
- **HTML5** - Structure
- **CSS3** - Styles modernes (variables, flexbox, grid)
- **JavaScript ES6+** - Logique côté client
- **Fetch API** - Requêtes HTTP

### Base de données
- **MySQL 8.0** - SGBD relationnel
- **InnoDB** - Moteur de stockage

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration multi-conteneurs

---

## 📋 Prérequis

### Logiciels requis :

1. **Docker Desktop**
   - Windows/Mac : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux : Installer Docker Engine + Docker Compose
   
2. **Vérifier l'installation :**
   ```bash
   docker --version
   # Docker version 20.10.x ou supérieur
   
   docker compose version
   # Docker Compose version v2.x.x ou supérieur
   ```

### Ports requis (doivent être libres) :
- **3000** - Application web
- **3306** - Base de données MySQL (optionnel, utilisé en interne)

---

## 🚀 Installation et démarrage

### Étape 1 : Cloner le projet

```bash
cd ~/desktop/A3/docker
cd docker-db-app
```

### Étape 2 : Démarrer l'application

#### Option A : Mode développement (avec logs)
```bash
docker compose up
```

#### Option B : Mode détaché (arrière-plan)
```bash
docker compose up -d
```

### Étape 3 : Attendre le démarrage complet

Vous verrez :
```
✔ Network docker-db-app_default  Created
✔ Container mysql-db             Healthy
✔ Container node-app             Started
```

### Étape 4 : Accéder à l'application

Ouvrez votre navigateur : **http://localhost:3000**

---

## 🐳 Explication détaillée de Docker

### Fichiers Docker du projet

#### 1. `Dockerfile` (back/Dockerfile)

Le Dockerfile définit comment construire l'image Docker pour notre application Node.js :

```dockerfile
FROM node:18-alpine
# Utilise l'image officielle Node.js version 18 basée sur Alpine Linux
# Alpine = distribution légère (~5MB vs ~900MB pour une image complète)

WORKDIR /usr/src/app
# Définit le répertoire de travail dans le conteneur

COPY back/package*.json ./back/
# Copie les fichiers package.json et package-lock.json
# Le * permet de copier les deux fichiers avec une seule instruction

WORKDIR /usr/src/app/back
RUN npm install
# Installe toutes les dépendances Node.js listées dans package.json
# Cette étape est mise en cache par Docker si package.json n'a pas changé

WORKDIR /usr/src/app

COPY back/app.js ./back/
COPY back/views ./back/views
COPY back/public ./back/public
COPY front ./front
# Copie le code source de l'application
# Fait en dernier pour maximiser l'utilisation du cache Docker

WORKDIR /usr/src/app/back

EXPOSE 3000
# Documente que le conteneur écoute sur le port 3000
# (Ne publie pas le port, c'est docker-compose qui le fait)

CMD ["npm", "start"]
# Commande exécutée au démarrage du conteneur
# Lance "npm start" qui exécute "node app.js"
```

**Principes clés :**
- **Layers (Couches)** : Chaque instruction crée une couche. Docker met en cache les couches non modifiées
- **Optimisation** : Les fichiers qui changent rarement (package.json) sont copiés avant le code source
- **Image de base légère** : Alpine Linux réduit la taille de l'image finale

#### 2. `docker-compose.yml`

Docker Compose orchestre plusieurs conteneurs :

```yaml
services:
  db:
    image: mysql:8.0
    # Utilise l'image officielle MySQL 8.0 depuis Docker Hub
    # Pas de build nécessaire, l'image est déjà préparée
    
    container_name: mysql-db
    # Nom personnalisé du conteneur (plus lisible que l'ID généré)
    
    restart: always
    # Redémarre automatiquement le conteneur en cas d'erreur
    
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: testdb
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppassword
    # Variables d'environnement pour configurer MySQL
    # Injectées dans le conteneur au démarrage
    
    ports:
      - "3306:3306"
    # Mapping de ports : HOST:CONTAINER
    # Permet d'accéder à MySQL depuis l'hôte sur le port 3306
    
    volumes:
      - db-data:/var/lib/mysql
      # Volume nommé pour persister les données MySQL
      # Les données survivent même si le conteneur est supprimé
      
      - ./back/init.sql:/docker-entrypoint-initdb.d/init.sql
      # Bind mount : lie un fichier de l'hôte au conteneur
      # init.sql est exécuté automatiquement au premier démarrage
    
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    # Vérifie que MySQL est prêt à accepter des connexions
    # Important pour synchroniser le démarrage avec l'app

  app:
    build:
      context: .
      dockerfile: ./back/Dockerfile
    # Construit l'image à partir du Dockerfile
    # Context = . signifie que le build a accès à tout le répertoire
    
    container_name: node-app
    
    restart: always
    
    ports:
      - "3000:3000"
    # Expose l'application web sur le port 3000
    
    environment:
      DB_HOST: db
      # 'db' est le nom du service, résolu automatiquement par Docker
      # Docker fournit un DNS interne pour la communication inter-conteneurs
      
      DB_USER: appuser
      DB_PASSWORD: apppassword
      DB_NAME: testdb
    # Variables d'environnement pour la connexion à la base de données
    
    depends_on:
      db:
        condition: service_healthy
    # L'app ne démarre que quand MySQL est "healthy"
    # Évite les erreurs de connexion au démarrage
    
    volumes:
      - ./back/app.js:/usr/src/app/back/app.js
      - ./front:/usr/src/app/front
    # Volumes pour le développement : modifications du code immédiatement actives
    # (Nécessite de redémarrer le conteneur avec nodemon en production)

volumes:
  db-data:
    # Déclaration du volume nommé
    # Géré par Docker, stocké dans /var/lib/docker/volumes/
```

### Concepts Docker clés

#### **Images vs Conteneurs**

```
Image Docker (recette)
    ↓ docker run
Conteneur (plat cuisiné)
```

- **Image** : Template en lecture seule (comme une classe en POO)
- **Conteneur** : Instance d'une image en cours d'exécution (comme un objet)

#### **Layers (Couches)**

```
┌─────────────────────────┐
│  CMD ["npm", "start"]   │  ← Couche 5 (3KB)
├─────────────────────────┤
│  COPY app.js            │  ← Couche 4 (8KB)
├─────────────────────────┤
│  RUN npm install        │  ← Couche 3 (50MB)
├─────────────────────────┤
│  COPY package.json      │  ← Couche 2 (2KB)
├─────────────────────────┤
│  FROM node:18-alpine    │  ← Couche 1 (Base: 180MB)
└─────────────────────────┘
```

Si seul `app.js` change, Docker réutilise les couches 1-2-3 en cache.

#### **Volumes**

```
Named Volume (db-data):
┌──────────────┐       ┌──────────────┐
│   Docker     │ ──→   │  Conteneur   │
│   Volume     │       │    MySQL     │
└──────────────┘       └──────────────┘
  Persiste même si le conteneur est supprimé

Bind Mount (./back/app.js):
┌──────────────┐       ┌──────────────┐
│  Filesystem  │ ←───→ │  Conteneur   │
│    Hôte      │       │   Node.js    │
└──────────────┘       └──────────────┘
  Synchronisation bidirectionnelle en temps réel
```

#### **Réseau Docker**

```
┌─────────────────────────────────────┐
│  Réseau: docker-db-app_default      │
│                                     │
│  ┌──────────┐      ┌──────────┐   │
│  │ node-app │ ───→ │ mysql-db │   │
│  │ (db:3306)│      │          │   │
│  └──────────┘      └──────────┘   │
│                                     │
└─────────────────────────────────────┘
         ↕ Port 3000 exposé
  ┌─────────────┐
  │  Localhost  │
  └─────────────┘
```

Docker crée automatiquement un réseau bridge interne où :
- Les conteneurs se voient par leur nom de service (`db`, `app`)
- Isolation complète du réseau hôte
- Seuls les ports mappés sont accessibles depuis l'extérieur

### Commandes Docker essentielles

#### Construction et démarrage

```bash
# Construire les images
docker compose build

# Démarrer les services
docker compose up

# Démarrer en arrière-plan
docker compose up -d

# Reconstruire et démarrer
docker compose up --build
```

#### Gestion des conteneurs

```bash
# Voir les conteneurs actifs
docker compose ps
docker ps

# Arrêter les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Redémarrer un service
docker compose restart app
```

#### Logs et débogage

```bash
# Voir tous les logs
docker compose logs

# Logs d'un service spécifique
docker compose logs app
docker compose logs db

# Suivre les logs en temps réel
docker compose logs -f

# Logs avec timestamps
docker compose logs -t
```

#### Exécution de commandes

```bash
# Shell interactif dans un conteneur
docker exec -it node-app sh
docker exec -it mysql-db bash

# Exécuter une commande unique
docker exec node-app ls -la
docker exec mysql-db mysql -u root -prootpassword testdb
```

#### Inspection et nettoyage

```bash
# Inspecter un conteneur
docker inspect node-app

# Voir l'utilisation des ressources
docker stats

# Nettoyer les images inutilisées
docker image prune

# Nettoyer tout (ATTENTION)
docker system prune -a
```

---

## 📁 Structure du projet

### GET `/health`
Vérifie l'état de l'application et de la base de données

```bash
curl http://localhost:3000/health
```

### GET `/users`
Récupère tous les utilisateurs

```bash
curl http://localhost:3000/users
```

### GET `/users/:id`
Récupère un utilisateur par son ID

```bash
curl http://localhost:3000/users/1
```

### POST `/users`
Crée un nouvel utilisateur

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jean Durand", "email": "jean@example.com"}'
```

## 🧪 Test de l'application

1. **Démarrer l'application** :
   ```bash
   docker-compose up
   ```

2. **Vérifier la santé** :
   ```bash
   curl http://localhost:3000/health
   ```
   
   Résultat attendu : `{"status":"healthy","database":"connected"}`

3. **Lire les données** :
   ```bash
   curl http://localhost:3000/users
   ```
   
   Vous verrez 3 utilisateurs pré-créés (Alice, Bob, Claire)

4. **Écrire des données** :
   ```bash
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Marie Leroy", "email": "marie@example.com"}'
   ```

5. **Vérifier la création** :
   ```bash
   curl http://localhost:3000/users
   ```
   
   Marie Leroy devrait maintenant apparaître dans la liste

## 🏗️ Architecture

### Services Docker

- **app** : Application Node.js (port 3000)
- **db** : Base de données MySQL 8.0 (port 3306)

### Structure du projet

```
docker-db-app/
├── front/                  # Frontend files
│   ├── index.html         # Main page
│   ├── index.css          # Styles
│   ├── index.js           # Frontend JavaScript
│   └── connexion.html     # Login/signup page
├── back/                  # Backend files
│   ├── app.js             # Node.js/Express application
│   ├── package.json       # Node.js dependencies
│   ├── Dockerfile         # Docker image for the app
│   ├── init.sql          # Database initialization script
│   ├── views/            # EJS templates
│   └── public/           # Static assets
├── docker-compose.yml     # Service configuration
└── README.md             # Documentation
```

## 🔧 Configuration

Les variables d'environnement sont définies dans `docker-compose.yml` :

- **DB_HOST** : --
- **DB_USER** : --
- **DB_PASSWORD** : --
- **DB_NAME** : testdb

## 📊 Accès direct à MySQL (optionnel)

```bash
docker exec -it mysql-db mysql -u appuser -papppassword testdb
```

Commandes SQL utiles :
```sql
SHOW TABLES;
SELECT * FROM users;
```

## 🔍 Logs

Voir les logs des services :

```bash
docker-compose logs
```

Suivre les logs en temps réel :

```bash
docker-compose logs -f
```

## ✅ Vérification complète

Script de test rapide :

```bash
# Démarrer
docker-compose up -d

# Attendre que les services soient prêts
sleep 10

# Tester health
curl http://localhost:3000/health

# Lire
curl http://localhost:3000/users

# Écrire
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# Relire pour vérifier
curl http://localhost:3000/users
```

## 🛑 Dépannage

- **Port déjà utilisé** : Modifiez les ports dans `docker-compose.yml`
- **Erreur de connexion DB** : Attendez quelques secondes que MySQL soit complètement démarré
- **Rebuild nécessaire** : `docker-compose up --build`

```
docker-db-app/
├── front/                    # Frontend (Interface utilisateur)
│   ├── index.html           # Page d'accueil - Liste des animaux
│   ├── profile.html         # Page de profil utilisateur
│   ├── connexion.html       # Page login/signup
│   ├── index.css            # Styles CSS globaux
│   ├── index.js             # JavaScript utilitaire
│   └── README.md            # Documentation frontend
├── back/                     # Backend (Serveur & API)
│   ├── app.js               # Serveur Express + Routes API
│   ├── package.json         # Dépendances Node.js
│   ├── package-lock.json    # Versions exactes des dépendances
│   ├── Dockerfile           # Instructions de build Docker
│   ├── .dockerignore        # Fichiers exclus du build
│   ├── init.sql             # Script d'initialisation DB
│   ├── views/               # Templates EJS (optionnel)
│   └── public/              # Assets statiques
├── docker-compose.yml        # Orchestration des conteneurs
├── README.md                 # Ce fichier
├── CHANGES.md                # Historique des modifications
└── FRONTEND_GUIDE.md         # Guide d'utilisation frontend
```

---

## ✨ Fonctionnalités

### Pour les visiteurs (non connectés)
- 👀 **Consulter les animaux** : Voir tous les animaux disponibles à l'adoption
- 📝 **Créer un compte** : S'inscrire avec nom, email et mot de passe
- 🔐 **Se connecter** : Accéder à son compte existant

### Pour les utilisateurs connectés
- ❤️ **Adopter un animal** : Choisir un animal et l'adopter
- 👤 **Voir son profil** : Consulter ses informations personnelles
- 🐕 **Gérer ses adoptions** : Voir la liste de ses animaux adoptés
- 🔓 **Rendre un animal** : Remettre un animal à l'adoption
- 🚪 **Se déconnecter** : Terminer sa session

### Caractéristiques techniques
- 🎨 **Interface responsive** : Fonctionne sur mobile, tablette et desktop
- ⚡ **Temps réel** : Les changements sont immédiatement visibles
- 🔒 **Authentification** : Système de login sécurisé (localStorage)
- 💾 **Persistance** : Les données sont sauvegardées en base MySQL
- 🐳 **Dockerisé** : Déploiement simple et reproductible

---

## 📡 API Endpoints

### Santé et informations

#### `GET /health`
Vérification de l'état du serveur et de la base de données.

```bash
curl http://localhost:3000/health
```

**Réponse :**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

#### `GET /api`
Liste de tous les endpoints disponibles.

```bash
curl http://localhost:3000/api
```

---

### Gestion des utilisateurs

#### `GET /users`
Récupère la liste de tous les utilisateurs.

```bash
curl http://localhost:3000/users
```

**Réponse :**
```json
{
  "count": 3,
  "users": [
    {
      "id": 1,
      "name": "Alice Dupont",
      "email": "alice@example.com",
      "created_at": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

#### `GET /users/:id`
Récupère un utilisateur par son ID.

```bash
curl http://localhost:3000/users/1
```

#### `POST /users`
Crée un nouvel utilisateur.

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Durand",
    "email": "jean@example.com",
    "password": "monmotdepasse"
  }'
```

**Réponse :**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 4,
    "name": "Jean Durand",
    "email": "jean@example.com"
  }
}
```

#### `GET /users/:id/pets`
Récupère les animaux adoptés par un utilisateur.

```bash
curl http://localhost:3000/users/1/pets
```

---

### Gestion des animaux

#### `GET /animals`
Récupère tous les animaux (adoptés ou non).

```bash
curl http://localhost:3000/animals
```

#### `GET /animals/available`
Récupère uniquement les animaux disponibles à l'adoption.

```bash
curl http://localhost:3000/animals/available
```

**Réponse :**
```json
{
  "count": 5,
  "animals": [
    {
      "id": 1,
      "image": "https://...",
      "name": "Luna",
      "species": "Chat",
      "description": "Un petit chat gris très joueur et curieux.",
      "user_id": null,
      "adopted_at": null
    }
  ]
}
```

#### `GET /animals/:id`
Récupère les détails d'un animal spécifique.

```bash
curl http://localhost:3000/animals/1
```

#### `POST /animals`
Crée un nouvel animal.

```bash
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minou",
    "species": "Chat",
    "description": "Un chat adorable",
    "image": "https://..."
  }'
```

#### `POST /animals/:animalId/adopt`
Adopte un animal pour un utilisateur.

```bash
curl -X POST http://localhost:3000/animals/1/adopt \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

**Réponse :**
```json
{
  "message": "Animal adopted successfully",
  "animal": {
    "id": 1,
    "owner": "Alice Dupont"
  }
}
```

#### `POST /animals/:animalId/release`
Rend un animal à l'adoption.

```bash
curl -X POST http://localhost:3000/animals/1/release
```

---

## ✅ Tests et vérification

### Test complet du système

```bash
# 1. Vérifier l'état du système
curl http://localhost:3000/health

# 2. Consulter les animaux disponibles
curl http://localhost:3000/animals/available

# 3. Consulter les utilisateurs
curl http://localhost:3000/users

# 4. Créer un nouvel utilisateur
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "test123"}'

# 5. Adopter un animal
curl -X POST http://localhost:3000/animals/1/adopt \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# 6. Vérifier l'adoption
curl http://localhost:3000/users/1/pets

# 7. Rendre l'animal
curl -X POST http://localhost:3000/animals/1/release
```

### Accès à la base de données

```bash
# Se connecter à MySQL depuis l'hôte
docker exec -it mysql-db mysql -u appuser -papppassword testdb

# Requêtes SQL utiles
SELECT * FROM users;
SELECT * FROM animals;
SELECT * FROM animals WHERE user_id IS NULL;
SELECT a.*, u.name as owner FROM animals a LEFT JOIN users u ON a.user_id = u.id;
```

### Vérifier l'état des conteneurs

```bash
# État des services
docker compose ps

# Logs en temps réel
docker compose logs -f

# Utilisation des ressources
docker stats
```

---

## 🐛 Dépannage

### Problème : Les conteneurs ne démarrent pas

```bash
# Vérifier si les ports sont occupés
lsof -i :3000
lsof -i :3306

# Solution : Arrêter les processus ou changer les ports dans docker-compose.yml
```

### Problème : MySQL n'est pas prêt

```bash
# Vérifier les logs
docker compose logs db

# Attendre le healthcheck
docker compose up
# Attendez de voir : ✔ Container mysql-db Healthy
```

### Problème : Erreur de connexion à la base de données

```bash
# Vérifier que les conteneurs sont sur le même réseau
docker network inspect docker-db-app_default

# Recréer les conteneurs
docker compose down
docker compose up
```

### Problème : Les modifications du code ne sont pas prises en compte

```bash
# Reconstruire l'image
docker compose up --build

# Ou forcer la reconstruction
docker compose build --no-cache
docker compose up
```

### Problème : Volume de base de données corrompu

```bash
# ATTENTION : Supprime toutes les données
docker compose down -v
docker compose up
```

### Problème : Espace disque insuffisant

```bash
# Voir l'utilisation
docker system df

# Nettoyer les images inutilisées
docker image prune -a

# Nettoyer tout (containers, images, volumes, networks)
docker system prune -a --volumes
```

### Problème : Permission denied

```bash
# Sur Linux, ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📚 Ressources

- [Documentation officielle Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
