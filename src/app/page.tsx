import Link from "next/link";
import { ProductCard } from "@/components/ShopParts";
import { SiteFooter, SiteHeader } from "@/components/ShopChrome";
import HomeHero from "@/components/HomeHero";
import { catalog, categories } from "@/lib/shop/catalog";

export default function Home() {
  return <>
    <SiteHeader />
    <main className="home-page page-wrap">
      <HomeHero />
      <section className="home-section"><div className="section-heading"><div><span className="eyebrow">Start with a category</span><h2>Browse restoration parts</h2></div><Link href="/shop">View all parts</Link></div><div className="category-links home-categories">{categories.map((category) => <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`}>{category}<span>Explore sample parts</span></Link>)}</div></section>
      <section className="home-section"><div className="section-heading"><div><span className="eyebrow">Featured samples</span><h2>Popular dashboard hardware</h2></div><Link href="/shop?category=Dashboard%20hardware">See category</Link></div><div className="product-grid featured-grid">{catalog.filter((product) => product.category === "Dashboard hardware").slice(0, 3).map((product) => <ProductCard key={product.id} productId={product.id} />)}</div></section>
      <section className="prototype-banner"><strong>Prototype catalog</strong><span>Prices, availability, images, and fitment are fictional demonstration data for this class project.</span><Link href="/cart">Review your cart</Link></section>
    </main>
    <SiteFooter />
  </>;
}
