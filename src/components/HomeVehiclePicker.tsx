"use client";

import { useState } from "react";
import Link from "next/link";
import { VehiclePicker } from "@/components/ShopChrome";

export default function HomeVehiclePicker() {
  const [showPicker, setShowPicker] = useState(false);

  return <>
    <div className="hero-actions">
      <button
        type="button"
        className="button primary"
        aria-expanded={showPicker}
        onClick={() => setShowPicker((current) => !current)}
      >
        Select your vehicle
      </button>
      <Link className="button secondary" href="/shop">Shop all parts</Link>
    </div>
    {showPicker && <VehiclePicker />}
  </>;
}
