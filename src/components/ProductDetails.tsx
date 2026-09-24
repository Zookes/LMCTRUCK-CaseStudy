"use client";

import Link from "next/link";
import { useState } from "react";
import { catalog, fitmentLabel, formatPrice, getFitmentStatus } from "@/lib/shop/catalog";
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
      items: [{ item_id: product.id, item_name: product.name, price: product.priceCents / 100, quantity }],
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
  if (!product) return <main className="page-wrap empty-results"><h1>Part not found</h1><p>That product is not in the catalog.</p><Link className="button secondary" href="/shop">Return to shop</Link></main>;
  const status = getFitmentStatus(product, vehicle);
  const relatedProducts = catalog.filter((entry) => entry.category === product.category && entry.id !== product.id).slice(0, 3);
  const addProduct = () => { addToCart(product.id, quantity); trackProductAddition(product, quantity); setAdded(true); };
  return <main className="page-wrap product-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>/</span><span>{product.name}</span></nav>
    <div className="product-detail"><ProductIllustration label={product.imageLabel} /><div className="product-info"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p className="part-number">Part number {product.partNumber}</p><p className="product-lede">{product.shortDescription}</p><div className="detail-price">{formatPrice(product.priceCents)} <span>{product.soldAs || "per item"}</span></div><span className={`fitment-badge ${status}`}>{fitmentLabel(status)}{vehicle ? ` for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : ""}</span><dl className="product-facts"><div><dt>Purpose / location</dt><dd>{product.purpose}</dd></div><div><dt>What&apos;s included</dt><dd>{product.included || "See product description"}</dd></div><div><dt>Availability</dt><dd>{product.availability}</dd></div></dl><p>{product.fullDescription}</p><div className="add-product"><label>Quantity<input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))} /></label><button type="button" className="button primary" onClick={addProduct}>Add to cart</button></div>{added && <p className="success-message" role="status">Added to cart. <Link href="/cart">View cart</Link></p>}<p className="prototype-note">Catalog data is fictional for this class project. Fitment is not verified for real purchases.</p></div></div>
    <section className="related-products"><div className="section-heading"><h2>More in {product.category}</h2><Link href={`/shop?category=${encodeURIComponent(product.category)}`}>View category</Link></div><div className="product-grid">{relatedProducts.map((entry) => <Link className="related-product" href={`/products/${entry.slug}`} key={entry.id}><ProductIllustration label={entry.imageLabel} /><strong>{entry.name}</strong><span>{formatPrice(entry.priceCents)}</span></Link>)}</div></section>
  </main>;
}
