export default async function handler(req: any, res: any) {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || '';

  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge as string);
    } else {
      res.status(403).send('Forbidden');
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = req.body as any;
      // Minimal safe processing: acknowledge receipt
      // Optionally, you can parse messages and statuses here and forward to your analytics
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      res.status(200).json({ status: 'ok' });
    }
    return;
  }

  res.status(405).send('Method Not Allowed');
}
