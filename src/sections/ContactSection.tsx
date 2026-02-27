import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Twitter, Linkedin, Dribbble, Github, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO_ICONS: Record<string, LucideIcon> = {
  Email: Mail,
  Phone,
  Location: MapPin,
};

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Twitter,
  LinkedIn: Linkedin,
  Linkedin,
  Dribbble,
  GitHub: Github,
  Github,
};

export function ContactSection() {
  const { contact, socialLinks } = useProjects();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split headline
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || '';
        const words = text.split(' ');
        headlineRef.current.innerHTML = words.map(word => 
          `<span class="inline-block overflow-hidden mr-[0.25em]"><span class="contact-word inline-block">${word}</span></span>`
        ).join(' ');
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Label typewriter
      tl.fromTo(labelRef.current,
        { width: 0, opacity: 0 },
        { width: 'auto', opacity: 1, duration: 0.3, ease: 'none' }
      );

      // Headline words
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.contact-word');
        tl.fromTo(words,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power4.out' },
          '-=0.1'
        );
      }

      // Subheadline
      tl.fromTo(subheadlineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.3'
      );

      // Contact info items
      if (infoRef.current) {
        const items = infoRef.current.querySelectorAll('.contact-item');
        tl.fromTo(items,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power4.out' },
          '-=0.2'
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

      // Form
      if (formRef.current) {
        tl.fromTo(formRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'power4.out' },
          0.3
        );

        // Form inputs
        const inputs = formRef.current.querySelectorAll('.form-field');
        tl.fromTo(inputs,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          '-=0.4'
        );

        // Submit button
        const submitBtn = formRef.current.querySelector('button[type="submit"]');
        tl.fromTo(submitBtn,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.2'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#111] overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(0,208,132,0.3) 0%, transparent 70%)',
          bottom: '-100px',
          right: '-100px',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <div>
            <span
              ref={labelRef}
              className="inline-block text-[#00D084] font-medium text-sm tracking-wider uppercase mb-4 overflow-hidden whitespace-nowrap"
            >
              Get In Touch
            </span>

            <h2
              ref={headlineRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              {contact.headline}
            </h2>

            <p ref={subheadlineRef} className="text-[#999] mb-10">
              {contact.subheadline}
            </p>

            {/* Contact Info */}
            <div ref={infoRef} className="space-y-4 mb-8">
              {contact.contactInfo.map((item, index) => {
                const Icon = CONTACT_INFO_ICONS[item.label] ?? Mail;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="contact-item flex items-center gap-4 p-4 rounded-xl bg-black border border-[#222] transition-all duration-300 hover:border-[#00D084] hover:bg-[#1A1A1A] group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#00D084]/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <Icon size={18} className="text-[#00D084]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#666]">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            <div ref={socialRef}>
              <div className="text-sm text-[#666] mb-3">Follow me on</div>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICON_MAP[social.name] ?? Dribbble;
                  return (
                    <a
                      key={social.name + social.href}
                      href={social.href}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={social.name}
                      className="w-10 h-10 rounded-lg bg-black border border-[#222] flex items-center justify-center text-[#999] transition-all duration-300 hover:text-[#00D084] hover:border-[#00D084] hover:scale-110 hover:rotate-[10deg]"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="form-field relative">
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'name' || formData.name
                      ? 'top-2 text-xs text-[#00D084]'
                      : 'top-1/2 -translate-y-1/2 text-[#666]'
                  }`}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pt-6 pb-3 px-4 bg-black border border-[#222] rounded-xl text-white outline-none transition-all duration-200 focus:border-[#00D084] focus:shadow-[0_0_20px_rgba(0,208,132,0.1)]"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-field relative">
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focusedField === 'email' || formData.email
                      ? 'top-2 text-xs text-[#00D084]'
                      : 'top-1/2 -translate-y-1/2 text-[#666]'
                  }`}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pt-6 pb-3 px-4 bg-black border border-[#222] rounded-xl text-white outline-none transition-all duration-200 focus:border-[#00D084] focus:shadow-[0_0_20px_rgba(0,208,132,0.1)]"
                  required
                />
              </div>
            </div>

            {/* Subject */}
            <div className="form-field relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === 'subject' || formData.subject
                    ? 'top-2 text-xs text-[#00D084]'
                    : 'top-1/2 -translate-y-1/2 text-[#666]'
                }`}
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                className="w-full pt-6 pb-3 px-4 bg-black border border-[#222] rounded-xl text-white outline-none transition-all duration-200 focus:border-[#00D084] focus:shadow-[0_0_20px_rgba(0,208,132,0.1)]"
                required
              />
            </div>

            {/* Message */}
            <div className="form-field relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focusedField === 'message' || formData.message
                    ? 'top-2 text-xs text-[#00D084]'
                    : 'top-4 text-[#666]'
                }`}
              >
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows={5}
                className="w-full pt-6 pb-3 px-4 bg-black border border-[#222] rounded-xl text-white outline-none transition-all duration-200 focus:border-[#00D084] focus:shadow-[0_0_20px_rgba(0,208,132,0.1)] resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-8 bg-[#00D084] text-black font-semibold rounded-xl transition-all duration-300 hover:bg-[#00A065] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,208,132,0.4)] flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10">Send Message</span>
              <Send size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
