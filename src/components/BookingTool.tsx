import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Send,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import {
  ZONE_OPTIONS,
  ZONE_PRICES,
  ADDON_OPTIONS,
  OTHER_TREATMENTS,
} from '../config';

// 30-min slot schedule from 09:00 to 18:00
const ALL_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

// Helper to determine weekday slot availability deterministically
function getDayAvailability(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { isWeekend: true, hasSlots: false, slots: [] };
  }
  // Deterministic rule: roughly half open, half booked
  const seed = (year * 31 + month * 12 + day * 7) % 10;
  const hasSlots = seed % 2 === 0;

  if (!hasSlots) {
    return { isWeekend: false, hasSlots: false, slots: [] };
  }

  // Generate 4-7 available slots deterministically
  const availableSlots = ALL_SLOTS.filter((_, idx) => (idx + seed) % 3 !== 0);
  return { isWeekend: false, hasSlots: true, slots: availableSlots };
}

export const BookingTool: React.FC = () => {
  // Calendar current view state (defaults to today's month)
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const today = now.getDate();
    for (let d = today; d <= 28; d++) {
      const avail = getDayAvailability(curYear, curMonth, d);
      if (avail.hasSlots) return d;
    }
    return null;
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Treatment selection state (Defaults to "Botoxbehandlung nach Zonen")
  const [treatmentType, setTreatmentType] = useState<'zones' | 'other'>('zones');
  const [zoneCount, setZoneCount] = useState<1 | 2 | 3>(2);
  const [selectedZones, setSelectedZones] = useState<string[]>(['glabella', 'stirn']);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedOther, setSelectedOther] = useState<string>('masseter');

  // Checkout form fields (Schritt 3 PopUp)
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    name: string;
    email: string;
    phone: string;
    treatment: string;
    date: string;
    slot: string;
    emailSent?: boolean;
  } | null>(null);

  const viewYear = currentDate.getFullYear();
  const viewMonth = currentDate.getMonth();

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

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  // Align Monday = 0, Sunday = 6
  const startingDayOffset = (firstDayIndex + 6) % 7;

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(viewYear, viewMonth - 1, 1));
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(viewYear, viewMonth + 1, 1));
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

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
        setSelectedZones((prev) => [...prev.slice(1), zoneId]);
      }
    }
  };

  const handleZoneCountChange = (count: 1 | 2 | 3) => {
    setZoneCount(count);
    if (count === 1) {
      setSelectedZones(['glabella']);
    } else if (count === 2) {
      setSelectedZones(['glabella', 'stirn']);
    } else if (count === 3) {
      setSelectedZones(['glabella', 'stirn', 'augenwinkel']);
    }
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const selectedDayAvail = selectedDay
    ? getDayAvailability(viewYear, viewMonth, selectedDay)
    : null;

  const isZoneSelectionValid =
    treatmentType === 'other' || selectedZones.length === zoneCount;

  // When a slot is selected, open the modal popup for step 3
  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitError(null);

    if (!selectedDay) {
      setFormError('Bitte wähle einen verfügbaren Behandlungstag im Kalender.');
      return;
    }
    if (!selectedSlot) {
      setFormError('Bitte wähle eine freie Uhrzeit (30-Minuten-Slot).');
      return;
    }
    if (!isZoneSelectionValid) {
      setFormError(`Bitte wähle genau ${zoneCount} Zone(n) für deine Behandlung aus.`);
      return;
    }
    if (!clientName.trim()) {
      setFormError('Bitte gib deinen vollständigen Namen an.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setFormError('Bitte gib eine gültige E-Mail-Adresse an.');
      return;
    }
    if (!clientPhone.trim()) {
      setFormError('Bitte gib eine Telefonnummer für Rückfragen an.');
      return;
    }

    const selectedTreatmentNames: string[] = [];
    if (treatmentType === 'zones') {
      selectedZones.forEach((zid) => {
        const z = ZONE_OPTIONS.find((opt) => opt.id === zid);
        if (z) selectedTreatmentNames.push(z.name);
      });
      selectedAddons.forEach((aid) => {
        const a = ADDON_OPTIONS.find((opt) => opt.id === aid);
        if (a) selectedTreatmentNames.push(`Add-on: ${a.name}`);
      });
    } else {
      const other = OTHER_TREATMENTS.find((t) => t.id === selectedOther);
      if (other) selectedTreatmentNames.push(other.name);
    }

    const treatmentText = selectedTreatmentNames.join(', ');
    const dateText = formattedSelectedDate || '';
    const slotText = selectedSlot;

    setIsSubmitting(true);

    try {
      // Serverseitige Verarbeitung und Versand per Gmail
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clientName.trim(),
          email: clientEmail.trim(),
          phone: clientPhone.trim(),
          treatment: treatmentText,
          date: dateText,
          slot: slotText,
          notes: clientNotes.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Terminanfrage konnte nicht übermittelt werden.');
      }

      setConfirmationData({
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        treatment: treatmentText,
        date: dateText,
        slot: slotText,
        emailSent: result.emailSent,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Fehler beim Absenden der Buchung:', err);
      setSubmitError(err.message || 'Die Terminanfrage konnte leider nicht übermittelt werden. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setIsSubmitted(false);
    setIsModalOpen(false);
    setSelectedSlot(null);
    setFormError(null);
    setSubmitError(null);
  };

  const formattedSelectedDate = selectedDay
    ? `${selectedDay}. ${monthNames[viewMonth]} ${viewYear}`
    : null;

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
            Plane deine individuelle Behandlung in Ruhe: Wähle deine Wunschzonen, finde einen freien Praxistermin und sende uns deine unverbindliche Anfrage.
          </p>
        </div>

        {/* SCHRITT 1: ÜBER DIE GANZE BREITE DER SEITE */}
        <div className="w-full bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-xs p-6 sm:p-8 lg:p-10 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9DDDB]">
            <div>
              <span className="text-xs font-mono text-[#B99A99] uppercase tracking-wider block mb-1">
                Schritt 1
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
                Für welche Behandlungen interessierst Du Dich
              </h3>
            </div>

            {/* Treatment Category Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#E9DDDB]/40 border border-[#E9DDDB] shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setTreatmentType('zones')}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  treatmentType === 'zones'
                    ? 'bg-[#FBF8F6] text-[#3E3335] shadow-xs'
                    : 'text-[#3E3335]/70 hover:text-[#3E3335]'
                }`}
              >
                Botox nach Zonen
              </button>
              <button
                type="button"
                onClick={() => setTreatmentType('other')}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  treatmentType === 'other'
                    ? 'bg-[#FBF8F6] text-[#3E3335] shadow-xs'
                    : 'text-[#3E3335]/70 hover:text-[#3E3335]'
                }`}
              >
                Weitere Anwendungen
              </button>
            </div>
          </div>

          {/* Treatment Details: Full Width Content */}
          {treatmentType === 'zones' ? (
            <div className="space-y-8">
              {/* Top Row: Zone count and Upper Face checklist */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Zone Count selection */}
                <div className="lg:col-span-4">
                  <label className="block text-xs uppercase tracking-wider text-[#775B5D] font-medium mb-3">
                    Anzahl der Zonen
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {([1, 2, 3] as const).map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => handleZoneCountChange(count)}
                        className={`py-3.5 px-3 rounded-xl text-center border transition-all ${
                          zoneCount === count
                            ? 'bg-[#775B5D] text-[#FBF8F6] border-[#775B5D] shadow-xs'
                            : 'bg-[#FBF8F6] border-[#E9DDDB] text-[#3E3335] hover:border-[#D8C4C2]'
                        }`}
                      >
                        <div className="text-sm font-semibold">{count} {count === 1 ? 'Zone' : 'Zonen'}</div>
                        <div className="font-serif text-xs opacity-90 mt-0.5">ab {ZONE_PRICES[count]} €</div>
                      </button>
                    ))}
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
        </div>

        {/* SCHRITT 2: DARUNTER EBENFALLS ÜBER DIE GANZE BREITE */}
        <div className="w-full bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="mb-8 pb-6 border-b border-[#E9DDDB]">
            <span className="text-xs font-mono text-[#B99A99] uppercase tracking-wider block mb-1">
              Schritt 2
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
              Wunschtermin finden
            </h3>
            <p className="text-xs sm:text-sm text-[#3E3335]/70 font-light mt-1">
              Wähle einen Tag im Kalender und klicke auf deine bevorzugte Uhrzeit, um die Terminanfrage abzuschließen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Kalender Widget (Links / 7 Spalten) */}
            <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB]">
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-xl text-[#3E3335]">
                  {monthNames[viewMonth]} {viewYear}
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 focus:outline-none transition-colors"
                    aria-label="Vorheriger Monat"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 focus:outline-none transition-colors"
                    aria-label="Nächster Monat"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Names */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((w, idx) => (
                  <div
                    key={w}
                    className={`text-[11px] font-semibold tracking-wider py-1 ${
                      idx >= 5 ? 'text-[#3E3335]/40' : 'text-[#775B5D]'
                    }`}
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 sm:h-11" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const avail = getDayAvailability(viewYear, viewMonth, dayNum);
                  const isSelected = selectedDay === dayNum;

                  if (avail.isWeekend) {
                    return (
                      <div
                        key={dayNum}
                        className="h-10 sm:h-11 rounded-lg flex items-center justify-center text-xs text-[#3E3335]/30 bg-transparent cursor-not-allowed"
                      >
                        {dayNum}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        setSelectedDay(dayNum);
                        setSelectedSlot(null);
                      }}
                      className={`relative h-10 sm:h-11 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#775B5D]/10 ring-2 ring-[#775B5D] text-[#3E3335] font-semibold'
                          : 'hover:bg-[#D8C4C2]/20 text-[#3E3335]'
                      }`}
                    >
                      <span>{dayNum}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                          avail.hasSlots ? 'bg-[#A8C6B0]' : 'bg-[#D69292]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="mt-4 pt-3 border-t border-[#E9DDDB] flex items-center justify-between text-xs text-[#775B5D]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A8C6B0]" />
                  <span>Freie Termine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D69292]" />
                  <span>Keine freien Termine</span>
                </div>
              </div>
            </div>

            {/* 30-Minuten Slots Selection (Rechts / 5 Spalten) */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#E9DDDB]/20 border border-[#E9DDDB] flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[#775B5D]">
                    {formattedSelectedDate
                      ? `Freie 30-Minuten-Slots für ${formattedSelectedDate}`
                      : 'Bitte wähle einen Tag im Kalender'}
                  </span>
                </div>

                {selectedDayAvail?.hasSlots ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedDayAvail.slots.map((slot) => {
                      const isSlotSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                            isSlotSelected
                              ? 'bg-[#775B5D] text-[#FBF8F6] shadow-xs'
                              : 'bg-[#FBF8F6] border border-[#E9DDDB] text-[#3E3335] hover:border-[#775B5D] hover:bg-[#FBF8F6]'
                          }`}
                        >
                          <Clock className={`w-3 h-3 ${isSlotSelected ? 'text-[#FBF8F6]' : 'text-[#B99A99]'}`} />
                          <span>{slot} Uhr</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-[#FBF8F6] border border-[#D69292]/40 text-xs text-[#775B5D] text-center">
                    An diesem Tag sind leider keine freien Termine verfügbar. Bitte wähle einen Tag mit grünem Punkt.
                  </div>
                )}
              </div>

              {/* Statushinweis bei gewähltem Slot */}
              {selectedSlot && (
                <div className="mt-6 pt-4 border-t border-[#E9DDDB] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-[#3E3335]">
                    Ausgewählt: <span className="font-semibold">{formattedSelectedDate}, {selectedSlot} Uhr</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#775B5D] text-[#FBF8F6] text-xs font-medium hover:bg-[#3E3335] transition-colors"
                  >
                    Angaben eingeben
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SCHRITT 3: ALS POPUP / MODAL (NUR WENN WUNSCHTERMIN AUSGEWÄHLT IST) */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E3335]/50 backdrop-blur-xs overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-step3-title"
          >
            <div className="relative w-full max-w-lg bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-2xl p-6 sm:p-8 my-8 text-[#3E3335] animate-in fade-in zoom-in-95 duration-200">
              {/* Schließen Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[#775B5D] hover:bg-[#E9DDDB]/50 hover:text-[#3E3335] transition-colors focus:outline-none"
                aria-label="Fenster schließen"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="mb-6 pr-8">
                    <span className="text-xs font-mono text-[#B99A99] uppercase tracking-wider block mb-1">
                      Schritt 3
                    </span>
                    <h3 id="modal-step3-title" className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
                      Deine Kontaktdaten
                    </h3>
                    <p className="text-xs sm:text-sm text-[#775B5D] mt-1">
                      Für deinen Wunschtermin am <span className="font-semibold text-[#3E3335]">{formattedSelectedDate} um {selectedSlot} Uhr</span>.
                    </p>
                  </div>

                  {(formError || submitError) && (
                    <div className="mb-4 p-3.5 rounded-xl bg-[#D69292]/15 border border-[#D69292] text-xs text-[#775B5D] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#775B5D]" />
                      <span>{formError || submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#3E3335] mb-1">
                          Vor- und Nachname *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="z. B. Sophie Weber"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#3E3335] mb-1">
                          E-Mail-Adresse *
                        </label>
                        <input
                          type="email"
                          required
                          disabled={isSubmitting}
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="deine.email@beispiel.de"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3E3335] mb-1">
                        Telefonnummer *
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={isSubmitting}
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="0173 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3E3335] mb-1">
                        Fragen oder persönliche Wünsche (optional)
                      </label>
                      <textarea
                        rows={2}
                        disabled={isSubmitting}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Gibt es etwas, worauf wir besonders achten dürfen?"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60"
                      />
                    </div>

                    <p className="text-[11px] text-[#775B5D]/80 italic pt-1">
                      Es findet keine Online-Zahlung statt. Deine Anfrage wird vertraulich und sicher an die Praxis übermittelt.
                    </p>

                    <button
                      id="submit-booking-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#775B5D] text-[#FBF8F6] font-medium text-sm tracking-wide shadow-sm hover:bg-[#3E3335] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 text-[#D8C4C2] animate-spin" />
                          <span>Terminanfrage wird übermittelt...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#D8C4C2]" />
                          <span>Termin verbindlich anfragen</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Verständliche Bestätigung auf der Website */
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#A8C6B0]/30 border border-[#A8C6B0] flex items-center justify-center mx-auto text-[#775B5D]">
                    <CheckCircle2 className="w-8 h-8 text-[#775B5D]" />
                  </div>

                  <h3 className="font-serif text-2xl text-[#3E3335]">
                    Terminanfrage erfolgreich übermittelt!
                  </h3>

                  <p className="text-sm text-[#3E3335]/90 font-light leading-relaxed max-w-md mx-auto">
                    Vielen Dank, <strong className="font-medium text-[#3E3335]">{confirmationData?.name}</strong>. Deine Anfrage wurde sicher an die Praxis übermittelt.
                  </p>

                  {/* Zusammenfassung der Daten */}
                  <div className="bg-[#FBF8F6] border border-[#E9DDDB] rounded-xl p-4 text-left text-xs text-[#3E3335] space-y-1.5 max-w-md mx-auto">
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D] font-medium">Gewählte Behandlung:</span>
                      <span className="font-medium text-right">{confirmationData?.treatment}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D] font-medium">Wunschtermin:</span>
                      <span>{confirmationData?.date} um {confirmationData?.slot} Uhr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#775B5D] font-medium">Telefonnummer:</span>
                      <span>{confirmationData?.phone}</span>
                    </div>
                  </div>

                  {/* Verständlicher Bestätigungshinweis für den Kunden */}
                  <div className="p-3.5 bg-[#A8C6B0]/20 border border-[#A8C6B0] rounded-xl text-xs text-[#3E3335] max-w-md mx-auto leading-relaxed text-left">
                    <p className="font-medium text-[#775B5D] mb-1">
                      Bestätigungs-E-Mail versendet:
                    </p>
                    <p className="text-[#3E3335]/90">
                      Eine Bestätigung deiner Angaben wurde an <strong>{confirmationData?.email}</strong> gesendet. Dr. Milena Philippi und das Team prüfen deinen Terminwunsch zeitnah und melden sich schnellstmöglich bei dir.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={resetBooking}
                      className="px-8 py-3 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] transition-colors"
                    >
                      Fertig / Schließen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingTool;
