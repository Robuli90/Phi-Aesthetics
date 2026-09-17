import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, Check } from 'lucide-react';
import logoPhiImg from '../assets/images/Logo_Phi.png';

interface EncountersProps {
  onInterestSubmit?: (eventTitle: string) => void;
}

export const Encounters: React.FC<EncountersProps> = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'impressions'>('upcoming');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  // Generate realistic upcoming event dates relative to current date
  const upcomingEvents = [
    {
      id: 'event-1',
      category: 'Infoabend',
      date: 'Donnerstag, 15. Oktober • 18:30 Uhr',
      title: 'Botox-Infoabend',
      description:
        'Ein ruhiger Abend für alle, die Botox besser verstehen möchten: Wirkweise, mögliche Behandlungen, Fragen und Raum für ein persönliches Kennenlernen.',
    },
    {
      id: 'event-2',
      category: 'Beratungstage',
      date: 'Freitag, 06. November • 14:00–18:00 Uhr',
      title: 'Persönliche Beratungstage',
      description:
        'Lerne Phi Aesthetics kennen und besprich deine Wünsche in einem persönlichen, unverbindlichen Rahmen.',
    },
    {
      id: 'event-3',
      category: 'Sonderabend',
      date: 'Donnerstag, 26. November • 19:00 Uhr',
      title: 'Phi Aesthetics Abend',
      description:
        'Ein besonderer Abend rund um ärztliche Ästhetik, individuelle Behandlungsplanung und die Philosophie: so individuell wie du.',
    },
  ];

  const pastImpressions = [
    {
      id: 'past-1',
      caption: 'Einblick in einen Infoabend',
      subline: 'Gemeinsames Verstehen & ärztliche Aufklärung',
    },
    {
      id: 'past-2',
      caption: 'Zeit für Fragen und Austausch',
      subline: 'Offene Dialoge in ruhiger, persönlicher Atmosphäre',
    },
    {
      id: 'past-3',
      caption: 'Phi Aesthetics im persönlichen Gespräch',
      subline: 'Individuelle Beratung auf Augenhöhe',
    },
  ];

  const currentItems = activeTab === 'upcoming' ? upcomingEvents : pastImpressions;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : currentItems.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < currentItems.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const handleRegisterInterest = (title: string) => {
    setRegisteredEvents((prev) => ({ ...prev, [title]: true }));
  };

  return (
    <section
      id="begegnungen"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="encounters-title"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Veranstaltungen & Einblicke
          </span>
          <h2
            id="encounters-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Begegnungen
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light">
            Ästhetische Medizin im persönlichen Dialog: Erlebe informative Abende und offene Beratungsformate in ruhiger Atmosphäre.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-full bg-[#E9DDDB]/40 border border-[#E9DDDB]">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#775B5D] text-[#FBF8F6] shadow-xs'
                  : 'text-[#3E3335]/70 hover:text-[#3E3335]'
              }`}
            >
              Kommende Termine
            </button>
            <button
              onClick={() => setActiveTab('impressions')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'impressions'
                  ? 'bg-[#775B5D] text-[#FBF8F6] shadow-xs'
                  : 'text-[#3E3335]/70 hover:text-[#3E3335]'
              }`}
            >
              Vergangene Eindrücke
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          ref={carouselRef}
          aria-label="Karussell für Veranstaltungen und Eindrücke (Tastaturbedienung mit Pfeiltasten möglich)"
          className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D] rounded-3xl"
        >
          {/* Card Showcase */}
          <div className="overflow-hidden">
            {activeTab === 'upcoming' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingEvents.map((evt, idx) => {
                  const isRegistered = registeredEvents[evt.title];
                  const isFocused = currentIndex === idx;
                  return (
                    <div
                      key={evt.id}
                      className={`p-8 rounded-2xl bg-[#FBF8F6] border transition-all flex flex-col justify-between ${
                        isFocused
                          ? 'border-[#775B5D] shadow-[0_4px_20px_rgba(119,91,93,0.08)]'
                          : 'border-[#E9DDDB] hover:border-[#D8C4C2]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full bg-[#E9DDDB]/50 text-[11px] font-medium text-[#775B5D] border border-[#D8C4C2]">
                            {evt.category}
                          </span>
                          <Calendar className="w-4 h-4 text-[#B99A99]" />
                        </div>

                        <div className="text-xs font-mono text-[#775B5D] mb-2">
                          {evt.date}
                        </div>

                        <h3 className="font-serif text-2xl text-[#3E3335] mb-3">
                          {evt.title}
                        </h3>

                        <p className="text-sm text-[#3E3335]/80 font-light leading-relaxed mb-6">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E9DDDB]">
                        {isRegistered ? (
                          <div className="flex items-center gap-2 text-xs font-medium text-[#775B5D]">
                            <Check className="w-4 h-4 text-[#A8C6B0]" />
                            <span>Interesse vorgemerkt</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRegisterInterest(evt.title)}
                            className="w-full py-2.5 px-4 rounded-xl border border-[#775B5D] text-xs font-medium uppercase tracking-wider text-[#775B5D] hover:bg-[#775B5D] hover:text-[#FBF8F6] transition-colors"
                          >
                            Interesse anmelden
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Past impressions cards with calm organic textures */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pastImpressions.map((past, idx) => {
                  const isFocused = currentIndex === idx;
                  return (
                    <div
                      key={past.id}
                      className={`p-6 rounded-2xl bg-[#FBF8F6] border transition-all flex flex-col justify-between ${
                        isFocused ? 'border-[#775B5D]' : 'border-[#E9DDDB] hover:border-[#D8C4C2]'
                      }`}
                    >
                      {/* Stylized organic aesthetic canvas with authentic Phi Aesthetics logo */}
                      <div className="aspect-[4/3] rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] mb-6 flex items-center justify-center p-6 relative overflow-hidden">
                        <img
                          src={logoPhiImg}
                          alt="Phi Aesthetics"
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Logo_Phi.png'; }}
                          className="w-28 h-28 object-contain mix-blend-multiply"
                        />
                      </div>

                      <div>
                        <h4 className="font-serif text-xl text-[#3E3335] mb-1">
                          {past.caption}
                        </h4>
                        <p className="text-xs text-[#3E3335]/70 font-light">
                          {past.subline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Controls: Arrows, Progress Indicator & Accessibility */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E9DDDB]">
            <div className="flex items-center gap-2">
              {currentItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i ? 'w-8 bg-[#775B5D]' : 'w-2 bg-[#D8C4C2]'
                  }`}
                  aria-label={`Gehe zu Eintrag ${i + 1}`}
                />
              ))}
              <span className="text-xs text-[#775B5D] ml-2">
                {currentIndex + 1} von {currentItems.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 hover:border-[#B99A99] transition-all"
                aria-label="Vorheriger Eintrag"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full border border-[#E9DDDB] text-[#775B5D] hover:bg-[#D8C4C2]/20 hover:border-[#B99A99] transition-all"
                aria-label="Nächster Eintrag"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
