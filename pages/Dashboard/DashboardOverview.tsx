
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Send, MousePointerClick, TrendingUp, Lock } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { DashboardContext } from '../../types';
import { UpgradeModal } from '../../components/UpgradeModal';
import { Button } from '../../components/Button';

const data = [
  { name: 'Mon', leads: 4000, active: 2400 },
  { name: 'Tue', leads: 3000, active: 1398 },
  { name: 'Wed', leads: 2000, active: 9800 },
  { name: 'Thu', leads: 2780, active: 3908 },
  { name: 'Fri', leads: 1890, active: 4800 },
  { name: 'Sat', leads: 2390, active: 3800 },
  { name: 'Sun', leads: 3490, active: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, isLocked, onLockClick }: any) => (
  <div className={`relative p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden group ${isLocked ? 'cursor-pointer' : ''}`} onClick={isLocked ? onLockClick : undefined}>
    {isLocked && (
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Lock className="w-8 h-8 text-slate-500" />
        </div>
    )}
    <div className={`flex items-center justify-between mb-4 ${isLocked ? 'blur-[2px]' : ''}`}>
      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</span>
      <div className="p-2 rounded-lg bg-brand-cyan/10 text-brand-cyan">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className={`flex items-baseline gap-2 ${isLocked ? 'blur-[4px]' : ''}`}>
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className={`text-xs font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change > 0 ? '+' : ''}{change}%
      </span>
    </div>
  </div>
);

export const DashboardOverview: React.FC = () => {
  const { plan, isAdmin } = useOutletContext<DashboardContext>();
  const [showUpgrade, setShowUpgrade] = useState<{show: boolean, feature: string}>({ show: false, feature: '' });

  const isStarter = plan === 'Starter' && !isAdmin;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Campaigns" value="12" change={8.2} icon={Send} />
        <StatCard title="Total Leads" value="1,234" change={12.5} icon={Users} />
        <StatCard title="Engagement Rate" value="24.8%" change={-2.4} icon={MousePointerClick} />
        <StatCard 
            title="ROI" 
            value="$42.5k" 
            change={18.2} 
            icon={TrendingUp} 
            isLocked={isStarter}
            onLockClick={() => setShowUpgrade({ show: true, feature: 'ROI Analytics' })}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-bold mb-6">Lead Generation Performance</h3>
          
          {isStarter && (
              <div className="absolute inset-0 z-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Unlock Deep Analytics</h4>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-sm">
                      Upgrade to the Growth plan to see historical data trends, attribution modeling, and export capabilities.
                  </p>
                  <Button onClick={() => setShowUpgrade({ show: true, feature: 'Advanced Analytics' })}>
                      View Plans
                  </Button>
              </div>
          )}

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#00D4FF" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-500">JP</span>
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">New campaign "Summer Sale" created</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-brand-cyan hover:text-brand-blue font-medium transition-colors">
            View All Activity
          </button>
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
