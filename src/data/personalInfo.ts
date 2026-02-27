// About Me
export type AboutStat = { value: number; suffix: string; label: string };

export type AboutContent = {
  label: string;
  headline: string;
  body: string;
  imageUrl: string;
  stats: AboutStat[];
};

export const DEFAULT_ABOUT: AboutContent = {
  label: 'About Me',
  headline: 'Crafting Digital Experiences with Passion & Precision',
  body: "I'm a creative designer and developer with over 8 years of experience building beautiful, functional digital products. My approach combines aesthetic sensibility with technical expertise to create experiences that delight users and drive results.\n\nWhen I'm not designing, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the design community.",
  imageUrl: '/images/about-portrait.jpg',
  stats: [
    { value: 8, suffix: '+', label: 'Years Experience' },
    { value: 150, suffix: '+', label: 'Projects Completed' },
    { value: 50, suffix: '+', label: 'Happy Clients' },
  ],
};

// Social media
export type SocialLink = { name: string; href: string };

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Dribbble', href: '#' },
  { name: 'GitHub', href: '#' },
];

// Get In Touch / Contact
export type ContactInfoItem = { label: string; value: string; href: string };

export type ContactContent = {
  label: string;
  headline: string;
  subheadline: string;
  contactInfo: ContactInfoItem[];
};

export const DEFAULT_CONTACT: ContactContent = {
  label: 'Get In Touch',
  headline: "Let's Create Something Amazing Together",
  subheadline: "Have a project in mind? I'd love to hear about it. Send me a message and let's discuss how we can work together.",
  contactInfo: [
    { label: 'Email', value: 'hello@monogram.com', href: 'mailto:hello@monogram.com' },
    { label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { label: 'Location', value: 'San Francisco, CA', href: '#' },
  ],
};
