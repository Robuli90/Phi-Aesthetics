import React, { useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';
import { PhiLogo } from './PhiLogo';
import { CONTACT_CONFIG } from '../config';

interface ImpressumPageProps {
  onNavigateHome: () => void;
  onNavigateDatenschutz?: () => void;
}

export const ImpressumPage: React.FC<ImpressumPageProps> = ({
  onNavigateHome,
  onNavigateDatenschutz,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Impressum | Dr. med. M. Philippi – Phi Aesthetics';
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[#FBF8F6] text-[#3E3335] selection:bg-[#D8C4C2] selection:text-[#3E3335]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF8F6]/95 backdrop-blur-md border-b border-[#E9DDDB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D] rounded-lg p-1"
            aria-label="Zurück zur Startseite von Phi Aesthetics"
          >
            <PhiLogo variant="header" />
          </a>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E9DDDB] text-xs font-medium text-[#775B5D] hover:text-[#3E3335] hover:bg-[#E9DDDB]/40 active:scale-[0.98] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zur Startseite</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Breadcrumb / Category */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#775B5D] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#775B5D]" />
              <span>Rechtliche Angaben & Transparenz</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E3335] font-normal tracking-tight">
              Impressum
            </h1>
            <p className="text-sm text-[#775B5D] font-light">
              Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) bzw. Telemediengesetz (TMG)
            </p>
          </div>

          {/* Section 1: Verantwortlicher für den Inhalt */}
          <section
            aria-labelledby="verantwortlicher-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <div>
              <h2
                id="verantwortlicher-title"
                className="text-xs uppercase tracking-widest text-[#775B5D] font-medium mb-3"
              >
                Verantwortlicher für den Inhalt
              </h2>
              <div className="space-y-1 font-serif text-xl sm:text-2xl text-[#3E3335]">
                <p className="font-medium">Dr. med. M. Philippi</p>
              </div>
            </div>

            <div className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light space-y-1">
              <p>Feldblumenweg 7a</p>
              <p>50858 Köln</p>
            </div>

            <div className="pt-2 border-t border-[#E9DDDB]/60 space-y-2.5 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#775B5D] shrink-0" />
                <span className="text-[#775B5D] w-20 shrink-0">Telefon:</span>
                <a
                  href="tel:+4915233979650"
                  className="font-medium text-[#3E3335] hover:text-[#775B5D] hover:underline"
                >
                  0152 33979650
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#775B5D] shrink-0" />
                <span className="text-[#775B5D] w-20 shrink-0">E-Mail:</span>
                <a
                  href={CONTACT_CONFIG.emailHref}
                  className="font-medium text-[#3E3335] hover:text-[#775B5D] hover:underline break-all"
                >
                  info.phiaesthetics@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#775B5D] shrink-0" />
                <span className="text-[#775B5D] w-20 shrink-0">Internet:</span>
                <a
                  href="https://www.phi-aesthetics.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#3E3335] hover:text-[#775B5D] hover:underline"
                >
                  www.phi-aesthetics.de
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E9DDDB]/60 text-xs sm:text-sm text-[#3E3335]/85 font-light leading-relaxed bg-[#E9DDDB]/20 p-4 rounded-xl">
              <strong>Dr. med. M. Philippi</strong>, Approbation verliehen durch das Bundesland NRW / Bundesrepublik Deutschland
            </div>
          </section>

          {/* Section 2: Berufsrechtliche Angaben */}
          <section
            aria-labelledby="berufsrecht-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="berufsrecht-title"
              className="text-xs uppercase tracking-widest text-[#775B5D] font-medium"
            >
              Berufsrechtliche Angaben
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              {/* Kammerzugehörigkeit */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                  Kammerzugehörigkeit
                </h3>
                <p className="text-sm text-[#3E3335]/90 font-light leading-relaxed">
                  Landesärztekammer Nordrhein<br />
                  Tersteegenstraße 9, 40474 Düsseldorf
                </p>
              </div>

              {/* Zuständige Aufsichtsbehörde */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                  Zuständige Aufsichtsbehörde für vertragsärztliche Tätigkeiten
                </h3>
                <p className="text-sm text-[#3E3335]/90 font-light leading-relaxed">
                  Kassenärztliche Vereinigung Nordrhein<br />
                  Tersteegenstraße 9, 40474 Düsseldorf
                </p>
              </div>
            </div>

            {/* Geltendes Berufsrecht */}
            <div className="pt-4 border-t border-[#E9DDDB]/60 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Geltendes Berufsrecht
              </h3>
              <ul className="space-y-1.5 text-sm text-[#3E3335]/90 font-light list-disc list-inside">
                <li>Berufsordnung für die nordrheinischen Ärzte</li>
                <li>Gebührenordnung für Ärzte (GOÄ)</li>
                <li>Heilberufsgesetz NRW</li>
                <li>Zulassung</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Hinweis nach § 36 Verbraucherstreitbeilegungsgesetz (VSBG) */}
          <section
            aria-labelledby="vsbg-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-3"
          >
            <h2
              id="vsbg-title"
              className="text-xs uppercase tracking-widest text-[#775B5D] font-medium"
            >
              Hinweis nach § 36 Verbraucherstreitbeilegungsgesetz (VSBG)
            </h2>
            <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
              Ich/Wir sind nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          {/* Section 4: Urheberrecht */}
          <section
            aria-labelledby="urheberrecht-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-4"
          >
            <h2
              id="urheberrecht-title"
              className="text-xs uppercase tracking-widest text-[#775B5D] font-medium"
            >
              Urheberrecht
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Bottom Navigation Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück zur Startseite</span>
            </button>
            <a
              href="/datenschutz"
              onClick={handleDatenschutzClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#D8C4C2] text-[#775B5D] hover:bg-[#E9DDDB]/40 text-xs uppercase tracking-wider font-medium active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Zur Datenschutzerklärung</span>
            </a>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-[#FBF8F6] border-t border-[#E9DDDB] text-xs text-[#775B5D]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Phi Aesthetics – Dr. med. M. Philippi, Köln</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Startseite
            </button>
            <span>•</span>
            <a
              href="/datenschutz"
              onClick={handleDatenschutzClick}
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Datenschutz
            </a>
            <span>•</span>
            <a
              href="mailto:info.phiaesthetics@gmail.com?subject=Deine%20Anfrage%20an%20Phi%20Aesthetics"
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline"
            >
              info.phiaesthetics@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
