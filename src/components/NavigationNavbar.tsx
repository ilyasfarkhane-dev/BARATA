import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  User,
  Layers,
  Mail,
  Twitter,
  Linkedin,
  Dribbble,
  Github,
  Menu,
  X,
} from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';

const navLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Services', href: '#services', icon: Layers },
  { name: 'Contact', href: '#contact', icon: Mail },
];

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Twitter,
  LinkedIn: Linkedin,
  Linkedin,
  Dribbble,
  GitHub: Github,
  Github,
};

export function NavigationNavbar() {
  const { pathname } = useLocation();
  const { socialLinks } = useProjects();
  const isHome = pathname === '/';
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power4.out' }
      );

      tl.fromTo(logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' },
        '-=0.3'
      );

      if (linksRef.current) {
        const links = linksRef.current.querySelectorAll('li');
        tl.fromTo(links,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power4.out' },
          '-=0.2'
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.map(link => link.href.slice(1));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isHome) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[1100] p-3 bg-[#111] rounded-lg border border-[#222] lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navbar */}
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-md border-b border-[#222]' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div ref={logoRef}>
              {isHome ? (
                <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="block">
                  <img
                    src="/images/ob-log.png"
                    alt="Logo"
                    className="h-[100px] w-auto object-contain transition-transform duration-300 hover:scale-105"
                  />
                </a>
              ) : (
                <Link to="/#home" onClick={() => setIsOpen(false)} className="block">
                  <img
                    src="/images/ob-log.png"
                    alt="Logo"
                    className="h-[100px] w-auto object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <ul ref={linksRef} className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const sectionId = link.href.slice(1);
                const isActive = isHome && activeSection === sectionId;
                const className = `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group relative ${
                  isActive ? 'text-[#00D084]' : 'text-[#999] hover:text-white'
                }`;
                return (
                  <li key={link.name}>
                    {isHome ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={className}
                      >
                        <Icon size={16} className="transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">{link.name}</span>
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00D084] rounded-full" />
                        )}
                      </a>
                    ) : (
                      <Link to={`/#${sectionId}`} onClick={() => setIsOpen(false)} className={className}>
                        <Icon size={16} className="transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-medium">{link.name}hh</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Right section: Social + CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICON_MAP[social.name] ?? Dribbble;
                  return (
                    <a
                      key={social.name + social.href}
                      href={social.href}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center text-[#999] transition-all duration-300 hover:text-[#00D084] hover:border-[#00D084] hover:scale-110"
                      aria-label={social.name}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
              {isHome ? (
                <button
                  onClick={() => {
                    const contact = document.getElementById('contact');
                    contact?.scrollIntoView({ behavior: 'smooth' });
                    setIsOpen(false);
                  }}
                  className="py-2.5 px-5 bg-[#00D084] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00A065] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]"
                >
                  Let&apos;s Talk
                </button>
              ) : (
                <Link
                  to="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-5 bg-[#00D084] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00A065] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]"
                >
                  Let&apos;s Talk
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`fixed top-0 right-0 w-[280px] h-full bg-black border-l border-[#222] z-[999] transform transition-transform duration-300 lg:hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-20 px-6">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const sectionId = link.href.slice(1);
                const isActive = isHome && activeSection === sectionId;
                const className = `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-[#00D084]/10 text-[#00D084]' : 'text-[#999] hover:text-white hover:bg-[#1A1A1A]'
                }`;
                return (
                  <li key={link.name}>
                    {isHome ? (
                      <a href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={className}>
                        <Icon size={18} />
                        <span className="font-medium">{link.name}</span>
                      </a>
                    ) : (
                      <Link to={`/#${sectionId}`} onClick={() => setIsOpen(false)} className={className}>
                        <Icon size={18} />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.name] ?? Dribbble;
                return (
                  <a
                    key={social.name + social.href}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-10 h-10 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center text-[#999] transition-all duration-300 hover:text-[#00D084] hover:border-[#00D084]"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            {isHome ? (
              <button
                onClick={() => {
                  const contact = document.getElementById('contact');
                  contact?.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }}
                className="w-full mt-6 py-3 bg-[#00D084] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00A065]"
              >
                Let&apos;s Talk
              </button>
            ) : (
              <Link
                to="/#contact"
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-3 bg-[#00D084] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00A065] block text-center"
              >
                Let&apos;s Talk
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
