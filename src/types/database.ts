export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          location: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
          address_line1: string | null
          address_line2: string | null
          postal_code: string | null
          city: string | null
          country: string | null
          stripe_account_id: string | null
          stripe_account_status: string | null
          stripe_onboarding_completed: boolean | null
          siret: string | null
          email_verified: boolean | null
          phone_verified: boolean | null
          is_verified_salon: boolean | null
          is_certified_salon: boolean | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
          address_line1?: string | null
          address_line2?: string | null
          postal_code?: string | null
          city?: string | null
          country?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_onboarding_completed?: boolean | null
          siret?: string | null
          email_verified?: boolean | null
          phone_verified?: boolean | null
          is_verified_salon?: boolean | null
          is_certified_salon?: boolean | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
          address_line1?: string | null
          address_line2?: string | null
          postal_code?: string | null
          city?: string | null
          country?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_onboarding_completed?: boolean | null
          siret?: string | null
          email_verified?: boolean | null
          phone_verified?: boolean | null
          is_verified_salon?: boolean | null
          is_certified_salon?: boolean | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string
          price: number
          hair_length: string
          hair_type: string
          hair_color: string
          hair_texture: string | null
          hair_weight: string | null
          is_dyed: boolean | null
          is_treated: boolean | null
          condition: string
          images: Json | null
          status: string | null
          views_count: number | null
          created_at: string | null
          updated_at: string | null
          accept_offers: boolean
          instant_buy_enabled: boolean
          country: string
          certification_accepted: boolean | null
          weight_grams: number
        }
        Insert: {
          id?: string
          seller_id: string
          title: string
          description: string
          price: number
          hair_length: string
          hair_type: string
          hair_color: string
          hair_texture?: string | null
          hair_weight?: string | null
          is_dyed?: boolean | null
          is_treated?: boolean | null
          condition: string
          images?: Json | null
          status?: string | null
          views_count?: number | null
          created_at?: string | null
          updated_at?: string | null
          accept_offers?: boolean
          instant_buy_enabled?: boolean
          country?: string
          certification_accepted?: boolean | null
          weight_grams?: number
        }
        Update: {
          id?: string
          seller_id?: string
          title?: string
          description?: string
          price?: number
          hair_length?: string
          hair_type?: string
          hair_color?: string
          hair_texture?: string | null
          hair_weight?: string | null
          is_dyed?: boolean | null
          is_treated?: boolean | null
          condition?: string
          images?: Json | null
          status?: string | null
          views_count?: number | null
          created_at?: string | null
          updated_at?: string | null
          accept_offers?: boolean
          instant_buy_enabled?: boolean
          country?: string
          certification_accepted?: boolean | null
          weight_grams?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          amount: number
          message: string | null
          status: string
          created_at: string
          updated_at: string
          buyer_read_status: boolean | null
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          amount: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          buyer_read_status?: boolean | null
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          amount?: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          buyer_read_status?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          listing_id: string | null
          buyer_id: string
          seller_id: string
          amount: number
          seller_amount: number
          platform_fee: number
          stripe_payment_intent_id: string | null
          status: string
          payment_method: string | null
          created_at: string
          updated_at: string
          shipping_method: string | null
          shipping_cost: number | null
          shipping_address_id: string | null
          relay_point_id: string | null
          relay_point_name: string | null
          relay_point_address: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          capture_method: string | null
          delivery_status: string | null
          delivery_confirmed_at: string | null
          captured_at: string | null
          cancelled_at: string | null
          transfer_id: string | null
          marketplace_commission_rate: number | null
          marketplace_commission_amount: number | null
          shipping_address: string | null
          shipping_label_pdf_url: string | null
          shipping_label_tracking_number: string | null
          shipping_price: number | null
          shipping_carrier: string | null
          sender_address: Json | null
          shipping_carrier_reference: string | null
          label_generated_at: string | null
          shipping_status: string | null
          label_generation_error: string | null
          relay_point_postal_code: string | null
          relay_point_city: string | null
          sendcloud_method_id: number | null
          sendcloud_parcel_id: string | null
          relay_point_carrier: string | null
          shipping_deadline_at: string | null
          delivery_deadline_at: string | null
          auto_cancelled_at: string | null
        }
        Insert: {
          id?: string
          listing_id?: string | null
          buyer_id: string
          seller_id: string
          amount: number
          seller_amount: number
          platform_fee?: number
          stripe_payment_intent_id?: string | null
          status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
          shipping_method?: string | null
          shipping_cost?: number | null
          shipping_address_id?: string | null
          relay_point_id?: string | null
          relay_point_name?: string | null
          relay_point_address?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          capture_method?: string | null
          delivery_status?: string | null
          delivery_confirmed_at?: string | null
          captured_at?: string | null
          cancelled_at?: string | null
          transfer_id?: string | null
          marketplace_commission_rate?: number | null
          marketplace_commission_amount?: number | null
          shipping_address?: string | null
          shipping_label_pdf_url?: string | null
          shipping_label_tracking_number?: string | null
          shipping_price?: number | null
          shipping_carrier?: string | null
          sender_address?: Json | null
          shipping_carrier_reference?: string | null
          label_generated_at?: string | null
          shipping_status?: string | null
          label_generation_error?: string | null
          relay_point_postal_code?: string | null
          relay_point_city?: string | null
          sendcloud_method_id?: number | null
          sendcloud_parcel_id?: string | null
          relay_point_carrier?: string | null
          shipping_deadline_at?: string | null
          delivery_deadline_at?: string | null
          auto_cancelled_at?: string | null
        }
        Update: {
          delivery_status?: string | null
          delivery_confirmed_at?: string | null
          status?: string
          [key: string]: unknown
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          postal_code: string
          city: string
          country: string
          is_default: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          postal_code: string
          city: string
          country?: string
          is_default?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          postal_code?: string
          city?: string
          country?: string
          is_default?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seller_bank_accounts: {
        Row: {
          id: string
          user_id: string
          stripe_account_id: string | null
          account_status: string
          iban_last4: string | null
          bank_name: string | null
          account_holder_name: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_account_id?: string | null
          account_status?: string
          iban_last4?: string | null
          bank_name?: string | null
          account_holder_name?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          [key: string]: unknown
        }
        Relationships: []
      }
      listing_reports: {
        Row: {
          id: string
          listing_id: string
          reporter_id: string
          reason: string
          description: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          reporter_id: string
          reason: string
          description?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          [key: string]: unknown
        }
        Relationships: []
      }
      salon_verifications: {
        Row: {
          id: string
          user_id: string
          salon_name: string
          siret: string
          address: string
          phone: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          salon_name: string
          siret: string
          address: string
          phone?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          [key: string]: unknown
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      approve_salon_verification_rpc: {
        Args: { p_verification_id: string }
        Returns: Json
      }
      reject_salon_verification_rpc: {
        Args: { p_verification_id: string; p_reason?: string }
        Returns: Json
      }
      get_salon_verifications_rpc: {
        Args: Record<string, never>
        Returns: Json
      }
    }
    Enums: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Offer = Database['public']['Tables']['offers']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type ShippingAddress = Database['public']['Tables']['shipping_addresses']['Row']
export type SellerBankAccount = Database['public']['Tables']['seller_bank_accounts']['Row']
export type ListingReport = Database['public']['Tables']['listing_reports']['Row']
export type SalonVerification = Database['public']['Tables']['salon_verifications']['Row']
