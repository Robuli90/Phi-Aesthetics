import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import logoPhiImg from '../assets/images/Logo_Phi.png';

interface HeroProps {
  onStartTreatment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartTreatment }) => {
  const [imgSrc, setImgSrc] = useState(logoPhiImg);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center bg-[#FBF8F6] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-12 sm:pb-14 md:pb-16"
      aria-labelledby="hero-title"
    >
      {/* Hintergrund bleibt absolut frei und unbedruckt */}

      {/* Hero content container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Original unverändertes Logo_Phi.png als <img> Element – auf ca. die Hälfte verkleinert */}
        <div className="mb-4 md:mb-6 flex justify-center">
          <img
            src={imgSrc}
            alt="Phi Aesthetics – Ärztliche Ästhetik – So Individuell wie Du"
            referrerPolicy="no-referrer"
            onError={() => setImgSrc('/Logo_Phi.png')}
            className="w-32 sm:w-36 md:w-40 lg:w-48 max-w-full aspect-square object-contain mix-blend-multiply drop-shadow-xs transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Headline – zwei Schriftgrößen kleiner */}
        <h1
          id="hero-title"
          className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#3E3335] leading-[1.2] font-normal tracking-tight mb-4 max-w-2xl"
        >
          Ästhetische Medizin. Persönlich und auf deine Bedürfnisse abgestimmt.
        </h1>

        {/* Teaser – zwei Schriftgrößen kleiner */}
        <p className="text-sm sm:text-base text-[#3E3335]/85 leading-relaxed font-light max-w-xl mb-8 text-balance">
          Deine Arztpraxis für ästhetische Faltenbehandlungen mit Botulinumtoxin in Köln-Lindenthal.
        </p>

        {/* Genau ein primärer CTA */}
        <div>
          <button
            id="hero-primary-cta"
            onClick={onStartTreatment}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#775B5D] text-[#FBF8F6] text-base font-medium tracking-wide shadow-[0_4px_16px_rgba(119,91,93,0.18)] hover:bg-[#3E3335] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D] focus-visible:ring-offset-2"
          >
            <span>Deine Behandlung beginnen</span>
            <ArrowDown className="w-4 h-4 text-[#D8C4C2] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

