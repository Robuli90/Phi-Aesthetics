import React, { useState } from 'react';
import { ArrowUp, X, Shield, FileText } from 'lucide-react';
import { PhiLogo } from './PhiLogo';
import { CONTACT_CONFIG } from '../config';

interface FooterProps {
  onNavigateImpressum?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateImpressum }) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'datenschutz' | null>(
    null
  );

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

  return (
    <>
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
            <button
              onClick={() => setActiveLegalModal('datenschutz')}
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Datenschutz
            </button>
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

      {/* Kompakte, ruhige Hinweisbox für Datenschutz */}
      {activeLegalModal && (
        <div
          className="fixed inset-0 z-50 bg-[#3E3335]/30 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveLegalModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#FBF8F6] border border-[#E9DDDB] rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DDDB]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#775B5D]" />
                <h4 className="font-serif text-xl text-[#3E3335]">
                  Datenschutz
                </h4>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1 rounded-full text-[#775B5D] hover:bg-[#D8C4C2]/20 cursor-pointer"
                aria-label="Schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 text-sm text-[#3E3335]/85 leading-relaxed font-light">
              <p className="mb-2">
                Informationen zur Verarbeitung personenbezogener Daten im Rahmen der ärztlichen Praxis:
              </p>
              <div className="p-4 rounded-xl bg-[#E9DDDB]/30 border border-[#E9DDDB] text-xs text-[#775B5D] italic">
                Die finalen Datenschutzbestimmungen werden vor dem Livegang ergänzt.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] transition-colors cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
