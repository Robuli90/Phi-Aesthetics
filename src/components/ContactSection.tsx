import React, { useState } from 'react';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';

interface ContactSectionProps {
  onDirectBooking?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [imgSrc, setImgSrc] = useState('/assets/Köln-Botox-Praxis-Lindenthal.jpeg');

  return (
    <section
      id="kontakt"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-label="Google Maps Standort und Praxis"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Linker Bereich: Google Maps */}
          <div className="w-full">
            <GoogleMapsEmbed />
          </div>

          {/* Rechter Bereich: Köln-Botox-Praxis-Lindenthal.jpeg (exakt gleiche Größe wie die Google Map) */}
          <div className="w-full">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#E9DDDB] shadow-xs bg-[#F5ECE8]/30">
              <img
                src={imgSrc}
                alt="Praxis für Botox in Köln-Lindenthal – Behandlungsbereich"
                title="Köln Botox Praxis Lindenthal"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => {
                  if (imgSrc.includes('Köln')) {
                    setImgSrc('/assets/Köln-Botox-Praxis-Lindenthal.jpeg');
                  } else if (imgSrc.startsWith('/assets/')) {
                    setImgSrc(imgSrc.replace('/assets/', '/'));
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

