import React from 'react';
import { Zap } from 'lucide-react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center gap-2 font-bold text-xl tracking-tight ${className}`}>
    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-blue shadow-[0_0_15px_rgba(0,212,255,0.5)]">
      <Zap className="w-5 h-5 text-white" fill="currentColor" />
    </div>
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
      MarketBridge<span className="text-brand-cyan">AI</span>
    </span>
  </div>
);
