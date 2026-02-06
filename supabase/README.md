# 🗄️ Configuration Supabase pour GoBénin

## 📋 Étapes d'installation

### 1. Créer les tables

Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard) et accédez à l'éditeur SQL.

Exécutez les scripts dans l'ordre :

1. **`migrations/001_create_tables.sql`** - Crée toutes les tables
2. **`migrations/002_seed_data.sql`** - Insère les données initiales

### 2. Configurer l'authentification

Dans le Dashboard Supabase :

1. Allez dans **Authentication > Providers**
2. Activez **Email** (déjà actif par défaut)
3. Pour Google OAuth :
   - Activez **Google**
   - Configurez avec vos credentials Google Cloud Console
   - Ajoutez `http://localhost:5173` aux URLs de redirection autorisées

### 3. Variables d'environnement

Le fichier `.env` est déjà configuré avec :

```env
VITE_SUPABASE_URL=https://qdueesyzwcpjwtmninez.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

## 📊 Structure des tables

### `destinations`
Sites touristiques (featured, heritage, nearby)

### `tours`
Circuits et excursions

### `user_profiles`
Extension des utilisateurs auth.users

### `bookings`
Réservations des utilisateurs

### `reviews`
Avis et notes des utilisateurs

### `favorites`
Favoris des utilisateurs

## 🔒 Row Level Security (RLS)

Toutes les tables ont RLS activé :

- **destinations/tours** : Lecture publique
- **user_profiles** : Lecture/écriture sur son propre profil
- **bookings** : Uniquement ses propres réservations
- **reviews** : Lecture publique, écriture pour l'auteur
- **favorites** : Uniquement ses propres favoris

## 🚀 Utilisation dans le code

```tsx
import { useDestinations, useTours, useSearch } from './lib/hooks/useSupabase';
import { useAuth } from './contexts/AuthContext';

// Destinations
const { destinations, loading } = useDestinations('featured');

// Recherche
const { results } = useSearch('ouidah', 'fr');

// Auth
const { user, signIn, signUp, signOut } = useAuth();
```
