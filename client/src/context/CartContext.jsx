import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BUSINESS_CONFIG } from '../config/business';

export const MAX_QTY_PER_ITEM = BUSINESS_CONFIG?.maxQtyPerItem || 25;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('bne_enquiry_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Ensure both qty and quantity exist on restored items
      return parsed.map((item) => {
        const val = Math.min(MAX_QTY_PER_ITEM, Math.max(1, Number(item.qty || item.quantity) || 1));
        return { ...item, qty: val, quantity: val };
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bne_enquiry_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart to localStorage', e);
    }
  }, [cart]);

  // Add to cart with strict 1-25 max quantity clamping
  const addToCart = (product, requestedQty = 1) => {
    const qtyToAdd = Math.max(1, Number(requestedQty) || 1);
    let reachedCap = false;

    setCart((prev) => {
      const targetId = product.sku || product._id || product.id;
      const existingIndex = prev.findIndex(
        (item) => item.sku === targetId || item.id === targetId || item._id === targetId
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].qty || prev[existingIndex].quantity || 1;
        const newQty = Math.min(MAX_QTY_PER_ITEM, currentQty + qtyToAdd);
        if (currentQty + qtyToAdd >= MAX_QTY_PER_ITEM) {
          reachedCap = true;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          qty: newQty,
        };
        return updated;
      } else {
        const initialQty = Math.min(MAX_QTY_PER_ITEM, qtyToAdd);
        return [
          ...prev,
          {
            id: targetId,
            productId: product._id || product.sku || product.id,
            sku: product.sku || targetId,
            name: product.name,
            category: product.category,
            categoryLabel: product.category,
            packSize: product.packSize,
            image: product.image,
            moq: product.moq,
            quantity: initialQty,
            qty: initialQty,
          },
        ];
      }
    });

    return { reachedCap };
  };

  // Update quantity (clamped 1 to 25)
  const updateQuantity = (idOrSku, newQty) => {
    const parsed = Number(newQty);
    if (isNaN(parsed) || parsed < 1) return;
    const clamped = Math.min(MAX_QTY_PER_ITEM, Math.max(1, parsed));

    setCart((prev) =>
      prev.map((item) =>
        item.sku === idOrSku || item.id === idOrSku || item._id === idOrSku
          ? { ...item, quantity: clamped, qty: clamped }
          : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (idOrSku) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.sku !== idOrSku && item.id !== idOrSku && item._id !== idOrSku
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get current quantity for a product
  const getItemQuantity = (idOrSku) => {
    const found = cart.find(
      (item) => item.sku === idOrSku || item.id === idOrSku || item._id === idOrSku
    );
    return found ? (found.qty || found.quantity || 0) : 0;
  };

  const totalItems = cart.length;
  const totalUnits = useMemo(
    () => cart.reduce((acc, item) => acc + (Number(item.qty || item.quantity) || 0), 0),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    addToEnquiry: addToCart,
    updateQuantity,
    removeFromCart,
    removeFromEnquiry: removeFromCart,
    clearCart,
    clearEnquiryCart: clearCart,
    getItemQuantity,
    totalItems,
    totalUnits,
    stats: {
      distinctProducts: totalItems,
      totalUnits,
    },
    MAX_QTY_PER_ITEM,
    maxQtyPerItem: MAX_QTY_PER_ITEM,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Compatibility aliases
export const useEnquiryCart = useCart;
export const EnquiryCartProvider = CartProvider;

export default CartContext;
