
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Activity, HardDrive } from 'lucide-react';

const revenueData = [
  { name: 'Jan', rev: 4000 },
  { name: 'Feb', rev: 3000 },
  { name: 'Mar', rev: 2000 },
  { name: 'Apr', rev: 2780 },
  { name: 'May', rev: 1890 },
  { name: 'Jun', rev: 2390 },
  { name: 'Jul', rev: 3490 },
];

const AdminStatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</span>
      <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className={`text-xs font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change > 0 ? '+' : ''}{change}%
      </span>
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">System Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Platform performance and revenue metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard title="Total Revenue" value="$124,500" change={12.5} icon={DollarSign} color="text-green-500" />
        <AdminStatCard title="Active Users" value="8,234" change={5.2} icon={Users} color="text-brand-cyan" />
        <AdminStatCard title="System Load" value="42%" change={-1.4} icon={Activity} color="text-purple-500" />
        <AdminStatCard title="Storage Used" value="1.2 TB" change={8.1} icon={HardDrive} color="text-orange-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="rev" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Pending Actions</h3>
          <div className="space-y-4">
            {[
                { label: 'Approve Enterprise Request', time: '10m ago', type: 'urgent' },
                { label: 'Review Content Update', time: '1h ago', type: 'normal' },
                { label: 'System Backup Warning', time: '3h ago', type: 'warning' },
                { label: 'New Partner Application', time: '5h ago', type: 'normal' },
            ].map((action, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${action.type === 'urgent' ? 'bg-red-500' : action.type === 'warning' ? 'bg-yellow-500' : 'bg-brand-cyan'}`} />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-brand-cyan hover:text-brand-blue font-medium transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
