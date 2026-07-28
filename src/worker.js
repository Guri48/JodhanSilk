// Jodhan Silk Store - Auth API Worker

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    const db = env.jodhan_auth;
    const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};

    try {
      if (path === '/api/auth/admin/login' && request.method === 'POST') {
        const { username, password } = body;
        if (!username || !password) return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400, headers });
        const res = await db.prepare('SELECT id, password FROM admin_users WHERE username = ?').bind(username).first();
        if (!res || res.password !== password) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers });
        const token = crypto.randomUUID();
        await db.prepare('INSERT INTO sessions (token, user_type, user_id) VALUES (?, ?, ?)').bind(token, 'admin', res.id).run();
        return new Response(JSON.stringify({ success: true, token, username }), { headers });
      }

      if (path === '/api/auth/customer/register' && request.method === 'POST') {
        const { name, email, password } = body;
        if (!name || !email || !password) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers });
        const existing = await db.prepare('SELECT id FROM customer_users WHERE email = ?').bind(email).first();
        if (existing) return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409, headers });
        const res = await db.prepare('INSERT INTO customer_users (name, email, password) VALUES (?, ?, ?)').bind(name, email, password).run();
        const token = crypto.randomUUID();
        await db.prepare('INSERT INTO sessions (token, user_type, user_id) VALUES (?, ?, ?)').bind(token, 'customer', res.meta.last_row_id).run();
        return new Response(JSON.stringify({ success: true, token, name, email }), { headers });
      }

      if (path === '/api/auth/customer/login' && request.method === 'POST') {
        const { email, password } = body;
        if (!email || !password) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers });
        const res = await db.prepare('SELECT id, name, email, password FROM customer_users WHERE email = ?').bind(email).first();
        if (!res || res.password !== password) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers });
        const token = crypto.randomUUID();
        await db.prepare('INSERT INTO sessions (token, user_type, user_id) VALUES (?, ?, ?)').bind(token, 'customer', res.id).run();
        return new Response(JSON.stringify({ success: true, token, name: res.name, email: res.email }), { headers });
      }

      if (path === '/api/auth/verify' && request.method === 'GET') {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) return new Response(JSON.stringify({ valid: false }), { status: 401, headers });
        const session = await db.prepare('SELECT user_type, user_id FROM sessions WHERE token = ?').bind(token).first();
        if (!session) return new Response(JSON.stringify({ valid: false }), { status: 401, headers });
        if (session.user_type === 'admin') {
          const user = await db.prepare('SELECT username FROM admin_users WHERE id = ?').bind(session.user_id).first();
          return new Response(JSON.stringify({ valid: true, type: 'admin', username: user?.username }), { headers });
        }
        const user = await db.prepare('SELECT name, email FROM customer_users WHERE id = ?').bind(session.user_id).first();
        return new Response(JSON.stringify({ valid: true, type: 'customer', name: user?.name, email: user?.email }), { headers });
      }

      // Serve static assets (index.html, app.js, etc.)
      return env.ASSETS.fetch(request);
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
