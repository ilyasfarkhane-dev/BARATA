import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split headline into words
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || '';
        const words = text.split(' ');
        headlineRef.current.innerHTML = words.map(word => 
          `<span class="inline-block overflow-hidden mr-[0.25em]"><span class="headline-word inline-block">${word}</span></span>`
        ).join(' ');

        const wordElements = headlineRef.current.querySelectorAll('.headline-word');

        // Entrance timeline
        const tl = gsap.timeline({ delay: 0.5 });

        // Gradient orbs fade in
        tl.fromTo([orb1Ref.current, orb2Ref.current],
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
          0
        );

        // Headline words clip reveal
        tl.fromTo(wordElements,
          { y: '100%', opacity: 0 },
          { 
            y: '0%', 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.08, 
            ease: 'power4.out' 
          },
          0.3
        );

        // Subheadline fade in
        tl.fromTo(subheadlineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power4.out' },
          1.2
        );

        // CTAs scale pop
        if (ctaRef.current) {
          const buttons = ctaRef.current.querySelectorAll('button');
          tl.fromTo(buttons,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
            1.4
          );
        }

        // Scroll indicator
        tl.fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' },
          1.8
        );

        // Scroll-triggered parallax
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(headlineRef.current, { y: -80 * progress, opacity: 1 - progress * 1.5 });
            gsap.set(subheadlineRef.current, { y: -120 * progress, opacity: 1 - progress * 1.5 });
            gsap.set(ctaRef.current, { y: -60 * progress, opacity: 1 - progress * 2 });
            gsap.set([orb1Ref.current, orb2Ref.current], { opacity: 0.15 - progress * 0.1 });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Floating animation for orbs
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(orb1Ref.current, {
        x: 30,
        y: -20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(orb2Ref.current, {
        x: -20,
        y: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    const about = document.getElementById('about');
    about?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    const portfolio = document.getElementById('portfolio');
    portfolio?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-6 sm:px-8 lg:px-12"
    >
      {/* Animated Gradient Orbs */}
      <div
        ref={orb1Ref}
        className="absolute w-[600px] h-[600px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,208,132,0.15) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          filter: 'blur(60px)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute w-[500px] h-[500px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,160,101,0.12) 0%, transparent 70%)',
          bottom: '20%',
          right: '15%',
          filter: 'blur(50px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-8 sm:px-10 lg:px-16 flex flex-col items-center justify-center text-center">
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6"
        >
          I design Digital Experiences That Feel Intuitive and Engaging
        </h1>

        <p
          ref={subheadlineRef}
          className="text-lg md:text-xl text-[#999] max-w-[600px] mx-auto mb-10 opacity-0"
        >
          Creative designer & developer crafting beautiful digital products that make a lasting impression
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <button
            onClick={scrollToPortfolio}
            className="group flex items-center gap-2 px-8 py-4 bg-[#00D084] text-black font-semibold rounded-lg transition-all duration-300 hover:bg-[#00A065] hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,208,132,0.4)]"
          >
            View My Work
            <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 px-8 py-4 border border-[#333] text-white font-semibold rounded-lg transition-all duration-300 hover:border-[#00D084] hover:text-[#00D084]"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-0 group"
      >
        <span className="text-sm text-[#666] transition-colors duration-300 group-hover:text-[#999]">
          Scroll to explore
        </span>
        <div className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center transition-all duration-300 group-hover:border-[#00D084] group-hover:bg-[#00D084]/10">
          <ArrowDown size={18} className="text-[#666] transition-colors duration-300 group-hover:text-[#00D084] animate-bounce-scroll" />
        </div>
      </div>
    </section>
  );
}
