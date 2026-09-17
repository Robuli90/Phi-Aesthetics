import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PhiLine } from './PhiLine';

interface PortfolioProps {
  onLearnMore: (faqCategory?: 'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit') => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onLearnMore }) => {
  return (
    <section
      id="angebote"
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="portfolio-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Leistungsportfolio
          </span>
          <h2
            id="portfolio-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Was wir anbieten
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light">
            Ein fokussiertes Spektrum ärztlicher Botulinumtoxin-Behandlungen – präzise abgestimmt auf deine natürliche Mimik.
          </p>
        </div>

        {/* 4 Connected Blocks in Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Block 1: Klassische obere Gesichtszonen */}
          <div
            id="portfolio-block-1"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[#B99A99] mb-3">Kapitel 01</div>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-3">
                Die drei oberen Gesichtszonen
              </h3>
              <p className="text-sm text-[#3E3335]/80 font-light leading-relaxed mb-6">
                Drei häufig behandelte Bereiche im oberen Gesicht. Welche Zone oder Kombination zu dir passt, wird individuell im ärztlichen Gespräch besprochen.
              </p>

              {/* Leistungen */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Glabella', 'Stirn', 'Laterale Augenwinkel'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onLearnMore('behandlungen')}
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#775B5D] hover:text-[#3E3335] group focus:outline-none focus-visible:underline"
            >
              <span>Mehr erfahren</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Block 2: Zonenpakete */}
          <div
            id="portfolio-block-2"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[#B99A99] mb-3">Kapitel 02</div>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-3">
                Deine Zonen – einzeln oder kombiniert
              </h3>
              <p className="text-sm text-[#3E3335]/80 font-light leading-relaxed mb-6">
                Du entscheidest nicht nach einem starren Standard, sondern gemeinsam mit uns, welche Bereiche zu deinem Ziel passen.
              </p>

              {/* Leistungen */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['1 Zone', '2 Zonen', '3 Zonen'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onLearnMore('grundlagen')}
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#775B5D] hover:text-[#3E3335] group focus:outline-none focus-visible:underline"
            >
              <span>Mehr erfahren</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Block 3: Add-ons */}
          <div
            id="portfolio-block-3"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[#B99A99] mb-3">Kapitel 03</div>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-3">
                Feine Ergänzungen
              </h3>
              <p className="text-sm text-[#3E3335]/80 font-light leading-relaxed mb-6">
                Kleine Ergänzungen, die je nach Ausgangssituation und Behandlungsziel zusätzlich berücksichtigt werden können.
              </p>

              {/* Leistungen */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Bunny Lines', 'Lip Flip', 'DAO', 'Brow Lift', 'Gummy Smile', 'Kinn'].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onLearnMore('behandlungen')}
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#775B5D] hover:text-[#3E3335] group focus:outline-none focus-visible:underline"
            >
              <span>Mehr erfahren</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Block 4: Weitere Anwendungen */}
          <div
            id="portfolio-block-4"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[#B99A99] mb-3">Kapitel 04</div>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-3">
                Weitere Botoxbehandlungen
              </h3>
              <p className="text-sm text-[#3E3335]/80 font-light leading-relaxed mb-6">
                Weitere Behandlungsmöglichkeiten, die einen persönlichen Beratungstermin und eine individuelle ärztliche Einschätzung voraussetzen.
              </p>

              {/* Leistungen */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  'Masseter',
                  'Nefertiti',
                  'Hyperhidrose im Bereich Achseln/Arme',
                  'Hände',
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#E9DDDB]/50 border border-[#D8C4C2] text-xs font-medium text-[#3E3335]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onLearnMore('behandlungen')}
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#775B5D] hover:text-[#3E3335] group focus:outline-none focus-visible:underline"
            >
              <span>Mehr erfahren</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Subtle connecting Phi line */}
        <PhiLine variant="divider" className="mt-16 opacity-60" />
      </div>
    </section>
  );
};
