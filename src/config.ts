import { NavItem, ZoneOption, AddonOption, OtherTreatmentOption, FaqItem } from './types';

export const ASSETS = {
  LOGO_IMAGE_FILE: '/Logo_Phi.png',
  MILENA_PORTRAIT_FILE: 'WhatsApp-Image-2026-09-09-at-15.11.42-2.jpeg',
  CANDIDATE_PATHS: {
    logo: [
      '/Logo_Phi.png',
      '/assets/Logo_Phi.png',
      '/Logo.png',
      '/assets/Logo.png',
      '/assets/phi-logo.jpg',
      '/phi-logo.jpg',
      '/WhatsApp-Image-2026-09-08-at-19.18.44.jpeg',
      '/assets/WhatsApp-Image-2026-09-08-at-19.18.44.jpeg',
      '/assets/aistudio/WhatsApp-Image-2026-09-08-at-19.18.44.jpeg',
    ],
    milena: [
      '/WhatsApp-Image-2026-09-09-at-15.11.42-2.jpeg',
      '/assets/WhatsApp-Image-2026-09-09-at-15.11.42-2.jpeg',
      '/assets/aistudio/WhatsApp-Image-2026-09-09-at-15.11.42-2.jpeg',
    ],
  },
};

export const CONTACT_CONFIG = {
  practiceName: 'Phi Aesthetics',
  doctorName: 'Dr. Milena Philippi',
  street: 'Musterstrasse 69',
  zipCity: '12345 Musterstadt',
  email: 'info.phiaesthetics@gmail.com',
  phone: '0152 33979650',
  phoneHref: 'tel:+4915233979650',
  emailHref: 'mailto:info.phiaesthetics@gmail.com',
  googleMapsQueryUrl: 'https://www.google.com/maps/search/?api=1&query=Musterstrasse+69+12345+Musterstadt',
  googleMapsApiKey:
    (typeof import.meta !== 'undefined' &&
      (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_API_KEY) ||
    '',
};

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: 'angebote', label: 'Was wir anbieten', href: '#angebote' },
  { id: 'dein-weg', label: 'Dein Weg', href: '#dein-weg' },
  { id: 'preise', label: 'Transparente Preise', href: '#preise' },
  { id: 'dr-milena', label: 'Dr. Milena Philippi', href: '#dr-milena' },
  { id: 'botox-verstehen', label: 'Botox verstehen', href: '#botox-verstehen' },
  { id: 'termin-buchen', label: 'Termin finden', href: '#termin-buchen' },
  { id: 'phi-news', label: 'Phi-News', href: '#phi-news' },
  { id: 'begegnungen', label: 'Begegnungen', href: '#begegnungen' },
  { id: 'kontakt', label: 'Sprich mit uns', href: '#kontakt' },
];

export const ZONE_OPTIONS: ZoneOption[] = [
  { id: 'glabella', name: 'Glabella', description: 'Bereich zwischen den Augenbrauen (Zornesfalte)' },
  { id: 'stirn', name: 'Stirn', description: 'Horizontale Stirnfalten für einen entspannten Blick' },
  { id: 'augenwinkel', name: 'Laterale Augenwinkel', description: 'Feine Linien seitlich der Augen (Lachfalten)' },
];

export const ZONE_PRICES: Record<1 | 2 | 3, number> = {
  1: 160,
  2: 280,
  3: 360,
};

export const ADDON_OPTIONS: AddonOption[] = [
  { id: 'bunny-lines', name: 'Bunny Lines', price: 70, formattedPrice: 'ab 70 €', description: 'Feine Fältchen am oberen Nasenbereich' },
  { id: 'lip-flip', name: 'Lip Flip', price: 70, formattedPrice: 'ab 70 €', description: 'Dezente Entspannung der Oberlippenmuskulatur' },
  { id: 'dao', name: 'DAO', price: 70, formattedPrice: 'ab 70 €', description: 'Musculus depressor anguli oris (Mundwinkelsenker)' },
  { id: 'brow-lift', name: 'Brow Lift', price: 70, formattedPrice: 'ab 70 €', description: 'Sanftes, dezentes Anheben der Augenbrauenlinie' },
  { id: 'gummy-smile', name: 'Gummy Smile', price: 70, formattedPrice: 'ab 70 €', description: 'Dezente Harmonisierung bei sichtbarem Zahnfleischlächeln' },
  { id: 'kinn', name: 'Kinn', price: 70, formattedPrice: 'ab 70 €', description: 'Entspannung des Kinnmuskels (Pflastersteinkinn)' },
];

export const OTHER_TREATMENTS: OtherTreatmentOption[] = [
  {
    id: 'masseter',
    name: 'Masseter',
    priceLabel: 'ab 340 €',
    basePrice: 340,
    description: 'Gezielte Behandlung des Kaumuskels bei Bruxismus (Zähneknirschen) oder zur optischen Konturierung.',
  },
  {
    id: 'nefertiti',
    name: 'Nefertiti',
    priceLabel: 'ab 340 €',
    basePrice: 340,
    description: 'Harmonische Definition der Kieferlinie und Entlastung des Platysmas am Hals.',
  },
  {
    id: 'hyperhidrose',
    name: 'Hyperhidrose im Bereich Achseln/Arme',
    priceLabel: 'ab 500 €',
    basePrice: 500,
    description: 'Effektive, zeitweise Hemmung übermäßiger Schweißdrüsenaktivität im Achselbereich.',
  },
  {
    id: 'haende',
    name: 'Hände',
    priceLabel: 'ab 550 €',
    basePrice: 550,
    description: 'Ärztliche Behandlung bei übermäßigem Schwitzen an den Handflächen.',
  },
];

export const FAQ_DATA: FaqItem[] = [
  // 1. Grundlagen
  {
    category: 'grundlagen',
    term: 'Botox',
    explanation: 'Botox ist die geläufige Bezeichnung für eine medizinisch indizierte Behandlung mit Botulinumtoxin. Der Wirkstoff wird gezielt und individuell eingesetzt, um bestimmte Muskelaktivitäten vorübergehend zu reduzieren.',
  },
  {
    category: 'grundlagen',
    term: 'Botulinumtoxin',
    explanation: 'Ein bewährtes, gereinigtes Protein aus der medizinischen Praxis, das die Signalübertragung zwischen Nerv und Muskel vorübergehend hemmt.',
  },
  {
    category: 'grundlagen',
    term: 'Wirkungseintritt',
    explanation: 'Der Wirkungseintritt erfolgt nicht bei allen Menschen exakt gleich. Wie schnell sich eine Veränderung zeigt, hängt unter anderem von der behandelten Region und deiner individuellen Gewebereaktion ab – erste Effekte sind meist nach wenigen Tagen sichtbar, das Endergebnis nach etwa zwei Wochen.',
  },
  {
    category: 'grundlagen',
    term: 'Haltbarkeit',
    explanation: 'Die Haltbarkeit kann individuell unterschiedlich sein und liegt typischerweise zwischen 3 und 6 Monaten. Im persönlichen Gespräch wird besprochen, welche Erwartungen realistisch sind.',
  },
  {
    category: 'grundlagen',
    term: 'Zone',
    explanation: 'Eine Zone bezeichnet einen zuvor festgelegten Behandlungsbereich, zum Beispiel Glabella, Stirn oder laterale Augenwinkel.',
  },
  {
    category: 'grundlagen',
    term: 'Add-on',
    explanation: 'Ein Add-on ist eine zusätzliche, kleinere und fein abgestimmte Behandlung, die zu einem Zonenpaket ergänzt werden kann.',
  },
  {
    category: 'grundlagen',
    term: 'Natürliches Ergebnis',
    explanation: 'Ein Ergebnis, das deine natürliche Mimik bewahrt und Frische schenkt, statt ein maskenhaftes oder erstarrtes Aussehen zu erzeugen.',
  },
  {
    category: 'grundlagen',
    term: 'Individuelle Dosierung',
    explanation: 'Jedes Gesicht ist einzigartig. Die Einheiten und Einstichpunkte werden exakt auf deine Muskelstärke, Anatomie und Wünsche angepasst.',
  },

  // 2. Behandlungen
  {
    category: 'behandlungen',
    term: 'Glabella',
    explanation: 'Die Glabella bezeichnet den Bereich zwischen den Augenbrauen, in dem sich häufig die sogenannte Zornesfalte zeigt.',
  },
  {
    category: 'behandlungen',
    term: 'Stirn',
    explanation: 'Die Behandlung der horizontalen Stirnlinien sorgt für einen geglätteten, offenen und ausgeruhten Gesichtsausdruck unter Erhalt einer harmonischen Brauenbewegung.',
  },
  {
    category: 'behandlungen',
    term: 'Laterale Augenwinkel',
    explanation: 'Die feinen Linien seitlich der Augen, oft als Lachfalten oder Krähenfüße bezeichnet, werden sanft gemildert, ohne dem Lächeln seine Herzlichkeit zu nehmen.',
  },
  {
    category: 'behandlungen',
    term: 'Bunny Lines',
    explanation: 'Kleine Fältchen an den seitlichen Flanken des oberen Nasenrückens, die beim Lachen oder Naserümpfen entstehen.',
  },
  {
    category: 'behandlungen',
    term: 'Lip Flip',
    explanation: 'Bei einem Lip Flip wird die Wirkung im Bereich der Oberlippe sehr gezielt geplant. Ob diese Behandlung geeignet ist, hängt von der individuellen Anatomie und dem gewünschten Ergebnis ab.',
  },
  {
    category: 'behandlungen',
    term: 'DAO',
    explanation: 'Der Musculus depressor anguli oris zieht die Mundwinkel nach unten. Eine gezielte Entspannung kann einem dauerhaft traurig oder streng wirkenden Mundausdruck entgegenwirken.',
  },
  {
    category: 'behandlungen',
    term: 'Brow Lift',
    explanation: 'Durch minimale Dosen an gezielten Punkten kann ein dezentes, natürliches Heben der seitlichen Augenbrauen erzielt werden.',
  },
  {
    category: 'behandlungen',
    term: 'Gummy Smile',
    explanation: 'Wenn sich beim Lächeln das Zahnfleisch stark zeigt, entspannt eine feine Injektion die Hebemuskeln der Oberlippe für ein ausgeglichenes Lächeln.',
  },
  {
    category: 'behandlungen',
    term: 'Kinn',
    explanation: 'Mildert unruhige Einziehungen oder das sogenannte Pflastersteinkinn durch gezielte Entspannung des Musculus mentalis.',
  },
  {
    category: 'behandlungen',
    term: 'Masseter',
    explanation: 'Bei der Behandlung der Masseter-Region wird der kräftige Kaumuskel betrachtet. Ziel und Eignung werden immer im persönlichen ärztlichen Gespräch geprüft – hilfreich bei Zähneknirschen und zur Gesichtsentspannung.',
  },
  {
    category: 'behandlungen',
    term: 'Nefertiti',
    explanation: 'Bezieht sich auf die Kieferkante und das Platysma am Hals, um der Kontur sanften Halt zu verleihen und die Kinnlinie optisch zu definieren.',
  },
  {
    category: 'behandlungen',
    term: 'Hyperhidrose im Bereich Achseln/Arme',
    explanation: 'Hyperhidrose bezeichnet übermäßiges Schwitzen. Bei einer Behandlung im Bereich Achseln/Arme wird zunächst individuell geklärt, ob diese Methode passend ist, um die Schweißdrüsenaktivität schonend zu reduzieren.',
  },
  {
    category: 'behandlungen',
    term: 'Hände',
    explanation: 'Gezielte Behandlung stark schwitzender Handinnenflächen für mehr Sicherheit und Wohlbefinden im Alltag.',
  },

  // 3. Ablauf
  {
    category: 'ablauf',
    term: 'Beratung',
    explanation: 'Jeder Behandlung geht eine ausführliche ärztliche Anamnese und Gesichtsdiagnostik voraus, bei der wir deine Wünsche, Anatomie und realistische Ziele besprechen.',
  },
  {
    category: 'ablauf',
    term: 'Behandlung',
    explanation: 'Die Injektionen erfolgen mit hauchfeinen Nadeln und dauern in der Regel nur 10 bis 20 Minuten. Sie sind schmerzarm und präzise abgestimmt.',
  },
  {
    category: 'ablauf',
    term: 'Nachsorge',
    explanation: 'Wir lassen dich nach dem Termin nicht allein: Du erhältst klare Hinweise zur Pflege und kannst dich bei allen Fragen oder zur Kontrollvisite jederzeit melden.',
  },
  {
    category: 'ablauf',
    term: 'Verhalten nach der Behandlung',
    explanation: 'Für die ersten Stunden empfehlen wir aufrechtes Sitzen, kein Reiben der behandelten Stellen und für 24–48 Stunden den Verzicht auf Sport, Sauna, Solarium und intensive Sonne.',
  },
  {
    category: 'ablauf',
    term: 'Persönliche Rückfragen',
    explanation: 'Solltest du nach der Behandlung Fragen, Wünsche oder Anregungen haben, erreichst du uns jederzeit persönlich. Deine Sicherheit und dein Wohlbefinden stehen an erster Stelle.',
  },

  // 4. Sicherheit & mögliche Komplikationen
  {
    category: 'sicherheit',
    term: 'Rötungen & Schwellungen',
    explanation: 'Nach einer Injektion können vorübergehend leichte Rötungen oder kleine Mückenstich-ähnliche Schwellungen an den Einstichstellen auftreten, die meist nach wenigen Stunden abklingen.',
  },
  {
    category: 'sicherheit',
    term: 'Druckempfindlichkeit & Blutergüsse',
    explanation: 'Gelegentlich kann es zu kleineren blauen Flecken (Hämatomen) oder punktueller Druckempfindlichkeit kommen, die nach einigen Tagen vollständig verheilen.',
  },
  {
    category: 'sicherheit',
    term: 'Kopfschmerzen',
    explanation: 'Ein leichtes Spannungsgefühl oder vorübergehende leichte Kopfschmerzen am Behandlungstag sind selten, aber möglich und vergehen in aller Regel rasch.',
  },
  {
    category: 'sicherheit',
    term: 'Vorübergehende Asymmetrien',
    explanation: 'Da Gesichtshälften asymmetrisch arbeiten, kann die Wirkung unterschiedlich schnell eintreten. Nach etwa 14 Tagen kann bei Bedarf eine feine Feinjustierung vorgenommen werden.',
  },
  {
    category: 'sicherheit',
    term: 'Nicht gewünschte oder unzureichende Wirkung',
    explanation: 'Wie bei jeder medizinischen Behandlung kann es zu individuellen Reaktionsunterschieden kommen. Ein persönliches Nachgespräch klärt den weiteren Verlauf.',
  },
  {
    category: 'sicherheit',
    term: 'Seltene, behandlungsbedürftige Komplikationen',
    explanation: 'Sehr selten kann es zu einem vorübergehenden Hängen des Augenlids (Ptosis) oder einer lokalen Infektion kommen. Bei ungewöhnlichen, starken Beschwerden sollte zeitnah ärztlicher Kontakt aufgenommen werden.',
  },
  {
    category: 'sicherheit',
    term: 'Kontraindikationen',
    explanation: 'In Schwangerschaft, Stillzeit, bei bestimmten neuromuskulären Erkrankungen (z. B. Myasthenia gravis) oder akuten Infektionen im Behandlungsbereich führen wir keine Behandlung durch.',
  },
];
