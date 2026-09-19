import React from 'react';
import { MessageSquareText, Sparkles, HeartHandshake } from 'lucide-react';

export const TreatmentPath: React.FC = () => {
  const steps = [
    {
      id: 'step-1',
      marker: 'Beratung',
      title: 'Individuelle Beratung und Kennenlernen',
      text: 'Wir besprechen gemeinsam, was dein Ziel mit der Behandlung ist und wie wir dieses bestmöglich erreichen können. Wir erklären dir deine Behandlung genauestens und nehmen dir Sorgen und Ängste, sodass du ganz entspannt in deine Behandlung gehen kannst.',
      icon: MessageSquareText,
    },
    {
      id: 'step-2',
      marker: 'Behandlung',
      title: 'Die Botulinumtoxinbehandlung',
      text: 'Als approbierte Ärztin mit einer Fortbildung in der ästhetischen Anwendung von Botulinumtoxin führe ich deine individuelle Behandlung nach aktuellen medizinischen Maßstäben, mit hochwertigen Materialien und medizinischem Botulinumtoxin durch.',
      icon: Sparkles,
    },
    {
      id: 'step-3',
      marker: 'Nachsorge',
      title: 'Nachsorge',
      text: 'Solltest du nach der Behandlung Fragen, Wünsche, Anregungen oder Ähnliches haben, kannst du dich jederzeit bei uns melden. Wir sind auch nach der Behandlung für dich da.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section
      id="dein-weg"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="treatment-path-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Behandlungsablauf
          </span>
          <h2
            id="treatment-path-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Dein Weg
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light">
            Vom ersten persönlichen Gespräch bis zur vertrauensvollen Nachsorge: Drei ruhige Schritte zu deinem Wohlbefinden.
          </p>
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
            {steps.map((step, idx) => {
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
                  <div className="text-xs uppercase tracking-widest text-[#B99A99] font-medium mb-2">
                    Station {idx + 1} • {step.marker}
                  </div>

                  {/* Step Title */}
                  <h3 className="font-serif text-xl sm:text-2xl text-[#3E3335] mb-4 font-normal">
                    {step.title}
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
