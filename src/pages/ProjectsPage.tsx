import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { NavigationNavbar } from '../components/NavigationNavbar';

gsap.registerPlugin(ScrollTrigger);

const ALL_CATEGORY = 'All' as const;

export function ProjectsPage() {
  const { projects, categories: PROJECT_CATEGORIES } = useProjects();
  const [activeFilter, setActiveFilter] = useState<string | typeof ALL_CATEGORY>(ALL_CATEGORY);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === ALL_CATEGORY) return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter, projects]);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(gridRef.current?.querySelectorAll('.project-card'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power4.out' }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationNavbar />
      <main className="pt-16 lg:pt-20">
        <section ref={sectionRef} className="py-16 lg:py-24 px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-10">
              <span className="inline-block text-[#00D084] font-medium text-sm tracking-wider uppercase mb-2">
                Portfolio
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                All Projects
              </h1>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-2 mb-12">
              <button
                onClick={() => setActiveFilter(ALL_CATEGORY)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeFilter === ALL_CATEGORY
                    ? 'bg-[#00D084] text-black'
                    : 'bg-[#1A1A1A] border border-[#333] text-[#999] hover:border-[#00D084] hover:text-white'
                }`}
              >
                All
              </button>
              {PROJECT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === category
                      ? 'bg-[#00D084] text-black'
                      : 'bg-[#1A1A1A] border border-[#333] text-[#999] hover:border-[#00D084] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.length === 0 ? (
                <p className="text-[#666] col-span-full py-12">No projects in this category yet.</p>
              ) : (
                filteredProjects.map((project) => (
                  <div key={project.id} className="project-card group">
                    <Link to={`/project/${project.id}`} className="block">
                      <div className="relative rounded-2xl overflow-hidden bg-black border border-[#222] transition-all duration-500 hover:border-[#00D084]">
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                          <span className="inline-block px-3 py-1 bg-[#00D084] text-[#FFFFFF] text-sm font-medium rounded-full mb-2">
                            {project.category}
                          </span>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {project.title}
                          </h3>
                          <p className="text-white text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="inline-flex items-center gap-2 text-[#00D084] font-medium text-sm">
                              View Project
                              <ExternalLink size={14} />
                            </span>
                          
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
