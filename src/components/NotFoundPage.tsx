import React from 'react';
import { ArrowLeft, Calendar, Mail, Phone, Home } from 'lucide-react';
import { PhiLogo } from './PhiLogo';
import { PhiLine } from './PhiLine';
import { CONTACT_CONFIG } from '../config';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateImpressum?: () => void;
  onNavigateDatenschutz?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateImpressum,
  onNavigateDatenschutz,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F6] text-[#3E3335] selection:bg-[#D8C4C2] selection:text-[#3E3335]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#FBF8F6]/95 backdrop-blur-md border-b border-[#E9DDDB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
            aria-label="Phi Aesthetics Startseite"
          >
            <PhiLogo variant="header" />
          </button>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#775B5D] hover:text-[#3E3335] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück zur Startseite</span>
          </button>
        </div>
      </header>

      {/* Main 404 Hero */}
      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-serif text-7xl sm:text-9xl text-[#B99A99] font-light block mb-4 tracking-tighter">
            404
          </span>

          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-3">
            Fehler 404 • Nicht gefunden
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E3335] font-normal mb-6">
            Diese Seite existiert leider nicht
          </h1>

          <p className="text-base sm:text-lg text-[#3E3335]/80 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Die von dir aufgerufene Internetadresse konnte nicht gefunden werden. Möglicherweise wurde die Seite verschoben, umbenannt oder die eingegebene URL enthält einen Tippfehler.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#775B5D] text-[#FBF8F6] text-sm font-medium tracking-wide shadow-xs hover:bg-[#3E3335] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Zur Startseite</span>
            </button>

            <a
              href={CONTACT_CONFIG.phoneHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-[#775B5D] text-[#775B5D] text-sm font-medium tracking-wide hover:bg-[#775B5D] hover:text-white transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Telefonischer Kontakt</span>
            </a>
          </div>

          <PhiLine variant="divider" className="max-w-md mx-auto mb-10 opacity-60" />

          {/* Direct Assistance Info */}
          <div className="p-6 rounded-2xl bg-[#E9DDDB]/25 border border-[#E9DDDB] text-left sm:text-center">
            <h2 className="font-serif text-xl text-[#3E3335] mb-2 font-normal">
              Brauchst Du Unterstützung oder möchtest Du einen Termin vereinbaren?
            </h2>
            <p className="text-sm text-[#3E3335]/75 font-light mb-4">
              Wir helfen Dir gerne persönlich weiter. Schreibe uns eine E-Mail oder rufe uns direkt an.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#775B5D]">
              <a
                href={CONTACT_CONFIG.emailHref}
                className="inline-flex items-center gap-2 hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{CONTACT_CONFIG.email}</span>
              </a>
              <span className="hidden sm:inline opacity-30">•</span>
              <a
                href={CONTACT_CONFIG.phoneHref}
                className="inline-flex items-center gap-2 hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{CONTACT_CONFIG.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB] text-xs text-[#775B5D]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Phi Aesthetics • Dr. med. Milena Philippi</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (onNavigateImpressum) onNavigateImpressum();
                else window.location.href = '/impressum';
              }}
              className="hover:text-[#3E3335] transition-colors cursor-pointer"
            >
              Impressum
            </button>
            <button
              onClick={() => {
                if (onNavigateDatenschutz) onNavigateDatenschutz();
                else window.location.href = '/datenschutz';
              }}
              className="hover:text-[#3E3335] transition-colors cursor-pointer"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
