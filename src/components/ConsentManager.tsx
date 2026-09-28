import React, { useState, useEffect } from 'react';
import { Shield, X, Check, ChevronRight, Settings, ExternalLink } from 'lucide-react';
import { useConsent, ConsentPreferences } from '../context/ConsentContext';
import { CONTACT_CONFIG } from '../config';

export const ConsentManager: React.FC = () => {
  const {
    preferences,
    isBannerVisible,
    isModalOpen,
    acceptAll,
    acceptNecessary,
    savePreferences,
    openModal,
    closeModal,
  } = useConsent();

  // Local draft state when editing within the modal
  const [draft, setDraft] = useState<ConsentPreferences>({
    necessary: true,
    googleMaps: preferences.googleMaps,
    simplyBook: preferences.simplyBook,
  });

  // Sync draft whenever modal opens or preferences update
  useEffect(() => {
    if (isModalOpen) {
      setDraft({
        necessary: true,
        googleMaps: preferences.googleMaps,
        simplyBook: preferences.simplyBook,
      });
    }
  }, [isModalOpen, preferences]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  const handleSaveDraft = () => {
    savePreferences(draft);
  };

  return (
    <>
      {/* 1. INITIAL FLOATING CONSENT BANNER (Wenn noch keine Auswahl getroffen wurde) */}
      {isBannerVisible && !isModalOpen && (
        <aside
          role="region"
          aria-label="Einwilligung für externe Dienste"
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-2xl rounded-2xl p-5 sm:p-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start gap-3.5 mb-3.5">
            <div className="w-10 h-10 rounded-full bg-[#E9DDDB]/60 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D]">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#3E3335] font-normal leading-snug">
                Privatsphäre & externe Dienste
              </h3>
              <p className="text-xs sm:text-[13px] text-[#3E3335]/80 font-light mt-1 leading-relaxed">
                Wir nutzen technisch notwendige Funktionen für den Betrieb dieser Website. Zudem bieten wir optionale externe Dienste (Google Maps für die Standortkarte und SimplyBook.me für die Online-Terminbuchung) an. Sie können selbst entscheiden, welche Dienste Sie aktivieren möchten.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-[#E9DDDB]/60">
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#775B5D] hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors cursor-pointer order-3 sm:order-1 text-center"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Einstellungen anpassen</span>
            </button>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                type="button"
                onClick={acceptNecessary}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-[#D8C4C2] bg-white text-[#3E3335] text-xs font-medium hover:bg-[#E9DDDB]/30 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Nur notwendige
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#775B5D] text-white text-xs font-medium hover:bg-[#5E4749] active:scale-[0.98] transition-all shadow-xs cursor-pointer text-center"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. DETAILED CONSENT MODAL (Detaillierte Einstellungen) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#FBF8F6] border border-[#E9DDDB] rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E9DDDB] flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E9DDDB]/60 border border-[#D8C4C2] flex items-center justify-center text-[#775B5D] shrink-0">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="consent-modal-title" className="font-serif text-xl sm:text-2xl text-[#3E3335] font-normal">
                    Datenschutz- & Cookie-Einstellungen
                  </h2>
                  <p className="text-xs text-[#775B5D] mt-0.5">
                    Wählen Sie aus, welche Dienste Sie aktivieren möchten.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:text-[#3E3335] hover:bg-[#E9DDDB]/40 transition-colors cursor-pointer"
                aria-label="Dialog schließen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Categories */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left">
              <p className="text-xs sm:text-sm text-[#3E3335]/85 leading-relaxed font-light">
                Hier können Sie festlegen, welche externen Dienste auf dieser Website Daten verarbeiten dürfen. Die Einstellungen können jederzeit über den Link im Footer angepasst werden.
              </p>

              {/* Kategorie 1: Technisch notwendig */}
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E9DDDB] transition-all">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <span className="font-medium text-sm text-[#3E3335] block">
                      Technisch notwendige Funktionen
                    </span>
                    <span className="text-[11px] font-mono text-[#775B5D]">
                      Essenziell
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E9DDDB]/60 text-[#775B5D] border border-[#D8C4C2]">
                    Immer aktiv
                  </span>
                </div>
                <p className="text-xs text-[#3E3335]/75 font-light leading-relaxed">
                  Diese Funktionen sind für den sicheren und störungsfreien Betrieb der Website unerlässlich (z. B. Navigation, Sitzungssicherheit sowie das Speichern Ihrer Datenschutzeinstellungen).
                </p>
              </div>

              {/* Kategorie 2: Google Maps */}
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E9DDDB] hover:border-[#D8C4C2] transition-all">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex-1">
                    <label
                      htmlFor="consent-toggle-google-maps"
                      className="font-medium text-sm text-[#3E3335] cursor-pointer block"
                    >
                      Externe Medien – Google Maps
                    </label>
                    <span className="text-[11px] text-[#775B5D] block">
                      Standortanzeige (Hermeskeiler Str. 14, 50935 Köln)
                    </span>
                  </div>
                  {/* Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      id="consent-toggle-google-maps"
                      type="checkbox"
                      checked={draft.googleMaps}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, googleMaps: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E9DDDB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D8C4C2] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#775B5D]"></div>
                  </label>
                </div>
                <p className="text-xs text-[#3E3335]/75 font-light leading-relaxed">
                  Ermöglicht das direkte Laden und die interaktive Nutzung der Google-Maps-Karte zur Anfahrt. Bei Aktivierung können personenbezogene Daten (wie Ihre IP-Adresse) an Google LLC in den USA übertragen werden.
                </p>
              </div>

              {/* Kategorie 3: SimplyBook */}
              <div className="p-4 rounded-2xl bg-white/70 border border-[#E9DDDB] hover:border-[#D8C4C2] transition-all">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex-1">
                    <label
                      htmlFor="consent-toggle-simplybook"
                      className="font-medium text-sm text-[#3E3335] cursor-pointer block"
                    >
                      Online-Terminbuchung – SimplyBook.me
                    </label>
                    <span className="text-[11px] text-[#775B5D] block">
                      Terminkalender-Widget von SimplyBook
                    </span>
                  </div>
                  {/* Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      id="consent-toggle-simplybook"
                      type="checkbox"
                      checked={draft.simplyBook}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, simplyBook: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#E9DDDB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D8C4C2] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#775B5D]"></div>
                  </label>
                </div>
                <p className="text-xs text-[#3E3335]/75 font-light leading-relaxed">
                  Ermöglicht das Laden des interaktiven Online-Buchungssystems von SimplyBook.me. Bei Aktivierung werden externe Skripte von SimplyBook.me geladen und Daten zur Durchführung der Buchung übertragen.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 border-t border-[#E9DDDB] bg-[#FBF8F6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={acceptNecessary}
                className="px-4 py-2.5 rounded-full border border-[#D8C4C2] text-xs font-medium text-[#775B5D] hover:bg-[#E9DDDB]/30 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Nur notwendige
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-[#775B5D] text-[#775B5D] hover:bg-[#775B5D]/10 text-xs font-medium active:scale-[0.98] transition-all cursor-pointer text-center"
                >
                  Auswahl speichern
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#775B5D] text-white text-xs font-medium hover:bg-[#5E4749] active:scale-[0.98] transition-all shadow-xs cursor-pointer text-center"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
