export const categories = ["Dashboard hardware", "Body panels", "Lighting", "Suspension"] as const;
export type Category = (typeof categories)[number];

export type Vehicle = {
  year: string;
  make: "Chevrolet" | "GMC";
  model: string;
};

export type Product = {
  id: string;
  slug: string;
  partNumber: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  priceCents: number;
  imageLabel: string;
  availability: string;
  included?: string;
  soldAs?: string;
  category: Category;
  applications: Vehicle[];
};

export const vehicleYears = Array.from({ length: 15 }, (_, index) => String(1973 + index));
export const vehicleMakes = ["Chevrolet", "GMC"] as const;
export const vehicleModels = ["C10", "K10", "C20", "K20", "Blazer", "Suburban", "Sierra Classic", "Jimmy"] as const;

const chevyGmc = (models: string[], years = vehicleYears): Vehicle[] =>
  years.flatMap((year) => [
    ...models.map((model) => ({ year, make: "Chevrolet" as const, model })),
    ...models.map((model) => ({ year, make: "GMC" as const, model })),
  ]);

const selectedDashboard = (models: string[]) => chevyGmc(models, ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987"]);

export const catalog: Product[] = [
  {
    id: "dash-bezel-73-80",
    slug: "1973-80-dash-bezel",
    partNumber: "DASH-7380-BZ",
    name: "1973-80 Dash Bezel and Hardware Kit",
    shortDescription: "Replacement bezel trim with the clips and screws needed for a clean instrument-panel install.",
    fullDescription: "A reproduction dash bezel kit for the square-body instrument cluster. The molded trim restores the original layout and includes the small hardware usually lost during removal.",
    purpose: "Instrument panel and dashboard trim",
    priceCents: 7495,
    imageLabel: "Illustration: charcoal dash bezel",
    availability: "In stock for demonstration",
    category: "Dashboard hardware",
    applications: selectedDashboard(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "dash-lens-81-87",
    slug: "1981-87-dash-lens",
    partNumber: "DASH-8187-LN",
    name: "1981-87 Instrument Cluster Lens",
    shortDescription: "Clear replacement lens for a scratched or cloudy square-body gauge cluster.",
    fullDescription: "This demonstration replacement lens restores readability to the speedometer and warning-light windows without replacing the complete cluster.",
    purpose: "Instrument cluster face",
    priceCents: 3295,
    imageLabel: "Illustration: clear gauge lens",
    availability: "Ships in 2-3 days in prototype",
    category: "Dashboard hardware",
    applications: selectedDashboard(["C10", "K10", "C20", "K20", "C30", "K30"]),
  },
  {
    id: "dash-switch-panel",
    slug: "square-body-switch-panel",
    partNumber: "DASH-SW-7587",
    name: "Square-Body Dash Switch Panel",
    shortDescription: "Blank replacement switch panel for adding accessories to the lower dash.",
    fullDescription: "A clean, uncut panel for custom accessory switches. It is useful for restorations that need a tidy replacement for a cracked or missing lower dash panel.",
    purpose: "Lower dashboard accessory panel",
    priceCents: 2895,
    imageLabel: "Illustration: black switch panel",
    availability: "Limited prototype stock",
    category: "Dashboard hardware",
    applications: selectedDashboard(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "door-skin-c10",
    slug: "c10-driver-door-skin",
    partNumber: "BODY-C10-DS",
    name: "C10 Driver Door Skin",
    shortDescription: "Stamped outer panel for repairing rust or impact damage on the driver door.",
    fullDescription: "A demonstration replacement outer skin shaped for a classic C10 driver door. Test-fit and professional finishing are recommended before paint.",
    purpose: "Driver-side exterior door repair",
    priceCents: 15995,
    imageLabel: "Illustration: silver door skin",
    availability: "Made to order in prototype",
    category: "Body panels",
    applications: chevyGmc(["C10"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980"]),
  },
  {
    id: "bed-corner-k10",
    slug: "k10-bed-corner-panel",
    partNumber: "BODY-K10-BC",
    name: "K10 Rear Bed Corner Panel",
    shortDescription: "Repair panel for the lower rear corner of a short-bed 4x4 pickup.",
    fullDescription: "This sample repair panel follows the original bed-corner contour and is intended for rust repair before bodywork and paint.",
    purpose: "Rear bed corner rust repair",
    priceCents: 6895,
    imageLabel: "Illustration: galvanized bed corner",
    availability: "In stock for demonstration",
    category: "Body panels",
    applications: chevyGmc(["K10"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987"]),
  },
  {
    id: "led-headlight-set",
    slug: "square-body-led-headlight-set",
    partNumber: "LITE-LED-7387",
    name: "Square-Body LED Headlight Set",
    shortDescription: "Pair of sealed-beam-style LED lamps with a period-friendly outer profile.",
    fullDescription: "A fictional demonstration lighting upgrade with a classic outer appearance and brighter modern internals. Verify wiring and local road requirements before installation.",
    purpose: "Front lighting upgrade",
    priceCents: 11995,
    imageLabel: "Illustration: round LED headlamp",
    availability: "In stock for demonstration",
    category: "Lighting",
    applications: chevyGmc(["C10", "K10", "C20", "K20", "Blazer", "Suburban", "Sierra Classic", "Jimmy"]),
  },
  {
    id: "tail-lamp-lens",
    slug: "1973-80-tail-lamp-lens",
    partNumber: "LITE-7380-TL",
    name: "1973-80 Tail Lamp Lens Pair",
    shortDescription: "Red replacement lenses for a weathered rear lamp assembly.",
    fullDescription: "Replace faded or cracked lenses while retaining the original-style lamp housing. Bulbs and hardware are not included in this sample listing.",
    purpose: "Rear tail lamp restoration",
    priceCents: 2495,
    imageLabel: "Illustration: red tail lamp lens",
    availability: "Ships in 2-3 days in prototype",
    category: "Lighting",
    applications: chevyGmc(["C10", "K10", "C20", "K20"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980"]),
  },
  {
    id: "front-bumper-brackets",
    slug: "square-body-front-bumper-brackets",
    partNumber: "SUSP-BMP-7387",
    name: "Square-Body Front Bumper Brackets",
    shortDescription: "Pair of replacement mounting brackets for a straighter front bumper fit.",
    fullDescription: "These fictional brackets replace bent or rusted supports and help position the original-style front bumper during a restoration.",
    purpose: "Front bumper mounting",
    priceCents: 5495,
    imageLabel: "Illustration: black steel bracket pair",
    availability: "In stock for demonstration",
    category: "Suspension",
    applications: chevyGmc(["C10", "K10", "C20", "K20"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987"]),
  },
  {
    id: "front-sway-bushings",
    slug: "front-sway-bar-bushings",
    partNumber: "SUSP-SWAY-87",
    name: "Front Sway Bar Bushing Set",
    shortDescription: "Rubber bushing set to reduce front-end movement and restore steering feel.",
    fullDescription: "A sample replacement bushing kit for trucks using the matching front sway bar diameter. Measure the existing bar before ordering.",
    purpose: "Front suspension sway bar",
    priceCents: 1895,
    imageLabel: "Illustration: four rubber bushings",
    availability: "In stock for demonstration",
    category: "Suspension",
    applications: chevyGmc(["C10", "K10", "C20", "K20"], ["1981", "1982", "1983", "1984", "1985", "1986", "1987"]),
  },
  {
    id: "blazer-roof-seal",
    slug: "blazer-roof-seal",
    partNumber: "BODY-BLAZER-RS",
    name: "Blazer Removable Roof Seal",
    shortDescription: "Flexible perimeter seal for the removable roof panel on a classic Blazer.",
    fullDescription: "This demonstration weatherstrip is shaped for the removable roof perimeter and helps quiet wind noise after a careful clean and test fit.",
    purpose: "Removable roof weather sealing",
    priceCents: 8995,
    imageLabel: "Illustration: black rubber seal",
    availability: "Limited prototype stock",
    category: "Body panels",
    applications: chevyGmc(["Blazer"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982"]),
  },
  {
    id: "unknown-fitment-mirror",
    slug: "universal-tow-mirror",
    partNumber: "MIR-UNIV-01",
    name: "Universal Tow Mirror",
    shortDescription: "Adjustable clip-on mirror for towing and workshop mockups.",
    fullDescription: "This fictional universal accessory is included to demonstrate an unknown-fitment state. Confirm mounting clearance and vehicle application before purchase.",
    purpose: "Temporary towing visibility",
    priceCents: 4595,
    imageLabel: "Illustration: adjustable tow mirror",
    availability: "Prototype sample only",
    category: "Body panels",
    applications: [],
  },
  {
    id: "gmc-grille-emblem",
    slug: "gmc-grille-emblem",
    partNumber: "BODY-GMC-EMB",
    name: "GMC Grille Emblem",
    shortDescription: "Replacement red grille emblem for a classic GMC front end.",
    fullDescription: "A fictional emblem for demonstration catalog work. Mounting locations vary by grille design, so verify the grille before ordering.",
    purpose: "GMC grille identification",
    priceCents: 2195,
    imageLabel: "Illustration: red GMC grille emblem",
    availability: "In stock for demonstration",
    category: "Body panels",
    applications: chevyGmc(["Sierra Classic", "Jimmy"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987"]),
  },
  {
    id: "suburban-rear-hatch-seal",
    slug: "suburban-rear-hatch-seal",
    partNumber: "BODY-SUB-HS",
    name: "Suburban Rear Hatch Seal",
    shortDescription: "Replacement rubber seal for a leaking rear cargo hatch.",
    fullDescription: "This fictional sample seal fills the perimeter channel around a classic Suburban rear hatch and is intended to reduce water intrusion after proper surface preparation.",
    purpose: "Rear cargo hatch weather sealing",
    priceCents: 7295,
    imageLabel: "Illustration: black hatch seal",
    availability: "Ships in 2-3 days in prototype",
    category: "Body panels",
    applications: chevyGmc(["Suburban"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987"]),
  },
  {
    id: "dash-glovebox-door", slug: "square-body-glovebox-door", partNumber: "DASH-GB-7387", name: "Square-Body Glovebox Door", shortDescription: "Replacement glovebox door for a cracked or missing lower dash panel.", fullDescription: "A molded replacement door for the original-style glovebox opening. Finish and hardware fit should be checked before installation.", purpose: "Interior storage and dashboard trim", priceCents: 5895, imageLabel: "Illustration: glovebox door", availability: "In stock for demonstration", included: "One glovebox door", soldAs: "Sold individually", category: "Dashboard hardware", applications: selectedDashboard(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "dash-vent-set", slug: "square-body-dash-vent-set", partNumber: "DASH-VENT-7387", name: "Square-Body Dash Vent Set", shortDescription: "Pair of replacement dash vents for a cleaner, more complete interior restoration.", fullDescription: "Replacement directional vents for the upper dashboard. This set is intended for interior refresh work and does not include ducting.", purpose: "Dashboard air vents", priceCents: 4295, imageLabel: "Illustration: dash vent set", availability: "Limited prototype stock", included: "Two dash vents", soldAs: "Sold as a pair", category: "Dashboard hardware", applications: selectedDashboard(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "door-panel-clips", slug: "square-body-door-panel-clips", partNumber: "DASH-DOOR-CLP", name: "Door Panel Retainer Clip Kit", shortDescription: "Replacement clips for refitting a classic truck interior door panel.", fullDescription: "A small hardware kit for replacing missing or broken door-panel retainers during interior restoration.", purpose: "Interior door-panel hardware", priceCents: 1695, imageLabel: "Illustration: retainer clips", availability: "In stock for demonstration", included: "Twenty replacement clips", soldAs: "Sold as a kit", category: "Dashboard hardware", applications: selectedDashboard(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "front-fender-repair", slug: "c10-front-fender-repair-panel", partNumber: "BODY-C10-FRP", name: "C10 Front Fender Repair Panel", shortDescription: "Lower repair panel for addressing rust near the front fender wheel opening.", fullDescription: "A representative lower repair section for bodywork and paint preparation. Professional test fitting and finishing are required.", purpose: "Front fender rust repair", priceCents: 8295, imageLabel: "Illustration: fender repair panel", availability: "Made to order in prototype", included: "One driver-side repair panel", soldAs: "Sold individually", category: "Body panels", applications: chevyGmc(["C10"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980"]),
  },
  {
    id: "tailgate-handle", slug: "square-body-tailgate-handle", partNumber: "BODY-TG-HDL", name: "Square-Body Tailgate Handle", shortDescription: "Replacement exterior handle for a stiff or broken pickup tailgate latch.", fullDescription: "A replacement-style handle for classic pickup tailgates. Confirm latch style and mounting dimensions before ordering.", purpose: "Pickup tailgate latch hardware", priceCents: 3695, imageLabel: "Illustration: tailgate handle", availability: "In stock for demonstration", included: "One handle and basic hardware", soldAs: "Sold as a kit", category: "Body panels", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "rear-wheel-arch", slug: "square-body-rear-wheel-arch", partNumber: "BODY-WA-7387", name: "Square-Body Rear Wheel Arch", shortDescription: "Body repair section for rust around a classic pickup rear wheel opening.", fullDescription: "A representative wheel-arch section for restoration bodywork. It is not an exact-fitment claim and requires fabrication and finishing.", purpose: "Rear quarter-panel rust repair", priceCents: 9495, imageLabel: "Illustration: wheel arch panel", availability: "Made to order in prototype", included: "One wheel-arch repair section", soldAs: "Sold individually", category: "Body panels", applications: chevyGmc(["C10", "K10"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980"]),
  },
  {
    id: "fog-light-pair", slug: "square-body-fog-light-pair", partNumber: "LITE-FOG-7387", name: "Square-Body Fog Light Pair", shortDescription: "Compact auxiliary lamps for a period-inspired front lighting setup.", fullDescription: "A fictional pair of auxiliary lights for demonstration catalog work. Verify mounting, wiring, and local road requirements before installation.", purpose: "Auxiliary front lighting", priceCents: 6495, imageLabel: "Illustration: fog light pair", availability: "In stock for demonstration", included: "Two fog lamps and mounting brackets", soldAs: "Sold as a pair", category: "Lighting", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "turn-signal-lens", slug: "square-body-turn-signal-lens", partNumber: "LITE-TURN-7387", name: "Square-Body Turn Signal Lens Pair", shortDescription: "Amber replacement lenses for faded front turn-signal housings.", fullDescription: "Replacement-style amber lenses for a classic square-body front lighting restoration. Housing and bulbs are not included.", purpose: "Front turn-signal restoration", priceCents: 2795, imageLabel: "Illustration: amber signal lens", availability: "Ships in 2-3 days in prototype", included: "Two amber lenses", soldAs: "Sold as a pair", category: "Lighting", applications: chevyGmc(["C10", "K10", "C20", "K20"], ["1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980"]),
  },
  {
    id: "led-cab-light", slug: "square-body-led-cab-light", partNumber: "LITE-CAB-LED", name: "Square-Body LED Cab Light Set", shortDescription: "Replacement roof marker lights with brighter demonstration LED internals.", fullDescription: "A fictional marker-light upgrade for trucks equipped with roof lights. Confirm wiring and local requirements before installation.", purpose: "Roof marker lighting", priceCents: 7295, imageLabel: "Illustration: cab light set", availability: "Limited prototype stock", included: "Five marker lamps and basic connectors", soldAs: "Sold as a kit", category: "Lighting", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "door-weatherstrip", slug: "square-body-door-weatherstrip", partNumber: "BODY-DOOR-WS", name: "Square-Body Door Weatherstrip Pair", shortDescription: "Flexible seals to reduce wind noise around a classic truck’s doors.", fullDescription: "Replacement-style perimeter weatherstrip for two doors. Clean the mounting surface and test fit before adhesive or fasteners.", purpose: "Door weather sealing", priceCents: 10495, imageLabel: "Illustration: door weatherstrip", availability: "In stock for demonstration", included: "Two door seals", soldAs: "Sold as a pair", category: "Body panels", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "windshield-seal", slug: "square-body-windshield-seal", partNumber: "BODY-WS-7387", name: "Square-Body Windshield Seal", shortDescription: "Replacement perimeter seal for a windshield restoration project.", fullDescription: "A representative rubber windshield seal for demonstration use. Glass dimensions and installation method should be confirmed by a professional.", purpose: "Windshield weather sealing", priceCents: 11495, imageLabel: "Illustration: windshield seal", availability: "Made to order in prototype", included: "One windshield perimeter seal", soldAs: "Sold individually", category: "Body panels", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "leaf-spring-shackle", slug: "square-body-leaf-spring-shackle", partNumber: "SUSP-LEAF-87", name: "Square-Body Leaf Spring Shackle Kit", shortDescription: "Replacement rear shackle hardware for restoring suspension movement.", fullDescription: "A fictional hardware kit for a rear leaf-spring suspension. Measure the existing parts and verify the vehicle application before installation.", purpose: "Rear leaf-spring mounting", priceCents: 4795, imageLabel: "Illustration: spring shackle", availability: "In stock for demonstration", included: "Two shackles and mounting hardware", soldAs: "Sold as a kit", category: "Suspension", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "shock-mount-bushings", slug: "square-body-shock-mount-bushings", partNumber: "SUSP-SHOCK-BSH", name: "Shock Mount Bushing Set", shortDescription: "Rubber replacement bushings for worn suspension shock mounts.", fullDescription: "A sample bushing set for refreshing shock-mount hardware. Match the bushing dimensions to the existing shock before ordering.", purpose: "Suspension shock mounting", priceCents: 2295, imageLabel: "Illustration: shock bushings", availability: "In stock for demonstration", included: "Four rubber bushings and sleeves", soldAs: "Sold as a set", category: "Suspension", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
  {
    id: "steering-linkage-kit", slug: "square-body-steering-linkage-kit", partNumber: "SUSP-STEER-87", name: "Square-Body Steering Linkage Kit", shortDescription: "Demonstration replacement linkage components for a front-end refresh.", fullDescription: "A fictional group of steering linkage components for catalog browsing. Have a qualified technician confirm dimensions and installation requirements.", purpose: "Front steering linkage", priceCents: 13995, imageLabel: "Illustration: steering linkage", availability: "Made to order in prototype", included: "Linkage components shown in the kit listing", soldAs: "Sold as a kit", category: "Suspension", applications: chevyGmc(["C10", "K10", "C20", "K20"]),
  },
];

export const findProduct = (slug: string) => catalog.find((product) => product.slug === slug);
export const findProductByIdOrSlug = (value: string) => catalog.find((product) => product.id === value || product.slug === value);
export const findProductByPartNumber = (partNumber: string) => catalog.find((product) => product.partNumber.toLowerCase() === partNumber.trim().toLowerCase());
export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export const vehicleLabel = (vehicle: Vehicle | null) => vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "No vehicle selected";
export const sameVehicle = (left: Vehicle, right: Vehicle) => left.year === right.year && left.make === right.make && left.model === right.model;

export type FitmentStatus = "match" | "nonmatch" | "unknown";
export const getFitmentStatus = (product: Product, vehicle: Vehicle | null): FitmentStatus => {
  if (!vehicle) return "unknown";
  if (!product.applications.length) return "unknown";
  return product.applications.some((application) => sameVehicle(application, vehicle)) ? "match" : "nonmatch";
};

export const fitmentLabel = (status: FitmentStatus) => ({ match: "Sample fitment match", nonmatch: "Known sample nonmatch", unknown: "Fitment not confirmed" })[status];
