import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '../../components/Button';
import { DashboardContext } from '../../types';
import { MessageCircle, Shield, KeyRound, Link as LinkIcon, CheckCircle, XCircle, Lock, Sparkles } from 'lucide-react';
import { UpgradeModal } from '../../components/UpgradeModal';

export const WhatsAppConnector: React.FC = () => {
  const { plan } = useOutletContext<DashboardContext>();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [testTo, setTestTo] = useState('');
  const [testMessage, setTestMessage] = useState('Hello from MarketBridge');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pn = sessionStorage.getItem('mb_whatsapp_phone') || '';
    const wh = sessionStorage.getItem('mb_whatsapp_webhook') || '';
    const vt = sessionStorage.getItem('mb_whatsapp_verify') || '';
    setPhoneNumberId(pn);
    setWebhookUrl(wh);
    setVerifyToken(vt);
    if (plan === 'Starter') setShowUpgrade(true);
  }, [plan]);

  const saveSettings = () => {
    sessionStorage.setItem('mb_whatsapp_phone', phoneNumberId);
    sessionStorage.setItem('mb_whatsapp_webhook', webhookUrl);
    sessionStorage.setItem('mb_whatsapp_verify', verifyToken);
  };

  const sendTest = async () => {
    setIsSending(true);
    setResult(null);
    setError(null);
    try {
      if (!phoneNumberId || !testTo || !testMessage) {
        setError('Please fill phone number ID, recipient, and message');
        setIsSending(false);
        return;
      }
      if (dryRun) {
        await new Promise(r => setTimeout(r, 800));
        setResult('Simulated send succeeded');
        setIsSending(false);
        return;
      }
      if (!apiToken) {
        setError('API token is required for live send');
        setIsSending(false);
        return;
      }
      const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: testTo,
          type: 'text',
          text: { body: testMessage }
        })
      });
      if (!res.ok) {
        const txt = await res.text();
        setError(`Error ${res.status}: ${txt}`);
        setIsSending(false);
        return;
      }
      const data = await res.json();
      setResult(`Message id: ${data.messages?.[0]?.id || 'sent'}`);
    } catch (e: any) {
      setError('Network error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {showUpgrade && (
        <UpgradeModal feature={'WhatsApp API Connector'} onClose={() => setShowUpgrade(false)} />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="w-6 h-6 text-green-500" /> WhatsApp API Connector</h1>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">Available on Growth and Enterprise</div>
        </div>
      </div>

      <div className={`grid md:grid-cols-2 gap-6 ${plan === 'Starter' ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold">Credentials</h2>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number ID</label>
            <input value={phoneNumberId} onChange={e => setPhoneNumberId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="123456789012345" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Webhook URL</label>
            <div className="flex gap-2">
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="https://yourapp.com/webhooks/whatsapp" />
              <Button variant="outline"><LinkIcon className="w-4 h-4 mr-2" /> Copy</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Verify Token</label>
            <input value={verifyToken} onChange={e => setVerifyToken(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="your-verify-token" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Permanent Token</label>
            <div className="flex gap-2">
              <input type={showToken ? 'text' : 'password'} value={apiToken} onChange={e => setApiToken(e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="Enter token (not saved)" />
              <Button variant="outline" onClick={() => setShowToken(s => !s)}><KeyRound className="w-4 h-4 mr-2" /> {showToken ? 'Hide' : 'Show'}</Button>
            </div>
            <div className="text-xs text-slate-500 mt-1">Token is not stored.</div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveSettings}>Save</Button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-semibold">Test Message</h2>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} /> Dry run
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recipient</label>
            <input value={testTo} onChange={e => setTestTo(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="E.164 format, e.g., 15551234567" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea value={testMessage} onChange={e => setTestMessage(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 h-24" />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={sendTest} isLoading={isSending} disabled={!phoneNumberId || !testTo || !testMessage}>{dryRun ? 'Simulate Send' : 'Send'}</Button>
            {result && (
              <div className="inline-flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" /> {result}</div>
            )}
            {error && (
              <div className="inline-flex items-center gap-2 text-red-600"><XCircle className="w-4 h-4" /> {error}</div>
            )}
          </div>
        </div>
      </div>

      {plan === 'Starter' && (
        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-yellow-600" />
          <span className="text-sm">Upgrade to Growth to enable the connector.</span>
        </div>
      )}
    </div>
  );
};

