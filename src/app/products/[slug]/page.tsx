import type { Metadata } from "next";
import ProductDetails from "@/components/ProductDetails";
import { SiteFooter, SiteHeader } from "@/components/ShopChrome";
import { catalog } from "@/lib/shop/catalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { alternates: { canonical: `/products/${slug}` } };
}

export function generateStaticParams() {
  return catalog.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = catalog.find((entry) => entry.slug === slug);
  return <><SiteHeader /><ProductDetails productId={product?.id || "missing"} /><SiteFooter /></>;
}
