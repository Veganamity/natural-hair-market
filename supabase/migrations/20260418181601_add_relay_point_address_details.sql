/*
  # Ajout des colonnes de détail du point relais

  ## Modifications
  - Table `transactions` : ajout de `relay_point_postal_code` et `relay_point_city`
    pour stocker séparément le code postal et la ville du point relais sélectionné.
    Ces données sont nécessaires pour générer correctement les bons Mondial Relay.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'relay_point_postal_code'
  ) THEN
    ALTER TABLE transactions ADD COLUMN relay_point_postal_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'relay_point_city'
  ) THEN
    ALTER TABLE transactions ADD COLUMN relay_point_city text;
  END IF;
END $$;
