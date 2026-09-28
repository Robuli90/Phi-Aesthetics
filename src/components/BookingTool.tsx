import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Info,
  Mail,
  MessageCircle,
} from 'lucide-react';
import {
  ZONE_OPTIONS,
  ZONE_PRICES,
  ADDON_OPTIONS,
  OTHER_TREATMENTS,
  CONTACT_CONFIG,
} from '../config';
import { SimplyBookWidget } from './SimplyBookWidget';

export const BookingTool: React.FC = () => {
  // Treatment selection state (Defaults to "Botoxbehandlung nach Zonen")
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

  // Zone selection toggle with validation enforcement
  const handleToggleZone = (zoneId: string) => {
    if (selectedZones.includes(zoneId)) {
      if (selectedZones.length > 1) {
        setSelectedZones((prev) => prev.filter((id) => id !== zoneId));
      }
    } else {
      if (selectedZones.length < zoneCount) {
        setSelectedZones((prev) => [...prev, zoneId]);
      } else {
        // Replace oldest or shift
        setSelectedZones((prev) => [...prev.slice(1), zoneId]);
      }
    }
  };

  const handleZoneCountChange = (count: 1 | 2 | 3) => {
    setZoneCount(count);
    const defaultZonePool = ['glabella', 'stirn', 'augenwinkel'];
    setSelectedZones(defaultZonePool.slice(0, count));
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const isZoneSelectionValid = selectedZones.length === zoneCount;

  return (
    <section
      id="termin-buchen"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="booking-title"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Interaktive Terminauswahl
          </span>
          <h2
            id="booking-title"
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E3335] font-normal mb-4"
          >
            Termin finden
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light">
            Plane deine individuelle Behandlung in Ruhe: Berechne deine gewünschten Behandlungszonen und buche deinen Wunschtermin direkt online.
          </p>
        </div>

        {/* 2-STEP LAYOUT: UNTEREINANDER (STACKED) FÜR MAXIMALE BREITE */}
        <div className="space-y-12">
          {/* SCHRITT 1: BEHANDLUNG & PREISORIENTIERUNG */}
          <div className="w-full bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-xs p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9DDDB]">
              <div>
                <span className="text-xs font-mono text-[#B99A99] uppercase tracking-wider block mb-1">
                  Schritt 1
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
                  Behandlung & Preisorientierung
                </h3>
              </div>

              {/* Treatment Type Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-[#E9DDDB]/40 border border-[#D8C4C2]/50 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTreatmentType('zones')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    treatmentType === 'zones'
                      ? 'bg-white text-[#3E3335] shadow-xs'
                      : 'text-[#775B5D] hover:text-[#3E3335]'
                  }`}
                >
                  Faltenbehandlung nach Zonen
                </button>
                <button
                  type="button"
                  onClick={() => setTreatmentType('other')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    treatmentType === 'other'
                      ? 'bg-white text-[#3E3335] shadow-xs'
                      : 'text-[#775B5D] hover:text-[#3E3335]'
                  }`}
                >
                  Spezifische Anwendungen
                </button>
              </div>
            </div>

            {treatmentType === 'zones' ? (
              <div className="space-y-8">
                {/* Zone Count & Zones Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Zone Count Selection */}
                  <div className="lg:col-span-4">
                    <label className="block text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-3">
                      Anzahl Behandlungszonen
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {([1, 2, 3] as const).map((count) => {
                        const isSelected = zoneCount === count;
                        return (
                          <button
                            key={count}
                            type="button"
                            onClick={() => handleZoneCountChange(count)}
                            className={`p-3.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'bg-[#775B5D] text-white border-[#775B5D] shadow-xs'
                                : 'bg-[#FBF8F6] border-[#E9DDDB] text-[#3E3335] hover:border-[#D8C4C2]'
                            }`}
                          >
                            <span className="block font-serif text-lg font-normal mb-0.5">
                              {count} {count === 1 ? 'Zone' : 'Zonen'}
                            </span>
                            <span className={`text-[11px] block ${isSelected ? 'text-white/80' : 'text-[#775B5D]'}`}>
                              ab {ZONE_PRICES[count]} €
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Upper Face Zones checklist */}
                  <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs uppercase tracking-wider text-[#775B5D] font-medium">
                        Gewählte Bereiche ({selectedZones.length}/{zoneCount})
                      </label>
                      {!isZoneSelectionValid && (
                        <span className="text-[11px] text-[#D69292]">
                          Bitte genau {zoneCount} wählen
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {ZONE_OPTIONS.map((zone) => {
                        const isSelected = selectedZones.includes(zone.id);
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => handleToggleZone(zone.id)}
                            className={`flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-[#D8C4C2]/20 border-[#B99A99] text-[#3E3335]'
                                : 'bg-[#FBF8F6] border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="text-sm font-medium text-[#3E3335]">{zone.name}</div>
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? 'bg-[#775B5D] border-[#775B5D] text-white' : 'border-[#D8C4C2]'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                            </div>
                            <div className="text-xs text-[#3E3335]/65 font-light leading-snug">{zone.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Optional Add-ons */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-3">
                    Optionale Feine Ergänzungen (Add-ons)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {ADDON_OPTIONS.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => handleToggleAddon(addon.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#D8C4C2]/20 border-[#B99A99] text-[#3E3335]'
                              : 'bg-[#FBF8F6] border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2]'
                          }`}
                        >
                          <div className="flex items-start justify-between w-full mb-1">
                            <span className="text-xs font-medium text-[#3E3335]">{addon.name}</span>
                            <span className="text-[10px] font-mono text-[#775B5D] shrink-0 ml-1">{addon.formattedPrice}</span>
                          </div>
                          <span className="text-[10px] text-[#3E3335]/60 font-light line-clamp-2">
                            {addon.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preisorientierungsleiste */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#E9DDDB]/30 border border-[#D8C4C2] flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#775B5D] block">
                      Preisorientierung
                    </span>
                    <span className="text-xs text-[#3E3335]/70">
                      {zoneCount} Zone(n) {selectedAddons.length > 0 ? `+ ${selectedAddons.length} Add-on(s)` : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl sm:text-3xl text-[#775B5D] font-normal">
                      ab {calculatedPrice} €
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Other Treatments selection - Full Width */
              <div className="space-y-6">
                <label className="block text-xs uppercase tracking-wider text-[#775B5D] font-medium">
                  Spezifische Anwendung wählen
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {OTHER_TREATMENTS.map((treatment) => {
                    const isSelected = selectedOther === treatment.id;
                    return (
                      <button
                        key={treatment.id}
                        type="button"
                        onClick={() => setSelectedOther(treatment.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#D8C4C2]/20 border-[#B99A99] text-[#3E3335]'
                            : 'bg-[#FBF8F6] border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2]'
                        }`}
                      >
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-[#3E3335]">{treatment.name}</span>
                            <span className="font-serif text-sm text-[#775B5D] font-medium">
                              {treatment.priceLabel}
                            </span>
                          </div>
                          <p className="text-xs text-[#3E3335]/70 font-light">
                            {treatment.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#E9DDDB]/30 border border-[#D8C4C2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#775B5D] leading-relaxed max-w-xl">
                    Der genaue Behandlungsumfang und der finale Preis werden individuell im ärztlichen Gespräch festgelegt.
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs uppercase tracking-widest text-[#775B5D] block">
                      Preisorientierung
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl text-[#775B5D] font-normal">
                      ab {calculatedPrice} €
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hinweis zur Abrechnung (GOÄ) */}
            <div
              id="booking-goae-notice"
              className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#E9DDDB]/20 border border-[#D8C4C2] flex items-start sm:items-center gap-3.5 shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-[#775B5D] shrink-0 mt-0.5 sm:mt-0">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-[#3E3335] leading-relaxed font-light">
                <span className="font-medium text-[#775B5D]">Hinweis zur Abrechnung:</span>{' '}
                Die Abrechnung sämtlicher medizinischer Leistungen erfolgt transparent und gesetzeskonform auf Grundlage der amtlichen Gebührenordnung für Ärzte (GOÄ).
              </p>
            </div>
          </div>

          {/* SCHRITT 2: SIMPLYBOOK ONLINE-TERMINBUCHUNG */}
          <div className="w-full bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-xs p-6 sm:p-8 lg:p-10">
            <div className="mb-8 pb-6 border-b border-[#E9DDDB]">
              <span className="text-xs font-mono text-[#B99A99] uppercase tracking-wider block mb-1">
                Schritt 2
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
                Online-Terminbuchung
              </h3>
              <p className="text-xs sm:text-sm text-[#3E3335]/70 font-light mt-1">
                Wähle deinen Wunschtermin direkt in unserem Online-Terminkalender von SimplyBook.
              </p>
            </div>

            {/* Das datenschutzbewusste SimplyBook Widget */}
            <SimplyBookWidget />

            {/* Zusätzliche direkte Kontaktoptionen */}
            <div className="mt-8 pt-6 border-t border-[#E9DDDB]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#775B5D]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>Fragen vorab oder keinen passenden Termin gefunden? Kontaktiere uns gerne direkt:</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={CONTACT_CONFIG.emailHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E9DDDB] hover:border-[#775B5D] hover:text-[#3E3335] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-Mail schreiben</span>
                </a>
                <a
                  href="https://wa.me/4915233979650"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E9DDDB] hover:border-[#25D366] hover:text-[#1EBE5D] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingTool;
