"use client";

import Link from "next/link";
import { useState } from "react";
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
    <div className="vehicle-summary"><span>{vehicle ? `Shopping for: ${vehicleLabel(vehicle)}` : "No vehicle selected"}</span><button type="button" className="text-button" onClick={() => setOpen((current) => !current)}>{vehicle ? "Change vehicle" : "Select your vehicle"}</button></div>
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
  return <>
    <header className="site-header">
      <div className="utility-bar shop-utility">
        <Link className="utility-item" href="/"><span className="utility-icon menu-icon" /><span className="utility-label">Home</span></Link>
        <Link className="utility-item" href="/shop"><span className="utility-icon search-icon" /><span className="utility-label">Shop parts</span></Link>
        <Link className="utility-item" href="/cart" aria-label={`Shopping cart, ${cartQuantity} items`}><span className="utility-icon cart-icon" /><span className="utility-label">Cart ({cartQuantity})</span><span className="cart-count">({cartQuantity})</span></Link>
      </div>
      <div className="brand-bar"><Link className="logo" href="/">LF<small>TRUCK PARTS</small></Link></div>
      <VehiclePicker compact />
    </header>
  </>;
}

export function SiteFooter() {
  return <footer><div><h2>SUPPORT</h2><Link href="/shop">Shop parts</Link><Link href="/cart">View cart</Link></div><div><h2>OUR SHOP</h2><Link href="/">About LF Truck Parts</Link><Link href="/shop">Parts catalog</Link></div><div><h2>ORDERS</h2><span>Checkout is a prototype-only step.</span><span>Shipping estimates are simulated.</span></div><div><h2>RESOURCES</h2><Link href="/shop?category=Dashboard%20hardware">Dashboard hardware</Link><Link href="/shop?category=Lighting">Lighting</Link></div></footer>;
}

export function ProductIllustration({ label }: { label: string }) {
  return <div className="product-illustration" role="img" aria-label={label}><span>LF</span><small>DEMO PART</small></div>;
}
