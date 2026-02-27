import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });

      // Border draw
      tl.fromTo(borderRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power4.out' }
      );

      // Content fade in
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.footer-item');
        tl.fromTo(elements,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          '-=0.3'
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-black py-10"
    >
      {/* Top Border */}
      <div
        ref={borderRef}
        className="absolute top-0 left-0 right-0 h-px bg-[#222] origin-left"
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div
          ref={contentRef}
          className="flex flex-col md:flex-row items-center justify-between "
        >
          {/* Logo */}
          <a href="#home" className="footer-item ">
            <img
              src="/images/ob-log.png"
              alt="Logo"
              className="h-[100px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />

          </a>

          {/* Copyright */}
          <div className="footer-item text-sm text-[#666]">
            © 2026 Othmane Barata. All rights reserved.
          </div>

          {/* Links */}
          <div className="footer-item flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm text-[#666] transition-all duration-200 hover:text-[#00D084] relative group"
            >
              Dashboardhghghh
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#00D084] transition-all duration-200 group-hover:w-full" />
            </Link>
           
          </div>
        </div>
      </div>
    </footer>
  );
}
