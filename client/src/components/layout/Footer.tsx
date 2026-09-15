import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube, Instagram, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Oral Interview', href: '/interview/new' },
      { label: 'Coding Playground', href: '/interview/coding/new' },
      { label: 'ATS Resume Match', href: '/ats' },
      { label: 'Career Roadmaps', href: '/roadmap' },
      { label: 'Role Communities', href: '/discuss' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Pricing Plans', href: '/#pricing' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Legal & Security',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Data Protection', href: '/privacy' },
      { label: 'Support Helpdesk', href: '/contact' },
    ],
  },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-white text-[#526078] border-t border-[#DCE7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 py-12 lg:py-16">
          <div className="col-span-2">
            <div className="mb-4">
              <Link to="/">
                <Logo size="sm" theme="light" />
              </Link>
            </div>
            <p className="text-xs text-[#526078] font-body max-w-xs leading-relaxed mb-6">
              Realistic mock interviews with uninflated feedback. Build authentic technical confidence and get placed.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-8 w-8 rounded-xl bg-[#EFFAFD] flex items-center justify-center hover:bg-[#4A8BDF] hover:text-white transition-all duration-200 text-[#526078] border border-[#DCE7F2]"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-[#11183D] font-display mb-4 uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        className="text-xs text-[#526078] hover:text-[#4A8BDF] transition-colors font-body"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-xs text-[#526078] hover:text-[#4A8BDF] transition-colors font-body"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold text-[#11183D] font-display mb-4 uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-xs text-[#526078] font-body mb-3 leading-relaxed">
              Receive calibrated interview tips & question blueprints.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Your email..."
                className="bg-[#EFFAFD] border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:border-[#4A8BDF] flex-1 min-w-0"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="h-8 w-8 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] flex items-center justify-center text-white transition-opacity shrink-0 shadow-sm"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#DCE7F2] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7B8799] font-body">
            © {new Date().getFullYear()} R U Ready? All rights reserved.
          </p>
          <p className="text-xs text-[#7B8799] font-body">
            Professional AI Career Technology. Built with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
