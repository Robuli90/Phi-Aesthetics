import React from 'react';
import logoPhiImg from '../assets/images/Logo_Phi.png';

interface PhiLogoProps {
  variant?: 'header' | 'hero' | 'footer' | 'drawer' | 'standalone';
  className?: string;
}

/**
 * Verwendet an allen Stellen ausschließlich das originale unveränderte Logo_Phi.png als <img>-Element.
 * Das Bild wird weder beschnitten, noch generiert, noch als SVG konvertiert.
 * Jegliche Anpassung von Größe und Layout erfolgt strikt über CSS.
 */
export const PhiLogo: React.FC<PhiLogoProps> = ({
  variant = 'header',
  className = '',
}) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/Logo_Phi.png';
  };

  // 1. Hero: Auf der Startseite zentriert über der Headline
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={logoPhiImg}
          alt="Phi Aesthetics – Ärztliche Ästhetik – So Individuell wie Du"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className="w-64 sm:w-72 md:w-80 lg:w-96 max-w-full aspect-square object-contain mix-blend-multiply drop-shadow-xs transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
    );
  }

  // 2. Footer: Im Fußbereich als Markenabschluss
  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-center md:items-start ${className}`}>
        <img
          src={logoPhiImg}
          alt="Phi Aesthetics – Ärztliche Ästhetik – So Individuell wie Du"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className="w-36 sm:w-44 aspect-square object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  // 3. Drawer / Menü-Kopf
  if (variant === 'drawer') {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={logoPhiImg}
          alt="Phi Aesthetics"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className="w-12 h-12 aspect-square object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  // 4. Header (Default): In der Navigationsleiste oben links
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoPhiImg}
        alt="Phi Aesthetics – Ärztliche Ästhetik – So Individuell wie Du"
        referrerPolicy="no-referrer"
        onError={handleImgError}
        className="h-14 sm:h-16 w-auto aspect-square object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};

export default PhiLogo;

