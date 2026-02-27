import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
gsap.registerPlugin(ScrollTrigger);

const ALL_CATEGORY = 'All' as const;
const HOME_PROJECTS_LIMIT = 4;

export function PortfolioSection() {
  const { projects, categories: PROJECT_CATEGORIES } = useProjects();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | typeof ALL_CATEGORY>(ALL_CATEGORY);

  const filteredProjects = useMemo(() => {
    if (activeFilter === ALL_CATEGORY) return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter, projects]);

  const displayedProjects = useMemo(
    () => filteredProjects.slice(0, HOME_PROJECTS_LIMIT),
    [filteredProjects]
  );
  const totalSlides = displayedProjects.length + 1;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(galleryRef.current,
        { scale: 1.05, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToProject = (index: number) => {
    if (!galleryRef.current) return;
    const cards = galleryRef.current.querySelectorAll('.project-card, .all-projects-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : totalSlides - 1;
    scrollToProject(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < totalSlides - 1 ? currentIndex + 1 : 0;
    scrollToProject(newIndex);
  };

  useEffect(() => {
    if (!galleryRef.current) return;

    const handleScroll = () => {
      if (!galleryRef.current) return;
      const cards = galleryRef.current.querySelectorAll('.project-card, .all-projects-card');
      const scrollLeft = galleryRef.current.scrollLeft;
      const cardWidth = cards[0]?.clientWidth ?? 0;
      if (cardWidth === 0) return;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.min(Math.max(0, newIndex), totalSlides - 1));
    };

    galleryRef.current.addEventListener('scroll', handleScroll, { passive: true });
    return () => galleryRef.current?.removeEventListener('scroll', handleScroll);
  }, [totalSlides]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#111] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <span className="inline-block text-[#00D084] font-medium text-sm tracking-wider uppercase mb-4">
              Selected Work
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Projects That Define My Craft
            </h2>
          </div>

          {/* Filter by project type */}
          <div className="flex flex-wrap items-center gap-2 mt-6 md:mt-0">
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
        </div>

        {/* Navigation Arrows */}
        {totalSlides > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center text-white transition-all duration-300 hover:border-[#00D084] hover:bg-[#00D084] hover:text-black hover:scale-110"
              aria-label="Previous project"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center text-white transition-all duration-300 hover:border-[#00D084] hover:bg-[#00D084] hover:text-black hover:scale-110"
              aria-label="Next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Horizontal Gallery */}
        <div
          ref={galleryRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
        >
          {displayedProjects.length === 0 ? (
            <p className="text-[#666] py-12">No projects in this category yet.</p>
          ) : (
            <>
              {displayedProjects.map((project) => (
                <div
                  key={project.id}
                  className="project-card flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] snap-center group"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-[#222] transition-all duration-500 hover:border-[#00D084]">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                      <span className="inline-block px-3 py-1 bg-[#00D084]/20 text-[#00D084] text-sm font-medium rounded-full mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[#999] mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <Link
                          to={`/project/${project.id}`}
                          className="inline-flex items-center gap-2 text-[#00D084] font-medium"
                        >
                          View Project
                          <ExternalLink size={16} />
                        </Link>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* All projects link card */}
              <Link
                to="/projects"
                className="all-projects-card flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] snap-center group"
              >
                <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-[#333] flex flex-col items-center justify-center gap-4 p-8 transition-all duration-300 hover:border-[#00D084] hover:bg-[#00D084]/5">
                  <span className="text-[#00D084] font-semibold text-lg">All projects</span>
                  <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all duration-300">
                    View all
                    <ArrowRight size={20} />
                  </span>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {totalSlides > 0 && (
          <div className="mt-8">
            <div className="h-1 bg-[#222] rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-[#00D084] rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-sm text-[#666]">
              <span>{String(currentIndex + 1).padStart(2, '0')}</span>
              <span>{String(totalSlides).padStart(2, '0')}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
