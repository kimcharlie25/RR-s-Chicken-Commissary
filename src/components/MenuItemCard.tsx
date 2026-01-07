import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  cartItemId?: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  quantity,
  cartItemId,
  onUpdateQuantity
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  // Determine discount display values
  const basePrice = item.basePrice;
  const effectivePrice = item.effectivePrice ?? basePrice;
  const hasExplicitDiscount = Boolean(item.isOnDiscount && item.discountPrice !== undefined);
  const hasImplicitDiscount = effectivePrice < basePrice;
  const showDiscount = hasExplicitDiscount || hasImplicitDiscount;
  const discountedPrice = hasExplicitDiscount
    ? (item.discountPrice as number)
    : (hasImplicitDiscount ? effectivePrice : undefined);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = effectivePrice;
    if (selectedVariation) {
      price = effectivePrice + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn =>
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    if (!cartItemId) return;
    onUpdateQuantity(cartItemId, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0 && cartItemId) {
      onUpdateQuantity(cartItemId, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);

      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }

      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group animate-fade-in border border-gray-100 ${!item.available ? 'opacity-60' : ''}`}>
        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Item Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-branding-primary uppercase tracking-tight">
                {item.name}
              </h4>

              {/* Minimal Badges */}
              <div className="flex gap-1">
                {item.isOnDiscount && item.discountPrice && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    SALE
                  </span>
                )}
                {item.popular && (
                  <span className="bg-branding-yellow text-branding-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                    ⭐
                  </span>
                )}
                {!item.available && (
                  <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    UNAVAILABLE
                  </span>
                )}
              </div>
            </div>

            <p className={`text-sm leading-relaxed ${!item.available ? 'text-gray-400' : 'text-gray-600'}`}>
              {!item.available ? 'Currently Unavailable' : item.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {item.variations && item.variations.length > 0 && (
                <span className="text-[10px] font-black text-branding-primary/50 bg-branding-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {item.variations.length} sizes
                </span>
              )}
              {item.addOns && item.addOns.length > 0 && (
                <span className="text-[10px] font-black text-branding-primary/50 bg-branding-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {item.addOns.length} add-ons
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:min-w-[240px]">
            <div className="text-right">
              {showDiscount && discountedPrice !== undefined ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-branding-primary/40 line-through">
                      ₱{basePrice.toFixed(0)}
                    </span>
                    <span className="text-xl font-black text-branding-red">
                      ₱{discountedPrice.toFixed(0)}
                    </span>
                  </div>
                  <span className="text-[10px] text-red-600 font-bold uppercase">
                    Save {Math.round(((basePrice - discountedPrice) / basePrice) * 100)}%
                  </span>
                </div>
              ) : (
                <div className="text-xl font-black text-branding-primary">
                  ₱{basePrice.toFixed(0)}
                </div>
              )}
              {item.variations && item.variations.length > 0 && (
                <div className="text-[10px] text-gray-500">
                  Starts at
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              {!item.available ? (
                <button
                  disabled
                  className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed font-medium text-xs uppercase"
                >
                  Sold Out
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-branding-red text-white px-5 py-2 rounded-lg hover:opacity-90 transition-all duration-200 font-bold text-xs uppercase tracking-widest shadow-md shadow-branding-red/10"
                >
                  {item.variations?.length || item.addOns?.length ? 'Customize' : 'Add'}
                </button>
              ) : (
                <div className="flex items-center space-x-2 bg-branding-yellow/10 rounded-lg p-1 border border-branding-yellow/30">
                  <button
                    onClick={handleDecrement}
                    className="p-1.5 hover:bg-branding-yellow/30 rounded-md transition-colors duration-200"
                  >
                    <Minus className="h-3.5 w-3.5 text-branding-primary" />
                  </button>
                  <span className="font-black text-branding-primary min-w-[20px] text-center text-xs">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-1.5 hover:bg-branding-yellow/30 rounded-md transition-colors duration-200"
                  >
                    <Plus className="h-3.5 w-3.5 text-branding-primary" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock indicator - small bar at bottom */}
        {item.trackInventory && item.stockQuantity !== null && (
          <div className="px-4 pb-2">
            {item.stockQuantity !== undefined && item.lowStockThreshold !== undefined && item.stockQuantity <= item.lowStockThreshold && item.stockQuantity > 0 ? (
              <div className="text-[10px] text-orange-600 font-bold animate-pulse">
                Low stock: {item.stockQuantity} left
              </div>
            ) : item.stockQuantity === 0 ? (
              <div className="text-[10px] text-red-600 font-bold">
                Out of stock
              </div>
            ) : null}
          </div>
        )}
      </div>

      {showCustomization && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Customize {item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Stock indicator in modal */}
              {item.trackInventory && item.stockQuantity !== null && (
                <div className="mb-6">
                  {item.stockQuantity > item.lowStockThreshold ? (
                    <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                      <span className="font-semibold">✓</span>
                      <span className="font-medium">{item.stockQuantity} available in stock</span>
                    </div>
                  ) : item.stockQuantity > 0 ? (
                    <div className="flex items-center space-x-2 text-sm text-orange-700 bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
                      <span className="font-semibold">⚠️</span>
                      <span className="font-medium">Hurry! Only {item.stockQuantity} left in stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                      <span className="font-semibold">✕</span>
                      <span className="font-medium">Currently out of stock</span>
                    </div>
                  )}
                </div>
              )}

              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedVariation?.id === variation.id
                          ? 'border-branding-red bg-branding-red/5'
                          : 'border-gray-100 hover:border-branding-yellow hover:bg-branding-yellow/5'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="font-medium text-gray-900">{variation.name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{addOn.name}</span>
                              <div className="text-sm text-gray-600">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-red-100 rounded-xl p-1 border border-red-200">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-red-600" />
                                  </button>
                                  <span className="font-semibold text-gray-900 min-w-[24px] text-center text-sm">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-red-600" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-lg"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-red-600">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-branding-red text-white py-4 rounded-xl hover:opacity-90 transition-all duration-200 font-bold flex items-center justify-center space-x-2 shadow-lg shadow-branding-red/20 uppercase tracking-widest"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ₱{calculatePrice().toFixed(0)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;
