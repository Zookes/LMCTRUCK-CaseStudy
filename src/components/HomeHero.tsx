import HomeVehiclePicker from "@/components/HomeVehiclePicker";

export default function HomeHero() {
  return <section className="home-hero">
    <div>
      <span className="eyebrow">Classic truck parts</span>
      <h1>Keep the trucks you love on the road.</h1>
      <p>Find restoration parts for 1973-1987 Chevrolet and GMC trucks. Start with your vehicle or browse the catalog by category.</p>
      <HomeVehiclePicker />
    </div>
    <div className="hero-visual" role="img" aria-label="Illustration of a classic pickup truck">
      <svg viewBox="0 0 520 280" aria-hidden="true">
        <path className="truck-bed" d="M52 105h174v76H52z" />
        <path className="truck-cab" d="M226 74h133l70 66v41H226z" />
        <path className="truck-window" d="M248 88h93l42 43h-93z" />
        <path className="truck-hood" d="M359 140h82l28 41h-110z" />
        <circle cx="147" cy="194" r="32" />
        <circle cx="380" cy="194" r="32" />
        <circle className="truck-wheel" cx="147" cy="194" r="15" />
        <circle className="truck-wheel" cx="380" cy="194" r="15" />
        <path className="truck-line" d="M32 181h420" />
      </svg>
      <span>RESTORE THE DETAILS</span>
    </div>
  </section>;
}
