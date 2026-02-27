import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Code, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive, beautiful interfaces that users love. From wireframes to high-fidelity prototypes.',
  },
  {
    icon: Code,
    title: 'Web Development',
    description: 'Building fast, responsive websites with modern technologies and best practices.',
  },
  {
    icon: Sparkles,
    title: 'Brand Identity',
    description: 'Crafting memorable brand experiences that tell your story and connect with audiences.',
  },
];

interface ServiceCardProps {
  service: typeof services[0];
}

function ServiceCard({ service }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const Icon = service.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform({ rotateX: -rotateX, rotateY: -rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="service-card group relative p-8 bg-black border border-[#222] rounded-2xl transition-all duration-300 hover:border-[#00D084] hover:shadow-[0_20px_40px_rgba(0,208,132,0.1)]"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateZ(20px)`,
        transition: 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Icon */}
      <div className="w-14 h-14 mb-6 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#00D084] group-hover:bg-[#00D084]/10">
        <Icon size={24} className="text-[#00D084]" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-[#00D084]">
        {service.title}
      </h3>
      <p className="text-[#999] leading-relaxed">
        {service.description}
      </p>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D084]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split headline
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || '';
        const words = text.split(' ');
        headlineRef.current.innerHTML = words.map(word => 
          `<span class="inline-block overflow-hidden mr-[0.25em]"><span class="service-word inline-block">${word}</span></span>`
        ).join(' ');
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Label
      tl.fromTo(labelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power4.out' }
      );

      // Headline words
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.service-word');
        tl.fromTo(words,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power4.out' },
          '-=0.2'
        );
      }

      // Underline draw
      tl.fromTo(underlineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power4.out' },
        '-=0.3'
      );

      // Cards 3D flip in
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.service-card');
        tl.fromTo(cards,
          { rotateX: -30, y: 50, opacity: 0 },
          { rotateX: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out' },
          '-=0.2'
        );

        // Icons pop
        const icons = cardsRef.current.querySelectorAll('.service-card > div:first-child');
        tl.fromTo(icons,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.5, stagger: 0.15, ease: 'elastic.out(1, 0.5)' },
          '-=0.4'
        );
      }

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress - 0.5;
          if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll('.service-card');
            cards.forEach((card, i) => {
              gsap.set(card, { y: progress * (20 + i * 20) });
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-black overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            ref={labelRef}
            className="inline-block text-[#00D084] font-medium text-sm tracking-wider uppercase mb-4"
          >
            What I Do
          </span>

          <h2
            ref={headlineRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Services That Bring Your Vision to Life
          </h2>

          <div
            ref={underlineRef}
            className="w-24 h-1 bg-[#00D084] mx-auto rounded-full origin-center"
          />
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ perspective: '1000px' }}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
