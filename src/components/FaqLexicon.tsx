import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { FAQ_DATA } from '../config';

interface FaqLexiconProps {
  initialCategory?: 'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit';
}

export const FaqLexicon: React.FC<FaqLexiconProps> = ({ initialCategory = 'grundlagen' }) => {
  const [activeCategory, setActiveCategory] = useState<
    'grundlagen' | 'behandlungen' | 'ablauf' | 'sicherheit'
  >(initialCategory);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    Botox: true,
    Glabella: true,
    Beratung: true,
    'Rötungen & Schwellungen': true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'grundlagen', label: 'Grundlagen' },
    { id: 'behandlungen', label: 'Behandlungen' },
    { id: 'ablauf', label: 'Ablauf' },
    { id: 'sicherheit', label: 'Sicherheit & mögliche Komplikationen' },
  ] as const;

  const toggleItem = (term: string) => {
    setOpenItems((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  const filteredItems = FAQ_DATA.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery.trim() !== '') {
      return matchesSearch;
    }
    return item.category === activeCategory;
  });

  return (
    <section
      id="botox-verstehen"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#FBF8F6] border-t border-[#E9DDDB]"
      aria-labelledby="faq-title"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-[#775B5D] font-medium block mb-2">
            Wissens-Lexikon & FAQ
          </span>
          <h2
            id="faq-title"
            className="font-serif text-3xl sm:text-4xl text-[#3E3335] font-normal mb-4"
          >
            Botox verstehen
          </h2>
          <p className="text-base text-[#3E3335]/80 font-light max-w-xl mx-auto">
            Medizinisch verständlich erklärt: Antworten auf wichtige Fragen rund um Wirkungsweise, Zonen, Ablauf und Sicherheit.
          </p>
        </div>

        {/* Search Bar for convenience */}
        <div className="relative mb-8 max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Begriff suchen (z. B. Glabella, Haltbarkeit, Sport)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FBF8F6] border border-[#E9DDDB] text-sm text-[#3E3335] placeholder:text-[#3E3335]/40 focus:outline-none focus:border-[#775B5D] transition-colors"
          />
          <Search className="w-4 h-4 text-[#B99A99] absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-xs text-[#775B5D] hover:underline"
            >
              Löschen
            </button>
          )}
        </div>

        {/* Category Tabs */}
        {searchQuery.trim() === '' && (
          <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#775B5D] text-[#FBF8F6] shadow-sm'
                    : 'bg-[#FBF8F6] border border-[#E9DDDB] text-[#3E3335]/80 hover:border-[#D8C4C2] hover:text-[#3E3335]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Accordion Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isOpen = !!openItems[item.term];
            return (
              <div
                key={item.term}
                className="rounded-xl bg-[#FBF8F6] border border-[#E9DDDB] overflow-hidden transition-colors hover:border-[#D8C4C2]"
              >
                <button
                  onClick={() => toggleItem(item.term)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:bg-[#D8C4C2]/15"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl text-[#3E3335] font-normal">
                    {item.term}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#B99A99] capitalize hidden sm:inline">
                      {item.category}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#775B5D] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#3E3335]/85 leading-relaxed font-light border-t border-[#E9DDDB]/60 bg-[#FBF8F6]">
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-[#E9DDDB]/20 border border-[#E9DDDB] text-sm text-[#775B5D]">
              Kein passender Begriff gefunden. Probiere einen anderen Suchbegriff oder wechsle die Kategorie.
            </div>
          )}
        </div>

        {/* Medical disclaimer note */}
        <div className="mt-12 p-5 rounded-xl bg-[#E9DDDB]/30 border border-[#E9DDDB] text-xs text-[#775B5D] leading-relaxed text-center">
          Die Erläuterungen im Wissensbereich dienen der allgemeinen Patienteninformation. Sie stellen keine individuelle Diagnose, keine Dosierungsempfehlung und kein Wirk- oder Heilsversprechen dar. Jede Behandlung setzt ein persönliches ärztliches Aufklärungsgespräch voraus.
        </div>
      </div>
    </section>
  );
};
