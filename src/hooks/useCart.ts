import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'artisan-cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setLoading(false);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return items.reduce((total, item) => {
      return total + (item.product.shipping.freeShipping ? 0 : item.product.shipping.shippingCost);
    }, 0);
  };

  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: getItemCount(),
    totalPrice: getTotalPrice(),
    shippingCost: getShippingCost(),
  };
};