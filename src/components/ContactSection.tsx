import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';

interface ContactSectionProps {
  onDirectBooking?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  return (
    <section
      id="kontakt"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="contact-title"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
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

        {/* Contact Info Cards (E-Mail & Telefon) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Email */}
          <a
            href={CONTACT_CONFIG.emailHref}
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#B99A99] transition-all hover:shadow-xs flex items-start gap-4 group block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#775B5D] group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-1">
                E-Mail
              </h4>
              <div className="text-base sm:text-lg font-serif text-[#3E3335] group-hover:text-[#775B5D] transition-colors break-all">
                {CONTACT_CONFIG.email}
              </div>
              <span className="text-xs text-[#775B5D]/80 mt-1 block">
                Klicke hier, um uns direkt zu schreiben
              </span>
            </div>
          </a>

          {/* Phone */}
          <a
            href={CONTACT_CONFIG.phoneHref}
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#B99A99] transition-all hover:shadow-xs flex items-start gap-4 group block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center shrink-0 text-[#775B5D] group-hover:bg-[#775B5D] group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-1">
                Telefon & Rückfragen
              </h4>
              <div className="text-base sm:text-lg font-serif text-[#3E3335] group-hover:text-[#775B5D] transition-colors">
                {CONTACT_CONFIG.phone}
              </div>
              <span className="text-xs text-[#775B5D]/80 mt-1 block">
                Mo–Fr 09:00–18:00 Uhr
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
