
import React from 'react';
import { Target, Lightbulb, Building2, MapPin, Globe, Users } from 'lucide-react';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-cyan/5 blur-[100px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">MarketBridge AI</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Bridging the gap between brands and their audiences through intelligent, unified marketing technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-brand-blue rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-brand-blue">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                At MarketBridge AI, our mission is to empower businesses of every size with intelligent, unified marketing tools that simplify communication, enhance customer engagement, and accelerate growth. We aim to bridge the gap between brands and their audiences by delivering powerful automation, real-time insights, and seamless omnichannel connectivity.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Vision</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We envision a world where marketing teams can build meaningful customer relationships without the complexity of scattered tools. MarketBridge AI strives to be the leading platform where innovation, data, and automation converge—enabling marketers to work smarter, scale faster, and create campaigns that truly resonate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-brand-cyan" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Company Story</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                   <MapPin className="w-5 h-5" />
                   <span>London, United Kingdom</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                   <Globe className="w-5 h-5" />
                   <span>Est. 2023</span>
                </div>
              </div>
              <div className="mt-8 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                 <p className="font-semibold text-lg mb-2">Matrix Infotech Ltd</p>
                 <p className="text-sm text-slate-500">Parent Company</p>
              </div>
            </div>

            <div className="lg:col-span-8 text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
              <p>
                MarketBridge AI is a flagship brand of <strong className="text-slate-900 dark:text-white">Matrix Infotech Ltd</strong>, headquartered in London, United Kingdom. Established in 2023, Matrix Infotech Ltd was founded with a commitment to shaping the future of digital transformation through powerful, scalable, and intelligent technology solutions.
              </p>
              <p>
                As businesses expanded across multiple communication channels—WhatsApp, Facebook, Instagram, SMS, email, and more—they faced increasing challenges managing campaigns, analyzing customer behavior, and staying consistent across platforms. Recognizing this growing need, Matrix Infotech Ltd launched MarketBridge AI, an all-in-one marketing automation and campaign management platform designed for the modern digital ecosystem.
              </p>
              <blockquote className="border-l-4 border-brand-cyan pl-6 italic text-slate-800 dark:text-slate-200 my-8 text-lg">
                "Our goal was simple: Make marketing smarter, faster, and easier."
              </blockquote>
              <p>
                Since its creation, MarketBridge AI has continued to evolve into a robust platform that unifies messaging, analytics, automation workflows, and audience management—allowing marketing teams to operate from a single, powerful hub. Today, businesses across industries trust MarketBridge AI to elevate their digital presence, streamline workflows, and connect with customers more meaningfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Team Placeholder (implied by typical About pages) */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto text-center">
         <h2 className="text-3xl font-bold mb-12 text-slate-900 dark:text-white">Leadership</h2>
         <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
               <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 mb-4 overflow-hidden">
                     {/* Placeholder for images */}
                     <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Users className="w-8 h-8" />
                     </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Executive Name</h3>
                  <p className="text-brand-cyan text-sm mb-4">Position Title</p>
                  <p className="text-sm text-slate-500">
                     Experienced leader committed to driving innovation and customer success at MarketBridge AI.
                  </p>
               </div>
            ))}
         </div>
         <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">Ready to join the future of marketing?</h3>
            <div className="flex justify-center gap-4">
               <Link to="/auth?mode=signup">
                  <Button size="lg">Get Started</Button>
               </Link>
               <Link to="/contact">
                  <Button size="lg" variant="outline">Contact Us</Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};
