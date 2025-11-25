import React from 'react';
import { Button } from '../../components/Button';
import { ArrowRight, BarChart3, Globe, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand-cyan/10 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            New: WhatsApp Cloud API Integration
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Accelerate Growth with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">
              Intelligent Automation
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            MarketBridge AI unifies your campaign management, CRM, and omnichannel messaging into one beautiful, intelligent interface.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="w-full sm:w-auto">
                Try for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Book a Demo
            </Button>
          </div>

          {/* Abstract Dashboard Preview */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-xl blur opacity-30"></div>
            <div className="relative rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center text-slate-400">
               {/* Decorative Placeholder for Screenshot */}
               <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 flex flex-col p-4 gap-4">
                  <div className="h-12 w-full border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                  </div>
                  <div className="flex-1 flex gap-4">
                     <div className="w-64 h-full bg-white dark:bg-slate-900 rounded-lg hidden md:block"></div>
                     <div className="flex-1 h-full bg-white dark:bg-slate-900 rounded-lg grid grid-cols-2 gap-4 p-4">
                        <div className="col-span-2 h-40 bg-slate-50 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded animate-pulse"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { title: "Omnichannel Messaging", desc: "Connect WhatsApp, Messenger, and Email in a single inbox.", icon: MessageSquare },
             { title: "AI Automation", desc: "Build complex flows with a drag-and-drop visual builder.", icon: Zap },
             { title: "Deep Analytics", desc: "Real-time insights into campaign performance and ROI.", icon: BarChart3 },
           ].map((feature, idx) => (
             <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-cyan/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-brand-cyan/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-brand-cyan" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Partners / Social Proof */}
      <section className="text-center px-6">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by innovaters at</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          {/* Simple Text Placeholders for Logos */}
          <span className="text-2xl font-bold font-serif">ACME Corp</span>
          <span className="text-2xl font-bold font-mono">Globex</span>
          <span className="text-2xl font-bold font-sans tracking-tight">Soylent</span>
          <span className="text-2xl font-bold font-mono">Initech</span>
        </div>
      </section>
    </div>
  );
};