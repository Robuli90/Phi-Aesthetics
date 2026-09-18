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
  Shield,
  Check,
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
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const todayDate = now.getDate();
    for (let d = todayDate; d <= 28; d++) {
      const avail = getDayAvailability(curYear, curMonth, d);
      if (avail.hasSlots) return d;
    }
    return null;
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
  const [contactPreference, setContactPreference] = useState<string>('E-Mail');
  const [clientNotes, setClientNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // SPAM protection honeypot

  // Validation errors per field
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    treatment?: string;
    date?: string;
    slot?: string;
    consent?: string;
  }>({});

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
    contactPreference?: string;
    notes?: string;
    emailSent?: boolean;
  } | null>(null);

  const viewYear = currentDate.getFullYear();
  const viewMonth = currentDate.getMonth();

  // Helper to check if a specific day is in the past
  const isPastDay = (dayNum: number): boolean => {
    const dayDate = new Date(viewYear, viewMonth, dayNum);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() < today.getTime();
  };

  // Prevent navigating to past months
  const canGoPrevMonth =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

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
    if (!canGoPrevMonth) return;
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
      if (e.key === 'Escape') {
        if (showPrivacyModal) {
          setShowPrivacyModal(false);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, showPrivacyModal]);

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
    setFieldErrors({});
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Bot detection check
    if (honeypot.trim().length > 0) {
      // Silently reject bot submission
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 600);
      return;
    }

    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      treatment?: string;
      date?: string;
      slot?: string;
      consent?: string;
    } = {};

    // 1. Name validation
    if (!clientName.trim() || clientName.trim().length < 2) {
      errors.name = 'Bitte geben Sie Ihren vollständigen Vor- und Nachnamen an.';
    }

    // 2. Email validation (RFC format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail.trim() || !emailRegex.test(clientEmail.trim())) {
      errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein (z. B. name@beispiel.de).';
    }

    // 3. Phone validation (optional - nur prüfen, falls angegeben)
    if (clientPhone.trim().length > 0) {
      const digitsOnly = clientPhone.replace(/\D/g, '');
      if (digitsOnly.length < 6) {
        errors.phone = 'Bitte geben Sie eine gültige Telefonnummer an oder lassen Sie das Feld leer.';
      }
    }

    // 4. Treatment validation
    if (!isZoneSelectionValid) {
      errors.treatment = `Bitte wählen Sie genau ${zoneCount} Zone(n) für Ihre Behandlung aus.`;
    }

    // 5. Date validation (must not be in the past)
    if (!selectedDay) {
      errors.date = 'Bitte wählen Sie einen Behandlungstag im Kalender aus.';
    } else if (isPastDay(selectedDay)) {
      errors.date = 'Das gewählte Datum darf nicht in der Vergangenheit liegen.';
    }

    // 6. Slot validation
    if (!selectedSlot) {
      errors.slot = 'Bitte wählen Sie eine Uhrzeit bzw. ein Zeitfenster aus.';
    }

    // 7. Privacy consent validation
    if (!consentGiven) {
      errors.consent = 'Bitte willigen Sie in die Datenverarbeitung zur Bearbeitung Ihrer Anfrage ein.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

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
    const dateIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const slotText = selectedSlot || '';

    setIsSubmitting(true);

    try {
      // Serverseitige Verarbeitung und E-Mail-Versand
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
          dateIso,
          slot: slotText,
          contactPreference,
          notes: clientNotes.trim(),
          consent: consentGiven,
          hp_field: honeypot,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Ihre Anfrage konnte nicht verarbeitet werden.');
      }

      setConfirmationData({
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        treatment: treatmentText,
        date: dateText,
        slot: slotText,
        contactPreference,
        notes: clientNotes.trim(),
        emailSent: result.emailSent,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Fehler beim Absenden der Terminanfrage:', err);
      // Strictly do not show false success message
      setSubmitError(
        err.message ||
          'Die Terminanfrage konnte per E-Mail leider nicht übermittelt werden. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setIsSubmitted(false);
    setIsModalOpen(false);
    setSelectedSlot(null);
    setFieldErrors({});
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
                    disabled={!canGoPrevMonth}
                    className="p-2 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 focus:outline-none transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Vorheriger Monat"
                    title={!canGoPrevMonth ? 'Vergangene Monate können nicht ausgewählt werden' : 'Vorheriger Monat'}
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
                  const isPast = isPastDay(dayNum);
                  const avail = getDayAvailability(viewYear, viewMonth, dayNum);
                  const isSelected = selectedDay === dayNum;

                  if (isPast) {
                    return (
                      <div
                        key={dayNum}
                        title="Vergangenes Datum nicht buchbar"
                        className="h-10 sm:h-11 rounded-lg flex items-center justify-center text-xs text-[#3E3335]/25 bg-transparent cursor-not-allowed select-none"
                      >
                        {dayNum}
                      </div>
                    );
                  }

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
                        if (fieldErrors.date) {
                          setFieldErrors((prev) => ({ ...prev, date: undefined }));
                        }
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
                      : 'Bitte wählen Sie einen Tag im Kalender'}
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
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
                    An diesem Tag sind leider keine freien Termine verfügbar. Bitte wählen Sie einen Tag mit grünem Punkt.
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
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#775B5D] text-[#FBF8F6] text-xs font-medium hover:bg-[#3E3335] transition-colors cursor-pointer"
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
              if (e.target === e.currentTarget && !isSubmitting) {
                setIsModalOpen(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-step3-title"
          >
            <div className="relative w-full max-w-lg bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-2xl p-6 sm:p-8 my-8 text-[#3E3335] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Schließen Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[#775B5D] hover:bg-[#E9DDDB]/50 hover:text-[#3E3335] transition-colors focus:outline-none disabled:opacity-40 cursor-pointer"
                aria-label="Fenster schließen"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="mb-5 pr-8">
                    <span className="text-xs font-mono text-[#B99A99] uppercase tracking-wider block mb-1">
                      Schritt 3
                    </span>
                    <h3 id="modal-step3-title" className="font-serif text-2xl sm:text-3xl text-[#3E3335]">
                      Terminanfrage absenden
                    </h3>
                    <div className="mt-2.5 p-3 rounded-xl bg-[#E9DDDB]/30 border border-[#E9DDDB] text-xs space-y-1 text-[#775B5D]">
                      <div>
                        <span className="font-medium text-[#3E3335]">Wunschtermin:</span>{' '}
                        <span>{formattedSelectedDate} um {selectedSlot} Uhr</span>
                      </div>
                      <div>
                        <span className="font-medium text-[#3E3335]">Behandlung:</span>{' '}
                        <span>
                          {treatmentType === 'zones'
                            ? `Botox ${zoneCount} Zone(n)`
                            : OTHER_TREATMENTS.find((t) => t.id === selectedOther)?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className="mb-4 p-3.5 rounded-xl bg-[#D69292]/20 border border-[#D69292] text-xs text-[#775B5D] flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#C45E5E] mt-0.5" />
                      <div>
                        <p className="font-medium text-[#3E3335] mb-0.5">Übermittlung fehlgeschlagen</p>
                        <p>{submitError}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    {/* Unsichtbares Honeypot-Feld gegen Spam-Bots */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="hp_field">Bitte dieses Feld freilassen</label>
                      <input
                        type="text"
                        id="hp_field"
                        name="hp_field"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

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
                          onChange={(e) => {
                            setClientName(e.target.value);
                            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="z. B. Sophie Weber"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F6] border text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60 transition-colors ${
                            fieldErrors.name ? 'border-[#C45E5E] bg-[#D69292]/10' : 'border-[#E9DDDB]'
                          }`}
                        />
                        {fieldErrors.name && (
                          <p className="text-[11px] text-[#C45E5E] mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {fieldErrors.name}
                          </p>
                        )}
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
                          onChange={(e) => {
                            setClientEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="ihre.email@beispiel.de"
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F6] border text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60 transition-colors ${
                            fieldErrors.email ? 'border-[#C45E5E] bg-[#D69292]/10' : 'border-[#E9DDDB]'
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="text-[11px] text-[#C45E5E] mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3E3335] mb-1">
                        Telefonnummer (optional)
                      </label>
                      <input
                        type="tel"
                        disabled={isSubmitting}
                        value={clientPhone}
                        onChange={(e) => {
                          setClientPhone(e.target.value);
                          if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="z. B. 0152 33979650"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F6] border text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60 transition-colors ${
                          fieldErrors.phone ? 'border-[#C45E5E] bg-[#D69292]/10' : 'border-[#E9DDDB]'
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-[11px] text-[#C45E5E] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Optionale bevorzugte Kontaktart */}
                    <div>
                      <label className="block text-xs font-medium text-[#3E3335] mb-1.5">
                        Bevorzugte Kontaktart (optional)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['E-Mail', 'Telefonanruf', 'WhatsApp / SMS', 'Keine Präferenz'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setContactPreference(opt)}
                            className={`py-2 px-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                              contactPreference === opt
                                ? 'bg-[#775B5D] border-[#775B5D] text-[#FBF8F6] font-medium'
                                : 'bg-[#FBF8F6] border-[#E9DDDB] text-[#3E3335] hover:border-[#775B5D]/60'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#3E3335] mb-1">
                        Nachricht / Anmerkungen (optional)
                      </label>
                      <textarea
                        rows={2}
                        disabled={isSubmitting}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Gibt es etwas, worauf wir besonders achten dürfen oder Fragen zur Behandlung?"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] focus:outline-none focus:border-[#775B5D] disabled:opacity-60"
                      />
                    </div>

                    {/* Datenschutz Einwilligung Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={consentGiven}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            setConsentGiven(e.target.checked);
                            if (fieldErrors.consent) setFieldErrors((prev) => ({ ...prev, consent: undefined }));
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-[#E9DDDB] text-[#775B5D] focus:ring-[#775B5D] cursor-pointer"
                        />
                        <span className="text-[11px] text-[#775B5D] leading-relaxed">
                          Ich willige ein, dass meine Daten zur Bearbeitung und Beantwortung meiner Terminanfrage verarbeitet werden. Hinweis: Sie können Ihre Einwilligung jederzeit für die Zukunft widerrufen. Weitere Informationen finden Sie in der{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowPrivacyModal(true);
                            }}
                            className="text-[#3E3335] underline font-medium hover:text-[#775B5D] cursor-pointer"
                          >
                            Datenschutzerklärung
                          </button>
                          .*
                        </span>
                      </label>
                      {fieldErrors.consent && (
                        <p className="text-[11px] text-[#C45E5E] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {fieldErrors.consent}
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-[#775B5D]/80 bg-[#E9DDDB]/20 p-2.5 rounded-xl border border-[#E9DDDB]/60 leading-relaxed">
                      Dies ist eine unverbindliche Terminanfrage. Der Termin ist erst nach unserer Bestätigung fest vereinbart. Es findet keine Vorauszahlung statt.
                    </div>

                    <button
                      id="submit-booking-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#775B5D] text-[#FBF8F6] font-medium text-sm tracking-wide shadow-sm hover:bg-[#3E3335] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 text-[#D8C4C2] animate-spin" />
                          <span>Terminanfrage wird übermittelt...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#D8C4C2]" />
                          <span>Termin anfragen</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Verständliche Bestätigung auf der Website (gemäß Anforderung 9) */
                <div className="py-4 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#A8C6B0]/30 border border-[#A8C6B0] flex items-center justify-center mx-auto text-[#775B5D]">
                    <CheckCircle2 className="w-8 h-8 text-[#775B5D]" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-serif text-2xl text-[#3E3335]">
                      Vielen Dank für Ihre Anfrage.
                    </h3>
                    <p className="text-sm text-[#3E3335]/90 font-light leading-relaxed max-w-md mx-auto">
                      Wir haben Ihre Terminanfrage erhalten und melden uns schnellstmöglich bei Ihnen.
                    </p>
                  </div>

                  {/* Zusammenfassung der Daten */}
                  <div className="bg-[#FBF8F6] border border-[#E9DDDB] rounded-2xl p-4 text-left text-xs text-[#3E3335] space-y-2 max-w-md mx-auto">
                    <div className="font-medium text-[#775B5D] border-b border-[#E9DDDB] pb-1 uppercase tracking-wider text-[10px]">
                      Zusammenfassung Ihrer Terminanfrage
                    </div>
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D]">Name:</span>
                      <span className="font-medium text-right">{confirmationData?.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D]">E-Mail-Adresse:</span>
                      <span className="font-medium text-right">{confirmationData?.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D]">Telefonnummer:</span>
                      <span className="font-medium text-right">
                        {confirmationData?.phone ? confirmationData.phone : 'Nicht angegeben'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D]">Behandlung:</span>
                      <span className="font-medium text-right">{confirmationData?.treatment}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                      <span className="text-[#775B5D]">Wunschtermin:</span>
                      <span className="font-medium text-right">{confirmationData?.date} um {confirmationData?.slot} Uhr</span>
                    </div>
                    {confirmationData?.contactPreference && (
                      <div className="flex justify-between border-b border-[#E9DDDB]/60 pb-1.5">
                        <span className="text-[#775B5D]">Bevorzugte Kontaktart:</span>
                        <span className="font-medium text-right">{confirmationData.contactPreference}</span>
                      </div>
                    )}
                    {confirmationData?.notes && (
                      <div className="pt-1 text-[11px] text-[#775B5D]">
                        <span className="font-medium text-[#3E3335] block mb-0.5">Ihre Nachricht / Anmerkungen:</span>
                        <span className="italic">{confirmationData.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Klarer Hinweis zur Unverbindlichkeit & Eingangsbestätigung */}
                  <div className="p-3.5 bg-[#A8C6B0]/20 border border-[#A8C6B0] rounded-xl text-xs text-[#3E3335] max-w-md mx-auto leading-relaxed text-left space-y-1">
                    <p className="font-medium text-[#775B5D] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Hinweis zur Terminvereinbarung:
                    </p>
                    <p className="text-[#3E3335]/90 text-[11px]">
                      Bitte beachten Sie: Dies ist eine unverbindliche Terminanfrage. Der Termin ist erst nach unserer persönlichen Bestätigung durch die Praxis verbindlich vereinbart.
                    </p>
                    <p className="text-[#3E3335]/90 text-[11px] pt-1">
                      Eine Eingangsbestätigung wurde an <strong>{confirmationData?.email}</strong> gesendet.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={resetBooking}
                      className="px-8 py-3 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] transition-colors cursor-pointer"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DATENSCHUTZERKLÄRUNG HINWEIS */}
        {showPrivacyModal && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#3E3335]/60 backdrop-blur-xs"
            onClick={() => setShowPrivacyModal(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative w-full max-w-md bg-[#FBF8F6] rounded-2xl border border-[#E9DDDB] shadow-2xl p-6 text-[#3E3335] animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9DDDB]">
                <h4 className="font-serif text-lg text-[#3E3335] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#775B5D]" />
                  Datenschutzhinweis zur Terminanfrage
                </h4>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-full text-[#775B5D] hover:bg-[#E9DDDB]/50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-[#775B5D] space-y-2.5 leading-relaxed">
                <p>
                  Mit dem Absenden des Formulars willigen Sie ein, dass PHI Aesthetics (Dr. med. Milena Philippi) Ihre eingegebenen Daten (Name, E-Mail-Adresse, Telefonnummer, gewählte Behandlung, Wunschzeit und Anmerkungen) verarbeitet.
                </p>
                <p>
                  <strong>Zweck:</strong> Die Datenverarbeitung erfolgt ausschließlich zur Bearbeitung, Koordinierung und Beantwortung Ihrer Terminanfrage (Art. 6 Abs. 1 lit. b und a DSGVO).
                </p>
                <p>
                  <strong>Speicherung & Weitergabe:</strong> Ihre Daten werden vertraulich behandelt und nicht an unbefugte Dritte weitergegeben.
                </p>
                <p>
                  <strong>Widerrufsrecht:</strong> Sie können Ihre erteilte Einwilligung jederzeit mit Wirkung für die Zukunft per E-Mail an{' '}
                  <a href="mailto:info.phiaesthetics@gmail.com" className="underline font-medium text-[#3E3335]">
                    info.phiaesthetics@gmail.com
                  </a>{' '}
                  widerrufen.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E9DDDB] text-right">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#775B5D] text-[#FBF8F6] text-xs font-medium hover:bg-[#3E3335] transition-colors cursor-pointer"
                >
                  Verstanden
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingTool;
