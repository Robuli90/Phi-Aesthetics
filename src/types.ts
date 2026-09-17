export type SectionId =
  | 'angebote'
  | 'dein-weg'
  | 'preise'
  | 'dr-milena'
  | 'botox-verstehen'
  | 'termin-buchen'
  | 'phi-news'
  | 'begegnungen'
  | 'kontakt';

export interface NavItem {
  id: SectionId;
  label: string;
  href: string;
}

export interface ZoneOption {
  id: string;
  name: string;
  description: string;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  description: string;
}

export interface OtherTreatmentOption {
  id: string;
  name: string;
  priceLabel: string;
  basePrice?: number;
  description: string;
}

export interface FaqItem {
  term: string;
  explanation: string;
  category: 'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit';
}

export interface EventItem {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  isPast?: boolean;
}

export interface BookingState {
  type: 'zones' | 'other';
  zoneCount: 1 | 2 | 3;
  selectedZones: string[];
  selectedAddons: string[];
  selectedOtherTreatment?: string;
  selectedDate: Date | null;
  selectedSlot: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  calculatedPrice: number;
}
