"use client";

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState, type FocusEvent, type ReactNode } from "react";
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
  statusMessage: string;
  dismissStatus: () => void;
};

const storageKey = "lftruck-shop-state";
const statusDuration = 5000;
const ShopContext = createContext<ShopContextValue | null>(null);

// Only routine confirmations use this host; errors requiring action remain in their forms.
function StatusToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerStartedAt = useRef(0);
  const remainingTime = useRef(statusDuration);
  const isHovered = useRef(false);
  const hasFocus = useRef(false);

  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const startTimer = useCallback(() => {
    clearTimer();
    if (remainingTime.current <= 0) {
      onDismiss();
      return;
    }
    timerStartedAt.current = Date.now();
    timer.current = setTimeout(onDismiss, remainingTime.current);
  }, [clearTimer, onDismiss]);
  const pauseTimer = useCallback(() => {
    if (!timer.current) return;
    remainingTime.current = Math.max(0, remainingTime.current - (Date.now() - timerStartedAt.current));
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    remainingTime.current = statusDuration;
    isHovered.current = false;
    hasFocus.current = false;
    startTimer();
    return clearTimer;
  }, [clearTimer, message, startTimer]);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    hasFocus.current = false;
    if (!isHovered.current) startTimer();
  };

  return <div
    className="toast show"
    onMouseEnter={() => { isHovered.current = true; pauseTimer(); }}
    onMouseLeave={() => { isHovered.current = false; if (!hasFocus.current) startTimer(); }}
    onFocusCapture={() => { hasFocus.current = true; pauseTimer(); }}
    onBlurCapture={handleBlur}
  >
    <p className="toast-message" role="status" aria-live="polite" aria-atomic="true">{message}</p>
    <button type="button" className="toast-dismiss" aria-label="Dismiss notification" onClick={onDismiss}>Dismiss</button>
  </div>;
}

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
  const [statusMessage, setStatusMessage] = useState("");
  const dismissStatus = useCallback(() => setStatusMessage(""), []);

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
    const product = findProductByIdOrSlug(productId);
    if (!product) return;
    const nextCart = cart.some((item) => item.productId === productId)
      ? cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart, { productId, quantity }];
    setCart(nextCart);
    persist(vehicle, nextCart, zip);
    const updatedItem = nextCart.find((item) => item.productId === productId);
    setStatusMessage(`Added ${product.name} to cart. Quantity: ${updatedItem?.quantity ?? quantity}.`);
  };
  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    const currentItem = cart.find((item) => item.productId === productId);
    if (!currentItem || currentItem.quantity === quantity) return;
    const nextCart = cart.map((item) => item.productId === productId ? { ...item, quantity } : item);
    setCart(nextCart);
    persist(vehicle, nextCart, zip);
    setStatusMessage(`Quantity for ${findProductByIdOrSlug(productId)?.name ?? "item"} changed to ${quantity}.`);
  };
  const removeFromCart = (productId: string) => {
    const product = findProductByIdOrSlug(productId);
    if (!cart.some((item) => item.productId === productId)) return;
    const nextCart = cart.filter((item) => item.productId !== productId);
    setCart(nextCart);
    persist(vehicle, nextCart, zip);
    setStatusMessage(`Removed ${product?.name ?? "item"} from cart.`);
  };
  const clearCart = () => {
    if (!cart.length) return;
    setCart([]);
    persist(vehicle, [], zip);
    setStatusMessage("Removed all items from cart.");
  };
  const setZip = (nextZip: string) => {
    const normalizedZip = nextZip.replace(/\D/g, "").slice(0, 5);
    setZipState(normalizedZip);
    persist(vehicle, cart, normalizedZip);
  };
  const cartQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  return <ShopContext.Provider value={{ vehicle, setVehicle, cart, addToCart, updateQuantity, removeFromCart, clearCart, zip, setZip, hydrated, getProduct: findProductByIdOrSlug, cartQuantity, statusMessage, dismissStatus }}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}

export function ShopStatus() {
  const { statusMessage, dismissStatus } = useShop();
  return statusMessage ? <StatusToast key={statusMessage} message={statusMessage} onDismiss={dismissStatus} /> : null;
}
