import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Mail, Phone, Lock, FileText, ExternalLink } from 'lucide-react';
import { PhiLogo } from './PhiLogo';
import { CONTACT_CONFIG } from '../config';

interface DatenschutzPageProps {
  onNavigateHome: () => void;
  onNavigateImpressum?: () => void;
}

export const DatenschutzPage: React.FC<DatenschutzPageProps> = ({
  onNavigateHome,
  onNavigateImpressum,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Datenschutzerklärung | Dr. med. M. Philippi – Phi Aesthetics';
  }, []);

  const handleImpressumClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateImpressum) {
      onNavigateImpressum();
    } else {
      window.history.pushState(null, '', '/impressum');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F6] text-[#3E3335] selection:bg-[#D8C4C2] selection:text-[#3E3335]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF8F6]/95 backdrop-blur-md border-b border-[#E9DDDB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#775B5D] rounded-lg p-1"
            aria-label="Zurück zur Startseite von Phi Aesthetics"
          >
            <PhiLogo variant="header" />
          </a>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E9DDDB] text-xs font-medium text-[#775B5D] hover:text-[#3E3335] hover:bg-[#E9DDDB]/40 active:scale-[0.98] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zur Startseite</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#775B5D] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#775B5D]" />
              <span>Privatsphäre & Datenschutz</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#3E3335] font-normal tracking-tight">
              Datenschutzerklärung
            </h1>
            <p className="text-sm text-[#775B5D] font-light">
              Informationen über die Art, den Umfang und den Zweck der Erhebung und Verwendung Ihrer Daten
            </p>
          </div>

          {/* 1. Datenschutz auf einen Blick */}
          <section
            aria-labelledby="section-1-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="section-1-title"
              className="font-serif text-2xl text-[#3E3335] font-normal border-b border-[#E9DDDB]/60 pb-3"
            >
              1. Datenschutz auf einen Blick
            </h2>

            <div className="space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Allgemeine Hinweise
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-[#E9DDDB]/40">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Datenerfassung auf dieser Website
              </h3>

              <div className="space-y-3 text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <p>
                  <strong className="text-[#3E3335] font-medium block mb-1">
                    Wer ist verantwortlich für die Datenerfassung auf dieser Website?
                  </strong>
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.
                </p>

                <p>
                  <strong className="text-[#3E3335] font-medium block mb-1">
                    Wie erfassen wir Ihre Daten?
                  </strong>
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
                <p>
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>

                <p>
                  <strong className="text-[#3E3335] font-medium block mb-1">
                    Wofür nutzen wir Ihre Daten?
                  </strong>
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über die Website Verträge geschlossen oder angebahnt werden können, werden die übermittelten Daten auch für Vertragsangebote, Bestellungen oder sonstige Auftragsanfragen verarbeitet.
                </p>

                <p>
                  <strong className="text-[#3E3335] font-medium block mb-1">
                    Welche Rechte haben Sie bezüglich Ihrer Daten?
                  </strong>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
                <p>
                  Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Allgemeine Hinweise und Pflichtinformationen */}
          <section
            aria-labelledby="section-2-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="section-2-title"
              className="font-serif text-2xl text-[#3E3335] font-normal border-b border-[#E9DDDB]/60 pb-3"
            >
              2. Allgemeine Hinweise und Pflichtinformationen
            </h2>

            {/* Datenschutz */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Datenschutz
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
              </p>
            </div>

            {/* Hinweis zur verantwortlichen Stelle */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Hinweis zur verantwortlichen Stelle
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>

              <div className="p-4 rounded-xl bg-[#E9DDDB]/30 border border-[#E9DDDB] space-y-2 text-sm text-[#3E3335]">
                <p className="font-medium font-serif text-base">Dr. med. M. Philippi</p>
                <p className="font-light">Feldblumenweg 7a</p>
                <p className="font-light">50858 Köln</p>
                <div className="pt-2 border-t border-[#E9DDDB] space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#775B5D]" />
                    <span className="text-[#775B5D]">Telefon:</span>{' '}
                    <a href="tel:+4915233979650" className="hover:underline font-medium">
                      015233979650
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#775B5D]" />
                    <span className="text-[#775B5D]">E-Mail:</span>{' '}
                    <a href="mailto:info.phiaesthetics@gmail.com" className="hover:underline font-medium break-all">
                      info.phiaesthetics@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
              </p>
            </div>

            {/* Speicherdauer */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Speicherdauer
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
              </p>
            </div>

            {/* Rechtsgrundlagen */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO bzw. Art. 9 Abs. 2 lit. a DSGVO, sofern besondere Datenkategorien nach Art. 9 Abs. 1 DSGVO verarbeitet werden. Im Falle einer ausdrücklichen Einwilligung in die Übertragung personenbezogener Daten in Drittstaaten erfolgt die Datenverarbeitung außerdem auf Grundlage von Art. 49 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihr Endgerät (z. B. via Device-Fingerprinting) eingewilligt haben, erfolgt die Datenverarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar. Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer rechtlichen Verpflichtung erforderlich sind, auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO erfolgen. Über die jeweils im Einzelfall einschlägigen Rechtsgrundlagen wird in den folgenden Absätzen dieser Datenschutzerklärung informiert.
              </p>
            </div>

            {/* Empfänger von personenbezogenen Daten */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Empfänger von personenbezogenen Daten
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Im Rahmen unserer Geschäftstätigkeit arbeiten wir mit verschiedenen externen Stellen zusammen. Dabei ist teilweise auch eine Übermittlung von personenbezogenen Daten an diese externen Stellen erforderlich. Wir geben personenbezogene Daten nur dann an externe Stellen weiter, wenn dies im Rahmen einer Vertragserfüllung erforderlich ist, wenn wir gesetzlich hierzu verpflichtet sind (z. B. Weitergabe von Daten an Steuerbehörden), wenn wir ein berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO an der Weitergabe haben oder wenn eine sonstige Rechtsgrundlage die Datenweitergabe erlaubt. Beim Einsatz von Auftragsverarbeitern geben wir personenbezogene Daten unserer Kunden nur auf Grundlage eines gültigen Vertrags über Auftragsverarbeitung weiter. Im Falle einer gemeinsamen Verarbeitung wird ein Vertrag über gemeinsame Verarbeitung geschlossen.
              </p>
            </div>

            {/* Widerruf Ihrer Einwilligung */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Widerruf Ihrer Einwilligung zur Datenverarbeitung
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>
            </div>

            {/* Widerspruchsrecht Art. 21 DSGVO */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)
              </h3>
              <div className="p-4 rounded-xl bg-[#E9DDDB]/25 border border-[#D8C4C2] space-y-3 text-xs sm:text-sm text-[#3E3335] leading-relaxed font-medium">
                <p>
                  WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).
                </p>
                <p>
                  WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).
                </p>
              </div>
            </div>

            {/* Beschwerderecht */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Beschwerderecht bei der zuständigen Aufsichtsbehörde
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
              </p>
            </div>

            {/* Recht auf Datenübertragbarkeit */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Recht auf Datenübertragbarkeit
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.
              </p>
            </div>

            {/* Auskunft, Berichtigung und Löschung */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Auskunft, Berichtigung und Löschung
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.
              </p>
            </div>

            {/* Recht auf Einschränkung der Verarbeitung */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Recht auf Einschränkung der Verarbeitung
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der Verarbeitung besteht in folgenden Fällen:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light list-disc list-inside">
                <li>
                  Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig geschah/geschieht, können Sie statt der Löschung die Einschränkung der Datenverarbeitung verlangen.
                </li>
                <li>
                  Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                </li>
                <li>
                  Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                </li>
              </ul>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Wenn Sie die Verarbeitung Ihrer personenbezogenen Daten eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen oder juristischen Person oder aus Gründen eines wichtigen öffentlichen Interesses der Europäischen Union oder eines Mitgliedstaats verarbeitet werden.
              </p>
            </div>
          </section>

          {/* 3. Datenerfassung auf dieser Website */}
          <section
            aria-labelledby="section-3-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="section-3-title"
              className="font-serif text-2xl text-[#3E3335] font-normal border-b border-[#E9DDDB]/60 pb-3"
            >
              3. Datenerfassung auf dieser Website
            </h2>

            {/* Kontaktformular */}
            <div className="space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Kontaktformular
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
              </p>
            </div>

            {/* Anfrage per E-Mail, Telefon oder Telefax */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Anfrage per E-Mail, Telefon oder Telefax
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde; die Einwilligung ist jederzeit widerrufbar.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die von Ihnen an uns per Kontaktanfragen übersandten Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihres Anliegens). Zwingende gesetzliche Bestimmungen – insbesondere gesetzliche Aufbewahrungsfristen – bleiben unberührt.
              </p>
            </div>
          </section>

          {/* 4. Newsletter */}
          <section
            aria-labelledby="section-4-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="section-4-title"
              className="font-serif text-2xl text-[#3E3335] font-normal border-b border-[#E9DDDB]/60 pb-3"
            >
              4. Newsletter
            </h2>

            <div className="space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Newsletterdaten
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Diese Daten verwenden wir für den Versand der angeforderten Informationen und geben diese nicht an Dritte weiter. Im Rahmen von Newsletter-Kampagnen können wir verschiedene Daten analysieren (z. B. Öffnungszeitpunkt, IP-Adresse, Geräteinformationen, angeklickte Links und ggf. nachfolgende Aktionen).
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die Verarbeitung der in das Newsletteranmeldeformular eingegebenen Daten erfolgt ausschließlich auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die erteilte Einwilligung zur Speicherung der Daten, der E-Mail-Adresse sowie deren Nutzung zum Versand des Newsletters können Sie jederzeit widerrufen, etwa über den „Austragen“-Link im Newsletter. Die Rechtmäßigkeit der bereits erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf unberührt.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns hinterlegten Daten werden von uns bis zu Ihrer Austragung aus dem Newsletter bei uns bzw. dem Newsletterdiensteanbieter gespeichert und nach der Abbestellung des Newsletters oder nach Zweckfortfall aus der Newsletterverteilerliste gelöscht. Wir behalten uns vor, E-Mail-Adressen aus unserem Newsletterverteiler nach eigenem Ermessen im Rahmen unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO zu löschen oder zu sperren. Daten, die zu anderen Zwecken bei uns gespeichert wurden, bleiben hiervon unberührt.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Nach Ihrer Austragung aus der Newsletterverteilerliste wird Ihre E-Mail-Adresse bei uns bzw. dem Newsletterdiensteanbieter ggf. in einer Blacklist gespeichert, sofern dies zur Verhinderung künftiger Mailings erforderlich ist. Die Daten aus der Blacklist werden nur für diesen Zweck verwendet und nicht mit anderen Daten zusammengeführt. Dies dient sowohl Ihrem Interesse als auch unserem Interesse an der Einhaltung der gesetzlichen Vorgaben beim Versand von Newslettern (berechtigtes Interesse im Sinne des Art. 6 Abs. 1 lit. f DSGVO). Die Speicherung in der Blacklist ist zeitlich nicht befristet. Sie können der Speicherung widersprechen, sofern Ihre Interessen unser berechtigtes Interesse überwiegen.
              </p>
            </div>
          </section>

          {/* 5. Plugins und Tools */}
          <section
            aria-labelledby="section-5-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="section-5-title"
              className="font-serif text-2xl text-[#3E3335] font-normal border-b border-[#E9DDDB]/60 pb-3"
            >
              5. Plugins und Tools
            </h2>

            <div className="space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                Google Fonts (lokales Hosting)
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts, die von Google bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern von Google findet dabei nicht statt.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Weitere Informationen zu Google Fonts finden Sie unter{' '}
                <a
                  href="https://developers.google.com/fonts/faq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#775B5D] hover:underline font-medium inline-flex items-center gap-1"
                >
                  developers.google.com/fonts/faq <ExternalLink className="w-3 h-3" />
                </a>{' '}
                und in der Datenschutzerklärung von Google:{' '}
                <a
                  href="https://policies.google.com/privacy?hl=de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#775B5D] hover:underline font-medium inline-flex items-center gap-1"
                >
                  policies.google.com/privacy?hl=de <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
            </div>
          </section>

          {/* 6. Cloudflare Inc. / Cloudflare Germany GmbH */}
          <section
            aria-labelledby="section-6-title"
            className="p-6 sm:p-8 rounded-2xl bg-[#FBF8F6] border border-[#E9DDDB] shadow-xs space-y-6"
          >
            <h2
              id="section-6-title"
              className="font-serif text-2xl text-[#3E3335] font-normal border-b border-[#E9DDDB]/60 pb-3"
            >
              6. Cloudflare Inc. / Cloudflare Germany GmbH
            </h2>

            <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
              Diese Website nutzt Dienste von Cloudflare Inc., 101 Townsend Street, San Francisco, CA 94107, USA bzw. der Cloudflare Germany GmbH, Neue Mainzer Straße 56, 60311 Frankfurt am Main (nachfolgend „Cloudflare").
            </p>
            <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
              Cloudflare stellt Content Delivery Network (CDN), DDoS-Schutz, Sicherheits- und Performance-Dienste sowie Cloud-Hosting-Infrastruktur bereit. Beim Aufruf dieser Website werden durch Cloudflare technische Daten verarbeitet, um die Auslieferung der Website-Inhalte zu beschleunigen, die Sicherheit zu gewährleisten und die Website-Infrastruktur bereitzustellen.
            </p>

            {/* 1. Allgemeine Datenverarbeitung (CDN & Sicherheitsdienste) */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                1. Allgemeine Datenverarbeitung (CDN & Sicherheitsdienste)
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Bei der Nutzung dieser Website werden folgende Daten durch Cloudflare verarbeitet:
              </p>
              <ul className="space-y-1 text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light list-disc list-inside">
                <li>IP-Adresse des Nutzers (wird zur Routing-Entscheidung verwendet und nach kurzer Zeit gelöscht bzw. anonymisiert)</li>
                <li>Angaben zum Browser und zum verwendeten Betriebssystem (User-Agent)</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Zieldomain und aufgerufene URL</li>
                <li>Übertragene Datenmenge</li>
                <li>Referrer-URL (die zuvor besuchte Website)</li>
                <li>Informationen zur TLS-Verschlüsselung</li>
              </ul>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <strong className="text-[#3E3335] font-medium">Zweck:</strong> Auslieferung der Website-Inhalte, Gewährleistung der Sicherheit und Verfügbarkeit (insbesondere Schutz vor DDoS-Angriffen und Bot-Aktivität) sowie Verbesserung der Ladezeiten.{' '}
                <strong className="text-[#3E3335] font-medium">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse des Websitebetreibers).
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <strong className="text-[#3E3335] font-medium">Dauer der Speicherung:</strong> Cloudflare speichert die Daten in Logdateien für einen begrenzten Zeitraum zur Untersuchung von Sicherheitsvorfällen. IP-Adressen werden nach kurzer Zeit gekürzt oder gelöscht. Details entnehmen Sie der Cloudflare-Datenschutzerklärung.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <strong className="text-[#3E3335] font-medium">Cloudflare-Cookie (__cf_bm):</strong> Cloudflare setzt ein Cookie zur Unterscheidung zwischen menschlichen Nutzern und Bots ein. Dieses Cookie ist für die Sicherheit der Website erforderlich und wird ohne Einwilligung gesetzt. Speicherdauer: in der Regel 30 Minuten bis zu einigen Tagen. Weitere Informationen: Cloudflare Cookie-Richtlinie.
              </p>
            </div>

            {/* 2. Cloudflare Workers (Server-Infrastruktur) */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                2. Cloudflare Workers (Server-Infrastruktur)
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Diese Website nutzt Cloudflare Workers — eine serverlose Ausführungsumgebung, die Anwendungen direkt am Netzwerkrand (Edge) ausführt. Die Website-Anwendung (Worker „phiaesthetics") läuft auf Cloudflare-Infrastruktur.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <strong className="text-[#3E3335] font-medium">Verarbeitete Daten:</strong>
              </p>
              <ul className="space-y-1 text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light list-disc list-inside">
                <li>IP-Adresse des Nutzers</li>
                <li>HTTP-Anfrage- und Antwortdaten (Header, URL-Parameter, übertragener Body-Inhalt)</li>
                <li>Durch die Anwendung verarbeitete Eingabedaten (z. B. Formulareingaben, Suchanfragen)</li>
                <li>Technische Metadaten (Zeitstempel, Routing-Informationen)</li>
              </ul>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <strong className="text-[#3E3335] font-medium">Zweck:</strong> Ausführung der serverseitigen Anwendungslogik, Verarbeitung von Nutzeranfragen, Bereitstellung dynamischer Inhalte.{' '}
                <strong className="text-[#3E3335] font-medium">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an dem Betrieb der Website-Infrastruktur).
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                <strong className="text-[#3E3335] font-medium">Speicherdauer:</strong> Anfragedaten werden für die Dauer der Verarbeitung im Arbeitsspeicher (RAM) gehalten und nach Abschluss der Anfrage gelöscht. Logdaten werden für einen begrenzten Zeitraum gespeichert. Details: Cloudflare Workers-Dokumentation.
              </p>
            </div>

            {/* 3. Auftragsverarbeitungsvertrag (AVV) */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                3. Auftragsverarbeitungsvertrag (AVV)
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Mit Cloudflare wurde ein Auftragsverarbeitungsvertrag (Data Processing Addendum, DPA) abgeschlossen, der die EU-Standardvertragsklauseln (SCCs) umfasst. Die DPA ist Teil der Self-Service-Subscription-Vereinbarung und bedarf keines separaten Abschlusses. Dokument: Cloudflare Customer DPA.
              </p>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Die aktuelle Liste der Sub-Unternehmer (Sub-processors) von Cloudflare ist einsehbar unter der Cloudflare Sub-processors Liste.
              </p>
            </div>

            {/* 4. Datenübermittlung in Drittländer */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                4. Datenübermittlung in Drittländer
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Cloudflare verarbeitet Daten in Rechenzentren weltweit, einschließlich den USA. Die Datenübermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln (SCCs) sowie der Zertifizierung Cloudflares unter dem EU-U.S. Data Privacy Framework (DPF). Weitere Informationen finden Sie im Cloudflare GDPR Hub.
              </p>
            </div>

            {/* 5. Ihre Rechte */}
            <div className="pt-4 border-t border-[#E9DDDB]/40 space-y-3">
              <h3 className="font-serif text-lg text-[#3E3335] font-medium">
                5. Ihre Rechte
              </h3>
              <p className="text-sm sm:text-base text-[#3E3335]/90 leading-relaxed font-light">
                Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO) und Datenübertragbarkeit (Art. 20 DSGVO). Anfragen richten Sie bitte an den Websitebetreiber. Für Anfragen direkt an Cloudflare:{' '}
                <a
                  href="mailto:sar@cloudflare.com"
                  className="text-[#775B5D] hover:underline font-medium"
                >
                  sar@cloudflare.com
                </a>.
              </p>
            </div>
          </section>

          {/* Quelle */}
          <div className="p-4 rounded-xl bg-[#E9DDDB]/20 border border-[#E9DDDB] text-xs text-[#775B5D] font-light flex items-center justify-between">
            <span>Quelle: e-recht24.de</span>
            <a
              href="https://www.e-recht24.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1 font-medium"
            >
              www.e-recht24.de <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#775B5D] text-[#FBF8F6] text-xs uppercase tracking-wider font-medium hover:bg-[#3E3335] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück zur Startseite</span>
            </button>
            <a
              href="/impressum"
              onClick={handleImpressumClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#D8C4C2] text-[#775B5D] hover:bg-[#E9DDDB]/40 text-xs uppercase tracking-wider font-medium active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Zum Impressum</span>
            </a>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-[#FBF8F6] border-t border-[#E9DDDB] text-xs text-[#775B5D]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Phi Aesthetics – Dr. med. M. Philippi, Köln</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Startseite
            </button>
            <span>•</span>
            <a
              href="/impressum"
              onClick={handleImpressumClick}
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Impressum
            </a>
            <span>•</span>
            <a
              href="mailto:info.phiaesthetics@gmail.com?subject=Deine%20Anfrage%20an%20Phi%20Aesthetics"
              className="hover:text-[#3E3335] transition-colors underline-offset-4 hover:underline"
            >
              info.phiaesthetics@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
