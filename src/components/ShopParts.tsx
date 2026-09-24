"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [sort, setSort] = useState("featured");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextCategory = params.get("category");
    startTransition(() => {
      setQuery(params.get("q") || "");
      if (categories.includes(nextCategory as Category)) setCategory(nextCategory as Category);
      setSort(params.get("sort") || "featured");
    });
  }, []);
  const products = useMemo(() => {
    const filtered = catalog.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${product.name} ${product.partNumber} ${product.shortDescription} ${product.fullDescription} ${product.purpose} ${product.included || ""}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
    });
    return [...filtered].sort((left, right) => {
      if (sort === "price-low") return left.priceCents - right.priceCents;
      if (sort === "price-high") return right.priceCents - left.priceCents;
      if (sort === "name") return left.name.localeCompare(right.name);
      return catalog.indexOf(left) - catalog.indexOf(right);
    });
  }, [category, query, sort]);
  const resetFilters = () => { setQuery(""); setCategory(""); setSort("featured"); router.replace("/shop"); };
  const updateCategory = (nextCategory: Category | "") => {
    setCategory(nextCategory);
    const params = new URLSearchParams(window.location.search);
    if (nextCategory) params.set("category", nextCategory); else params.delete("category");
    if (sort !== "featured") params.set("sort", sort); else params.delete("sort");
    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };
  const submitQuery = () => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set("q", query.trim()); else params.delete("q");
    if (sort !== "featured") params.set("sort", sort); else params.delete("sort");
    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };
  const updateSort = (nextSort: string) => {
    setSort(nextSort);
    const params = new URLSearchParams(window.location.search);
    if (nextSort === "featured") params.delete("sort"); else params.set("sort", nextSort);
    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };
  return <main className="shop-page page-wrap">
    <div className="page-heading"><div><span className="eyebrow">Parts catalog</span><h1>Shop restoration parts</h1><p>Browse replacement and restoration parts for 1973-1987 Chevrolet and GMC trucks.</p></div><div className="vehicle-callout">{vehicle ? `Filtering for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Select a vehicle to see fitment"}</div></div>
    <div className="shop-controls"><label className="search-field">Search by product, part number, or keyword<input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submitQuery(); }} placeholder="Try LITE-LED-7387" /></label><label>Category<select value={category} onChange={(event) => updateCategory(event.target.value as Category | "")}><option value="">All categories</option>{categories.map((option) => <option key={option}>{option}</option>)}</select></label><label>Sort by<select value={sort} onChange={(event) => updateSort(event.target.value)}><option value="featured">Catalog order</option><option value="name">Name A-Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><button type="button" className="button ghost" onClick={resetFilters}>Clear filters</button></div>
    <p className="results-summary">{products.length} {products.length === 1 ? "part" : "parts"} {vehicle ? `for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : "available"}{(query || category || sort !== "featured") && <button type="button" className="text-button" onClick={resetFilters}>Clear filters</button>}</p>
    {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} productId={product.id} />)}</div> : <div className="empty-results"><h2>No parts found</h2><p>Try another product name, part number, or category.</p><button type="button" className="button secondary" onClick={resetFilters}>Show all parts</button></div>}
  </main>;
}
