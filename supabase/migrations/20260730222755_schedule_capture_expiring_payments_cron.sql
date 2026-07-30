-- Enable pg_cron if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions for pg_cron to call the edge function
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule the capture-expiring-payments edge function every 6 hours.
-- It calls the edge function via the Supabase functions endpoint using
-- the service role key stored in the vault (supabase_admin role).
DO $$
BEGIN
  -- Remove existing job if it already exists (idempotent re-run)
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'capture-expiring-payments') THEN
    PERFORM cron.unschedule('capture-expiring-payments');
  END IF;

  -- Schedule every 6 hours at minute 0
  PERFORM cron.schedule(
    'capture-expiring-payments',
    '0 */6 * * *',
    $cmd$
      SELECT net.http_post(
        url := 'https://xhbgpzyjvqfhtzjwclng.supabase.co/functions/v1/capture-expiring-payments',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
        ),
        body := '{}'::jsonb
      );
    $cmd$
  );
END $$;

-- NOTE: The cron job uses net.http_post (from pg_net extension) to call the edge function.
-- If pg_net is not installed, run: CREATE EXTENSION IF NOT EXISTS pg_net;
-- The service role key must be set as a database setting. If it is not available
-- via current_setting, you can alternatively store it in the Supabase Vault and
-- retrieve it with vault.decrypted_secret('supabase_service_role_key').
