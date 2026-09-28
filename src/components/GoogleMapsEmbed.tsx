import React from 'react';
import { MapPin, ExternalLink, Map as MapIcon, ShieldCheck } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';
import { useConsent } from '../context/ConsentContext';

export const GoogleMapsEmbed: React.FC = () => {
  const { preferences, grantServiceConsent, openModal } = useConsent();
  const isMapLoaded = preferences.googleMaps;

  return (
    <div className="w-full">
      <div className="relative w-full rounded-2xl border border-[#E9DDDB] bg-[#FBF8F6] overflow-hidden shadow-xs transition-all">
        {!isMapLoaded ? (
          /* Datenschutzbewusster Platzhalter (Keine Verbindung zu Google vor Einwilligung) */
          <div
            className="p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center min-h-[340px] sm:min-h-[380px]"
            role="region"
            aria-label="Google Maps Kartenbereich"
          >
            {/* Dekoratives Icon */}
            <div className="w-14 h-14 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] flex items-center justify-center text-[#775B5D] mb-4">
              <MapPin className="w-6 h-6" aria-hidden="true" />
            </div>

            {/* Titel */}
            <h3 className="font-serif text-2xl sm:text-3xl text-[#3E3335] font-normal mb-2">
              Google Maps
            </h3>

            {/* Praxisadresse */}
            <p className="text-sm font-medium text-[#775B5D] mb-3">
              {CONTACT_CONFIG.fullAddress}
            </p>

            {/* Vorgeschriebener Hinweistext */}
            <p className="text-sm sm:text-base text-[#3E3335]/85 font-light max-w-lg leading-relaxed mb-6">
              Um die Karte anzuzeigen, laden Sie bitte Google Maps. Dabei können Daten an Google übertragen werden.
            </p>

            {/* Aktionsbutton: Google Maps laden */}
            <button
              type="button"
              onClick={() => grantServiceConsent('googleMaps')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#775B5D] text-white text-sm font-medium hover:bg-[#5E4749] focus:outline-none focus:ring-2 focus:ring-[#775B5D] focus:ring-offset-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <MapIcon className="w-4 h-4" aria-hidden="true" />
              <span>Google Maps laden</span>
            </button>

            {/* Direkter externer Link */}
            <div className="mt-5">
              <a
                href={CONTACT_CONFIG.googleMapsQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#775B5D] hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#775B5D] rounded px-1.5 py-1"
              >
                <span>Standort in Google Maps öffnen</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : (
          /* Nach Einwilligung: Google Maps iFrame */
          <div className="w-full flex flex-col">
            <div className="relative w-full h-[360px] sm:h-[420px] bg-[#E9DDDB]/20">
              <iframe
                title="Google Maps Standort: Hermeskeiler Str. 14, 50935 Köln"
                src={CONTACT_CONFIG.googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen={false}
              />
            </div>

            {/* Leiste unter der geladenen Karte mit Link zu Google Maps und Datenschutz-Option */}
            <div className="px-4 py-3 bg-[#FBF8F6] border-t border-[#E9DDDB] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#775B5D]">
              <div className="flex items-center gap-1.5 text-center sm:text-left">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{CONTACT_CONFIG.fullAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openModal}
                  className="underline hover:text-[#3E3335] transition-colors cursor-pointer"
                >
                  Einwilligung anpassen
                </button>
                <span>•</span>
                <a
                  href={CONTACT_CONFIG.googleMapsQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#3E3335] underline-offset-4 hover:underline transition-colors shrink-0"
                >
                  <span>Standort in Google Maps öffnen</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Datenschutzhinweis unterhalb des Kartenbereichs */}
      <p className="text-xs text-[#775B5D]/80 text-center mt-3 leading-relaxed max-w-xl mx-auto px-2">
        Weitere Informationen zur Datenverarbeitung durch Google finden Sie in den{' '}
        <a
          href={CONTACT_CONFIG.googlePrivacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#3E3335] transition-colors focus:outline-none focus:ring-1 focus:ring-[#775B5D] rounded"
        >
          Datenschutzhinweisen von Google
        </a>
        .
      </p>
    </div>
  );
};
