# Vérification des migrations pour le Badge Salon Certifié

## Instance Supabase
- URL: `https://tergjlwermtignqmsnys.supabase.co`
- Projet: `tergjlwermtignqmsnys`

## Vérifications nécessaires

### 1. Vérifier que la table `salon_verifications` existe

Connectez-vous au SQL Editor de Supabase :
https://supabase.com/dashboard/project/tergjlwermtignqmsnys/editor

Exécutez cette requête :

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'salon_verifications';
```

**Résultat attendu** : Une ligne doit apparaître si la table existe.

### 2. Vérifier la structure de la table

```sql
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'salon_verifications'
ORDER BY ordinal_position;
```

**Colonnes attendues** :
- `id` (uuid, NOT NULL, DEFAULT gen_random_uuid())
- `user_id` (uuid, NOT NULL)
- `salon_name` (text, NOT NULL)
- `siret` (text, NOT NULL)
- `address` (text, NOT NULL)
- `phone` (text, nullable)
- `status` (text, NOT NULL, DEFAULT 'pending')
- `admin_notes` (text, nullable)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

### 3. Vérifier les politiques RLS

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'salon_verifications';
```

**Politiques attendues** :
- Users can view their own salon verification request
- Service role can manage all verification requests
- Public can view approved verifications

### 4. Vérifier la colonne `is_salon_verified` dans profiles

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'is_salon_verified';
```

**Résultat attendu** : Une ligne avec `is_salon_verified` (boolean, DEFAULT false)

### 5. Vérifier le trigger pour mettre à jour profiles

```sql
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'salon_verifications';
```

**Trigger attendu** : Un trigger qui met à jour `profiles.is_salon_verified` quand le status devient 'approved'

## Si les tables n'existent pas

Si la table `salon_verifications` n'existe pas, vous devez appliquer la migration :

### Option 1 : Via le SQL Editor

Allez sur https://supabase.com/dashboard/project/tergjlwermtignqmsnys/editor

Exécutez le contenu du fichier :
`supabase/migrations/20251123092724_add_verification_and_safety_features.sql`

### Option 2 : Via Supabase CLI

```bash
supabase db push
```

## Après avoir appliqué les migrations

1. Vérifiez que RLS est activé :
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'salon_verifications';
```

2. Testez l'insertion (devrait échouer sans les bonnes permissions) :
```sql
INSERT INTO salon_verifications (user_id, salon_name, siret, address)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test', '12345678901234', 'Test');
```

**Résultat attendu** : Erreur de permission (c'est bon signe, RLS fonctionne!)

## Configuration des Edge Functions

Une fois les tables créées, déployez les edge functions :

```bash
# Fonctions minimales pour le badge
./deploy-functions.sh

# OU toutes les fonctions
./deploy-all-functions.sh
```

## Test final

1. Connectez-vous à votre application
2. Allez sur la page "Demander le badge certifié"
3. Remplissez le formulaire
4. Soumettez

**Résultat attendu** :
- Pas d'erreur "Failed to fetch"
- Message de succès
- Demande visible dans le dashboard

## Accès administrateur

Pour approuver/rejeter les demandes, créez un utilisateur admin :

```sql
UPDATE profiles
SET is_admin = true
WHERE id = 'VOTRE_USER_ID';
```

Remplacez `VOTRE_USER_ID` par votre ID utilisateur (visible dans la table `auth.users`).
