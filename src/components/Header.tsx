import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, ArrowRight } from 'lucide-react';
import { PhiLogo } from './PhiLogo';
import { NAVIGATION_ITEMS } from '../config';
import { SectionId } from '../types';

interface HeaderProps {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleItemClick = (id: SectionId) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <>
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#FBF8F6]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(62,51,53,0.04)] border-b border-[#E9DDDB]'
            : 'bg-[#FBF8F6] border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo links */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D] rounded-lg p-1"
            aria-label="Phi Aesthetics Startseite"
          >
            <PhiLogo variant="header" />
          </a>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Klar sichtbarer, aber nicht aggressiver Button „Termin buchen“ */}
            <button
              id="header-booking-btn"
              onClick={() => handleItemClick('termin-buchen')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#775B5D] text-[#FBF8F6] text-sm font-medium tracking-wide shadow-sm hover:bg-[#3E3335] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D] focus-visible:ring-offset-2"
            >
              <Calendar className="w-4 h-4 text-[#D8C4C2]" />
              <span>Termin buchen</span>
            </button>

            {/* Dezente Menü-Schaltfläche rechts */}
            <button
              id="header-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FBF8F6] border border-[#E9DDDB] text-[#3E3335] text-sm font-medium hover:border-[#B99A99] hover:bg-[#D8C4C2]/15 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D]"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
            >
              {isOpen ? <X className="w-4 h-4 text-[#775B5D]" /> : <Menu className="w-4 h-4 text-[#775B5D]" />}
              <span className="hidden sm:inline">Menü</span>
            </button>
          </div>
        </div>
      </header>

      {/* Aufklappbares Inhaltsmenü mit allen neun Bereichen */}
      {isOpen && (
        <div
          id="menu-overlay"
          className="fixed inset-0 z-50 bg-[#3E3335]/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            id="menu-drawer"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FBF8F6] shadow-2xl border-l border-[#E9DDDB] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E9DDDB]">
                <div className="flex items-center gap-3">
                  <PhiLogo variant="drawer" />
                  <span className="font-serif text-lg tracking-wider text-[#3E3335]">
                    Übersicht
                  </span>
                </div>
                <button
                  id="menu-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D]"
                  aria-label="Menü schließen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items list with exact emotional labels */}
              <nav className="py-6 space-y-1" aria-label="Hauptbereiche">
                {NAVIGATION_ITEMS.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-[#D8C4C2]/25 text-[#3E3335] font-semibold border-l-2 border-[#775B5D]'
                          : 'text-[#3E3335]/80 hover:text-[#3E3335] hover:bg-[#D8C4C2]/15'
                      }`}
                    >
                      <span className="text-base sm:text-lg flex items-center gap-3">
                        <span className="text-xs font-mono text-[#B99A99]">
                          0{index + 1}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#775B5D]" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-[#B99A99] opacity-40 group-hover:opacity-100" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick action at drawer bottom */}
            <div className="pt-6 border-t border-[#E9DDDB] space-y-4">
              <button
                id="menu-drawer-booking-btn"
                onClick={() => handleItemClick('termin-buchen')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#775B5D] text-[#FBF8F6] font-medium text-center flex items-center justify-center gap-2 shadow-sm hover:bg-[#3E3335] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#D8C4C2]" />
                <span>Termin buchen</span>
              </button>
              <div className="text-center text-xs text-[#775B5D]">
                <span>Ärztliche Ästhetik • Dr. Milena Philippi</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
