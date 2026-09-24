"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/ShopParts";
import { SiteFooter, SiteHeader, VehiclePicker } from "@/components/ShopChrome";
import { catalog, categories } from "@/lib/shop/catalog";

export default function Home() {
  const [showPicker, setShowPicker] = useState(false);
  return <>
    <SiteHeader />
    <main className="home-page page-wrap">
      <section className="home-hero">
        <div><span className="eyebrow">Classic truck parts</span><h1>Keep the trucks you love on the road.</h1><p>Find restoration parts for 1973-1987 Chevrolet and GMC trucks. Start with your vehicle or browse the catalog by category.</p><div className="hero-actions"><button type="button" className="button primary" onClick={() => setShowPicker((current) => !current)}>Select your vehicle</button><Link className="button secondary" href="/shop">Shop all parts</Link></div>{showPicker && <VehiclePicker />}</div><div className="hero-visual" role="img" aria-label="Illustration of a classic pickup truck"><svg viewBox="0 0 520 280" aria-hidden="true"><path className="truck-bed" d="M52 105h174v76H52z" /><path className="truck-cab" d="M226 74h133l70 66v41H226z" /><path className="truck-window" d="M248 88h93l42 43h-93z" /><path className="truck-hood" d="M359 140h82l28 41h-110z" /><circle cx="147" cy="194" r="32" /><circle cx="380" cy="194" r="32" /><circle className="truck-wheel" cx="147" cy="194" r="15" /><circle className="truck-wheel" cx="380" cy="194" r="15" /><path className="truck-line" d="M32 181h420" /></svg><span>RESTORE THE DETAILS</span></div>
      </section>
      <section className="home-section"><div className="section-heading"><div><span className="eyebrow">Start with a category</span><h2>Browse restoration parts</h2></div><Link href="/shop">View all parts</Link></div><div className="category-links home-categories">{categories.map((category) => <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`}>{category}<span>Explore sample parts</span></Link>)}</div></section>
      <section className="home-section"><div className="section-heading"><div><span className="eyebrow">Featured samples</span><h2>Popular dashboard hardware</h2></div><Link href="/shop?category=Dashboard%20hardware">See category</Link></div><div className="product-grid featured-grid">{catalog.filter((product) => product.category === "Dashboard hardware").slice(0, 3).map((product) => <ProductCard key={product.id} productId={product.id} />)}</div></section>
      <section className="prototype-banner"><strong>Prototype catalog</strong><span>Prices, availability, images, and fitment are fictional demonstration data for this class project.</span><Link href="/cart">Review your cart</Link></section>
    </main>
    <SiteFooter />
  </>;
}
