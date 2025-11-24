# ✅ CONFIGURATION SUPABASE - GUIDE DÉFINITIF

## Ce qui est DÉJÀ fait dans le code

1. ✅ `src/lib/supabaseClient.ts` utilise les variables d'environnement
2. ✅ Tous les composants importent depuis ce fichier unique
3. ✅ Aucune URL ou clé hardcodée dans le code
4. ✅ `.env` local mis à jour
5. ✅ `netlify.toml` contient les bonnes variables

## 🎯 CE QU'IL VOUS RESTE À FAIRE (une seule fois)

### Sur Netlify :

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site
3. Allez dans **Site configuration → Environment variables**
4. Vérifiez que ces variables sont bien définies :
   ```
   VITE_SUPABASE_URL = https://tergjlwermtignqmsnys.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcmdqbHdlcm10aWducW1zbnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzg4MzcsImV4cCI6MjA3ODY1NDgzN30.kUfEjoM6K3kZxxUjTkzubG5BmcAThOaohIX9VsMgaDk
   ```
5. **SUPPRIMEZ** toute variable contenant l'ancienne URL `tkymetexwvmqkahostaz`
6. Cliquez sur **"Trigger deploy"** pour redéployer

### Vérification finale :

Après le déploiement, ouvrez la console de votre navigateur sur votre site et tapez :
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```

Vous devriez voir : `https://tergjlwermtignqmsnys.supabase.co`

## ⚠️ IMPORTANT

**Le fichier `.env` local n'est JAMAIS déployé** pour des raisons de sécurité.
C'est pourquoi vous devez configurer les variables directement sur Netlify.

## 🔧 Alternative automatique

Le fichier `netlify.toml` contient déjà les bonnes valeurs.
Si vous committez et pushez ce fichier, Netlify utilisera automatiquement ces variables.

## 📝 Pour ne PLUS JAMAIS avoir ce problème

Chaque fois que vous changez de projet Supabase :
1. Modifiez UNIQUEMENT `netlify.toml` (lignes 6-7)
2. Commit + push
3. Netlify redéploiera automatiquement avec les nouvelles valeurs
