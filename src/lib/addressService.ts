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

async function callEdgeFunction(action: string, data: Record<string, unknown> = {}): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Non authentifie');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${supabaseUrl}/functions/v1/manage-saved-addresses`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ action, ...data }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = 'Erreur lors de la requete';
    try {
      const result = JSON.parse(text);
      errorMessage = result.error || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
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
