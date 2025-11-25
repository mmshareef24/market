import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardContext, Contact } from '../../types';
import { Button } from '../../components/Button';
import { Users, Search, Plus, CheckCircle, XCircle, Upload } from 'lucide-react';

const STORAGE_KEY = 'mb_contacts';

export const Contacts: React.FC = () => {
  const { plan } = useOutletContext<DashboardContext>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({ id: '', name: '', email: '', phone: '', tags: [] });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setContacts(saved ? JSON.parse(saved) : []);
    } catch {
      setContacts([]);
    }
  }, []);

  const saveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    setResult('Saved');
    setTimeout(() => setResult(null), 1500);
  };

  const filtered = useMemo(() => {
    if (!query) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(c => (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q) || (c.tags || []).join(',').toLowerCase().includes(q));
  }, [query, contacts]);

  const startCreate = () => {
    setCreating(true);
    setNewContact({ id: `c_${Date.now()}`, name: '', email: '', phone: '', tags: [], createdAt: new Date().toISOString() });
  };

  const commitCreate = () => {
    setError(null);
    setResult(null);
    if (!newContact.name) { setError('Name is required'); return; }
    setContacts((prev) => [newContact, ...prev]);
    setCreating(false);
    setNewContact({ id: '', name: '', email: '', phone: '', tags: [] });
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    if (!confirm('Delete this contact?')) return;
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6" /> Contacts</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, tags" className="pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm w-64" />
          </div>
          <Button onClick={startCreate}><Plus className="w-4 h-4 mr-2" /> New Contact</Button>
          <Button variant="outline" onClick={saveAll}>Save</Button>
        </div>
      </div>

      {creating && (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Name</label>
              <input value={newContact.name} onChange={e => setNewContact(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</label>
              <input value={newContact.email} onChange={e => setNewContact(s => ({ ...s, email: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</label>
              <input value={newContact.phone} onChange={e => setNewContact(s => ({ ...s, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Tags</label>
              <input placeholder="comma,separated,tags" onChange={e => setNewContact(s => ({ ...s, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
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

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Tags</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-slate-200 dark:border-slate-800">
                <td className="py-2 pr-4">
                  <input value={c.name || ''} onChange={e => updateContact(c.id, { name: e.target.value })} className="w-full bg-transparent" />
                </td>
                <td className="py-2 pr-4">
                  <input value={c.email || ''} onChange={e => updateContact(c.id, { email: e.target.value })} className="w-full bg-transparent" />
                </td>
                <td className="py-2 pr-4">
                  <input value={c.phone || ''} onChange={e => updateContact(c.id, { phone: e.target.value })} className="w-full bg-transparent" />
                </td>
                <td className="py-2 pr-4">
                  <input value={(c.tags || []).join(', ')} onChange={e => updateContact(c.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full bg-transparent" />
                </td>
                <td className="py-2 pr-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => deleteContact(c.id)}>Delete</Button>
                    <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Import</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

