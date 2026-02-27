import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavigationNavbar } from './components/NavigationNavbar';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './sections/Footer';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DashboardPage } from './pages/DashboardPage';
import { useScrollProgress } from './hooks/useScrollProgress';

gsap.registerPlugin(ScrollTrigger);

function ScrollProgressBar() {
  const progress = useScrollProgress();
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[#222] z-[2000]">
      <div
        className="h-full bg-[#00D084] transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function App() {
  const { pathname, hash } = useLocation();

  // Scroll to section when landing on home with hash (e.g. /#about from project page)
  useEffect(() => {
    if (pathname !== '/' || !hash) return;
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  // Refresh ScrollTrigger on load
  useEffect(() => {
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoad);
    
    // Also refresh after a short delay to ensure all content is loaded
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-black text-white">
            <ScrollProgressBar />
            <NavigationNavbar />
            <main className="pt-16 lg:pt-20">
              <HeroSection />
              <AboutSection />
              <ServicesSection />
              <PortfolioSection />
              <TestimonialsSection />
              <ContactSection />
              <Footer />
            </main>
          </div>
        }
      />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project/:id" element={<ProjectDetailsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
