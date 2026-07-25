const express = require('express');
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 4242;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const paymentsFile = path.join(__dirname, 'payments.json');
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


