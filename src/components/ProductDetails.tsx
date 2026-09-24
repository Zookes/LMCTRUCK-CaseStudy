"use client";

import Link from "next/link";
import { useState } from "react";
import { fitmentLabel, formatPrice, getFitmentStatus } from "@/lib/shop/catalog";
import { useShop } from "@/lib/shop/ShopProvider";
import { ProductIllustration } from "./ShopChrome";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, parameters: Record<string, unknown>) => void;
  }
}

const trackedProductSlug = "square-body-led-headlight-set";
const trackedSourcePage = "/products/square-body-led-headlight-set";

function trackProductAddition(product: NonNullable<ReturnType<ReturnType<typeof useShop>["getProduct"]>>, quantity: number) {
  if (product.slug !== trackedProductSlug || typeof window === "undefined" || typeof window.gtag !== "function") return;
  const debugMode = new URLSearchParams(window.location.search).get("ga_debug") === "1";
  try {
    window.gtag("event", "add_to_cart", {
      currency: "USD",
      value: (product.priceCents / 100) * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.priceCents / 100,
        quantity,
      }],
      source_page: trackedSourcePage,
      ...(debugMode ? { debug_mode: true } : {}),
    });
  } catch {
    // Analytics must not block the cart action.
  }
}

export default function ProductDetails({ productId }: { productId: string }) {
  const { addToCart, vehicle, getProduct } = useShop();
  const product = getProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return <main className="page-wrap empty-results"><h1>Part not found</h1><p>That sample product is not in the demonstration catalog.</p><Link className="button secondary" href="/shop">Return to shop</Link></main>;
  const status = getFitmentStatus(product, vehicle);
  const addProduct = () => { addToCart(product.id, quantity); trackProductAddition(product, quantity); setAdded(true); };
  return <main className="page-wrap product-page"><Link className="back-link" href="/shop">Back to shop</Link><div className="product-detail"><ProductIllustration label={product.imageLabel} /><div className="product-info"><span className="eyebrow">{product.category} / demonstration product</span><h1>{product.name}</h1><p className="product-lede">{product.shortDescription}</p><div className="detail-price">{formatPrice(product.priceCents)} <span>per item</span></div><span className={`fitment-badge ${status}`}>{fitmentLabel(status)}{vehicle ? ` for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : ""}</span><dl className="product-facts"><div><dt>Part number</dt><dd>{product.partNumber}</dd></div><div><dt>Purpose / location</dt><dd>{product.purpose}</dd></div><div><dt>Availability</dt><dd>{product.availability}</dd></div></dl><p>{product.fullDescription}</p><div className="add-product"><label>Quantity<input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))} /></label><button type="button" className="button primary" onClick={addProduct}>Add to cart</button></div>{added && <p className="success-message" role="status">Added to cart. <Link href="/cart">View cart</Link></p>}<p className="prototype-note">Prototype catalog content. Confirm fitment and final pricing before any real purchase.</p></div></div></main>;
}
