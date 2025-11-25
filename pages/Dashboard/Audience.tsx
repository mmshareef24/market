import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardContext, AudienceSegment } from '../../types';
import { mockAudiences } from '../../data/mockData';
import { Button } from '../../components/Button';
import { Users, Search, Plus, CheckCircle, XCircle, Tags, Upload } from 'lucide-react';

const STORAGE_KEY = 'mb_audiences';
const ACTIVE_KEY = 'mb_active_audiences';

export const Audience: React.FC = () => {
  const { plan } = useOutletContext<DashboardContext>();
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [newSeg, setNewSeg] = useState<AudienceSegment>({ id: '', name: '', size: 0, type: 'Dynamic', tags: [] });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const act = localStorage.getItem(ACTIVE_KEY);
      setAudiences(saved ? JSON.parse(saved) : mockAudiences);
      setActiveIds(act ? JSON.parse(act) : []);
    } catch {
      setAudiences(mockAudiences);
      setActiveIds([]);
    }
  }, []);

  const saveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audiences));
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeIds));
    setResult('Saved');
    setTimeout(() => setResult(null), 1500);
  };

  const filtered = useMemo(() => {
    if (!query) return audiences;
    const q = query.toLowerCase();
    return audiences.filter(a => a.name.toLowerCase().includes(q) || a.tags.join(',').toLowerCase().includes(q));
  }, [query, audiences]);

  const toggleActive = (id: string) => {
    setActiveIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addTag = (id: string, tag: string) => {
    setAudiences((prev) => prev.map(a => a.id === id ? { ...a, tags: Array.from(new Set([...(a.tags || []), tag.trim()])).filter(Boolean) } : a));
  };

  const removeTag = (id: string, tag: string) => {
    setAudiences((prev) => prev.map(a => a.id === id ? { ...a, tags: (a.tags || []).filter(t => t !== tag) } : a));
  };

  const startCreate = () => {
    setCreating(true);
    setNewSeg({ id: `seg_${Date.now()}`, name: '', size: 0, type: 'Dynamic', tags: [] });
  };

  const commitCreate = () => {
    setError(null);
    setResult(null);
    if (!newSeg.name || !newSeg.id) { setError('Name is required'); return; }
    setAudiences((prev) => [newSeg, ...prev]);
    setCreating(false);
    setNewSeg({ id: '', name: '', size: 0, type: 'Dynamic', tags: [] });
  };

  const deleteSeg = (id: string) => {
    if (!confirm('Delete this segment?')) return;
    setAudiences((prev) => prev.filter(a => a.id !== id));
    setActiveIds((prev) => prev.filter(x => x !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6" /> Audience Management</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search segments or tags" className="pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm w-64" />
          </div>
          <Button onClick={startCreate}><Plus className="w-4 h-4 mr-2" /> New Segment</Button>
          <Button variant="outline" onClick={saveAll}>Save</Button>
        </div>
      </div>

      {creating && (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Name</label>
              <input value={newSeg.name} onChange={e => setNewSeg(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Size</label>
              <input type="number" value={newSeg.size} onChange={e => setNewSeg(s => ({ ...s, size: Number(e.target.value || 0) }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Type</label>
              <select value={newSeg.type} onChange={e => setNewSeg(s => ({ ...s, type: e.target.value as any }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <option>Dynamic</option>
                <option>Static</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tags</label>
            <div className="flex gap-2">
              <input placeholder="Add tag" className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v) setNewSeg(s => ({ ...s, tags: Array.from(new Set([...(s.tags || []), v])) }));
                  (e.target as HTMLInputElement).value = '';
                }
              }} />
              <Button variant="outline"><Tags className="w-4 h-4 mr-2" /> Add</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(newSeg.tags || []).map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={commitCreate}><CheckCircle className="w-4 h-4 mr-2" /> Create</Button>
            <Button variant="ghost" onClick={() => setCreating(false)}><XCircle className="w-4 h-4 mr-2" /> Cancel</Button>
            {error && <span className="text-xs text-red-600">{error}</span>}
            {result && <span className="text-xs text-green-600">{result}</span>}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(a => (
          <div key={a.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg">{a.name}</div>
              <div className={`text-xs px-2 py-0.5 rounded ${a.type === 'Dynamic' ? 'bg-brand-cyan/10 text-brand-cyan' : 'bg-slate-100 text-slate-700'}`}>{a.type}</div>
            </div>
            <div className="text-sm text-slate-500">Size: {a.size.toLocaleString()}</div>
            <div className="flex flex-wrap gap-2">
              {(a.tags || []).map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">
                  {t}
                  <button className="ml-2 text-slate-400 hover:text-red-500" onClick={() => removeTag(a.id, t)}>×</button>
                </span>
              ))}
              <input placeholder="Add tag" className="text-xs px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v) addTag(a.id, v);
                  (e.target as HTMLInputElement).value = '';
                }
              }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={activeIds.includes(a.id)} onChange={() => toggleActive(a.id)} /> Activate
                </label>
                {activeIds.includes(a.id) && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Active</span>}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => deleteSeg(a.id)}>Delete</Button>
                <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Import</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-500">
        Activated audiences are immediately available to Campaigns and Automation Builder.
      </div>
    </div>
  );
};

