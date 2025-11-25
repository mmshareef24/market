import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardContext, AudienceSegment } from '../../types';
import { mockAudiences } from '../../data/mockData';
import { Button } from '../../components/Button';
import { Workflow, Users, CheckCircle, XCircle } from 'lucide-react';

export const AutomationBuilder: React.FC = () => {
  const { plan } = useOutletContext<DashboardContext>();
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [selectedAud, setSelectedAud] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mb_audiences');
      const act = localStorage.getItem('mb_active_audiences');
      setAudiences(saved ? JSON.parse(saved) : mockAudiences);
      setActiveIds(act ? JSON.parse(act) : []);
    } catch {
      setAudiences(mockAudiences);
      setActiveIds([]);
    }
  }, []);

  const activeAudiences = useMemo(() => audiences.filter(a => activeIds.includes(a.id)), [audiences, activeIds]);

  const startFlow = () => {
    setError(null);
    setResult(null);
    if (!selectedAud) { setError('Select an active audience'); return; }
    setResult('Flow initialized');
    setTimeout(() => setResult(null), 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Workflow className="w-6 h-6 text-brand-cyan" /> Automation Builder</h1>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Audiences</h2>
          <div className="text-xs text-slate-500">{activeAudiences.length} active</div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {activeAudiences.map(a => (
            <button key={a.id} onClick={() => setSelectedAud(a.id)} className={`p-4 rounded-xl border flex items-center justify-between ${selectedAud === a.id ? 'bg-brand-cyan/10 border-brand-cyan' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700"><Users className="w-4 h-4 text-slate-500" /></div>
                <div>
                  <div className="font-medium text-sm">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.size.toLocaleString()} contacts</div>
                </div>
              </div>
              {selectedAud === a.id && <CheckCircle className="w-5 h-5 text-brand-cyan" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={startFlow} disabled={!selectedAud}>Start Flow</Button>
          {result && <span className="text-xs text-green-600 inline-flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {result}</span>}
          {error && <span className="text-xs text-red-600 inline-flex items-center gap-1"><XCircle className="w-4 h-4" /> {error}</span>}
        </div>
      </div>
    </div>
  );
};

