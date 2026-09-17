import React, { useState } from 'react';
import milenaImg from '../assets/images/dr_milena_portrait_1788983023762.jpg';
import logoPhiImg from '../assets/images/Logo_Phi.png';

interface MilenaPortraitProps {
  className?: string;
}

export const MilenaPortrait: React.FC<MilenaPortraitProps> = ({ className = '' }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (!imageFailed) {
    return (
      <div className={`relative rounded-2xl overflow-hidden border border-[#E9DDDB] shadow-sm bg-[#FBF8F6] ${className}`}>
        <img
          src={milenaImg}
          alt="Dr. Milena Philippi – Ärztin und Gründerin von Phi Aesthetics"
          onError={() => setImageFailed(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700"
        />
        {/* Soft overlay gradient at the bottom for elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3E3335]/20 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Fallback
  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-[#E9DDDB] bg-gradient-to-b from-[#FBF8F6] to-[#E9DDDB]/40 p-8 flex flex-col items-center justify-between min-h-[460px] ${className}`}
      role="img"
      aria-label="Porträt Dr. Milena Philippi – Ärztliche Ästhetik"
    >
      <div className="relative z-10 w-full flex justify-center mt-6">
        <div className="w-28 h-28 rounded-full bg-[#FBF8F6] border border-[#D8C4C2] flex items-center justify-center p-3 shadow-sm overflow-hidden">
          <img
            src={logoPhiImg}
            alt="Phi Aesthetics"
            referrerPolicy="no-referrer"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Logo_Phi.png'; }}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-xs mb-4">
        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-[#D8C4C2]/30 border border-[#D8C4C2] text-xs font-medium text-[#775B5D] tracking-wide">
          Ärztliche Ästhetik
        </div>
        <h4 className="font-serif text-2xl text-[#3E3335] tracking-wide mb-1">
          Dr. Milena Philippi
        </h4>
        <p className="text-xs text-[#775B5D] uppercase tracking-widest font-medium">
          Ärztin & Gründerin von Phi Aesthetics
        </p>
      </div>

      <div className="relative z-10 w-full border-t border-[#E9DDDB] pt-4 text-center">
        <span className="text-xs text-[#775B5D]/80 italic">
          Individuelle Planung • Medizinische Verantwortung • Natürliche Ergebnisse
        </span>
      </div>
    </div>
  );
};
