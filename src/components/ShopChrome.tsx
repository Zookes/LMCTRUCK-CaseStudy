"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { vehicleLabel, vehicleMakes, vehicleModels, vehicleYears, type Vehicle } from "@/lib/shop/catalog";
import { useShop } from "@/lib/shop/ShopProvider";

export function VehiclePicker({ compact = false }: { compact?: boolean }) {
  const { vehicle, setVehicle } = useShop();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(vehicle?.year || "1985");
  const [make, setMake] = useState<Vehicle["make"]>(vehicle?.make || "Chevrolet");
  const [model, setModel] = useState(vehicle?.model || "K10");

  const apply = () => {
    setVehicle({ year, make, model });
    setOpen(false);
  };

  return <div className={`vehicle-picker${compact ? " compact" : ""}`}>
    <div className="vehicle-summary"><span>{vehicle ? vehicleLabel(vehicle) : "Select your vehicle"}</span><button type="button" className="text-button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{vehicle ? "Change" : "Choose"}</button></div>
    {open && <div className="vehicle-picker-fields" aria-label="Vehicle selector">
      <label>Year<select value={year} onChange={(event) => setYear(event.target.value)}>{vehicleYears.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label>Make<select value={make} onChange={(event) => setMake(event.target.value as Vehicle["make"])}>{vehicleMakes.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label>Model<select value={model} onChange={(event) => setModel(event.target.value)}>{vehicleModels.map((option) => <option key={option}>{option}</option>)}</select></label>
      <button type="button" className="button primary" onClick={apply}>Apply vehicle</button>
    </div>}
  </div>;
}

export function SiteHeader() {
  const { cartQuantity } = useShop();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
    setMenuOpen(false);
  };
  return <>
    <header className="site-header">
      <div className="header-main page-wrap">
        <Link className="logo" href="/" aria-label="LFTruck home"><strong>LF</strong><span>TRUCK PARTS</span></Link>
        <form className="header-search" onSubmit={submitSearch} role="search"><label className="sr-only" htmlFor="site-search">Search parts or part number</label><input id="site-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parts or part number" /><button type="submit" aria-label="Search parts"><SearchIcon /></button></form>
        <div className="header-actions"><button type="button" className="mobile-menu-button" aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}><MenuIcon /><span>Menu</span></button><Link className="cart-link" href="/cart" aria-label={`Shopping cart, ${cartQuantity} items`}><CartIcon /><span>Cart ({cartQuantity})</span></Link></div>
      </div>
      <nav className={`site-nav page-wrap${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop Parts</Link>
        <details className="category-menu"><summary>Shop by Category</summary><div className="category-menu-panel">{categoriesForNav.map((category) => <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} onClick={() => setMenuOpen(false)}>{category}</Link>)}</div></details>
        <Link href="/help" onClick={() => setMenuOpen(false)}>Help</Link>
        <div className="nav-vehicle"><VehiclePicker compact /></div>
      </nav>
    </header>
  </>;
}

export function SiteFooter() {
  return <footer><div><h2>Shop</h2><Link href="/shop">All parts</Link><Link href="/shop?category=Dashboard%20hardware">Dashboard hardware</Link><Link href="/shop?category=Lighting">Lighting</Link></div><div><h2>Help</h2><Link href="/help#shipping">Shipping estimates</Link><Link href="/help#returns">Returns information</Link><Link href="/help#fitment">Fitment help</Link></div><div><h2>About</h2><Link href="/">LFTruck</Link><Link href="/help#about">Class project details</Link></div><div><h2>Prototype notice</h2><span>Fictional catalog data for a class demonstration. No real purchases are processed.</span></div></footer>;
}

export function ProductIllustration({ label }: { label: string }) {
  const lowerLabel = label.toLowerCase();
  const variant = lowerLabel.includes("lamp") || lowerLabel.includes("headlight") ? "lighting" : lowerLabel.includes("door") || lowerLabel.includes("bed") || lowerLabel.includes("grille") || lowerLabel.includes("hatch") || lowerLabel.includes("mirror") ? "body" : lowerLabel.includes("bushing") || lowerLabel.includes("bracket") ? "suspension" : "dashboard";
  return <div className={`product-illustration illustration-${variant}`} role="img" aria-label={label}><svg viewBox="0 0 180 100" aria-hidden="true"><rect className="illustration-shadow" x="12" y="76" width="156" height="8" rx="4" /><path className="illustration-part" d={variant === "lighting" ? "M38 25h70a16 16 0 0 1 16 16v18H38a16 16 0 0 1-16-16v-2a16 16 0 0 1 16-16Z" : variant === "body" ? "M28 60 45 27h80l27 33v12H28Z" : variant === "suspension" ? "M35 26h110v12H35zM48 38h12v30H48zM120 38h12v30h-12z" : "M30 28h120v48H30z"} /><circle className="illustration-detail" cx="62" cy="51" r={variant === "lighting" ? "19" : "7"} /><circle className="illustration-detail" cx="118" cy="51" r={variant === "lighting" ? "19" : "7"} /></svg><span>{variant === "lighting" ? "LAMP" : variant === "body" ? "PANEL" : variant === "suspension" ? "CHASSIS" : "DASH"}</span><small>{label.replace("Illustration: ", "")}</small></div>;
}

const categoriesForNav = ["Dashboard hardware", "Body panels", "Lighting", "Suspension"];
function SearchIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>; }
function MenuIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>; }
function CartIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></svg>; }
