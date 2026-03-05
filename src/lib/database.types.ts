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
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
          accept_offers: boolean
          instant_buy_enabled: boolean
          country: string
          seller_shipping_fee: number | null
          seller_address_city: string | null
          seller_address_postal_code: string | null
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
          is_dyed?: boolean
          is_treated?: boolean
          condition: string
          images?: Json
          status?: string
          views_count?: number
          created_at?: string
          updated_at?: string
          accept_offers?: boolean
          instant_buy_enabled?: boolean
          country?: string
          seller_shipping_fee?: number | null
          seller_address_city?: string | null
          seller_address_postal_code?: string | null
          weight_grams: number
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
          accept_offers?: boolean
          instant_buy_enabled?: boolean
          country?: string
          seller_shipping_fee?: number | null
          seller_address_city?: string | null
          seller_address_postal_code?: string | null
          weight_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      offers: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          amount: number
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          amount: number
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          amount?: number
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          location: string | null
          bio: string | null
          created_at: string
          updated_at: string
          address_line1: string | null
          address_line2: string | null
          postal_code: string | null
          city: string | null
          country: string
          stripe_account_id: string | null
          stripe_account_status: string
          stripe_onboarding_completed: boolean
          default_shipping_fee: number
          accepts_marketplace_terms: boolean
          business_name: string | null
          address_complement: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          address_line1?: string | null
          address_line2?: string | null
          postal_code?: string | null
          city?: string | null
          country?: string
          stripe_account_id?: string | null
          stripe_account_status?: string
          stripe_onboarding_completed?: boolean
          default_shipping_fee?: number
          accepts_marketplace_terms?: boolean
          business_name?: string | null
          address_complement?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          address_line1?: string | null
          address_line2?: string | null
          postal_code?: string | null
          city?: string | null
          country?: string
          stripe_account_id?: string | null
          stripe_account_status?: string
          stripe_onboarding_completed?: boolean
          default_shipping_fee?: number
          accepts_marketplace_terms?: boolean
          business_name?: string | null
          address_complement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          address_line1: string
          address_line2: string | null
          postal_code: string
          city: string
          country: string
          phone: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          address_line1: string
          address_line2?: string | null
          postal_code: string
          city: string
          country?: string
          phone: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          address_line1?: string
          address_line2?: string | null
          postal_code?: string
          city?: string
          country?: string
          phone?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          id?: string
          user_id?: string
          stripe_account_id?: string | null
          account_status?: string
          iban_last4?: string | null
          bank_name?: string | null
          account_holder_name?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          is_default: boolean
          created_at: string
          updated_at: string
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
          is_default?: boolean
          created_at?: string
          updated_at?: string
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
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          capture_method: string
          delivery_status: string
          delivery_confirmed_at: string | null
          captured_at: string | null
          cancelled_at: string | null
          transfer_id: string | null
          marketplace_commission_rate: number
          marketplace_commission_amount: number
          seller_shipping_fee: number
          shipping_label_pdf_url: string | null
          shipping_label_tracking_number: string | null
          shipping_carrier_reference: string | null
          sender_address: Json | null
          recipient_address: Json | null
          relay_point_details: Json | null
          label_generated_at: string | null
          label_generation_error: string | null
          mondial_relay_point_id: string | null
          mondial_relay_point_name: string | null
          mondial_relay_point_address: string | null
          cancellation_reason: string | null
          cancelled_by: string | null
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
          capture_method?: string
          delivery_status?: string
          delivery_confirmed_at?: string | null
          captured_at?: string | null
          cancelled_at?: string | null
          transfer_id?: string | null
          marketplace_commission_rate?: number
          marketplace_commission_amount?: number
          seller_shipping_fee?: number
          shipping_label_pdf_url?: string | null
          shipping_label_tracking_number?: string | null
          shipping_carrier_reference?: string | null
          sender_address?: Json | null
          recipient_address?: Json | null
          relay_point_details?: Json | null
          label_generated_at?: string | null
          label_generation_error?: string | null
          mondial_relay_point_id?: string | null
          mondial_relay_point_name?: string | null
          mondial_relay_point_address?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
        }
        Update: {
          id?: string
          listing_id?: string | null
          buyer_id?: string
          seller_id?: string
          amount?: number
          seller_amount?: number
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
          capture_method?: string
          delivery_status?: string
          delivery_confirmed_at?: string | null
          captured_at?: string | null
          cancelled_at?: string | null
          transfer_id?: string | null
          marketplace_commission_rate?: number
          marketplace_commission_amount?: number
          seller_shipping_fee?: number
          shipping_label_pdf_url?: string | null
          shipping_label_tracking_number?: string | null
          shipping_carrier_reference?: string | null
          sender_address?: Json | null
          recipient_address?: Json | null
          relay_point_details?: Json | null
          label_generated_at?: string | null
          label_generation_error?: string | null
          mondial_relay_point_id?: string | null
          mondial_relay_point_name?: string | null
          mondial_relay_point_address?: string | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
