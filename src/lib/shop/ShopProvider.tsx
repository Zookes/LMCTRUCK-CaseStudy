"use client";

import { createContext, startTransition, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { findProductByIdOrSlug, type Product, type Vehicle } from "./catalog";

type CartItem = { productId: string; quantity: number };
type SavedShopState = { vehicle: Vehicle | null; cart: CartItem[]; zip: string };

type ShopContextValue = {
  vehicle: Vehicle | null;
  setVehicle: (vehicle: Vehicle) => void;
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  zip: string;
  setZip: (zip: string) => void;
  hydrated: boolean;
  getProduct: (productId: string) => Product | undefined;
  cartQuantity: number;
};

const storageKey = "lftruck-shop-state";
const ShopContext = createContext<ShopContextValue | null>(null);

const validCart = (value: unknown): CartItem[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CartItem => Boolean(
    item && typeof item === "object" && typeof (item as CartItem).productId === "string" &&
    findProductByIdOrSlug((item as CartItem).productId) && Number.isInteger((item as CartItem).quantity) && (item as CartItem).quantity > 0,
  ));
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicleState] = useState<Vehicle | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [zip, setZipState] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null") as SavedShopState | null;
      if (saved) {
        startTransition(() => {
          setVehicleState(saved.vehicle && typeof saved.vehicle.year === "string" ? saved.vehicle : null);
          setCart(validCart(saved.cart));
          setZipState(typeof saved.zip === "string" ? saved.zip : "");
        });
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ vehicle, cart, zip } satisfies SavedShopState));
  }, [cart, hydrated, vehicle, zip]);

  const persist = (nextVehicle: Vehicle | null, nextCart: CartItem[], nextZip: string) => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify({ vehicle: nextVehicle, cart: nextCart, zip: nextZip } satisfies SavedShopState));
  };
  const setVehicle = (nextVehicle: Vehicle) => {
    setVehicleState(nextVehicle);
    persist(nextVehicle, cart, zip);
  };
  const addToCart = (productId: string, quantity = 1) => {
    if (!findProductByIdOrSlug(productId)) return;
    const nextCart = cart.some((item) => item.productId === productId)
      ? cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart, { productId, quantity }];
    setCart(nextCart);
    persist(vehicle, nextCart, zip);
  };
  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    const nextCart = cart.map((item) => item.productId === productId ? { ...item, quantity } : item);
    setCart(nextCart);
    persist(vehicle, nextCart, zip);
  };
  const removeFromCart = (productId: string) => {
    const nextCart = cart.filter((item) => item.productId !== productId);
    setCart(nextCart);
    persist(vehicle, nextCart, zip);
  };
  const clearCart = () => {
    setCart([]);
    persist(vehicle, [], zip);
  };
  const setZip = (nextZip: string) => {
    const normalizedZip = nextZip.replace(/\D/g, "").slice(0, 5);
    setZipState(normalizedZip);
    persist(vehicle, cart, normalizedZip);
  };
  const cartQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  return <ShopContext.Provider value={{ vehicle, setVehicle, cart, addToCart, updateQuantity, removeFromCart, clearCart, zip, setZip, hydrated, getProduct: findProductByIdOrSlug, cartQuantity }}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
