
import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Edit, Save, Plus } from 'lucide-react';

export const PricingManager: React.FC = () => {
    // Mock state for pricing editing
    const [plans, setPlans] = useState([
        { id: 1, name: 'Starter', price: 0, interval: 'month' },
        { id: 2, name: 'Growth', price: 49, interval: 'month' },
        { id: 3, name: 'Enterprise', price: 299, interval: 'month' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Pricing Plans</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage subscription tiers and feature sets.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add New Plan
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm">Plan Name</th>
                            <th className="px-6 py-4 font-semibold text-sm">Monthly Price ($)</th>
                            <th className="px-6 py-4 font-semibold text-sm">Active Subscribers</th>
                            <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {plans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium">{plan.name}</td>
                                <td className="px-6 py-4">
                                    <input 
                                        type="number" 
                                        value={plan.price}
                                        onChange={(e) => {
                                            const newPlans = plans.map(p => p.id === plan.id ? {...p, price: parseInt(e.target.value)} : p);
                                            setPlans(newPlans);
                                        }}
                                        className="w-24 px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700"
                                    />
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {Math.floor(Math.random() * 1000) + 100}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="ghost">
                                        <Save className="w-4 h-4 text-brand-cyan" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                <h4 className="text-yellow-800 dark:text-yellow-200 font-bold mb-1">Note</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Changes to pricing will only affect new subscriptions. Legacy users will be grandfathered into their existing rates unless manually migrated.
                </p>
            </div>
        </div>
    );
};
