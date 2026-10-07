import type { Metadata } from "next";
import CheckoutPage from "@/components/CheckoutPage";
import { SiteFooter, SiteHeader } from "@/components/ShopChrome";

export const metadata: Metadata = {
  alternates: { canonical: "/checkout" },
};

export default function CheckoutRoute() {
  return <><SiteHeader /><CheckoutPage /><SiteFooter /></>;
}