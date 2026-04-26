#!/bin/bash

# Script de déploiement de TOUTES les Edge Functions Supabase
# Instance: tergjlwermtignqmsnys

echo "🚀 Déploiement de TOUTES les Edge Functions"
echo "==========================================="
echo ""

# Liste de toutes les fonctions
functions=(
  "submit-salon-verification"
  "get-my-salon-verification"
  "get-salon-verifications"
  "approve-salon-verification"
  "reject-salon-verification"
  "create-payment-intent"
  "capture-payment"
  "cancel-payment"
  "create-stripe-connect-account"
  "stripe-webhook"
  "get-shipping-methods"
  "create-shipping-label"
  "create-label-colissimo"
  "sendcloud-webhook"
)

total=${#functions[@]}
current=0

for func in "${functions[@]}"
do
  current=$((current + 1))
  echo ""
  echo "[$current/$total] 📤 Déploiement de $func..."
  supabase functions deploy "$func"

  if [ $? -eq 0 ]; then
    echo "✅ $func déployé avec succès"
  else
    echo "❌ Erreur lors du déploiement de $func"
  fi
done

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🔍 Vérifiez vos fonctions sur :"
echo "https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions"
echo ""
echo "📊 Voir les logs :"
echo "https://supabase.com/dashboard/project/tergjlwermtignqmsnys/logs/edge-functions"
