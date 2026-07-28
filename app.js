// Product Catalog & State Management for Jodhan Silk Store

// ===== BRUTE FORCE DELETE: e prince jodhan & p prince jodhan =====
console.log("app.js v2 - brute force delete active");
(function() {
  function bad(s) { return ((s||"")+"").toLowerCase().indexOf("e prince jodhan") !== -1 || ((s||"")+"").toLowerCase().indexOf("p prince jodhan") !== -1; }
  // Always overwrite jodhan_products with bad items removed
  try {
    var p = JSON.parse(localStorage.getItem("jodhan_products") || "[]");
    var count = Array.isArray(p) ? p.length : 0;
    if (Array.isArray(p)) p = p.filter(function(x) { return !bad(x.title); });
    console.log("IIFE: jodhan_products cleaned - removed " + (count - (Array.isArray(p)?p.length:0)) + " items");
    localStorage.setItem("jodhan_products", JSON.stringify(p));
  } catch(e) { console.log("IIFE products error:", e); }
  // Always overwrite jodhan_orders with bad item references removed
  try {
    var o = JSON.parse(localStorage.getItem("jodhan_orders") || "[]");
    if (Array.isArray(o)) o = o.filter(function(x) { return !(x.items||[]).some(function(i) { return bad(i.title||i.name||""); }); });
    localStorage.setItem("jodhan_orders", JSON.stringify(o));
  } catch(e) {}
  // Always overwrite jodhan_cart
  try {
    var c = JSON.parse(localStorage.getItem("jodhan_cart") || "[]");
    if (Array.isArray(c)) c = [];
    localStorage.setItem("jodhan_cart", JSON.stringify(c));
  } catch(e) {}
  console.log("IIFE complete - localStorage cleaned");
})();
// ===== END BRUTE FORCE DELETE =====

// Default product data with Unsplash images (and SVG fallbacks)
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    title: "Zari Embroidered Lehenga Choli",
    description: "A breathtaking bridal lehenga choli featuring intricate gold zari embroidery on premium velvet and silk layers. Set includes a matching blouse and pure georgette dupatta.",
    price: 89900,
    category: "lengha choli",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Gold/Red", stock: 5 }, { name: "Green/Red", stock: 3 }, { name: "Burgundy", stock: 2 }]
  },
  {
    id: "prod-2",
    title: "Blossom Pink Festive Lehenga",
    description: "Elegant and lightweight pink georgette lehenga choli with delicate floral threadwork, perfect for sangeet and festive gatherings.",
    price: 29900,
    category: "lengha choli",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Blush Pink", stock: 8 }, { name: "Hot Pink", stock: 4 }, { name: "Peach", stock: 3 }]
  },
  {
    id: "prod-3",
    title: "Embroidered Silk Palazzo Set",
    description: "Luxurious beige silk kurta with matching flared palazzos. Accented with subtle rose-pink hand-embroidery along the neckline.",
    price: 14900,
    category: "plazo",
    image: "https://images.unsplash.com/photo-1609357518652-6cf0416f0cbe?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Beige", stock: 4 }, { name: "Ivory", stock: 4 }]
  },
  {
    id: "prod-4",
    title: "Classic Ivory Palazzo Pant Suit",
    description: "Minimalist cotton linen palazzo set in a pure ivory white tone. Comfortable, breathable, and styled with a contemporary long jacket.",
    price: 8900,
    category: "plazo",
    image: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Ivory", stock: 10 }, { name: "Beige", stock: 6 }, { name: "White", stock: 4 }]
  },
  {
    id: "prod-5",
    title: "Royal Charcoal Pent Coat Set",
    description: "Sleek charcoal-black double-breasted tuxedo set. Crafted from premium Italian wool blend. Includes blazer, trousers, and a black satin bowtie.",
    price: 39900,
    category: "pent coat",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Charcoal", stock: 3 }, { name: "Navy", stock: 2 }]
  },
  {
    id: "prod-6",
    title: "Beige Tweed Modern Suit",
    description: "Slim-fit two-piece suit in beige tweed pattern. A versatile ensemble that strikes the perfect balance between classic charm and modern style.",
    price: 32900,
    category: "pent coat",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Beige", stock: 4 }, { name: "Grey", stock: 3 }]
  },
  {
    id: "prod-7",
    title: "Premium White Dobby Shirt & Trousers",
    description: "Structured dobby weave white shirt paired with tailored deep-black formal trousers. Tailored for sharp professional and evening looks.",
    price: 11900,
    category: "pent shirt",
    image: "https://images.unsplash.com/photo-1621072156002-e2fcc1079516?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "White", stock: 6 }, { name: "Black", stock: 6 }]
  },
  {
    id: "prod-8",
    title: "Soft Pink Linen Shirt & Beige Chinos",
    description: "Perfect smart-casual combination. A relaxed-fit light pink linen shirt paired with classic flat-front beige cotton chinos.",
    price: 9900,
    category: "pent shirt",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Pink", stock: 8 }, { name: "Mint", stock: 5 }, { name: "Lavender", stock: 5 }]
  },
  {
    id: "prod-9",
    title: "Royal Brocade Silk Pagri",
    description: "A heritage turban made from pure Banarasi silk brocade. Adorned with delicate beige and gold weaving for groom ensembles.",
    price: 7900,
    category: "turban",
    image: "https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Gold/Burgundy", stock: 3 }, { name: "Red/Gold", stock: 3 }]
  },
  {
    id: "prod-10",
    title: "Traditional Rose Pink Turban",
    description: "Lightweight, soft cotton turban fabric in a gentle rose-pink color. Easy to drape and comfortable for long wedding festivities.",
    price: 3900,
    category: "turban",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Rose Pink", stock: 10 }, { name: "Coral", stock: 8 }, { name: "Saffron", stock: 7 }]
  },
  {
    id: "prod-11",
    title: "Hand-Embroidered Kurta Pajama",
    description: "Deep charcoal cotton-silk kurta with delicate thread embroidery around the bandh collar. Paired with comfortable white churidar bottoms.",
    price: 15900,
    category: "kurta pajama",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Charcoal", stock: 4 }, { name: "Ivory", stock: 3 }, { name: "Teal", stock: 2 }]
  },
  {
    id: "prod-12",
    title: "Premium Beige Linen Kurta Set",
    description: "A contemporary classic. Breathable organic linen kurta in soft beige, paired with straight-fit cream cotton trousers.",
    price: 11900,
    category: "kurta pajama",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&auto=format&fit=crop&q=80",
    available: true,
    colors: [{ name: "Beige", stock: 6 }, { name: "White", stock: 4 }, { name: "Sage", stock: 4 }]
  }
];

// Color helper functions
function colorTotalStock(colors) {
  return (colors || []).reduce((sum, c) => sum + (c.stock || 0), 0);
}

function isColorInStock(colors, colorName) {
  const c = (colors || []).find(c => c.name === colorName);
  return c ? (c.stock || 0) > 0 : false;
}

function getColorStock(colors, colorName) {
  const c = (colors || []).find(c => c.name === colorName);
  return c ? (c.stock || 0) : 0;
}

function anyColorInStock(colors) {
  return (colors || []).some(c => (c.stock || 0) > 0);
}

function recomputeProductAvailability(product) {
  product.available = anyColorInStock(product.colors);
}

function ensureColorsArray(product) {
  if (!product.colors || product.colors.length === 0) {
    if (product.stock !== undefined) {
      product.colors = [{ name: "Default", stock: product.stock }];
    } else {
      product.colors = [{ name: "Default", stock: 0 }];
    }
    delete product.stock;
  }
}

function getProductImages(p) {
  if (p.images && p.images.length > 0) return p.images;
  if (p.image) return [p.image];
  return ["https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=600&auto=format&fit=crop&q=80"];
}

function getProductImage(p) {
  return getProductImages(p)[0];
}

function getColorStyle(color) {
  if (typeof color === "object" && color) {
    if (color.rgb) return `rgb(${color.rgb})`;
    return getColorCSS(color.name);
  }
  return getColorCSS(color);
}

function getColorCSS(name) {
  const map = {
    "red": "#dc2626", "gold": "#d4a017", "green": "#16a34a", "burgundy": "#800020",
    "blush pink": "#f4c2c2", "hot pink": "#ff1493", "peach": "#ffdab9",
    "beige": "#f5f0e1", "ivory": "#fffff0", "white": "#ffffff", "black": "#222222",
    "charcoal": "#36454f", "navy": "#1e3a5f", "grey": "#808080",
    "pink": "#ffb6c1", "mint": "#98ff98", "lavender": "#e6e6fa",
    "gold/burgundy": "#800020", "red/gold": "#d4a017", "gold/red": "#d4a017", "green/red": "#16a34a",
    "rose pink": "#ff66b2", "coral": "#ff7f50", "saffron": "#f4c430",
    "teal": "#008080", "sage": "#bcb88a",
    "default": "#c5a880"
  };
  const lower = name.toLowerCase().trim();
  return map[lower] || map["default"];
}
let products = [];
let cart = [];
let currentUser = null;
let currentCategory = "all";
let adminMode = false;
let adminRole = "guest";
let managers = [];

// New country and banking states
let countries = [];
let selectedCountry = "";
let bankAccounts = [];
let transactions = [];
let orders = [];
let categories = [];
let activeAdminTab = "inventory";
let checkoutPaymentMethod = "card";
let bankBarcodeImageBase64 = "";
let livePaymentGatewayEnabled = false;

// Currency system
const CURRENCIES = {
  INR: { symbol: "₹", rate: 1, label: "Indian Rupee" },
  USD: { symbol: "$", rate: 0.012, label: "US Dollar" },
  CAD: { symbol: "CA$", rate: 0.016, label: "Canadian Dollar" },
  GBP: { symbol: "£", rate: 0.0094, label: "British Pound" },
  EUR: { symbol: "€", rate: 0.011, label: "Euro" },
  AED: { symbol: "د.إ", rate: 0.044, label: "UAE Dirham" }
};
let selectedCurrency = "INR";
let liveRates = null;
let lastRateFetch = 0;
const RATE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
let livePaymentGatewayStatusPromise = null;

const DEFAULT_COUNTRIES = [
  { name: "India", flag: "🇮🇳" },
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" }
];

const DEFAULT_BANK_ACCOUNTS = [
  { id: "bank-1", type: "bank", bankName: "State Bank of India", holderName: "Prince Jodhan", accNo: "••••••••4321", fullAccNo: "98765432100", ifscCode: "SBIN0001234", balance: 0, active: true },
  { id: "bank-2", type: "bank", bankName: "HDFC Bank", holderName: "Prince Jodhan", accNo: "••••••••5678", fullAccNo: "12345678900", ifscCode: "HDFC0000244", balance: 0, active: false }
];

let payoutFormType = "bank";

const DEFAULT_CATEGORIES = [
  "lengha choli",
  "plazo",
  "pent coat",
  "pent shirt",
  "turban",
  "kurta pajama"
];

// Initialize App
function initApp() {
  // BRUTE FORCE: explicitly find and delete any e/p prince jodhan items
  try {
    const raw = localStorage.getItem("jodhan_products");
    if (raw) {
      let data = JSON.parse(raw);
      if (Array.isArray(data)) {
        const before = data.length;
        data = data.filter(p => {
          const t = (p.title || "").toLowerCase().trim();
          return t !== "e prince jodhan" && t !== "p prince jodhan" && t.indexOf("e prince jodhan") === -1 && t.indexOf("p prince jodhan") === -1;
        });
        console.log("initApp: filtered " + (before - data.length) + " bad products from jodhan_products");
        localStorage.setItem("jodhan_products", JSON.stringify(data));
      }
    }
  } catch(e) { console.log("initApp cleanup error:", e); }

  // Load products from localStorage
  const storedProducts = localStorage.getItem("jodhan_products");
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    products = [...DEFAULT_PRODUCTS];
    localStorage.setItem("jodhan_products", JSON.stringify(products));
  }

  // Migrate old products with "stock" to new "colors" array
  products.forEach(ensureColorsArray);
  // Migrate old products with single "image" to "images" array
  products.forEach(p => {
    if (!p.images && p.image) {
      p.images = [p.image];
    } else if (!p.images) {
      p.images = ["https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=600&auto=format&fit=crop&q=80"];
    }
  });
  products.forEach(recomputeProductAvailability);
  saveProducts();

  // Load cart from localStorage
  const storedCart = localStorage.getItem("jodhan_cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  // Load session from localStorage
  const storedUser = localStorage.getItem("jodhan_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    updateUserSessionUI();
  }

  // Load countries
  const storedCountries = localStorage.getItem("jodhan_countries");
  if (storedCountries) {
    countries = JSON.parse(storedCountries);
  } else {
    countries = [...DEFAULT_COUNTRIES];
    localStorage.setItem("jodhan_countries", JSON.stringify(countries));
  }

  // Load bank accounts
  const storedBanks = localStorage.getItem("jodhan_bank_accounts");
  if (storedBanks) {
    bankAccounts = JSON.parse(storedBanks);
  } else {
    bankAccounts = [...DEFAULT_BANK_ACCOUNTS];
    localStorage.setItem("jodhan_bank_accounts", JSON.stringify(bankAccounts));
  }

  bankAccounts = normalizePayoutAccounts(bankAccounts);
  if (!bankAccounts.some(account => account.active) && bankAccounts.length > 0) {
    bankAccounts[0].active = true;
    saveBankAccounts();
  }

  // Load transactions
  const storedTxns = localStorage.getItem("jodhan_transactions");
  if (storedTxns) {
    transactions = JSON.parse(storedTxns);
  } else {
    transactions = [];
    localStorage.setItem("jodhan_transactions", JSON.stringify(transactions));
  }

  // Load orders
  const storedOrders = localStorage.getItem("jodhan_orders");
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  } else {
    orders = [];
    localStorage.setItem("jodhan_orders", JSON.stringify(orders));
  }

  // Auto-delete completed orders older than 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const beforeOrders = orders.length;
  orders = orders.filter(o => o.status !== "completed" || (o.completedAt && o.completedAt > sevenDaysAgo));
  if (orders.length !== beforeOrders) saveOrders();

  // Load categories
  const storedCategories = localStorage.getItem("jodhan_categories");
  if (storedCategories) {
    categories = JSON.parse(storedCategories);
  } else {
    categories = [...DEFAULT_CATEGORIES];
    localStorage.setItem("jodhan_categories", JSON.stringify(categories));
  }

  // Load managers
  const storedManagers = localStorage.getItem("jodhan_managers");
  if (storedManagers) {
    managers = JSON.parse(storedManagers);
  } else {
    managers = [];
    localStorage.setItem("jodhan_managers", JSON.stringify(managers));
  }

  if (localStorage.getItem("jodhan_credit_card_enabled") === null) {
    localStorage.setItem("jodhan_credit_card_enabled", "yes");
  }

  const storedBarcode = localStorage.getItem("jodhan_bank_barcode");
  if (storedBarcode) {
    bankBarcodeImageBase64 = storedBarcode;
  }

  // Load cached live rates
  const cachedRates = localStorage.getItem("jodhan_live_rates");
  if (cachedRates) {
    try {
      const parsed = JSON.parse(cachedRates);
      if (parsed && parsed.rates && parsed.fetched) {
        const mapping = { USD: "USD", CAD: "CAD", GBP: "GBP", EUR: "EUR", AED: "AED" };
        Object.keys(mapping).forEach(code => {
          const rate = parsed.rates[mapping[code]];
          if (rate && CURRENCIES[code]) CURRENCIES[code].rate = rate;
        });
        liveRates = parsed.rates;
        lastRateFetch = parsed.fetched;
      }
    } catch(_) {}
  }

  // Load selected currency
  const storedCurrency = localStorage.getItem("jodhan_currency");
  if (storedCurrency && CURRENCIES[storedCurrency]) {
    selectedCurrency = storedCurrency;
  }

  // Load selected country
  const storedSelectedCountry = localStorage.getItem("jodhan_selected_country");
  if (storedSelectedCountry) {
    selectedCountry = storedSelectedCountry;
    updateNavbarCountry();
  } else {
    // Force country gate overlay if not selected
    openCountryGate(false);
  }

  // Fetch live exchange rates (fire-and-forget)
  fetchLiveRates().then(() => {
    renderProducts();
    renderNewArrivals();
    renderCart();
  }).catch(() => {});

  // Render initial view
  renderCategories();
  renderAdminCategorySelect();
  renderNewArrivals();
  renderProducts();
  renderCheckoutPaymentUI();
  updateNavbarCurrency();
  ensureLivePaymentGatewayStatus();
  handleStripeReturnIfNeeded();
  updateCartBadge();
  setupEventListeners();
  observeScrollAnimations();
}

function updateNavbarCountry() {
  const countryObj = countries.find(c => c.name === selectedCountry) || { name: "India", flag: "🇮🇳" };
  const flagEl = document.getElementById("selected-country-flag");
  const nameEl = document.getElementById("selected-country-name");
  if (flagEl) flagEl.innerText = countryObj.flag;
  if (nameEl) nameEl.innerText = countryObj.name;

  const shipCountry = document.getElementById("ship-country");
  if (shipCountry) shipCountry.value = countryObj.name;
}

function updateNavbarCurrency() {
  const sel = document.getElementById("currency-select");
  if (sel) sel.value = selectedCurrency;
}

window.switchCurrency = function(code) {
  if (!CURRENCIES[code]) return;
  selectedCurrency = code;
  localStorage.setItem("jodhan_currency", code);
  updateNavbarCurrency();
  renderProducts();
  renderNewArrivals();
  renderCart();
  renderCheckoutBarcodePreview();
  renderActivePayoutBanner();
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchLiveRates() {
  if (Date.now() - lastRateFetch < RATE_CACHE_TTL) return;
  try {
    const res = await fetch("https://api.frankfurter.dev/latest?from=INR");
    const data = await res.json();
    if (data && data.rates) {
      const mapping = { USD: "USD", CAD: "CAD", GBP: "GBP", EUR: "EUR", AED: "AED" };
      Object.keys(mapping).forEach(code => {
        const rate = data.rates[mapping[code]];
        if (rate && CURRENCIES[code]) CURRENCIES[code].rate = rate;
      });
      liveRates = data.rates;
      lastRateFetch = Date.now();
      localStorage.setItem("jodhan_live_rates", JSON.stringify({ rates: data.rates, fetched: lastRateFetch }));
    }
  } catch (_) {
    // Fall back to hardcoded rates silently
  }
}

function formatPrice(inrAmount) {
  const cur = CURRENCIES[selectedCurrency] || CURRENCIES.INR;
  const converted = inrAmount * cur.rate;
  if (selectedCurrency === "INR") {
    return `₹${Math.round(converted).toLocaleString()}`;
  }
  const decimals = converted % 1 === 0 ? 0 : 2;
  return `${cur.symbol}${converted.toFixed(decimals).toLocaleString()}`;
}

function formatPriceLabel() {
  const cur = CURRENCIES[selectedCurrency] || CURRENCIES.INR;
  return `${cur.symbol} (${selectedCurrency})`;
}

function formatCategoryLabel(category) {
  return category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function saveCountries() {
  localStorage.setItem("jodhan_countries", JSON.stringify(countries));
}

function saveBankAccounts() {
  localStorage.setItem("jodhan_bank_accounts", JSON.stringify(bankAccounts));
}

function saveTransactions() {
  localStorage.setItem("jodhan_transactions", JSON.stringify(transactions));
}

function saveOrders() {
  localStorage.setItem("jodhan_orders", JSON.stringify(orders));
}

function saveCategories() {
  localStorage.setItem("jodhan_categories", JSON.stringify(categories));
}

function saveBankBarcodeCode() {
  localStorage.setItem("jodhan_bank_barcode", bankBarcodeImageBase64);
}

function getCheckoutLineItems() {
  return cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      title: product ? product.title : "Product",
      color: item.color || "",
      price: product ? product.price : 0,
      quantity: item.quantity
    };
  });
}

function getCheckoutCustomerPayload() {
  return {
    name: document.getElementById("checkout-name")?.value.trim() || currentUser?.name || "Guest Customer",
    email: document.getElementById("checkout-email")?.value.trim() || currentUser?.email || "",
    shippingCountry: document.getElementById("ship-country")?.value.trim() || selectedCountry || ""
  };
}

function getCheckoutOrderTotal() {
  return getCheckoutLineItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCheckoutSuccessView(orderNo, totalAmount, paymentMethodLabel, noticeText) {
  const mainContent = document.getElementById("checkout-modal-body");
  if (!mainContent) return;

  const defaultNotice = `A receipt and tracking details will be sent to <strong>${currentUser ? escapeHtml(currentUser.email) : "your email"}</strong> shortly.`;
  mainContent.innerHTML = `
      <div class="checkout-success-view">
        <div class="success-icon-wrap">
          <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p class="success-subtitle">Thank you for your order at Jodhan Silk Store.</p>
        
        <div class="success-invoice-box">
          <div class="invoice-row"><span>Order Number:</span><strong>${orderNo}</strong></div>
          <div class="invoice-row"><span>Amount Paid:</span><strong>${formatPrice(totalAmount)}</strong></div>
          <div class="invoice-row"><span>Payment Method:</span><strong>${escapeHtml(paymentMethodLabel)}</strong></div>
          <div class="invoice-row"><span>Payment Status:</span><span class="invoice-paid-badge">PAID</span></div>
        </div>
        
        <p class="success-notice">${noticeText || defaultNotice}</p>
        <button class="btn-primary" onclick="completeOrderFlow()">Continue Shopping</button>
      </div>
    `;
}

async function ensureLivePaymentGatewayStatus() {
  if (livePaymentGatewayStatusPromise) return livePaymentGatewayStatusPromise;

  livePaymentGatewayStatusPromise = fetch("/api/payment-config")
    .then(response => response.ok ? response.json() : { livePaymentsEnabled: false })
    .then(data => {
      livePaymentGatewayEnabled = Boolean(data.livePaymentsEnabled);
      renderCheckoutPaymentUI();
      return data;
    })
    .catch(() => {
      livePaymentGatewayEnabled = false;
      renderCheckoutPaymentUI();
      return { livePaymentsEnabled: false };
    });

  return livePaymentGatewayStatusPromise;
}

async function handleStripeReturnIfNeeded() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const checkoutState = params.get("checkout");

  if (checkoutState !== "success" || !sessionId) return;
  if (sessionStorage.getItem("jodhan_confirmed_session_id") === sessionId) return;

  try {
    const response = await fetch(`/api/checkout-session-status?session_id=${encodeURIComponent(sessionId)}`);
    if (!response.ok) throw new Error("Could not confirm payment");

    const data = await response.json();
    if (data.paymentStatus !== "paid") {
      showToast("Payment has not been confirmed yet.");
      return;
    }

    const orderNo = data.orderNo || sessionStorage.getItem("jodhan_pending_order_no") || `JODHAN-${sessionId.slice(-8)}`;
    const paymentMethodLabel = data.paymentMethod || sessionStorage.getItem("jodhan_pending_payment_method") || "Credit / Debit Card";
    const totalAmount = Math.round((data.amountTotal || 0) / 100);

    sessionStorage.setItem("jodhan_confirmed_session_id", sessionId);
    deductStockForCart();
    // Record order
    const customerEmail = data.customerEmail || sessionStorage.getItem("jodhan_pending_email") || currentUser?.email || "";
    orders.unshift({
      id: "order-" + Date.now(),
      orderNo,
      amount: totalAmount,
      paymentMethod: paymentMethodLabel,
      customerName: data.customerName || "Guest",
      customerEmail,
      items: data.items || [],
      status: "pending",
      createdAt: Date.now(),
      completedAt: null
    });
    saveOrders();
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    recordCheckoutPayout(orderNo, totalAmount);
    renderCheckoutSuccessView(orderNo, totalAmount, paymentMethodLabel, "Your card payment was confirmed by the live payment processor.");
    history.replaceState({}, "", window.location.pathname);
  } catch (error) {
    showToast("Could not load the live payment confirmation.");
  }
}

function populateCountrySelect(selectEl) {
  if (!selectEl) return;

  selectEl.innerHTML = countries.map(country => {
    const selected = country.name === selectedCountry ? "selected" : "";
    return `<option value="${escapeHtml(country.name)}" ${selected}>${country.flag} ${escapeHtml(country.name)}</option>`;
  }).join("");
}

window.openCountryGate = function(allowClose = true) {
  const overlay = document.getElementById("country-gate-overlay");
  const closeBtn = document.getElementById("country-gate-close-btn");
  if (overlay) overlay.classList.add("active");
  if (closeBtn) closeBtn.style.display = allowClose ? "block" : "none";
  populateCountrySelect(document.getElementById("gate-country-select"));
  document.body.style.overflow = "hidden";
};

window.closeCountryGate = function() {
  const overlay = document.getElementById("country-gate-overlay");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
};

window.handleCountryGateSubmit = function(e) {
  e.preventDefault();
  const select = document.getElementById("gate-country-select");
  if (!select || !select.value) return;

  selectedCountry = select.value;
  localStorage.setItem("jodhan_selected_country", selectedCountry);
  updateNavbarCountry();
  closeCountryGate();
};

function renderAdminCountriesList() {
  const tbody = document.getElementById("admin-countries-list");
  if (!tbody) return;

  if (countries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No countries configured.</td></tr>`;
    return;
  }

  tbody.innerHTML = countries.map(country => `
    <tr>
      <td>${country.flag}</td>
      <td>${escapeHtml(country.name)}</td>
      <td>
        <button type="button" class="btn-delete" data-country="${escapeHtml(country.name)}" onclick="deleteCountry(this.dataset.country)">Delete</button>
      </td>
    </tr>
  `).join("");
}

window.handleCreateCountry = function(e) {
  e.preventDefault();
  const name = document.getElementById("new-country-name").value.trim();
  const flag = document.getElementById("new-country-flag").value.trim();

  if (!name || !flag) {
    showToast("Please enter both country name and flag emoji.");
    return;
  }

  if (countries.some(country => country.name.toLowerCase() === name.toLowerCase())) {
    showToast("This country is already supported.");
    return;
  }

  countries.push({ name, flag });
  saveCountries();
  document.getElementById("add-country-form").reset();
  renderAdminCountriesList();
  populateCountrySelect(document.getElementById("gate-country-select"));
  showToast(`Added shipping destination: ${name}`);
};

window.deleteCountry = function(name) {
  if (countries.length <= 1) {
    showToast("At least one shipping country is required.");
    return;
  }

  if (!confirm(`Remove "${name}" from supported shipping destinations?`)) return;

  countries = countries.filter(country => country.name !== name);

  if (selectedCountry === name) {
    selectedCountry = countries[0].name;
    localStorage.setItem("jodhan_selected_country", selectedCountry);
    updateNavbarCountry();
  }

  saveCountries();
  renderAdminCountriesList();
  populateCountrySelect(document.getElementById("gate-country-select"));
  showToast(`Removed ${name}.`);
};

function maskAccountNumber(accNo) {
  if (accNo.length <= 4) return accNo;
  return "•".repeat(Math.max(accNo.length - 4, 4)) + accNo.slice(-4);
}

function normalizePayoutAccounts(accounts) {
  return accounts.map(account => ({
    ...account,
    type: account.type || "bank",
    balance: typeof account.balance === "number" ? account.balance : 0
  }));
}

function getActivePayoutAccount() {
  return bankAccounts.find(account => account.active) || null;
}

function getPayoutAccountTitle(account) {
  if (!account) return "Unassigned";
  if (account.type === "googlepay") return "Google Pay";
  return account.bankName;
}

function getPayoutAccountDetail(account) {
  if (!account) return "";
  if (account.type === "googlepay") {
    return account.upiId || account.accNo || "";
  }
  return `${account.accNo}${account.ifscCode ? ` · ${account.ifscCode}` : ""}`;
}

function getPayoutLedgerLabel(account) {
  if (!account) return "Unassigned";
  if (account.type === "googlepay") {
    return `Google Pay · ${account.upiId || account.accNo || "UPI"}`;
  }
  return account.bankName;
}

function setPrimaryPayoutAccount(id) {
  bankAccounts.forEach(account => {
    account.active = account.id === id;
  });
  saveBankAccounts();
  renderBankAccountsGrid();
}

window.switchPayoutFormType = function(type) {
  payoutFormType = type;

  document.querySelectorAll(".payout-type-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.getElementById(type === "googlepay" ? "payout-type-gpay" : "payout-type-bank");
  if (activeBtn) activeBtn.classList.add("active");

  const bankFields = document.getElementById("bank-payout-fields");
  const gpayFields = document.getElementById("gpay-payout-fields");
  const submitBtn = document.getElementById("add-payout-submit-btn");
  if (bankFields) bankFields.style.display = type === "bank" ? "block" : "none";
  if (gpayFields) gpayFields.style.display = type === "googlepay" ? "block" : "none";
  if (submitBtn) submitBtn.innerText = type === "googlepay" ? "Link Google Pay / UPI" : "Link Bank Account";
};

function renderActivePayoutBanner() {
  const banner = document.getElementById("active-payout-banner");
  if (!banner) return;

  const activeAccount = getActivePayoutAccount();
  if (!activeAccount) {
    banner.classList.remove("show");
    banner.innerHTML = "";
    return;
  }

  banner.classList.add("show");
  banner.innerHTML = `
    <strong>Primary payout destination: ${escapeHtml(getPayoutAccountTitle(activeAccount))}</strong>
    <span>All checkout payments are routed to ${escapeHtml(getPayoutAccountDetail(activeAccount))} (${escapeHtml(activeAccount.holderName)}).</span>
  `;
}

function renderBankAccountsGrid() {
  const grid = document.getElementById("admin-bank-accounts-grid");
  if (!grid) return;

  renderActivePayoutBanner();

  if (bankAccounts.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.9rem;">No payout accounts linked yet. Add a bank account or Google Pay UPI ID to receive checkout funds.</p>`;
    return;
  }

  grid.innerHTML = bankAccounts.map(account => {
    const isGooglePay = account.type === "googlepay";
    const typeBadge = isGooglePay
      ? `<span class="gpay-type-badge">Google Pay</span>`
      : `<span class="bank-type-badge">Bank</span>`;
    const detailPrimary = isGooglePay
      ? escapeHtml(account.upiId || account.accNo || "")
      : escapeHtml(account.accNo);
    const detailSecondary = isGooglePay
      ? (account.phone ? `Mobile: ${escapeHtml(account.phone)}` : "UPI payout account")
      : `IFSC: ${escapeHtml(account.ifscCode || "")}`;

    return `
      <div class="bank-card ${isGooglePay ? "googlepay" : ""} ${account.active ? "active" : ""}">
        <div class="bank-card-header">
          <span class="bank-card-logo">${escapeHtml(getPayoutAccountTitle(account))}</span>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            ${typeBadge}
            ${account.active ? `<span class="bank-active-badge">Primary</span>` : ""}
          </div>
        </div>
        <div class="bank-card-details">
          <span class="bank-acc-num">${detailPrimary}</span>
          <span class="bank-holder">${escapeHtml(account.holderName)}</span>
          <span class="bank-holder">${detailSecondary}</span>
        </div>
        <div class="bank-card-balance">
          <span class="bank-balance-lbl">Received</span>
          <span class="bank-balance-val">${formatPrice(account.balance)}</span>
        </div>
        <button
          class="btn-set-active"
          data-id="${escapeHtml(account.id)}"
          onclick="setActiveBankAccount(this.dataset.id)"
          ${account.active ? "disabled style='opacity: 0.6; cursor: not-allowed;'" : ""}
        >
          ${account.active ? "Receiving All Payments" : "Set As Primary Payout"}
        </button>
        <button
          class="btn-delete-bank"
          data-id="${escapeHtml(account.id)}"
          onclick="deleteBankAccount(this.dataset.id)"
        >
          Remove
        </button>
      </div>
    `;
  }).join("");
}

function renderTransactionsList() {
  const tbody = document.getElementById("admin-transactions-list");
  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No payout transactions recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = transactions.map(txn => `
    <tr>
      <td>${escapeHtml(txn.date)}</td>
      <td>${escapeHtml(txn.orderId)}</td>
      <td>${formatPrice(txn.amount)}</td>
      <td>${escapeHtml(txn.destination || txn.bankName || "Unassigned")}</td>
      <td><span class="info-badge">${escapeHtml(txn.status)}</span></td>
    </tr>
  `).join("");
}

function cleanupOldCompletedOrders() {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const before = orders.length;
  orders = orders.filter(o => o.status !== "completed" || (o.completedAt && o.completedAt > sevenDaysAgo));
  if (orders.length !== before) saveOrders();
}

function renderAdminOrders() {
  renderPendingOrders();
  renderCompletedOrders();
}

function renderPendingOrders() {
  const tbody = document.getElementById("admin-orders-pending-list");
  if (!tbody) return;
  const pending = orders.filter(o => o.status === "pending");
  if (pending.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center">No pending orders.</td></tr>`;
    return;
  }
  tbody.innerHTML = pending.map(o => {
    const itemsList = (o.items || []).map(item =>
      `${escapeHtml(item.title)}${item.color ? ` (${escapeHtml(item.color)})` : ""} x${item.quantity}`
    ).join(", ");
    return `<tr>
      <td><strong>${escapeHtml(o.orderNo)}</strong></td>
      <td>${escapeHtml(o.customerName)}<br><small style="color:var(--text-secondary)">${escapeHtml(o.customerEmail)}</small></td>
      <td style="font-size:0.85rem">${itemsList}</td>
      <td>${formatPrice(o.amount)}</td>
      <td>${escapeHtml(o.paymentMethod)}</td>
      <td style="font-size:0.85rem">${new Date(o.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn-edit" onclick="markOrderCompleted('${o.id}')" style="margin-bottom:0.3rem">Mark Completed</button>
        <button class="btn-delete" onclick="deleteOrder('${o.id}')">Delete</button>
      </td>
    </tr>`;
  }).join("");
}

function renderCompletedOrders() {
  const tbody = document.getElementById("admin-orders-completed-list");
  if (!tbody) return;
  const completed = orders.filter(o => o.status === "completed");
  if (completed.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center">No completed orders.</td></tr>`;
    return;
  }
  tbody.innerHTML = completed.map(o => {
    const itemsList = (o.items || []).map(item =>
      `${escapeHtml(item.title)}${item.color ? ` (${escapeHtml(item.color)})` : ""} x${item.quantity}`
    ).join(", ");
    return `<tr>
      <td><strong>${escapeHtml(o.orderNo)}</strong></td>
      <td>${escapeHtml(o.customerName)}<br><small style="color:var(--text-secondary)">${escapeHtml(o.customerEmail)}</small></td>
      <td style="font-size:0.85rem">${itemsList}</td>
      <td>${formatPrice(o.amount)}</td>
      <td>${escapeHtml(o.paymentMethod)}</td>
      <td style="font-size:0.85rem">${o.completedAt ? new Date(o.completedAt).toLocaleDateString() : "-"}</td>
    </tr>`;
  }).join("");
}

window.markOrderCompleted = function(id) {
  const o = orders.find(order => order.id === id);
  if (!o) return;
  o.status = "completed";
  o.completedAt = Date.now();
  saveOrders();
  renderAdminOrders();
  showToast(`Order ${o.orderNo} marked as completed.`);
};

window.deleteOrder = function(id) {
  const o = orders.find(order => order.id === id);
  if (!o) return;
  if (!confirm(`Delete order ${o.orderNo}? This cannot be undone.`)) return;
  orders = orders.filter(order => order.id !== id);
  saveOrders();
  renderAdminOrders();
  showToast(`Order ${o.orderNo} deleted.`);
};

window.handleCreatePayoutAccount = function(e) {
  e.preventDefault();

  const makePrimary = document.getElementById("new-payout-primary")?.checked;
  const isFirstAccount = bankAccounts.length === 0;
  const shouldActivate = isFirstAccount || makePrimary;
  let newAccount;

  if (payoutFormType === "googlepay") {
    const holderName = document.getElementById("new-gpay-holder")?.value.trim();
    const upiId = document.getElementById("new-gpay-upi")?.value.trim().toLowerCase();
    const phone = document.getElementById("new-gpay-phone")?.value.trim();

    if (!holderName || !upiId) {
      showToast("Please enter the Google Pay holder name and UPI ID.");
      return;
    }

    if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      showToast("Please enter a valid UPI ID, e.g. prince@okaxis.");
      return;
    }

    if (bankAccounts.some(account => account.type === "googlepay" && (account.upiId || account.accNo) === upiId)) {
      showToast("This Google Pay UPI ID is already linked.");
      return;
    }

    newAccount = {
      id: "gpay-" + Date.now(),
      type: "googlepay",
      bankName: "Google Pay",
      holderName,
      upiId,
      accNo: upiId,
      phone,
      balance: 0,
      active: shouldActivate
    };
  } else {
    const bankName = document.getElementById("new-bank-name")?.value.trim();
    const holderName = document.getElementById("new-bank-holder")?.value.trim();
    const fullAccNo = document.getElementById("new-bank-accno")?.value.trim();
    const ifscCode = document.getElementById("new-bank-ifsc")?.value.trim();

    if (!bankName || !holderName || !fullAccNo || !ifscCode) {
      showToast("Please complete all bank account fields.");
      return;
    }

    newAccount = {
      id: "bank-" + Date.now(),
      type: "bank",
      bankName,
      holderName,
      accNo: maskAccountNumber(fullAccNo),
      fullAccNo,
      ifscCode,
      balance: 0,
      active: shouldActivate
    };
  }

  if (shouldActivate) {
    bankAccounts.forEach(account => { account.active = false; });
  }

  bankAccounts.push(newAccount);
  saveBankAccounts();
  document.getElementById("add-bank-form").reset();
  document.getElementById("new-payout-primary").checked = false;
  switchPayoutFormType(payoutFormType);
  renderBankAccountsGrid();

  const label = newAccount.type === "googlepay"
    ? `Google Pay (${newAccount.upiId})`
    : newAccount.bankName;
  showToast(shouldActivate
    ? `${label} linked and set as primary payout destination.`
    : `${label} linked successfully.`);
};

window.handleCreateBankAccount = window.handleCreatePayoutAccount;

window.setActiveBankAccount = function(id) {
  setPrimaryPayoutAccount(id);
  const activeAccount = getActivePayoutAccount();
  if (!activeAccount) return;

  showToast(`All checkout payments will now go to ${getPayoutLedgerLabel(activeAccount)}.`);
};

window.deleteBankAccount = function(id) {
  const account = bankAccounts.find(a => a.id === id);
  if (!account) return;

  const label = account.type === "googlepay"
    ? `Google Pay (${account.upiId || account.accNo})`
    : account.bankName;
  if (!confirm(`Remove "${label}" (${account.holderName}) from payout destinations?`)) return;

  const wasActive = account.active;
  bankAccounts = bankAccounts.filter(a => a.id !== id);

  if (wasActive && bankAccounts.length > 0) {
    bankAccounts[0].active = true;
  }

  saveBankAccounts();
  renderBankAccountsGrid();
  showToast(`Removed ${label}.`);
};

function renderAdminCategorySelect() {
  const selects = ["new-prod-category", "edit-prod-category"];
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = `<option value="" disabled ${currentValue ? "" : "selected"}>Select Category</option>` +
      categories.map(category => {
        const selected = currentValue === category ? "selected" : "";
        return `<option value="${escapeHtml(category)}" ${selected}>${escapeHtml(formatCategoryLabel(category))}</option>`;
      }).join("");
  });
}

function renderAdminCategoriesList() {
  const tbody = document.getElementById("admin-categories-list");
  if (!tbody) return;

  if (categories.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No categories configured.</td></tr>`;
    return;
  }

  tbody.innerHTML = categories.map(category => {
    const productCount = products.filter(product => product.category === category).length;
    return `
      <tr>
        <td>${escapeHtml(formatCategoryLabel(category))}</td>
        <td>${productCount}</td>
        <td>
          <button type="button" class="btn-delete" data-category="${escapeHtml(category)}" onclick="deleteCategory(this.dataset.category)">Delete</button>
        </td>
      </tr>
    `;
  }).join("");
}

window.handleCreateCategory = function(e) {
  e.preventDefault();
  const rawName = document.getElementById("new-category-name").value.trim();
  const normalizedName = rawName.toLowerCase();

  if (!normalizedName) {
    showToast("Please enter a category name.");
    return;
  }

  if (categories.some(category => category.toLowerCase() === normalizedName)) {
    showToast("This category already exists.");
    return;
  }

  categories.push(normalizedName);
  saveCategories();
  document.getElementById("add-category-form").reset();
  renderAdminCategoriesList();
  renderAdminCategorySelect();
  renderCategories();
  showToast(`Added category: ${formatCategoryLabel(normalizedName)}`);
};

window.deleteCategory = function(categoryName) {
  const productCount = products.filter(product => product.category === categoryName).length;
  if (productCount > 0) {
    showToast(`Cannot delete "${formatCategoryLabel(categoryName)}" — ${productCount} product(s) still use it.`);
    return;
  }

  if (!confirm(`Delete category "${formatCategoryLabel(categoryName)}"?`)) return;

  categories = categories.filter(category => category !== categoryName);

  if (currentCategory === categoryName) {
    currentCategory = "all";
  }

  saveCategories();
  renderAdminCategoriesList();
  renderAdminCategorySelect();
  renderCategories();
  renderProducts();
  showToast(`Deleted category: ${formatCategoryLabel(categoryName)}`);
};

const SUPER_ADMIN_USERNAME = "prince";

function isCreditCardEnabled() {
  return localStorage.getItem("jodhan_credit_card_enabled") !== "no";
}

function saveManagers() {
  localStorage.setItem("jodhan_managers", JSON.stringify(managers));
}

function renderAdminCreditCardSettings() {
  if (adminRole !== "admin") return;
  const select = document.getElementById("admin-credit-card-status");
  if (select) select.value = isCreditCardEnabled() ? "yes" : "no";
}

window.handleCreditCardStatusChange = function(value) {
  if (adminRole !== "admin") {
    showToast("Only the main admin can change credit card settings.");
    return;
  }
  localStorage.setItem("jodhan_credit_card_enabled", value === "no" ? "no" : "yes");
  renderCheckoutPaymentUI();
  showToast(value === "no"
    ? "Credit card checkout disabled. Customers will see WhatsApp order instructions."
    : "Credit card checkout enabled.");
};

function renderAdminManagers() {
  if (adminRole !== "admin") return;
  const tbody = document.getElementById("admin-managers-list");
  if (!tbody) return;

  if (managers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No manager accounts yet. Create one using the form on the left.</td></tr>`;
    return;
  }

  tbody.innerHTML = managers.map((mgr, index) => {
    const isActive = mgr.enabled !== false;
    return `
      <tr>
        <td>${escapeHtml(mgr.username)}</td>
        <td>
          <div class="manager-password-cell">
            <span class="manager-password-value" id="mgr-pass-${index}">••••••••</span>
            <button type="button" class="btn-show-password" data-showing="false" onclick="toggleManagerPasswordVisibility(${index}, this)">Show</button>
          </div>
        </td>
        <td>${isActive ? '<span class="info-badge" style="background:#dcfce7;color:#166534;">Active</span>' : '<span class="info-badge">Disabled</span>'}</td>
        <td style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button type="button" class="btn-secondary" onclick="toggleManagerEnabled(${index})">${isActive ? "Disable" : "Enable"}</button>
          <button type="button" class="btn-delete" onclick="deleteManager(${index})">Delete</button>
        </td>
      </tr>
    `;
  }).join("");
}

window.toggleNewManagerPasswordVisibility = function(btn) {
  const input = document.getElementById("new-manager-pass");
  if (!input || !btn) return;
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  btn.textContent = showing ? "Show" : "Hide";
};

window.toggleManagerPasswordVisibility = function(index, btn) {
  const mgr = managers[index];
  const span = document.getElementById(`mgr-pass-${index}`);
  if (!mgr || !span || !btn) return;

  const showing = btn.dataset.showing === "true";
  if (showing) {
    span.textContent = "••••••••";
    btn.textContent = "Show";
    btn.dataset.showing = "false";
  } else {
    span.textContent = mgr.password;
    btn.textContent = "Hide";
    btn.dataset.showing = "true";
  }
};

function resetNewManagerPasswordField() {
  const input = document.getElementById("new-manager-pass");
  const toggleBtn = document.querySelector("#create-manager-form .btn-show-password");
  if (input) input.type = "password";
  if (toggleBtn) toggleBtn.textContent = "Show";
}

window.handleCreateManager = function(e) {
  e.preventDefault();
  if (adminRole !== "admin") {
    showToast("Only the main admin can create manager accounts.");
    return;
  }

  const username = document.getElementById("new-manager-user")?.value.trim();
  const password = document.getElementById("new-manager-pass")?.value.trim();

  if (!username || !password) {
    showToast("Please enter a username and password.");
    return;
  }

  if (username.length < 3) {
    showToast("Username must be at least 3 characters.");
    return;
  }

  if (username.toLowerCase() === SUPER_ADMIN_USERNAME) {
    showToast("This username is reserved for the main admin account.");
    return;
  }

  if (managers.some(mgr => mgr.username.toLowerCase() === username.toLowerCase())) {
    showToast("A manager with this username already exists.");
    return;
  }

  managers.push({
    id: "mgr-" + Date.now(),
    username,
    password,
    enabled: true,
    createdAt: Date.now()
  });

  saveManagers();
  document.getElementById("create-manager-form")?.reset();
  resetNewManagerPasswordField();
  renderAdminManagers();
  showToast(`Manager account "${username}" created. They can only access the inventory catalog.`);
};

window.toggleManagerEnabled = function(index) {
  if (adminRole !== "admin") return;
  const mgr = managers[index];
  if (!mgr) return;

  mgr.enabled = mgr.enabled === false;
  saveManagers();
  renderAdminManagers();
  showToast(`Manager "${mgr.username}" ${mgr.enabled ? "enabled" : "disabled"}.`);
};

window.deleteManager = function(index) {
  if (adminRole !== "admin") return;
  const mgr = managers[index];
  if (!mgr) return;

  if (!confirm(`Delete manager account "${mgr.username}"?`)) return;

  managers.splice(index, 1);
  saveManagers();
  renderAdminManagers();
  showToast(`Manager "${mgr.username}" deleted.`);
};

function applyManagerInventoryRestrictions() {
  const isManager = adminRole === "manager";
  const isSuperAdmin = adminRole === "admin";

  const titleEl = document.getElementById("admin-panel-title");
  const subtitleEl = document.getElementById("admin-panel-subtitle");
  if (titleEl) {
    titleEl.textContent = isManager ? "Inventory Manager Panel" : "Main Admin Control Panel";
  }
  if (subtitleEl) {
    subtitleEl.textContent = isManager
      ? "You can add and edit suits, update stock, manage colors, and change availability. Other admin settings are restricted to the main admin."
      : "Full store control: inventory, categories, countries, orders, payouts, manager accounts, and credit card settings.";
  }

  const wipeBtn = document.querySelector("button[onclick=\"wipeBadItems()\"]");
  if (wipeBtn) wipeBtn.style.display = isSuperAdmin ? "" : "none";
}

window.switchAdminTab = function(tabId) {
  if (adminRole === "manager" && tabId !== "inventory") {
    tabId = "inventory";
  }

  activeAdminTab = tabId;

  document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-tab-content").forEach(content => {
    content.style.display = "none";
  });

  const tabBtn = document.getElementById(`btn-tab-${tabId}`);
  const tabContent = document.getElementById(`admin-tab-${tabId}`);
  if (tabBtn) tabBtn.classList.add("active");
  if (tabContent) tabContent.style.display = "block";

  switch (tabId) {
    case "inventory":
      renderAdminCategorySelect();
      renderAdminProductsTable();
      break;
    case "categories":
      renderAdminCategoriesList();
      break;
    case "countries":
      renderAdminCountriesList();
      break;
    case "orders":
      cleanupOldCompletedOrders();
      renderAdminOrders();
      break;
    case "banking":
      switchPayoutFormType(payoutFormType);
      renderBankAccountsGrid();
      renderTransactionsList();
      renderAdminCreditCardSettings();
      break;
    case "managers":
      renderAdminManagers();
      break;
    default:
      break;
  }
};

function recordCheckoutPayout(orderNo, totalAmount) {
  const activeAccount = getActivePayoutAccount();

  if (activeAccount) {
    activeAccount.balance += totalAmount;
    saveBankAccounts();
  }

  transactions.unshift({
    id: "txn-" + Date.now(),
    date: new Date().toLocaleString(),
    orderId: orderNo,
    amount: totalAmount,
    destination: activeAccount ? getPayoutLedgerLabel(activeAccount) : "Unassigned",
    bankName: activeAccount ? getPayoutAccountTitle(activeAccount) : "Unassigned",
    bankId: activeAccount ? activeAccount.id : null,
    accountType: activeAccount ? activeAccount.type : null,
    status: "Completed"
  });
  saveTransactions();
}

// Deduct stock from products after purchase
function deductStockForCart() {
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product || !item.color) return;
    const colorEntry = (product.colors || []).find(c => c.name === item.color);
    if (colorEntry) {
      colorEntry.stock = Math.max(0, (colorEntry.stock || 0) - item.quantity);
    }
    recomputeProductAvailability(product);
  });
  saveProducts();
}

// Save products to local storage
function saveProducts() {
  localStorage.setItem("jodhan_products", JSON.stringify(products));
}

// Save cart to local storage
function saveCart() {
  localStorage.setItem("jodhan_cart", JSON.stringify(cart));
}

// Render product list with filtering
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = products.filter(p => {
    // Only show available items to customer, admin sees everything
    if (!adminMode && !p.available) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery)) return false;
    if (currentCategory === "all") return true;
    return p.category === currentCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-products scroll-animate">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 12h-15m0 0l5.3-5.3M4.5 12l5.3 5.3" />
        </svg>
        <p>No products found in this category.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card scroll-animate";
    card.setAttribute("data-id", p.id);

    const totalStock = colorTotalStock(p.colors);
    const inStock = totalStock > 0;
    const stockTag = inStock
      ? `<span class="stock-tag in-stock">${totalStock} in stock</span>` 
      : `<span class="stock-tag out-of-stock">Out of Stock</span>`;

    const colorSwatches = (p.colors || []).map(c => {
      const cs = c.stock || 0;
      return `<span class="color-swatch" data-color="${escapeHtml(c.name)}" data-stock="${cs}" title="${escapeHtml(c.name)}: ${cs} available" onclick="openQuickView('${p.id}')" style="background:${getColorStyle(c)}">${cs > 0 ? '' : '<span class="oos-overlay"></span>'}</span>`;
    }).join("");

    card.innerHTML = `
      <div class="product-image-container">
        <img class="product-img" src="${getProductImage(p)}" alt="${p.title}" onerror="handleImageError(this)">
        ${stockTag}
        <button class="quick-view-btn" onclick="openQuickView('${p.id}')">Quick View</button>
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-cat">${p.category}</span>
          <span class="product-price">${formatPrice(p.price)}</span>
        </div>
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc-short">${p.description.substring(0, 75)}...</p>
        <div class="product-colors-row">${colorSwatches}</div>
        <div class="product-actions">
          <button class="add-to-cart-btn btn-primary" onclick="openQuickView('${p.id}')" ${!inStock ? 'disabled' : ''}>
            ${inStock ? 'Choose Color' : 'Unavailable'}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Re-run scroll animation observer
  observeScrollAnimations();
}

// Fallback for missing/broken product images
window.handleImageError = function(img) {
  const parent = img.parentElement;
  if (!parent) return;

  // Replace with a beautiful custom theme gradient with initial letter placeholder
  const title = img.alt || "Product";
  const initial = title.charAt(0);

  const fallback = document.createElement("div");
  fallback.className = "image-fallback-placeholder";
  fallback.innerHTML = `
    <div class="fallback-gradient"></div>
    <span class="fallback-letter">${initial}</span>
    <span class="fallback-logo-text">JODHAN SILK</span>
  `;

  img.style.display = "none";
  parent.appendChild(fallback);
};

// Render category filter items
function renderCategories() {
  const categoriesList = ["all", ...categories];
  const container = document.getElementById("category-filters");
  if (!container) return;

  container.innerHTML = "";
  categoriesList.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `cat-filter-btn ${cat === currentCategory ? "active" : ""}`;
    btn.innerText = cat === "all" ? "All Collections" : formatCategoryLabel(cat);
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = cat;
      renderProducts();
    });
    container.appendChild(btn);
  });
}

// Cart System - Add Item (color required)
window.addToCart = function(productId, color) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (!color) {
    openQuickView(productId);
    return;
  }

  const availableStock = getColorStock(product.colors, color);
  if (availableStock <= 0) {
    showToast(`"${color}" is out of stock.`);
    return;
  }

  // Check how many of this color are already in cart
  const existing = cart.find(item => item.productId === productId && item.color === color);
  const currentQty = existing ? existing.quantity : 0;

  if (currentQty >= availableStock) {
    showToast(`Only ${availableStock} of "${color}" available.`);
    return;
  }

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, color, quantity: 1 });
  }

  saveCart();
  updateCartBadge();
  renderCart();
  openCartDrawer();
};

// Cart System - Remove/Update Items
window.updateCartQuantity = function(productId, color, delta) {
  const item = cart.find(i => i.productId === productId && i.color === color);
  if (!item) return;

  const product = products.find(p => p.id === productId);
  if (delta > 0 && product) {
    const maxStock = getColorStock(product.colors, color);
    if (item.quantity + delta > maxStock) {
      showToast(`Only ${maxStock} of "${color}" available.`);
      return;
    }
  }

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => !(i.productId === productId && i.color === color));
  }

  saveCart();
  updateCartBadge();
  renderCart();
};

window.removeFromCart = function(productId, color) {
  cart = cart.filter(i => !(i.productId === productId && i.color === color));
  saveCart();
  updateCartBadge();
  renderCart();
};

// Update cart counter bubble
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

// Render items inside the Cart drawer
function renderCart() {
  const container = document.getElementById("cart-items-container");
  const subtotalVal = document.getElementById("cart-subtotal");
  const totalVal = document.getElementById("cart-total");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-view">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p>Your shopping bag is empty.</p>
        <button class="btn-primary" onclick="closeCartDrawer()">Start Shopping</button>
      </div>
    `;
    if (subtotalVal) subtotalVal.innerText = formatPrice(0);
    if (totalVal) totalVal.innerText = formatPrice(0);
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) return;

    const itemTotal = prod.price * item.quantity;
    subtotal += itemTotal;
    const colorStock = getColorStock(prod.colors, item.color);
    const cartColorObj = (prod.colors || []).find(co => co.name === item.color);

    const cartRow = document.createElement("div");
    cartRow.className = "cart-item-row";
    cartRow.innerHTML = `
      <div class="cart-item-img-wrap">
        <img src="${getProductImage(prod)}" alt="${prod.title}" onerror="handleImageError(this)">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-header">
          <h4 class="cart-item-title">${prod.title}</h4>
          <button class="cart-remove-item-btn" onclick="removeFromCart('${prod.id}', '${escapeHtml(item.color)}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <span class="cart-item-category">${prod.category}</span>
        <span class="cart-item-color"><span class="color-dot" style="background:${getColorStyle(cartColorObj)}"></span>${escapeHtml(item.color)}</span>
        <div class="cart-item-footer">
          <div class="quantity-controls">
            <button onclick="updateCartQuantity('${prod.id}', '${escapeHtml(item.color)}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity('${prod.id}', '${escapeHtml(item.color)}', 1)" ${colorStock <= 0 ? 'disabled' : ''}>+</button>
          </div>
          <span class="cart-item-price">${formatPrice(itemTotal)}</span>
        </div>
      </div>
    `;
    container.appendChild(cartRow);
  });

  if (subtotalVal) subtotalVal.innerText = formatPrice(subtotal);
  if (totalVal) totalVal.innerText = formatPrice(subtotal);
}

// Drawer Opens & Closes
window.openCartDrawer = function() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden"; // disable scroll
  }
};

window.closeCartDrawer = function() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = ""; // enable scroll
  }
};

// Quick View Modal
window.openQuickView = function(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  const modal = document.getElementById("quick-view-modal");
  if (!modal) return;

  const totalStock = colorTotalStock(p.colors);
  const inStock = totalStock > 0;

  const colorOptions = (p.colors || []).map(c => {
    const cs = c.stock || 0;
    const disabled = cs <= 0 ? 'disabled' : '';
    const cls = cs <= 0 ? 'qv-color-btn oos' : 'qv-color-btn';
    return `<button class="${cls}" data-color="${escapeHtml(c.name)}" data-stock="${cs}" onclick="selectQuickViewColor(this, '${p.id}')" ${disabled} style="border-left: 6px solid ${getColorStyle(c)}">${escapeHtml(c.name)} <span class="qv-color-stock">(${cs > 0 ? cs + ' avail' : 'Out of Stock'})</span></button>`;
  }).join("");

  const modalBody = modal.querySelector(".modal-body-content");
  const imgs = getProductImages(p);
  const galleryThumbs = imgs.length > 1 ? imgs.map((src, i) =>
    `<img class="qv-gallery-thumb ${i === 0 ? 'active' : ''}" src="${src}" onclick="switchQvImage(this, '${escapeHtml(src)}')" data-src="${escapeHtml(src)}">`
  ).join("") : "";
  const videos = p.videos || [];
  const videoHtml = videos.length > 0 ? videos.map(v => `<video src="${v}" controls playsinline style="width:100%;max-height:200px;border-radius:6px;margin-top:0.5rem;background:#000">Your browser doesn't support this video format.</video>`).join("") : "";

  modalBody.innerHTML = `
    <div class="quick-view-layout">
      <div class="quick-view-image-wrap" style="position:relative">
        <img id="qv-main-image" src="${getProductImage(p)}" alt="${p.title}" onerror="handleImageError(this)">
        ${galleryThumbs ? `<div class="qv-gallery-row">${galleryThumbs}</div>` : ""}
        ${videoHtml}
      </div>
      <div class="quick-view-text-wrap">
        <span class="qv-cat">${p.category}</span>
        <h2 class="qv-title">${p.title}</h2>
        <div class="qv-price">${formatPrice(p.price)}</div>
        <p class="qv-desc">${p.description}</p>
        <div class="qv-colors-label">Choose Color:</div>
        <div class="qv-colors-grid" id="qv-colors-${p.id}">${colorOptions}</div>
        <div class="qv-stock-status">
          Total Availability: <span class="${inStock ? 'text-in-stock' : 'text-out-of-stock'}">${inStock ? totalStock + ' units across all colors' : 'Out of Stock'}</span>
        </div>
        <button class="add-to-cart-btn btn-primary" id="qv-add-btn-${p.id}" onclick="addToCartFromQuickView('${p.id}')" disabled>
          Select a Color
        </button>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeQuickView = function() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

let selectedQuickViewColor = {};

window.selectQuickViewColor = function(btn, productId) {
  const container = document.getElementById("qv-colors-" + productId);
  if (container) {
    container.querySelectorAll(".qv-color-btn").forEach(b => b.classList.remove("selected"));
  }
  btn.classList.add("selected");
  selectedQuickViewColor[productId] = btn.dataset.color;
  const addBtn = document.getElementById("qv-add-btn-" + productId);
  if (addBtn) {
    addBtn.disabled = false;
    addBtn.innerText = "Add to Bag (" + btn.dataset.color + ")";
  }
  // Switch main image to color-specific image if available
  const p = products.find(prod => prod.id === productId);
  if (p) {
    const colorObj = (p.colors || []).find(c => c.name === btn.dataset.color);
    if (colorObj && colorObj.image) {
      const mainImg = document.getElementById("qv-main-image");
      if (mainImg) mainImg.src = colorObj.image;
    }
  }
};

window.removeEditVideo = function(idx) {
  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (p && p.videos && p.videos[idx]) {
    p.videos.splice(idx, 1);
    saveProducts();
    openEditProduct(id);
  }
};

window.addToCartFromQuickView = function(productId) {
  const color = selectedQuickViewColor[productId];
  if (!color) {
    showToast("Please select a color first.");
    return;
  }
  addToCart(productId, color);
  closeQuickView();
};

window.switchQvImage = function(thumb, src) {
  const mainImg = document.getElementById("qv-main-image");
  if (mainImg) mainImg.src = src;
  const row = thumb.closest(".qv-gallery-row");
  if (row) row.querySelectorAll(".qv-gallery-thumb").forEach(t => t.classList.remove("active"));
  thumb.classList.add("active");
};

// Checkout & Authentication flow
window.openCheckout = function() {
  closeCartDrawer();

  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  checkoutPaymentMethod = "card";
  populateCheckoutContactFields();
  renderCheckoutPaymentUI();
};

window.closeCheckout = function() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

function populateCheckoutContactFields() {
  const checkoutName = document.getElementById("checkout-name");
  const checkoutEmail = document.getElementById("checkout-email");
  const shipCountry = document.getElementById("ship-country");

  if (checkoutName && currentUser?.name) {
    checkoutName.value = currentUser.name;
  }
  if (checkoutEmail && currentUser?.email) {
    checkoutEmail.value = currentUser.email;
  }
  if (shipCountry && selectedCountry) {
    shipCountry.value = selectedCountry;
  }
}

function getCheckoutTotalAmount() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderCheckoutBarcodePreview() {
  const checkoutQrWrap = document.getElementById("checkout-bank-qr-wrap");
  const checkoutAmount = document.getElementById("checkout-bank-amount");
  const checkoutUpiLabel = document.getElementById("checkout-bank-upi-label");
  const activeAccount = getActivePayoutAccount();

  if (checkoutAmount) {
    checkoutAmount.innerText = formatPrice(getCheckoutTotalAmount());
  }

  if (checkoutUpiLabel) {
    if (activeAccount?.type === "googlepay") {
      checkoutUpiLabel.innerText = `Scan the QR / barcode and pay to ${activeAccount.upiId || activeAccount.accNo || "the linked UPI ID"}.`;
    } else if (activeAccount) {
      checkoutUpiLabel.innerText = `QR / barcode payments are accepted, but the active payout destination is ${getPayoutLedgerLabel(activeAccount)}.`;
    } else {
      checkoutUpiLabel.innerText = "No payout destination is configured yet.";
    }
  }

  if (!checkoutQrWrap) return;

  if (bankBarcodeImageBase64) {
    checkoutQrWrap.innerHTML = `<img src="${bankBarcodeImageBase64}" alt="Bank barcode / QR code" style="width: 100%; max-width: 240px; border-radius: 12px; object-fit: cover;">`;
  } else {
    checkoutQrWrap.innerHTML = `<span>Barcode / QR not configured yet</span>`;
  }
}

function toggleCardFieldsRequired(isRequired) {
  const cardNum = document.getElementById("card-num");
  const cardExpiry = document.getElementById("card-expiry");
  const cardCvv = document.getElementById("card-cvv");
  const cardName = document.getElementById("card-name");
  
  if (cardNum) cardNum.required = isRequired;
  if (cardExpiry) cardExpiry.required = isRequired;
  if (cardCvv) cardCvv.required = isRequired;
  if (cardName) cardName.required = isRequired;
}

function renderCheckoutPaymentUI() {
  const cardSection = document.getElementById("checkout-card-section");
  const bankSection = document.getElementById("checkout-bank-section");
  const cardBtn = document.getElementById("pay-method-card");
  const bankBtn = document.getElementById("pay-method-bank");
  const submitBtn = document.getElementById("submit-payment-btn");
  const payoutNote = document.getElementById("checkout-payout-note");

  const isBarcode = checkoutPaymentMethod === "bankbarcode";
  if (cardSection) cardSection.style.display = isBarcode ? "none" : "block";
  if (bankSection) bankSection.style.display = isBarcode ? "block" : "none";

  const isCcEnabled = isCreditCardEnabled();
  const cardFields = document.getElementById("checkout-card-fields");
  const cardDisabledMsg = document.getElementById("checkout-card-disabled-msg");

  if (!isBarcode) {
    if (isCcEnabled) {
      if (cardFields) cardFields.style.display = "block";
      if (cardDisabledMsg) cardDisabledMsg.style.display = "none";
      toggleCardFieldsRequired(true);
      if (submitBtn) submitBtn.style.display = "inline-flex";
    } else {
      if (cardFields) cardFields.style.display = "none";
      if (cardDisabledMsg) cardDisabledMsg.style.display = "block";
      toggleCardFieldsRequired(false);
      if (submitBtn) submitBtn.style.display = "none";
    }
  } else {
    toggleCardFieldsRequired(false);
    if (submitBtn) submitBtn.style.display = "none";
  }

  if (cardBtn) cardBtn.classList.toggle("active", !isBarcode);
  if (bankBtn) bankBtn.classList.toggle("active", isBarcode);

  const activeAccount = getActivePayoutAccount();
  const demoNote = document.getElementById("checkout-demo-note");
  if (payoutNote) {
    if (activeAccount && livePaymentGatewayEnabled) {
      payoutNote.innerText = `Live card payments settle through your configured payment gateway and pay out to the bank account linked there. Bank barcode / UPI still uses the uploaded QR code fallback.`;
    } else if (activeAccount) {
      payoutNote.innerText = `Payments are routed to ${getPayoutLedgerLabel(activeAccount)}.`;
    } else {
      payoutNote.innerText = "Set a primary payout destination in admin before accepting payments.";
    }
  }
  if (demoNote) {
    demoNote.innerText = livePaymentGatewayEnabled
      ? "Live mode: card payments are sent to the configured payment gateway. Bank barcode / UPI still uses the uploaded QR code."
      : "Demo mode: card payments are simulated locally. Bank barcode / UPI checkout uses the uploaded QR code. Completed orders are recorded in your admin payout ledger.";
  }

  renderCheckoutBarcodePreview();
}

window.switchCheckoutPaymentMethod = function(method) {
  checkoutPaymentMethod = method === "bankbarcode" ? "bankbarcode" : "card";
  renderCheckoutPaymentUI();
};

window.handleGuestCheckout = function(e) {
  e.preventDefault();
  const name = document.getElementById("guest-name")?.value || "Guest Customer";
  const email = document.getElementById("guest-email")?.value || "";

  currentUser = { name: name || "Guest Customer", email, isGuest: true };
  localStorage.setItem("jodhan_user", JSON.stringify(currentUser));
  updateUserSessionUI();
  closeAuthModal();
};

window.handleSignup = function(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;

  currentUser = { name: name, email: email, isGuest: false };
  localStorage.setItem("jodhan_user", JSON.stringify(currentUser));
  updateUserSessionUI();
  closeAuthModal();
};

window.handleUserLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;

  currentUser = { name: email.split('@')[0], email: email, isGuest: false };
  localStorage.setItem("jodhan_user", JSON.stringify(currentUser));
  updateUserSessionUI();
  closeAuthModal();
};

// Sign Out Customer
window.customerLogout = function() {
  currentUser = null;
  localStorage.removeItem("jodhan_user");
  updateUserSessionUI();
};

// Update header with logged-in user state
function updateUserSessionUI() {
  const container = document.getElementById("user-session-container");
  if (!container) return;

  if (currentUser) {
    container.innerHTML = `
      <span class="session-welcome">Hi, ${currentUser.name}</span>
      <button class="btn-text" onclick="customerLogout()">Logout</button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn-text" onclick="openAuthModal()">Login / Sign Up</button>
    `;
  }
}

// Auth modal helper
window.openAuthModal = function() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeAuthModal = function() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

function finalizeCheckoutPayment(paymentMethodLabel) {
  const mainContent = document.getElementById("checkout-modal-body");
  const orderNo = "JODHAN-" + Math.floor(100000 + Math.random() * 900000);
  const totalAmount = getCheckoutTotalAmount();
  const customerName = document.getElementById("checkout-name")?.value.trim() || currentUser?.name || "Guest";
  const customerEmail = document.getElementById("checkout-email")?.value.trim() || currentUser?.email || "";

  deductStockForCart();
  recordCheckoutPayout(orderNo, totalAmount);

  // Record order with pending status
  orders.unshift({
    id: "order-" + Date.now(),
    orderNo,
    amount: totalAmount,
    paymentMethod: paymentMethodLabel,
    customerName,
    customerEmail,
    items: getCheckoutLineItems(),
    status: "pending",
    createdAt: Date.now(),
    completedAt: null
  });
  saveOrders();

  if (mainContent) {
    mainContent.innerHTML = `
      <div class="checkout-success-view">
        <div class="success-icon-wrap">
          <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p class="success-subtitle">Thank you for your order at Jodhan Silk Store.</p>
        
        <div class="success-invoice-box">
          <div class="invoice-row"><span>Order Number:</span><strong>${orderNo}</strong></div>
          <div class="invoice-row"><span>Amount Paid:</span><strong>${formatPrice(totalAmount)}</strong></div>
          <div class="invoice-row"><span>Payment Method:</span><strong>${escapeHtml(paymentMethodLabel)}</strong></div>
          <div class="invoice-row"><span>Payment Status:</span><span class="invoice-paid-badge">PAID</span></div>
        </div>
        
        <p class="success-notice">A receipt and tracking details will be sent to <strong>${currentUser ? escapeHtml(currentUser.email) : "your email"}</strong> shortly.</p>
        <button class="btn-primary" onclick="completeOrderFlow()">Continue Shopping</button>
      </div>
    `;
  }
}

window.handleBankBarcodePaymentConfirm = function() {
  if (!bankBarcodeImageBase64) {
    showToast("Upload a barcode / QR code in admin before accepting bank transfer checkout.");
    return;
  }

  const checkoutName = document.getElementById("checkout-name")?.value.trim();
  const checkoutEmail = document.getElementById("checkout-email")?.value.trim();
  if (!currentUser && checkoutName && checkoutEmail) {
    currentUser = { name: checkoutName, email: checkoutEmail, isGuest: true };
    localStorage.setItem("jodhan_user", JSON.stringify(currentUser));
    updateUserSessionUI();
  }

  const orderNo = sessionStorage.getItem("jodhan_pending_order_no") || `JODHAN-${Math.floor(100000 + Math.random() * 900000)}`;
  sessionStorage.setItem("jodhan_pending_order_no", orderNo);
  sessionStorage.setItem("jodhan_pending_payment_method", "Bank Barcode / UPI");

  finalizeCheckoutPayment("Bank Barcode / UPI");
};

// Complete checkout payment mock
window.handlePaymentSubmit = async function(e) {
  e.preventDefault();

  if (checkoutPaymentMethod === "bankbarcode") {
    handleBankBarcodePaymentConfirm();
    return;
  }

  if (!isCreditCardEnabled()) {
    showToast("Credit card payments are unavailable. Please order via WhatsApp.");
    return;
  }

  const checkoutName = document.getElementById("checkout-name")?.value.trim();
  const checkoutEmail = document.getElementById("checkout-email")?.value.trim();
  if (!currentUser && checkoutName && checkoutEmail) {
    currentUser = { name: checkoutName, email: checkoutEmail, isGuest: true };
    localStorage.setItem("jodhan_user", JSON.stringify(currentUser));
    updateUserSessionUI();
  }

  sessionStorage.setItem("jodhan_pending_email", checkoutEmail || "");
  const orderNo = sessionStorage.getItem("jodhan_pending_order_no") || `JODHAN-${Math.floor(100000 + Math.random() * 900000)}`;
  sessionStorage.setItem("jodhan_pending_order_no", orderNo);
  sessionStorage.setItem("jodhan_pending_payment_method", "Credit / Debit Card");

  const payBtn = document.getElementById("submit-payment-btn");
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = `<span class="payment-spinner"></span> Processing Secure Payment...`;
  }

  await ensureLivePaymentGatewayStatus();

  if (livePaymentGatewayEnabled) {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNo,
          customer: getCheckoutCustomerPayload(),
          items: getCheckoutLineItems(),
          totalAmount: getCheckoutOrderTotal(),
          paymentMethod: "Credit / Debit Card"
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch (error) {
      console.warn("Live checkout unavailable, falling back to demo checkout.", error);
    }
  }

  setTimeout(() => {
    finalizeCheckoutPayment("Credit / Debit Card");
  }, 1200);
};

// Close checkout modal and reset cart after purchase
window.completeOrderFlow = function() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCart();
  sessionStorage.removeItem("jodhan_pending_order_no");
  sessionStorage.removeItem("jodhan_pending_payment_method");
  closeCheckout();

  // Re-evaluate structure next time modal opens (restore normal templates)
  location.reload(); 
};

// Admin authentication & login modal
window.openAdminLogin = function() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

window.closeAdminLogin = function() {
  const modal = document.getElementById("admin-login-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

window.handleAdminLogin = function(e) {
  e.preventDefault();
  const user = document.getElementById("admin-user").value.trim();
  const pass = document.getElementById("admin-pass").value.trim();
  const errorMsg = document.getElementById("admin-error-msg");

  const matchingManager = managers.find(m => m.username.toLowerCase() === user.toLowerCase() && m.password === pass && m.enabled !== false);
  const disabledManager = managers.find(m => m.username.toLowerCase() === user.toLowerCase() && m.password === pass && m.enabled === false);

  if (user.toLowerCase() === SUPER_ADMIN_USERNAME && pass === "silk_store") {
    adminMode = true;
    adminRole = "admin";
    errorMsg.style.display = "none";
    closeAdminLogin();
    activateAdminDashboard();
  } else if (disabledManager) {
    errorMsg.style.display = "block";
    errorMsg.innerText = "This manager account has been disabled by the main admin.";
  } else if (matchingManager) {
    adminMode = true;
    adminRole = "manager";
    errorMsg.style.display = "none";
    closeAdminLogin();
    activateAdminDashboard();
  } else {
    errorMsg.style.display = "block";
    errorMsg.innerText = "Invalid credentials. Try again.";
  }
};

function configureAdminDashboardTabs() {
  const isSuperAdmin = (adminRole === "admin");
  
  const btnCategories = document.getElementById("btn-tab-categories");
  const btnCountries = document.getElementById("btn-tab-countries");
  const btnBanking = document.getElementById("btn-tab-banking");
  const btnOrders = document.getElementById("btn-tab-orders");
  const btnManagers = document.getElementById("btn-tab-managers");
  
  if (btnCategories) btnCategories.style.display = isSuperAdmin ? "" : "none";
  if (btnCountries) btnCountries.style.display = isSuperAdmin ? "" : "none";
  if (btnBanking) btnBanking.style.display = isSuperAdmin ? "" : "none";
  if (btnOrders) btnOrders.style.display = isSuperAdmin ? "" : "none";
  if (btnManagers) btnManagers.style.display = isSuperAdmin ? "" : "none";

  applyManagerInventoryRestrictions();
}

// Toggles Admin Dashboard View
function activateAdminDashboard() {
  document.getElementById("customer-storefront-view").style.display = "none";
  document.getElementById("admin-dashboard-view").style.display = "block";
  window.scrollTo(0, 0);

  configureAdminDashboardTabs();

  if (adminRole === "manager") {
    switchAdminTab("inventory");
  } else {
    switchAdminTab(activeAdminTab || "inventory");
  }
}

window.exitAdminMode = function() {
  adminMode = false;
  adminRole = "guest";
  document.getElementById("admin-dashboard-view").style.display = "none";
  document.getElementById("customer-storefront-view").style.display = "block";
  window.scrollTo(0, 0);

  // Re-render user storefront products
  renderProducts();
};

// Admin Inventory Dashboard Rendering
function renderAdminProductsTable() {
  const container = document.getElementById("admin-products-list");
  if (!container) return;

  container.innerHTML = "";

  // Final safety: don't render e/p items
  const cleanProds = products.filter(p => {
    const t = (p.title || "").toLowerCase().trim();
    return t !== "e prince jodhan" && t !== "p prince jodhan" && t.indexOf("e prince jodhan") === -1 && t.indexOf("p prince jodhan") === -1;
  });
  if (cleanProds.length !== products.length) {
    products = cleanProds;
    saveProducts();
  }

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "admin-product-item scroll-animate";
    card.innerHTML = `
      <div class="admin-prod-thumb">
        <img src="${getProductImage(p)}" alt="${p.title}" onerror="handleImageError(this)">
      </div>
      <div class="admin-prod-main">
        <span class="admin-prod-cat">${p.category}</span>
        <h4 class="admin-prod-title">${p.title}</h4>
        <p class="admin-prod-desc">${p.description.substring(0, 80)}...</p>
      </div>
      <div class="admin-prod-controls">
        <div class="admin-control-group">
          <label>Price (${formatPriceLabel()})</label>
          <input type="number" class="admin-price-input" value="${p.price}" onchange="updateProductPrice('${p.id}', this.value)">
        </div>
        <div class="admin-control-group">
          <label>Colors</label>
          <button class="btn-colors" onclick="openEditProduct('${p.id}')">
            ${(p.colors || []).length} color(s)
          </button>
        </div>
        <div class="admin-control-group">
          <label>Availability</label>
          <div class="toggle-switch">
            <input type="checkbox" id="avail-toggle-${p.id}" ${p.available ? 'checked' : ''} onchange="toggleProductAvailability('${p.id}', this.checked)">
            <label for="avail-toggle-${p.id}"></label>
          </div>
        </div>
        <div class="admin-control-group">
          <label>Action</label>
          <div style="display:flex;gap:0.5rem">
            <button class="btn-edit" onclick="openEditProduct('${p.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button class="btn-delete" onclick="deleteProduct('${p.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  observeScrollAnimations();
}

// Admin Action: Update Price
window.updateProductPrice = function(id, val) {
  const newPrice = parseFloat(val);
  if (isNaN(newPrice) || newPrice < 0) return;

  const product = products.find(p => p.id === id);
  if (product) {
    product.price = newPrice;
    saveProducts();
    showToast(`Price updated for "${product.title}"`);
  }
};

// Admin Action: Toggle Availability
window.toggleProductAvailability = function(id, checked) {
  const product = products.find(p => p.id === id);
  if (product) {
    if (checked && !anyColorInStock(product.colors)) {
      showToast(`Cannot enable — all colors have 0 stock. Add stock to at least one color first.`);
      renderAdminProductsTable();
      return;
    }
    product.available = checked;
    saveProducts();
    showToast(`Availability changed for "${product.title}"`);
  }
};

// Admin Action: Delete Product
window.wipeBadItems = function() {
  const badTitles = ["e prince jodhan", "p prince jodhan"];
  const isBad = (t) => badTitles.some(b => (t || "").toLowerCase().trim().includes(b));
  // Wipe from all localStorage keys directly
  ["jodhan_products", "jodhan_cart", "jodhan_orders", "jodhan_transactions"].forEach(key => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        let data = JSON.parse(raw);
        if (Array.isArray(data)) {
          if (key === "jodhan_products") data = data.filter(p => !isBad(p.title));
          if (key === "jodhan_cart") {
            const badIds = products.filter(p => isBad(p.title)).map(p => p.id);
            data = data.filter(item => !badIds.includes(item.productId));
          }
          if (key === "jodhan_orders") {
            data = data.filter(o => !(o.items || []).some(item => isBad(item.title || item.name || "")));
          }
          localStorage.setItem(key, JSON.stringify(data));
        }
      } catch(_) {}
    }
  });
  // Also clean in-memory
  products = products.filter(p => !isBad(p.title));
  saveProducts();
  cart = cart.filter(item => !isBad(products.find(p => p.id === item.productId)?.title || ""));
  saveCart();
  renderAdminProductsTable();
  showToast("Bad items wiped.");
};

window.deleteProduct = function(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const title = product.title || "";
  if (confirm(`Are you sure you want to delete "${title}"?`)) {
    // Force multiple passes to ensure removal
    for (let pass = 0; pass < 3; pass++) {
      products = products.filter(p => p.id !== id);
    }
    saveProducts();
    // Also remove from cart if present
    cart = cart.filter(i => i.productId !== id);
    saveCart();
    updateCartBadge();

    renderAdminProductsTable();
    showToast(`"${title}" deleted.`);
  }
};

// Admin Action: Open Color Manager
let colorManagerProductId = null;
window.openColorManager = function(id) {
  colorManagerProductId = id;
  renderColorManagerUI();
  document.getElementById("color-manager-modal").classList.add("active");
};

window.closeColorManager = function() {
  document.getElementById("color-manager-modal").classList.remove("active");
  colorManagerProductId = null;
};

function renderColorManagerUI() {
  const p = products.find(prod => prod.id === colorManagerProductId);
  if (!p) return;

  const list = document.getElementById("color-manager-list");
  if (!list) return;

  const colors = p.colors || [];
  list.innerHTML = colors.map((c, i) => {
    const eid = escapeHtml(p.id);
    return `<div class="cm-row" data-pid="${eid}" data-idx="${i}">
      <span class="cm-color-dot" style="background:${getColorStyle(c)}"></span>
      <span class="cm-name">${escapeHtml(c.name)}</span>
      <input type="number" class="cm-stock" value="${c.stock || 0}" min="0" onchange="updateColorStock(this.closest('.cm-row').dataset.pid, parseInt(this.closest('.cm-row').dataset.idx), this.value)">
      <button class="btn-delete cm-remove" onclick="removeColor(this.closest('.cm-row').dataset.pid, parseInt(this.closest('.cm-row').dataset.idx))">Remove</button>
    </div>`;
  }).join("") || `<p style="color:var(--text-secondary);font-size:0.85rem">No colors added yet.</p>`;

  document.getElementById("cm-product-title").innerText = p.title;
  document.getElementById("new-color-name").value = "";
  document.getElementById("new-color-stock").value = "0";
}

window.updateColorStock = function(id, idx, val) {
  const p = products.find(prod => prod.id === id);
  if (!p || !p.colors || !p.colors[idx]) return;
  p.colors[idx].stock = Math.max(0, parseInt(val) || 0);
  recomputeProductAvailability(p);
  saveProducts();
  renderAdminProductsTable();
  renderProducts();
};

window.removeColor = function(id, idx) {
  const p = products.find(prod => prod.id === id);
  if (!p || !p.colors) return;
  const removed = p.colors[idx];
  if (!removed) return;
  if (!confirm(`Remove color "${removed.name}" from "${p.title}"?`)) return;
  p.colors.splice(idx, 1);
  recomputeProductAvailability(p);
  saveProducts();
  renderColorManagerUI();
  renderAdminProductsTable();
  renderProducts();
  showToast(`Removed "${removed.name}".`);
};

window.addProductColor = function() {
  const p = products.find(prod => prod.id === colorManagerProductId);
  if (!p) return;

  const name = document.getElementById("new-color-name").value.trim();
  const stock = parseInt(document.getElementById("new-color-stock").value) || 0;

  if (!name) { showToast("Enter a color name."); return; }
  if ((p.colors || []).some(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast("Color already exists."); return;
  }

  if (!p.colors) p.colors = [];
  p.colors.push({ name, stock });
  recomputeProductAvailability(p);
  saveProducts();
  renderColorManagerUI();
  renderAdminProductsTable();
  renderProducts();
  showToast(`Added "${name}".`);
};

// Fix quoting - use data attributes for onclick
window.updateColorStock = window.updateColorStock; // redeclare safe
window.removeColor = window.removeColor;

// Admin Action: Open Edit Product Modal
window.openEditProduct = function(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  document.getElementById("edit-prod-id").value = p.id;
  document.getElementById("edit-prod-title").value = p.title;
  document.getElementById("edit-prod-price").value = p.price;
  document.getElementById("edit-prod-category").value = p.category;
  document.getElementById("edit-prod-desc").value = p.description;

  // Show existing videos in edit modal
  window._pendingEditVideo = null;
  const videoPreview = document.getElementById("edit-video-preview");
  if (videoPreview) {
    const vids = p.videos || [];
    videoPreview.innerHTML = vids.length ? vids.map((v,i) => `<div style="position:relative;display:inline-block"><video src="${v}" controls style="max-height:100px;border-radius:6px;max-width:160px"></video><button type="button" onclick="removeEditVideo(${i})" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;border:none;background:#dc2626;color:#fff;font-size:12px;line-height:1;cursor:pointer">&times;</button></div>`).join("") : "<span style='font-size:0.8rem;color:var(--text-secondary)'>No videos</span>";
  }

  renderEditColorsList();

  document.getElementById("edit-product-modal").classList.add("active");
};

function renderEditColorsList() {
  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  const list = document.getElementById("edit-colors-list");
  if (!list) return;
  const colors = p.colors || [];
  list.innerHTML = colors.map((c, i) => {
    const rgb = c.rgb || colorNameToRgb(c.name);
    const dotBg = rgb ? `rgb(${rgb})` : getColorStyle(c);
    const colorImg = c.image || "";
    return `<div class="cm-row cm-row-expanded" data-idx="${i}">
      <div class="cm-row-main">
        <span class="cm-color-dot" style="background:${dotBg}"></span>
        <span class="cm-name">${escapeHtml(c.name)}</span>
        <input type="number" class="cm-stock" value="${c.stock || 0}" min="0" onchange="updateEditColorStock(${i}, this.value)">
        <button class="btn-delete cm-remove" onclick="removeEditColor(${i})">Remove</button>
      </div>
      <div class="cm-row-details">
        <div class="cm-rgb-row">
          <label>R</label><input type="range" min="0" max="255" value="${getRgbVal(rgb, 0)}" oninput="updateColorDotPreview(${i})" id="cr-${i}-r" class="cm-rgb-slider"><span class="cm-rgb-val" id="cr-${i}-rv">${getRgbVal(rgb, 0)}</span>
          <label>G</label><input type="range" min="0" max="255" value="${getRgbVal(rgb, 1)}" oninput="updateColorDotPreview(${i})" id="cr-${i}-g" class="cm-rgb-slider"><span class="cm-rgb-val" id="cr-${i}-gv">${getRgbVal(rgb, 1)}</span>
          <label>B</label><input type="range" min="0" max="255" value="${getRgbVal(rgb, 2)}" oninput="updateColorDotPreview(${i})" id="cr-${i}-b" class="cm-rgb-slider"><span class="cm-rgb-val" id="cr-${i}-bv">${getRgbVal(rgb, 2)}</span>
          <span class="cm-rgb-hex" id="cr-${i}-hex">${rgb ? rgbToHex(rgb) : ""}</span>
        </div>
        <div class="cm-img-row">
          <label class="cm-img-label">${colorImg ? '<img src="' + escapeHtml(colorImg) + '" class="cm-color-thumb">' : "No image"}</label>
          <input type="file" accept="image/*" onchange="uploadColorImage(${i}, this)" style="font-size:0.75rem">
          ${colorImg ? `<button class="btn-delete cm-remove" onclick="removeColorImage(${i})" style="font-size:0.7rem">X</button>` : ""}
        </div>
      </div>
    </div>`;
  }).join("") || `<p style="color:var(--text-secondary);font-size:0.85rem">No colors added yet.</p>`;
  // Initialize VS Code-style slider gradients for each color row
  colors.forEach((c, i) => {
    const rgb = (c.rgb || colorNameToRgb(c.name) || "128,128,128").split(",").map(Number);
    styleVscodeSliders(rgb[0], rgb[1], rgb[2], `cr-${i}`);
  });
  document.getElementById("edit-new-color-name").value = "";
  document.getElementById("edit-new-color-stock").value = "0";
  // Reset RGB sliders for new color
  const rSlider = document.getElementById("new-color-r");
  const gSlider = document.getElementById("new-color-g");
  const bSlider = document.getElementById("new-color-b");
  if (rSlider) { rSlider.value = "128"; gSlider.value = "128"; bSlider.value = "128"; }
  pendingNewColorImage = "";
  const imgName = document.getElementById("new-color-img-name");
  if (imgName) imgName.innerText = "";
  const imgInput = document.getElementById("new-color-image");
  if (imgInput) imgInput.value = "";
  previewNewColorDot();
}

function getRgbVal(rgb, idx) {
  if (!rgb) return idx === 0 ? 128 : idx === 1 ? 128 : 128;
  const parts = rgb.split(",").map(Number);
  return parts[idx] || 128;
}

function rgbToHex(rgb) {
  const parts = rgb.split(",").map(Number);
  return "#" + parts.map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function colorNameToRgb(name) {
  const hex = getColorCSS(name);
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
}

function styleVscodeSliders(r, g, b, prefix) {
  const ch = [
    { id: prefix + "-r", from: `rgb(0,${g},${b})`, to: `rgb(255,${g},${b})` },
    { id: prefix + "-g", from: `rgb(${r},0,${b})`, to: `rgb(${r},255,${b})` },
    { id: prefix + "-b", from: `rgb(${r},${g},0)`, to: `rgb(${r},${g},255)` }
  ];
  ch.forEach(c => {
    const el = document.getElementById(c.id);
    if (el) el.style.background = `linear-gradient(to right, ${c.from}, ${c.to})`;
  });
}

window.updateColorDotPreview = function(idx) {
  const r = document.getElementById(`cr-${idx}-r`).value;
  const g = document.getElementById(`cr-${idx}-g`).value;
  const b = document.getElementById(`cr-${idx}-b`).value;
  const dot = document.querySelector(`.cm-row[data-idx="${idx}"] .cm-color-dot`);
  if (dot) dot.style.background = `rgb(${r},${g},${b})`;
  const hex = document.getElementById(`cr-${idx}-hex`);
  if (hex) hex.innerText = rgbToHex(`${r},${g},${b}`);
  const rv = document.getElementById(`cr-${idx}-rv`);
  const gv = document.getElementById(`cr-${idx}-gv`);
  const bv = document.getElementById(`cr-${idx}-bv`);
  if (rv) rv.innerText = r; if (gv) gv.innerText = g; if (bv) bv.innerText = b;
  styleVscodeSliders(+r, +g, +b, `cr-${idx}`);

  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (p && p.colors && p.colors[idx]) {
    p.colors[idx].rgb = `${r},${g},${b}`;
  }
};

window.uploadColorImage = function(idx, input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const id = document.getElementById("edit-prod-id").value;
    const p = products.find(prod => prod.id === id);
    if (p && p.colors && p.colors[idx]) {
      p.colors[idx].image = e.target.result;
      renderEditColorsList();
    }
  };
  reader.readAsDataURL(file);
};

window.removeColorImage = function(idx) {
  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (p && p.colors && p.colors[idx]) {
    p.colors[idx].image = "";
    renderEditColorsList();
  }
};

window.updateEditColorStock = function(idx, val) {
  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (!p || !p.colors || !p.colors[idx]) return;
  p.colors[idx].stock = Math.max(0, parseInt(val) || 0);
  recomputeProductAvailability(p);
};

window.removeEditColor = function(idx) {
  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (!p || !p.colors) return;
  const removed = p.colors[idx];
  if (!removed || !confirm(`Remove color "${removed.name}"?`)) return;
  p.colors.splice(idx, 1);
  recomputeProductAvailability(p);
  renderEditColorsList();
};

window.previewNewColorDot = function() {
  const r = document.getElementById("new-color-r").value;
  const g = document.getElementById("new-color-g").value;
  const b = document.getElementById("new-color-b").value;
  const dot = document.getElementById("new-color-dot");
  const hex = document.getElementById("new-color-hex");
  if (dot) dot.style.background = `rgb(${r},${g},${b})`;
  if (hex) hex.innerText = rgbToHex(`${r},${g},${b}`);
  const rv = document.getElementById("new-color-rv");
  const gv = document.getElementById("new-color-gv");
  const bv = document.getElementById("new-color-bv");
  if (rv) rv.innerText = r; if (gv) gv.innerText = g; if (bv) bv.innerText = b;
  styleVscodeSliders(+r, +g, +b, "new-color");
};

let pendingNewColorImage = "";

document.addEventListener("DOMContentLoaded", function() {
  const imgInput = document.getElementById("new-color-image");
  if (imgInput) {
    imgInput.addEventListener("change", function() {
      const file = this.files && this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          pendingNewColorImage = e.target.result;
          document.getElementById("new-color-img-name").innerText = file.name;
        };
        reader.readAsDataURL(file);
      } else {
        pendingNewColorImage = "";
        document.getElementById("new-color-img-name").innerText = "";
      }
    });
  }
});

window.addEditColor = function() {
  const id = document.getElementById("edit-prod-id").value;
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  const name = document.getElementById("edit-new-color-name").value.trim();
  const stock = parseInt(document.getElementById("edit-new-color-stock").value) || 0;
  const r = document.getElementById("new-color-r").value;
  const g = document.getElementById("new-color-g").value;
  const b = document.getElementById("new-color-b").value;
  const rgb = `${r},${g},${b}`;
  if (!name) { showToast("Enter a color name."); return; }
  if ((p.colors || []).some(c => c.name.toLowerCase() === name.toLowerCase())) {
    showToast("Color already exists."); return;
  }
  if (!p.colors) p.colors = [];
  p.colors.push({ name, stock, rgb, image: pendingNewColorImage || "" });
  pendingNewColorImage = "";
  document.getElementById("new-color-img-name").innerText = "";
  document.getElementById("new-color-image").value = "";
  recomputeProductAvailability(p);
  renderEditColorsList();
};

// Admin Action: Save Edit Product
window.handleEditProduct = function(e) {
  e.preventDefault();
  const id = document.getElementById("edit-prod-id").value;
  const title = document.getElementById("edit-prod-title").value;
  const price = parseFloat(document.getElementById("edit-prod-price").value);
  const category = document.getElementById("edit-prod-category").value;
  const description = document.getElementById("edit-prod-desc").value;

  if (!title || isNaN(price) || !category || !description) {
    alert("Please fill out all required fields.");
    return;
  }

  const product = products.find(p => p.id === id);
  if (product) {
    product.title = title;
    product.price = price;
    product.category = category;
    product.description = description;
    if (window._pendingEditVideo) {
      if (!product.videos) product.videos = [];
      product.videos.push(window._pendingEditVideo);
      window._pendingEditVideo = null;
    }
    recomputeProductAvailability(product);
    saveProducts();
    renderAdminProductsTable();
    renderProducts();
    closeEditProduct();
    showToast(`"${title}" updated successfully.`);
  }
};

window.closeEditProduct = function() {
  document.getElementById("edit-product-modal").classList.remove("active");
};

// Handle admin photo upload preview & Base64 storage
let uploadedImages = [];
let uploadedVideos = [];

function setupPhotoUpload() {
  const fileInput = document.getElementById("new-prod-image");
  const preview = document.getElementById("image-upload-preview");
  if (!fileInput) return;

  fileInput.addEventListener("change", function() {
    const files = Array.from(this.files);
    if (files.length === 0) {
      uploadedImages = [];
      preview.innerHTML = `<span>No images selected</span>`;
      return;
    }
    let loaded = 0;
    uploadedImages = [];
    preview.innerHTML = `<div class="multi-image-thumbs">`;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        uploadedImages.push(e.target.result);
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.cssText = "width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid var(--border-color)";
        preview.querySelector(".multi-image-thumbs").appendChild(img);
        loaded++;
        if (loaded === files.length) {
          preview.innerHTML += `<span style="font-size:0.8rem;color:var(--text-secondary)">${loaded} image(s) selected</span>`;
        }
      };
      reader.readAsDataURL(file);
    });
  });
}

function fixVideoMime(dataUrl) {
  // Replace unsupported video/quicktime with video/mp4 (both use H.264)
  return dataUrl.replace("video/quicktime", "video/mp4");
}

function setupVideoUpload() {
  const fileInput = document.getElementById("new-prod-video");
  const preview = document.getElementById("video-upload-preview");
  if (!fileInput) return;
  fileInput.addEventListener("change", function() {
    const file = this.files && this.files[0];
    if (!file) { uploadedVideos = []; preview.innerHTML = "<span>No videos selected</span>"; return; }
    if (file.size > 15 * 1024 * 1024) { alert("Video too large. Max 15MB."); this.value = ""; return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      const fixed = fixVideoMime(e.target.result);
      uploadedVideos = [fixed];
      preview.innerHTML = `<video src="${fixed}" controls playsinline style="max-height:120px;border-radius:6px"></video><span style="font-size:0.8rem;color:var(--text-secondary);margin-left:0.5rem">${file.name}</span>`;
    };
    reader.readAsDataURL(file);
  });
}

function setupEditVideoUpload() {
  const fileInput = document.getElementById("edit-prod-video");
  if (!fileInput) return;
  fileInput.addEventListener("change", function() {
    const file = this.files && this.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { alert("Video too large. Max 15MB."); this.value = ""; return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      const fixed = fixVideoMime(e.target.result);
      window._pendingEditVideo = fixed;
      const preview = document.getElementById("edit-video-preview");
      if (preview) preview.innerHTML = `<video src="${fixed}" controls playsinline style="max-height:100px;border-radius:6px"></video><button type="button" onclick="document.getElementById('edit-video-preview').innerHTML='';window._pendingEditVideo=null" style="font-size:0.7rem;padding:0.2rem 0.5rem">Remove</button>`;
    };
    reader.readAsDataURL(file);
  });
}

function setupBankBarcodeUpload() {
  const fileInput = document.getElementById("bank-qr-upload");
  const preview = document.getElementById("bank-qr-preview");
  if (!fileInput || !preview) return;

  if (bankBarcodeImageBase64) {
    preview.innerHTML = `<img src="${bankBarcodeImageBase64}" alt="Bank barcode / QR preview" style="max-height: 150px; border-radius: 6px;">`;
  }

  fileInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        bankBarcodeImageBase64 = e.target.result;
        saveBankBarcodeCode();
        preview.innerHTML = `<img src="${bankBarcodeImageBase64}" alt="Bank barcode / QR preview" style="max-height: 150px; border-radius: 6px;">`;
        renderCheckoutPaymentUI();
      };
      reader.readAsDataURL(file);
    } else {
      bankBarcodeImageBase64 = "";
      saveBankBarcodeCode();
      preview.innerHTML = `<span>No barcode / QR uploaded yet</span>`;
      renderCheckoutPaymentUI();
    }
  });
}

// Admin Action: Create Product
window.handleCreateProduct = function(e) {
  e.preventDefault();
  const title = document.getElementById("new-prod-title").value;
  const price = parseFloat(document.getElementById("new-prod-price").value);
  const category = document.getElementById("new-prod-category").value;
  const description = document.getElementById("new-prod-desc").value;
  const available = document.getElementById("new-prod-avail").checked;

  if (!title || isNaN(price) || !category || !description) {
    alert("Please fill out all required fields.");
    return;
  }

  // Use uploaded images or fallback
  const images = uploadedImages.length > 0 ? uploadedImages : ["https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=600&auto=format&fit=crop&q=80"];
  const videos = uploadedVideos.length > 0 ? [...uploadedVideos] : [];

  const newProduct = {
    id: "prod-" + Date.now(),
    title,
    price,
    category,
    description,
    colors: [{ name: "Default", stock: 0 }],
    available,
    images,
    videos
  };

  products.unshift(newProduct); // Add to beginning of array
  saveProducts();

  // Reset form
  document.getElementById("add-product-form").reset();
  uploadedImages = [];
  uploadedVideos = [];
  document.getElementById("image-upload-preview").innerHTML = `<span>No images selected</span>`;
  document.getElementById("video-upload-preview").innerHTML = `<span>No videos selected</span>`;

  // Re-render
  renderAdminProductsTable();
  showToast("Product listing created successfully!");
};

// Notification Toast Alert
function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// Scroll animation trigger - Intersection Observer
function observeScrollAnimations() {
  const elements = document.querySelectorAll(".scroll-animate");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, {
    threshold: 0.05
  });

  elements.forEach(el => observer.observe(el));
}

// Event Listeners setup
function setupEventListeners() {
  // Close modals clicking outside card
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach(modal => {
    modal.addEventListener("click", function(e) {
      if (e.target === this) {
        if (this.id === "quick-view-modal") closeQuickView();
        if (this.id === "checkout-modal") closeCheckout();
        if (this.id === "admin-login-modal") closeAdminLogin();
        if (this.id === "country-gate-overlay") {
          const closeBtn = document.getElementById("country-gate-close-btn");
          if (closeBtn && closeBtn.style.display !== "none") closeCountryGate();
        }
      }
    });
  });

  // Admin Image Upload
  setupPhotoUpload();
  setupVideoUpload();
  setupEditVideoUpload();
  setupBankBarcodeUpload();
}

// Scroll to section helper
window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Close dropdown if open
  document.querySelectorAll(".nav-dropdown-menu.show").forEach(m => m.classList.remove("show"));
};

// Search filter
let searchQuery = "";
window.filterProductsBySearch = function(query) {
  searchQuery = query.toLowerCase().trim();
  renderProducts();
};

// Render new arrivals (first 4 products)
function renderNewArrivals() {
  const grid = document.getElementById("new-arrivals-grid");
  if (!grid) return;
  const arrivals = products.slice(0, 4);
  if (arrivals.length === 0) { grid.innerHTML = ""; return; }

  grid.innerHTML = arrivals.map(p => {
    const totalStock = colorTotalStock(p.colors);
    const inStock = totalStock > 0;
    const colorSwatches = (p.colors || []).map(c => {
      return `<span class="color-swatch" style="background:${getColorStyle(c)}" title="${escapeHtml(c.name)}"></span>`;
    }).join("");
    return `
      <div class="product-card scroll-animate">
        <div class="product-image-container">
          <img class="product-img" src="${getProductImage(p)}" alt="${p.title}" onerror="handleImageError(this)">
          <span class="stock-tag ${inStock ? 'in-stock' : 'out-of-stock'}">${inStock ? 'New' : 'Out of Stock'}</span>
          <button class="quick-view-btn" onclick="openQuickView('${p.id}')">Quick View</button>
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span class="product-cat">${p.category}</span>
          <span class="product-price">${formatPrice(p.price)}</span>
          </div>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-colors-row">${colorSwatches}</div>
          <div class="product-actions">
            <button class="add-to-cart-btn btn-primary" onclick="openQuickView('${p.id}')" ${!inStock ? 'disabled' : ''}>
              ${inStock ? 'Choose Color' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
  observeScrollAnimations();
}

// Launch application on DOM load
document.addEventListener("DOMContentLoaded", initApp);













