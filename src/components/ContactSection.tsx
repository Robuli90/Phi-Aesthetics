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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Linker Bereich: Google Maps (kompakter dargestellt) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <GoogleMapsEmbed />
          </div>

          {/* Rechter Bereich: Köln-Botox-Praxis-Lindenthal.jpeg */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-[#E9DDDB] shadow-xs bg-[#F5ECE8]/30 flex flex-col justify-between">
              <div className="relative w-full flex-1 min-h-[260px]">
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
              <div className="p-4 sm:p-5 bg-[#FBF8F6] border-t border-[#E9DDDB] text-center">
                <h4 className="font-serif text-lg text-[#3E3335]">
                  Praxis für Botox in Köln-Lindenthal
                </h4>
                <p className="text-xs text-[#775B5D] mt-0.5 font-light">
                  Hermeskeiler Str. 14 • 50935 Köln
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

