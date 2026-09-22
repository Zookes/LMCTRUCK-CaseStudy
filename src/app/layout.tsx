import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import { ShopProvider } from "@/lib/shop/ShopProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const pageUrl = siteUrl ? new URL("/", siteUrl).toString() : "/";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "1973–1987 Chevy and GMC Truck Parts",
    description:
      "Browse restoration and replacement parts for 1973–1987 Chevy and GMC trucks. Select your exact vehicle or shop by part category.",
    url: pageUrl,
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: pageUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "1973–1987 Chevy and GMC Truck Parts",
        item: pageUrl,
      },
    ],
  },
];

const serializedStructuredData = JSON.stringify(structuredData).replace(
  /[<>&]/g,
  (character) => ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026" })[character]!,
);

export const metadata: Metadata = {
  title: "1973–1987 Chevy and GMC Truck Parts | LFTruck",
  description:
    "Browse restoration and replacement parts for 1973–1987 Chevy and GMC trucks. Select your exact vehicle or shop by part category.",
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ShopProvider>{children}</ShopProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializedStructuredData }}
        />
        <GoogleAnalytics gaId="G-4X8Z994TYM" />
      </body>
    </html>
  );
}
