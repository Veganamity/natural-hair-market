/*
  # Ajout des protections acheteur : deadlines et capture manuelle

  ## Résumé
  Ce migration ajoute les colonnes nécessaires pour protéger les acheteurs avec :
  - Un délai d'expédition obligatoire (5 jours ouvrables)
  - Un délai de confirmation de livraison (14 jours après expédition)
  - La capture manuelle des paiements (fonds bloqués jusqu'à confirmation livraison)

  ## Nouvelles colonnes
  - `shipping_deadline_at` : date limite d'expédition (créée à la création de la transaction)
  - `delivery_deadline_at` : date limite de confirmation de livraison (créée quand expédié)
  - `auto_cancelled_at` : timestamp si annulation automatique

  ## Logique métier
  - Si le vendeur n'expédie pas avant `shipping_deadline_at` → remboursement automatique
  - Si l'acheteur ne confirme pas avant `delivery_deadline_at` → fonds libérés au vendeur automatiquement
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'shipping_deadline_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN shipping_deadline_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'delivery_deadline_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN delivery_deadline_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'auto_cancelled_at'
  ) THEN
    ALTER TABLE transactions ADD COLUMN auto_cancelled_at timestamptz;
  END IF;
END $$;

-- Mettre à jour les transactions existantes en attente d'expédition sans deadline
UPDATE transactions
SET shipping_deadline_at = created_at + INTERVAL '7 days'
WHERE shipping_deadline_at IS NULL
  AND delivery_status IN ('pending')
  AND status IN ('pending', 'processing', 'completed');
