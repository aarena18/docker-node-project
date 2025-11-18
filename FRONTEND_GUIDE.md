# Guide d'utilisation - Frontend SPA Adoption

## 🚀 Démarrage rapide

### 1. Démarrer le backend

```bash
docker-compose up
```

Attendez que les services soient prêts (environ 10-15 secondes).

### 2. Ouvrir le frontend

**Option 1 : Serveur Python (recommandé)**
```bash
cd front
python3 -m http.server 8080
```
Ouvrez votre navigateur : http://localhost:8080

**Option 2 : Directement dans le navigateur**
Double-cliquez sur `front/index.html` (certaines fonctionnalités peuvent ne pas marcher à cause de CORS)

## 📱 Pages disponibles

### 🏠 Page d'accueil (`index.html`)
- **URL** : http://localhost:8080/index.html
- **Fonctionnalités** :
  - Voir tous les animaux disponibles à l'adoption
  - Chaque carte affiche : photo, nom, espèce, description
  - Bouton "Adopter" (nécessite connexion)

### 🔐 Page de connexion (`connexion.html`)
- **URL** : http://localhost:8080/connexion.html
- **Fonctionnalités** :
  - Se connecter avec un compte existant
  - Créer un nouveau compte
  - Basculer entre login et signup

**Comptes de test disponibles :**
- alice@example.com / password123
- bob@example.com / password123
- claire@example.com / password123

### 👤 Page de profil (`profile.html`)
- **URL** : http://localhost:8080/profile.html
- **Fonctionnalités** :
  - Voir vos informations personnelles
  - Liste de vos animaux adoptés
  - Rendre un animal à l'adoption
- **Note** : Nécessite d'être connecté

## 🎯 Scénario d'utilisation complet

1. **Ouvrir la page d'accueil**
   - Vous voyez 5 animaux disponibles (Luna, Max, Émeraude, Ruby, Soleil)
   
2. **Se connecter**
   - Cliquez sur "Se connecter"
   - Utilisez : alice@example.com / password123
   - Vous êtes redirigé vers la page d'accueil

3. **Adopter un animal**
   - Parcourez les animaux disponibles
   - Cliquez sur "Adopter" sous l'animal de votre choix
   - Confirmation : "Félicitations ! Vous avez adopté [Nom] !"
   - L'animal disparaît de la liste des disponibles

4. **Voir votre profil**
   - Cliquez sur "Mon Profil" dans le menu
   - Vous voyez vos animaux adoptés avec la date d'adoption

5. **Rendre un animal**
   - Sur votre profil, cliquez sur "Rendre à l'adoption"
   - Confirmez l'action
   - L'animal redevient disponible pour les autres utilisateurs

6. **Créer un nouveau compte**
   - Se déconnecter
   - Aller sur "Connexion"
   - Cliquer sur "Créer un compte"
   - Remplir le formulaire
   - Vous êtes automatiquement connecté

## 🎨 Fonctionnalités de l'interface

### Navigation
- **Logo cliquable** : Retour à l'accueil
- **Menu** : Animaux, Mon Profil (si connecté)
- **User info** : Affiche votre nom si connecté
- **Boutons** : Se connecter / Déconnexion

### États visuels
- ✅ Messages de succès (vert)
- ❌ Messages d'erreur (rouge)
- 🔄 États de chargement
- ✨ Animations au survol des cartes

### Responsive
- 📱 Mobile : 1 colonne
- 💻 Desktop : Grille adaptative (2-4 colonnes)

## 🔧 Vérification

### Le backend fonctionne ?
```bash
curl http://localhost:3000/health
# Devrait retourner: {"status":"healthy","database":"connected"}
```

### Voir les animaux disponibles
```bash
curl http://localhost:3000/animals/available
```

### Voir tous les utilisateurs
```bash
curl http://localhost:3000/users
```

## 🐛 Dépannage

### Les animaux ne s'affichent pas
- ✅ Le backend est-il démarré ?
- ✅ Vérifiez la console du navigateur (F12)
- ✅ Test : `curl http://localhost:3000/animals/available`

### Erreur CORS
- ✅ Utilisez un serveur local (python, http-server)
- ❌ N'ouvrez pas directement le fichier HTML

### Les images ne s'affichent pas
- Les images sont des URLs externes, vérifiez votre connexion Internet
- Un placeholder s'affiche si l'image est indisponible

### Impossible de se connecter
- ✅ Vérifiez que vous utilisez le bon email/mot de passe
- ✅ Pour les comptes existants : password123
- ✅ Consultez la console pour voir les erreurs

## 📊 Architecture technique

### Technologies
- HTML5 sémantique
- CSS3 moderne (variables, flexbox, grid)
- JavaScript vanilla (ES6+)
- Fetch API pour les requêtes HTTP

### Authentification
- **Stockage** : localStorage
- **Données stockées** : `{ id, name, email, password }`
- **Clé** : `currentUser`

### Structure des données

**User**
```json
{
  "id": 1,
  "name": "Alice Dupont",
  "email": "alice@example.com",
  "password": "password123"
}
```

**Animal**
```json
{
  "id": 1,
  "name": "Luna",
  "species": "Chat",
  "description": "Un petit chat gris très joueur et curieux.",
  "image": "https://...",
  "user_id": null,
  "adopted_at": null
}
```

## 🎓 Prochaines étapes

Pour améliorer l'application :
1. Ajouter une vraie authentification JWT
2. Implémenter un système de recherche/filtres
3. Ajouter des photos multiples par animal
4. Créer un système de favoris
5. Ajouter un chat entre adoptants
6. Système de notifications
7. Upload de photos pour les animaux

## 💡 Astuces

- **Ctrl + Shift + R** : Rafraîchir sans cache
- **F12** : Ouvrir la console développeur
- **localStorage.clear()** : Réinitialiser l'authentification
