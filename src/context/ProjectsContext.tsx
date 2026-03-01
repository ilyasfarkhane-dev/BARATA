import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { Project } from '../data/projects';
import projectsJson from '../data/projects.json';
import personalInfoJson from '../data/personalInfo.json';
import type { AboutContent, SocialLink, ContactContent } from '../data/personalInfo';

export type { AboutContent, AboutStat, SocialLink, ContactContent, ContactInfoItem } from '../data/personalInfo';

const projects = projectsJson.projects as Project[];
const categories = projectsJson.categories as string[];
const about = personalInfoJson.about as AboutContent;
const socialLinks = personalInfoJson.socialLinks as SocialLink[];
const contact = personalInfoJson.contact as ContactContent;

type ProjectsContextValue = {
  projects: Project[];
  categories: string[];
  about: AboutContent;
  socialLinks: SocialLink[];
  contact: ContactContent;
  getProjectById: (id: string) => Project | undefined;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const getProjectById = (id: string) => projects.find((p) => p.id === id);

  const value = useMemo(
    () => ({
      projects,
      categories,
      about,
      socialLinks,
      contact,
      getProjectById,
    }),
    []
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
