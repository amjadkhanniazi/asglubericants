import { useState, useEffect, useRef, useCallback } from 'react';
import { PRODUCTS, DEALERS, Product } from './data';
import { OilCan, HeroCan } from './components/OilCan';
import { Toast, showToast } from './components/Toast';

interface CartItem {
  name: string;
  price: number;
  spec: string;
  icon: string;
  id: number;
  qty: number;
}

const fmt = (n: number) => 'PKR ' + n.toLocaleString();

const LABEL_COLORS: Record<number, string> = {
  1: '#0d1f3c',
  2: '#1a0a00',
  3: '#0a1f0a',
  4: '#1f1800',
  5: '#1a0d2e',
};

const GRADE_BG: Record<number, string> = {
  0: '5W30',
  1: '0W20',
  2: '5W40',
  3: '10W40',
  4: '15W40',
  5: '10W30',
};

const SPEC_TAGS: Record<number, string[]> = {
  0: ['5W-30', 'API SN+', 'ACEA A3/B4', '4L'],
  1: ['0W-20', 'ILSAC GF-6A', 'API SP', '4L'],
  2: ['5W-40', 'API SN/CF', 'ACEA A3/B4', '4L'],
  3: ['10W-40', 'API SN', 'ACEA A3/B4', '4L'],
  4: ['15W-40', 'API CI-4/SL', '5L'],
  5: ['10W-30', 'JASO MA2', 'API SL', '1L'],
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [dealerSearch, setDealerSearch] = useState('');
  const [activeDealer, setActiveDealer] = useState<number | null>(null);
  const [finderResult, setFinderResult] = useState<{ product: Product; reason: string } | null>(null);

  // Finder form
  const [fVtype, setFVtype] = useState('');
  const [fYear, setFYear] = useState('');
  const [fKm, setFKm] = useState('');
  const [fUse, setFUse] = useState('');

  // Checkout form
  const [sFn, setSFn] = useState('');
  const [sLn, setSLn] = useState('');
  const [sEm, setSEm] = useState('');
  const [sPh, setSPh] = useState('');
  const [sAd, setSAd] = useState('');
  const [sCi, setSCi] = useState('');
  const [sPr, setSPr] = useState('');
  const [sPm, setSPm] = useState('Cash on Delivery');

  const revealRef = useRef<IntersectionObserver | null>(null);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for reveal animations
  useEffect(() => {
    revealRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => {
      revealRef.current?.observe(el);
    });
    return () => revealRef.current?.disconnect();
  });

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setModalProduct(null);
        setCheckoutOpen(false);
        document.body.style.overflow = '';
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Body overflow management
  useEffect(() => {
    document.body.style.overflow = cartOpen || modalProduct || checkoutOpen ? 'hidden' : '';
  }, [cartOpen, modalProduct, checkoutOpen]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { name: product.name, price: product.price, spec: product.spec, icon: product.icon, id: product.id, qty: 1 }];
    });
    showToast(product.name + ' added to cart');
  }, []);

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const changeQty = (index: number, delta: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index] = { ...newCart[index], qty: newCart[index].qty + delta };
      if (newCart[index].qty < 1) return newCart.filter((_, i) => i !== index);
      return newCart;
    });
  };

  const toggleCart = () => {
    setCartOpen((prev) => !prev);
    setMobileMenuOpen(false);
  };

  const runFinder = () => {
    if (!fVtype || !fYear || !fKm || !fUse) {
      showToast('Please complete all fields first');
      return;
    }
    let rec: Product;
    let reason: string;

    if (fVtype === 'motorcycle') {
      rec = PRODUCTS[5];
      reason = 'MotoEdge 10W-30 is JASO MA2 certified for four-stroke motorcycles with wet clutches.';
    } else if (fVtype === 'commercial' || fUse === 'heavy') {
      rec = PRODUCTS[4];
      reason = 'DieselGuard 15W-40 is engineered for commercial diesel engines and heavy-duty use.';
    } else if (fYear === 'new' && fKm !== 'high') {
      rec = fVtype === 'car-petrol' ? PRODUCTS[0] : PRODUCTS[2];
      reason = fVtype === 'car-petrol'
        ? 'UltraSync 5W-30 is ideal for modern petrol engines — fuel-efficient and API SN+ certified.'
        : 'UltraSync 5W-40 provides dual petrol/diesel protection with superior high-temp stability.';
    } else if (fKm === 'high' || fYear === 'old') {
      rec = PRODUCTS[3];
      reason = 'ProBlend 10W-40 semi-synthetic is recommended for high-mileage or older engines.';
    } else {
      rec = PRODUCTS[0];
      reason = 'UltraSync 5W-30 is our most versatile recommendation for standard driving conditions.';
    }

    setFinderResult({ product: rec, reason });
  };

  const openCheckout = () => {
    if (!cart.length) return;
    setCartOpen(false);
    setTimeout(() => {
      setCheckoutStep(1);
      setOrderPlaced(false);
      setCheckoutOpen(true);
    }, 350);
  };

  const placeOrder = () => {
    const oid = 'ASG-' + Date.now().toString().slice(-8).toUpperCase();
    setOrderId(oid);
    setOrderPlaced(true);
  };

  const resetCart = () => {
    setCart([]);
    setCheckoutOpen(false);
    setOrderPlaced(false);
  };

  const filteredDealers = DEALERS.filter(
    (d) =>
      d.city.toLowerCase().includes(dealerSearch.toLowerCase()) ||
      d.name.toLowerCase().includes(dealerSearch.toLowerCase()) ||
      d.addr.toLowerCase().includes(dealerSearch.toLowerCase())
  );

  const filteredProducts = filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.filterCat === filter);

  const orderSummaryHTML = () =>
    cart.map((item) => (
      <div className="osl" key={item.id}>
        <span>{item.name} × {item.qty}</span>
        <span>{fmt(item.price * item.qty)}</span>
      </div>
    ));

  return (
    <>
      <Toast />

      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="logo-mark"><span>ASG</span></div>
          <div>
            <div className="logo-name">ASG</div>
            <div className="logo-tag">Lubricants</div>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#finder">Oil Finder</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#b2b">Trade</a></li>
          <li><a href="#dealers">Dealers</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-right">
          <button className="nav-cta" onClick={() => document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' })}>
            Find My Oil
          </button>
          <button className="cart-btn" onClick={toggleCart}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart <span className="cart-count">{itemCount}</span>
          </button>
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <ul className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {['finder:Oil Finder', 'products:Products', 'b2b:Trade', 'dealers:Dealers', 'about:About', 'contact:Contact'].map((item) => {
          const [id, label] = item.split(':');
          return (
            <li key={id}>
              <a href={`#${id}`} onClick={() => setMobileMenuOpen(false)}>{label}</a>
            </li>
          );
        })}
      </ul>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow">Precision Engineered</div>
          <h1>Protect<br />What<br /><em>Drives You</em></h1>
          <div className="hero-badges">
            <span className="hero-badge">ISO 9001 Certified</span>
            <span className="hero-badge">API SN+ Approved</span>
            <span className="hero-badge">ACEA A3/B4</span>
          </div>
          <p className="hero-desc">Premium engine and motor oils formulated for Pakistan's roads, climate, and demands — trusted by drivers, workshops, and fleets nationwide since 2004.</p>
          <div className="hero-actions">
            <a href="#products" className="btn-p"><span>Shop Oils</span></a>
            <a href="#finder" className="btn-o">Find My Oil</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-right-grid" />
          <div className="hero-glow" />
          <div className="hero-vert">ASG Lubricants · Est. 2004</div>
          <HeroCan />
          <div className="hero-side-stats">
            <div><div className="hstat-n">20+</div><div className="hstat-l">Years</div></div>
            <div><div className="hstat-n">ISO</div><div className="hstat-l">9001 Certified</div></div>
            <div><div className="hstat-n">500+</div><div className="hstat-l">Distributors</div></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[1, 2].map((set) =>
            ['Full Synthetic Engine Oil', 'Semi-Synthetic Motor Oil', 'Mineral Engine Oil', 'Motorcycle Engine Oil', 'Diesel Engine Oil', 'API SN Plus Certified', 'ACEA A3/B4 Approved', 'ISO 9001 Certified'].map((text, i) => (
              <span className="ticker-item" key={`${set}-${i}`}>✦ {text}</span>
            ))
          )}
        </div>
      </div>

      {/* TRUST */}
      <div className="trust">
        <div className="trust-inner">
          <span className="trust-lbl">Approved &amp; Certified</span>
          <div className="trust-divider" />
          <div className="trust-logos">
            {['API SN+', 'ISO 9001', 'ACEA A3/B4', 'JASO MA2', 'ILSAC GF-6A', 'PSQCA', 'API CI-4'].map((logo) => (
              <span className="trust-logo" key={logo}>{logo}</span>
            ))}
          </div>
        </div>
      </div>

      {/* OIL FINDER */}
      <section className="oil-finder" id="finder">
        <div className="container">
          <div className="finder-grid">
            <div className="finder-left">
              <div className="sec-ey">Smart Tool</div>
              <h2 className="sec-t">Find Your<br /><strong>Perfect Oil</strong></h2>
              <p className="sec-s">Answer a few quick questions about your vehicle and we'll recommend the exact ASG formulation engineered for it.</p>
              <div className="finder-form">
                <div className="fg">
                  <label className="fl-dark" htmlFor="f-vtype">Vehicle Type</label>
                  <select className="fi" id="f-vtype" value={fVtype} onChange={(e) => setFVtype(e.target.value)}>
                    <option value="">Select type…</option>
                    <option value="car-petrol">Car — Petrol</option>
                    <option value="car-diesel">Car — Diesel</option>
                    <option value="suv">SUV / 4x4</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="commercial">Truck / Commercial</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl-dark" htmlFor="f-year">Vehicle Year</label>
                  <select className="fi" id="f-year" value={fYear} onChange={(e) => setFYear(e.target.value)}>
                    <option value="">Select year…</option>
                    <option value="new">2018 – Present</option>
                    <option value="mid">2008 – 2017</option>
                    <option value="old">Before 2008</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl-dark" htmlFor="f-km">Current Mileage</label>
                  <select className="fi" id="f-km" value={fKm} onChange={(e) => setFKm(e.target.value)}>
                    <option value="">Select mileage…</option>
                    <option value="low">Under 50,000 km</option>
                    <option value="mid">50,000 – 120,000 km</option>
                    <option value="high">Over 120,000 km</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl-dark" htmlFor="f-use">Primary Use</label>
                  <select className="fi" id="f-use" value={fUse} onChange={(e) => setFUse(e.target.value)}>
                    <option value="">Select use…</option>
                    <option value="city">City / Daily commute</option>
                    <option value="highway">Highway / Long distance</option>
                    <option value="mixed">Mixed</option>
                    <option value="heavy">Heavy load / Commercial</option>
                  </select>
                </div>
                <div className="fg full">
                  <button className="btn-gold" onClick={runFinder} style={{ width: '100%' }}>Find My Oil →</button>
                </div>
              </div>
              {finderResult && (
                <div className="finder-result" style={{ display: 'block' }}>
                  <div className="fr-label">Our Recommendation</div>
                  <div className="fr-product">{finderResult.product.name} — {finderResult.product.spec}</div>
                  <div className="fr-reason">{finderResult.reason}</div>
                  <div className="fr-btn">
                    <button className="btn-gold" onClick={() => addToCart(finderResult.product)}>Add to Cart →</button>
                  </div>
                </div>
              )}
            </div>
            <div className="finder-right">
              <div className="finder-circle">
                <div style={{ position: 'absolute', inset: 0 }}>
                  {[
                    { top: '10%', left: '50%' },
                    { top: '25%', right: '8%' },
                    { top: '50%', right: '3%' },
                    { bottom: '25%', right: '8%' },
                    { bottom: '10%', left: '50%' },
                    { bottom: '25%', left: '8%' },
                    { top: '50%', left: '3%' },
                    { top: '25%', left: '8%' },
                  ].map((pos, i) => (
                    <div className="finder-dot" key={i} style={pos as React.CSSProperties} />
                  ))}
                </div>
                <div className="finder-circle-text">
                  <div className="fct-n">6</div>
                  <div className="fct-l">Oil Formulations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ASG */}
      <section className="why" id="why">
        <div className="container">
          <div className="why-grid">
            <div>
              <div className="sec-ey">The ASG Difference</div>
              <h2 className="sec-t">Engineered<br /><strong>for Excellence</strong></h2>
              {[
                { n: '01', t: 'Advanced Additive Chemistry', d: 'Our proprietary additive packages deliver superior anti-wear, antioxidant, and detergent performance — developed for our specific product range and base stock combination.' },
                { n: '02', t: 'Pakistan-Specific Formulation', d: 'Designed for local fuel quality, ambient temperatures from 5°C to 50°C, and the demanding stop-start traffic of Pakistani urban roads.' },
                { n: '03', t: '18-Point Quality Control', d: 'Every batch is tested across 18 parameters before leaving our ISO 9001-certified facility — viscosity, flash point, TBN, oxidation stability, and more.' },
                { n: '04', t: 'OEM-Compatible Specifications', d: 'Meets or exceeds API, ACEA, and JASO specs — suitable for most Japanese, Korean, and European vehicles sold in Pakistan.' },
              ].map((feat, i) => (
                <div className="why-feat reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="why-n">{feat.n}</div>
                  <div>
                    <div className="why-ft">{feat.t}</div>
                    <p className="why-fd">{feat.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="why-vis">
              <div className="wcb">
                <div className="wcb-n">18</div>
                <div className="wcb-t">Quality checkpoints on every single batch produced</div>
                <div className="wcb-s">Quality Assurance</div>
              </div>
              <div className="wcs">
                <div className="wcs-n">100%</div>
                <div className="wcs-t">Batch tested before dispatch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products" id="products">
        <div className="container">
          <div className="ph">
            <div>
              <div className="sec-ey">Product Catalog</div>
              <h2 className="sec-t">Engine &amp;<br /><strong>Motor Oils</strong></h2>
            </div>
            <p className="sec-s" style={{ alignSelf: 'flex-end' }}>From daily commutes to high-performance engines — the exact formulation for every vehicle.</p>
          </div>
          <div className="pfilters">
            {[
              { key: 'all', label: 'All Products' },
              { key: 'syn', label: 'Full Synthetic' },
              { key: 'semi', label: 'Semi-Synthetic' },
              { key: 'min', label: 'Mineral' },
              { key: 'moto', label: 'Motorcycle' },
            ].map((f) => (
              <button key={f.key} className={`fb ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="pgrid">
            {filteredProducts.map((product, i) => (
              <article className="pcard reveal" key={product.id} style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                {product.lbl && (
                  <div className={`pbadge ${product.lblStyle === 'dark' ? 'dark' : ''}`}>{product.lbl}</div>
                )}
                <div className="pvis">
                  <div className="pvis-bg">{GRADE_BG[product.id]}</div>
                  <OilCan grade={product.grade} lblBg={LABEL_COLORS[product.id]} />
                </div>
                <div className="pinfo">
                  <div className="pcat">{product.cat}</div>
                  <h3 className="pname">{product.name}</h3>
                  <p className="pdesc">{product.desc.slice(0, 120)}…</p>
                  <div className="pspecs">
                    {SPEC_TAGS[product.id]?.map((tag) => (
                      <span className="stag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="pfooter">
                    <div className="pprice">{fmt(product.price)} <sub>/ {product.packSize}</sub></div>
                    <div className="pbtns">
                      <button className="view-btn" onClick={() => setModalProduct(product)}>👁</button>
                      <button className="atc" onClick={() => addToCart(product)}><span>Add</span></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="compare">
        <div className="container">
          <div className="sec-ey">Side by Side</div>
          <h2 className="sec-t">Product<br /><strong>Comparison</strong></h2>
          <p className="sec-s">Not sure which grade is right for you? Compare our full range at a glance.</p>
          <div className="compare-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="highlight">UltraSync 5W-30</th>
                  <th>GoldSpec 0W-20</th>
                  <th>UltraSync 5W-40</th>
                  <th>ProBlend 10W-40</th>
                  <th>DieselGuard 15W-40</th>
                  <th>MotoEdge 10W-30</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ct-feature">Oil Type</td>
                  <td className="highlight"><span className="grade-pill">Full Syn</span></td>
                  <td><span className="grade-pill">Full Syn</span></td>
                  <td><span className="grade-pill">Full Syn</span></td>
                  <td><span className="grade-pill">Semi-Syn</span></td>
                  <td><span className="grade-pill">Mineral</span></td>
                  <td><span className="grade-pill">Full Syn</span></td>
                </tr>
                <tr>
                  <td className="ct-feature">Viscosity Grade</td>
                  <td className="highlight">5W-30</td><td>0W-20</td><td>5W-40</td><td>10W-40</td><td>15W-40</td><td>10W-30</td>
                </tr>
                <tr>
                  <td className="ct-feature">API Rating</td>
                  <td className="highlight">SN+</td><td>SP</td><td>SN/CF</td><td>SN</td><td>CI-4/SL</td><td>SL</td>
                </tr>
                <tr>
                  <td className="ct-feature">Drain Interval</td>
                  <td className="highlight">10,000</td><td>12,000</td><td>10,000</td><td>7,000</td><td>5,000</td><td>3,000</td>
                </tr>
                <tr>
                  <td className="ct-feature">Fuel Economy</td>
                  <td className="highlight"><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td>—</td><td>—</td>
                  <td><span className="check">✦</span></td>
                </tr>
                <tr>
                  <td className="ct-feature">High-Temp</td>
                  <td className="highlight"><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                </tr>
                <tr>
                  <td className="ct-feature">Wet Clutch</td>
                  <td className="highlight">—</td><td>—</td><td>—</td><td>—</td><td>—</td>
                  <td><span className="check">✦</span></td>
                </tr>
                <tr>
                  <td className="ct-feature">Diesel</td>
                  <td className="highlight"><span className="check">✦</span></td>
                  <td>—</td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td><span className="check">✦</span></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td className="ct-feature">Price (PKR)</td>
                  <td className="highlight" style={{ color: 'var(--gold)', fontWeight: 600 }}>3,200 / 4L</td>
                  <td>4,500 / 4L</td><td>3,600 / 4L</td><td>2,400 / 4L</td><td>1,950 / 5L</td><td>680 / 1L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="b2b" id="b2b">
        <div className="container">
          <div className="b2b-grid">
            <div className="b2b-left reveal-l">
              <div className="sec-ey">Trade &amp; Wholesale</div>
              <h2 className="sec-t">Partner<br /><strong>With ASG</strong></h2>
              <p className="sec-s">We support workshops, fleet operators, and distributors with competitive wholesale pricing, dedicated account management, and technical training.</p>
              <div style={{ marginTop: '2.5rem' }}>
                {[
                  { icon: '📦', t: 'Bulk Pricing from 20L', d: 'Tiered wholesale rates available for workshops, distributors, and fleet operators.' },
                  { icon: '🚚', t: 'Nationwide Delivery', d: 'Direct delivery to your workshop or warehouse across all major cities in Pakistan.' },
                  { icon: '🎓', t: 'Technical Training', d: 'Free oil analysis, product training for your technicians, and branded POS material.' },
                  { icon: '📞', t: 'Dedicated Account Manager', d: 'Every trade partner gets a dedicated ASG account manager available Mon–Sat.' },
                ].map((b, i) => (
                  <div className="b2b-benefit" key={i}>
                    <div className="b2b-icon">{b.icon}</div>
                    <div>
                      <div className="b2b-bt">{b.t}</div>
                      <div className="b2b-bd">{b.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="b2b-ctas">
                <a href="#contact" className="btn-gold">Apply for Trade Account</a>
                <a href="#contact" className="btn-o" style={{ borderColor: 'rgba(255,255,255,.2)', color: 'rgba(255,255,255,.6)' }}>Download Rate Card</a>
              </div>
            </div>
            <div className="b2b-right reveal-r">
              {[
                { n: '500+', l: 'Authorised Dealers' },
                { n: '20L+', l: 'Minimum Bulk Order' },
                { n: '48hrs', l: 'Account Setup Time' },
                { n: '15%', l: 'Avg. Trade Discount' },
              ].map((stat, i) => (
                <div className="b2b-stat" key={i}>
                  <div className="b2b-stat-n">{stat.n}</div>
                  <div className="b2b-stat-l">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi" id="reviews">
        <div className="container">
          <div className="sec-ey">Customer Reviews</div>
          <h2 className="sec-t">Trusted by<br /><strong>Professionals</strong></h2>
          <div className="tgrid">
            {[
              { text: '"We switched our 40-vehicle fleet to ASG DieselGuard and saw a measurable drop in engine-related downtime."', name: 'Khalid Mehmood', role: 'Fleet Manager · Lahore Transport Co.', avatar: 'K' },
              { text: '"Running UltraSync 5W-30 in my Civic for two years now. Engine feels cleaner, oil consumption is near zero."', name: 'Faisal Raza', role: 'Verified Customer · Karachi', avatar: 'F' },
              { text: '"As an authorised workshop we\'ve stocked ASG for three years. Customers notice the difference — it sells itself."', name: 'Adnan Sheikh', role: 'Workshop Owner · Rawalpindi', avatar: 'A' },
            ].map((t, i) => (
              <div className="tcard reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="tstars">★★★★★</div>
                <p className="ttext">{t.text}</p>
                <div className="tauthor">
                  <div className="tavatar">{t.avatar}</div>
                  <div>
                    <div className="tname">{t.name}</div>
                    <div className="trole">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="container">
          <div className="agrid">
            <div className="reveal-l">
              <div className="sec-ey">Our Story</div>
              <h2 className="sec-t">Two Decades of<br /><strong>Precision</strong></h2>
              <blockquote className="aquote">"We don't import and rebrand. We formulate, test, and manufacture — in Pakistan, for Pakistan."</blockquote>
              <p className="abody">Founded in 2004, ASG Lubricants started as a small blending operation in Lahore with a single mission: to produce engine oils that genuinely matched the demands of Pakistani roads and vehicles.</p>
              <p className="abody">Today we operate a modern ISO 9001-certified manufacturing facility, distributing through 500+ authorised dealers nationwide.</p>
              <div className="astats">
                {[
                  { n: '2004', l: 'Year Founded' },
                  { n: '500+', l: 'Authorised Dealers' },
                  { n: '20+', l: 'Product Lines' },
                  { n: '100K+', l: 'Satisfied Customers' },
                ].map((s, i) => (
                  <div className="ast" key={i}>
                    <div className="ast-n">{s.n}</div>
                    <div className="ast-l">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="acerts">
                {['ISO 9001:2015', 'API Certified', 'ACEA Approved', 'JASO MA2', 'PSQCA Listed'].map((c) => (
                  <span className="cert" key={c}>{c}</span>
                ))}
              </div>
              <div className="timeline" style={{ marginTop: '3rem' }}>
                {[
                  { year: '2004', desc: 'Founded in Lahore. First mineral oil range launched.' },
                  { year: '2009', desc: 'ISO 9001 certification achieved. Semi-synthetic range introduced.' },
                  { year: '2014', desc: 'Expanded to 200+ dealer network. Full synthetic UltraSync launched.' },
                  { year: '2019', desc: 'ACEA A3/B4 approval. Motorcycle oil range added.' },
                  { year: '2024', desc: '500+ dealers nationwide. GoldSpec 0W-20 ILSAC GF-6A launched.' },
                ].map((item, i) => (
                  <div className="tl-item" key={i}>
                    <div className="tl-year">{item.year}</div>
                    <div className="tl-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-r">
              <div className="aframe">
                <div className="aframe-bg">ASG</div>
                <div className="aframe-content">
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontStyle: 'italic', color: 'rgba(255,255,255,.5)', letterSpacing: '2px', textAlign: 'center', padding: '0 3rem' }}>
                    Manufactured in Pakistan<br />to International Standards
                  </div>
                  <div style={{ width: '60px', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '60px', letterSpacing: '8px', color: 'rgba(255,255,255,.05)' }}>LAHORE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEALERS */}
      <section className="dealers" id="dealers">
        <div className="container">
          <div className="sec-ey">Nationwide Network</div>
          <h2 className="sec-t">Find a<br /><strong>Dealer Near You</strong></h2>
          <p className="sec-s">ASG Lubricants is available at 500+ authorised dealers and workshops across Pakistan.</p>
          <div className="dealer-grid">
            <div>
              <div className="dealer-search">
                <input className="fi" type="text" placeholder="Search city or area…" value={dealerSearch} onChange={(e) => setDealerSearch(e.target.value)} />
                <button className="dealer-search-btn">🔍</button>
              </div>
              <div className="dealer-list">
                {filteredDealers.map((d, i) => (
                  <div
                    className={`dealer-card ${activeDealer === i ? 'active' : ''}`}
                    key={i}
                    onClick={() => setActiveDealer(i)}
                  >
                    <div className="dealer-name">{d.name}</div>
                    <div className="dealer-addr">📍 {d.addr}</div>
                    <div className="dealer-tags">
                      {d.tags.map((t) => <span className="dealer-tag" key={t}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dealer-map">
              {[
                { top: '28%', left: '42%', title: 'Lahore', delay: '0s' },
                { top: '55%', left: '38%', title: 'Multan', delay: '.5s' },
                { top: '65%', left: '62%', title: 'Karachi', delay: '1s' },
                { top: '22%', left: '50%', title: 'Islamabad', delay: '1.5s' },
                { top: '20%', left: '58%', title: 'Peshawar', delay: '.8s' },
                { top: '40%', left: '55%', title: 'Faisalabad', delay: '.3s' },
              ].map((pin, i) => (
                <div className="map-pin" key={i} style={{ top: pin.top, left: pin.left, animationDelay: pin.delay }} title={pin.title}>📍</div>
              ))}
              <div className="map-placeholder">
                <div className="map-ph-icon">🗺</div>
                <div className="map-ph-text">Pakistan Coverage</div>
                <div className="map-ph-sub">500+ Dealer Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-sec" id="faq">
        <div className="container">
          <div className="faq-grid">
            <div>
              <div className="sec-ey">Common Questions</div>
              <h2 className="sec-t">Frequently<br /><strong>Asked</strong></h2>
              <p className="sec-s">Everything you need to know about engine oil selection, drain intervals, and getting the most from ASG Lubricants.</p>
              <div className="faq-promo">
                <div className="faq-promo-t">Still have a question?</div>
                <p className="faq-promo-s">Our technical team is available Mon–Sat, 9am–6pm to advise on the right oil for your specific vehicle.</p>
                <a href="#contact" className="btn-gold">Talk to an Expert</a>
              </div>
            </div>
            <div className="faq-list">
              {[
                { q: 'What engine oil should I use for my car in Pakistan?', a: 'For most modern petrol cars (2008 onwards), ASG UltraSync 5W-30 or 5W-40 full synthetic is recommended. For older or high-mileage vehicles, ASG ProBlend 10W-40 semi-synthetic offers excellent protection.' },
                { q: 'How often should I change engine oil in Pakistan?', a: 'With ASG full synthetic oils, you can safely extend drain intervals to 8,000–10,000 km. Semi-synthetic should be changed every 5,000–7,000 km. Mineral oils every 3,000–5,000 km.' },
                { q: 'Can I use ASG oil in a Japanese car (Toyota, Honda, Suzuki)?', a: 'Yes. ASG UltraSync 5W-30 and 5W-40 meet the API SN+/CF and ACEA A3/B4 specifications required by most Toyota, Honda, Suzuki vehicles sold in Pakistan.' },
                { q: 'Is ASG oil available in 20L drums for workshops?', a: 'Yes. All ASG engine oils are available in 1L, 4L, 5L, and 20L drum formats. Contact our trade team for wholesale pricing.' },
                { q: "What's the difference between full synthetic and semi-synthetic?", a: 'Full synthetic oils are made entirely from chemically engineered base stocks, offering superior performance and longer drain intervals. Semi-synthetic blends synthetic and mineral base stocks for better performance at lower cost.' },
                { q: 'How do I become an authorised ASG dealer?', a: "Fill in the trade enquiry form or call our sales team. We'll arrange a meeting, discuss volume requirements, and set up your account within 48 hours." },
              ].map((item, i) => (
                <div className={`faq-item ${openFaqIndex === i ? 'open' : ''}`} key={i}>
                  <div className="faq-q" onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}>
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-icon">+</span>
                  </div>
                  <div className="faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog-sec" id="blog">
        <div className="container">
          <div className="sec-ey">Resources &amp; Guides</div>
          <h2 className="sec-t">Engine Oil<br /><strong>Knowledge Base</strong></h2>
          <p className="sec-s">Expert advice on oil selection, maintenance intervals, and protecting your engine in Pakistan's climate.</p>
          <div className="blog-grid">
            {[
              { bg: 'OIL', icon: '🔧', cat: 'Maintenance Guide', date: '15 Jan 2024 · 5 min read', title: "How Pakistan's Summer Heat Affects Your Engine Oil", excerpt: "Temperatures above 40°C degrade conventional oil faster than you'd expect." },
              { bg: 'GRADE', icon: '⚙️', cat: 'Oil Selection', date: '8 Feb 2024 · 7 min read', title: '5W-30 vs 5W-40: Which Viscosity Is Right for Your Car?', excerpt: 'Both are popular grades for petrol cars in Pakistan, but they behave differently under load.' },
              { bg: 'MOTO', icon: '🏍️', cat: 'Motorcycle', date: '20 Mar 2024 · 4 min read', title: 'Why JASO MA2 Matters for Your Honda or Yamaha Motorcycle', excerpt: 'Using car oil in a motorcycle with a wet clutch causes slip and premature wear.' },
            ].map((article, i) => (
              <article className="blog-card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="blog-vis">
                  <div className="blog-vis-bg">{article.bg}</div>
                  <div className="blog-vis-icon">{article.icon}</div>
                  <div className="blog-cat-tag">{article.cat}</div>
                </div>
                <div className="blog-info">
                  <div className="blog-meta">{article.date}</div>
                  <h3 className="blog-title">{article.title}</h3>
                  <p className="blog-excerpt">{article.excerpt}</p>
                  <a href="#blog" className="blog-link">Read Article →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="cs" id="contact">
        <div className="container">
          <div className="cgrid">
            <div className="reveal-l">
              <div className="sec-ey">Get in Touch</div>
              <h2 className="sec-t">Trade &amp;<br /><strong>Enquiries</strong></h2>
              <p className="sec-s" style={{ marginBottom: '3rem' }}>Whether you're a workshop looking to stock ASG, a fleet manager seeking bulk pricing, or a retail customer — we're here.</p>
              <div className="cii"><div className="cico">📍</div><div><div className="cil">Head Office</div><div className="civ">Lahore, Punjab, Pakistan</div></div></div>
              <div className="cii"><div className="cico">📞</div><div><div className="cil">Sales &amp; Enquiries</div><div className="civ">+92 300 000 0000</div></div></div>
              <div className="cii"><div className="cico">✉️</div><div><div className="cil">Email</div><div className="civ">info@asglubricants.com</div></div></div>
              <div className="cii" style={{ border: 'none' }}><div className="cico">⏰</div><div><div className="cil">Business Hours</div><div className="civ">Monday – Saturday, 9am – 6pm PKT</div></div></div>
            </div>
            <div className="reveal-r">
              <form onSubmit={(e) => { e.preventDefault(); showToast("Enquiry sent — we'll be in touch shortly."); (e.target as HTMLFormElement).reset(); }}>
                <div className="fg2">
                  <div className="fg"><label className="fl" htmlFor="cn">Full Name</label><input className="fi" id="cn" type="text" placeholder="Muhammad Ali" required /></div>
                  <div className="fg"><label className="fl" htmlFor="cp2">Phone</label><input className="fi" id="cp2" type="tel" placeholder="+92 300 0000000" /></div>
                </div>
                <div className="fg"><label className="fl" htmlFor="ce">Email Address</label><input className="fi" id="ce" type="email" placeholder="you@company.com" required /></div>
                <div className="fg">
                  <label className="fl" htmlFor="ct-sel">Enquiry Type</label>
                  <select className="fi" id="ct-sel"><option value="">Select…</option><option>Retail Purchase</option><option>Workshop / Dealer Partnership</option><option>Fleet / Bulk Order</option><option>Technical Question</option><option>Other</option></select>
                </div>
                <div className="fg"><label className="fl" htmlFor="cm">Message</label><textarea className="fi" id="cm" rows={4} placeholder="Tell us about your requirements…" required style={{ resize: 'vertical' }} /></div>
                <button type="submit" className="btn-p" style={{ width: '100%', textAlign: 'center', display: 'block' }}><span>Send Enquiry</span></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="ftop">
            <div>
              <a href="#" className="logo">
                <div className="logo-mark" style={{ background: 'rgba(255,255,255,.05)' }}><span>ASG</span></div>
                <div style={{ marginLeft: '10px' }}>
                  <div className="logo-name" style={{ color: 'var(--white)' }}>ASG</div>
                  <div className="logo-tag">Lubricants</div>
                </div>
              </a>
              <p className="fdesc">Premium engine and motor oils manufactured in Pakistan for Pakistan's roads, vehicles, and climate. ISO 9001 certified, API approved.</p>
              <div className="fsocial">
                {['f', 'ig', 'wa', 'yt'].map((s) => (
                  <button className="fsoc-btn" key={s}>{s}</button>
                ))}
              </div>
              <div className="fnewsletter">
                <div className="fnl-label">Get oil tips &amp; offers by email</div>
                <div className="fnl-form">
                  <input className="fnl-input" type="email" placeholder="your@email.com" />
                  <button className="fnl-btn" onClick={() => showToast('Subscribed! Welcome to ASG updates.')}>→</button>
                </div>
              </div>
            </div>
            <div>
              <div className="fh">Products</div>
              <ul className="flinks">
                <li><a href="#products">Full Synthetic Oils</a></li>
                <li><a href="#products">Semi-Synthetic Oils</a></li>
                <li><a href="#products">Mineral Engine Oils</a></li>
                <li><a href="#products">Motorcycle Oils</a></li>
                <li><a href="#finder">Oil Finder Tool</a></li>
              </ul>
            </div>
            <div>
              <div className="fh">Company</div>
              <ul className="flinks">
                <li><a href="#about">About ASG</a></li>
                <li><a href="#why">Why ASG</a></li>
                <li><a href="#b2b">Trade / Wholesale</a></li>
                <li><a href="#dealers">Dealer Locator</a></li>
                <li><a href="#blog">Knowledge Base</a></li>
                <li><a href="#faq">FAQs</a></li>
              </ul>
            </div>
            <div>
              <div className="fh">Contact</div>
              <ul className="flinks" style={{ gap: '.9rem' }}>
                <li style={{ color: 'rgba(255,255,255,.4)', fontSize: '14px' }}>Lahore, Punjab, Pakistan</li>
                <li style={{ color: 'rgba(255,255,255,.4)', fontSize: '14px' }}>+92 300 000 0000</li>
                <li style={{ color: 'rgba(255,255,255,.4)', fontSize: '14px' }}>info@asglubricants.com</li>
                <li style={{ color: 'rgba(255,255,255,.4)', fontSize: '14px' }}>Mon–Sat 9am–6pm PKT</li>
              </ul>
            </div>
          </div>
          <div className="fbot">
            <div className="fcopy">© 2024 ASG Lubricants. All Rights Reserved.</div>
            <div className="fbadges">
              {['ISO 9001', 'API Certified', 'ACEA Approved', 'Made in Pakistan'].map((b) => (
                <span className="fbadge" key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* CART OVERLAY */}
      <div className={`co ${cartOpen ? 'open' : ''}`} onClick={toggleCart} />

      {/* CART PANEL */}
      <aside className={`cp ${cartOpen ? 'open' : ''}`}>
        <div className="cp-hdr">
          <h3>Your Cart</h3>
          <button className="cp-close" onClick={toggleCart}>✕</button>
        </div>
        <div className="cp-body">
          {cart.length === 0 ? (
            <div className="cempty">
              <div className="cempty-i">⬡</div>
              <div className="cempty-t">Your cart is empty</div>
            </div>
          ) : (
            cart.map((item, i) => (
              <div className="ci-row" key={item.id}>
                <div className="ci-thumb">{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-spec">{item.spec}</div>
                  <div className="ci-ctrl">
                    <button className="qb" onClick={() => changeQty(i, -1)}>−</button>
                    <span className="qv">{item.qty}</span>
                    <button className="qb" onClick={() => changeQty(i, 1)}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <button className="rm" onClick={() => removeItem(i)}>✕</button>
                  <div className="ci-price">{fmt(item.price * item.qty)}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cp-ftr">
            <div className="ct-row">
              <span className="ct-lbl">Total</span>
              <span className="ct-val">{fmt(total)}</span>
            </div>
            <button className="cbtn" onClick={openCheckout}><span>Proceed to Checkout</span></button>
          </div>
        )}
      </aside>

      {/* MOBILE CART BAR */}
      <div className="mob-cart-bar">
        <div>
          <div className="mcb-info">{itemCount} {itemCount === 1 ? 'item' : 'items'}</div>
          <div className="mcb-total">{fmt(total)}</div>
        </div>
        <button className="mcb-btn" onClick={toggleCart}>View Cart →</button>
      </div>

      {/* PRODUCT MODAL */}
      {modalProduct && (
        <div className={`pm-mask open`} onClick={(e) => { if (e.target === e.currentTarget) setModalProduct(null); }}>
          <div className="pm-modal">
            <div className="pm-vis">
              <button className="pm-close" onClick={() => setModalProduct(null)}>✕</button>
              <div style={{ transform: 'scale(1.3)' }}>
                <OilCan grade={modalProduct.grade} width={100} lblBg={LABEL_COLORS[modalProduct.id]} />
              </div>
            </div>
            <div className="pm-info">
              <div className="pm-cat">{modalProduct.cat}</div>
              <h2 className="pm-name">{modalProduct.name}</h2>
              <p className="pm-desc">{modalProduct.desc}</p>
              <div className="pm-specs-grid">
                {modalProduct.specs.map((s, i) => (
                  <div className="pm-spec" key={i}>
                    <div className="pm-spec-l">{s.l}</div>
                    <div className="pm-spec-v">{s.v}</div>
                  </div>
                ))}
              </div>
              <div>
                {modalProduct.features.map((f, i) => (
                  <div className="pm-feat" key={i}>
                    <span className="pm-feat-check">✦</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="pm-price">
                {fmt(modalProduct.price)} <sub>/ pack</sub>
              </div>
              <div className="pm-actions">
                <button className="btn-p" onClick={() => { addToCart(modalProduct); setModalProduct(null); }}><span>Add to Cart</span></button>
                <button className="btn-o" onClick={() => setModalProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="mm open">
          <div className="modal">
            {!orderPlaced ? (
              <>
                <div className="mhdr">
                  <h3>Checkout</h3>
                  <button className="mclose" onClick={() => setCheckoutOpen(false)}>✕</button>
                </div>
                <div className="mbody">
                  <div className="steps">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className={`step ${checkoutStep === s ? 'active' : ''} ${checkoutStep > s ? 'done' : ''}`}>
                        <div className="s-circle">{s}</div>
                        <div className="s-lbl">{['Shipping', 'Payment', 'Review'][s - 1]}</div>
                      </div>
                    ))}
                  </div>

                  {checkoutStep === 1 && (
                    <div>
                      <div className="fg2">
                        <div className="fg"><label className="fl">First Name</label><input className="fi" value={sFn} onChange={(e) => setSFn(e.target.value)} placeholder="Muhammad" /></div>
                        <div className="fg"><label className="fl">Last Name</label><input className="fi" value={sLn} onChange={(e) => setSLn(e.target.value)} placeholder="Ali" /></div>
                      </div>
                      <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={sEm} onChange={(e) => setSEm(e.target.value)} placeholder="you@email.com" /></div>
                      <div className="fg"><label className="fl">Phone</label><input className="fi" type="tel" value={sPh} onChange={(e) => setSPh(e.target.value)} placeholder="+92 300 0000000" /></div>
                      <div className="fg"><label className="fl">Delivery Address</label><input className="fi" value={sAd} onChange={(e) => setSAd(e.target.value)} placeholder="Street, area" /></div>
                      <div className="fg2">
                        <div className="fg"><label className="fl">City</label><input className="fi" value={sCi} onChange={(e) => setSCi(e.target.value)} placeholder="Lahore" /></div>
                        <div className="fg">
                          <label className="fl">Province</label>
                          <select className="fi" value={sPr} onChange={(e) => setSPr(e.target.value)}>
                            <option value="">— Select —</option>
                            <option>Punjab</option><option>Sindh</option><option>KPK</option><option>Balochistan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 2 && (
                    <div>
                      <div className="fg">
                        <label className="fl">Payment Method</label>
                        <select className="fi" value={sPm} onChange={(e) => setSPm(e.target.value)}>
                          <option>Cash on Delivery</option>
                          <option>Bank Transfer (HBL / Meezan)</option>
                          <option>EasyPaisa</option>
                          <option>JazzCash</option>
                        </select>
                      </div>
                      <div style={{ background: 'var(--cream)', padding: '1.25rem', margin: '1rem 0 1.5rem', fontSize: '13px', color: 'var(--ink-l)', lineHeight: 1.7 }}>
                        Bank transfer and mobile wallet details will be sent to your email after order confirmation.
                      </div>
                      <div className="osb">
                        <div className="ost">Order Summary</div>
                        {orderSummaryHTML()}
                        <div className="osl" style={{ fontWeight: 600, fontSize: '16px', color: 'var(--ink)', paddingTop: '12px', border: 'none' }}>
                          <span>Total</span><span style={{ color: 'var(--gold)' }}>{fmt(total)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 3 && (
                    <div>
                      <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--ink-l)', marginBottom: '1.25rem' }}>Confirm Your Order</div>
                      <div className="osb">
                        <div className="ost">Items</div>
                        {orderSummaryHTML()}
                        <div className="osl" style={{ fontWeight: 600, fontSize: '16px', color: 'var(--ink)', paddingTop: '12px', border: 'none' }}>
                          <span>Total</span><span style={{ color: 'var(--gold)' }}>{fmt(total)}</span>
                        </div>
                      </div>
                      <div style={{ background: 'var(--cream)', padding: '1.25rem', fontSize: '14px', color: 'var(--ink-m)', lineHeight: 1.8 }}>
                        <strong>Ship to:</strong> {sFn} {sLn}<br />
                        <strong>City:</strong> {sCi}, {sPr}<br />
                        <strong>Payment:</strong> {sPm}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--ink-l)', marginTop: '1.25rem', lineHeight: 1.6 }}>
                        By placing this order you agree to ASG Lubricants' Terms and Privacy Policy.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mftr">
                  {checkoutStep > 1 && (
                    <button className="btn-o" onClick={() => setCheckoutStep((s) => s - 1)}>← Back</button>
                  )}
                  <button className="btn-p" style={{ marginLeft: 'auto' }} onClick={() => {
                    if (checkoutStep < 3) setCheckoutStep((s) => s + 1);
                    else placeOrder();
                  }}>
                    <span>{checkoutStep === 3 ? 'Place Order ✦' : 'Continue →'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="sv" style={{ display: 'block' }}>
                <div className="sv-mark">✦</div>
                <div className="sv-h">Order Placed!</div>
                <p className="sv-t">Thank you. Your order has been received and our team will contact you to confirm delivery details.</p>
                <div className="sv-oid">Order Reference: {orderId}</div>
                <br /><br />
                <button className="btn-p" onClick={resetCart}><span>Continue Shopping</span></button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
