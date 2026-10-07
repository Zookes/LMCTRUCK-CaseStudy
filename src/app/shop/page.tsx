import type { Metadata } from "next";
import ShopParts from "@/components/ShopParts";
import { SiteFooter, SiteHeader } from "@/components/ShopChrome";

export const metadata: Metadata = {
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <><SiteHeader /><ShopParts /><SiteFooter /></>;
}
