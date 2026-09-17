import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';

interface ContactSectionProps {
  onDirectBooking?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const apiKey = CONTACT_CONFIG.googleMapsApiKey;

  useEffect(() => {
    if (!apiKey) {
      setMapError(true);
      return;
    }

    // Attempt to load Google Maps JS API if key is provided
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initMap();
    };
    script.onerror = () => {
      setMapError(true);
    };
    document.head.appendChild(script);

    function initMap() {
      // @ts-expect-error Google maps global
      if (window.google && window.google.maps && mapContainerRef.current) {
        try {
          // Default coordinates for Musterstadt or center
          const coords = { lat: 50.1109, lng: 8.6821 };
          // @ts-expect-error Google maps global
          const map = new window.google.maps.Map(mapContainerRef.current, {
            center: coords,
            zoom: 15,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#fbf8f6' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#d8c4c2' }],
              },
            ],
          });
          // @ts-expect-error Google maps global
          new window.google.maps.Marker({
            position: coords,
            map: map,
            title: CONTACT_CONFIG.practiceName,
          });
          setMapLoaded(true);
        } catch {
          setMapError(true);
        }
      } else {
        setMapError(true);
      }
    }
  }, [apiKey]);

  return (
    <section
      id="kontakt"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="contact-title"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Persönlicher Kontakt
          </span>
          <h2
            id="contact-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Sprich mit uns
          </h2>
          {/* Exakter CTA-Text */}
          <p className="text-base sm:text-lg text-[#3E3335]/90 font-light leading-relaxed">
            Melde Dich gerne jederzeit bei uns und wir planen gemeinsam deine individuelle Behandlung!
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address */}
            <div className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-1">
                  Praxisadresse
                </h4>
                <div className="text-base font-serif text-[#3E3335]">
                  {CONTACT_CONFIG.practiceName}
                </div>
                <div className="text-sm text-[#3E3335]/80 font-light">
                  {CONTACT_CONFIG.street}
                </div>
                <div className="text-sm text-[#3E3335]/80 font-light">
                  {CONTACT_CONFIG.zipCity}
                </div>
              </div>
            </div>

            {/* Email */}
            <a
              href={CONTACT_CONFIG.emailHref}
              className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#B99A99] transition-colors flex items-start gap-4 group block"
            >
              <div className="w-10 h-10 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#775B5D] group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-1">
                  E-Mail
                </h4>
                <div className="text-base font-serif text-[#3E3335] group-hover:text-[#775B5D] transition-colors">
                  {CONTACT_CONFIG.email}
                </div>
                <span className="text-xs text-[#775B5D]/70 mt-1 block">
                  Klicke hier, um uns direkt zu schreiben
                </span>
              </div>
            </a>

            {/* Phone */}
            <a
              href={CONTACT_CONFIG.phoneHref}
              className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#B99A99] transition-colors flex items-start gap-4 group block"
            >
              <div className="w-10 h-10 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#775B5D] group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-1">
                  Telefon & Rückfragen
                </h4>
                <div className="text-base font-serif text-[#3E3335] group-hover:text-[#775B5D] transition-colors">
                  {CONTACT_CONFIG.phone}
                </div>
                <span className="text-xs text-[#775B5D]/70 mt-1 block">
                  Mo–Fr 09:00–18:00 Uhr
                </span>
              </div>
            </a>
          </div>

          {/* Right: Map / Interactive Map Fallback */}
          <div className="lg:col-span-7">
            <div className="w-full h-full min-h-[320px] rounded-2xl border border-[#E9DDDB] bg-[#E9DDDB]/20 relative overflow-hidden flex flex-col justify-between p-8">
              {/* If Google Maps API key loaded and works */}
              {apiKey && !mapError ? (
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
              ) : (
                /* High quality fallback canvas with marker & Route planen button */
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                  {/* Decorative map stylized grid */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#775B5D" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF8F6] border border-[#D8C4C2] text-xs text-[#775B5D] font-medium mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#B99A99]" />
                      <span>Standort in Planung</span>
                    </div>

                    <h4 className="font-serif text-2xl text-[#3E3335] mb-2">
                      {CONTACT_CONFIG.practiceName}
                    </h4>
                    <p className="text-sm text-[#3E3335]/80 font-light">
                      {CONTACT_CONFIG.street}, {CONTACT_CONFIG.zipCity}
                    </p>
                  </div>

                  {/* Marker Pin Centerpiece */}
                  <div className="relative z-10 flex items-center justify-center py-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-[#FBF8F6] border border-[#D8C4C2] flex items-center justify-center shadow-md">
                        <MapPin className="w-7 h-7 text-[#775B5D]" />
                      </div>
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-[#775B5D]/20 blur-xs" />
                    </div>
                  </div>

                  {/* Route planen Button */}
                  <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs text-[#775B5D]">
                      Gute Erreichbarkeit & diskrete Atmosphäre
                    </span>
                    <a
                      href={CONTACT_CONFIG.googleMapsQueryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] transition-colors shadow-xs"
                    >
                      <span>Route planen</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#D8C4C2]" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
