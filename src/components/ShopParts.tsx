"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { catalog, categories, fitmentLabel, getFitmentStatus, type Category, formatPrice } from "@/lib/shop/catalog";
import { useShop } from "@/lib/shop/ShopProvider";
import { ProductIllustration } from "./ShopChrome";

type Subcategory = { label: string; value: string };
type DirectoryCategory = { category: Category; title: string; description: string; imageLabel: string; subcategories: Subcategory[] };

const directoryCategories: DirectoryCategory[] = [
  { category: "Dashboard hardware", title: "Interior and dash", description: "Trim, panels, lenses, and small hardware for a cleaner cab interior.", imageLabel: "Illustration: charcoal dash bezel", subcategories: [{ label: "Dash trim and panels", value: "dash-trim" }, { label: "Instrument cluster", value: "instrument-cluster" }] },
  { category: "Body panels", title: "Body and exterior", description: "Repair panels, handles, mirrors, emblems, and exterior weather seals.", imageLabel: "Illustration: silver door skin", subcategories: [{ label: "Exterior panels", value: "exterior-panels" }, { label: "Weatherstripping and seals", value: "weatherstripping" }] },
  { category: "Lighting", title: "Lighting and electrical", description: "Headlights, signal lenses, marker lamps, and auxiliary lighting parts.", imageLabel: "Illustration: round LED headlamp", subcategories: [{ label: "Headlights", value: "headlights" }, { label: "Tail and signal lights", value: "signal-lights" }, { label: "Marker and auxiliary lights", value: "marker-lights" }] },
  { category: "Suspension", title: "Suspension and steering", description: "Bushings, brackets, shackles, and front-end restoration components.", imageLabel: "Illustration: black steel bracket pair", subcategories: [{ label: "Suspension hardware", value: "suspension-hardware" }, { label: "Steering", value: "steering" }] },
];

const productSubcategories: Record<string, string> = {
  "dash-bezel-73-80": "dash-trim", "dash-lens-81-87": "instrument-cluster", "dash-switch-panel": "dash-trim", "dash-glovebox-door": "dash-trim", "dash-vent-set": "dash-trim", "door-panel-clips": "dash-trim",
  "door-skin-c10": "exterior-panels", "bed-corner-k10": "exterior-panels", "unknown-fitment-mirror": "exterior-panels", "gmc-grille-emblem": "exterior-panels", "front-fender-repair": "exterior-panels", "tailgate-handle": "exterior-panels", "rear-wheel-arch": "exterior-panels", "door-weatherstrip": "weatherstripping", "blazer-roof-seal": "weatherstripping", "suburban-rear-hatch-seal": "weatherstripping", "windshield-seal": "weatherstripping",
  "led-headlight-set": "headlights", "tail-lamp-lens": "signal-lights", "turn-signal-lens": "signal-lights", "fog-light-pair": "marker-lights", "led-cab-light": "marker-lights",
  "front-bumper-brackets": "suspension-hardware", "front-sway-bushings": "suspension-hardware", "leaf-spring-shackle": "suspension-hardware", "shock-mount-bushings": "suspension-hardware", "steering-linkage-kit": "steering",
};

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
  return <article className="product-card"><Link href={`/products/${product.slug}`} className="product-card-link"><ProductIllustration label={product.imageLabel} /><div className="product-card-content"><span className="eyebrow">{product.category}</span><h2>{product.name}</h2><p>{product.shortDescription}</p><span className={`fitment-badge ${status}`}>{fitmentLabel(status)}</span><div className="product-meta"><strong>{formatPrice(product.priceCents)}</strong><span>{product.partNumber}</span></div></div></Link><button type="button" className="button secondary card-add" onClick={() => addToCart(product.id)}>Add to cart</button></article>;
}

function makeShopUrl(values: { query?: string; category?: Category | ""; subcategory?: string; sort?: string; all?: boolean }) {
  const params = new URLSearchParams();
  if (values.query) params.set("q", values.query);
  if (values.category) params.set("category", values.category);
  if (values.subcategory) params.set("subcategory", values.subcategory);
  if (values.sort && values.sort !== "featured") params.set("sort", values.sort);
  if (values.all) params.set("all", "1");
  return `/shop${params.toString() ? `?${params.toString()}` : ""}`;
}

function SearchBar({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  return <div className="shop-search-directory"><label className="search-field">Search parts, part numbers, or keywords<input value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onSubmit(); }} placeholder="Try LITE-LED-7387" /></label><button type="button" className="button primary" onClick={onSubmit}>Search catalog</button></div>;
}

export default function ShopParts() {
  const { vehicle } = useShop();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [subcategory, setSubcategory] = useState("");
  const [sort, setSort] = useState("featured");
  const [browseAll, setBrowseAll] = useState(false);
  const syncFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    startTransition(() => {
      setQuery(params.get("q") || "");
      const nextCategory = params.get("category") as Category | null;
      setCategory(nextCategory && categories.includes(nextCategory) ? nextCategory : "");
      setSubcategory(params.get("subcategory") || "");
      setSort(params.get("sort") || "featured");
      setBrowseAll(params.get("all") === "1");
    });
  };
  useEffect(() => { syncFromUrl(); window.addEventListener("popstate", syncFromUrl); return () => window.removeEventListener("popstate", syncFromUrl); }, []);
  const showDirectory = !browseAll && !query && !category && !subcategory;
  const activeDirectoryCategory = directoryCategories.find((entry) => entry.category === category);
  const products = useMemo(() => {
    const filtered = catalog.filter((product) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesCategory = !category || product.category === category;
      const matchesSubcategory = !subcategory || productSubcategories[product.id] === subcategory;
      const searchable = `${product.name} ${product.partNumber} ${product.shortDescription} ${product.fullDescription} ${product.purpose} ${product.included || ""}`.toLowerCase();
      return matchesCategory && matchesSubcategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
    return [...filtered].sort((left, right) => sort === "price-low" ? left.priceCents - right.priceCents : sort === "price-high" ? right.priceCents - left.priceCents : sort === "name" ? left.name.localeCompare(right.name) : catalog.indexOf(left) - catalog.indexOf(right));
  }, [category, query, sort, subcategory]);
  const goToListing = (values: { query?: string; category?: Category | ""; subcategory?: string; sort?: string }) => { setQuery(values.query || ""); setCategory(values.category || ""); setSubcategory(values.subcategory || ""); setSort(values.sort || "featured"); router.push(makeShopUrl(values)); };
  const resetFilters = () => { setQuery(""); setCategory(""); setSubcategory(""); setSort("featured"); setBrowseAll(false); router.push("/shop"); };
  const updateSort = (nextSort: string) => { setSort(nextSort); goToListing({ query, category, subcategory, sort: nextSort }); };
  return <main className="shop-page page-wrap">
    <div className="page-heading"><div><span className="eyebrow">Parts catalog</span><h1>{showDirectory ? "Shop Parts by Category" : activeDirectoryCategory?.title || (query ? "Search results" : "Shop parts")}</h1><p>{showDirectory ? "Start with a category, or search the complete catalog by name, part number, or keyword." : activeDirectoryCategory?.description || "Browse products, compare details, and choose a part for your truck project."}</p></div><div className="vehicle-callout">{vehicle ? `Filtering for ${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Select a vehicle to see fitment"}</div></div>
    <SearchBar value={query} onChange={setQuery} onSubmit={() => goToListing({ query: query.trim(), category, subcategory, sort })} />
    {showDirectory ? <CategoryDirectory /> : <Listing products={products} category={category} subcategory={subcategory} sort={sort} query={query} activeDirectoryCategory={activeDirectoryCategory} onCategoryChange={(next) => goToListing({ query, category: next, sort })} onSortChange={updateSort} resetFilters={resetFilters} />}
  </main>;
}

function CategoryDirectory() {
  return <section className="category-directory" aria-labelledby="category-directory-heading"><div className="directory-heading"><div><span className="eyebrow">Browse the catalog</span><h2 id="category-directory-heading">Find parts by system</h2></div><a className="button ghost" href="/shop?all=1">Browse all parts</a></div><div className="category-directory-grid">{directoryCategories.map((entry) => <article className="category-directory-card" key={entry.category}><a href={makeShopUrl({ category: entry.category })}><ProductIllustration label={entry.imageLabel} /><div><h3>{entry.title}</h3><p>{entry.description}</p><strong>View all {entry.category}</strong></div></a><div className="subcategory-links">{entry.subcategories.map((subcategory) => <a key={subcategory.value} href={makeShopUrl({ category: entry.category, subcategory: subcategory.value })}>{subcategory.label}</a>)}</div></article>)}</div></section>;
}

function Listing({ products, category, subcategory, sort, query, activeDirectoryCategory, onCategoryChange, onSortChange, resetFilters }: { products: typeof catalog; category: Category | ""; subcategory: string; sort: string; query: string; activeDirectoryCategory?: DirectoryCategory; onCategoryChange: (category: Category | "") => void; onSortChange: (sort: string) => void; resetFilters: () => void }) {
  const subcategoryLabel = activeDirectoryCategory?.subcategories.find((entry) => entry.value === subcategory)?.label;
  return <><div className="listing-breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/shop">Shop Parts</Link>{category && <><span>/</span><Link href={makeShopUrl({ category })}>{activeDirectoryCategory?.title || category}</Link></>}{subcategoryLabel && <><span>/</span><span>{subcategoryLabel}</span></>}</div>{activeDirectoryCategory && <div className="subcategory-strip"><strong>Shop {activeDirectoryCategory.title}</strong>{activeDirectoryCategory.subcategories.map((entry) => <Link className={entry.value === subcategory ? "active" : ""} href={makeShopUrl({ category, subcategory: entry.value })} key={entry.value}>{entry.label}</Link>)}</div>}<div className="shop-controls"><label>Category<select value={category} onChange={(event) => onCategoryChange(event.target.value as Category | "")}><option value="">All categories</option>{categories.map((option) => <option key={option}>{option}</option>)}</select></label><label>Sort by<select value={sort} onChange={(event) => onSortChange(event.target.value)}><option value="featured">Catalog order</option><option value="name">Name A-Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label><button type="button" className="button ghost" onClick={resetFilters}>Clear filters</button></div><p className="results-summary">{products.length} {products.length === 1 ? "part" : "parts"}{query ? ` matching “${query}”` : category ? ` in ${activeDirectoryCategory?.title || category}` : " available"}{subcategoryLabel ? ` / ${subcategoryLabel}` : ""}{(query || category || subcategory || sort !== "featured") && <button type="button" className="text-button" onClick={resetFilters}>Clear filters</button>}</p>{products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} productId={product.id} />)}</div> : <div className="empty-results"><h2>No parts found</h2><p>Try another keyword or browse a different category.</p><button type="button" className="button secondary" onClick={resetFilters}>Browse all categories</button></div>}</>;
}
