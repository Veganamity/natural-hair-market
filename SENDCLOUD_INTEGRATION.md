# Intégration Sendcloud - Guide de Configuration

## Vue d'ensemble

L'intégration Sendcloud a été complètement mise en place dans votre application. Voici ce qui a été implémenté :

## 1. Base de données

### Nouveaux champs dans la table `transactions` :
- `shipping_label_url` : URL du PDF de l'étiquette d'expédition
- `sendcloud_parcel_id` : ID du colis dans Sendcloud
- `shipping_status` : Statut d'expédition (pending, label_created, shipped, in_transit, delivered, exception, cancelled)

## 2. Edge Functions Supabase

### `/create-shipping-label`
- **Déclencheur** : Appelé automatiquement après un paiement Stripe réussi
- **Fonction** :
  - Récupère les adresses du vendeur et de l'acheteur
  - Crée un colis dans Sendcloud via leur API
  - Génère l'étiquette d'expédition (PDF)
  - Sauvegarde l'URL de l'étiquette et le numéro de suivi dans la base de données

### `/sendcloud-webhook`
- **Déclencheur** : Webhook Sendcloud lors de mises à jour de statut
- **Fonction** :
  - Reçoit les mises à jour de tracking
  - Met à jour automatiquement le statut d'expédition
  - Met à jour les dates d'expédition et de livraison

### `/stripe-webhook` (mis à jour)
- Appelle automatiquement `/create-shipping-label` après `payment_intent.succeeded`

## 3. Interface Vendeur

### Composant `ShippingLabelManager`
Affiché dans le dashboard vendeur avec :
- Bouton "Générer l'étiquette d'expédition"
- Badge de statut d'expédition
- Bouton "Télécharger l'étiquette (PDF)"
- Affichage du numéro de suivi
- Lien vers le tracking Sendcloud

## 4. Interface Acheteur

### Composant `TrackingInfo`
Affiché dans le dashboard acheteur avec :
- Statut de livraison avec icône
- Numéro de suivi
- Dates d'expédition et de livraison
- Bouton "Suivre mon colis" (lien Sendcloud)

## Configuration requise

### 1. Créer un compte Sendcloud
1. Créez un compte sur [Sendcloud](https://panel.sendcloud.sc/)
2. Allez dans Settings → API
3. Créez une nouvelle intégration API

### 2. Configurer les méthodes d'expédition
1. Dans Sendcloud, allez dans Settings → Shipping Methods
2. Configurez vos transporteurs (Colissimo, Chronopost, etc.)
3. Notez le `shipment ID` de votre méthode par défaut

### 3. Configuration des secrets Supabase

Vous devez ajouter ces secrets dans Supabase :

```bash
# Dans le dashboard Supabase : Project Settings → Edge Functions → Secrets
SENDCLOUD_API_KEY=votre_api_key
SENDCLOUD_API_SECRET=votre_api_secret
```

### 4. Configurer le webhook Sendcloud

1. Dans Sendcloud, allez dans Settings → Integrations → Webhooks
2. Créez un nouveau webhook avec l'URL :
   ```
   https://tergjlwermtignqmsnys.supabase.co/functions/v1/sendcloud-webhook
   ```
3. Sélectionnez tous les événements de tracking

### 5. Mettre à jour le shipment ID

Dans le fichier `/supabase/functions/create-shipping-label/index.ts`, ligne 127 :
```typescript
shipment: {
  id: 8,  // Remplacez par votre shipment ID
},
```

## Flux de travail

### Après un achat :
1. Le paiement Stripe est confirmé
2. Le webhook Stripe appelle automatiquement `create-shipping-label`
3. Une étiquette est générée via l'API Sendcloud
4. L'étiquette PDF et le numéro de suivi sont sauvegardés
5. Le vendeur peut télécharger l'étiquette dans son dashboard
6. L'acheteur voit le numéro de suivi et peut suivre son colis

### Pendant l'expédition :
1. Les webhooks Sendcloud mettent à jour le statut automatiquement
2. Le vendeur et l'acheteur voient les mises à jour en temps réel
3. Les dates d'expédition et de livraison sont enregistrées

## Test de l'intégration

### 1. Test de génération d'étiquette
- Créez une transaction de test
- Vérifiez que l'étiquette est générée automatiquement
- Téléchargez le PDF via le dashboard vendeur

### 2. Test du webhook
- Utilisez le mode test de Sendcloud
- Simulez des changements de statut
- Vérifiez que la base de données est mise à jour

## Support

Si l'étiquette ne se génère pas automatiquement :
1. Le vendeur peut cliquer sur "Générer l'étiquette d'expédition"
2. Vérifiez que les adresses sont complètes dans les profils
3. Vérifiez les logs des Edge Functions dans Supabase

## Personnalisation

### Modifier le poids par défaut
Ligne 121 de `/supabase/functions/create-shipping-label/index.ts` :
```typescript
const weight = transaction.listing?.hair_weight?.replace(/[^\d]/g, "") || "100";
```

### Modifier le transporteur
Changez le `shipment.id` pour utiliser un autre transporteur configuré dans Sendcloud.
