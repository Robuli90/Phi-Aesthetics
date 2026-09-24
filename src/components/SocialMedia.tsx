import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';
import { PhiLine } from './PhiLine';
import logoPhiImg from '../assets/images/Logo_Phi.png';

export const SocialMedia: React.FC = () => {
  const instagramUrl =
    CONTACT_CONFIG.instagramUrl ||
    'https://www.instagram.com/phi_aesthetics_koeln?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/Logo_Phi.png';
  };

  return (
    <section
      id="social-media"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="social-media-title"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Instagram
          </span>
          <h2
            id="social-media-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Social Media
          </h2>
          <p className="text-base sm:text-lg text-[#3E3335]/85 font-light leading-relaxed">
            Folge uns auf Instagram für Neuigkeiten, Wissenswertes rund um Botulinumtoxin und persönliche Einblicke aus unserer Praxis in Köln.
          </p>
        </div>

        {/* Profile Card Integration */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            {/* Profilbild mit dem offiziellen Website-Logo */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#B99A99] via-[#775B5D] to-[#D8C4C2] shadow-xs">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#FBF8F6] p-2 flex items-center justify-center">
                  <img
                    src={logoPhiImg}
                    alt="Phi Aesthetics Logo"
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                    onError={handleImgError}
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#775B5D] text-white rounded-full border-2 border-[#FBF8F6] shadow-xs">
                <Instagram className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
                  @phi_aesthetics_koeln
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E9DDDB]/60 text-[#775B5D]">
                  Ärztliche Praxis
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#3E3335]/85 font-light">
                Phi Aesthetics • Dr. med. Milena Philippi | Köln 📍
              </p>
              <p className="text-xs sm:text-sm text-[#775B5D] mt-1 font-light">
                Ärztliche Ästhetik – So Individuell wie Du
              </p>
            </div>
          </div>

          {/* Direct CTA */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#775B5D] text-[#FBF8F6] text-sm font-medium tracking-wide shadow-xs hover:bg-[#3E3335] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>Auf Instagram folgen</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Subtiler dekorativer Abschluss */}
        <PhiLine variant="divider" className="mt-16 opacity-50" />
      </div>
    </section>
  );
};
