# Docker DB App - Node.js + MySQL

Application web simple utilisant Node.js et Express qui se connecte à une base de données MySQL via Docker Compose.

## 📋 Prérequis

- Docker Desktop installé
- Docker Compose (inclus avec Docker Desktop)

## 🚀 Lancement de l'application

### Démarrer les services

```bash
docker-compose up
```

Ou en mode détaché (arrière-plan) :

```bash
docker-compose up -d
```

L'application sera accessible sur **http://localhost:3000**

### Arrêter les services

```bash
docker-compose down
```

Pour supprimer également les volumes (données de la base) :

```bash
docker-compose down -v
```

## 📡 Endpoints API

### GET `/`
Affiche les endpoints disponibles

```bash
curl http://localhost:3000/
```

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
├── app.js              # Application Node.js/Express
├── package.json        # Dépendances Node.js
├── Dockerfile          # Image Docker pour l'app
├── docker-compose.yml  # Configuration des services
├── init.sql           # Script d'initialisation DB
└── README.md          # Documentation
```

## 🔧 Configuration

Les variables d'environnement sont définies dans `docker-compose.yml` :

- **DB_HOST** : db
- **DB_USER** : appuser
- **DB_PASSWORD** : apppassword
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
