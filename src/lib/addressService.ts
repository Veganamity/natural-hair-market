import { supabase } from './supabaseClient';

export interface SavedAddress {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressInput {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export const addressService = {
  async list(): Promise<SavedAddress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('get_user_saved_addresses');

    if (error) throw error;
    return data || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: addressId, error } = await supabase
      .rpc('add_saved_address', {
        p_full_name: address.full_name,
        p_address_line1: address.address_line1,
        p_address_line2: address.address_line2 || null,
        p_city: address.city,
        p_postal_code: address.postal_code,
        p_country: address.country,
        p_phone: address.phone,
        p_is_default: address.is_default || false,
      });

    if (error) throw error;

    const { data: newAddress, error: fetchError } = await supabase
      .rpc('get_saved_address', { p_address_id: addressId });

    if (fetchError) throw fetchError;
    return newAddress[0];
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: success, error } = await supabase
      .rpc('update_saved_address', {
        p_address_id: id,
        p_full_name: address.full_name,
        p_address_line1: address.address_line1,
        p_address_line2: address.address_line2 || null,
        p_city: address.city,
        p_postal_code: address.postal_code,
        p_country: address.country,
        p_phone: address.phone,
        p_is_default: address.is_default || false,
      });

    if (error) throw error;
    if (!success) throw new Error('Failed to update address');

    const { data: updatedAddress, error: fetchError } = await supabase
      .rpc('get_saved_address', { p_address_id: id });

    if (fetchError) throw fetchError;
    return updatedAddress[0];
  },

  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: success, error } = await supabase
      .rpc('delete_saved_address', { p_address_id: id });

    if (error) throw error;
    if (!success) throw new Error('Failed to delete address');
  },

  async setDefault(id: string): Promise<void> {
    const addresses = await this.list();
    const address = addresses.find(a => a.id === id);

    if (!address) throw new Error('Address not found');

    await this.update(id, {
      full_name: address.full_name,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      postal_code: address.postal_code,
      city: address.city,
      country: address.country,
      phone: address.phone,
      is_default: true,
    });
  },
};
