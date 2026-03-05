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

const getEdgeFunctionUrl = (action: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/manage-saved-addresses?action=${action}`;
};

const getHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
};

export const addressService = {
  async list(): Promise<SavedAddress[]> {
    const headers = await getHeaders();
    const response = await fetch(getEdgeFunctionUrl('list'), { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch addresses');
    }

    return response.json();
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const headers = await getHeaders();
    const response = await fetch(getEdgeFunctionUrl('create'), {
      method: 'POST',
      headers,
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create address');
    }

    return response.json();
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const headers = await getHeaders();
    const response = await fetch(getEdgeFunctionUrl('update'), {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id, ...address }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update address');
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(getEdgeFunctionUrl('delete'), {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete address');
    }
  },

  async setDefault(id: string): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(getEdgeFunctionUrl('set-default'), {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set default address');
    }
  },
};
