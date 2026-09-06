import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube, Instagram, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Oral Interview', href: '/interview/new' },
      { label: 'Coding Playground', href: '/interview/coding/new' },
      { label: 'Performance Report', href: '/history' },
      { label: 'Socratic Engine', href: '/#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security Bar', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 py-12 lg:py-16">
          <div className="col-span-2">
            <div className="mb-4">
              <Link to="/">
                <Logo size="sm" theme="light" />
              </Link>
            </div>
            <p className="text-xs text-slate-500 font-body max-w-xs leading-relaxed mb-6">
              Realistic mock interviews with uninflated feedback. Build authentic technical confidence and get hired.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-200 text-slate-600"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-slate-900 font-display mb-4 uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-slate-500 hover:text-primary-500 transition-colors font-body"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold text-slate-900 font-display mb-4 uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-500 font-body mb-3 leading-relaxed">
              Receive calibrated interview tips & question blueprints.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Your email..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 flex-1 min-w-0"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="h-8 w-8 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white hover:brightness-105 transition-opacity shrink-0 shadow-sm"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-body">
            © {new Date().getFullYear()} RU READY? All rights reserved.
          </p>
          <p className="text-xs text-slate-500 font-body">
            Built with purpose. Powered by Neon Postgres & AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
