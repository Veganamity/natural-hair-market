-- Recreate delete_user_account function to fix schema cache
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Delete in safe order respecting FK constraints
  DELETE FROM public.listings WHERE seller_id = v_user_id;
  DELETE FROM public.favorites WHERE user_id = v_user_id;
  DELETE FROM public.offers WHERE buyer_id = v_user_id;
  DELETE FROM public.transactions WHERE buyer_id = v_user_id OR seller_id = v_user_id;

  -- Optional tables (ignore if they don't exist)
  BEGIN DELETE FROM public.shipping_addresses WHERE user_id = v_user_id; EXCEPTION WHEN undefined_table THEN NULL; END;
  BEGIN DELETE FROM public.salon_verifications WHERE user_id = v_user_id; EXCEPTION WHEN undefined_table THEN NULL; END;
  BEGIN DELETE FROM public.listing_reports WHERE reporter_id = v_user_id; EXCEPTION WHEN undefined_table THEN NULL; END;
  BEGIN DELETE FROM public.seller_bank_accounts WHERE user_id = v_user_id; EXCEPTION WHEN undefined_table THEN NULL; END;
  BEGIN DELETE FROM public.hair_buyback_requests WHERE user_id = v_user_id; EXCEPTION WHEN undefined_table THEN NULL; END;
  BEGIN DELETE FROM public.saved_addresses WHERE user_id = v_user_id; EXCEPTION WHEN undefined_table THEN NULL; END;

  DELETE FROM public.profiles WHERE id = v_user_id;
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN json_build_object('success', true, 'message', 'Account deleted successfully');

EXCEPTION
  WHEN others THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
