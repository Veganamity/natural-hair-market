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
    if (!user) throw new Error('Non authentifie');

    const { data, error } = await supabase
      .from('saved_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(address: AddressInput): Promise<SavedAddress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    if (address.is_default) {
      await supabase
        .from('saved_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('saved_addresses')
      .insert([{
        user_id: user.id,
        full_name: address.full_name,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || null,
        postal_code: address.postal_code,
        city: address.city,
        country: address.country,
        phone: address.phone,
        is_default: address.is_default || false,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: string, address: AddressInput): Promise<SavedAddress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    if (address.is_default) {
      await supabase
        .from('saved_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('saved_addresses')
      .update({
        full_name: address.full_name,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || null,
        postal_code: address.postal_code,
        city: address.city,
        country: address.country,
        phone: address.phone,
        is_default: address.is_default || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    const { error } = await supabase
      .from('saved_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  },

  async setDefault(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifie');

    await supabase
      .from('saved_addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);

    const { error } = await supabase
      .from('saved_addresses')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
  },
};
