import type { Metadata } from "next";
import CartPage from "@/components/CartPage";
import { SiteFooter, SiteHeader } from "@/components/ShopChrome";

export const metadata: Metadata = {
  alternates: { canonical: "/cart" },
};

export default function CartRoute() {
  return <><SiteHeader /><CartPage /><SiteFooter /></>;
}
