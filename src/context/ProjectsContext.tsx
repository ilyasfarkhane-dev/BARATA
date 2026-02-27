import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  projects as defaultProjects,
  PROJECT_CATEGORIES,
  type Project,
} from '../data/projects';
import {
  DEFAULT_ABOUT,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_CONTACT,
  type AboutContent,
  type SocialLink,
  type ContactContent,
} from '../data/personalInfo';

export type { AboutContent, AboutStat, SocialLink, ContactContent, ContactInfoItem } from '../data/personalInfo';

const PROJECTS_STORAGE_KEY = 'portfolio_projects';
const CATEGORIES_STORAGE_KEY = 'portfolio_categories';
const ABOUT_STORAGE_KEY = 'portfolio_about';
const SOCIAL_STORAGE_KEY = 'portfolio_social';
const CONTACT_STORAGE_KEY = 'portfolio_contact';

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return defaultProjects;
}

function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [...PROJECT_CATEGORIES];
}

function loadAbout(): AboutContent {
  try {
    const raw = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AboutContent;
      if (parsed && typeof parsed.label === 'string' && Array.isArray(parsed.stats)) {
        return {
          label: parsed.label ?? DEFAULT_ABOUT.label,
          headline: parsed.headline ?? DEFAULT_ABOUT.headline,
          body: parsed.body ?? DEFAULT_ABOUT.body,
          imageUrl: parsed.imageUrl ?? DEFAULT_ABOUT.imageUrl,
          stats: (parsed.stats.length >= 3 ? parsed.stats : DEFAULT_ABOUT.stats).slice(0, 3).map((s) => ({
            value: Number(s?.value) || 0,
            suffix: String(s?.suffix ?? ''),
            label: String(s?.label ?? ''),
          })),
        };
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_ABOUT };
}

function loadSocialLinks(): SocialLink[] {
  try {
    const raw = localStorage.getItem(SOCIAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SocialLink[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [...DEFAULT_SOCIAL_LINKS];
}

function loadContact(): ContactContent {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ContactContent;
      if (parsed && typeof parsed.label === 'string' && Array.isArray(parsed.contactInfo)) {
        return {
          label: parsed.label ?? DEFAULT_CONTACT.label,
          headline: parsed.headline ?? DEFAULT_CONTACT.headline,
          subheadline: parsed.subheadline ?? DEFAULT_CONTACT.subheadline,
          contactInfo: (parsed.contactInfo?.length ? parsed.contactInfo : DEFAULT_CONTACT.contactInfo).map((c) => ({
            label: String(c?.label ?? ''),
            value: String(c?.value ?? ''),
            href: String(c?.href ?? '#'),
          })),
        };
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONTACT, contactInfo: [...DEFAULT_CONTACT.contactInfo] };
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function saveCategories(categories: string[]) {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

function saveAbout(about: AboutContent) {
  localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(about));
}

function saveSocialLinks(links: SocialLink[]) {
  localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(links));
}

function saveContact(contact: ContactContent) {
  localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

type ProjectsContextValue = {
  projects: Project[];
  categories: string[];
  about: AboutContent;
  socialLinks: SocialLink[];
  contact: ContactContent;
  updateAbout: (updates: Partial<AboutContent>) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
  updateContact: (updates: Partial<ContactContent>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  addCategory: (name: string) => boolean;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => boolean;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [categories, setCategories] = useState<string[]>(loadCategories);
  const [about, setAbout] = useState<AboutContent>(loadAbout);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(loadSocialLinks);
  const [contact, setContact] = useState<ContactContent>(loadContact);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveAbout(about);
  }, [about]);

  useEffect(() => {
    saveSocialLinks(socialLinks);
  }, [socialLinks]);

  useEffect(() => {
    saveContact(contact);
  }, [contact]);

  const updateAbout = useCallback((updates: Partial<AboutContent>) => {
    setAbout((prev) => ({
      ...prev,
      ...updates,
      stats: updates.stats !== undefined ? updates.stats : prev.stats,
    }));
  }, []);

  const updateSocialLinks = useCallback((links: SocialLink[]) => {
    setSocialLinks(links);
  }, []);

  const updateContact = useCallback((updates: Partial<ContactContent>) => {
    setContact((prev) => ({
      ...prev,
      ...updates,
      contactInfo: updates.contactInfo !== undefined ? updates.contactInfo : prev.contactInfo,
    }));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    setProjects((prev) => {
      const baseId = slugify(project.title);
      const ids = new Set(prev.map((p) => p.id));
      let id = baseId;
      let n = 0;
      while (ids.has(id)) {
        n += 1;
        id = `${baseId}-${n}`;
      }
      return [...prev, { ...project, id }];
    });
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProjectById = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const addCategory = useCallback((name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (categories.some((c) => c === trimmed)) return false;
    setCategories((prev) => [...prev, trimmed]);
    return true;
  }, [categories]);

  const updateCategory = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    setCategories((prev) =>
      prev.map((c) => (c === oldName ? trimmed : c))
    );
    setProjects((prev) =>
      prev.map((p) => (p.category === oldName ? { ...p, category: trimmed } : p))
    );
  }, []);

  const deleteCategory = useCallback((name: string): boolean => {
    const inUse = projects.some((p) => p.category === name);
    if (inUse) return false;
    setCategories((prev) => prev.filter((c) => c !== name));
    return true;
  }, [projects]);

  const value = useMemo(
    () => ({
      projects,
      categories,
      about,
      socialLinks,
      contact,
      updateAbout,
      updateSocialLinks,
      updateContact,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      projects,
      categories,
      about,
      socialLinks,
      contact,
      updateAbout,
      updateSocialLinks,
      updateContact,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      addCategory,
      updateCategory,
      deleteCategory,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
}
