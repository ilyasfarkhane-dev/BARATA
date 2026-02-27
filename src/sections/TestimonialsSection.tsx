import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "An exceptional designer who truly understands both aesthetics and functionality. Our conversion rate increased by 40% after the redesign.",
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    avatar: "/images/avatar-1.jpg",
  },
  {
    quote: "Professional, creative, and incredibly detail-oriented. Delivered beyond our expectations on every milestone.",
    name: "Michael Chen",
    role: "Product Manager, InnovateCo",
    avatar: "/images/avatar-2.jpg",
  },
  {
    quote: "The best investment we made for our brand. The new identity perfectly captures our company's vision and values.",
    name: "Emily Davis",
    role: "Marketing Director, GrowthLabs",
    avatar: "/images/avatar-3.jpg",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Header
      tl.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power4.out' }
      );

      // Quote icons pop
      if (cardsRef.current) {
        const quotes = cardsRef.current.querySelectorAll('.quote-icon');
        tl.fromTo(quotes,
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' },
          '-=0.2'
        );

        // Cards slide up
        const cards = cardsRef.current.querySelectorAll('.testimonial-card');
        tl.fromTo(cards,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power4.out' },
          '-=0.3'
        );

        // Avatars scale in
        const avatars = cardsRef.current.querySelectorAll('.avatar');
        tl.fromTo(avatars,
          { scale: 0 },
          { scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(1.7)' },
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
            const cards = cardsRef.current.querySelectorAll('.testimonial-card');
            cards.forEach((card, i) => {
              gsap.set(card, { y: progress * (15 + i * 15) });
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-black overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block text-[#00D084] font-medium text-sm tracking-wider uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            What Clients Say About Working With Me
          </h2>
        </div>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group relative p-8 bg-[#111] border border-[#222] rounded-2xl transition-all duration-300 hover:border-[#00D084] hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,208,132,0.1)]"
            >
              {/* Quote Icon */}
              <div className="quote-icon w-12 h-12 mb-6 rounded-xl bg-[#00D084]/10 flex items-center justify-center animate-float-gentle">
                <Quote size={20} className="text-[#00D084]" />
              </div>

              {/* Quote Text */}
              <p className="text-white leading-relaxed mb-8 text-lg">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="avatar relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#222] group-hover:border-[#00D084] transition-colors duration-300"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-[#00D084] opacity-0 group-hover:opacity-100 animate-glow-pulse transition-opacity duration-300" />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-[#666]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
