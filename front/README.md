# Frontend - SPA Adoption

Interface web pour l'application d'adoption d'animaux de la SPA.

## 📁 Structure

- `index.html` - Page principale avec liste des animaux disponibles
- `connexion.html` - Page de connexion et inscription
- `profile.html` - Page de profil utilisateur avec animaux adoptés
- `index.css` - Feuille de style globale
- `index.js` - JavaScript utilitaire (optionnel)

## 🎨 Fonctionnalités

### Pages publiques
- **Accueil** (`index.html`)
  - Liste des animaux disponibles à l'adoption
  - Informations détaillées sur chaque animal (nom, espèce, description, photo)
  - Bouton "Adopter" (nécessite connexion)

### Pages d'authentification
- **Connexion/Inscription** (`connexion.html`)
  - Formulaire de connexion
  - Formulaire d'inscription
  - Basculement entre les deux modes
  - Messages de succès/erreur

### Pages privées (nécessitent connexion)
- **Profil utilisateur** (`profile.html`)
  - Informations personnelles
  - Liste des animaux adoptés
  - Possibilité de rendre un animal à l'adoption

## 🚀 Utilisation

### Ouvrir l'application

Pour utiliser l'application frontend, vous devez d'abord démarrer le backend :

```bash
cd ..
docker-compose up
```

Ensuite, ouvrez simplement les fichiers HTML dans votre navigateur :

1. Méthode 1 : Double-cliquez sur `index.html`
2. Méthode 2 : Utilisez un serveur local (recommandé)

**Option avec Python :**
```bash
cd front
python3 -m http.server 8080
```
Puis ouvrez : http://localhost:8080

**Option avec Node.js (http-server) :**
```bash
npx http-server front -p 8080
```

### Connexion

Utilisez un des comptes existants :
- **Email**: `alice@example.com` / **Mot de passe**: `password123`
- **Email**: `bob@example.com` / **Mot de passe**: `password123`
- **Email**: `claire@example.com` / **Mot de passe**: `password123`

Ou créez un nouveau compte via le formulaire d'inscription.

## 🔗 API Backend

L'application communique avec le backend sur `http://localhost:3000`

Endpoints utilisés :
- `GET /users` - Liste des utilisateurs
- `POST /users` - Créer un utilisateur
- `GET /animals/available` - Animaux disponibles
- `GET /users/:id/pets` - Animaux adoptés par un utilisateur
- `POST /animals/:id/adopt` - Adopter un animal
- `POST /animals/:id/release` - Rendre un animal à l'adoption

## 🎨 Design

L'interface utilise :
- Design moderne et épuré
- Variables CSS pour les couleurs et espacements
- Responsive design (mobile, tablette, desktop)
- Animations et transitions fluides
- Ombres et effets au survol

### Palette de couleurs
- Primaire : `#4a90e2` (bleu)
- Secondaire : `#50c878` (vert)
- Danger : `#e74c3c` (rouge)
- Texte : `#2c3e50` (gris foncé)
- Background : `#f8f9fa` (gris clair)

## 💾 Stockage local

L'authentification utilise `localStorage` pour stocker :
- Informations de l'utilisateur connecté
- Persistance de la session entre les pages

**Note**: Il s'agit d'une implémentation basique pour le développement. En production, utilisez des méthodes d'authentification plus sécurisées (JWT, cookies HTTP-only, etc.).

## 🐛 Debugging

Ouvrez la console du navigateur (F12) pour voir :
- Les appels API
- Les erreurs éventuelles
- Les données chargées

## ⚠️ Important

- Le backend doit être démarré (`docker-compose up`)
- Les images des animaux sont des URLs externes
- L'authentification est basique (pour développement uniquement)
