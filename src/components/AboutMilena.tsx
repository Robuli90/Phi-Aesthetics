import React, { useState } from 'react';
import { PhiLine } from './PhiLine';

export const AboutMilena: React.FC = () => {
  const [imgSrc, setImgSrc] = useState('/assets/Botox_Köln_Dr_Milena_Philippi.jpeg');

  return (
    <section
      id="dr-milena"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="about-milena-title"
    >
      <div className="max-w-5xl mx-auto">
        {/* Raster: Text & Überschrift links, Bild rechts über die gesamte Länge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-10 md:mb-12">
          {/* Linker Bereich: Überschrift, Subline, Pills & Text */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
                Über mich
              </span>

              <h2
                id="about-milena-title"
                className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E3335] font-normal mb-2"
              >
                Dr. Milena Philippi
              </h2>

              <p className="text-sm sm:text-base uppercase tracking-wider text-[#775B5D] font-medium mb-6">
                Ärztin und Gründerin von Phi Aesthetics
              </p>

              {/* Fakten-Pills */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="px-3.5 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]">
                  Approbierte Ärztin
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]">
                  Fortbildung in der ästhetischen Anwendung von Botulinumtoxin
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]">
                  Gründerin von Phi Aesthetics
                </span>
              </div>

              {/* Warmer, persönlicher Text */}
              <div className="space-y-4 text-base sm:text-lg text-[#3E3335]/85 leading-relaxed font-light">
                <p>
                  Ästhetische Medizin bedeutet für mich nicht, einem einheitlichen Ideal zu folgen. Es geht darum, dich kennenzulernen, deine Wünsche zu verstehen und gemeinsam eine Behandlung zu planen, die zu dir passt. Meine Arbeit verbindet ärztliche Verantwortung mit einem feinen Blick für natürliche, stimmige Ergebnisse.
                </p>
                <p>
                  Ärztliche Ästhetik – so individuell wie du: Dieser Gedanke begleitet jede Beratung und jede Behandlung bei Phi Aesthetics.
                </p>
              </div>
            </div>
          </div>

          {/* Rechter Bereich: Botox_Köln_Dr_Milena_Philippi.jpeg über die gesamte Länge */}
          <div className="lg:col-span-5 flex">
            <div className="relative w-full rounded-3xl overflow-hidden border border-[#E9DDDB] shadow-xs bg-[#F5ECE8]/40 min-h-[380px] lg:min-h-full">
              <img
                src={imgSrc}
                alt="Dr. med. Milena Philippi – Ärztin und Gründerin von Phi Aesthetics in Köln"
                title="Dr. med. Milena Philippi"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => {
                  if (imgSrc.includes('Köln')) {
                    setImgSrc('/assets/Botox_Köln_Dr_Milena_Philippi.jpeg');
                  } else if (imgSrc.startsWith('/assets/')) {
                    setImgSrc(imgSrc.replace('/assets/', '/'));
                  }
                }}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Hervorgehobener, ruhiger Zitat-Block über die volle Breite der Website */}
        <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#E9DDDB]/35 border-l-4 border-[#775B5D] border-y border-r border-[#E9DDDB] relative">
          <blockquote className="font-serif text-lg sm:text-xl text-[#3E3335] italic leading-relaxed">
            „Ästhetik bedeutet für mich nicht, das Aussehen eines Menschen zu verändern, sondern das zu unterstreichen, was ihn ausmacht und womit er sich wohlfühlt.“
          </blockquote>
          <div className="mt-3 text-xs uppercase tracking-widest text-[#775B5D] font-medium">
            — Dr. Milena Philippi
          </div>
        </div>

        {/* Subtiler Liniengruß */}
        <PhiLine variant="divider" className="mt-16 opacity-50" />
      </div>
    </section>
  );
};
