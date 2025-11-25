
import React from 'react';
import { 
  Megaphone, 
  Workflow, 
  BarChart3, 
  Users, 
  Split, 
  MessageSquare, 
  Filter, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  color?: string;
}> = ({ title, description, icon: Icon, color = "text-brand-cyan" }) => (
  <div className="group p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-cyan/50 hover:shadow-lg transition-all duration-300">
    <div className={`w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-7 h-7 ${color}`} />
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-cyan transition-colors">
      {title}
    </h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export const Features: React.FC = () => {
  const featuresList = [
    {
      title: "Campaign Management",
      description: "Centralize your marketing efforts. Plan, execute, and monitor campaigns across WhatsApp, Email, and Social Media from a single unified dashboard.",
      icon: Megaphone,
      color: "text-blue-500"
    },
    {
      title: "Automation Flow Builder",
      description: "Design complex customer journeys with our visual drag-and-drop builder. Set triggers based on behavior, time, or custom events.",
      icon: Workflow,
      color: "text-brand-cyan"
    },
    {
      title: "Analytics Dashboard",
      description: "Make data-driven decisions with real-time insights. Track ROI, engagement rates, and delivery metrics with granular precision.",
      icon: BarChart3,
      color: "text-purple-500"
    },
    {
      title: "CRM-lite Management",
      description: "Keep your contacts organized. View detailed profiles, conversation history, and interaction tags without needing an external CRM.",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "A/B Testing",
      description: "Optimize your messaging. Automatically test different variations of content and subject lines to maximize conversion rates.",
      icon: Split,
      color: "text-orange-500"
    },
    {
      title: "Omnichannel Messaging",
      description: "Reach customers where they are. Seamlessly switch between WhatsApp, Email, SMS, and Social DMs in one conversation thread.",
      icon: MessageSquare,
      color: "text-pink-500"
    },
    {
      title: "Audience Segmentation",
      description: "Target the right people. Create dynamic segments based on user attributes, past purchase behavior, or engagement history.",
      icon: Filter,
      color: "text-yellow-500"
    },
    {
      title: "Instant AI Generation",
      description: "Never run out of ideas. Use our integrated Gemini AI to generate campaign strategies, copy, and creative assets in seconds.",
      icon: Zap,
      color: "text-indigo-500"
    }
  ];

  return (
    <div className="pb-20">
      {/* Hero Header */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden bg-slate-50 dark:bg-brand-darker">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Everything you need to <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">
              Scale Your Growth
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            MarketBridge AI provides a complete suite of tools to automate, analyze, and optimize your marketing campaigns.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto -mt-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuresList.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </section>

      {/* Feature Spotlight: Automation */}
      <section className="mt-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan text-sm font-medium mb-6">
              <Workflow className="w-4 h-4" /> Visual Builder
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Automate complex workflows without code
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Our intuitive drag-and-drop builder allows you to map out customer journeys visually. Set triggers for abandoned carts, welcome sequences, or re-engagement campaigns in minutes.
            </p>
            <ul className="space-y-4 mb-8">
              {['Multi-channel triggers', 'Conditional logic branching', 'Time-delay scheduling', 'Integration with external webhooks'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth?mode=signup">
               <Button>Start Building Now</Button>
            </Link>
          </div>
          
          {/* Visual Representation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-2xl blur-xl opacity-20" />
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
               <div className="flex flex-col gap-4">
                  {/* Mock Node 1 */}
                  <div className="mx-auto bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-64 flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-green-600">
                       <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-bold">Trigger</div>
                      <div className="font-medium text-sm">New Lead Detected</div>
                    </div>
                  </div>
                  
                  <div className="h-8 w-0.5 bg-slate-300 dark:bg-slate-700 mx-auto"></div>

                  {/* Mock Node 2 */}
                  <div className="mx-auto bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-64 flex items-center gap-3">
                    <div className="bg-brand-cyan/10 p-2 rounded text-brand-cyan">
                       <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase font-bold">Action</div>
                      <div className="font-medium text-sm">Send WhatsApp Welcome</div>
                    </div>
                  </div>

                  <div className="h-8 w-0.5 bg-slate-300 dark:bg-slate-700 mx-auto"></div>

                  {/* Mock Node 3 (Branch) */}
                  <div className="flex justify-center gap-8">
                     <div className="border-t-2 border-slate-300 dark:border-slate-700 w-16 mt-0"></div>
                  </div>
                  <div className="flex justify-center gap-4">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-32 text-center text-xs">
                         If Read
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-32 text-center text-xs">
                         If Ignored
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 px-6 lg:px-8">
         <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-cyan to-brand-blue rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[2px]" />
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your marketing stack?</h2>
               <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto mb-8">
                 Join thousands of forward-thinking brands using MarketBridge AI to drive growth and engagement.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link to="/auth?mode=signup">
                    <Button size="lg" className="bg-white text-brand-blue hover:bg-blue-50 w-full sm:w-auto">
                      Get Started for Free
                    </Button>
                 </Link>
                 <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white w-full sm:w-auto">
                      Contact Sales
                    </Button>
                 </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
