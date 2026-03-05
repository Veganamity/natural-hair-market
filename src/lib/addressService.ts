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
    const { data, error } = await supabase.functions.invoke('manage-saved-addresses', {
      method: 'GET',
      body: { action: 'list' },
    });

    if (error) throw error;
    return data || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const { data, error } = await supabase.functions.invoke('manage-saved-addresses', {
      method: 'POST',
      body: { action: 'create', ...address },
    });

    if (error) throw error;
    return data;
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const { data, error } = await supabase.functions.invoke('manage-saved-addresses', {
      method: 'PUT',
      body: { action: 'update', id, ...address },
    });

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.functions.invoke('manage-saved-addresses', {
      method: 'DELETE',
      body: { action: 'delete', id },
    });

    if (error) throw error;
  },

  async setDefault(id: string): Promise<void> {
    const { error } = await supabase.functions.invoke('manage-saved-addresses', {
      method: 'PUT',
      body: { action: 'set-default', id },
    });

    if (error) throw error;
  },
};
