import React, { useState } from 'react';
import { SimplyBookWidget } from './SimplyBookWidget';

export const BookingTool: React.FC = () => {
  const [bookingImgSrc, setBookingImgSrc] = useState('/assets/Praxis-für-Botox-in-Köln_Lindenthal.jpeg');

  return (
    <section
      id="termin-buchen"
      className="py-12 md:py-18 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="booking-title"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header: Bild links, Überschrift & Text rechts */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-10 max-w-4xl mx-auto mb-14">
          {/* Bild links: Praxis-für-Botox-in-Köln_Lindenthal.jpeg */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden border border-[#E9DDDB] shadow-xs shrink-0 bg-[#F5ECE8]/30">
            <img
              src={bookingImgSrc}
              alt="Praxis für Botox in Köln Lindenthal – Online Terminbuchung"
              title="Praxis für Botox in Köln Lindenthal"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => {
                if (bookingImgSrc.includes('für') || bookingImgSrc.includes('Köln')) {
                  setBookingImgSrc('/assets/Praxis-für-Botox-in-Köln_Lindenthal.jpeg');
                } else if (bookingImgSrc.startsWith('/assets/')) {
                  setBookingImgSrc(bookingImgSrc.replace('/assets/', '/'));
                }
              }}
            />
          </div>

          {/* Überschrift & Text rechts */}
          <div className="flex-1 flex flex-col justify-center self-center sm:self-start">
            <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
              Online Terminbuchung
            </span>
            <h2
              id="booking-title"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E3335] font-normal mb-4"
            >
              Deinen individuellen Termin finden
            </h2>
            <p className="text-base text-[#3E3335]/80 font-light leading-relaxed">
              Wähle deinen Wunschtermin direkt in unserem Online-Terminkalender von SimplyBook bei mir in der Praxis in Köln-Lindenthal
            </p>
          </div>
        </div>

        {/* Direktes SimplyBook Buchungstool ohne Schritt-Kästen */}
        <div className="w-full bg-[#FBF8F6] rounded-3xl border border-[#E9DDDB] shadow-xs p-6 sm:p-8 lg:p-10">
          <SimplyBookWidget />
        </div>
      </div>
    </section>
  );
};

export default BookingTool;
