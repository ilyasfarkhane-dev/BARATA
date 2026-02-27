import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ExternalLink,
  X,
  LogOut,
  LayoutGrid,
  Tag,
  User,
  Share2,
  Upload,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Dribbble,
  Github,
} from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';
import { useAuth } from '../context/AuthContext';
import { uploadImage, isCloudinaryConfigured } from '../lib/cloudinary';
import { RichTextEditor } from '../components/RichTextEditor';
import type { Project } from '../data/projects';
import type { AboutContent, SocialLink, ContactContent } from '../context/ProjectsContext';

function ProjectForm({
  project,
  onSave,
  onCancel,
  categories,
}: {
  project?: Project | null;
  onSave: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  categories: string[];
}) {
  const [title, setTitle] = useState(project?.title ?? '');
  const [category, setCategory] = useState<string>(
    project?.category ?? (categories[0] ?? '')
  );
  const [description, setDescription] = useState(project?.description ?? '');
  const [image, setImage] = useState(project?.image ?? '');
  const [link, setLink] = useState(project?.link ?? '');
  const [detailDescription, setDetailDescription] = useState(
    project?.detailDescription ?? ''
  );
  const [technologies, setTechnologies] = useState(
    project?.technologies?.join(', ') ?? ''
  );
  const [year, setYear] = useState(project?.year ?? '');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const detailPlain = detailDescription
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    onSave({
      title,
      category,
      description,
      image,
      link: link || undefined,
      detailDescription: detailPlain ? detailDescription : undefined,
      technologies: technologies
        ? technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      year: year || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">Category</label>
        {categories.length === 0 ? (
          <p className="text-sm text-amber-500 py-2">
            Add at least one category in the Categories section first.
          </p>
        ) : (
          <select
            value={category || categories[0]}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">
          Short description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">
          Image URL
        </label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/project-1.jpg or https://..."
              className="flex-1 min-w-0 px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
              required
            />
            {isCloudinaryConfigured() && (
              <label className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-[#999] hover:text-[#00D084] hover:border-[#00D084] cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={imageUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setImageUploadError(null);
                    setImageUploading(true);
                    try {
                      const url = await uploadImage(file);
                      setImage(url);
                    } catch (err) {
                      setImageUploadError(err instanceof Error ? err.message : 'Upload failed');
                    } finally {
                      setImageUploading(false);
                    }
                  }}
                />
                {imageUploading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                <span>{imageUploading ? 'Uploading…' : 'Upload'}</span>
              </label>
            )}
          </div>
          {imageUploadError && (
            <p className="text-sm text-amber-500">{imageUploadError}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">
          Live demo URL
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">
          Detail description
        </label>
        <RichTextEditor
          value={detailDescription}
          onChange={setDetailDescription}
          placeholder="Describe the project in detail..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">
          Technologies (comma-separated)
        </label>
        <input
          type="text"
          value={technologies}
          onChange={(e) => setTechnologies(e.target.value)}
          placeholder="React, TypeScript, Figma"
          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#999] mb-1">Year</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2024"
          className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors"
        >
          {project ? 'Update' : 'Add'} project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-[#333] text-[#999] rounded-lg hover:border-[#555] hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function LoginScreen() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(password)) {
      // Auth context updates; dashboard will re-render
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-[#222] bg-[#111] p-8">
          <h1 className="text-xl font-semibold text-white mb-2">Dashboard login</h1>
          <p className="text-sm text-[#666] mb-6">
            Enter your password to manage the portfolio.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white placeholder-[#555] focus:border-[#00D084] focus:outline-none"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-[#666] hover:text-[#00D084] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to site
        </Link>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const {
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
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProjects();
  const [view, setView] = useState<'projects' | 'categories' | 'about' | 'socialContact'>('projects');
  const [modalOpen, setModalOpen] = useState<'add' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryMessage, setCategoryMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [localAbout, setLocalAbout] = useState<AboutContent>(about);
  const [aboutSaved, setAboutSaved] = useState(false);
  const [aboutImageUploading, setAboutImageUploading] = useState(false);
  const [aboutImageUploadError, setAboutImageUploadError] = useState<string | null>(null);
  const [localSocialLinks, setLocalSocialLinks] = useState<SocialLink[]>(socialLinks);
  const [localContact, setLocalContact] = useState<ContactContent>(contact);
  const [socialContactSaved, setSocialContactSaved] = useState(false);

  useEffect(() => {
    if (view === 'about') setLocalAbout(about);
  }, [view, about]);

  useEffect(() => {
    if (view === 'socialContact') {
      setLocalSocialLinks(socialLinks);
      setLocalContact(contact);
    }
  }, [view, socialLinks, contact]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const handleAdd = (data: Omit<Project, 'id'>) => {
    addProject(data);
    setModalOpen(null);
  };

  const handleUpdate = (id: string, data: Partial<Project>) => {
    updateProject(id, data);
    setEditingId(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteProject(id);
    }
  };

  const handleStartEditCategory = (name: string) => {
    setEditingCategory(name);
    setEditingCategoryValue(name);
  };

  const handleSaveCategoryEdit = () => {
    if (editingCategory && editingCategoryValue.trim()) {
      updateCategory(editingCategory, editingCategoryValue.trim());
      setEditingCategory(null);
      setEditingCategoryValue('');
    }
  };

  const handleDeleteCategory = (name: string) => {
    const deleted = deleteCategory(name);
    if (!deleted) {
      alert(`Cannot delete "${name}": it is used by one or more projects.`);
    }
  };

  const handleSaveAbout = () => {
    updateAbout(localAbout);
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2000);
  };

  const handleSaveSocialContact = () => {
    updateSocialLinks(localSocialLinks);
    updateContact(localContact);
    setSocialContactSaved(true);
    setTimeout(() => setSocialContactSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#222] flex flex-col bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#222]">
          <h2 className="text-lg font-semibold text-white">Dashboard</h2>
          <p className="text-xs text-[#666] mt-0.5">Portfolio admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'projects'
                ? 'bg-[#111] text-[#00D084] border border-[#222]'
                : 'text-[#999] hover:text-white hover:bg-[#111]'
            }`}
          >
            <LayoutGrid size={20} />
            <span className="font-medium">Projects</span>
          </button>
          <button
            onClick={() => setView('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'categories'
                ? 'bg-[#111] text-[#00D084] border border-[#222]'
                : 'text-[#999] hover:text-white hover:bg-[#111]'
            }`}
          >
            <Tag size={20} />
            <span className="font-medium">Categories</span>
          </button>
          <button
            onClick={() => setView('about')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'about'
                ? 'bg-[#111] text-[#00D084] border border-[#222]'
                : 'text-[#999] hover:text-white hover:bg-[#111]'
            }`}
          >
            <User size={20} />
            <span className="font-medium">About Me</span>
          </button>
          <button
            onClick={() => setView('socialContact')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'socialContact'
                ? 'bg-[#111] text-[#00D084] border border-[#222]'
                : 'text-[#999] hover:text-white hover:bg-[#111]'
            }`}
          >
            <Share2 size={20} />
            <span className="font-medium">Social & Contact</span>
          </button>
        </nav>
        <div className="p-4 border-t border-[#222] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#999] hover:text-[#00D084] hover:bg-[#111] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#999] hover:text-red-400 hover:bg-[#111] transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {view === 'projects' && (
          <>
            <header className="border-b border-[#222] flex-shrink-0 bg-black/95 backdrop-blur sticky top-0 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">Projects</h1>
                <button
                  onClick={() => setModalOpen('add')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors"
                >
                  <Plus size={18} />
                  Add project
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-xl border border-[#222] overflow-hidden">
                  <table className="w-full">
                <thead>
                  <tr className="bg-[#111] border-b border-[#222]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#999]">
                      Project
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#999] hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#999] hidden lg:table-cell">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#999]">
                      Demo
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#999] w-28">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#666]">
                        No projects yet. Click &quot;Add project&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-[#222] hover:bg-[#0a0a0a] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded overflow-hidden bg-[#111] flex-shrink-0">
                              <img
                                src={project.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="font-medium text-white">
                                {project.title}
                              </span>
                              <span className="block text-xs text-[#666] md:hidden">
                                {project.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#999] hidden md:table-cell">
                          {project.category}
                        </td>
                        <td className="py-3 px-4 text-[#666] text-sm max-w-xs truncate hidden lg:table-cell">
                          {project.description}
                        </td>
                        <td className="py-3 px-4">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00D084] hover:underline inline-flex items-center gap-1 text-sm"
                            >
                              Open
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-[#555] text-sm">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingId(project.id)}
                              className="p-2 text-[#999] hover:text-[#00D084] hover:bg-[#111] rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, project.title)}
                              className="p-2 text-[#999] hover:text-red-400 hover:bg-[#111] rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                  </table>
                </div>
              </div>
            </main>
          </>
        )}

        {view === 'categories' && (
          <>
            <header className="border-b border-[#222] flex-shrink-0 bg-black/95 backdrop-blur sticky top-0 z-10">
              <div className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h1 className="text-xl font-semibold text-white">Categories</h1>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setCategoryMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const added = addCategory(newCategoryName);
                          if (added) {
                            setNewCategoryName('');
                            setCategoryMessage({ type: 'success', text: 'Category added.' });
                          } else if (!newCategoryName.trim()) {
                            setCategoryMessage({ type: 'error', text: 'Please enter a category name.' });
                          } else {
                            setCategoryMessage({ type: 'error', text: 'Category already exists.' });
                          }
                        }
                      }}
                      placeholder="New category name"
                      className="px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white placeholder-[#555] focus:border-[#00D084] focus:outline-none w-full sm:w-48 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const added = addCategory(newCategoryName);
                        if (added) {
                          setNewCategoryName('');
                          setCategoryMessage({ type: 'success', text: 'Category added.' });
                        } else if (!newCategoryName.trim()) {
                          setCategoryMessage({ type: 'error', text: 'Please enter a category name.' });
                        } else {
                          setCategoryMessage({ type: 'error', text: 'Category already exists.' });
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                </div>
                {categoryMessage && (
                  <p className={`text-sm mt-2 ${categoryMessage.type === 'error' ? 'text-amber-500' : 'text-[#00D084]'}`}>
                    {categoryMessage.text}
                  </p>
                )}
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto">
                <div className="rounded-xl border border-[#222] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#111] border-b border-[#222]">
                        <th className="text-left py-3 px-4 text-sm font-medium text-[#999]">
                          Category
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-[#999] w-32">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-12 text-center text-[#666]">
                            No categories yet. Add one above to use when creating projects.
                          </td>
                        </tr>
                      ) : (
                        categories.map((name) => (
                          <tr
                            key={name}
                            className="border-b border-[#222] hover:bg-[#0a0a0a] transition-colors"
                          >
                            <td className="py-3 px-4">
                              {editingCategory === name ? (
                                <input
                                  type="text"
                                  value={editingCategoryValue}
                                  onChange={(e) => setEditingCategoryValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCategoryEdit();
                                    if (e.key === 'Escape') {
                                      setEditingCategory(null);
                                      setEditingCategoryValue('');
                                    }
                                  }}
                                  className="w-full max-w-xs px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                                  autoFocus
                                />
                              ) : (
                                <span className="font-medium text-white">{name}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {editingCategory === name ? (
                                  <>
                                    <button
                                      onClick={handleSaveCategoryEdit}
                                      className="px-3 py-1.5 text-sm bg-[#00D084] text-black font-medium rounded-lg hover:bg-[#00A065]"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingCategory(null);
                                        setEditingCategoryValue('');
                                      }}
                                      className="px-3 py-1.5 text-sm border border-[#333] text-[#999] rounded-lg hover:text-white"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleStartEditCategory(name)}
                                      className="p-2 text-[#999] hover:text-[#00D084] hover:bg-[#111] rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Pencil size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(name)}
                                      className="p-2 text-[#999] hover:text-red-400 hover:bg-[#111] rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </>
        )}

        {view === 'about' && (
          <>
            <header className="border-b border-[#222] flex-shrink-0 bg-black/95 backdrop-blur sticky top-0 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">About Me</h1>
                <button
                  onClick={handleSaveAbout}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors"
                >
                  {aboutSaved ? 'Saved' : 'Save changes'}
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="rounded-xl border border-[#222] p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#999] mb-1">Section label</label>
                    <input
                      type="text"
                      value={localAbout.label}
                      onChange={(e) => setLocalAbout((a) => ({ ...a, label: e.target.value }))}
                      placeholder="About Me"
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#999] mb-1">Headline</label>
                    <input
                      type="text"
                      value={localAbout.headline}
                      onChange={(e) => setLocalAbout((a) => ({ ...a, headline: e.target.value }))}
                      placeholder="Crafting Digital Experiences..."
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#999] mb-1">Body (paragraphs separated by a blank line)</label>
                    <textarea
                      value={localAbout.body}
                      onChange={(e) => setLocalAbout((a) => ({ ...a, body: e.target.value }))}
                      rows={6}
                      placeholder="First paragraph...&#10;&#10;Second paragraph..."
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#999] mb-1">Portrait image</label>
                    {localAbout.imageUrl ? (
                      <div className="mb-3 relative inline-block">
                        <div className="w-32 h-40 rounded-lg overflow-hidden border border-[#333] bg-[#111]">
                          <img
                            src={localAbout.imageUrl}
                            alt="Portrait preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setLocalAbout((a) => ({ ...a, imageUrl: '' }))}
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : null}
                    <div className="flex gap-2 flex-wrap">
                      
                      {isCloudinaryConfigured() && (
                        <label className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#222] border border-[#333] rounded-lg text-[#999] hover:text-[#00D084] hover:border-[#00D084] cursor-pointer transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={aboutImageUploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (!file) return;
                              setAboutImageUploadError(null);
                              setAboutImageUploading(true);
                              try {
                                const url = await uploadImage(file);
                                setLocalAbout((a) => ({ ...a, imageUrl: url }));
                              } catch (err) {
                                setAboutImageUploadError(err instanceof Error ? err.message : 'Upload failed');
                              } finally {
                                setAboutImageUploading(false);
                              }
                            }}
                          />
                          {aboutImageUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                          Upload
                        </label>
                      )}
                    </div>
                    {aboutImageUploadError && (
                      <p className="text-sm text-amber-500 mt-1">{aboutImageUploadError}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-[#222] p-6">
                  <h3 className="text-sm font-medium text-[#999] mb-4">Stats (3 items)</h3>
                  <div className="space-y-4">
                    {localAbout.stats.map((stat, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div>
                          <label className="block text-xs text-[#666] mb-1">Value</label>
                          <input
                            type="number"
                            min={0}
                            value={stat.value}
                            onChange={(e) =>
                              setLocalAbout((a) => ({
                                ...a,
                                stats: a.stats.map((s, i) =>
                                  i === index ? { ...s, value: parseInt(e.target.value, 10) || 0 } : s
                                ),
                              }))
                            }
                            className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#666] mb-1">Suffix (e.g. +)</label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) =>
                              setLocalAbout((a) => ({
                                ...a,
                                stats: a.stats.map((s, i) =>
                                  i === index ? { ...s, suffix: e.target.value } : s
                                ),
                              }))
                            }
                            className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                            placeholder="+"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#666] mb-1">Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) =>
                              setLocalAbout((a) => ({
                                ...a,
                                stats: a.stats.map((s, i) =>
                                  i === index ? { ...s, label: e.target.value } : s
                                ),
                              }))
                            }
                            className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                            placeholder="Years Experience"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {view === 'socialContact' && (
          <>
            <header className="border-b border-[#222] flex-shrink-0 bg-black/95 backdrop-blur sticky top-0 z-10">
              <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">Social & Contact</h1>
                <button
                  onClick={handleSaveSocialContact}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00D084] text-black font-semibold rounded-lg hover:bg-[#00A065] transition-colors"
                >
                  {socialContactSaved ? 'Saved' : 'Save changes'}
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Social links (navbar + contact section) */}
                <div className="rounded-xl border border-[#222] p-6">
                  <h3 className="text-sm font-medium text-[#999] mb-4">Social media links</h3>
                  <p className="text-xs text-[#666] mb-4">Used in the navbar and Get In Touch section.</p>
                  <div className="space-y-3">
                    {localSocialLinks.map((link, index) => {
                      const SocialIcon = link.name === 'Twitter' ? Twitter : link.name === 'LinkedIn' || link.name === 'Linkedin' ? Linkedin : link.name === 'Dribbble' ? Dribbble : link.name === 'GitHub' || link.name === 'Github' ? Github : Dribbble;
                      return (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex items-center gap-2 w-28 flex-shrink-0 px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-[#999]">
                          <SocialIcon size={18} className="text-[#00D084]" />
                          <span className="font-medium text-white truncate">{link.name || '—'}</span>
                        </div>
                        <input
                          type="url"
                          value={link.href}
                          onChange={(e) =>
                            setLocalSocialLinks((prev) =>
                              prev.map((l, i) => (i === index ? { ...l, href: e.target.value } : l))
                            )}
                          placeholder="https://..."
                          className="flex-1 min-w-0 px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setLocalSocialLinks((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="p-2 text-[#999] hover:text-red-400 hover:bg-[#111] rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setLocalSocialLinks((prev) => [...prev, { name: '', href: '' }])}
                      className="flex items-center gap-2 text-sm text-[#00D084] hover:underline"
                    >
                      <Plus size={16} />
                      Add social link
                    </button>
                  </div>
                </div>

                {/* Get In Touch section */}
                <div className="rounded-xl border border-[#222] p-6 space-y-4">
                  <h3 className="text-sm font-medium text-[#999] mb-2">Get In Touch section</h3>
                 
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Headline</label>
                    <input
                      type="text"
                      value={localContact.headline}
                      onChange={(e) => setLocalContact((c) => ({ ...c, headline: e.target.value }))}
                      placeholder="Let's Create Something Amazing Together"
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] mb-1">Subheadline</label>
                    <textarea
                      value={localContact.subheadline}
                      onChange={(e) => setLocalContact((c) => ({ ...c, subheadline: e.target.value }))}
                      rows={3}
                      placeholder="Have a project in mind?..."
                      className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] mb-2">Contact info (Email, Phone, Location)</label>
                    <div className="space-y-3">
                      {localContact.contactInfo.map((item, index) => {
                        const ContactIcon = item.label === 'Email' ? Mail : item.label === 'Phone' ? Phone : MapPin;
                        return (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <div className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-[#999]">
                            <ContactIcon size={18} className="text-[#00D084]" />
                            <span className="font-medium text-white">{item.label}</span>
                          </div>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) =>
                              setLocalContact((c) => ({
                                ...c,
                                contactInfo: c.contactInfo.map((info, i) =>
                                  i === index ? { ...info, value: e.target.value } : info
                                ),
                              }))
                            }
                            placeholder="Value"
                            className="px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) =>
                              setLocalContact((c) => ({
                                ...c,
                                contactInfo: c.contactInfo.map((info, i) =>
                                  i === index ? { ...info, href: e.target.value } : info
                                ),
                              }))
                            }
                            placeholder="href (mailto:, tel:, or #)"
                            className="px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:border-[#00D084] focus:outline-none"
                          />
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {/* Add project modal */}
      {modalOpen === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111] border border-[#222] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Add project</h2>
              <button
                onClick={() => setModalOpen(null)}
                className="p-2 text-[#999] hover:text-white rounded-lg hover:bg-[#222]"
              >
                <X size={20} />
              </button>
            </div>
            <ProjectForm
              categories={categories}
              onSave={handleAdd}
              onCancel={() => setModalOpen(null)}
            />
          </div>
        </div>
      )}

      {/* Edit project modal */}
      {editingId && (() => {
        const project = projects.find((p) => p.id === editingId);
        if (!project) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-[#111] border border-[#222] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Edit: {project.title}
                </h2>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 text-[#999] hover:text-white rounded-lg hover:bg-[#222]"
                >
                  <X size={20} />
                </button>
              </div>
              <ProjectForm
                project={project}
                categories={categories}
                onSave={(data) => handleUpdate(editingId, data)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
