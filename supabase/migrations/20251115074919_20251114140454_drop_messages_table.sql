/*
  # Drop Messages Table

  1. Changes
    - Drop the messages table and all associated data
    - Remove all messaging functionality from the database
  
  2. Security
    - This is a destructive operation that removes all message data permanently
  
  3. Notes
    - This change removes the ability for users to send direct messages
    - This prevents users from exchanging contact information outside the platform
    - All transactions must now go through the secure offer and payment system
*/

DROP TABLE IF EXISTS messages CASCADE;