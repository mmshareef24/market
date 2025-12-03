import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '../../components/Button';
import { DashboardContext } from '../../types';
import { getEnvToken, getPhoneNumbers, sendTextMessage } from '../../services/whatsappService';
import { MessageCircle, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const WhatsAppConnector: React.FC = () => {
  const { plan, isAdmin } = useOutletContext<DashboardContext>();
  const isStarter = plan === 'Starter' && !isAdmin;

  const [wabaId, setWabaId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [status, setStatus] = useState<'disconnected' | 'connected'>('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [numbers, setNumbers] = useState<any[]>([]);
  const [testTo, setTestTo] = useState('');
  const [testBody, setTestBody] = useState('Hello from MarketBridge AI');
  const [result, setResult] = useState<string>('');

  const effectiveToken = tokenInput || getEnvToken();

  useEffect(() => {
    if (effectiveToken && wabaId) {
      setStatus('connected');
    } else {
      setStatus('disconnected');
    }
  }, [effectiveToken, wabaId]);

  const handleFetchNumbers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getPhoneNumbers(wabaId, effectiveToken);
      const arr = Array.isArray(data?.data) ? data.data : [];
      setNumbers(arr);
      if (arr[0]?.id) setPhoneNumberId(arr[0].id);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch phone numbers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!isAdmin) {
      alert('Only admins can send test messages');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult('');
    try {
      const resp = await sendTextMessage(phoneNumberId, testTo, testBody, effectiveToken);
      setResult(JSON.stringify(resp));
    } catch (e: any) {
      setError(e?.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp API Connector</h1>
        {status === 'connected' ? (
          <span className="inline-flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4" /> Connected</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-slate-500 text-sm">Disconnected</span>
        )}
      </div>

      {isStarter && (
        <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4" /> Some features require upgrade. Admin bypass enabled.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-bold">Connection</h2>
          <div className="space-y-3">
            <input
              value={wabaId}
              onChange={(e) => setWabaId(e.target.value)}
              placeholder="WhatsApp Business Account ID"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
            />
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Access Token (temporary)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
              type="password"
            />
            <Button variant="outline" onClick={handleFetchNumbers} isLoading={isLoading} disabled={!effectiveToken || !wabaId}>
              Fetch Phone Numbers
            </Button>
            {numbers.length > 0 && (
              <select value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
                {numbers.map((n) => (
                  <option key={n.id} value={n.id}>{n.display_phone_number || n.verified_name || n.id}</option>
                ))}
              </select>
            )}
            {error && (<div className="text-sm text-red-600">{error}</div>)}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="font-bold">Send Test Message</h2>
          <div className="space-y-3">
            <input
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="Destination WhatsApp Number (E.164)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
            />
            <textarea
              value={testBody}
              onChange={(e) => setTestBody(e.target.value)}
              placeholder="Message text"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded h-24"
            />
            <Button onClick={handleSendTest} isLoading={isLoading} disabled={!phoneNumberId || !testTo || !effectiveToken}>
              Send Test
            </Button>
            {result && (<pre className="text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded overflow-auto max-h-40">{result}</pre>)}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> Do not store tokens in code. Use environment variables in deployment.
      </div>
    </div>
  );
};
