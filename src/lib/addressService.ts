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

async function callEdgeFunction(action: string, payload: any = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-saved-addresses`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...payload }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const addressService = {
  async list(): Promise<SavedAddress[]> {
    const result = await callEdgeFunction('list');
    return result.addresses || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const result = await callEdgeFunction('create', { address });
    return result.address;
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const result = await callEdgeFunction('update', { id, address });
    return result.address;
  },

  async delete(id: string): Promise<void> {
    await callEdgeFunction('delete', { id });
  },

  async setDefault(id: string): Promise<void> {
    await callEdgeFunction('set-default', { id });
  },
};
