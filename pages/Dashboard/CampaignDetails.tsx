
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Users, 
  MousePointerClick, 
  Eye, 
  Calendar, 
  Share2, 
  Trash2,
  Workflow,
  CheckCircle2,
  Target,
  Lock,
  Copy
} from 'lucide-react';
import { Button } from '../../components/Button';
import { campaignStore, mockAudiences } from '../../data/mockData';
import { Campaign, DashboardContext } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UpgradeModal } from '../../components/UpgradeModal';

// Mock chart data for details view
const performanceData = [
  { name: 'Day 1', sent: 1000, read: 800, clicks: 200 },
  { name: 'Day 2', sent: 2500, read: 1900, clicks: 450 },
  { name: 'Day 3', sent: 4000, read: 3200, clicks: 900 },
  { name: 'Day 4', sent: 6000, read: 4500, clicks: 1200 },
  { name: 'Day 5', sent: 8000, read: 6100, clicks: 1800 },
  { name: 'Day 6', sent: 10500, read: 7800, clicks: 2400 },
  { name: 'Day 7', sent: 12500, read: 9800, clicks: 3200 },
];

const PLATFORM_OPTIONS = ['WhatsApp', 'Facebook', 'Email', 'Instagram', 'Multi-Channel'];
const GOAL_OPTIONS = ['Sales', 'Awareness', 'Engagement', 'Retention'];

export const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plan, isAdmin } = useOutletContext<DashboardContext>();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [originalCampaign, setOriginalCampaign] = useState<Campaign | null>(null);
  const [showUpgrade, setShowUpgrade] = useState<{show: boolean, feature: string}>({ show: false, feature: '' });

  const isStarter = plan === 'Starter' && !isAdmin;

  useEffect(() => {
    // Fetch from store
    const found = campaignStore.getById(id || '');
    if (found) {
      setCampaign({ ...found }); 
      setOriginalCampaign({ ...found });
    }
  }, [id]);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <p>Campaign not found.</p>
        <Button variant="ghost" onClick={() => navigate('/dashboard/campaigns')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaving(true);
    // Update store
    setTimeout(() => {
        if (campaign) {
            campaignStore.update(campaign.id, campaign);
            setOriginalCampaign({ ...campaign }); 
        }
        setIsEditing(false);
        setIsSaving(false);
    }, 800);
  };

  const handleCancel = () => {
      if (originalCampaign) {
          setCampaign({ ...originalCampaign });
      }
      setIsEditing(false);
  };

  const handleDelete = () => {
      if (!isAdmin) {
          alert('Only admins can delete campaigns');
          return;
      }
      if(confirm('Are you sure you want to delete this campaign?')) {
          campaignStore.delete(campaign.id);
          navigate('/dashboard/campaigns');
      }
  };

  const handleExport = () => {
      if (isStarter) {
          setShowUpgrade({ show: true, feature: 'Advanced Reporting Export' });
      } else {
          // Mock export
          alert("Report downloaded!");
      }
  };

  const handleOpenBuilder = () => {
      if (isStarter) {
           setShowUpgrade({ show: true, feature: 'Advanced Automation Builder' });
      } else {
           navigate('/dashboard/automation');
      }
  };

  const handleCopyId = async () => {
      if (!campaign) return;
      try {
          await navigator.clipboard.writeText(campaign.id);
          alert('Campaign ID copied');
      } catch {}
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
           <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
           {subtitle && (
               <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                   {subtitle}
               </span>
           )}
        </div>
      </div>
    </div>
  );

  // Helper to calculate percentages safely
  const calculateRate = (numerator: number, denominator: number) => {
      if (!denominator) return '0%';
      return `${((numerator / denominator) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => navigate('/dashboard/campaigns')}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input 
                  type="text" 
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  className="text-2xl font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-1 focus:ring-2 focus:ring-brand-cyan outline-none w-full max-w-md"
                  placeholder="Campaign Name"
                />
              ) : (
                <h1 className="text-2xl font-bold">{campaign.name}</h1>
              )}
              {!isEditing && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${campaign.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                    campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {campaign.status}
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
               ID: {campaign.id} • Last updated just now
               <button onClick={handleCopyId} className="ml-2 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
               </button>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
           {isEditing ? (
             <>
               <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
                  Cancel
               </Button>
               <Button onClick={handleSave} isLoading={isSaving}>
                 <Save className="w-4 h-4 mr-2" /> Save Changes
               </Button>
             </>
           ) : (
             <>
               <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Campaign</Button>
               <Button variant="primary" onClick={handleExport}>
                 {isStarter ? <Lock className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                 Export Report
               </Button>
             </>
           )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <MetricCard 
            title="Messages Sent" 
            value={campaign.metrics.sent} 
            icon={Send} 
            color="bg-blue-500 text-blue-500" 
         />
         <MetricCard 
            title="Delivered" 
            value={campaign.metrics.delivered} 
            subtitle={calculateRate(campaign.metrics.delivered, campaign.metrics.sent)}
            icon={CheckCircle2} 
            color="bg-green-500 text-green-500" 
         />
         <MetricCard 
            title="Opened / Read" 
            value={campaign.metrics.read} 
            subtitle={calculateRate(campaign.metrics.read, campaign.metrics.delivered)}
            icon={Eye} 
            color="bg-purple-500 text-purple-500" 
         />
         <MetricCard 
            title="Clicks" 
            value={campaign.metrics.clicks || 0} 
            subtitle={calculateRate(campaign.metrics.clicks || 0, campaign.metrics.read)}
            icon={MousePointerClick} 
            color="bg-brand-cyan text-brand-cyan" 
         />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Main Chart Section */}
         <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Performance Over Time</h3>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Sent</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-cyan" /> Read</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Clicks</div>
                    </div>
               </div>
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.1} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="sent" stroke="#0066FF" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" name="Sent" />
                      <Area type="monotone" dataKey="read" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRead)" name="Read" />
                      <Area type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" name="Clicks" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Automation Flow Preview */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-brand-cyan" /> Automation Flow
                 </h3>
                 <div className="flex items-center gap-2">
                     {isStarter && <span className="text-xs text-slate-500 mr-1">Read-only mode</span>}
                     <Button variant="ghost" size="sm" className="text-brand-cyan" onClick={handleOpenBuilder}>
                        {isStarter ? <Lock className="w-3 h-3 mr-1" /> : null}
                        Open Builder
                     </Button>
                 </div>
               </div>
               
               <div className="relative flex flex-col items-center gap-6 py-4">
                  {/* Vertical line connecting nodes */}
                  <div className="absolute top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />
                  
                  {campaign.automationSteps?.map((step, index) => (
                     <div key={index} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className={`
                           px-4 py-3 rounded-lg border shadow-sm text-sm font-medium w-64 text-center z-10 transition-transform hover:scale-105
                           ${index === 0 ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' : 
                             step.includes('Delay') ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 rounded-full w-auto px-6' :
                             'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}
                        `}>
                           {step}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar / Settings */}
         <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold mb-4">Configuration</h3>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</label>
                     {isEditing ? (
                        <textarea 
                           className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-3 text-sm focus:ring-2 focus:ring-brand-cyan outline-none transition-shadow"
                           rows={4}
                           value={campaign.description}
                           onChange={(e) => setCampaign({...campaign, description: e.target.value})}
                        />
                     ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                           {campaign.description || "No description provided."}
                        </p>
                     )}
                  </div>

                  <hr className="border-slate-100 dark:border-slate-700" />

                  <div className="grid grid-cols-1 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Platform</label>
                        {isEditing ? (
                            <select 
                                value={campaign.platform}
                                onChange={(e) => setCampaign({...campaign, platform: e.target.value as any})}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                            >
                                {PLATFORM_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Share2 className="w-4 h-4 text-brand-blue" /> {campaign.platform}
                            </div>
                        )}
                     </div>

                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Goal</label>
                        {isEditing ? (
                             <select 
                                value={campaign.goal || 'Sales'}
                                onChange={(e) => setCampaign({...campaign, goal: e.target.value as any})}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                             >
                                 {GOAL_OPTIONS.map(opt => (
                                     <option key={opt} value={opt}>{opt}</option>
                                 ))}
                             </select>
                        ) : (
                             <div className="flex items-center gap-2 text-sm font-medium">
                                <Target className="w-4 h-4 text-purple-500" /> {campaign.goal || 'General'}
                            </div>
                        )}
                     </div>
                     
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Target Audience</label>
                        {isEditing ? (
                            <select 
                                value={campaign.audienceId || ''}
                                onChange={(e) => {
                                    const aud = mockAudiences.find(a => a.id === e.target.value);
                                    if(aud) setCampaign({...campaign, audienceId: aud.id, audience: aud.name});
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded p-2 text-sm focus:ring-2 focus:ring-brand-cyan outline-none"
                            >
                                <option value="" disabled>Select Audience</option>
                                {mockAudiences.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Users className="w-4 h-4 text-slate-400" /> {campaign.audience}
                            </div>
                        )}
                     </div>

                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Start Date</label>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                           <Calendar className="w-4 h-4 text-slate-400" /> {campaign.startDate}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold mb-4 text-red-500">Danger Zone</h3>
               <p className="text-xs text-slate-500 mb-4">
                  Deleting a campaign is irreversible. All data associated with this campaign will be permanently removed.
               </p>
               <Button onClick={handleDelete} variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900" disabled={!isAdmin}
               >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Campaign
               </Button>
            </div>
         </div>
      </div>

  {showUpgrade.show && (
    <UpgradeModal 
        feature={showUpgrade.feature} 
        onClose={() => setShowUpgrade({ show: false, feature: '' })} 
    />
  )}
  </div>
  );
};
