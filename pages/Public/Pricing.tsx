
import React, { useState } from 'react';
import { Check, X, Zap, Shield, Globe, HelpCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

const PricingCard: React.FC<{
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  marketComparison?: string;
  buttonText?: string;
  variant?: 'outline' | 'primary';
  planId: string;
}> = ({ name, price, period, description, features, isPopular, marketComparison, buttonText = "Get Started", variant = "outline", planId }) => (
  <div className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${isPopular ? 'bg-slate-900 text-white border-brand-cyan shadow-2xl scale-105 z-10' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-cyan/50'}`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-cyan to-brand-blue text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
        Most Popular
      </div>
    )}
    
    <div className="mb-8">
      <h3 className={`text-lg font-bold mb-2 ${isPopular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{name}</h3>
      <p className={`text-sm ${isPopular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
    </div>

    <div className="mb-8">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        <span className={`text-sm ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>{period}</span>
      </div>
      {marketComparison && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
          <Zap className="w-3 h-3" />
          {marketComparison}
        </div>
      )}
    </div>

    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm">
          <Check className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-brand-cyan' : 'text-green-500'}`} />
          <span className={isPopular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>{feature}</span>
        </li>
      ))}
    </ul>

    <Link to={`/auth?mode=signup&plan=${planId}`} className="w-full">
        <Button variant={variant} className="w-full" size="lg">
        {buttonText}
        </Button>
    </Link>
  </div>
);

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-cyan/5 blur-[120px] rounded-full -z-10" />
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
          Simple pricing, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">
            Unbeatable Value
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
          We believe advanced marketing tools should be accessible. That's why MarketBridge AI is priced 20% lower than the industry average.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan"
          >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${isAnnual ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            Yearly <span className="text-brand-cyan text-xs ml-1 font-bold">(Save 20%)</span>
          </span>
        </div>
      </section>

      {/* Cards */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <PricingCard 
            name="Starter"
            planId="Starter"
            price={isAnnual ? "$0" : "$0"}
            period="/ forever"
            description="Perfect for individuals and small side projects."
            features={[
              "Up to 1,000 active contacts",
              "Basic Email Automation",
              "1 WhatsApp Number",
              "Community Support",
              "Standard Analytics"
            ]}
          />
          <PricingCard 
            name="Growth"
            planId="Growth"
            price={isAnnual ? "$39" : "$49"}
            period="/ month"
            description="For growing businesses needing scale and power."
            isPopular={true}
            variant="primary"
            marketComparison="20% Cheaper than competitors"
            features={[
              "Up to 25,000 active contacts",
              "Advanced Flow Builder",
              "Unlimited WhatsApp & Social Channels",
              "A/B Testing",
              "CRM Integrations (HubSpot, Salesforce)",
              "Priority Email Support",
              "Remove MarketBridge Branding"
            ]}
          />
          <PricingCard 
            name="Enterprise"
            planId="Enterprise"
            price="Custom"
            period=""
            description="For large organizations with specific security needs."
            buttonText="Contact Sales"
            features={[
              "Unlimited contacts",
              "Dedicated Customer Success Manager",
              "Custom API Rate Limits",
              "SSO & Advanced Security",
              "On-premise deployment options",
              "Custom SLA",
              "Quarterly Strategy Reviews"
            ]}
          />
        </div>
      </section>

      {/* Comparison / Features Table */}
      <section className="px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-4 text-sm font-medium text-slate-500 uppercase">Features</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-900 dark:text-white w-1/4">Starter</th>
                <th className="py-4 px-4 text-sm font-bold text-brand-cyan w-1/4">Growth</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-900 dark:text-white w-1/4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                { name: "Monthly Emails", start: "5,000", pro: "Unlimited", ent: "Unlimited" },
                { name: "Automation Steps", start: "Max 5", pro: "Unlimited", ent: "Unlimited" },
                { name: "Team Members", start: "1", pro: "5", ent: "Unlimited" },
                { name: "API Access", start: <X className="w-5 h-5 text-slate-300" />, pro: <Check className="w-5 h-5 text-green-500" />, ent: <Check className="w-5 h-5 text-green-500" /> },
                { name: "Remove Branding", start: <X className="w-5 h-5 text-slate-300" />, pro: <Check className="w-5 h-5 text-green-500" />, ent: <Check className="w-5 h-5 text-green-500" /> },
                { name: "24/7 Support", start: <X className="w-5 h-5 text-slate-300" />, pro: "Priority Email", ent: "Dedicated Agent" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 px-4 font-medium">{row.name}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{row.start}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">{row.pro}</td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{row.ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-8 max-w-3xl mx-auto mt-24">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade your plan at any time from the billing settings." },
            { q: "Do you offer a free trial for the Pro plan?", a: "Yes, we offer a 14-day free trial with full access to all Pro features. No credit card required." },
            { q: "What happens if I exceed my contact limit?", a: "We will notify you when you reach 90% of your limit. You can choose to upgrade or clean your list." },
            { q: "Is there a setup fee?", a: "No, there are no hidden setup fees or cancellation charges." },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-cyan" /> {item.q}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
