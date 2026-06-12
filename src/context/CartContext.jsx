import { createContext, useContext, useEffect, useReducer, useState } from 'react';

const CartContext = createContext(null);

const PROMO_CODES = {
  LUXE10:   { discount: 0.10, label: '10% off applied' },
  SAVE20:   { discount: 0.20, label: '20% off applied' },
  WELCOME15: { discount: 0.15, label: '15% off applied' },
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { cartId } = action.payload;
      const existing = state.find((item) => item.cartId === cartId);
      if (existing) {
        return state.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE_ITEM':
      return state.filter((item) => item.cartId !== action.payload);

    case 'UPDATE_QUANTITY': {
      const { cartId, quantity } = action.payload;
      if (quantity < 1) return state.filter((item) => item.cartId !== cartId);
      return state.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast]       = useState(null);
  const [promo, setPromo]       = useState(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, size = null) => {
    const cartId = size ? `${product.id}-${size}` : `${product.id}`;
    dispatch({ type: 'ADD_ITEM', payload: { ...product, cartId, selectedSize: size } });
    const label = size ? `${product.name} (${size})` : product.name;
    showToast(`"${label}" added to cart`);
  };

  const removeItem = (cartId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartId });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const applyPromo = (code) => {
    const key = code.trim().toUpperCase();
    if (PROMO_CODES[key]) {
      setPromo({ code: key, ...PROMO_CODES[key] });
      setPromoError('');
      return true;
    }
    setPromoError('Invalid promo code. Try LUXE10 or SAVE20.');
    return false;
  };

  const removePromo = () => {
    setPromo(null);
    setPromoError('');
  };

  const itemCount     = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal      = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promoDiscount = promo ? subtotal * promo.discount : 0;
  const isInCart      = (id) => items.some((item) => item.id === id);

  return (
    <CartContext.Provider
      value={{
        items, itemCount, subtotal, toast,
        promo, promoDiscount, promoError,
        addItem, removeItem, updateQuantity, clearCart, isInCart,
        applyPromo, removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
