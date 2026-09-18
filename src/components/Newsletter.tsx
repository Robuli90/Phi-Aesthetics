import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { CONTACT_CONFIG } from '../config';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    // Übergabe an info.phiaesthetics@gmail.com
    const subject = 'Deine Anfrage an Phi Aesthetics';
    const body = `Hallo Phi Aesthetics Team,\n\nich möchte mich gerne für den Phi Aesthetics Newsletter anmelden.\n\nE-Mail-Adresse: ${email.trim()}\n\nGesendet an: ${CONTACT_CONFIG.email}`;
    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setIsSuccess(true);
  };

  return (
    <section
      id="phi-news"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 md:p-14 rounded-3xl bg-gradient-to-b from-[#E9DDDB]/40 to-[#E9DDDB]/20 border border-[#D8C4C2] text-center relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-[#B99A99]/10 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-3">
              Phi-News
            </span>

            {/* Exakter CTA-Titel */}
            <h2
              id="newsletter-title"
              className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-6"
            >
              Jetzt zum Phi Aesthetics Newsletter anmelden
            </h2>

            {/* Exakte Beschreibung */}
            <p className="text-sm sm:text-base text-[#3E3335]/85 leading-relaxed font-light mb-8 text-balance">
              Keine Neuigkeiten aus der ästhetischen Medizin mehr verpassen und über unsere aktuellsten Behandlungen und Co. auf dem Laufenden bleiben. Erfahre alles rund um die ästhetische Medizin und wie Botoxbehandlungen funktionieren. Außerdem erwarten dich immer wieder Einladungen zu unseren Botox-Info-Abenden – und du erfährst als Erste, wenn neue Termine freigeschaltet werden.
            </p>

            {isSuccess ? (
              /* Inline-Erfolgsmeldung mit Hinweis zur Übermittlung an die Praxis */
              <div className="p-6 rounded-2xl bg-[#FBF8F6] border border-[#A8C6B0] text-center space-y-2 max-w-md mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#775B5D] mx-auto" />
                <h3 className="font-serif text-xl text-[#3E3335]">Anmeldung übermittelt</h3>
                <p className="text-sm text-[#3E3335]/80 font-light">
                  Deine Anmeldung wurde an <strong className="font-medium text-[#3E3335]">{CONTACT_CONFIG.email}</strong> übermittelt. Schön, dass du dabei bist!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Deine E-Mail-Adresse"
                      className="w-full pl-10 pr-4 py-3 rounded-full bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] placeholder:text-[#3E3335]/50 focus:outline-none focus:border-[#775B5D] shadow-xs"
                      aria-label="E-Mail-Adresse für Newsletter"
                    />
                    <Mail className="w-4 h-4 text-[#B99A99] absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-full bg-[#775B5D] text-[#FBF8F6] text-sm font-medium tracking-wide hover:bg-[#3E3335] transition-all shadow-sm shrink-0"
                  >
                    Anmelden
                  </button>
                </div>

                {error && <p className="text-xs text-[#D69292] text-left pl-3">{error}</p>}

                {/* Ruhiger Hinweis zur Newsletter-Anmeldung */}
                <p className="text-[11px] text-[#775B5D] font-light pt-2">
                  Wir versenden keine aufdringliche Werbung. Du kannst dich jederzeit mit einem Klick wieder abmelden.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
