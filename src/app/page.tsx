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
        <div><span className="eyebrow">LFTruck demonstration catalog</span><h1>Parts for the trucks you keep.</h1><p>Browse fictional restoration parts for 1973-1987 Chevrolet and GMC trucks. Select a vehicle, find a category, and build a sample cart.</p><div className="hero-actions"><button type="button" className="button primary" onClick={() => setShowPicker((current) => !current)}>Select your vehicle</button><Link className="button secondary" href="/shop">Shop all parts</Link></div>{showPicker && <VehiclePicker />}</div><div className="hero-mark" aria-label="LFTruck demonstration brand illustration"><strong>LF</strong><span>TRUCK PARTS</span></div>
      </section>
      <section className="home-section"><div className="section-heading"><div><span className="eyebrow">Start with a category</span><h2>Browse restoration parts</h2></div><Link href="/shop">View all parts</Link></div><div className="category-links home-categories">{categories.map((category) => <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`}>{category}<span>Explore sample parts</span></Link>)}</div></section>
      <section className="home-section"><div className="section-heading"><div><span className="eyebrow">Featured samples</span><h2>Popular dashboard hardware</h2></div><Link href="/shop?category=Dashboard%20hardware">See category</Link></div><div className="product-grid featured-grid">{catalog.filter((product) => product.category === "Dashboard hardware").slice(0, 3).map((product) => <ProductCard key={product.id} productId={product.id} />)}</div></section>
      <section className="prototype-banner"><strong>Prototype catalog</strong><span>Prices, availability, images, and fitment are fictional demonstration data for this class project.</span><Link href="/cart">Review your cart</Link></section>
    </main>
    <SiteFooter />
  </>;
}
