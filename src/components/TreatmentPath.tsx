import React, { useState } from 'react';
import { MessageSquareText, Sparkles, HeartHandshake } from 'lucide-react';

export const TreatmentPath: React.FC = () => {
  const [imgSrc, setImgSrc] = useState('/assets/Botox_in_Köln_von_Dr_Milena_Philippi.jpeg');

  const steps = [
    {
      id: 'step-1',
      stationNumber: 'Station 1',
      marker: 'Beratung & Untersuchung',
      subtitle: 'Dein Wunsch im Mittelpunkt',
      text: 'Wir besprechen deine Wünsche und schauen uns gemeinsam deine Mimik und Gesichtsanatomie an. Ich erkläre dir die Möglichkeiten und Risiken einer Botox®-Behandlung mit und beantworte deine Fragen. Wenn medizinisch nichts dagegenspricht, kann die Behandlung direkt im Anschluss stattfinden.',
      icon: MessageSquareText,
    },
    {
      id: 'step-2',
      stationNumber: 'Station 2',
      marker: 'Behandlung',
      subtitle: 'Individuell geplant und ärztlich durchgeführt',
      text: 'Auf Grundlage deiner Anatomie und Mimik plane ich die Behandlung mit Botox® passend zu deinem gewünschten Ergebnis. Dabei achte ich auf eine sorgfältige Dosierung und die Funktion der behandelten Muskulatur. Die Behandlung führe ich persönlich durch.',
      icon: Sparkles,
    },
    {
      id: 'step-3',
      stationNumber: 'Station 3',
      marker: 'Nachsorge',
      subtitle: 'Individuelle Nachsorge',
      text: 'Am Ende deines Termins erhältst du alle wichtigen Hinweise für die nächsten Tage auch noch einmal in schriftlicher Form. Sollten Fragen auftreten oder eine Kontrolle sinnvoll sein, bin ich auch nach deinem Termin für dich erreichbar.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section
      id="dein-weg"
      className="py-12 md:py-18 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="treatment-path-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading: Bild links, Überschrift & Text rechts */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-10 max-w-4xl mx-auto mb-16 md:mb-20">
          {/* Bild links: Botox_in_Köln_von_Dr_Milena_Philippi.jpeg */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden border border-[#E9DDDB] shadow-xs shrink-0 bg-[#F5ECE8]/30">
            <img
              src={imgSrc}
              alt="Dr. med. Milena Philippi – Behandlungsablauf bei Phi Aesthetics in Köln"
              title="Dr. med. Milena Philippi"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => {
                if (imgSrc.includes('Köln')) {
                  setImgSrc('/assets/Botox_in_Köln_von_Dr_Milena_Philippi.jpeg');
                } else if (imgSrc.startsWith('/assets/')) {
                  setImgSrc(imgSrc.replace('/assets/', '/'));
                }
              }}
            />
          </div>

          {/* Überschrift & Text rechts */}
          <div className="flex-1 flex flex-col justify-center self-center sm:self-start">
            <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
              Behandlungsablauf – Dein Termin bei Phi Aesthetics
            </span>
            <h2
              id="treatment-path-title"
              className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
            >
              Dein Weg
            </h2>
            <p className="text-base text-[#3E3335]/80 font-light leading-relaxed">
              Vom ersten persönlichen Gespräch bis zur vertrauensvollen Nachsorge: Drei ruhige Schritte zu deinem Wohlbefinden.
            </p>
          </div>
        </div>

        {/* Process Flowchart with Real Process Line */}
        <div className="relative">
          {/* Connecting process line for Desktop (hidden on mobile) */}
          <div className="hidden lg:block absolute top-12 left-20 right-20 h-0.5" aria-hidden="true">
            <svg className="w-full h-4 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 0 8 Q 250 2, 500 8 T 1000 8"
                stroke="#D8C4C2"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  id={step.id}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] hover:border-[#D8C4C2] transition-colors"
                >
                  {/* Clean Icon Station Marker */}
                  <div className="w-16 h-16 rounded-full bg-[#E9DDDB]/40 border border-[#D8C4C2] flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-7 h-7 text-[#775B5D]" />
                  </div>

                  {/* Marker label */}
                  <div className="text-xs uppercase tracking-widest text-[#B99A99] font-medium mb-1">
                    {step.stationNumber}: {step.marker}
                  </div>

                  {/* Subtitle / Headline */}
                  <h3 className="font-serif text-xl sm:text-2xl text-[#3E3335] mb-3 font-normal">
                    {step.subtitle}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm text-[#3E3335]/80 leading-relaxed font-light">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentPath;
