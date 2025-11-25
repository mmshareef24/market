import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Users, 
  Mail, 
  Facebook, 
  MessageCircle, 
  LayoutGrid, 
  Lock, 
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';
import { PlanTier } from '../types';
import { mockAudiences } from '../data/mockData';

export interface CampaignFormData {
  name: string;
  description: string;
  goal: string;
  audienceId: string;
  platform: string;
  templateId: string;
}

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: CampaignFormData) => void;
  plan: PlanTier;
  initialValues?: Partial<CampaignFormData> | null;
}

export const CampaignWizard: React.FC<CampaignWizardProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  plan, 
  initialValues 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    goal: 'Sales',
    audienceId: '',
    platform: '',
    templateId: ''
  });

  // Initialize with AI provided values if available
  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  if (!isOpen) return null;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    onComplete(formData);
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
        <h3 className="text-lg font-bold">Campaign Basics</h3>
        <div>
            <label className="block text-sm font-medium mb-1">Campaign Name</label>
            <input 
                type="text" 
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-cyan"
                placeholder="e.g., Summer Sale 2024"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                autoFocus
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Objective</label>
            <div className="grid grid-cols-2 gap-3">
                {['Sales', 'Awareness', 'Engagement', 'Retention'].map(goal => (
                    <div 
                        key={goal}
                        onClick={() => setFormData({...formData, goal})}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${formData.goal === goal 
                            ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                    >
                        <span className="font-medium text-sm">{goal}</span>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
                className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-brand-cyan h-24 resize-none"
                placeholder="Briefly describe the campaign strategy..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
            />
        </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-bold">Target Audience</h3>
      <p className="text-sm text-slate-500">Select a segment to target.</p>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {(() => {
            const saved = typeof window !== 'undefined' ? localStorage.getItem('mb_audiences') : null;
            const list = saved ? JSON.parse(saved) : mockAudiences;
            const actSaved = typeof window !== 'undefined' ? localStorage.getItem('mb_active_audiences') : null;
            const activeIds: string[] = actSaved ? JSON.parse(actSaved) : [];
            const sorted = [...list].sort((a: any, b: any) => Number(activeIds.includes(b.id)) - Number(activeIds.includes(a.id)));
            return sorted;
          })().map((audience: any) => (
            <div 
              key={audience.id}
              onClick={() => setFormData({...formData, audienceId: audience.id})}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${formData.audienceId === audience.id
                  ? 'bg-brand-cyan/10 border-brand-cyan'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-cyan/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{audience.name}</p>
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span>{audience.size.toLocaleString()} contacts</span>
                    <span>•</span>
                    <span className="capitalize">{audience.type}</span>
                    {(() => {
                      const actSaved = typeof window !== 'undefined' ? localStorage.getItem('mb_active_audiences') : null;
                      const activeIds: string[] = actSaved ? JSON.parse(actSaved) : [];
                      return activeIds.includes(audience.id) ? <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">Active</span> : null;
                    })()}
                  </div>
                </div>
              </div>
              {formData.audienceId === audience.id && <CheckCircle className="w-5 h-5 text-brand-cyan" />}
            </div>
          ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const channels = [
        { id: 'Email', icon: Mail, color: 'text-blue-500', isLocked: false },
        { id: 'Facebook', icon: Facebook, color: 'text-blue-600', isLocked: false },
        { id: 'WhatsApp', icon: MessageCircle, color: 'text-green-500', isLocked: plan === 'Starter' },
        { id: 'Multi-Channel', icon: LayoutGrid, color: 'text-purple-500', isLocked: plan === 'Starter' }
    ];

    return (
        <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold">Select Channel</h3>
            {plan === 'Starter' && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 text-sm text-blue-700 dark:text-blue-300 flex gap-2">
                    <Sparkles className="w-4 h-4 mt-0.5" />
                    <span>Upgrade to Growth to unlock WhatsApp & Multi-channel campaigns.</span>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                {channels.map(channel => (
                    <button 
                        key={channel.id}
                        disabled={channel.isLocked}
                        onClick={() => !channel.isLocked && setFormData({...formData, platform: channel.id})}
                        className={`relative p-4 rounded-xl border transition-all flex flex-col items-center gap-3 text-center ${
                            formData.platform === channel.id
                                ? 'bg-brand-cyan/10 border-brand-cyan ring-1 ring-brand-cyan'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            } ${channel.isLocked ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900' : 'cursor-pointer hover:border-brand-cyan/50'}
                        `}
                    >
                        {channel.isLocked && (
                            <div className="absolute top-2 right-2">
                                <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                        )}
                        <channel.icon className={`w-8 h-8 ${channel.color}`} />
                        <span className="font-medium">{channel.id}</span>
                    </button>
                ))}
            </div>
        </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
         <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Ready to Launch?</h3>
            <p className="text-slate-500">Review your campaign details before creation.</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-sm text-slate-500">Name</span>
                <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-sm text-slate-500">Goal</span>
                <span className="font-medium">{formData.goal}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="text-sm text-slate-500">Platform</span>
                <span className="font-medium">{formData.platform}</span>
            </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Audience</span>
            <span className="font-medium">{(() => { const saved = typeof window !== 'undefined' ? localStorage.getItem('mb_audiences') : null; const list = saved ? JSON.parse(saved) : mockAudiences; return list.find((a: any) => a.id === formData.audienceId)?.name; })()}</span>
          </div>
        </div>
    </div>
  );

  const canProceed = () => {
      if (step === 1) return !!formData.name;
      if (step === 2) return !!formData.audienceId;
      if (step === 3) return !!formData.platform;
      return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold">Create Campaign</h2>
                    <p className="text-xs text-slate-500">Step {step} of 4</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
                <div 
                    className="bg-brand-cyan h-1 transition-all duration-300 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between bg-slate-50 dark:bg-slate-800/50">
                {step > 1 ? (
                    <Button variant="ghost" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                ) : (
                    <div></div>
                )}

                {step < 4 ? (
                    <Button onClick={nextStep} disabled={!canProceed()}>
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} className="shadow-lg shadow-brand-cyan/20">
                        Launch Campaign
                    </Button>
                )}
            </div>
        </div>
    </div>
  );
};
