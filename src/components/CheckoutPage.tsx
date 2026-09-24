"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/shop/catalog";
import { useShop } from "@/lib/shop/ShopProvider";

const shippingFor = (subtotal: number) => subtotal >= 10000 ? 0 : 1295;

export default function CheckoutPage() {
  const { cart, zip, clearCart, getProduct } = useShop();
  const [confirmed, setConfirmed] = useState(false);
  const products = cart.map((item) => ({ item, product: getProduct(item.productId) })).filter((entry): entry is { item: typeof cart[number]; product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(entry.product));
  const subtotal = useMemo(() => products.reduce((total, { item, product }) => total + product.priceCents * item.quantity, 0), [products]);
  const validZip = /^\d{5}$/.test(zip);
  const shipping = validZip ? shippingFor(subtotal) : null;
  const tax = validZip ? Math.round(subtotal * 0.075) : null;
  const total = shipping !== null && tax !== null ? subtotal + shipping + tax : null;
  if (!products.length) return <main className="page-wrap empty-results"><h1>Your cart is empty</h1><p>Add parts before starting the simulated checkout.</p><Link className="button primary" href="/shop">Browse parts</Link></main>;
  if (confirmed) return <main className="page-wrap checkout-page"><div className="checkout-confirmation"><span className="eyebrow">Simulation complete</span><h1>No real order was placed</h1><p>This prototype recorded a simulated checkout outcome for the current cart. No payment details, personal information, or order email was collected.</p><Link className="button primary" href="/shop">Continue shopping</Link><button type="button" className="button ghost" onClick={() => { clearCart(); setConfirmed(false); }}>Clear simulated cart</button></div></main>;
  return <main className="page-wrap checkout-page"><div className="page-heading"><div><span className="eyebrow">Prototype checkout</span><h1>Confirm your estimate</h1><p>Review the demonstration total before completing this simulated step.</p></div></div><section className="checkout-panel"><h2>Cart summary</h2><ul>{products.map(({ item, product }) => <li key={product.id}><span>{product.name} × {item.quantity}</span><strong>{formatPrice(product.priceCents * item.quantity)}</strong></li>)}</ul><dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Shipping estimate</dt><dd>{shipping === null ? "Enter ZIP in cart" : shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div><div><dt>Tax estimate</dt><dd>{tax === null ? "Pending ZIP" : formatPrice(tax)}</dd></div><div className="summary-total"><dt>Estimated total</dt><dd>{total === null ? "Pending ZIP" : formatPrice(total)}</dd></div></dl><p className="prototype-note">This is a class-project simulation using demonstration shipping rules and a fixed 7.5% tax estimate. No payment is processed.</p><div className="checkout-actions"><Link className="button ghost" href="/cart">Back to cart</Link><button type="button" className="button primary" onClick={() => setConfirmed(true)}>Complete simulation</button></div></section></main>;
}