import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProjects } from '../context/ProjectsContext';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const { about } = useProjects();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  const stats = about.stats;
  const bodyParagraphs = about.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (bodyParagraphs.length === 0) bodyParagraphs.push('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split headline into words
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || '';
        const words = text.split(' ');
        headlineRef.current.innerHTML = words.map(word =>
          `<span class="inline-block overflow-hidden mr-[0.25em]"><span class="about-word inline-block">${word}</span></span>`
        ).join(' ');
      }

      // Create scroll-triggered entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Label typewriter effect
      tl.fromTo(labelRef.current,
        { width: 0, opacity: 0 },
        { width: 'auto', opacity: 1, duration: 0.4, ease: 'none' }
      );

      // Headline words stagger
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.about-word');
        tl.fromTo(words,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power4.out' },
          '-=0.2'
        );
      }

      // Body text lines
      if (bodyRef.current) {
        const paragraphs = bodyRef.current.querySelectorAll('p');
        tl.fromTo(paragraphs,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          '-=0.3'
        );
      }

      // Image 3D tilt in
      tl.fromTo(imageRef.current,
        { rotateY: -15, x: -50, opacity: 0 },
        { rotateY: 0, x: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        0.2
      );

      // Accent line draw
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength?.() || 200;
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(lineRef.current,
          { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' },
          0.5
        );
      }

      // Stats counter animation
      if (statsRef.current && stats.length > 0) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        tl.fromTo(statItems,
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power4.out' },
          0.6
        );

        statItems.forEach((item, index) => {
          const numberEl = item.querySelector('.stat-number');
          if (numberEl && stats[index]) {
            const targetValue = stats[index].value;
            const suffix = stats[index].suffix;
            const obj = { value: 0 };
            gsap.to(obj, {
              value: targetValue,
              duration: 1.5,
              delay: 0.8 + index * 0.1,
              ease: 'power4.out',
              onUpdate: () => {
                numberEl.textContent = Math.round(obj.value) + suffix;
              },
            });
          }
        });
      }

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress - 0.5;
          gsap.set(imageRef.current, { y: progress * 60 });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [about]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#111] overflow-hidden"
    >
      {/* Decorative accent line */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <line
          ref={lineRef}
          x1="0"
          y1="0"
          x2="200"
          y2="0"
          stroke="#00D084"
          strokeWidth="2"
          className="opacity-30"
        />
      </svg>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <div
            ref={imageRef}
            className="relative order-2 lg:order-1"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={about.imageUrl || '/images/about-portrait.jpg'}
                alt="About portrait"
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#00D084]/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#00D084]/10 rounded-xl -z-10" />
          </div>

          {/* Content Column */}
          <div className="order-1 lg:order-2">
            <span
              ref={labelRef}
              className="inline-block text-[#00D084] font-medium text-sm tracking-wider uppercase mb-4 overflow-hidden whitespace-nowrap"
            >
              {about.label}
            </span>

            <h2
              ref={headlineRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            >
              {about.headline}
            </h2>

            <div ref={bodyRef} className="space-y-4 text-[#999] leading-relaxed mb-10">
              {bodyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item text-center lg:text-left">
                  <div className="stat-number text-3xl md:text-4xl font-bold text-[#00D084] mb-1">
                    0{stat.suffix}
                  </div>
                  <div className="text-sm text-[#666]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
