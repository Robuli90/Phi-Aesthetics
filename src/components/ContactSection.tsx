import React from 'react';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';

interface ContactSectionProps {
  onDirectBooking?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  return (
    <section
      id="kontakt"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-label="Google Maps Standort"
    >
      <div className="max-w-4xl mx-auto">
        {/* Datenschutzbewusster Google Maps Bereich */}
        <GoogleMapsEmbed />
      </div>
    </section>
  );
};

