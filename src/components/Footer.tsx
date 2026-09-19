import React from 'react';
import { ArrowUp } from 'lucide-react';
import { PhiLogo } from './PhiLogo';
import { CONTACT_CONFIG } from '../config';

interface FooterProps {
  onNavigateImpressum?: () => void;
  onNavigateDatenschutz?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateImpressum,
  onNavigateDatenschutz,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImpressumClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateImpressum) {
      onNavigateImpressum();
    } else {
      window.history.pushState(null, '', '/impressum');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleDatenschutzClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateDatenschutz) {
      onNavigateDatenschutz();
    } else {
      window.history.pushState(null, '', '/datenschutz');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <footer
      id="main-footer"
      className="py-14 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB] text-[#3E3335]"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Offizielles Phi Aesthetics Logo */}
        <div className="flex flex-col items-center md:items-start">
          <PhiLogo variant="footer" />
        </div>

        {/* Kontaktmöglichkeiten */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[#775B5D]">
          <a
            href={CONTACT_CONFIG.emailHref}
            className="hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors"
          >
            {CONTACT_CONFIG.email}
          </a>
          <span className="hidden sm:inline opacity-40">•</span>
          <a
            href={CONTACT_CONFIG.phoneHref}
            className="hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors"
          >
            {CONTACT_CONFIG.phone}
          </a>
        </div>

        {/* Rechtliches & Scroll to top */}
        <div className="flex items-center gap-6 text-xs text-[#775B5D]">
          <a
            href="/datenschutz"
            onClick={handleDatenschutzClick}
            className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Datenschutz
          </a>
          <a
            href="/impressum"
            onClick={handleImpressumClick}
            className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Impressum
          </a>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 transition-colors cursor-pointer"
            aria-label="Zurück nach oben"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
