
import React, { useState } from 'react';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { PlanTier } from '../../types';

interface AuthPageProps {
  onLogin: (role: 'USER' | 'ADMIN', plan?: PlanTier) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const selectedPlan = (searchParams.get('plan') as PlanTier) || 'Starter';
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      if (isAdminAuth) {
        onLogin('ADMIN');
        navigate('/admin');
      } else {
        // Pass the selected plan during login
        onLogin('USER', selectedPlan);
        navigate('/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col justify-center px-6 lg:px-20 py-12 bg-white dark:bg-slate-900 relative">
        <button onClick={() => navigate('/')} className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <Logo className="mb-8" />
            <div className="flex items-center gap-2 mb-2">
              {isAdminAuth && <ShieldCheck className="w-6 h-6 text-brand-cyan" />}
              <h2 className="text-3xl font-bold">
                {isAdminAuth ? 'Admin Portal' : (mode === 'signin' ? 'Welcome back' : 'Create an account')}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              {isAdminAuth 
                ? 'Secure access for platform administrators.'
                : (mode === 'signin' 
                  ? 'Enter your credentials to access your workspace.' 
                  : `Start your 14-day free trial on the ${selectedPlan} plan.`)
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isAdminAuth && mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all" placeholder="John Doe" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all" 
                placeholder={isAdminAuth ? "admin@marketbridge.ai" : "name@company.com"} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-brand-cyan focus:border-transparent outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              {isAdminAuth ? 'Access Dashboard' : (mode === 'signin' ? 'Sign In' : `Create ${selectedPlan} Account`)}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm space-y-4">
            {!isAdminAuth && (
              <div>
                <span className="text-slate-500">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button 
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="ml-2 font-medium text-brand-cyan hover:underline"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => {
                    setIsAdminAuth(!isAdminAuth);
                    setMode('signin'); // Admin is always signin
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium transition-colors"
              >
                {isAdminAuth ? '← Return to User Login' : 'Admin Access'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className={`hidden lg:flex flex-col justify-center items-center relative text-white p-20 overflow-hidden transition-colors duration-500 ${isAdminAuth ? 'bg-slate-950' : 'bg-slate-900'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-darker to-brand-dark z-0" />
        
        {/* Dynamic Background */}
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] blur-[120px] rounded-full mix-blend-screen transition-colors duration-700 ${isAdminAuth ? 'bg-red-500/10' : 'bg-brand-blue/20'}`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] blur-[100px] rounded-full mix-blend-screen transition-colors duration-700 ${isAdminAuth ? 'bg-orange-500/10' : 'bg-brand-cyan/20'}`} />
        
        <div className="relative z-10 max-w-lg">
          {isAdminAuth ? (
            <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                    SYSTEM_ACCESS_LEVEL: ROOT
                </div>
                <h2 className="text-4xl font-bold">Platform Control Center</h2>
                <p className="text-slate-400 text-lg">
                    Manage content, pricing, user roles, and system configurations from a centralized dashboard.
                </p>
            </div>
          ) : (
             <>
                <blockquote className="text-2xl font-medium leading-relaxed mb-8">
                    "MarketBridge AI completely transformed how we handle our multi-channel campaigns. The automation builder is simply world-class."
                </blockquote>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700" /> {/* Avatar Placeholder */}
                    <div>
                        <div className="font-bold">Sarah Jenkins</div>
                        <div className="text-slate-400 text-sm">CMO at TechFlow</div>
                    </div>
                </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
};
