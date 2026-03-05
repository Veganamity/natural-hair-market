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

const callFunction = async (body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke('manage-saved-addresses', {
    body,
  });

  if (error) {
    console.error('Edge function error:', error);
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      throw new Error('Impossible de contacter le serveur. Verifiez votre connexion internet.');
    }
    throw new Error(error.message || 'Erreur serveur');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
};

export const addressService = {
  async list(): Promise<SavedAddress[]> {
    const result = await callFunction({ action: 'list' });
    return result.addresses || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const result = await callFunction({ action: 'create', address });
    return result.address;
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const result = await callFunction({ action: 'update', id, address });
    return result.address;
  },

  async delete(id: string): Promise<void> {
    await callFunction({ action: 'delete', id });
  },

  async setDefault(id: string): Promise<void> {
    await callFunction({ action: 'set-default', id });
  },
};
