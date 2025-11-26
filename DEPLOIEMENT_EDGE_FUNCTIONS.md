# Guide de déploiement des Edge Functions pour le badge Salon Certifié

## ⚠️ Important
Les edge functions doivent être déployées manuellement sur votre instance Supabase pour que le badge de certification fonctionne.

## Instance Supabase actuelle
- URL: `https://tergjlwermtignqmsnys.supabase.co`
- Projet ID: `tergjlwermtignqmsnys`

## Étapes de déploiement

### 1. Installer Supabase CLI (si pas déjà fait)
```bash
npm install -g supabase
```

### 2. Se connecter à Supabase
```bash
supabase login
```

### 3. Lier votre projet local
```bash
supabase link --project-ref tergjlwermtignqmsnys
```

### 4. Déployer les edge functions nécessaires

#### a) Fonction `submit-salon-verification`
```bash
supabase functions deploy submit-salon-verification
```

#### b) Fonction `get-my-salon-verification`
```bash
supabase functions deploy get-my-salon-verification
```

### 5. Vérifier que les fonctions sont déployées
Allez sur votre dashboard Supabase :
- https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions

Vous devriez voir les deux fonctions listées.

## Alternative : Déploiement via le Dashboard

Si vous préférez ne pas utiliser le CLI, vous pouvez déployer manuellement depuis le dashboard :

1. Allez sur https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions
2. Cliquez sur "Create a new function"
3. Pour chaque fonction, copiez le code depuis :
   - `supabase/functions/submit-salon-verification/index.ts`
   - `supabase/functions/get-my-salon-verification/index.ts`

## Fonctions Edge requises pour le système complet

Pour que toute l'application fonctionne, vous devez également déployer :

### Paiements Stripe
- `create-payment-intent`
- `capture-payment`
- `cancel-payment`
- `create-stripe-connect-account`
- `stripe-webhook`

### Expédition
- `get-shipping-methods`
- `create-shipping-label`
- `create-label-colissimo`
- `sendcloud-webhook`

### Vérification Salon (pour administrateurs)
- `get-salon-verifications`
- `approve-salon-verification`
- `reject-salon-verification`

## Commande pour tout déployer en une fois
```bash
supabase functions deploy submit-salon-verification && \
supabase functions deploy get-my-salon-verification && \
supabase functions deploy get-salon-verifications && \
supabase functions deploy approve-salon-verification && \
supabase functions deploy reject-salon-verification && \
supabase functions deploy create-payment-intent && \
supabase functions deploy capture-payment && \
supabase functions deploy cancel-payment && \
supabase functions deploy create-stripe-connect-account && \
supabase functions deploy stripe-webhook && \
supabase functions deploy get-shipping-methods && \
supabase functions deploy create-shipping-label && \
supabase functions deploy create-label-colissimo && \
supabase functions deploy sendcloud-webhook
```

## Vérification du déploiement

Après le déploiement, testez les fonctions en utilisant curl :

```bash
# Test get-my-salon-verification
curl -X POST \
  https://tergjlwermtignqmsnys.supabase.co/functions/v1/get-my-salon-verification \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

Si vous obtenez une réponse (même une erreur d'authentification), cela signifie que la fonction est déployée.

## Dépannage

### Erreur "Failed to fetch"
- Vérifiez que les fonctions sont bien déployées dans le dashboard
- Vérifiez que l'URL dans `.env` est correcte
- Assurez-vous d'être connecté (avoir un access token valide)

### Erreur "Function not found"
- La fonction n'est pas déployée, suivez les étapes ci-dessus

### Erreur CORS
- Les fonctions incluent déjà les headers CORS nécessaires
- Si le problème persiste, vérifiez les logs dans le dashboard Supabase

## Support
Pour voir les logs des edge functions :
https://supabase.com/dashboard/project/tergjlwermtignqmsnys/logs/edge-functions
