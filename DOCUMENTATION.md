# Documentation du projet Ymmo – Plateforme immobilière

## 1. Présentation du projet

### Contexte et besoin métier
Ymmo est une plateforme web développée pour une agence immobilière fictive, permettant la gestion centralisée des biens immobiliers et des interactions entre les différents acteurs (clients, commerciaux, administrateurs). L'application répond au besoin de digitalisation des processus de vente, de mise en relation et de suivi des transactions immobilières.

### Objectifs fonctionnels
- **Authentification sécurisée** avec gestion des rôles (client, commercial, admin)
- **Catalogue public** des biens disponibles avec pagination et filtres
- **Interface administrateur** pour la gestion des biens (CRUD complet)
- **Espace personnel** selon le rôle (consultation, création, suppression)
- **Upload simplifié d'images** via URL externe
- **Interface responsive** adaptée à tous les appareils

### Public cible
- **Clients** : consultation du catalogue, création de compte
- **Commerciaux** : ajout, modification et suppression de biens
- **Administrateurs** : gestion complète des utilisateurs et des biens

## 2. Architecture technique

### Stack technologique
| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Backend** | Go (Golang) | 1.21+ | Performances élevées, typage statique, excellente gestion des concurrences |
| **Base de données** | MariaDB | 10.6+ | Solution relationnelle open-source, compatible MySQL, transactions ACID |
| **Frontend** | React + Vite | React 19, Vite 8 | Interface dynamique, temps de développement réduit, hot reload |
| **Authentification** | JWT + bcrypt | jwt/v5 | Tokens stateless, sécurisation des endpoints |
| **Routing Backend** | Chi Router | v5 | Router léger et performant pour Go |
| **Styling** | CSS-in-JS (inline) | - | Rapidité de développement, isolation des styles |

### Schéma de l'architecture
```
Client (Browser) 
    ↓ (HTTPS)
Frontend React (Vite)
    ↓ (API REST)
Backend Go (Chi Router)
    ↓ (MySQL Protocol)
Base de données MariaDB
```

### Structure des dossiers
```
backend/
├── cmd/main.go              # Point d'entrée, configuration des routes
├── internal/
│   ├── database/db.go       # Connexion à la base de données
│   ├── models/model_bien.go # Structures de données (Go structs)
│   ├── handlers/            # Contrôleurs HTTP
│   │   ├── handler_auth.go  # Login/Register
│   │   ├── handler_bien.go  # CRUD des biens
│   │   └── handler_user.go  # Gestion utilisateurs
│   └── middleware/mw_auth.go # Middleware JWT et rôles
├── init.sql                 # Schéma SQL et données de test
└── .env.exemple             # Variables d'environnement

frontend/
├── src/
│   ├── api.js              # Client HTTP centralisé
│   ├── context/AuthContext.jsx # Contexte d'authentification
│   ├── pages/              # Composants pages
│   │   ├── HomePage.jsx    # Page d'accueil publique
│   │   ├── Bienspage.jsx   # Liste des biens (connecté)
│   │   ├── Biensdetailpage.jsx # Détail d'un bien
│   │   ├── Createbienpage.jsx  # Formulaire de création
│   │   ├── Loginpage.jsx   # Connexion
│   │   └── Registerpage.jsx # Inscription
│   └── App.jsx             # Router client et layout
└── vite.config.js          # Configuration de build
```

## 3. Base de données

### Schéma des tables

#### Table `agences`
| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | INT AUTO_INCREMENT | ❌ | Clé primaire |
| nom | VARCHAR(100) | ❌ | Nom de l'agence |
| adresse | VARCHAR(255) | ✅ | Adresse postale |
| ville | VARCHAR(100) | ✅ | Ville |
| telephone | VARCHAR(20) | ✅ | Numéro de téléphone |

#### Table `users`
| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | INT AUTO_INCREMENT | ❌ | Clé primaire |
| nom | VARCHAR(100) | ❌ | Nom de famille |
| prenom | VARCHAR(100) | ❌ | Prénom |
| email | VARCHAR(150) UNIQUE | ❌ | Email (identifiant) |
| password_hash | VARCHAR(255) | ❌ | Mot de passe hashé (bcrypt) |
| role | ENUM('client','commercial','admin') | ✅ | Rôle utilisateur (défaut: 'client') |
| agence_id | INT | ✅ | Référence à l'agence |
| created_at | TIMESTAMP | ✅ | Date de création |

#### Table `biens` (entité centrale)
| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | INT AUTO_INCREMENT | ❌ | Clé primaire |
| titre | VARCHAR(200) | ❌ | Titre descriptif |
| description | TEXT | ✅ | Description détaillée |
| type | ENUM('résidentiel','professionnel') | ❌ | Type de bien |
| statut | ENUM('disponible','en_négociation','vendu') | ✅ | Statut commercial |
| prix | DECIMAL(12,2) | ❌ | Prix en euros |
| surface | DECIMAL(8,2) | ✅ | Surface en m² |
| adresse | VARCHAR(255) | ✅ | Adresse postale |
| ville | VARCHAR(100) | ✅ | Ville |
| agence_id | INT | ✅ | Agence gestionnaire |
| commercial_id | INT | ✅ | Commercial assigné |
| photo_url | VARCHAR(500) | ✅ | URL de l'image principale |
| created_at | TIMESTAMP | ✅ | Date d'ajout |

#### Tables annexes
- **`photos`** : Photos supplémentaires pour un bien (relation 1-N) – *non utilisée dans les handlers actuels*
- **`transactions`** : Suivi des ventes – *non utilisée dans les handlers actuels*

### Justification de la normalisation
La base de données respecte la **3ème forme normale (3NF)** :
1. **Élimination de la redondance** : Les informations agences et utilisateurs sont stockées une seule fois
2. **Intégrité référentielle** : Clés étrangères avec `ON DELETE CASCADE` pour les photos
3. **Domaines précis** : Types ENUM pour les champs à valeurs limitées (rôles, statuts)
4. **Index automatiques** : Clés primaires auto-incrémentées pour performances

### Exemple de requête SQL utilisée
```sql
-- Requête paginée avec filtres dynamiques (handler_bien.go)
SELECT COUNT(*) FROM biens WHERE 1=1
  AND ville = ? 
  AND statut = ? 
  AND type = ?;

SELECT id, titre, description, type, statut, prix, surface, 
       adresse, ville, photo_url, created_at 
FROM biens 
WHERE 1=1
  AND ville = ?
  AND statut = ?
  AND type = ?
ORDER BY created_at DESC 
LIMIT ? OFFSET ?;
```

## 4. Fonctionnalités implémentées

### Authentification JWT + bcrypt
**Description** : Système complet d'inscription et de connexion avec tokens JWT valides 24h.  
**Fichiers** : 
- `backend/internal/handlers/handler_auth.go` (Login, Register)
- `backend/internal/middleware/mw_auth.go` (vérification token)
- `frontend/src/context/AuthContext.jsx` (gestion état client)  
**Fonctionnement** :
1. L'utilisateur soumet email/mot de passe
2. Le backend compare le hash bcrypt avec celui en base
3. Génération d'un JWT signé avec `JWT_SECRET`
4. Stockage côté client dans `localStorage`
5. Injection automatique dans les headers API via `api.js`

### Gestion des rôles (admin, commercial, client)
**Description** : Autorisation basée sur le rôle dans le token JWT.  
**Fichiers** :
- `backend/internal/middleware/mw_auth.go` (fonction `RequireRole`)
- `frontend/src/App.jsx` (affichage conditionnel des boutons)  
**Fonctionnement** :
- Middleware Go vérifie le champ `role` dans les claims JWT
- Interface React masque les actions non autorisées
- Exemple : seuls les `commercial` et `admin` voient le bouton "Supprimer un bien"
- Assignation automatique du `commercial_id` lors de la création d'un bien (via `claims.UserID`)

### CRUD des biens avec filtres
**Description** : Opérations complètes Create, Read, Update, Delete avec système de filtres avancé.  
**Fichiers** :
- `backend/internal/handlers/handler_bien.go` (5 fonctions HTTP)
- `frontend/src/pages/Bienspage.jsx` (interface avec filtres)  
**Fonctionnement** :
- **Create** : `POST /biens` avec validation côté backend
- **Read** : `GET /biens` avec filtres ville/statut/type et pagination
- **Update** : `PUT /biens/{id}` (réservé aux commerciaux)
- **Delete** : `DELETE /biens/{id}` (avec confirmation client)
- Filtres côté serveur via paramètres query string

### Page publique avec pagination
**Description** : Page d'accueil accessible sans authentification présentant les biens disponibles.  
**Fichiers** :
- `frontend/src/pages/HomePage.jsx` (composant principal)
- `backend/internal/handlers/handler_bien.go` (endpoint public `/biens`)  
**Fonctionnement** :
- Appel API sans token d'authentification
- Pagination côté serveur (9 biens par page)
- Interface utilisateur avec boutons "Précédent/Suivant"
- Calcul automatique du nombre total de pages

### Upload d'image par URL
**Description** : Ajout d'images via URL externe plutôt que par upload direct.  
**Fichiers** :
- `frontend/src/pages/Createbienpage.jsx` (champ `photo_url`)
- `backend/internal/handlers/handler_bien.go` (stockage en base)  
**Fonctionnement** :
1. L'utilisateur saisit une URL vers une image hébergée (Unsplash, etc.)
2. L'URL est validée côté client (format) et stockée en base
3. L'affichage utilise la balise `<img src="...">` directement
4. Alternative : placeholder si aucune URL fournie

### Interface responsive
**Description** : Design adaptatif utilisant CSS Grid et Flexbox.  
**Fichiers** :
- Tous les composants React utilisent des `styles` inline
- `frontend/src/App.css` (styles globaux et navbar)  
**Fonctionnement** :
- Grilles CSS : `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- Media queries implicites via `auto-fill` et `minmax`
- Unités relatives (`rem`, `%`) pour le scaling
- Navbar qui s'adapte aux petits écrans

### Limitations actuelles
- **Photos multiples** : la table `photos` est définie mais non exploitée dans l'interface
- **Transactions** : la table `transactions` existe mais aucun handler ne l'utilise
- **Gestion avancée des agences** : aucune interface dédiée pour administrer les agences
- **Validation côté client** : limitée (prix positif), pas de validation avancée des URLs d'image

## 5. Sécurité

### Hashage bcrypt
**Implémentation** : Utilisation de la bibliothèque `golang.org/x/crypto/bcrypt`  
```go
hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
bcrypt.CompareHashAndPassword(storedHash, []byte(input))
```
**Avantages** :
- Salt automatique intégré
- Coût de hashage ajustable (résistant aux attaques par force brute)
- Protection contre les attaques rainbow table

### Requêtes paramétrées (anti-injection SQL)
**Implémentation** : Utilisation exclusive de `?` placeholders avec `database/sql`  
```go
db.QueryRow("SELECT * FROM users WHERE email = ?", email)
```
**Avantages** :
- Échappement automatique des valeurs
- Séparation claire entre code SQL et données
- Protection complète contre les injections SQL

### Middleware JWT
**Implémentation** : Vérification automatique sur les routes protégées  
```go
func AuthMiddleware(next http.Handler) http.Handler {
    // Extraction du header Authorization
    // Validation de la signature avec JWT_SECRET
    // Injection des claims dans le contexte
}
```
**Fonctionnalités** :
- Vérification de la présence du token
- Validation de la signature HMAC
- Vérification de l'expiration (`exp` claim)
- Propagation du `user_id` et `role` aux handlers

### Gestion des rôles côté backend
**Implémentation** : Vérification en deux étapes  
1. **Middleware global** : `AuthMiddleware` sur le groupe de routes
2. **Vérification fine** : `RequireRole` ou vérification manuelle dans les handlers
```go
claims, _ := r.Context().Value(middleware.UserKey).(*middleware.Claims)
if claims.Role != "admin" {
    http.Error(w, "Accès refusé", http.StatusForbidden)
    return
}
```

## 6. Bonnes pratiques appliquées

### Principes SOLID appliqués à Go
| Principe | Application dans le projet |
|----------|----------------------------|
| **Single Responsibility** | Un fichier = une responsabilité (models, handlers, middleware) |
| **Open/Closed** | Handlers extensibles via composition de middleware |
| **Liskov Substitution** | Interfaces implicites Go (`http.Handler`) |
| **Interface Segregation** | Interfaces minimales (`database.DB` global) |
| **Dependency Inversion** | Injection de dépendances via `context.Context` |

### Organisation du code
**Backend** :
- Package `internal` pour code non-exportable
- Séparation claire modèles/handlers/middleware
- Fonctions HTTP pures (pas de logique métier directe dans `main.go`)

**Frontend** :
- Composants par fonctionnalité (dossier `pages/`)
- Logique API centralisée dans `api.js`
- État d'authentification global via `AuthContext`

### Variables d'environnement
**Configuration externe** via fichier `.env` :
```env
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ymmo
JWT_SECRET=secret_complexe_ici
PORT=8080
```
**Chargement** : `godotenv.Load()` au démarrage du serveur

### Versioning Git
**Structure de branches** :
- `main` : version stable
- `dev` : développement actuel
- Branches feature pour les nouvelles fonctionnalités

**Conventions de commit** :
- Messages en français
- Format : `[type] description`
- Exemple : `[auth] Ajout middleware JWT`

## 7. Guide de démarrage

### Prérequis
- **Go** 1.21+ (backend)
- **Node.js** 18+ et npm (frontend)
- **MariaDB** 10.6+ (ou MySQL 8+)
- **Git** pour le versioning

### Installation backend
```bash
cd backend
cp .env.exemple .env
# Éditer .env avec vos paramètres de base de données
go mod download
go run cmd/main.go
```

### Installation frontend
```bash
cd frontend
npm install
npm run dev
```

### Variables d'environnement nécessaires
```env
# Backend (.env)
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ymmo
JWT_SECRET=une_phrase_secrete_longue_et_complexe
PORT=8080

# Frontend (modifier src/api.js si nécessaire)
BASE_URL=http://localhost:8080
```

### Initialisation de la base de données
```bash
mysql -u root -p < backend/init.sql
```
*Le script crée :*
1. Base de données `ymmo`
2. Tables avec clés étrangères
3. Données de test (agences, utilisateurs, biens)

### Lancer le projet
1. **Démarrer la base de données** : `sudo systemctl start mariadb`
2. **Lancer le backend** : `cd backend && go run cmd/main.go`
3. **Lancer le frontend** : `cd frontend && npm run dev`
4. **Accéder à l'application** : http://localhost:5173

### Comptes de test
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@ymmo.fr` | `password` | Admin |
| `jean.dupont@ymmo.fr` | `password` | Commercial |
| `sophie.martin@ymmo.fr` | `password` | Commercial |
| `client@test.fr` | `password` | Client |

## 8. Perspectives d'évolution

### Fonctionnalités envisagées
- **Recherche plein texte** sur les descriptions
- **Système de favoris** pour les clients
- **Notifications** par email (nouvelles offres)
- **Dashboard admin** avec statistiques
- **API documentation** avec Swagger/OpenAPI

### Améliorations techniques
- **Tests unitaires** et d'intégration
- **Conteneurisation** avec Docker
- **CI/CD** pipeline automatisé
- **Monitoring** avec métriques Prometheus

---