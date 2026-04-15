export interface ProductSpec {
  l: string;
  v: string;
}

export interface Product {
  id: number;
  name: string;
  cat: string;
  filterCat: string;
  price: number;
  spec: string;
  icon: string;
  desc: string;
  specs: ProductSpec[];
  features: string[];
  grade: string;
  lbl: string;
  lblStyle?: string;
  rec: string;
  packSize: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 0,
    name: 'ASG UltraSync 5W-30',
    cat: 'Full Synthetic',
    filterCat: 'syn',
    price: 3200,
    spec: '5W-30 · API SN+',
    icon: '⬡',
    desc: 'Premium full synthetic engine oil for modern petrol and light diesel engines. Exceptional fuel economy and extended drain intervals up to 10,000 km. Formulated with Group III+ base stocks and our ProShield additive package.',
    specs: [
      { l: 'Viscosity', v: '5W-30' },
      { l: 'API Rating', v: 'SN+' },
      { l: 'ACEA', v: 'A3/B4' },
      { l: 'Pack Size', v: '4 Litres' },
      { l: 'Drain Interval', v: '10,000 km' },
      { l: 'Base Stock', v: 'Group III+' },
    ],
    features: [
      'Extended 10,000 km drain interval',
      'Superior fuel economy improvement',
      'Enhanced LSPI protection',
      'Works in petrol and light diesel engines',
      'Excellent cold-start performance down to -35°C',
    ],
    grade: '5W-30',
    lbl: 'Best Seller',
    rec: 'PKR 3,200 / 4L',
    packSize: '4L',
  },
  {
    id: 1,
    name: 'ASG GoldSpec 0W-20',
    cat: 'Full Synthetic',
    filterCat: 'syn',
    price: 4500,
    spec: '0W-20 · API SP',
    icon: '⬡',
    desc: 'Ultra-low viscosity full synthetic for latest-generation engines requiring LSPI protection and maximum fuel efficiency. Meets ILSAC GF-6A and API SP standards.',
    specs: [
      { l: 'Viscosity', v: '0W-20' },
      { l: 'API Rating', v: 'SP' },
      { l: 'ILSAC', v: 'GF-6A' },
      { l: 'Pack Size', v: '4 Litres' },
      { l: 'Drain Interval', v: '12,000 km' },
      { l: 'Base Stock', v: 'Full PAO' },
    ],
    features: [
      'ILSAC GF-6A certified',
      'Superior LSPI and chain wear protection',
      'Maximum fuel economy for new engines',
      'Approved for Toyota, Honda, Suzuki 2018+',
      'Ultra-thin film for quick cold starts',
    ],
    grade: '0W-20',
    lbl: 'Premium',
    lblStyle: 'dark',
    rec: 'PKR 4,500 / 4L',
    packSize: '4L',
  },
  {
    id: 2,
    name: 'ASG UltraSync 5W-40',
    cat: 'Full Synthetic',
    filterCat: 'syn',
    price: 3600,
    spec: '5W-40 · API SN/CF',
    icon: '⬡',
    desc: 'High-performance full synthetic for both petrol and diesel engines. Superior viscosity stability under high summer temperatures common in Pakistan.',
    specs: [
      { l: 'Viscosity', v: '5W-40' },
      { l: 'API Rating', v: 'SN/CF' },
      { l: 'ACEA', v: 'A3/B4' },
      { l: 'Pack Size', v: '4 Litres' },
      { l: 'Drain Interval', v: '10,000 km' },
      { l: 'Base Stock', v: 'Group III+' },
    ],
    features: [
      'Dual petrol and diesel engine approval',
      'Excellent high-temperature stability',
      'Superior shear stability under load',
      'Thermal breakdown resistance to 250°C',
      'Compatible with turbo-charged engines',
    ],
    grade: '5W-40',
    lbl: '',
    rec: 'PKR 3,600 / 4L',
    packSize: '4L',
  },
  {
    id: 3,
    name: 'ASG ProBlend 10W-40',
    cat: 'Semi-Synthetic',
    filterCat: 'semi',
    price: 2400,
    spec: '10W-40 · API SN',
    icon: '◈',
    desc: 'Best value semi-synthetic formulation for mixed-fleet workshops. Balances performance and cost — ideal for vehicles 5–15 years old.',
    specs: [
      { l: 'Viscosity', v: '10W-40' },
      { l: 'API Rating', v: 'SN' },
      { l: 'ACEA', v: 'A3/B4' },
      { l: 'Pack Size', v: '4 Litres' },
      { l: 'Drain Interval', v: '7,000 km' },
      { l: 'Base Stock', v: 'Group II + III' },
    ],
    features: [
      'Excellent value for mixed-age fleets',
      'Good high-temperature protection',
      'Improved over pure mineral oil',
      'Suitable for Euro 3/4 compliant engines',
      'Popular with workshop owners Pakistan-wide',
    ],
    grade: '10W-40',
    lbl: '',
    rec: 'PKR 2,400 / 4L',
    packSize: '4L',
  },
  {
    id: 4,
    name: 'ASG DieselGuard 15W-40',
    cat: 'Mineral / Diesel',
    filterCat: 'min',
    price: 1950,
    spec: '15W-40 · API CI-4',
    icon: '◈',
    desc: 'Workhorse mineral diesel engine oil for commercial vehicles, trucks, buses, and older petrol engines. High TBN formula resists acid build-up.',
    specs: [
      { l: 'Viscosity', v: '15W-40' },
      { l: 'API Rating', v: 'CI-4/SL' },
      { l: 'Pack Size', v: '5 Litres' },
      { l: 'Drain Interval', v: '5,000 km' },
      { l: 'TBN', v: 'High (10+)' },
      { l: 'Base Stock', v: 'Group I/II' },
    ],
    features: [
      'High TBN for acid neutralisation',
      'Excellent soot handling capacity',
      'Suitable for older and turbocharged diesels',
      'Available in 20L drums for commercial use',
      'Cost-effective protection for commercial fleets',
    ],
    grade: '15W-40',
    lbl: 'B2B Popular',
    rec: 'PKR 1,950 / 5L',
    packSize: '5L',
  },
  {
    id: 5,
    name: 'ASG MotoEdge 10W-30',
    cat: 'Motorcycle',
    filterCat: 'moto',
    price: 680,
    spec: '10W-30 · JASO MA2',
    icon: '◈',
    desc: "Specially engineered for four-stroke motorcycle engines with wet clutch systems. JASO MA2 certification guarantees no clutch slip.",
    specs: [
      { l: 'Viscosity', v: '10W-30' },
      { l: 'API Rating', v: 'SL' },
      { l: 'JASO', v: 'MA2' },
      { l: 'Pack Size', v: '1 Litre' },
      { l: 'Drain Interval', v: '3,000 km' },
      { l: 'Application', v: '4-Stroke Moto' },
    ],
    features: [
      'JASO MA2 — no clutch slip guaranteed',
      'Designed for high-revving 125–200cc bikes',
      'Thermal protection for city stop-start',
      'Compatible with Honda, Yamaha, Suzuki motos',
      'Available in 0.8L and 1L packs',
    ],
    grade: '10W-30',
    lbl: '',
    rec: 'PKR 680 / 1L',
    packSize: '1L',
  },
];

export interface Dealer {
  name: string;
  addr: string;
  city: string;
  tags: string[];
}

export const DEALERS: Dealer[] = [
  { name: 'Al-Falah Auto Parts', addr: 'Main Boulevard, Gulberg III, Lahore', city: 'Lahore', tags: ['Retail', 'Workshop'] },
  { name: 'Metro Motors', addr: 'Cavalry Ground, Lahore Cantt', city: 'Lahore', tags: ['Retail', 'B2B'] },
  { name: 'City Auto Center', addr: 'GT Road, Gujranwala', city: 'Gujranwala', tags: ['Retail'] },
  { name: 'Pak Automobile Works', addr: 'Saddar Road, Rawalpindi', city: 'Rawalpindi', tags: ['Workshop', 'B2B'] },
  { name: 'Capital Lube Point', addr: 'I-8 Markaz, Islamabad', city: 'Islamabad', tags: ['Retail'] },
  { name: 'Karachi Motors Hub', addr: 'Shahrah-e-Faisal, Karachi', city: 'Karachi', tags: ['Retail', 'B2B'] },
  { name: 'South City Auto', addr: 'Defence Housing Authority, Karachi', city: 'Karachi', tags: ['Retail'] },
  { name: 'Blue World Lubricants', addr: 'Nishtar Road, Multan', city: 'Multan', tags: ['B2B', 'Workshop'] },
  { name: 'Frontier Auto Service', addr: 'University Road, Peshawar', city: 'Peshawar', tags: ['Retail', 'Workshop'] },
  { name: 'Faisalabad Parts Mall', addr: 'Jaranwala Road, Faisalabad', city: 'Faisalabad', tags: ['Retail', 'B2B'] },
];
