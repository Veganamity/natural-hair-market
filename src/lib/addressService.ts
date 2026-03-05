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

const getApiUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/manage-saved-addresses`;
};

const getHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
};

export const addressService = {
  async list(): Promise<SavedAddress[]> {
    const headers = await getHeaders();
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'list' }),
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result.addresses || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const headers = await getHeaders();
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'create', address }),
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result.address;
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const headers = await getHeaders();
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'update', id, address }),
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result.address;
  },

  async delete(id: string): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'delete', id }),
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
  },

  async setDefault(id: string): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'set-default', id }),
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
  },
};
