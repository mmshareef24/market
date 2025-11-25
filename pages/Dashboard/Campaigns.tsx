import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { 
    Plus, Sparkles, MoreHorizontal, Search, Eye, 
    MessageCircle, Mail, Facebook, LayoutGrid, Target, Users
} from 'lucide-react';
import { generateCampaignStrategy, AICampaignStrategy } from '../../services/geminiService';
import { campaignStore, mockAudiences } from '../../data/mockData';
import { Campaign, DashboardContext } from '../../types';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UpgradeModal } from '../../components/UpgradeModal';
import { CampaignWizard, CampaignFormData } from '../../components/CampaignWizard';

export const Campaigns: React.FC = () => {
    const navigate = useNavigate();
    const { plan } = useOutletContext<DashboardContext>(); // Access User Plan
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    
    // View States
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);
    const [showWizard, setShowWizard] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState<{show: boolean, feature: string}>({ show: false, feature: '' });
    
    // Wizard Data State (from AI or empty)
    const [wizardInitialValues, setWizardInitialValues] = useState<Partial<CampaignFormData> | null>(null);

    // AI States
    const [prompt, setPrompt] = useState('');
    const [generatedStrategy, setGeneratedStrategy] = useState<AICampaignStrategy | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Load campaigns from store
        setCampaigns(campaignStore.getAll());
    }, [showWizard, showAIModal]);

    const handleAIGeneratorClick = () => {
        if (plan === 'Starter') {
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

    const handleWizardComplete = (data: CampaignFormData) => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('mb_audiences') : null;
        const audiences = saved ? JSON.parse(saved) : mockAudiences;
        const selectedAudience = audiences.find((a: any) => a.id === data.audienceId);
        
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
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Campaigns</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleAIGeneratorClick}>
                        <Sparkles className="w-4 h-4 mr-2 text-brand-cyan" />
                        AI Idea Generator
                    </Button>
                    <Button onClick={handleCreateClick}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                    </Button>
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
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Campaign Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Platform</th>
                            <th className="px-6 py-4">Goal</th>
                            <th className="px-6 py-4">Audience</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((c) => (
                                <tr 
                                    key={c.id} 
                                    onClick={() => navigate(`/dashboard/campaigns/${c.id}`)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 font-medium group-hover:text-brand-cyan transition-colors">{c.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${c.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                            c.status === 'Paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                            c.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        {c.platform === 'WhatsApp' && <MessageCircle className="w-4 h-4 text-green-500" />}
                                        {c.platform === 'Email' && <Mail className="w-4 h-4 text-blue-500" />}
                                        {c.platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                                        {c.platform === 'Multi-Channel' && <LayoutGrid className="w-4 h-4 text-purple-500" />}
                                        {c.platform}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.goal || '-'}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{c.audience}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/campaigns/${c.id}`); }}
                                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-cyan transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
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
                initialValues={wizardInitialValues}
            />

            {/* Upgrade Modal */}
            {showUpgradeModal.show && (
                <UpgradeModal 
                    feature={showUpgradeModal.feature} 
                    onClose={() => setShowUpgradeModal({show: false, feature: ''})} 
                />
            )}
        </div>
    );
};
