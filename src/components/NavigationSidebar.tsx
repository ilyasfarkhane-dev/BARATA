import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Home, 
  User, 
  Briefcase, 
  Layers, 
  Mail, 
  Twitter, 
  Linkedin, 
  Dribbble, 
  Github,
  Menu,
  X
} from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About', href: '#about', icon: User },
  { name: 'Portfolio', href: '#portfolio', icon: Briefcase },
  { name: 'Services', href: '#services', icon: Layers },
  { name: 'Contact', href: '#contact', icon: Mail },
];

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Dribbble', href: '#', icon: Dribbble },
  { name: 'GitHub', href: '#', icon: Github },
];

export function NavigationSidebar() {
  const sidebarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Sidebar slide in
      tl.fromTo(sidebarRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }
      );

      // Logo animation
      tl.fromTo(logoRef.current,
        { scale: 0.5, rotation: -10, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.4'
      );

      // Nav links stagger
      if (navRef.current) {
        const links = navRef.current.querySelectorAll('li');
        tl.fromTo(links,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power4.out' },
          '-=0.3'
        );
      }

      // Social icons
      if (socialRef.current) {
        const icons = socialRef.current.querySelectorAll('a');
        tl.fromTo(icons,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'elastic.out(1, 0.5)' },
          '-=0.2'
        );
      }

      // CTA button
      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power4.out' },
        '-=0.2'
      );
    });

    return () => ctx.revert();
  }, []);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
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
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[1100] p-3 bg-[#111] rounded-lg border border-[#222] lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-screen w-[280px] bg-black border-r border-[#222] z-[1000] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div ref={logoRef} className="p-8">
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-[#00D084] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,208,132,0.4)]">
              <span className="text-black font-bold text-lg">mo</span>
            </div>
            <span className="text-xl font-semibold text-white">Monogram</span>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-6">
          <ul ref={navRef} className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-[#00D084]/10 text-[#00D084]' 
                        : 'text-[#999] hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{link.name}</span>
                    <span className={`absolute bottom-2 left-4 h-[2px] bg-[#00D084] transition-all duration-300 ${
                      isActive ? 'w-8' : 'w-0 group-hover:w-8'
                    }`} />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Social Icons */}
        <div ref={socialRef} className="px-8 py-6">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center text-[#999] transition-all duration-300 hover:text-[#00D084] hover:border-[#00D084] hover:scale-110 hover:rotate-[10deg]"
                  aria-label={social.name}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="p-8 pt-0">
          <button
            ref={ctaRef}
            onClick={() => {
              const contact = document.getElementById('contact');
              contact?.scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false);
            }}
            className="w-full py-3 px-6 bg-[#00D084] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00A065] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,208,132,0.3)] relative overflow-hidden group"
          >
            <span className="relative z-10">Let's Talk</span>
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </div>
      </aside>
    </>
  );
}
