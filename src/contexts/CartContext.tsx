import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Database } from '../lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'];

export interface CartItem {
  listing: Listing;
  sellerId: string;
  sellerName: string;
}

export interface CartBySeller {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  totalPrice: number;
  totalWeight: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (listing: Listing, sellerId: string, sellerName: string) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  clearSellerCart: (sellerId: string) => void;
  isInCart: (listingId: string) => boolean;
  cartCount: number;
  getCartBySeller: () => CartBySeller[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (listing: Listing, sellerId: string, sellerName: string) => {
    setCartItems(prev => {
      if (prev.some(item => item.listing.id === listing.id)) return prev;
      return [...prev, { listing, sellerId, sellerName }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCartItems(prev => prev.filter(item => item.listing.id !== listingId));
  };

  const clearCart = () => setCartItems([]);

  const clearSellerCart = (sellerId: string) => {
    setCartItems(prev => prev.filter(item => item.sellerId !== sellerId));
  };

  const isInCart = (listingId: string) =>
    cartItems.some(item => item.listing.id === listingId);

  const cartCount = cartItems.length;

  const getCartBySeller = (): CartBySeller[] => {
    const bySeller: Record<string, CartBySeller> = {};
    for (const item of cartItems) {
      if (!bySeller[item.sellerId]) {
        bySeller[item.sellerId] = {
          sellerId: item.sellerId,
          sellerName: item.sellerName,
          items: [],
          totalPrice: 0,
          totalWeight: 0,
        };
      }
      bySeller[item.sellerId].items.push(item);
      bySeller[item.sellerId].totalPrice += item.listing.price;
      bySeller[item.sellerId].totalWeight += item.listing.weight_grams || 0;
    }
    return Object.values(bySeller);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      clearSellerCart,
      isInCart,
      cartCount,
      getCartBySeller,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
