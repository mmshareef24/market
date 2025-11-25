import React from 'react';
import { Button } from './Button';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  onClose: () => void;
  feature: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, feature }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-cyan/30">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upgrade to Unlock</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                The <span className="font-bold text-slate-900 dark:text-white">{feature}</span> feature is available exclusively on Growth and Enterprise plans.
            </p>
            <div className="space-y-3">
                <Button className="w-full" onClick={handleUpgrade}>Upgrade Plan</Button>
                <Button variant="ghost" className="w-full" onClick={onClose}>Maybe Later</Button>
            </div>
        </div>
    </div>
  );
};