# 🚨 ACTION URGENTE - Corriger "Failed to fetch" Badge Certifié

## Le problème
Vous obtenez l'erreur **"Failed to fetch"** quand vous essayez de demander le badge salon certifié.

## La cause
Les **Edge Functions** ne sont pas déployées sur votre nouvelle instance Supabase.

## ✅ La solution rapide (3 minutes)

### 1️⃣ Vérifier les migrations (30 secondes)

Allez sur : https://supabase.com/dashboard/project/tergjlwermtignqmsnys/editor

Exécutez :
```sql
SELECT * FROM salon_verifications LIMIT 1;
```

- ✅ **Ça marche ?** → Passez à l'étape 2
- ❌ **Erreur ?** → Ouvrez `supabase/migrations/20251123092724_add_verification_and_safety_features.sql`, copiez tout le contenu, collez dans le SQL Editor et exécutez

### 2️⃣ Déployer les fonctions (2 minutes)

**Option la plus simple** : Exécutez dans votre terminal :

```bash
./deploy-functions.sh
```

Si ça ne marche pas, essayez :

```bash
npm install -g supabase
supabase login
supabase link --project-ref tergjlwermtignqmsnys
supabase functions deploy submit-salon-verification
supabase functions deploy get-my-salon-verification
```

### 3️⃣ Vérifier

Allez sur : https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions

Vous devez voir :
- ✓ submit-salon-verification
- ✓ get-my-salon-verification

### 4️⃣ Tester

1. Redémarrez votre application
2. Connectez-vous
3. Allez sur "Demander le badge certifié"
4. Remplissez et soumettez

➡️ **Résultat** : Plus d'erreur "Failed to fetch" ! ✅

---

## 📚 Documentation complète

Pour plus de détails, consultez :
- `SOLUTION_BADGE_CERTIFIE.md` - Guide complet
- `DEPLOIEMENT_EDGE_FUNCTIONS.md` - Détails du déploiement
- `VERIFICATION_MIGRATION_BADGE.md` - Vérifications techniques

---

## 🆘 Besoin d'aide ?

### Le déploiement échoue ?
```bash
supabase logout
supabase login
# Réessayez
```

### L'erreur persiste ?
1. Vérifiez que vous êtes connecté à l'application
2. Videz le cache (Ctrl+Shift+R)
3. Vérifiez les logs : https://supabase.com/dashboard/project/tergjlwermtignqmsnys/logs/edge-functions

---

## ℹ️ Ce qui a été modifié

✅ Fichier `.env` mis à jour avec vos nouvelles credentials Supabase :
- URL : `https://tergjlwermtignqmsnys.supabase.co`
- ANON_KEY : `eyJh...gaDk`

❌ Les Edge Functions doivent être déployées (étape 2 ci-dessus)

---

**Temps estimé total : 3 minutes** ⏱️
