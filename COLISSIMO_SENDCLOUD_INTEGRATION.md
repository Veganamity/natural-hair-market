# Intégration Combinée Colissimo + Sendcloud

## Vue d'ensemble

Le système intègre maintenant deux fournisseurs d'expédition qui sont sélectionnés automatiquement selon la destination :

- **Colissimo** : Pour tous les envois en France (API officielle Colissimo)
- **Sendcloud** : Pour tous les envois internationaux

## Architecture

### Routage Automatique

L'Edge Function `create-shipping-label` analyse la destination et route automatiquement vers le bon fournisseur :

```typescript
if (destination === "FR" || destination === "France") {
  // Utilise l'API Colissimo
} else {
  // Utilise l'API Sendcloud
}
```

## Edge Functions Déployées

### 1. `/create-label-colissimo`
**Fournisseur** : API officielle Colissimo
**Usage** : Envois en France uniquement

**Fonctionnalités** :
- Génère une étiquette PDF via l'API Colissimo officielle
- Sélection automatique du produit selon le poids :
  - `DOM` : Colissimo Domicile (≤250g)
  - `DOS` : Colissimo Domicile Sans Signature (>250g)
- Retourne l'étiquette PDF et le numéro de suivi
- Sauvegarde dans la base de données

**Format de requête Colissimo** :
```json
{
  "contractNumber": "VOTRE_NUMERO_CONTRAT",
  "password": "VOTRE_MOT_DE_PASSE",
  "outputFormat": {
    "outputPrintingType": "PDF_A4_300dpi"
  },
  "letter": {
    "service": {
      "productCode": "DOM",
      "depositDate": "2025-11-22",
      "orderNumber": "transaction-id"
    },
    "parcel": {
      "weight": 100
    },
    "sender": { ... },
    "addressee": { ... }
  }
}
```

### 2. `/create-shipping-label`
**Rôle** : Routeur intelligent

**Logique** :
1. Récupère les informations de la transaction
2. Vérifie le pays de destination
3. Si France → Appelle `/create-label-colissimo`
4. Sinon → Utilise Sendcloud

### 3. `/get-shipping-methods`
**Fournisseur** : Sendcloud
**Usage** : Récupération des transporteurs disponibles

Retourne la liste des transporteurs avec leurs tarifs en temps réel.

## Base de Données

### Nouveaux champs dans `transactions`

```sql
shipping_carrier          text      -- Nom du transporteur (ex: "Colissimo", "DHL")
shipping_carrier_id       integer   -- ID Sendcloud du transporteur
shipping_price            numeric   -- Coût d'expédition
shipping_label_url        text      -- URL du PDF de l'étiquette
tracking_number           text      -- Numéro de suivi universel
shipping_status           text      -- Statut d'expédition
sendcloud_parcel_id       text      -- ID Sendcloud (si applicable)
colissimo_parcel_number   text      -- Référence Colissimo (si applicable)
```

## Configuration Requise

### Secrets Colissimo

Dans Supabase Dashboard → Edge Functions → Secrets :

```bash
COLISSIMO_API_KEY=votre_api_key
COLISSIMO_PASSWORD=votre_mot_de_passe
COLISSIMO_ACCOUNT_NUMBER=votre_numero_contrat
```

### Obtenir vos credentials Colissimo

1. Créer un compte professionnel sur [Colissimo Business](https://www.colissimo.entreprise.laposte.fr/)
2. Souscrire à un contrat Colissimo
3. Accéder à l'espace client pour obtenir :
   - Numéro de contrat
   - Mot de passe API
4. Activer l'accès aux Web Services

### Secrets Sendcloud

Déjà configurés (voir `SENDCLOUD_INTEGRATION.md`) :

```bash
SENDCLOUD_API_KEY=votre_sendcloud_key
SENDCLOUD_API_SECRET=votre_sendcloud_secret
```

## Flux de Travail

### Pour un envoi en France

1. L'acheteur passe commande
2. Le paiement Stripe est confirmé
3. Le webhook Stripe appelle `create-shipping-label`
4. Le système détecte la destination France
5. Appel automatique à `create-label-colissimo`
6. L'API Colissimo génère l'étiquette PDF
7. L'étiquette et le numéro de suivi sont sauvegardés
8. Le vendeur peut télécharger l'étiquette dans son dashboard

### Pour un envoi international

1. L'acheteur passe commande
2. Le paiement Stripe est confirmé
3. Le webhook Stripe appelle `create-shipping-label`
4. Le système détecte une destination hors France
5. Utilisation de Sendcloud avec le transporteur sélectionné
6. L'API Sendcloud génère l'étiquette
7. L'étiquette et le numéro de suivi sont sauvegardés
8. Le vendeur peut télécharger l'étiquette dans son dashboard

## Avantages de cette Architecture

### Pour le vendeur
- **Aucune différence visible** : Le vendeur voit simplement une étiquette PDF
- **Processus unifié** : Même interface pour France et International
- **Optimisation automatique** : Meilleurs tarifs selon la destination

### Pour la plateforme
- **Colissimo pour la France** : Tarifs préférentiels et fiabilité
- **Sendcloud pour l'international** : Large choix de transporteurs
- **Scalabilité** : Facile d'ajouter d'autres fournisseurs

### Technique
- **Routage transparent** : Le code frontend n'a pas besoin de savoir quel fournisseur est utilisé
- **Maintenabilité** : Chaque fournisseur dans sa propre Edge Function
- **Flexibilité** : Facile de modifier les règles de routage

## Suivi des Colis

### Pour Colissimo
URL de suivi : `https://www.laposte.fr/outils/suivre-vos-envois?code={tracking_number}`

### Pour Sendcloud
URL de suivi : `https://tracking.sendcloud.sc/forward?carrier=&tracking_number={tracking_number}`

Le composant `TrackingInfo` gère automatiquement le lien correct selon le transporteur.

## Test de l'Intégration

### Test Colissimo (France)
1. Créer une transaction avec une adresse française
2. Vérifier que `shipping_carrier` = "Colissimo"
3. Télécharger l'étiquette PDF
4. Vérifier le numéro de suivi Colissimo

### Test Sendcloud (International)
1. Créer une transaction avec une adresse hors France
2. Vérifier que le transporteur sélectionné est utilisé
3. Télécharger l'étiquette PDF
4. Vérifier le numéro de suivi Sendcloud

## Dépannage

### Erreur Colissimo
- Vérifier les credentials dans les secrets Supabase
- Vérifier que le contrat Colissimo est actif
- Vérifier les logs : `supabase functions logs create-label-colissimo`

### Erreur Sendcloud
- Vérifier les credentials Sendcloud
- Vérifier que les transporteurs sont configurés dans Sendcloud
- Vérifier les logs : `supabase functions logs create-shipping-label`

## Evolution Future

Possibilités d'extension :
- Ajouter Chronopost pour les envois express France
- Ajouter DPD pour certaines destinations européennes
- Implémenter un système de fallback si un fournisseur est indisponible
- Ajouter la sélection manuelle du fournisseur pour le vendeur
