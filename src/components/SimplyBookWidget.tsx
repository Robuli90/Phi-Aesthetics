import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import { useConsent } from '../context/ConsentContext';
import { CONTACT_CONFIG } from '../config';

const SCRIPT_URL = 'https://widget.simplybook.it/v2/widget/widget.js';
const SCRIPT_ID = 'simplybook-widget-script';
const CONTAINER_ID = 'simplybook-widget-container';

const SIMPLYBOOK_URL = 'https://phiaesthetics.simplybook.it';
const SIMPLYBOOK_PRIVACY_URL = 'https://simplybook.me/de/privacy-policy';

// Vorgegebene SimplyBook-Widget-Konfiguration
const SIMPLYBOOK_OPTIONS = {
  widget_type: 'iframe',
  url: 'https://phiaesthetics.simplybook.it',
  theme: 'minimal',
  theme_settings: {
    timeline_show_end_time: '1',
    timeline_modern_display: 'as_slots',
    hide_company_label: '0',
    timeline_hide_unavailable: '1',
    hide_past_days: '0',
    sb_base_color: '#481e11',
    btn_color_1: '#481e11,#481e11,#481e11',
    link_color: '#cb8d75',
    display_item_mode: 'block',
    body_bg_color: '#ffffff',
    sb_review_image: '',
    dark_font_color: '#481e11',
    light_font_color: '#ffffff',
    sb_company_label_color: '#aa5939',
    hide_img_mode: '0',
    sb_busy: '#c7b3b3',
    sb_available: '#2b212b',
  },
  timeline: 'modern',
  datepicker: 'top_calendar',
  is_rtl: false,
  app_config: {
    clear_session: 0,
    allow_switch_to_ada: 0,
    predefined: [],
  },
};

export const SimplyBookWidget: React.FC = () => {
  const { preferences, grantServiceConsent, openModal } = useConsent();
  const isConsentGiven = preferences.simplyBook;

  const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef<boolean>(false);
  const widgetInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    // Wenn keine Einwilligung vorliegt, nichts initialisieren
    if (!isConsentGiven) {
      initializedRef.current = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      return;
    }

    let isMounted = true;

    const initWidget = () => {
      if (!isMounted) return;
      if (initializedRef.current) return;

      const SimplybookWidgetClass = (window as unknown as { SimplybookWidget?: any }).SimplybookWidget;
      if (typeof SimplybookWidgetClass === 'function') {
        try {
          // React Strict Mode & Mehrfach-Instanz-Schutz:
          // SimplyBook speichert ein internes Flag SimplybookWidget._instanceCreated
          SimplybookWidgetClass._instanceCreated = false;

          // Sicherstellen, dass der Container existiert und leer ist
          const containerElem = containerRef.current || document.getElementById(CONTAINER_ID);
          if (containerElem) {
            containerElem.innerHTML = '';
          }

          // Initialisiere das Widget mit der vorgegebenen Konfiguration und container_id
          const widget = new SimplybookWidgetClass({
            ...SIMPLYBOOK_OPTIONS,
            container_id: CONTAINER_ID,
          });

          widgetInstanceRef.current = widget;
          initializedRef.current = true;
          setIsLoadingScript(false);
        } catch (err) {
          console.error('Fehler bei SimplyBook Widget Initialisierung:', err);
          if (isMounted) {
            setLoadError('Das Buchungs-Widget konnte nicht initialisiert werden.');
            setIsLoadingScript(false);
          }
        }
      } else {
        if (isMounted) {
          setLoadError('SimplybookWidget Skript nicht verfügbar.');
          setIsLoadingScript(false);
        }
      }
    };

    // Prüfen, ob das Skript bereits im Dokument vorhanden ist
    let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if ((window as unknown as { SimplybookWidget?: unknown }).SimplybookWidget) {
      // Skript ist bereits geladen
      initWidget();
    } else if (scriptElement) {
      // Skript lädt bereits
      setIsLoadingScript(true);
      const onExistingScriptLoad = () => {
        initWidget();
      };
      scriptElement.addEventListener('load', onExistingScriptLoad, { once: true });
      return () => {
        scriptElement?.removeEventListener('load', onExistingScriptLoad);
      };
    } else {
      // Skript kontrolliert und erstmalig nach Freigabe dynamisch nachladen
      setIsLoadingScript(true);
      scriptElement = document.createElement('script');
      scriptElement.id = SCRIPT_ID;
      scriptElement.src = SCRIPT_URL;
      scriptElement.type = 'text/javascript';
      scriptElement.async = true;

      scriptElement.onload = () => {
        if (isMounted) {
          initWidget();
        }
      };

      scriptElement.onerror = () => {
        if (isMounted) {
          setLoadError('Das SimplyBook-Skript konnte nicht geladen werden.');
          setIsLoadingScript(false);
        }
      };

      document.body.appendChild(scriptElement);
    }

    return () => {
      isMounted = false;
      // Bereinigung bei Unmount
      initializedRef.current = false;
      const SimplybookWidgetClass = (window as unknown as { SimplybookWidget?: any })?.SimplybookWidget;
      if (SimplybookWidgetClass) {
        SimplybookWidgetClass._instanceCreated = false;
      }
    };
  }, [isConsentGiven]);

  return (
    <div className="w-full">
      {!isConsentGiven ? (
        /* DATENSCHUTZBEWUSSTER PLATZHALTER (Vor Einwilligung) */
        <div
          role="region"
          aria-label="Online-Terminbuchung Platzhalter"
          className="relative w-full rounded-2xl border border-[#E9DDDB] bg-[#FBF8F6] p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center shadow-xs"
        >
          {/* Kalender-Icon */}
          <div className="w-14 h-14 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] flex items-center justify-center text-[#775B5D] mb-4">
            <Calendar className="w-6 h-6" aria-hidden="true" />
          </div>

          {/* Titel */}
          <h3 className="font-serif text-2xl sm:text-3xl text-[#3E3335] font-normal mb-3">
            Online-Terminbuchung
          </h3>

          {/* Vorgegebener Hinweistext */}
          <p className="text-sm sm:text-base text-[#3E3335]/85 font-light max-w-xl leading-relaxed mb-6">
            Für die Online-Terminbuchung wird ein externer Dienst von SimplyBook.me geladen. Dabei können Daten an SimplyBook.me übertragen werden. Bitte geben Sie Ihre Einwilligung, um die Online-Terminbuchung zu laden.
          </p>

          {/* Aktionsbutton: Online-Terminbuchung laden */}
          <button
            type="button"
            onClick={() => grantServiceConsent('simplyBook')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#775B5D] text-white text-sm font-medium hover:bg-[#5E4749] focus:outline-none focus:ring-2 focus:ring-[#775B5D] focus:ring-offset-2 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Online-Terminbuchung laden</span>
          </button>

          {/* Direkter externer Link zu SimplyBook */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SIMPLYBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#775B5D] hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#775B5D] rounded px-2 py-1"
            >
              <span>Termin direkt auf SimplyBook buchen (externer Link)</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Datenschutzhinweis zu SimplyBook */}
          <p className="text-xs text-[#775B5D]/80 text-center mt-6 leading-relaxed max-w-lg">
            Weitere Informationen zur Datenverarbeitung finden Sie in den{' '}
            <a
              href={SIMPLYBOOK_PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#3E3335] transition-colors focus:outline-none focus:ring-1 focus:ring-[#775B5D] rounded"
            >
              Datenschutzbestimmungen von SimplyBook.me
            </a>
            .
          </p>
        </div>
      ) : (
        /* AKTIVER BEREICH (Nach Einwilligung) */
        <div className="w-full flex flex-col">
          {/* Ladezustand / Feedback */}
          {isLoadingScript && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-6 h-6 text-[#775B5D] animate-spin mb-3" />
              <p className="text-sm text-[#775B5D]">Terminbuchung wird geladen...</p>
            </div>
          )}

          {/* Fehleranzeige mit direktem Fallback-Link */}
          {loadError && (
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center mb-6">
              <p className="text-sm text-amber-900 mb-3">{loadError}</p>
              <a
                href={SIMPLYBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#775B5D] text-white text-xs font-medium hover:bg-[#5E4749] transition-colors"
              >
                <span>Direkt auf SimplyBook buchen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* SimplyBook Container für das iFrame Widget */}
          <div
            id={CONTAINER_ID}
            ref={containerRef}
            className="w-full min-h-[550px] sm:min-h-[650px] rounded-2xl overflow-hidden bg-white border border-[#E9DDDB] shadow-xs"
          />

          {/* Fußzeile unter dem Widget */}
          <div className="mt-3 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#775B5D]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#775B5D]" />
              <span>SimplyBook.me Terminbuchung aktiv</span>
              <span>•</span>
              <button
                type="button"
                onClick={openModal}
                className="underline hover:text-[#3E3335] transition-colors cursor-pointer"
              >
                Einwilligung anpassen
              </button>
            </div>
            <a
              href={SIMPLYBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#3E3335] underline transition-colors"
            >
              <span>Im neuen Fenster öffnen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
