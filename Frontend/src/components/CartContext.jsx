import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  // Initialize cart from localStorage for guests
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('guest_cart');
    const parsedCart = stored ? JSON.parse(stored) : [];
    // Clean up cart items to ensure they have correct structure
    return parsedCart.map(item => ({
      ...item,
      _id: item._id,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    }));
  });

  // Defer backend sync until server cart is loaded post-login
  const [readyToSync, setReadyToSync] = useState(false);


  // Simple cart management - always use localStorage
  useEffect(() => {
    const stored = localStorage.getItem('guest_cart');
    if (stored) {
      const parsedCart = JSON.parse(stored);
      const cleanCart = parsedCart.map(item => ({
        ...item,
        _id: item._id,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      }));
      setCart(cleanCart);
      console.log('[CartContext] Loaded cart from localStorage:', cleanCart);
    }
  }, []);

  // Save cart to localStorage for all users (as backup)
  useEffect(() => {
    // Clean cart data before saving
    const cleanCart = cart.map(item => ({
      ...item,
      _id: item._id,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    }));
    localStorage.setItem('guest_cart', JSON.stringify(cleanCart));
  }, [cart]);

  // Enable backend sync for logged-in users (deferred until readyToSync)
  useEffect(() => {
    if (!token || !readyToSync) return;
    // Only send valid items that have an _id
    const items = cart
      .filter(item => item && item._id)
      .map(item => ({ productId: item._id, quantity: Number(item.quantity) || 1 }));

    fetch('http://localhost:3001/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    }).catch(err => {
      console.error('[CartContext] Error syncing cart to backend:', err);
    });
  }, [cart, token, readyToSync]);

  // When user logs in, load server cart and adopt it; then enable syncing
  useEffect(() => {
    if (!token) return;
    setReadyToSync(false);

    const loadAndAdopt = async () => {
      try {
        const res = await fetch('http://localhost:3001/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Failed to fetch server cart: ${res.status}`);
        const serverCart = await res.json();
        const serverItems = Array.isArray(serverCart?.items) ? serverCart.items : [];
        const normalizedServer = serverItems
          .filter(it => it && (it.productId?._id || it.productId))
          .map(it => ({
            _id: it.productId?._id || it.productId,
            name: it.name || it.productId?.name,
            price: Number(it.price ?? it.productId?.price ?? 0),
            image: it.image || it.productId?.image,
            quantity: Number(it.quantity) || 1
          }));

        // Prefer server as source of truth to avoid doubling
        setCart(normalizedServer);
        localStorage.setItem('guest_cart', JSON.stringify(normalizedServer));
      } catch (e) {
        console.error('[CartContext] Failed to load server cart:', e);
      } finally {
        setReadyToSync(true);
      }
    };

    loadAndAdopt();
  }, [token]);

  // If user logs out, clear in-memory cart and local backup; also pause syncing
  useEffect(() => {
    if (token) return;
    setCart([]);
    localStorage.removeItem('guest_cart');
    setReadyToSync(false);
  }, [token]);

  // Add product to cart (increase quantity if already exists)
  const addToCart = (product) => {
    console.log('[CartContext] Adding product to cart:', product);
    setCart((prevCart) => {
      const existing = prevCart.find(item => item._id === product._id);
      if (existing) {
        const newCart = prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
        console.log('[CartContext] Updated existing item, new cart:', newCart);
        return newCart;
      } else {
        const newCart = [...prevCart, { ...product, quantity: 1 }];
        console.log('[CartContext] Added new item, new cart:', newCart);
        return newCart;
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('guest_cart');
    console.log('[CartContext] Cart cleared');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 