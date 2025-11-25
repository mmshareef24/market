import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// WhatsApp webhook verification (GET)
app.get('/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token && challenge) {
    if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }
  res.status(400).json({ error: 'Invalid verification request' });
});

// WhatsApp webhook receiver (POST)
app.post('/webhooks/whatsapp', (req, res) => {
  // Minimal acknowledgment without logging sensitive payloads
  res.status(200).json({ received: true });
});

// Server-side WhatsApp send using permanent token from env
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phoneNumberId, to, text } = req.body || {};
    if (!phoneNumberId || !to || !text) {
      return res.status(400).json({ error: 'Missing phoneNumberId, to, or text' });
    }
    const token = process.env.WHATSAPP_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Server token not configured' });
    }
    const graphRes = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text }
      })
    });
    const body = await graphRes.text();
    if (!graphRes.ok) {
      return res.status(graphRes.status).json({ error: body });
    }
    let data;
    try { data = JSON.parse(body); } catch { data = { raw: body }; }
    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ error: 'Network error' });
  }
});

app.post('/api/whatsapp/sendTemplate', async (req, res) => {
  try {
    const { phoneNumberId, to, name, languageCode, variables } = req.body || {};
    if (!phoneNumberId || !to || !name || !languageCode) {
      return res.status(400).json({ error: 'Missing phoneNumberId, to, name or languageCode' });
    }
    const token = process.env.WHATSAPP_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Server token not configured' });
    }
    const components = variables && Array.isArray(variables) && variables.length > 0
      ? [{ type: 'body', parameters: variables.map((t) => ({ type: 'text', text: String(t) })) }]
      : undefined;
    const graphRes = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name,
          language: { code: languageCode },
          ...(components ? { components } : {})
        }
      })
    });
    const body = await graphRes.text();
    if (!graphRes.ok) return res.status(graphRes.status).json({ error: body });
    let data;
    try { data = JSON.parse(body); } catch { data = { raw: body }; }
    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ error: 'Network error' });
  }
});

// Facebook/Instagram identity test via server
app.post('/api/graph/me', async (req, res) => {
  try {
    const { token } = req.body || {};
    const accessToken = token || process.env.FB_ACCESS_TOKEN || process.env.IG_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(400).json({ error: 'No access token provided or configured' });
    }
    const r = await fetch('https://graph.facebook.com/v20.0/me?fields=id,name', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const body = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: body });
    return res.status(200).json(JSON.parse(body));
  } catch (e) {
    return res.status(500).json({ error: 'Network error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
