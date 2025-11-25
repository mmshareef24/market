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
  const [mode, setMode] = useState<'text' | 'template'>('text');
  const [templateName, setTemplateName] = useState('');
  const [templateLang, setTemplateLang] = useState('en_US');
  const [templateVars, setTemplateVars] = useState<string[]>(['', '']);
  const [serverAvailable, setServerAvailable] = useState<boolean | null>(null);
  const [apiBase, setApiBase] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pn = localStorage.getItem('mb_whatsapp_phone') || sessionStorage.getItem('mb_whatsapp_phone') || '';
    const wh = localStorage.getItem('mb_whatsapp_webhook') || sessionStorage.getItem('mb_whatsapp_webhook') || '';
    const vt = localStorage.getItem('mb_whatsapp_verify') || sessionStorage.getItem('mb_whatsapp_verify') || '';
    setPhoneNumberId(pn);
    setWebhookUrl(wh);
    setVerifyToken(vt);
    if (plan === 'Starter') setShowUpgrade(true);
    fetch('/api/health')
      .then(r => { setServerAvailable(r.ok); if (r.ok) setApiBase(''); })
      .catch(() => { setServerAvailable(false); setApiBase('http://localhost:3001'); });
  }, [plan]);

  const saveSettings = () => {
    localStorage.setItem('mb_whatsapp_phone', phoneNumberId);
    localStorage.setItem('mb_whatsapp_webhook', webhookUrl);
    localStorage.setItem('mb_whatsapp_verify', verifyToken);
  };

  const sendTest = async () => {
    setIsSending(true);
    setResult(null);
    setError(null);
    try {
      const e164 = /^\+?[1-9]\d{6,14}$/;
      if (!phoneNumberId || !testTo || (mode === 'text' && !testMessage) || (mode === 'template' && !templateName)) {
        setError('Fill required fields');
        setIsSending(false);
        return;
      }
      if (dryRun) {
        await new Promise(r => setTimeout(r, 800));
        setResult('Simulated send succeeded');
        setIsSending(false);
        return;
      }
      let res: Response;
      if (mode === 'text') {
        if (!apiToken) {
          res = await fetch(`${apiBase}/api/whatsapp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumberId, to: testTo, text: testMessage })
          });
        } else {
          res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
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
        }
      } else {
        if (!apiToken) {
          res = await fetch(`${apiBase}/api/whatsapp/sendTemplate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumberId, to: testTo, name: templateName, languageCode: templateLang, variables: templateVars.filter(v => v) })
          });
        } else {
          const components = templateVars.filter(v => v).length > 0 ? [{ type: 'body', parameters: templateVars.filter(v => v).map(t => ({ type: 'text', text: t })) }] : undefined;
          res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: testTo,
              type: 'template',
              template: { name: templateName, language: { code: templateLang }, ...(components ? { components } : {}) }
            })
          });
        }
      }
      if (!res.ok) {
        const txt = await res.text();
        setError(`Error ${res.status}: ${txt}`);
        setIsSending(false);
        return;
      }
      const data = await res.json();
      const id = data?.data?.messages?.[0]?.id || data?.messages?.[0]?.id || 'sent';
      setResult(`Message id: ${id}`);
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
              <Button variant="outline" onClick={async () => { if (webhookUrl) { try { await navigator.clipboard.writeText(webhookUrl); setResult('Webhook URL copied'); } catch { setError('Copy failed'); } } }}><LinkIcon className="w-4 h-4 mr-2" /> Copy</Button>
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
            {serverAvailable !== null && (
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${serverAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{serverAvailable ? 'Server available' : 'Server unavailable'}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recipient</label>
            <input value={testTo} onChange={e => setTestTo(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="E.164 format, e.g., 15551234567" />
          </div>
          <div className="flex gap-2 text-xs">
            <Button variant={mode === 'text' ? 'primary' : 'ghost'} onClick={() => setMode('text')}>Text</Button>
            <Button variant={mode === 'template' ? 'primary' : 'ghost'} onClick={() => setMode('template')}>Template</Button>
          </div>
          {mode === 'text' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea value={testMessage} onChange={e => setTestMessage(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 h-24" />
            </div>
          ) : (
            <div className="grid gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Template Name</label>
                <input value={templateName} onChange={e => setTemplateName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="template_name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language Code</label>
                <input value={templateLang} onChange={e => setTemplateLang(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder="en_US" />
              </div>
              <div className="grid gap-2">
                {templateVars.map((v, idx) => (
                  <input key={idx} value={v} onChange={e => setTemplateVars(tv => tv.map((x, i) => i === idx ? e.target.value : x))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder={`Variable ${idx + 1}`} />
                ))}
              </div>
            </div>
          )}
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
