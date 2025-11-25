
import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';

export const WebsiteLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Products', path: '/products' },
    { name: 'Who We Support', path: '/who-we-support' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Partners', path: '/partners' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-darker text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name} 
                to={link.path}
                className={({isActive}) => `text-sm font-medium transition-colors hover:text-brand-cyan ${isActive ? 'text-brand-cyan' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/auth?mode=signin" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-cyan">
              Sign In
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
           <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-700 dark:text-slate-200"
                >
                  {link.name}
                </NavLink>
              ))}
              <hr className="border-slate-200 dark:border-slate-700" />
              <Link to="/auth?mode=signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start px-0">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
           </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
           <div>
             <Logo className="mb-4" />
             <p className="text-slate-500 dark:text-slate-400 text-sm">Empowering brands to connect authentically through AI-driven campaigns.</p>
           </div>
           <div>
             <h4 className="font-bold mb-4">Product</h4>
             <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
               <li>Features</li>
               <li>Integrations</li>
               <li>Pricing</li>
               <li>Changelog</li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold mb-4">Company</h4>
             <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
               <li>About Us</li>
               <li>Who We Support</li>
               <li>Careers</li>
               <li>Contact</li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold mb-4">Subscribe</h4>
             <div className="flex gap-2">
                <input placeholder="Email..." className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none outline-none text-sm" />
                <Button size="sm" className="px-3"><ArrowRight className="w-4 h-4" /></Button>
             </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
           © 2024 MarketBridge AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
