const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 4242;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const paymentsFile = path.join(__dirname, 'payments.json');
const authFile = path.join(__dirname, 'auth.json');
const publicDir = __dirname;

function loadPayments() {
  try {
    if (!fs.existsSync(paymentsFile)) {
      fs.writeFileSync(paymentsFile, JSON.stringify([], null, 2));
      return [];
    }

    const raw = fs.readFileSync(paymentsFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePayments(payments) {
  fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
}

function loadAuth() {
  try {
    if (!fs.existsSync(authFile)) {
      const defaultAuth = {
        admin_users: [{ id: 1, username: 'prince', password: 'silk_store' }],
        customer_users: [],
        sessions: []
      };
      fs.writeFileSync(authFile, JSON.stringify(defaultAuth, null, 2));
      return defaultAuth;
    }
    return JSON.parse(fs.readFileSync(authFile, 'utf8'));
  } catch {
    return { admin_users: [{ id: 1, username: 'prince', password: 'silk_store' }], customer_users: [], sessions: [] };
  }
}

function saveAuth(auth) {
  fs.writeFileSync(authFile, JSON.stringify(auth, null, 2));
}

function recordPayment(session, source = 'webhook') {
  const payments = loadPayments();
  const existingIndex = payments.findIndex(item => item.checkoutSessionId === session.id);
  const record = {
    checkoutSessionId: session.id,
    orderNo: session.metadata?.orderNo || '',
    amountTotal: session.amount_total || 0,
    currency: session.currency || 'inr',
    paymentStatus: session.payment_status || 'unpaid',
    paymentMethod: session.metadata?.paymentMethod || 'Credit / Debit Card',
    customerName: session.metadata?.customerName || '',
    customerEmail: session.customer_details?.email || session.customer_email || session.metadata?.customerEmail || '',
    shippingCountry: session.metadata?.shippingCountry || '',
    source,
    recordedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    payments[existingIndex] = { ...payments[existingIndex], ...record };
  } else {
    payments.unshift(record);
  }

  savePayments(payments);
}

function stripeWebhookHandler(req, res) {
  if (!stripe || !stripeWebhookSecret) {
    return res.status(503).send('Webhook not configured.');
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);
  } catch (error) {
    return res.status(400).send(`Webhook signature verification failed: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    recordPayment(event.data.object, 'webhook');
  }

  res.json({ received: true });
}

app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
app.post('/api/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json({ limit: '1mb' }));

// ---- Auth API (local JSON-backed, mirrors D1 Worker endpoints) ----

app.post('/api/auth/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
  const auth = loadAuth();
  const user = auth.admin_users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = crypto.randomUUID();
  auth.sessions.push({ token, user_type: 'admin', user_id: user.id });
  saveAuth(auth);
  res.json({ success: true, token, username });
});

app.post('/api/auth/customer/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const auth = loadAuth();
  if (auth.customer_users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
  const id = auth.customer_users.length > 0 ? Math.max(...auth.customer_users.map(u => u.id)) + 1 : 1;
  auth.customer_users.push({ id, name, email, password });
  const token = crypto.randomUUID();
  auth.sessions.push({ token, user_type: 'customer', user_id: id });
  saveAuth(auth);
  res.json({ success: true, token, name, email });
});

app.post('/api/auth/customer/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const auth = loadAuth();
  const user = auth.customer_users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = crypto.randomUUID();
  auth.sessions.push({ token, user_type: 'customer', user_id: user.id });
  saveAuth(auth);
  res.json({ success: true, token, name: user.name, email: user.email });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ valid: false });
  const auth = loadAuth();
  const session = auth.sessions.find(s => s.token === token);
  if (!session) return res.status(401).json({ valid: false });
  if (session.user_type === 'admin') {
    const user = auth.admin_users.find(u => u.id === session.user_id);
    return res.json({ valid: true, type: 'admin', username: user?.username });
  }
  const user = auth.customer_users.find(u => u.id === session.user_id);
  res.json({ valid: true, type: 'customer', name: user?.name, email: user?.email });
});

// ----

app.use(express.static(publicDir));

app.get('/api/payment-config', (req, res) => {
  res.json({
    livePaymentsEnabled: Boolean(stripe),
    currency: 'inr'
  });
});

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured on the server.' });
  }

  const { orderNo, customer, items, paymentMethod } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required.' });
  }

  const lineItems = items.map(item => ({
    quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.title || 'Store product'
      },
      unit_amount: Math.max(0, Math.round(Number(item.price || 0) * 100))
    }
  }));

  const forwardedProto = (req.headers['x-forwarded-proto'] || 'http').toString().split(',')[0].trim();
  const baseUrl = `${forwardedProto}://${req.get('host')}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customer?.email || undefined,
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      metadata: {
        orderNo: orderNo || '',
        paymentMethod: paymentMethod || 'Credit / Debit Card',
        customerName: customer?.name || '',
        customerEmail: customer?.email || '',
        shippingCountry: customer?.shippingCountry || ''
      }
    });

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not create checkout session.' });
  }
});

app.get('/api/checkout-session-status', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe is not configured on the server.' });
  }

  const sessionId = String(req.query.session_id || '').trim();
  if (!sessionId) {
    return res.status(400).json({ error: 'session_id is required.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      checkoutSessionId: session.id,
      orderNo: session.metadata?.orderNo || '',
      paymentStatus: session.payment_status || 'unpaid',
      amountTotal: session.amount_total || 0,
      currency: session.currency || 'inr',
      paymentMethod: session.metadata?.paymentMethod || 'Credit / Debit Card',
      customerEmail: session.customer_details?.email || session.customer_email || session.metadata?.customerEmail || ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not load checkout session.' });
  }
});

app.get('/api/payments', (req, res) => {
  res.json({ payments: loadPayments() });
});

app.listen(port, () => {
  console.log(`Jodhan Silk Store server listening on http://localhost:${port}`);
});


