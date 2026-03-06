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
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Non authentifie');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-saved-addresses`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erreur serveur');
  }

  const data = await response.json();

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
