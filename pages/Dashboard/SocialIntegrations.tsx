import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '../../components/Button';
import { DashboardContext } from '../../types';
import { Facebook, Instagram, Twitter, Linkedin, CheckCircle, XCircle, Lock, Sparkles, KeyRound, Globe } from 'lucide-react';
import { UpgradeModal } from '../../components/UpgradeModal';

type Provider = 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn';

interface ProviderConfig {
  appId?: string;
  accessToken?: string;
  pageIdOrUserId?: string;
}

export const SocialIntegrations: React.FC = () => {
  const { plan } = useOutletContext<DashboardContext>();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [configs, setConfigs] = useState<Record<Provider, ProviderConfig>>({
    Facebook: {},
    Instagram: {},
    Twitter: {},
    LinkedIn: {}
  });
  const [showToken, setShowToken] = useState<Record<Provider, boolean>>({
    Facebook: false,
    Instagram: false,
    Twitter: false,
    LinkedIn: false
  });
  const [testing, setTesting] = useState<Record<Provider, boolean>>({
    Facebook: false,
    Instagram: false,
    Twitter: false,
    LinkedIn: false
  });
  const [results, setResults] = useState<Record<Provider, string | null>>({
    Facebook: null,
    Instagram: null,
    Twitter: null,
    LinkedIn: null
  });
  const [errors, setErrors] = useState<Record<Provider, string | null>>({
    Facebook: null,
    Instagram: null,
    Twitter: null,
    LinkedIn: null
  });

  useEffect(() => {
    const saved = sessionStorage.getItem('mb_social_configs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfigs(parsed);
      } catch {}
    }
    if (plan === 'Starter') setShowUpgrade(true);
  }, [plan]);

  const save = () => {
    const toSave = { ...configs };
    Object.keys(toSave).forEach((p) => {
      const key = p as Provider;
      if (toSave[key]) delete toSave[key].accessToken;
    });
    sessionStorage.setItem('mb_social_configs', JSON.stringify(toSave));
  };

  const updateConfig = (provider: Provider, key: keyof ProviderConfig, val: string) => {
    setConfigs((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [key]: val
      }
    }));
  };

  const testProvider = async (provider: Provider) => {
    setTesting((prev) => ({ ...prev, [provider]: true }));
    setResults((prev) => ({ ...prev, [provider]: null }));
    setErrors((prev) => ({ ...prev, [provider]: null }));
    try {
      const cfg = configs[provider];
      if (provider === 'Facebook' || provider === 'Instagram') {
        if (!cfg.accessToken) {
          setErrors((prev) => ({ ...prev, [provider]: 'Access token required' }));
          return;
        }
        const res = await fetch('https://graph.facebook.com/v20.0/me?fields=id,name', {
          headers: { Authorization: `Bearer ${cfg.accessToken}` }
        });
        if (!res.ok) {
          const txt = await res.text();
          setErrors((prev) => ({ ...prev, [provider]: `Error ${res.status}: ${txt}` }));
        } else {
          const json = await res.json();
          setResults((prev) => ({ ...prev, [provider]: `Connected as ${json.name} (${json.id})` }));
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        setResults((prev) => ({ ...prev, [provider]: 'Simulated connection succeeded' }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, [provider]: 'Network error' }));
    } finally {
      setTesting((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const Card: React.FC<{ provider: Provider; icon: React.ComponentType<any>; color: string }>
    = ({ provider, icon: Icon, color }) => {
    const cfg = configs[provider];
    return (
      <div className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 ${plan === 'Starter' ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${color}`} />
            <h3 className="text-lg font-semibold">{provider}</h3>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{provider === 'Twitter' || provider === 'LinkedIn' ? 'OAuth required' : 'Token-based'}</div>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">App ID</label>
            <input value={cfg.appId || ''} onChange={(e) => updateConfig(provider, 'appId', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Access Token</label>
            <div className="flex gap-2">
              <input type={showToken[provider] ? 'text' : 'password'} value={cfg.accessToken || ''} onChange={(e) => updateConfig(provider, 'accessToken', e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" placeholder={provider === 'Twitter' || provider === 'LinkedIn' ? 'Handled via OAuth (simulate)' : 'Enter token (not stored)'} />
              <Button variant="outline" onClick={() => setShowToken((prev) => ({ ...prev, [provider]: !prev[provider] }))}><KeyRound className="w-4 h-4 mr-2" /> {showToken[provider] ? 'Hide' : 'Show'}</Button>
            </div>
            <div className="text-xs text-slate-500 mt-1">Tokens are not saved client-side.</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Page/User ID</label>
            <input value={cfg.pageIdOrUserId || ''} onChange={(e) => updateConfig(provider, 'pageIdOrUserId', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => testProvider(provider)} isLoading={testing[provider]}>Test Connection</Button>
          <Button variant="ghost" onClick={save}><Globe className="w-4 h-4 mr-2" /> Save Settings</Button>
          {results[provider] && <div className="inline-flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" /> {results[provider]}</div>}
          {errors[provider] && <div className="inline-flex items-center gap-2 text-red-600"><XCircle className="w-4 h-4" /> {errors[provider]}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {showUpgrade && (
        <UpgradeModal feature={'Social Integrations'} onClose={() => setShowUpgrade(false)} />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-brand-cyan" /> Social Integrations</h1>
        {plan === 'Starter' && (
          <div className="inline-flex items-center gap-2 text-sm p-2 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <Lock className="w-4 h-4 text-yellow-600" /> Available on Growth and Enterprise
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card provider="Facebook" icon={Facebook} color="text-blue-600" />
        <Card provider="Instagram" icon={Instagram} color="text-pink-500" />
        <Card provider="Twitter" icon={Twitter} color="text-sky-500" />
        <Card provider="LinkedIn" icon={Linkedin} color="text-blue-700" />
      </div>

      {plan === 'Starter' && (
        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-yellow-600" />
          <span className="text-sm">Upgrade to Growth to enable all social integrations.</span>
        </div>
      )}
    </div>
  );
};

