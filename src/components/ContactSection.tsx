import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';

interface ContactSectionProps {
  onDirectBooking?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [imgSrc, setImgSrc] = useState('/assets/Köln-Botox-Praxis-Lindenthal.jpeg');

  return (
    <section
      id="kontakt"
      className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-label="Persönliche Terminabsprache und Standort"
    >
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        {/* Persönliche Terminabsprache Header & Kontaktoptionen */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9DDDB]/60 text-[#775B5D] text-xs uppercase tracking-wider font-medium mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Persönliche Terminabsprache
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4">
            Fragen vorab oder keinen passenden Termin gefunden?
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light leading-relaxed">
            Kontaktiere uns gerne direkt: Nicht alle Zeitfenster sind online im Buchungssystem sichtbar – wir finden gemeinsam einen passenden Wunschtermin oder beantworten deine Fragen vorab.
          </p>
        </div>

        {/* 3 Kontakt-Karten: WhatsApp, Telefon, E-Mail */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {/* WhatsApp */}
          <a
            href="https://wa.me/4915233979650"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#25D366] hover:shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-colors mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#3E3335] group-hover:text-[#1EBE5D] transition-colors mb-1">
              WhatsApp
            </h3>
            <p className="text-xs text-[#775B5D] font-light">
              Schnell &amp; unkompliziert chatten
            </p>
            <span className="text-xs text-[#3E3335] font-medium mt-2">
              0152 33979650
            </span>
          </a>

          {/* Telefon */}
          <a
            href={CONTACT_CONFIG.phoneHref}
            className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#B99A99] hover:shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#775B5D] group-hover:text-white transition-colors mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#3E3335] group-hover:text-[#775B5D] transition-colors mb-1">
              Telefon
            </h3>
            <p className="text-xs text-[#775B5D] font-light">
              Direkt persönlich sprechen
            </p>
            <span className="text-xs text-[#3E3335] font-medium mt-2">
              0152 33979650
            </span>
          </a>

          {/* E-Mail */}
          <a
            href={CONTACT_CONFIG.emailHref}
            className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#B99A99] hover:shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#775B5D] group-hover:text-white transition-colors mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#3E3335] group-hover:text-[#775B5D] transition-colors mb-1">
              E-Mail
            </h3>
            <p className="text-xs text-[#775B5D] font-light">
              Anfrage schreiben
            </p>
            <span className="text-xs text-[#3E3335] font-medium mt-2 truncate max-w-full">
              info.phiaesthetics@gmail.com
            </span>
          </a>
        </div>

        {/* Standort: Google Maps und Praxisbild in exakt gleicher Größe nebeneinander */}
        <div className="pt-6">
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
      </div>
    </section>
  );
};

export default ContactSection;
