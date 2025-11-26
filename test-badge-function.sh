#!/bin/bash

# Script de test rapide pour vérifier si les Edge Functions du badge sont déployées
# Instance: tergjlwermtignqmsnys

echo "🔍 Test des Edge Functions du badge salon certifié"
echo "===================================================="
echo ""

BASE_URL="https://tergjlwermtignqmsnys.supabase.co/functions/v1"

# Couleurs pour le terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🌐 URL de base : $BASE_URL"
echo ""

# Test de la fonction get-my-salon-verification
echo "1️⃣  Test de get-my-salon-verification..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/get-my-salon-verification" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test" \
  --max-time 5)

if [ "$response" == "000" ]; then
  echo -e "${RED}❌ Fonction NON déployée (timeout ou erreur réseau)${NC}"
  echo "   → Vous devez déployer la fonction"
elif [ "$response" == "404" ]; then
  echo -e "${RED}❌ Fonction NON trouvée (404)${NC}"
  echo "   → Vous devez déployer la fonction"
elif [ "$response" == "400" ] || [ "$response" == "401" ]; then
  echo -e "${GREEN}✅ Fonction déployée !${NC}"
  echo "   (Erreur d'authentification normale sans token valide)"
else
  echo -e "${YELLOW}⚠️  Réponse inattendue : $response${NC}"
fi

echo ""

# Test de la fonction submit-salon-verification
echo "2️⃣  Test de submit-salon-verification..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/submit-salon-verification" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test" \
  --max-time 5)

if [ "$response" == "000" ]; then
  echo -e "${RED}❌ Fonction NON déployée (timeout ou erreur réseau)${NC}"
  echo "   → Vous devez déployer la fonction"
elif [ "$response" == "404" ]; then
  echo -e "${RED}❌ Fonction NON trouvée (404)${NC}"
  echo "   → Vous devez déployer la fonction"
elif [ "$response" == "400" ] || [ "$response" == "401" ]; then
  echo -e "${GREEN}✅ Fonction déployée !${NC}"
  echo "   (Erreur d'authentification normale sans token valide)"
else
  echo -e "${YELLOW}⚠️  Réponse inattendue : $response${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérification finale
if [ "$response" == "400" ] || [ "$response" == "401" ]; then
  echo -e "${GREEN}🎉 Les fonctions sont déployées !${NC}"
  echo ""
  echo "✅ Prochaine étape :"
  echo "   1. Connectez-vous à votre application"
  echo "   2. Allez sur 'Demander le badge certifié'"
  echo "   3. Remplissez et soumettez le formulaire"
  echo ""
  echo "   → L'erreur 'Failed to fetch' ne devrait plus apparaître"
else
  echo -e "${RED}⚠️  Les fonctions ne sont pas encore déployées${NC}"
  echo ""
  echo "📝 Pour les déployer, exécutez :"
  echo "   ./deploy-functions.sh"
  echo ""
  echo "   OU manuellement :"
  echo "   supabase login"
  echo "   supabase link --project-ref tergjlwermtignqmsnys"
  echo "   supabase functions deploy submit-salon-verification"
  echo "   supabase functions deploy get-my-salon-verification"
fi

echo ""
echo "🔗 Dashboard Supabase :"
echo "   https://supabase.com/dashboard/project/tergjlwermtignqmsnys/functions"
echo ""
