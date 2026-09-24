"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice, getFitmentStatus, fitmentLabel, findProductByPartNumber } from "@/lib/shop/catalog";
import { useShop } from "@/lib/shop/ShopProvider";
import { ProductIllustration, VehiclePicker } from "./ShopChrome";

const shippingFor = (subtotal: number) => subtotal >= 10000 ? 0 : 1295;

export default function CartPage() {
  const { cart, vehicle, zip, setZip, updateQuantity, removeFromCart, clearCart, addToCart, getProduct } = useShop();
  const [partNumber, setPartNumber] = useState("");
  const [partMessage, setPartMessage] = useState("");
  const products = cart.map((item) => ({ item, product: getProduct(item.productId) })).filter((entry): entry is { item: typeof cart[number]; product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(entry.product));
  const subtotal = useMemo(() => products.reduce((total, { item, product }) => total + product.priceCents * item.quantity, 0), [products]);
  const validZip = /^\d{5}$/.test(zip);
  const shipping = validZip ? shippingFor(subtotal) : null;
  const tax = validZip ? Math.round(subtotal * 0.075) : null;
  const total = shipping !== null && tax !== null ? subtotal + shipping + tax : null;
  const resolvePart = () => {
    const product = findProductByPartNumber(partNumber);
    if (!product) { setPartMessage("No part matches that number. Try DASH-7380-BZ."); return; }
    addToCart(product.id);
    setPartNumber("");
    setPartMessage(`${product.partNumber} added to your cart.`);
  };
  if (!products.length) return <main className="page-wrap cart-page"><div className="empty-cart"><span className="eyebrow">Your LFTruck cart</span><h1>Your cart is empty</h1><p>Add a part from the catalog, or use the part-number lookup below.</p><Link className="button primary" href="/shop">Browse parts</Link><PartNumberLookup partNumber={partNumber} setPartNumber={setPartNumber} resolvePart={resolvePart} message={partMessage} /></div></main>;
  return <main className="page-wrap cart-page"><div className="page-heading"><div><span className="eyebrow">Your LFTruck cart</span><h1>Review your parts</h1><div className="cart-fitment"><p>{vehicle ? `Fitment is shown for ${vehicle.year} ${vehicle.make} ${vehicle.model}.` : "Select a vehicle to evaluate fitment."}</p><VehiclePicker compact /></div></div><button type="button" className="button ghost quiet-action" onClick={clearCart}>Remove all items</button></div><div className="cart-layout"><section className="cart-items" aria-label="Cart items">{products.map(({ item, product }) => { const status = getFitmentStatus(product, vehicle); return <article className="cart-item" key={product.id}><ProductIllustration label={product.imageLabel} /><div className="cart-item-main"><div className="cart-item-heading"><div><h2>{product.name}</h2><p>{product.shortDescription}</p></div><strong>{formatPrice(product.priceCents * item.quantity)}</strong></div><div className="cart-item-meta"><span>Part no. {product.partNumber}</span><span>Unit {formatPrice(product.priceCents)}</span><span>{product.purpose}</span></div><span className={`fitment-badge ${status}`}>{fitmentLabel(status)}</span><details><summary>View item details</summary><p>{product.fullDescription}</p><p>Availability: {product.availability}</p></details><div className="cart-item-actions"><label>Quantity<input type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateQuantity(product.id, Math.max(1, Number.parseInt(event.target.value, 10) || 1))} /></label><button type="button" className="text-button danger" onClick={() => removeFromCart(product.id)}>Remove</button></div></div></article>; })}</section><aside className="order-summary"><h2>Estimated order total</h2><p className="prototype-note">Demonstration estimates only. No payment is processed.</p><dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Shipping <span>(simulated)</span></dt><dd>{shipping === null ? "Pending ZIP" : shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div><div><dt>Tax <span>(estimated)</span></dt><dd>{tax === null ? "Pending ZIP" : formatPrice(tax)}</dd></div><div className="summary-total"><dt>Estimated total</dt><dd>{total === null ? "Enter ZIP" : formatPrice(total)}</dd></div></dl><label className="zip-field">ZIP code for estimate<input inputMode="numeric" value={zip} onChange={(event) => setZip(event.target.value)} placeholder="e.g. 47906" aria-describedby="zip-help" /></label><p id="zip-help" className="field-help">Enter a valid 5-digit ZIP to calculate simulated shipping and tax.</p><button type="button" className="button primary full-width" onClick={() => alert("Checkout is not implemented in this prototype.")}>Checkout (prototype only)</button></aside></div><PartNumberLookup partNumber={partNumber} setPartNumber={setPartNumber} resolvePart={resolvePart} message={partMessage} /></main>;
}

function PartNumberLookup({ partNumber, setPartNumber, resolvePart, message }: { partNumber: string; setPartNumber: (value: string) => void; resolvePart: () => void; message: string }) {
  return <details className="part-number-lookup"><summary>Order by Part Number</summary><div><label>Part number<input value={partNumber} onChange={(event) => setPartNumber(event.target.value)} placeholder="DASH-7380-BZ" /></label><button type="button" className="button secondary" onClick={resolvePart}>Add matching part</button>{message && <p role="status" className="field-help">{message}</p>}</div></details>;
}
