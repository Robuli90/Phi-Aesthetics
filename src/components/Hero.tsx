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
      className="relative min-h-[85vh] flex items-center justify-center bg-[#FBF8F6] px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      aria-labelledby="hero-title"
    >
      {/* Hintergrund bleibt absolut frei und unbedruckt */}

      {/* Hero content container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Original unverändertes Logo_Phi.png als <img> Element */}
        <div className="mb-8 md:mb-10 flex justify-center">
          <img
            src={imgSrc}
            alt="Phi Aesthetics – Ärztliche Ästhetik – So Individuell wie Du"
            referrerPolicy="no-referrer"
            onError={() => setImgSrc('/Logo_Phi.png')}
            className="w-64 sm:w-72 md:w-80 lg:w-96 max-w-full aspect-square object-contain mix-blend-multiply drop-shadow-xs transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Prominente Headline */}
        <h1
          id="hero-title"
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#3E3335] leading-[1.15] font-normal tracking-tight mb-6 max-w-2xl"
        >
          Ärztliche Ästhetik – So Individuell wie Du
        </h1>

        {/* Kurze Einleitung */}
        <p className="text-base sm:text-lg md:text-xl text-[#3E3335]/85 leading-relaxed font-light max-w-xl mb-10 text-balance">
          Ästhetische Medizin beginnt für uns mit einem persönlichen Gespräch: mit deinen Wünschen, deinem Gesicht und dem, was sich für dich richtig anfühlt.
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

