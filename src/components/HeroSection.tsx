import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface HeroSectionProps {
  currentRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentRegion, onSelectRegion }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const regions = [
    { id: 'global', name: 'Everywhere (Global)', subtitle: 'All world markets & leading benchmarks' },
    { id: 'us', name: 'United States', subtitle: 'NYSE, NASDAQ, S&P 500, Dow 30, Russell' },
    { id: 'europe', name: 'Europe', subtitle: 'FTSE 100, DAX 40, CAC 40, Euro Stoxx' },
    { id: 'asia', name: 'Asia-Pacific', subtitle: 'Nikkei 225, Hang Seng, Nifty 50, ASX 200' },
    { id: 'crypto', name: 'Crypto & Digital Assets', subtitle: 'Bitcoin, Ethereum, Solana & Altcoins' },
  ];

  return (
    <section className="pt-8 sm:pt-10 pb-6 text-center px-4 relative" data-purpose="hero-title">
      <div className="relative inline-block">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center justify-center gap-3 cursor-pointer group focus:outline-none"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#131722]">
            {currentRegion === 'global' ? 'Markets, everywhere' : `Markets, ${regions.find(r => r.id === currentRegion)?.name || currentRegion}`}
          </h1>
          <svg
            className={`w-7 h-7 sm:w-8 sm:h-8 text-[#131722] group-hover:translate-y-0.5 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#E0E3EB] p-2 z-30 text-left animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#787B86] border-b border-[#E0E3EB]">
              Select Regional Focus
            </div>
            <div className="py-1 space-y-1">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    onSelectRegion(reg.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-start justify-between transition ${
                    currentRegion === reg.id ? 'bg-[#F0F3FA] text-[#131722]' : 'hover:bg-[#F0F3FA]/70 text-[#131722]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm">{reg.name}</div>
                    <div className="text-[11px] text-[#787B86]">{reg.subtitle}</div>
                  </div>
                  {currentRegion === reg.id && <Check className="w-4 h-4 text-[#2962FF] shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
