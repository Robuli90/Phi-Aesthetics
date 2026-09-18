import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { TreatmentPath } from './components/TreatmentPath';
import { Pricing } from './components/Pricing';
import { AboutMilena } from './components/AboutMilena';
import { FaqLexicon } from './components/FaqLexicon';
import { BookingTool } from './components/BookingTool';
import { Newsletter } from './components/Newsletter';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ImpressumPage } from './components/ImpressumPage';
import { SectionId } from './types';
import { NAVIGATION_ITEMS } from './config';

const normalizePath = (path: string) => {
  return path.toLowerCase().replace(/\/+$/, '') || '/';
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  const [activeSection, setActiveSection] = useState<SectionId>('angebote');
  const [faqCategory, setFaqCategory] = useState<
    'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit'
  >('grundlagen');

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(normalizePath(path));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll smoothly to a section on the main page
  const handleNavigate = (sectionId: SectionId) => {
    if (currentPath !== '/') {
      window.history.pushState(null, '', '/');
      setCurrentPath('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMoreFromPortfolio = (
    category?: 'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit'
  ) => {
    if (category) {
      setFaqCategory(category);
    }
    handleNavigate('botox-verstehen');
  };

  // Observe which section is currently in view (when on main page)
  useEffect(() => {
    if (currentPath !== '/') return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          const matchedItem = NAVIGATION_ITEMS.find((item) => item.id === entry.target.id);
          if (matchedItem) {
            setActiveSection(matchedItem.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-20% 0px -50% 0px',
      threshold: [0.2, 0.5],
    });

    NAVIGATION_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPath]);

  // Route: /impressum
  if (currentPath === '/impressum') {
    return <ImpressumPage onNavigateHome={() => navigateTo('/')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F6] text-[#3E3335] selection:bg-[#D8C4C2] selection:text-[#3E3335]">
      {/* Sticky Header with Navigation Drawer */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onStartTreatment={() => handleNavigate('termin-buchen')} />

        {/* 1. Was wir anbieten */}
        <Portfolio onLearnMore={handleLearnMoreFromPortfolio} />

        {/* 2. Dein Weg */}
        <TreatmentPath />

        {/* 3. Transparente Preise */}
        <Pricing onBookTreatment={() => handleNavigate('termin-buchen')} />

        {/* 4. Dr. Milena */}
        <AboutMilena />

        {/* 5. Botox verstehen */}
        <FaqLexicon initialCategory={faqCategory} />

        {/* 6. Termin finden (Demo Booking Calendar) */}
        <BookingTool />

        {/* 7. Phi-News */}
        <Newsletter />

        {/* 8. Sprich mit uns */}
        <ContactSection onDirectBooking={() => handleNavigate('termin-buchen')} />
      </main>

      {/* Footer */}
      <Footer onNavigateImpressum={() => navigateTo('/impressum')} />
    </div>
  );
}
