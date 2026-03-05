import { supabase } from './supabaseClient';

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
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
  label: string;
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
    const { data, error } = await supabase
      .rpc('get_saved_addresses');

    if (error) throw error;
    return data || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const { data, error } = await supabase
      .rpc('create_saved_address', {
        p_label: address.label,
        p_full_name: address.full_name,
        p_address_line1: address.address_line1,
        p_address_line2: address.address_line2 || null,
        p_postal_code: address.postal_code,
        p_city: address.city,
        p_country: address.country,
        p_phone: address.phone,
        p_is_default: address.is_default,
      });

    if (error) throw error;
    return data;
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const { data, error } = await supabase
      .rpc('update_saved_address', {
        p_address_id: id,
        p_label: address.label,
        p_full_name: address.full_name,
        p_address_line1: address.address_line1,
        p_address_line2: address.address_line2 || null,
        p_postal_code: address.postal_code,
        p_city: address.city,
        p_country: address.country,
        p_phone: address.phone,
        p_is_default: address.is_default,
      });

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .rpc('delete_saved_address', {
        p_address_id: id,
      });

    if (error) throw error;
  },

  async setDefault(id: string): Promise<void> {
    const { error } = await supabase
      .rpc('set_default_address', {
        p_address_id: id,
      });

    if (error) throw error;
  },
};
