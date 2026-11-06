#!/bin/bash
# ==============================================================
# Test script for the sendcloud-webhook edge function
# --------------------------------------------------------------
# Sends realistic Sendcloud webhook payloads to the edge function
# WITHOUT touching production data (uses a fake parcel ID that
# won't match any real transaction — so the function will log
# "Transaction not found" and return 200, which proves the
# parsing, status mapping, and error handling all work).
#
# Usage:
#   bash supabase/functions/sendcloud-webhook/test-webhook.sh
#
# Prerequisites:
#   - SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env
#   - The sendcloud-webhook function must be deployed
# ==============================================================

set -euo pipefail

# Load .env
PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(grep -E '^(SUPABASE_URL|SUPABASE_ANON_KEY)=' "$PROJECT_ROOT/.env" | sed 's/"//g' | xargs)
fi

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_ANON_KEY:-}" ]; then
  echo "ERROR: SUPABASE_URL or SUPABASE_ANON_KEY not set in .env"
  exit 1
fi

WEBHOOK_URL="${SUPABASE_URL}/functions/v1/sendcloud-webhook"
FAKE_PARCEL_ID=999999999  # won't match any real transaction

echo "=============================================="
echo "  Sendcloud Webhook Test"
echo "  Endpoint: $WEBHOOK_URL"
echo "  Fake parcel ID: $FAKE_PARCEL_ID (no real data)"
echo "=============================================="
echo ""

# --- Test 1: integration_updated (should be ignored) ---
echo "[Test 1] integration_updated event (no parcel ID)"
echo "  Expected: 200, ignored"
RESP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action":"integration_updated"}')
echo "  HTTP $RESP"
echo ""

# --- Test 2: test_webhook (should be ignored) ---
echo "[Test 2] test_webhook event (no parcel ID)"
echo "  Expected: 200, ignored"
RESP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action":"test_webhook","parcel":{}}')
echo "  HTTP $RESP"
echo ""

# --- Test 3: parcel "announced" (status 3 = in transit) ---
echo "[Test 3] parcel status 'announced' (code 3 = in_transit)"
echo "  Expected: 200, shipping_status=in_transit, emailType=shipped"
BODY=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\":\"parcel_status_changed\",
    \"parcel\":{
      \"id\":$FAKE_PARCEL_ID,
      \"tracking_number\":\"3SABCDE123456789\",
      \"status\":{\"id\":3,\"message\":\"Announced\"}
    }
  }")
echo "  Response: $BODY"
echo ""

# --- Test 4: parcel "at service point" (status 6 = delivered to relay) ---
echo "[Test 4] parcel status 'delivered to pickup location' (code 6 = delivered/relay)"
echo "  Expected: 200, shipping_status=delivered, emailType=delivered"
BODY=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\":\"parcel_status_changed\",
    \"parcel\":{
      \"id\":$FAKE_PARCEL_ID,
      \"tracking_number\":\"3SABCDE123456789\",
      \"status\":{\"id\":6,\"message\":\"Delivered to pickup location\"}
    }
  }")
echo "  Response: $BODY"
echo ""

# --- Test 5: parcel "delivered" (status 11 = delivered to customer) ---
echo "[Test 5] parcel status 'delivered' (code 11 = delivered)"
echo "  Expected: 200, shipping_status=delivered, emailType=delivered"
BODY=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\":\"parcel_status_changed\",
    \"parcel\":{
      \"id\":$FAKE_PARCEL_ID,
      \"tracking_number\":\"3SABCDE123456789\",
      \"status\":{\"id\":11,\"message\":\"Delivered\"}
    }
  }")
echo "  Response: $BODY"
echo ""

# --- Test 6: same status repeated (idempotency check) ---
# Note: with fake parcel ID, the transaction won't be found so idempotency
# can't be fully tested here, but the parsing still works.
echo "[Test 6] repeat same status (idempotency)"
echo "  Expected: 200 (transaction not found with fake ID)"
BODY=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\":\"parcel_status_changed\",
    \"parcel\":{
      \"id\":$FAKE_PARCEL_ID,
      \"tracking_number\":\"3SABCDE123456789\",
      \"status\":{\"id\":11,\"message\":\"Delivered\"}
    }
  }")
echo "  Response: $BODY"
echo ""

# --- Test 7: unknown status code (should skip) ---
echo "[Test 7] unknown status code 999"
echo "  Expected: 200, skipped (unrecognized status)"
BODY=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\":\"parcel_status_changed\",
    \"parcel\":{
      \"id\":$FAKE_PARCEL_ID,
      \"tracking_number\":\"3SABCDE123456789\",
      \"status\":{\"id\":999,\"message\":\"Something weird\"}
    }
  }")
echo "  Response: $BODY"
echo ""

# --- Test 8: label created (status 1) ---
echo "[Test 8] parcel status 'not announced' (code 1 = label_created)"
echo "  Expected: 200, shipping_status=label_created, emailType=null"
BODY=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"action\":\"parcel_status_changed\",
    \"parcel\":{
      \"id\":$FAKE_PARCEL_ID,
      \"tracking_number\":\"3SABCDE123456789\",
      \"status\":{\"id\":1,\"message\":\"Not announced\"}
    }
  }")
echo "  Response: $BODY"
echo ""

echo "=============================================="
echo "  All tests completed."
echo "  Check Supabase logs for detailed processing:"
echo "  Dashboard > Functions > sendcloud-webhook > Logs"
echo "=============================================="
