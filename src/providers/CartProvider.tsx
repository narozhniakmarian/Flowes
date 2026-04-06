"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DeliveryType = "delivery" | "pickup";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  deliveryType: DeliveryType;
  isOpen: boolean;
};

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: string }
  | { type: "INCREMENT"; productId: string }
  | { type: "DECREMENT"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_DELIVERY"; deliveryType: DeliveryType }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: Omit<CartState, "isOpen"> };

export type CartContextValue = {
  items: CartItem[];
  deliveryType: DeliveryType;
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setDeliveryType: (type: DeliveryType) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "flowers_cart";

const INITIAL_STATE: CartState = {
  items: [],
  deliveryType: "delivery",
  isOpen: false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(
        (i) => i.product._id === action.product._id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product._id === action.product._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.product._id !== action.productId),
      };

    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.product._id === action.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.product._id === action.productId
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    case "SET_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product._id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product._id === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };

    case "SET_DELIVERY":
      return { ...state, deliveryType: action.deliveryType };

    case "OPEN":
      return { ...state, isOpen: true };

    case "CLOSE":
      return { ...state, isOpen: false };

    case "CLEAR":
      return { ...INITIAL_STATE };

    case "HYDRATE":
      return {
        ...state,
        items: action.state.items,
        deliveryType: action.state.deliveryType,
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Omit<CartState, "isOpen">;
      if (parsed && Array.isArray(parsed.items)) {
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, deliveryType: state.deliveryType })
      );
    } catch {
      // ignore storage errors
    }
  }, [state.items, state.deliveryType]);

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [state.items]
  );

  const addItem = useCallback(
    (product: Product) => dispatch({ type: "ADD", product }),
    []
  );
  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE", productId }),
    []
  );
  const incrementItem = useCallback(
    (productId: string) => dispatch({ type: "INCREMENT", productId }),
    []
  );
  const decrementItem = useCallback(
    (productId: string) => dispatch({ type: "DECREMENT", productId }),
    []
  );
  const setQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "SET_QUANTITY", productId, quantity }),
    []
  );
  const setDeliveryType = useCallback(
    (deliveryType: DeliveryType) =>
      dispatch({ type: "SET_DELIVERY", deliveryType }),
    []
  );
  const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      deliveryType: state.deliveryType,
      isOpen: state.isOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      setQuantity,
      setDeliveryType,
      openCart,
      closeCart,
      clearCart,
    }),
    [
      state.items,
      state.deliveryType,
      state.isOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      setQuantity,
      setDeliveryType,
      openCart,
      closeCart,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
