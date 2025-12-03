import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { 
    Plus, Sparkles, MoreHorizontal, Search, Eye, 
    MessageCircle, Mail, Facebook, LayoutGrid, Target, Users,
    Download, ArrowUpDown, Copy, Trash2, Play, Pause, CheckCircle2, SlidersHorizontal, Instagram
} from 'lucide-react';
import { generateCampaignStrategy, AICampaignStrategy } from '../../services/geminiService';
import { campaignStore, mockAudiences } from '../../data/mockData';
import { Campaign, DashboardContext } from '../../types';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UpgradeModal } from '../../components/UpgradeModal';
import { CampaignWizard, CampaignFormData } from '../../components/CampaignWizard';

export const Campaigns: React.FC = () => {
    const navigate = useNavigate();
    const { plan, isAdmin } = useOutletContext<DashboardContext>();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    
    // View States
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [platformFilter, setPlatformFilter] = useState('All Platforms');
    const [goalFilter, setGoalFilter] = useState('All Goals');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);
    const [showWizard, setShowWizard] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState<{show: boolean, feature: string}>({ show: false, feature: '' });
    const [sortField, setSortField] = useState<'name' | 'status' | 'platform' | 'goal' | 'audience'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [columns, setColumns] = useState({ name: true, status: true, platform: true, goal: true, audience: true });
    const [showConfirm, setShowConfirm] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    // Wizard Data State (from AI or empty)
    const [wizardInitialValues, setWizardInitialValues] = useState<Partial<CampaignFormData> | null>(null);

    // AI States
    const [prompt, setPrompt] = useState('');
    const [generatedStrategy, setGeneratedStrategy] = useState<AICampaignStrategy | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setCampaigns(campaignStore.getAll());
    }, [showWizard, showAIModal]);

    useEffect(() => {
        const saved = localStorage.getItem('campaigns_filters');
        if (saved) {
            try {
                const prefs = JSON.parse(saved);
                if (prefs.statusFilter) setStatusFilter(prefs.statusFilter);
                if (prefs.platformFilter) setPlatformFilter(prefs.platformFilter);
                if (prefs.goalFilter) setGoalFilter(prefs.goalFilter);
                if (prefs.sortField) setSortField(prefs.sortField);
                if (prefs.sortDirection) setSortDirection(prefs.sortDirection);
                if (prefs.columns) setColumns(prefs.columns);
            } catch {}
        }
    }, []);

    useEffect(() => {
        const prefs = { statusFilter, platformFilter, goalFilter, sortField, sortDirection, columns };
        localStorage.setItem('campaigns_filters', JSON.stringify(prefs));
    }, [statusFilter, platformFilter, goalFilter, sortField, sortDirection, columns]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const handleAIGeneratorClick = () => {
        if (plan === 'Starter' && !isAdmin) {
            setShowUpgradeModal({ show: true, feature: 'AI Campaign Generator' });
        } else {
            setShowAIModal(true);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setGeneratedStrategy(null);
        const result = await generateCampaignStrategy(prompt);
        setGeneratedStrategy(result);
        setIsGenerating(false);
    };

    const handleApplyStrategy = () => {
        if (!generatedStrategy) return;
        setWizardInitialValues({
            name: generatedStrategy.name,
            description: generatedStrategy.description,
            goal: generatedStrategy.goal,
            platform: generatedStrategy.platform
        });
        setShowAIModal(false);
        setShowWizard(true);
    };

    const handleCreateClick = () => {
        setWizardInitialValues(null); // Reset for blank campaign
        setShowWizard(true);
    };

    const resetFilters = () => {
        setStatusFilter('All Statuses');
        setPlatformFilter('All Platforms');
        setGoalFilter('All Goals');
        setSearchQuery('');
        setSortField('name');
        setSortDirection('asc');
        setColumns({ name: true, status: true, platform: true, goal: true, audience: true });
        setSelectedIds(new Set());
        setCurrentPage(1);
        localStorage.removeItem('campaigns_filters');
    };

    const toggleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    const exportCSV = () => {
        const rows = filteredCampaigns.map(c => ({
            id: c.id,
            name: c.name,
            status: c.status,
            platform: c.platform,
            goal: c.goal || '',
            audience: c.audience,
            startDate: c.startDate
        }));
        const header = Object.keys(rows[0] || {}).join(',');
        const body = rows.map(r => Object.values(r).map(v => `${String(v).replace(/"/g, '"')}`).join(',')).join('\n');
        const csv = `${header}\n${body}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'campaigns.csv';
        a.click();
        URL.revokeObjectURL(url);
        setToast({ show: true, message: `Exported ${rows.length} campaign(s)` });
    };

    const duplicateCampaign = (c: Campaign) => {
        const copy: Campaign = {
            ...c,
            id: `cmp_${Date.now()}`,
            name: `Copy of ${c.name}`,
            status: 'Draft'
        };
        campaignStore.add(copy);
        setCampaigns(campaignStore.getAll());
        setToast({ show: true, message: `Duplicated '${c.name}'` });
    };

    const setSelectedStatus = (status: Campaign['status']) => {
        const ids = Array.from(selectedIds);
        ids.forEach(id => campaignStore.update(id, { status }));
        setCampaigns(campaignStore.getAll());
        setSelectedIds(new Set());
        setToast({ show: true, message: `Updated ${ids.length} campaign(s) to '${status}'` });
    };

    const deleteSelected = () => {
        if (!isAdmin) {
            alert('Only admins can delete campaigns');
            return;
        }
        setShowConfirm(true);
    };

    const performDeleteSelected = () => {
        const ids = Array.from(selectedIds);
        ids.forEach(id => campaignStore.delete(id));
        setCampaigns(campaignStore.getAll());
        setSelectedIds(new Set());
        setShowConfirm(false);
        setToast({ show: true, message: `Deleted ${ids.length} campaign(s)` });
    };

    const exportSelected = () => {
        const rows = campaigns.filter(c => selectedIds.has(c.id));
        const mapped = rows.map(c => ({ id: c.id, name: c.name, status: c.status, platform: c.platform, goal: c.goal || '', audience: c.audience, startDate: c.startDate }));
        const header = Object.keys(mapped[0] || {}).join(',');
        const body = mapped.map(r => Object.values(r).join(',')).join('\n');
        const csv = `${header}\n${body}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'campaigns_selected.csv';
        a.click();
        URL.revokeObjectURL(url);
        setToast({ show: true, message: `Exported ${rows.length} selected campaign(s)` });
    };

    const toggleRow = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (pagedCampaigns.length === 0) return;
        const allIds = pagedCampaigns.map(c => c.id);
        const next = new Set(selectedIds);
        const allSelected = allIds.every(id => next.has(id));
        if (allSelected) allIds.forEach(id => next.delete(id)); else allIds.forEach(id => next.add(id));
        setSelectedIds(next);
    };

    const handleWizardComplete = (data: CampaignFormData) => {
        // Find selected audience name for display
        const selectedAudience = mockAudiences.find(a => a.id === data.audienceId);
        
        const payload: Campaign = {
            id: `cmp_${Date.now()}`,
            name: data.name,
            description: data.description,
            status: 'Draft',
            platform: data.platform as any,
            audience: selectedAudience?.name || 'Unknown Audience',
            audienceId: data.audienceId,
            goal: data.goal as any,
            startDate: new Date().toISOString().split('T')[0],
            metrics: {
                sent: 0, delivered: 0, read: 0, engagement: 0, clicks: 0
            },
            automationSteps: ["Trigger: Manual Launch", `Action: Send ${data.platform} Message`]
        };

        campaignStore.add(payload);
        setCampaigns(campaignStore.getAll()); // Refresh list
        setShowWizard(false);
    };

    // Filter logic
    const filteredCampaigns = campaigns.filter(c => {
        const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter;
        const matchesPlatform = platformFilter === 'All Platforms' || c.platform === platformFilter;
        const matchesGoal = goalFilter === 'All Goals' || (c.goal || 'All Goals') === goalFilter;
        const matchesSearch = c.name.toLowerCase().includes(debouncedQuery.toLowerCase());
        return matchesStatus && matchesPlatform && matchesGoal && matchesSearch;
    });

    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        const av = String(a[sortField] || '').toLowerCase();
        const bv = String(b[sortField] || '').toLowerCase();
        if (av < bv) return sortDirection === 'asc' ? -1 : 1;
        if (av > bv) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.max(1, Math.ceil(sortedCampaigns.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const pagedCampaigns = sortedCampaigns.slice(pageStart, pageStart + pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Campaigns</h1>
                <div className="flex gap-2 relative">
                    <Button variant="outline" onClick={exportCSV}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                    <Button variant="outline" onClick={handleAIGeneratorClick}>
                        <Sparkles className="w-4 h-4 mr-2 text-brand-cyan" />
                        AI Idea Generator
                    </Button>
                    <Button onClick={handleCreateClick}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                    </Button>
                    <Button variant="ghost" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                    <Button variant="ghost" onClick={() => setShowColumnsMenu(s => !s)}>
                        <SlidersHorizontal className="w-4 h-4 mr-2" /> Columns
                    </Button>
                    {showColumnsMenu && (
                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg z-10">
                            <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={columns.name} onChange={(e) => setColumns({...columns, name: e.target.checked})} /><span className="text-sm">Name</span></div>
                            <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={columns.status} onChange={(e) => setColumns({...columns, status: e.target.checked})} /><span className="text-sm">Status</span></div>
                            <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={columns.platform} onChange={(e) => setColumns({...columns, platform: e.target.checked})} /><span className="text-sm">Platform</span></div>
                            <div className="flex items-center gap-2 mb-2"><input type="checkbox" checked={columns.goal} onChange={(e) => setColumns({...columns, goal: e.target.checked})} /><span className="text-sm">Goal</span></div>
                            <div className="flex items-center gap-2"><input type="checkbox" checked={columns.audience} onChange={(e) => setColumns({...columns, audience: e.target.checked})} /><span className="text-sm">Audience</span></div>
        </div>
    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search campaigns..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-brand-cyan outline-none transition-shadow" 
                    />
                </div>
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-1 focus:ring-brand-cyan transition-shadow"
                >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                </select>
                <select 
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-1 focus:ring-brand-cyan transition-shadow"
                >
                    <option value="All Platforms">All Platforms</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Multi-Channel">Multi-Channel</option>
                </select>
                <select 
                    value={goalFilter}
                    onChange={(e) => setGoalFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:ring-1 focus:ring-brand-cyan transition-shadow"
                >
                    <option value="All Goals">All Goals</option>
                    <option value="Sales">Sales</option>
                    <option value="Awareness">Awareness</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Retention">Retention</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4"><input type="checkbox" onChange={toggleAll} /></th>
                            {columns.name && (<th className="px-6 py-4"><button className="flex items-center gap-1" onClick={() => toggleSort('name')}>Campaign Name <ArrowUpDown className="w-3 h-3" /></button></th>)}
                            {columns.status && (<th className="px-6 py-4"><button className="flex items-center gap-1" onClick={() => toggleSort('status')}>Status <ArrowUpDown className="w-3 h-3" /></button></th>)}
                            {columns.platform && (<th className="px-6 py-4"><button className="flex items-center gap-1" onClick={() => toggleSort('platform')}>Platform <ArrowUpDown className="w-3 h-3" /></button></th>)}
                            {columns.goal && (<th className="px-6 py-4"><button className="flex items-center gap-1" onClick={() => toggleSort('goal')}>Goal <ArrowUpDown className="w-3 h-3" /></button></th>)}
                            {columns.audience && (<th className="px-6 py-4"><button className="flex items-center gap-1" onClick={() => toggleSort('audience')}>Audience <ArrowUpDown className="w-3 h-3" /></button></th>)}
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {pagedCampaigns.length > 0 ? (
                            pagedCampaigns.map((c) => (
                                <tr 
                                    key={c.id} 
                                    onClick={() => navigate(`/dashboard/campaigns/${c.id}`)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleRow(c.id)} /></td>
                                    {columns.name && (<td className="px-6 py-4 font-medium group-hover:text-brand-cyan transition-colors">{c.name}</td>)}
                                    {columns.status && (<td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${c.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                            c.status === 'Paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                            c.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                            {c.status}
                                        </span>
                                    </td>)}
                                    {columns.platform && (<td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        {c.platform === 'WhatsApp' && <MessageCircle className="w-4 h-4 text-green-500" />}
                                        {c.platform === 'Email' && <Mail className="w-4 h-4 text-blue-500" />}
                                        {c.platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                                        {c.platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                                        {c.platform === 'Multi-Channel' && <LayoutGrid className="w-4 h-4 text-purple-500" />}
                                        {c.platform}
                                    </td>)}
                                    {columns.goal && (<td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.goal || '-'}</td>)}
                                    {columns.audience && (<td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.audience}</td>)}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/campaigns/${c.id}`); }}
                                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-cyan transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); duplicateCampaign(c); }}
                                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-cyan transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-cyan transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                    No campaigns found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedIds.size > 0 && (
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="text-sm">Selected: {selectedIds.size}</div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportSelected}>
                            <Download className="w-4 h-4 mr-2" /> Export Selected
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedStatus('Active')}>
                            <Play className="w-4 h-4 mr-2" /> Mark Active
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedStatus('Paused')}>
                            <Pause className="w-4 h-4 mr-2" /> Mark Paused
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedStatus('Completed')}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
                        </Button>
                        {isAdmin && (
                            <Button variant="outline" onClick={deleteSelected}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">Page {currentPage} of {totalPages}</div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
                    <Button variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                </div>
            </div>

            {/* AI Modal */}
            {showAIModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-brand-cyan" /> AI Campaign Assistant
                            </h2>
                            <button onClick={() => setShowAIModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {!generatedStrategy ? (
                                <>
                                    <label className="block text-sm font-medium mb-2">What kind of campaign do you want to run?</label>
                                    <textarea
                                        className="w-full h-24 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none resize-none"
                                        placeholder="e.g., A summer sale for hiking gear targeting adventurous millennials via WhatsApp..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-brand-cyan uppercase tracking-wide">Strategy Suggestion</h3>
                                            <button onClick={() => setGeneratedStrategy(null)} className="text-xs text-slate-500 hover:underline">New Search</button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Target className="w-4 h-4 text-brand-cyan" />
                                                    <span className="text-xs font-bold uppercase text-slate-500">Campaign Title</span>
                                                </div>
                                                <p className="font-bold text-lg">{generatedStrategy.name}</p>
                                            </div>
                                            
                                            <div>
                                                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Overview</span>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{generatedStrategy.description}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Goal</span>
                                                    <p className="font-medium text-brand-cyan">{generatedStrategy.goal}</p>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Platform</span>
                                                    <p className="font-medium text-brand-cyan">{generatedStrategy.platform}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Target Persona</span>
                                                <div className="flex gap-2">
                                                    <Users className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{generatedStrategy.audiencePersona}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={handleApplyStrategy} className="w-full py-4 text-lg">
                                        <Sparkles className="w-5 h-5 mr-2" /> Use This Strategy
                                    </Button>
                                </div>
                            )}
                        </div>
                        {!generatedStrategy && (
                            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                                <Button variant="ghost" onClick={() => setShowAIModal(false)}>Cancel</Button>
                                <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!prompt}>Generate Strategy</Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Campaign Creation Wizard */}
            <CampaignWizard 
                isOpen={showWizard}
                onClose={() => setShowWizard(false)}
                onComplete={handleWizardComplete}
                plan={plan}
                isAdmin={isAdmin}
                initialValues={wizardInitialValues}
            />

            {/* Upgrade Modal */}
            {showUpgradeModal.show && (
                <UpgradeModal 
                    feature={showUpgradeModal.feature} 
                    onClose={() => setShowUpgradeModal({show: false, feature: ''})} 
                />
            )}

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">This action cannot be undone. Delete selected campaigns?</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
                            <Button variant="outline" onClick={performDeleteSelected}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-lg">
                    <div className="text-sm">{toast.message}</div>
                    <button className="text-xs underline mt-1" onClick={() => setToast({ show: false, message: '' })}>Dismiss</button>
                </div>
            )}
        </div>
    );
};
