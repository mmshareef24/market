
import React from 'react';
import { Building2, Store, ShoppingBag, Users, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

const SupportCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  benefits: string[];
  color: string;
}> = ({ title, description, icon: Icon, benefits, color }) => (
  <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-cyan/50 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
    <div className={`w-14 h-14 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')} flex items-center justify-center mb-6`}>
      <Icon className={`w-7 h-7 ${color}`} />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed flex-grow">
      {description}
    </p>
    <div className="space-y-3 mb-8">
        {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${color.replace('text-', 'bg-')}`} />
                {benefit}
            </div>
        ))}
    </div>
    <Link to="/auth?mode=signup">
        <Button variant="outline" className="w-full group">
            Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
    </Link>
  </div>
);

export const WhoWeSupport: React.FC = () => {
  const segments = [
    {
      title: "Marketing Agencies",
      description: "Manage multiple client accounts from a single dashboard. Streamline reporting, automate routine communications, and deliver measurable ROI to your clients without the operational headache.",
      icon: Building2,
      color: "text-purple-500",
      benefits: ["Multi-tenant architecture", "White-label reporting", "Client approval workflows", "Unified billing"]
    },
    {
      title: "Small & Medium Businesses",
      description: "Level the playing field with enterprise-grade tools priced for growth. Automate your marketing so you can focus on running your business, not sending emails.",
      icon: Store,
      color: "text-blue-500",
      benefits: ["Affordable pricing tiers", "No-code automation builder", "Pre-built templates", "Easy setup"]
    },
    {
      title: "E-commerce Brands",
      description: "Turn traffic into revenue with targeted campaigns. Recover abandoned carts, announce product drops via WhatsApp, and build loyalty with post-purchase sequences.",
      icon: ShoppingBag,
      color: "text-green-500",
      benefits: ["Shopify/WooCommerce integration", "Abandoned cart triggers", "Product catalogs in WhatsApp", "ROI tracking"]
    },
    {
      title: "In-house Marketing Teams",
      description: "Break down silos and collaborate effectively. MarketBridge AI provides a central hub for your content, data, and execution, ensuring everyone stays aligned.",
      icon: Users,
      color: "text-orange-500",
      benefits: ["Role-based access control", "Collaboration tools", "Brand asset management", "Enterprise security"]
    },
    {
      title: "Consultants & Freelancers",
      description: "Deliver faster results for your clients. Set up sophisticated campaigns in minutes and use data-driven insights to prove your value and retain clients longer.",
      icon: UserCheck,
      color: "text-brand-cyan",
      benefits: ["Quick client onboarding", "Portable strategies", "Performance dashboards", "Flexible usage"]
    }
  ];

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-cyan/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Built for <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">Every Marketer</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you're running a boutique agency or scaling a global e-commerce brand, MarketBridge AI adapts to your specific needs.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {segments.map((segment, idx) => (
                <SupportCard key={idx} {...segment} />
            ))}
            
            {/* Call to Action Card for the last slot */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center h-full">
                <h3 className="text-2xl font-bold mb-4 text-white">Don't see your industry?</h3>
                <p className="text-slate-400 mb-8">
                    Our platform is flexible enough to handle any use case. Let's talk about your specific requirements.
                </p>
                <Link to="/contact">
                    <Button variant="primary" className="w-full">
                        Talk to Sales
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-32 px-6 lg:px-8">
         <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-blue/10 backdrop-blur-[2px]" />
            <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Not sure if we're a fit?</h2>
               <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
                 Schedule a discovery call with our team. We'll walk you through a personalized demo tailored to your industry.
               </p>
               <Link to="/contact">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                    Book Discovery Call
                  </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};
