
/*
  # Fix refunded transactions status

  Updates 4 transactions that were refunded directly in Stripe but whose status
  was not updated in the database (webhook did not fire).

  Changes:
  - Sets status to 'refunded' for these 4 completed transactions
  - Sets delivery_status to 'cancelled'
*/

UPDATE transactions
SET 
  status = 'refunded',
  delivery_status = 'cancelled',
  updated_at = now()
WHERE id IN (
  '14eae011-d45d-4a70-83a9-59154efa950d',
  '946235fe-c99c-49d8-ad82-3c52f6f2b0d3',
  '65799d0b-51a3-4d2b-bc62-4f575ed33c34',
  '01ef464c-308e-4242-a7c1-aa423aa8ec0e'
);
