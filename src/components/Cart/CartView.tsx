import { useState } from 'react';
import { Trash2, ShoppingCart, Package, ChevronRight, Scale } from 'lucide-react';
import { useCart, CartBySeller } from '../../contexts/CartContext';
import { CartPaymentModal } from './CartPaymentModal';

export function CartView() {
  const { cartItems, removeFromCart, clearSellerCart, getCartBySeller } = useCart();
  const [checkoutSeller, setCheckoutSeller] = useState<CartBySeller | null>(null);

  const sellerGroups = getCartBySeller();

  const handlePaymentSuccess = (sellerId: string) => {
    clearSellerCart(sellerId);
    setCheckoutSeller(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 text-sm">
          Parcourez le marketplace et ajoutez des articles à votre panier.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">
          Mon Panier
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
          </span>
        </h2>
      </div>

      {sellerGroups.map(group => (
        <div key={group.sellerId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-800">Vendeur: {group.sellerName}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {group.items.length} article{group.items.length > 1 ? 's' : ''}
                </p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  {group.totalWeight >= 1000
                    ? `${(group.totalWeight / 1000).toFixed(2)} kg`
                    : `${group.totalWeight} g`}
                </p>
              </div>
            </div>
            <button
              onClick={() => clearSellerCart(group.sellerId)}
              className="text-[10px] text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Vider
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {group.items.map(item => {
              const images = Array.isArray(item.listing.images) ? item.listing.images : [];
              const mainImage = images[0] || 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg';

              return (
                <div key={item.listing.id} className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={mainImage}
                    alt={item.listing.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.listing.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-gray-500">{item.listing.hair_length} — {item.listing.hair_color}</p>
                      {item.listing.weight_grams && (
                        <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                          {item.listing.weight_grams}g
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-600">{item.listing.price.toFixed(2)} €</span>
                    <button
                      onClick={() => removeFromCart(item.listing.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">
                  Sous-total: <span className="font-bold text-gray-800">{group.totalPrice.toFixed(2)} €</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  + frais de livraison et commission (10%)
                </p>
              </div>
              <button
                onClick={() => setCheckoutSeller(group)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-xs"
              >
                Commander
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {sellerGroups.length > 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-xs text-amber-800">
            Vous avez des articles de {sellerGroups.length} vendeurs différents. Chaque commande est traitée séparément et nécessite un paiement distinct.
          </p>
        </div>
      )}

      {checkoutSeller && (
        <CartPaymentModal
          sellerCart={checkoutSeller}
          onClose={() => setCheckoutSeller(null)}
          onSuccess={() => handlePaymentSuccess(checkoutSeller.sellerId)}
        />
      )}
    </div>
  );
}
