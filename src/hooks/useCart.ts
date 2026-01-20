import { useState, useCallback } from 'react';
import { CartItem, MenuItem, Variation, AddOn } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const calculateItemPrice = (item: MenuItem, variation?: Variation, addOns?: AddOn[]) => {
    // Prefer effectivePrice (discounted) when available, fallback to basePrice
    let price = item.effectivePrice ?? item.basePrice;
    if (variation) {
      price += variation.price;
    }
    if (addOns) {
      addOns.forEach(addOn => {
        price += addOn.price;
      });
    }
    return price;
  };

  const addToCart = useCallback((item: MenuItem, quantity: number = 1, variation?: Variation, addOns?: AddOn[]) => {
    // Check stock if tracking
    if (item.trackInventory && item.stockQuantity !== null && item.stockQuantity !== undefined) {
      const existingQuantity = cartItems
        .filter(ci => ci.menuItemId === item.id)
        .reduce((sum, ci) => sum + ci.quantity, 0);

      if (existingQuantity + quantity > item.stockQuantity) {
        throw new Error(`Only ${item.stockQuantity} units available in stock.`);
      }
    }

    const totalPrice = calculateItemPrice(item, variation, addOns);
    const menuItemId = item.id;

    // Group add-ons by name and sum their quantities
    const groupedAddOns = addOns?.reduce((groups, addOn) => {
      const existing = groups.find(g => g.id === addOn.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        groups.push({ ...addOn, quantity: 1 });
      }
      return groups;
    }, [] as (AddOn & { quantity: number })[]);

    setCartItems(prev => {
      const existingItem = prev.find(cartItem =>
        cartItem.menuItemId === menuItemId &&
        cartItem.selectedVariation?.id === variation?.id &&
        JSON.stringify(cartItem.selectedAddOns?.map(a => `${a.id}-${a.quantity || 1}`).sort()) === JSON.stringify(groupedAddOns?.map(a => `${a.id}-${a.quantity}`).sort())
      );

      if (existingItem) {
        return prev.map(cartItem =>
          cartItem === existingItem
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        const uniqueId = `${item.id}-${variation?.id || 'default'}-${addOns?.map(a => a.id).join(',') || 'none'}`;
        return [...prev, {
          ...item,
          id: uniqueId,
          menuItemId,
          quantity,
          selectedVariation: variation,
          selectedAddOns: groupedAddOns || [],
          totalPrice
        }];
      }
    });
  }, [cartItems]);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    const itemToUpdate = cartItems.find(item => item.id === id);
    if (itemToUpdate && itemToUpdate.trackInventory && itemToUpdate.stockQuantity !== null && itemToUpdate.stockQuantity !== undefined) {
      const otherItemsQuantity = cartItems
        .filter(ci => ci.menuItemId === itemToUpdate.menuItemId && ci.id !== id)
        .reduce((sum, ci) => sum + ci.quantity, 0);

      if (otherItemsQuantity + quantity > itemToUpdate.stockQuantity) {
        throw new Error(`Only ${itemToUpdate.stockQuantity} units available in stock.`);
      }
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [cartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    openCart,
    closeCart
  };
};
