import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { ADDON_OPTIONS, OTHER_TREATMENTS } from '../config';

interface PricingProps {
  onBookTreatment: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onBookTreatment }) => {
  return (
    <section
      id="preise"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="pricing-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Kostenübersicht
          </span>
          <h2
            id="pricing-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Transparente Preise
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light">
            Ehrliche, nachvollziehbare Honorare ohne versteckte Aufschläge – passend zu deinem individuellen Behandlungsplan.
          </p>
        </div>

        {/* Pricing Cards Structure aligned with Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Card 1: Zonenpreise */}
          <div
            id="pricing-card-zones"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-[#B99A99] block mb-2">
                Grundbehandlung
              </span>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-2">
                Zonenpreise
              </h3>
              <p className="text-xs text-[#3E3335]/70 font-light mb-6">
                Für die oberen Gesichtszonen (Glabella, Stirn, Laterale Augenwinkel).
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[#E9DDDB]">
                  <span className="text-sm font-medium text-[#3E3335]">1 Zone</span>
                  <span className="font-serif text-xl text-[#775B5D]">ab 160 €</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E9DDDB]">
                  <span className="text-sm font-medium text-[#3E3335]">2 Zonen</span>
                  <span className="font-serif text-xl text-[#775B5D]">ab 280 €</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E9DDDB]">
                  <span className="text-sm font-medium text-[#3E3335]">3 Zonen</span>
                  <span className="font-serif text-xl text-[#775B5D]">ab 360 €</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <span className="text-[11px] text-[#775B5D] block">
                Individuelle Kombination nach ärztlicher Beratung
              </span>
            </div>
          </div>

          {/* Card 2: Add-ons */}
          <div
            id="pricing-card-addons"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-[#B99A99] block mb-2">
                Ergänzungen
              </span>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-2">
                Add-ons
              </h3>
              <p className="text-xs text-[#3E3335]/70 font-light mb-6">
                Feine, gezielte Ergänzungen zum gewählten Zonenpaket.
              </p>

              <div className="space-y-2.5">
                {ADDON_OPTIONS.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between py-1.5 border-b border-[#E9DDDB]"
                  >
                    <span className="text-sm text-[#3E3335]">{addon.name}</span>
                    <span className="font-serif text-base text-[#775B5D]">
                      {addon.formattedPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4">
              <span className="text-[11px] text-[#775B5D] block">
                Kombinierbar mit den klassischen Zonenpaketen
              </span>
            </div>
          </div>

          {/* Card 3: Weitere Anwendungen */}
          <div
            id="pricing-card-other"
            className="p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-[#B99A99] block mb-2">
                Spezifische Bereiche
              </span>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-2">
                Weitere Anwendungen
              </h3>
              <p className="text-xs text-[#3E3335]/70 font-light mb-6">
                Spezialisierte Behandlungsansätze nach individueller Prüfung.
              </p>

              <div className="space-y-3.5">
                {OTHER_TREATMENTS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-[#E9DDDB]"
                  >
                    <span className="text-sm text-[#3E3335] max-w-[170px] leading-snug">
                      {item.name}
                    </span>
                    <span className="font-serif text-base text-[#775B5D] whitespace-nowrap">
                      {item.priceLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <span className="text-[11px] text-[#775B5D] block">
                Persönlicher Beratungstermin vorausgesetzt
              </span>
            </div>
          </div>
        </div>

        {/* Hinweis zur Abrechnung (GOÄ) */}
        <div
          id="pricing-goae-notice"
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#E9DDDB]/20 border border-[#D8C4C2] max-w-3xl mx-auto flex items-start sm:items-center gap-3.5 shadow-2xs"
        >
          <div className="p-2 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-[#775B5D] shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-[#3E3335] leading-relaxed font-light">
            <span className="font-medium text-[#775B5D]">Hinweis zur Abrechnung:</span>{' '}
            Die Abrechnung sämtlicher medizinischer Leistungen erfolgt transparent und gesetzeskonform auf Grundlage der amtlichen Gebührenordnung für Ärzte (GOÄ).
          </p>
        </div>

        {/* Ruhige, medizinisch verantwortungsvolle Zeile & Buchungslink */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#E9DDDB]/30 border border-[#D8C4C2] text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm md:text-base text-[#3E3335] font-light italic text-center sm:text-left">
            Die passende Behandlung und der genaue Umfang werden immer individuell im ärztlichen Gespräch festgelegt.
          </p>
          <button
            id="pricing-book-btn"
            onClick={onBookTreatment}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] transition-colors shrink-0 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D8C4C2]" />
            <span>Termin anfragen</span>
          </button>
        </div>
      </div>
    </section>
  );
};
