
import React, { useState } from 'react';
import { Mail, MapPin, MessageCircle, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const CONTACT_EMAIL = (import.meta as any).env?.VITE_CONTACT_EMAIL || '';
  const WHATSAPP_NUMBER = (import.meta as any).env?.VITE_WHATSAPP_NUMBER || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const handleWhatsAppClick = () => {
    if (!WHATSAPP_NUMBER) return;
    const text = encodeURIComponent("Hi MarketBridge Team, I'm interested in your platform.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[500px] bg-brand-cyan/5 blur-[100px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-blue neon-text">Touch</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Have questions about our enterprise plans or need technical support? We're here to help you scale.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            {status === 'success' ? (
              <div className="absolute inset-0 z-10 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setStatus('idle')}>Send Another Message</Button>
              </div>
            ) : null}

            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Subject</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none transition-all appearance-none"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="sales">Sales & Pricing</option>
                  <option value="support">Technical Support</option>
                  <option value="demo">Request a Demo</option>
                  <option value="partners">Partnership Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Message</label>
                <textarea 
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-cyan outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={status === 'submitting'}>
                <Send className="w-4 h-4 mr-2" /> Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info & WhatsApp */}
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {CONTACT_EMAIL && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Email Us</h4>
                      <p className="text-slate-600 dark:text-slate-400">{CONTACT_EMAIL}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Card */}
            {WHATSAPP_NUMBER && (
            <div className="p-8 rounded-2xl bg-[#25D366] text-white shadow-lg relative overflow-hidden group hover:shadow-[#25D366]/40 transition-shadow">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Chat on WhatsApp</h3>
                 </div>
                 <p className="text-white/90 mb-8 max-w-sm">
                   Need a quick answer? Chat directly with our sales team for instant support.
                 </p>
                 <button 
                   onClick={handleWhatsAppClick}
                   className="bg-white text-[#25D366] px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors w-full md:w-auto justify-center"
                 >
                   Start Conversation <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
            </div>
            )}

            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden h-64 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="relative z-10 text-slate-500 flex flex-col items-center">
                   <MapPin className="w-8 h-8 mb-2" />
                   <span className="font-medium">Interactive Map Module</span>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
    
