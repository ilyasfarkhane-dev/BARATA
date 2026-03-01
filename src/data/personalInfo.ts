// Types for personal info (data comes from personalInfo.json)

export type AboutStat = { value: number; suffix: string; label: string };

export type AboutContent = {
  label: string;
  headline: string;
  body: string;
  imageUrl: string;
  stats: AboutStat[];
};

export type SocialLink = { name: string; href: string };

export type ContactInfoItem = { label: string; value: string; href: string };

export type ContactContent = {
  label: string;
  headline: string;
  subheadline: string;
  contactInfo: ContactInfoItem[];
};
