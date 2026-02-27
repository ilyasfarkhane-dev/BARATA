import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useProjects } from '../context/ProjectsContext';
import { NavigationNavbar } from '../components/NavigationNavbar';

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById } = useProjects();
  const project = id ? getProjectById(id) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavigationNavbar />
        <main className="pt-16 lg:pt-20 px-6 lg:px-12 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Project not found</h1>
            <p className="text-[#999] mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/#portfolio"
              className="inline-flex items-center gap-2 text-[#00D084] font-medium hover:underline"
            >
              <ArrowLeft size={18} />
              Back to projects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationNavbar />
      <main className="pt-16 lg:pt-20">
        <article className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-[#999] hover:text-[#00D084] font-medium mb-10 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to projects
          </Link>

          <header className="mb-10">
            <span className="inline-block px-3 py-1 bg-[#00D084]/20 text-[#00D084] text-sm font-medium rounded-full mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {project.title}
            </h1>
            {project.year && (
              <p className="text-[#666] text-lg">{project.year}</p>
            )}
          </header>

          <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] mb-8">
            <img
              src={project.image}
              alt={project.title}
              className="w-full aspect-video object-cover"
            />
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors mb-12"
            >
              Live demo
              <ExternalLink size={18} />
            </a>
          )}

          <div className="prose prose-invert max-w-none">
            {(() => {
              const raw = project.detailDescription ?? project.description ?? '';
              const html = raw.includes('<')
                ? raw
                : `<p>${escapeHtml(raw).replace(/\n/g, '<br/>')}</p>`;
              const safe = DOMPurify.sanitize(html, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 's', 'a', 'ul', 'ol', 'li', 'h2', 'h3'],
                ALLOWED_ATTR: ['href', 'target', 'rel'],
              });
              return (
                <div
                  className="detail-description text-lg text-[#ccc] leading-relaxed mb-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2 [&_strong]:font-bold [&_b]:font-bold [&_strong]:text-white [&_b]:text-white [&_em]:italic [&_i]:italic [&_s]:line-through [&_a]:text-[#00D084] [&_a]:underline [&_a:hover]:opacity-90 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1 [&_p]:my-2"
                  dangerouslySetInnerHTML={{ __html: safe }}
                />
              );
            })()}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Technologies & tools</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="px-4 py-2 bg-[#111] border border-[#222] rounded-lg text-[#999] text-sm"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
