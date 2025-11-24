export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          email_verified: boolean | null
          phone_verified: boolean | null
          siret: string | null
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
          email_verified?: boolean | null
          phone_verified?: boolean | null
          siret?: string | null
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
          email_verified?: boolean | null
          phone_verified?: boolean | null
          siret?: string | null
          is_verified_salon?: boolean | null
          is_certified_salon?: boolean | null
        }
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
          is_dyed: boolean
          is_treated: boolean
          condition: string
          images: Json
          status: string
          views_count: number
          created_at: string
          updated_at: string
          allow_offers: boolean | null
          instant_buy_enabled: boolean | null
          shipping_method: string | null
          shipping_cost: number | null
          shipping_time_days: number | null
          country: string | null
          certification_accepted: boolean | null
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
          is_dyed?: boolean
          is_treated?: boolean
          condition: string
          images?: Json
          status?: string
          views_count?: number
          created_at?: string
          updated_at?: string
          allow_offers?: boolean | null
          instant_buy_enabled?: boolean | null
          shipping_method?: string | null
          shipping_cost?: number | null
          shipping_time_days?: number | null
          country?: string | null
          certification_accepted?: boolean | null
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
          is_dyed?: boolean
          is_treated?: boolean
          condition?: string
          images?: Json
          status?: string
          views_count?: number
          created_at?: string
          updated_at?: string
          allow_offers?: boolean | null
          instant_buy_enabled?: boolean | null
          shipping_method?: string | null
          shipping_cost?: number | null
          shipping_time_days?: number | null
          country?: string | null
          certification_accepted?: boolean | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          offer_amount: number
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          offer_amount: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          offer_amount?: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          amount: number
          stripe_payment_intent_id: string | null
          payment_status: string
          shipping_address: Json | null
          tracking_number: string | null
          status: string
          created_at: string
          updated_at: string
          payment_hold_until: string | null
          payment_captured_at: string | null
          shipping_carrier: string | null
          shipping_label_url: string | null
          sendcloud_parcel_id: string | null
          colissimo_parcel_number: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          seller_id: string
          amount: number
          stripe_payment_intent_id?: string | null
          payment_status?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          payment_hold_until?: string | null
          payment_captured_at?: string | null
          shipping_carrier?: string | null
          shipping_label_url?: string | null
          sendcloud_parcel_id?: string | null
          colissimo_parcel_number?: string | null
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          seller_id?: string
          amount?: number
          stripe_payment_intent_id?: string | null
          payment_status?: string
          shipping_address?: Json | null
          tracking_number?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          payment_hold_until?: string | null
          payment_captured_at?: string | null
          shipping_carrier?: string | null
          shipping_label_url?: string | null
          sendcloud_parcel_id?: string | null
          colissimo_parcel_number?: string | null
        }
      }
      payouts: {
        Row: {
          id: string
          transaction_id: string
          seller_id: string
          amount: number
          stripe_transfer_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          seller_id: string
          amount: number
          stripe_transfer_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          seller_id?: string
          amount?: number
          stripe_transfer_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      listing_reports: {
        Row: {
          id: string
          listing_id: string
          reporter_id: string
          reason: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          reporter_id: string
          reason: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          reporter_id?: string
          reason?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      salon_certification_requests: {
        Row: {
          id: string
          user_id: string
          business_name: string
          siret: string
          address: string
          phone: string
          website: string | null
          additional_info: string | null
          status: string
          reviewed_at: string | null
          reviewed_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          siret: string
          address: string
          phone: string
          website?: string | null
          additional_info?: string | null
          status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          siret?: string
          address?: string
          phone?: string
          website?: string | null
          additional_info?: string | null
          status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
