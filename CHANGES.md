# Changes - Repository Refactoring

## Summary
Merged multiple branches and refactored the repository into separate frontend and backend directories.

## Changes Made

### 1. Branch Merges
- **Frontend**: Merged code from `origin/front` branch
  - Added: `index.html`, `index.css`, `index.js`, `connexion.html`
- **Backend**: Merged updated SQL from `origin/kinsey` branch
  - Updated `init.sql` with new animals table structure including `image` and `description` fields
  - Added password field to users table
  - Fixed SQL syntax errors (removed trailing comma)

### 2. Directory Restructuring

#### Frontend (`front/`)
- `index.html` - Main SPA adoption page with animal cards
- `index.css` - Styling for the frontend
- `index.js` - Frontend JavaScript (placeholder)
- `connexion.html` - Login/signup page (skeleton)

#### Backend (`back/`)
- `app.js` - Updated Express server with full CRUD API for users and animals
- `init.sql` - Updated database schema with animals table (image, name, species, description, user_id, adopted_at)
- `package.json` - Node.js dependencies
- `package-lock.json` - Locked dependencies
- `Dockerfile` - Container configuration
- `.dockerignore` - Docker ignore rules
- `views/` - EJS templates
- `public/` - Static assets

### 3. Configuration Updates
- Updated `docker-compose.yml` to reference new `back/` directory structure
- Updated `README.md` to reflect new project organization

### 4. API Updates
The backend now supports:
- User management with password field
- Animal management with image URLs and descriptions
- Adoption system linking users to animals
- Available animals filtering

## Database Schema Changes
### Users Table
- Added: `password VARCHAR(255)` field

### Animals Table
- Added: `image VARCHAR(255)` - URL to animal image
- Added: `description TEXT` - Animal description
- Added: `user_id INT` - Foreign key to users (for adoption)
- Added: `adopted_at TIMESTAMP` - Adoption timestamp

## Next Steps
You can now:
1. Run `docker-compose up` to start the application
2. Access frontend files in `front/` directory
3. Backend API is served from `back/` directory
4. Consider deploying frontend and backend as separate services if needed
