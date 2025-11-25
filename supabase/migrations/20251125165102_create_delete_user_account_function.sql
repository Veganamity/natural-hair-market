/*
  # Create delete_user_account RPC function

  1. Function
    - `delete_user_account()` - Deletes the authenticated user's account and all associated data
  
  2. Security
    - Function uses security definer to allow deletion of auth.users record
    - Only authenticated users can call this function
    - Users can only delete their own account
  
  3. Data Deletion
    - Deletes all user listings
    - Deletes all user favorites
    - Deletes all user offers (as buyer)
    - Deletes all user transactions (as buyer or seller)
    - Deletes all user shipping addresses
    - Deletes all user salon verification requests
    - Deletes user profile
    - Finally deletes the auth.users record
  
  4. Important Notes
    - This is an irreversible operation
    - All cascade deletions are handled by foreign key constraints
    - The function must be security definer to access auth.users table
*/

-- Create function to delete user account
create or replace function public.delete_user_account()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  -- Get the authenticated user's ID
  v_user_id := auth.uid();
  
  if v_user_id is null then
    return json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  end if;

  -- Delete user data (cascading deletes will handle related records)
  -- The order matters to respect foreign key constraints
  
  -- Delete listings (will cascade to favorites, offers, transactions)
  delete from public.listings where seller_id = v_user_id;
  
  -- Delete favorites
  delete from public.favorites where user_id = v_user_id;
  
  -- Delete offers where user is buyer
  delete from public.offers where buyer_id = v_user_id;
  
  -- Delete transactions where user is buyer or seller
  delete from public.transactions where buyer_id = v_user_id or seller_id = v_user_id;
  
  -- Delete shipping addresses
  delete from public.shipping_addresses where user_id = v_user_id;
  
  -- Delete salon verifications
  delete from public.salon_verifications where user_id = v_user_id;
  
  -- Delete listing reports
  delete from public.listing_reports where reporter_id = v_user_id;
  
  -- Delete seller bank accounts
  delete from public.seller_bank_accounts where user_id = v_user_id;
  
  -- Delete profile
  delete from public.profiles where id = v_user_id;
  
  -- Finally, delete the auth user
  delete from auth.users where id = v_user_id;
  
  return json_build_object(
    'success', true,
    'message', 'Account deleted successfully'
  );
  
exception
  when others then
    return json_build_object(
      'success', false,
      'error', SQLERRM
    );
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user_account() to authenticated;
