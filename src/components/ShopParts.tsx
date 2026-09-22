"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { catalog, categories, fitmentLabel, getFitmentStatus, type Category, formatPrice } from "@/lib/shop/catalog";
import { useShop } from "@/lib/shop/ShopProvider";
import { ProductIllustration } from "./ShopChrome";

export function FitmentBadge({ productId }: { productId: string }) {
  const { vehicle, getProduct } = useShop();
  const product = getProduct(productId);
  if (!product) return null;
  const status = getFitmentStatus(product, vehicle);
  return <span className={`fitment-badge ${status}`}>{fitmentLabel(status)}</span>;
}

export function ProductCard({ productId }: { productId: string }) {
  const { addToCart, vehicle, getProduct } = useShop();
  const product = getProduct(productId);
  if (!product) return null;
  const status = getFitmentStatus(product, vehicle);
  return <article className="product-card">
    <Link href={`/products/${product.slug}`} className="product-card-link"><ProductIllustration label={product.imageLabel} /><div className="product-card-content"><span className="eyebrow">{product.category}</span><h2>{product.name}</h2><p>{product.shortDescription}</p><span className={`fitment-badge ${status}`}>{fitmentLabel(status)}</span><div className="product-meta"><strong>{formatPrice(product.priceCents)}</strong><span>{product.partNumber}</span></div></div></Link>
    <button type="button" className="button secondary card-add" onClick={() => addToCart(product.id)}>Add to cart</button>
  </article>;
}

export default function ShopParts() {
  const { vehicle } = useShop();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextCategory = params.get("category");
    if (categories.includes(nextCategory as Category)) startTransition(() => setCategory(nextCategory as Category));
  }, []);
  const products = useMemo(() => catalog.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${product.name} ${product.partNumber} ${product.shortDescription}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  }), [category, query]);
  return <main className="shop-page page-wrap">
    <div className="page-heading"><div><span className="eyebrow">LFTruck demonstration catalog</span><h1>Shop restoration parts</h1><p>Sample products for 1973-1987 Chevrolet and GMC trucks. Product and fitment data is fictional demonstration content.</p></div><div className="vehicle-callout">{vehicle ? `Filtering for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Select a vehicle to see fitment"}</div></div>
    <div className="shop-controls"><label className="search-field">Search by product or part number<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try DASH-7380-BZ" /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value as Category | "")}><option value="">All categories</option>{categories.map((option) => <option key={option}>{option}</option>)}</select></label><button type="button" className="button ghost" onClick={() => { setQuery(""); setCategory(""); }}>Reset filters</button></div>
    <p className="results-summary">{products.length} sample {products.length === 1 ? "part" : "parts"} {vehicle ? `for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : "available"}</p>
    {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} productId={product.id} />)}</div> : <div className="empty-results"><h2>No sample parts found</h2><p>Try a different product name, part number, or category.</p><button type="button" className="button secondary" onClick={() => { setQuery(""); setCategory(""); }}>Show all parts</button></div>}
  </main>;
}
