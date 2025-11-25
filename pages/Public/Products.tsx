
import React from 'react';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  LayoutGrid, 
  Workflow, 
  Users, 
  BarChart2, 
  Globe,
  Code2,
  Check
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

const ToolCard: React.FC<{
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ElementType;
}> = ({ title, subtitle, description, features, icon: Icon }) => (
  <div className="flex flex-col h-full p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-cyan/50 hover:shadow-xl transition-all duration-300">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-cyan/20 to-brand-blue/20 flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-brand-cyan" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm font-semibold text-brand-cyan uppercase tracking-wide mb-4">{subtitle}</p>
    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed flex-grow">
      {description}
    </p>
    <ul className="space-y-3 mb-8">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <Button variant="outline" className="w-full mt-auto">Learn More</Button>
  </div>
);

const IntegrationCard: React.FC<{
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}> = ({ name, icon: Icon, color, description }) => (
  <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors h-full">
    <div className={`p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${color} flex-shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-2">{name}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export const Products: React.FC = () => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 bg-slate-50 dark:bg-brand-darker overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            The MarketBridge <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">
              Product Suite
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            A modular ecosystem of tools designed to work together seamlessly. Pick what you need or power your entire stack.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Suite Grid */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto -mt-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ToolCard 
            title="Bridge Command"
            subtitle="Central Dashboard"
            description="The control center for all your marketing operations. Monitor active campaigns, review approvals, and track real-time KPIs from a single pane of glass."
            features={["Unified Inbox", "Real-time Alerts", "Team Collaboration", "Global Search"]}
            icon={LayoutGrid}
          />
          <ToolCard 
            title="Flow Architect"
            subtitle="Automation Engine"
            description="Build sophisticated customer journeys visually. Connect disparate touchpoints into a cohesive narrative that drives conversion automatically."
            features={["Drag-and-Drop Builder", "Multi-channel logic", "A/B Split Testing", "Event Triggers"]}
            icon={Workflow}
          />
          <ToolCard 
            title="Audience Nexus"
            subtitle="Smart CRM"
            description="Understand your customers like never before. Aggregate data from all sources to build rich, dynamic profiles that update in real-time."
            features={["Behavioral Segmentation", "LTV Prediction", "Import/Export", "Auto-Tagging"]}
            icon={Users}
          />
          <ToolCard 
            title="Insight Engine"
            subtitle="Deep Analytics"
            description="Go beyond vanity metrics. Uncover actionable insights with AI-driven reporting that connects campaign activity directly to revenue."
            features={["Custom Reports", "Attribution Modeling", "Export to PDF/CSV", "ROI Calculator"]}
            icon={BarChart2}
          />
        </div>
      </section>

      {/* Integrations Section */}
      <section className="mt-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Connected to everything <br />
              <span className="text-brand-cyan">you already use.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Our API-first architecture ensures MarketBridge AI plays nicely with your existing stack. Connect social platforms, email providers, and custom data sources in clicks, not code.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Code2 className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Developer Friendly API</h4>
                  <p className="text-sm text-slate-500">Full REST/GraphQL access for custom integrations.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Globe className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Webhooks & Events</h4>
                  <p className="text-sm text-slate-500">Real-time data sync with your backend systems.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button variant="outline">View API Documentation</Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <IntegrationCard 
              name="WhatsApp Cloud API" 
              description="Send high-converting template messages, automate 2-way customer support, and manage rich media assets directly from your dashboard."
              icon={MessageCircle} 
              color="text-green-500" 
            />
            <IntegrationCard 
              name="Meta Graph API" 
              description="Seamlessly sync Facebook & Instagram leads, manage ad audiences in real-time, and track conversion events across the Meta ecosystem."
              icon={Facebook} 
              color="text-blue-600" 
            />
            <IntegrationCard 
              name="Twitter / X API" 
              description="Monitor brand sentiment with social listening, schedule tweets for optimal times, and auto-reply to customer service queries."
              icon={Twitter} 
              color="text-slate-900 dark:text-white" 
            />
            <IntegrationCard 
              name="LinkedIn Marketing" 
              description="Capture high-quality B2B leads via Lead Gen Forms, manage sponsored content, and target professional decision-makers."
              icon={Linkedin} 
              color="text-blue-700" 
            />
            <IntegrationCard 
              name="Email Services" 
              description="Ensure high deliverability with native SMTP relay, SendGrid, and Mailgun integrations for transactional and marketing campaigns."
              icon={Mail} 
              color="text-orange-500" 
            />
            <IntegrationCard 
              name="Instagram Direct" 
              description="Scale engagement by automating DM replies, managing Story mentions, and organizing influencer interactions in one inbox."
              icon={Instagram} 
              color="text-pink-600" 
            />
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="mt-32 px-6 lg:px-8 mb-10">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/20 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/20 blur-[80px] rounded-full" />
            
            <h2 className="text-3xl font-bold text-white mb-6 relative z-10">
              Ready to unify your marketing stack?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
              Stop switching tabs and start driving results. Get full access to the product suite today.
            </p>
            <div className="relative z-10">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
};
