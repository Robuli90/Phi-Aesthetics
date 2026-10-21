import React, { useState, useMemo } from 'react';
import { CheckCircle2, Calendar, Info } from 'lucide-react';
import {
  ZONE_OPTIONS,
  ZONE_PRICES,
  ADDON_OPTIONS,
  OTHER_TREATMENTS,
} from '../config';

interface PortfolioProps {
  onBookTreatment?: () => void;
  onLearnMore?: (faqCategory?: 'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit') => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onBookTreatment }) => {
  const [imgSrc, setImgSrc] = useState('/assets/Botox-in-Köln-am-Hermeskeiler_Platz.jpeg');

  // Treatment selection state
  const [treatmentType, setTreatmentType] = useState<'zones' | 'other'>('zones');
  const [zoneCount, setZoneCount] = useState<1 | 2 | 3>(2);
  const [selectedZones, setSelectedZones] = useState<string[]>(['glabella', 'stirn']);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedOther, setSelectedOther] = useState<string>('masseter');

  // Dynamic price calculation
  const calculatedPrice = useMemo(() => {
    if (treatmentType === 'other') {
      const item = OTHER_TREATMENTS.find((t) => t.id === selectedOther);
      return item ? item.basePrice || 0 : 0;
    }
    const base = ZONE_PRICES[zoneCount] || 0;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = ADDON_OPTIONS.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return base + addonsTotal;
  }, [treatmentType, zoneCount, selectedAddons, selectedOther]);

  const handleZoneCountChange = (count: 1 | 2 | 3) => {
    setTreatmentType('zones');
    setZoneCount(count);
    const defaultZonePool = ['glabella', 'stirn', 'augenwinkel'];
    setSelectedZones(defaultZonePool.slice(0, count));
  };

  const handleToggleZone = (zoneId: string) => {
    setTreatmentType('zones');
    if (selectedZones.includes(zoneId)) {
      if (selectedZones.length > 1) {
        setSelectedZones((prev) => prev.filter((id) => id !== zoneId));
      }
    } else {
      if (selectedZones.length < zoneCount) {
        setSelectedZones((prev) => [...prev, zoneId]);
      } else {
        setSelectedZones((prev) => [...prev.slice(1), zoneId]);
      }
    }
  };

  const handleToggleAddon = (addonId: string) => {
    setTreatmentType('zones');
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSelectOther = (otherId: string) => {
    setTreatmentType('other');
    setSelectedOther(otherId);
  };

  const handleBook = () => {
    if (onBookTreatment) {
      onBookTreatment();
    } else {
      const el = document.getElementById('termin-buchen');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="angebote"
      className="relative py-12 md:py-18 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="portfolio-title"
    >
      {/* Anchor for preise so existing links or bookmarks continue to work */}
      <div id="preise" className="sr-only" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header: Überschrift & Text links, Bild rechts */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-10 max-w-4xl mx-auto mb-16">
          {/* Überschrift & Text links */}
          <div className="flex-1 flex flex-col justify-center self-center sm:self-start">
            <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
              Leistungsportfolio und Preise
            </span>
            <h2
              id="portfolio-title"
              className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
            >
              Was wir anbieten
            </h2>
            <p className="text-base text-[#3E3335]/80 font-light leading-relaxed">
              Ein fokussiertes Spektrum ärztlicher Botulinumtoxin-Behandlungen (Botox®) – präzise abgestimmt auf deine natürliche Mimik.
            </p>
          </div>

          {/* Bild rechts: Botox-in-Köln-am-Hermeskeiler_Platz.jpeg */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden border border-[#E9DDDB] shadow-xs shrink-0 bg-[#F5ECE8]/30">
            <img
              src={imgSrc}
              alt="Praxis am Hermeskeiler Platz in Köln – Leistungsportfolio"
              title="Botox in Köln am Hermeskeiler Platz"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => {
                if (imgSrc.includes('Köln')) {
                  setImgSrc('/assets/Botox-in-Köln-am-Hermeskeiler_Platz.jpeg');
                } else if (imgSrc.startsWith('/assets/')) {
                  setImgSrc(imgSrc.replace('/assets/', '/'));
                }
              }}
            />
          </div>
        </div>

        {/* 3 Interaktive Boxen: GRUNDBEHANDLUNG, ERGÄNZUNGEN, SPEZIFISCHE BEREICHE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 items-stretch">
          {/* Box 1: GRUNDBEHANDLUNG (Zonenpreise) */}
          <div
            id="portfolio-card-zones"
            className={`p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border transition-all flex flex-col justify-between ${
              treatmentType === 'zones'
                ? 'border-[#B99A99] shadow-sm'
                : 'border-[#E9DDDB] hover:border-[#D8C4C2]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#B99A99] font-medium">
                  Grundbehandlung
                </span>
                {treatmentType === 'zones' && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#775B5D] text-white">
                    Aktiv
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-2">
                Zonenpreise
              </h3>
              <p className="text-xs text-[#3E3335]/70 font-light mb-6">
                Für die oberen Gesichtszonen (Glabella, Stirn, Laterale Augenwinkel). Wähle deine Zonenanzahl:
              </p>

              {/* Zonenanzahl-Schalter (1, 2 oder 3 Zonen) */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {([1, 2, 3] as const).map((count) => {
                  const isSelected = treatmentType === 'zones' && zoneCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleZoneCountChange(count)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#775B5D] text-white border-[#775B5D] shadow-xs'
                          : 'bg-white border-[#E9DDDB] text-[#3E3335] hover:border-[#D8C4C2]'
                      }`}
                    >
                      <span className="block font-serif text-base font-normal">
                        {count} {count === 1 ? 'Zone' : 'Zonen'}
                      </span>
                      <span
                        className={`text-[11px] block ${
                          isSelected ? 'text-white/85' : 'text-[#775B5D]'
                        }`}
                      >
                        ab {ZONE_PRICES[count]} €
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Zonen-Auswahl (Glabella, Stirn, Augenwinkel) */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#775B5D] font-medium block mb-1">
                  Bereiche auswählen ({treatmentType === 'zones' ? selectedZones.length : 0}/{zoneCount}):
                </span>
                {ZONE_OPTIONS.map((zone) => {
                  const isSelected = treatmentType === 'zones' && selectedZones.includes(zone.id);
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => handleToggleZone(zone.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D8C4C2]/20 border-[#B99A99] text-[#3E3335]'
                          : 'bg-white border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2]'
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-[#3E3335]">
                          {zone.name}
                        </div>
                        <div className="text-[11px] text-[#3E3335]/65 font-light">
                          {zone.description}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                          isSelected
                            ? 'bg-[#775B5D] border-[#775B5D] text-white'
                            : 'border-[#D8C4C2]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9DDDB]">
              <span className="text-[11px] text-[#775B5D] block">
                Individuelle Kombination nach ärztlicher Beratung
              </span>
            </div>
          </div>

          {/* Box 2: ERGÄNZUNGEN (Add-ons) */}
          <div
            id="portfolio-card-addons"
            className={`p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border transition-all flex flex-col justify-between ${
              selectedAddons.length > 0 && treatmentType === 'zones'
                ? 'border-[#B99A99] shadow-sm'
                : 'border-[#E9DDDB] hover:border-[#D8C4C2]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#B99A99] font-medium">
                  Ergänzungen
                </span>
                {selectedAddons.length > 0 && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#775B5D] text-white">
                    {selectedAddons.length} gewählt
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl text-[#3E3335] mb-2">
                Add-ons
              </h3>
              <p className="text-xs text-[#3E3335]/70 font-light mb-6">
                Feine, gezielte Ergänzungen zum gewählten Zonenpaket. Klicke zum Hinzufügen:
              </p>

              <div className="space-y-2">
                {ADDON_OPTIONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D8C4C2]/20 border-[#B99A99] text-[#3E3335]'
                          : 'bg-white border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2]'
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-[#3E3335]">
                          {addon.name}
                        </div>
                        <div className="text-[11px] text-[#3E3335]/65 font-light line-clamp-1">
                          {addon.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="font-serif text-xs text-[#775B5D]">
                          {addon.formattedPrice}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#775B5D] border-[#775B5D] text-white'
                              : 'border-[#D8C4C2]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9DDDB]">
              <span className="text-[11px] text-[#775B5D] block">
                Kombinierbar mit den klassischen Zonenpaketen
              </span>
            </div>
          </div>

          {/* Box 3: SPEZIFISCHE BEREICHE (Weitere Anwendungen) */}
          <div className="flex flex-col justify-between">
            <div
              id="portfolio-card-other"
              className={`p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border transition-all flex flex-col justify-between flex-1 ${
                treatmentType === 'other'
                  ? 'border-[#B99A99] shadow-sm'
                  : 'border-[#E9DDDB] hover:border-[#D8C4C2]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-[#B99A99] font-medium">
                    Spezifische Bereiche
                  </span>
                  {treatmentType === 'other' && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#775B5D] text-white">
                      Aktiv
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl text-[#3E3335] mb-2">
                  Weitere Anwendungen
                </h3>
                <p className="text-xs text-[#3E3335]/70 font-light mb-6">
                  Spezialisierte Behandlungsansätze nach individueller Prüfung. Klicke zum Auswählen:
                </p>

                <div className="space-y-2.5">
                  {OTHER_TREATMENTS.map((item) => {
                    const isSelected = treatmentType === 'other' && selectedOther === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectOther(item.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D8C4C2]/20 border-[#B99A99] text-[#3E3335]'
                            : 'bg-white border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2]'
                        }`}
                      >
                        <div className="pr-2">
                          <div className="text-xs sm:text-sm font-medium text-[#3E3335] leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#3E3335]/65 font-light line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-serif text-xs sm:text-sm text-[#775B5D] whitespace-nowrap">
                            {item.priceLabel}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#775B5D] border-[#775B5D] text-white'
                                : 'border-[#D8C4C2]'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E9DDDB]">
                <span className="text-[11px] text-[#775B5D] block">
                  Persönlicher Beratungstermin vorausgesetzt
                </span>
              </div>
            </div>

            {/* GOÄ-Hinweis direkt unter der Box SPEZIFISCHE BEREICHE mit einem "*" */}
            <p className="text-[11px] text-[#775B5D] mt-2.5 px-1 font-light leading-relaxed">
              * Hinweis zur Abrechnung: Die Abrechnung sämtlicher medizinischer Leistungen erfolgt transparent und gesetzeskonform auf Grundlage der amtlichen Gebührenordnung für Ärzte (GOÄ).
            </p>
          </div>
        </div>

        {/* PREISORIENTIERUNGSLEISTE (entsprechend der angeklickten Leistungen) */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#E9DDDB]/35 border border-[#D8C4C2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-1">
              Deine Preisorientierung
            </span>
            <p className="text-sm text-[#3E3335]">
              {treatmentType === 'zones' ? (
                <>
                  <span className="font-medium">{zoneCount} {zoneCount === 1 ? 'Zone' : 'Zonen'}</span>
                  {selectedZones.length > 0 && ` (${selectedZones.map(id => ZONE_OPTIONS.find(z => z.id === id)?.name).filter(Boolean).join(', ')})`}
                  {selectedAddons.length > 0 && (
                    <span className="text-[#775B5D]">
                      {' '}+ {selectedAddons.length} Add-on(s) ({selectedAddons.map(id => ADDON_OPTIONS.find(a => a.id === id)?.name).join(', ')})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-medium">
                    {OTHER_TREATMENTS.find((t) => t.id === selectedOther)?.name}
                  </span>
                  <span className="text-[#775B5D]"> (Spezifische Anwendung)</span>
                </>
              )}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-[#775B5D] block">
              Richtpreis
            </span>
            <span className="font-serif text-3xl text-[#775B5D] font-normal">
              ab {calculatedPrice} €
            </span>
          </div>
        </div>

        {/* Zentrierter CTA-Button "Termin anfragen" ans Ende – doppelt so groß dargestellt */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <button
            id="portfolio-book-btn"
            type="button"
            onClick={handleBook}
            className="inline-flex items-center justify-center gap-4 px-12 sm:px-16 py-5 sm:py-6 rounded-full bg-[#775B5D] text-[#FBF8F6] text-base sm:text-lg uppercase tracking-widest font-semibold hover:bg-[#3E3335] transition-all shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Calendar className="w-6 h-6 text-[#D8C4C2]" />
            <span>Termin anfragen</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
