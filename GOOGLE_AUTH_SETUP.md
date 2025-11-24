# Configuration de l'Authentification Google

⚠️ **ERREUR ACTUELLE** : "Unsupported provider: provider is not enabled"

Cette erreur signifie que le provider Google n'est pas encore activé dans Supabase. Suivez les étapes ci-dessous pour le configurer.

---

## 🚀 Solution Rapide (2 minutes)

### ÉTAPE 1 : Activer Google dans Supabase

1. **Allez dans votre Dashboard Supabase** : https://app.supabase.com/
2. **Sélectionnez votre projet**
3. **Navigation** : Authentication → Providers (dans le menu de gauche)
4. **Trouvez "Google"** dans la liste des providers
5. **Cliquez sur Google** pour ouvrir la configuration
6. **IMPORTANT** : Vous verrez deux options :

#### ✅ Option A : "Use Supabase OAuth" (RECOMMANDÉE - Le plus simple)

1. Sélectionnez **"Use Supabase OAuth"**
2. Activez le toggle **"Enable Google provider"**
3. Cliquez sur **"Save"**
4. ✅ **C'est tout !** L'authentification Google fonctionnera immédiatement

**Avantages** :
- ✨ Aucune configuration Google Cloud nécessaire
- ⚡ Fonctionne immédiatement
- 🔧 Maintenance gérée par Supabase
- 🆓 Gratuit et illimité

**C'est la méthode recommandée pour démarrer rapidement !**

---

#### ⚙️ Option B : "Use your own OAuth credentials" (Avancé)

Si vous préférez utiliser vos propres credentials Google (pour un branding personnalisé par exemple), suivez le guide complet ci-dessous.

---

## 📚 Guide Complet - Option B (Credentials personnalisés)

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur le menu déroulant du projet (en haut à gauche)
3. Cliquez sur **"New Project"**
4. **Nom du projet** : "NaturalHairMarket" (ou votre nom)
5. Cliquez sur **"Create"**
6. Attendez quelques secondes que le projet soit créé
7. Sélectionnez votre nouveau projet dans le menu déroulant

### 2. Configurer l'écran de consentement OAuth

1. Dans le menu ☰ (hamburger), allez à **APIs & Services** > **OAuth consent screen**
2. **User Type** : Sélectionnez **"External"** (accessible à tous)
3. Cliquez sur **"Create"**

4. **Page 1 - OAuth consent screen** :
   - **App name** : `NaturalHairMarket`
   - **User support email** : Votre email
   - **App logo** : (Optionnel) Uploadez un logo
   - **Application home page** : (Optionnel) Votre URL
   - **Application privacy policy** : (Optionnel) URL de votre politique
   - **Developer contact information** : Votre email
   - Cliquez sur **"Save and Continue"**

5. **Page 2 - Scopes** :
   - Cliquez sur **"Add or Remove Scopes"**
   - Sélectionnez ces deux scopes **OBLIGATOIRES** :
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
   - Cliquez sur **"Update"**
   - Cliquez sur **"Save and Continue"**

6. **Page 3 - Test users** (mode Testing) :
   - Cliquez sur **"+ Add Users"**
   - Ajoutez votre email pour tester
   - Cliquez sur **"Save and Continue"**

7. **Page 4 - Summary** :
   - Vérifiez les informations
   - Cliquez sur **"Back to Dashboard"**

### 3. Créer les identifiants OAuth

1. Dans le menu ☰, allez à **APIs & Services** > **Credentials**
2. Cliquez sur **"+ CREATE CREDENTIALS"** (en haut de la page)
3. Sélectionnez **"OAuth client ID"**

4. **Si on vous demande de configurer l'écran de consentement** : Suivez l'étape 2 ci-dessus d'abord

5. Configuration du client OAuth :
   - **Application type** : Sélectionnez **"Web application"**
   - **Name** : `NaturalHairMarket Web Client`

6. **Authorized JavaScript origins** : Laissez vide (pas nécessaire)

7. **Authorized redirect URIs** : **TRÈS IMPORTANT**
   - Cliquez sur **"+ Add URI"**
   - Entrez l'URL de callback Supabase :
     ```
     https://[VOTRE-PROJECT-ID].supabase.co/auth/v1/callback
     ```

   📍 **Comment trouver votre PROJECT-ID Supabase** :
   - Méthode 1 : Dans Supabase → Settings → General → Reference ID
   - Méthode 2 : Dans l'URL de votre dashboard : `https://app.supabase.com/project/[PROJECT-ID]`
   - Méthode 3 : Dans Settings → API → Project URL commence par `https://[PROJECT-ID].supabase.co`

   **Exemple** : Si votre Project ID est `abcdefghijklmnop`, l'URL sera :
   ```
   https://abcdefghijklmnop.supabase.co/auth/v1/callback
   ```

8. Cliquez sur **"Create"**

9. **IMPORTANT** : Une popup s'affiche avec vos credentials :
   - 📋 **Client ID** : Copiez-le quelque part (commence par un nombre long)
   - 🔒 **Client secret** : Copiez-le également (chaîne aléatoire)
   - Vous pouvez toujours les retrouver dans Credentials plus tard

### 4. Configurer dans Supabase

1. Retournez dans votre [Dashboard Supabase](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Allez à **Authentication** → **Providers**
4. Cliquez sur **"Google"**

5. Configuration :
   - **Enabled** : Activez le toggle (doit devenir vert) ✅
   - Sélectionnez **"Use your own OAuth credentials"**
   - **Client ID (for OAuth)** : Collez le Client ID de Google Cloud
   - **Client Secret (for OAuth)** : Collez le Client Secret de Google Cloud
   - **Skip nonce checks** : Laissez décoché
   - **Authorized Client IDs** : Laissez vide

6. **Vérifiez la Redirect URL** (affichée en bas) :
   ```
   https://[votre-project-id].supabase.co/auth/v1/callback
   ```
   Cette URL doit correspondre EXACTEMENT à celle configurée dans Google Cloud Console

7. Cliquez sur **"Save"**

### 5. Tester l'authentification

1. Rafraîchissez votre application
2. Cliquez sur **"Continuer avec Google"** ou **"S'inscrire avec Google"**
3. Vous devriez être redirigé vers la page de connexion Google
4. Sélectionnez votre compte Google
5. Acceptez les permissions demandées
6. Vous devriez être redirigé vers votre application, connecté !

---

## 🔍 Vérification de la configuration

### Dans Google Cloud Console

✅ Écran de consentement OAuth configuré (External)
✅ Scopes ajoutés : userinfo.email, userinfo.profile
✅ Client OAuth créé (type: Web application)
✅ Redirect URI ajouté : `https://[project-id].supabase.co/auth/v1/callback`

### Dans Supabase

✅ Provider Google : **Enabled** (toggle vert)
✅ Client ID : Rempli (commence par un nombre)
✅ Client Secret : Rempli (chaîne aléatoire)
✅ Redirect URL : Correspond à celle de Google Cloud

---

## 🆘 Dépannage

### Erreur : "Unsupported provider: provider is not enabled"
➡️ **Solution** : Le provider Google n'est pas activé dans Supabase
- Allez dans Authentication → Providers → Google
- Activez le toggle "Enable Google provider"
- Cliquez sur "Save"

### Erreur : "redirect_uri_mismatch"
➡️ **Solution** : L'URL de redirection ne correspond pas
- Vérifiez que l'URL dans Google Cloud Console est EXACTEMENT :
  ```
  https://[VOTRE-PROJECT-ID].supabase.co/auth/v1/callback
  ```
- Pas d'espace, pas de slash final
- Vérifiez votre Project ID dans Supabase (Settings → General)

### Erreur : "invalid_client"
➡️ **Solution** : Les credentials sont incorrects
- Vérifiez que le Client ID et Client Secret sont corrects dans Supabase
- Copiez-collez à nouveau depuis Google Cloud Console
- Assurez-vous qu'il n'y a pas d'espaces avant/après

### Erreur : "Access blocked: This app's request is invalid"
➡️ **Solution** : L'écran de consentement n'est pas configuré
- Retournez dans Google Cloud Console
- Configurez l'écran de consentement OAuth (étape 2)
- Ajoutez les scopes email et profile

### L'utilisateur se connecte mais n'apparaît pas dans ma base de données
➡️ **Solution** : Le profil n'est pas créé automatiquement
- Supabase crée l'utilisateur dans `auth.users` automatiquement
- Vérifiez que vous avez un trigger ou du code pour créer le profil dans `public.profiles`
- Exemple de trigger à créer dans Supabase SQL Editor :

```sql
-- Trigger pour créer automatiquement un profil après l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 📌 URLs importantes

- **Google Cloud Console** : https://console.cloud.google.com/
- **Supabase Dashboard** : https://app.supabase.com/
- **Documentation Supabase OAuth** : https://supabase.com/docs/guides/auth/social-login/auth-google

---

## 🔒 Notes de sécurité

- ⚠️ Ne partagez JAMAIS votre Client Secret publiquement
- 🔐 Le Client Secret doit rester privé et sécurisé
- 🌍 En mode "External", limitez les domaines autorisés en production
- ✉️ Vérifiez les emails si nécessaire dans Supabase (Authentication → Settings)
- 🚀 En production, passez votre app Google en "In Production" (OAuth consent screen)

---

## 💡 Conseils

### Pour le développement
- Utilisez "Use Supabase OAuth" pour tester rapidement
- Mode "External" avec test users suffit

### Pour la production
- Créez vos propres credentials Google
- Passez votre app Google en mode "In Production"
- Ajoutez votre domaine de production dans les redirect URIs
- Configurez correctement les politiques de confidentialité et CGU
