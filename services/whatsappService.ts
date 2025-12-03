export const getEnvToken = () => (import.meta as any).env?.VITE_WHATSAPP_TOKEN || '';

export const getPhoneNumbers = async (wabaId: string, token: string) => {
  const url = `https://graph.facebook.com/v20.0/${wabaId}/phone_numbers`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Failed to fetch phone numbers');
  return res.json();
};

export const sendTextMessage = async (
  phoneNumberId: string,
  to: string,
  body: string,
  token: string
) => {
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
};
