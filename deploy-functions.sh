#!/bin/bash

# Script de déploiement des Edge Functions Supabase
# Instance: tergjlwermtignqmsnys

echo "🚀 Déploiement des Edge Functions pour le badge Salon Certifié"
echo "==============================================================="
echo ""

# Vérifier que Supabase CLI est installé
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI n'est pas installé"
    echo "📦 Installation en cours..."
    npm install -g supabase
fi

echo "✅ Supabase CLI est installé"
echo ""

# Vérifier la connexion
echo "🔐 Vérification de la connexion..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté"
    echo "🔑 Connexion à Supabase..."
    supabase login
fi

echo "✅ Connecté à Supabase"
echo ""

# Lier le projet
echo "🔗 Liaison avec le projet tergjlwermtignqmsnys..."
supabase link --project-ref tergjlwermtignqmsnys

echo ""
echo "📤 Déploiement des fonctions essentielles pour le badge..."
echo ""

# Déployer les fonctions pour le badge salon
echo "1️⃣  Déploiement de submit-salon-verification..."
supabase functions deploy submit-salon-verification

echo ""
echo "2️⃣  Déploiement de get-my-salon-verification..."
supabase functions deploy get-my-salon-verification

echo ""
echo "3️⃣  Déploiement de get-salon-verifications (admin)..."
supabase functions deploy get-salon-verifications

echo ""
echo "4️⃣  Déploiement de approve-salon-verification (admin)..."
supabase functions deploy approve-salon-verification

echo ""
echo "5️⃣  Déploiement de reject-salon-verification (admin)..."
supabase functions deploy reject-salon-verification

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "🔍 Vérifiez vos fonctions sur :"
echo "https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions"
echo ""
echo "📝 Pour déployer toutes les autres fonctions (paiements, expédition), exécutez :"
echo "./deploy-all-functions.sh"
