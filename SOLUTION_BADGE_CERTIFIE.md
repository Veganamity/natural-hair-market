# ✅ Solution pour le Badge Salon Certifié - "Failed to fetch"

## 🔧 Modifications effectuées

### 1. Configuration Supabase mise à jour ✅

Le fichier `.env` a été mis à jour avec vos nouvelles credentials :

```env
VITE_SUPABASE_URL=https://tergjlwermtignqmsnys.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcmdqbHdlcm10aWducW1zbnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzg4MzcsImV4cCI6MjA3ODY1NDgzN30.kUfEjoM6K3kZxxUjTkzubG5BmcAThOaohIX9VsMgaDk
```

## 🚨 Action requise de votre part

### Le problème "Failed to fetch"

Cette erreur signifie que les **Edge Functions** n'existent pas encore sur votre nouvelle instance Supabase (`tergjlwermtignqmsnys`).

### 📋 Checklist pour résoudre le problème

#### ✅ Étape 1 : Vérifier/Appliquer les migrations

1. Connectez-vous au dashboard Supabase :
   https://supabase.com/dashboard/project/tergjlwermtignqmsnys

2. Allez dans **SQL Editor**

3. Vérifiez si la table `salon_verifications` existe :
   ```sql
   SELECT * FROM salon_verifications LIMIT 1;
   ```

4. Si la table n'existe pas, exécutez la migration :
   - Ouvrez le fichier `supabase/migrations/20251123092724_add_verification_and_safety_features.sql`
   - Copiez tout le contenu
   - Collez-le dans le SQL Editor
   - Exécutez

#### ✅ Étape 2 : Déployer les Edge Functions

**Option A : Via script automatisé (recommandé)**

```bash
# Pour les fonctions du badge uniquement
./deploy-functions.sh

# OU pour toutes les fonctions de l'application
./deploy-all-functions.sh
```

**Option B : Via Supabase CLI manuellement**

```bash
# Installer Supabase CLI si nécessaire
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref tergjlwermtignqmsnys

# Déployer les fonctions essentielles
supabase functions deploy submit-salon-verification
supabase functions deploy get-my-salon-verification
supabase functions deploy get-salon-verifications
supabase functions deploy approve-salon-verification
supabase functions deploy reject-salon-verification
```

**Option C : Via le Dashboard Supabase**

1. Allez sur https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions
2. Cliquez sur "Create a new function"
3. Pour chaque fonction, créez-la avec le code correspondant depuis :
   - `supabase/functions/submit-salon-verification/index.ts`
   - `supabase/functions/get-my-salon-verification/index.ts`

#### ✅ Étape 3 : Vérifier le déploiement

1. Allez sur https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions
2. Vous devriez voir au minimum ces fonctions :
   - ✓ `submit-salon-verification`
   - ✓ `get-my-salon-verification`

#### ✅ Étape 4 : Tester l'application

1. Redémarrez votre serveur de dev (si en cours)
2. Connectez-vous à l'application
3. Allez sur "Demander le badge certifié"
4. Remplissez et soumettez le formulaire

**Résultat attendu** : Message de succès au lieu de "Failed to fetch"

## 📁 Fichiers créés pour vous aider

| Fichier | Description |
|---------|-------------|
| `DEPLOIEMENT_EDGE_FUNCTIONS.md` | Guide détaillé de déploiement |
| `deploy-functions.sh` | Script pour déployer les fonctions du badge |
| `deploy-all-functions.sh` | Script pour déployer toutes les fonctions |
| `VERIFICATION_MIGRATION_BADGE.md` | Guide de vérification des migrations |
| `SOLUTION_BADGE_CERTIFIE.md` | Ce fichier (récapitulatif) |

## 🔍 Dépannage

### L'erreur persiste après le déploiement

1. **Vérifier les logs** :
   https://supabase.com/dashboard/project/tergjlwermtignqmsnys/logs/edge-functions

2. **Vérifier que vous êtes connecté** :
   - Ouvrez la console du navigateur (F12)
   - Tapez : `localStorage.getItem('supabase.auth.token')`
   - Vous devriez voir un token

3. **Vider le cache** :
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

### Erreur d'authentification

Si vous voyez "Unauthorized" dans les logs :
- Vérifiez que vous êtes bien connecté
- Réessayez de vous déconnecter/reconnecter

### Les fonctions ne se déploient pas

Si vous avez des erreurs lors du déploiement :
1. Vérifiez que vous avez les bonnes permissions sur le projet
2. Essayez de vous reconnecter : `supabase login`
3. Vérifiez que vous avez lié le bon projet

## 🎯 Pour aller plus loin

### Créer un compte administrateur

Pour pouvoir approuver/rejeter les demandes de badge :

```sql
-- Dans le SQL Editor de Supabase
UPDATE profiles
SET is_admin = true
WHERE id = 'VOTRE_USER_ID';
```

Pour trouver votre `user_id` :
```sql
SELECT id, email FROM auth.users WHERE email = 'votre@email.com';
```

### Déployer toutes les autres fonctions

Pour que toute l'application fonctionne (paiements, expédition, etc.) :

```bash
./deploy-all-functions.sh
```

## 📞 Support

Si vous rencontrez toujours des problèmes :
1. Vérifiez le fichier `VERIFICATION_MIGRATION_BADGE.md`
2. Consultez les logs Supabase
3. Vérifiez que toutes les étapes ci-dessus sont complétées

## ✅ Résumé des actions

- [x] Fichier `.env` mis à jour
- [ ] Migrations vérifiées/appliquées
- [ ] Edge Functions déployées
- [ ] Test de l'application réussi

Une fois ces 4 étapes terminées, le badge de certification fonctionnera parfaitement ! 🎉
