import React from 'react';
import { Crown, Zap, Check, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { PlanTier } from '../../types';
import { Link } from 'react-router-dom';

interface BillingSettingsProps {
  plan: PlanTier;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({ plan }) => {
  const isStarter = plan === 'Starter';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing & Plan</h1>
        <Link to={`/pricing?from=billing`}>
          <Button variant={isStarter ? 'primary' : 'outline'}>
            {isStarter ? 'Upgrade Plan' : 'View Plans'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold">Current Plan</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{plan}</div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isStarter ? 'Perfect for individuals getting started.' : 'Scales with growing teams and channels.'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isStarter ? 'bg-slate-100 text-slate-700' : 'bg-green-100 text-green-700'} }`}>
              {isStarter ? 'Free' : 'Paid'}
            </div>
          </div>
          <div className="mt-6">
            <div className="text-xs font-medium text-slate-500 mb-2">Contacts usage</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className={`h-2 rounded-full ${isStarter ? 'bg-slate-500 w-[85%]' : 'bg-brand-cyan w-[60%]'}`}></div>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {isStarter ? '850 / 1,000 contacts' : '15,000 / 25,000 contacts'}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-semibold">Unlocked Features</h2>
          </div>
          <ul className="space-y-3 text-sm">
            {(isStarter ? [
              'Email campaigns',
              'Basic automation steps',
              'Community support'
            ] : [
              'WhatsApp & social channels',
              'Advanced flow builder',
              'A/B testing and analytics',
              'CRM integrations',
              'Priority support'
            ]).map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isStarter && (
        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Unlock Growth features</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Enable WhatsApp, multi-channel campaigns, and advanced automation.</p>
            </div>
            <Link to="/pricing?plan=Growth&from=billing">
              <Button>Upgrade to Growth</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

