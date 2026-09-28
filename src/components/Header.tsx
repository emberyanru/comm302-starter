import React, { useState } from 'react';
import { Search, Globe, User, Star, Activity, ChevronDown, Check, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  liveUpdates: boolean;
  onToggleLive: () => void;
  onSelectNav: (item: string) => void;
  activeNav: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  liveUpdates,
  onToggleLive,
  onSelectNav,
  activeNav,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [profileOpen, setProfileOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<string | null>(null);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'JA', name: '日本語' },
    { code: 'FR', name: 'Français' },
    { code: 'ZH', name: '中文' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E0E3EB]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Logo & Search & Main Navigation Links */}
          <div className="flex items-center gap-6 lg:gap-8 flex-1">
            {/* TradingView Stylized Glyph Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectNav('Markets');
              }}
              aria-label="TradingView Home"
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <svg
                className="w-8 h-8 fill-current text-black group-hover:text-[#2962FF] transition-colors"
                fill="none"
                viewBox="0 0 36 28"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 6H13V22H7V6Z"></path>
                <path d="M19 0H25V28H19V0Z"></path>
                <path d="M0 12H6V22H0V12Z"></path>
                <path d="M26 6H32V22H26V6Z"></path>
              </svg>
            </a>

            {/* Search Input Bar */}
            <div
              className="relative w-full max-w-[280px] hidden sm:block cursor-pointer"
              onClick={onOpenSearch}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787B86]">
                <Search className="w-4 h-4" />
              </div>
              <input
                className="w-full pl-9 pr-3 py-1.5 bg-[#F0F3FA] hover:bg-[#E8ECF5] text-xs md:text-sm rounded-full border border-transparent focus:border-[#2962FF] focus:bg-white focus:outline-none cursor-pointer transition text-[#131722]"
                placeholder="Search (Ctrl+K)"
                readOnly
                type="text"
              />
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-[#131722]">
              <button
                onClick={() => setInfoModal('Products')}
                className="hover:text-[#2962FF] transition-colors py-5"
              >
                Products
              </button>
              <button
                onClick={() => setInfoModal('Community')}
                className="hover:text-[#2962FF] transition-colors py-5"
              >
                Community
              </button>
              <button
                onClick={() => onSelectNav('Markets')}
                className="text-[#2962FF] font-semibold border-b-2 border-[#2962FF] py-5 inline-flex items-center"
              >
                Markets
              </button>
              <button
                onClick={() => setInfoModal('Brokers')}
                className="hover:text-[#2962FF] transition-colors py-5"
              >
                Brokers
              </button>
              <button
                onClick={() => setInfoModal('More')}
                className="hover:text-[#2962FF] transition-colors py-5"
              >
                More
              </button>
            </nav>
          </div>

          {/* Right: Utilities & User Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {/* Live Feed Toggle */}
            <button
              onClick={onToggleLive}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
                liveUpdates
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-[#F0F3FA] text-[#787B86] border-transparent hover:text-[#131722]'
              }`}
              title="Toggle simulated real-time market data feed"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  liveUpdates ? 'bg-[#089981] animate-pulse' : 'bg-[#787B86]'
                }`}
              ></span>
              <span className="tabular-nums">Live {liveUpdates ? 'ON' : 'PAUSED'}</span>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="sm:hidden p-2 text-[#131722] hover:bg-[#F0F3FA] rounded-full transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Watchlist Quick Button */}
            <button
              onClick={onOpenWatchlist}
              className="relative p-2 text-[#131722] hover:bg-[#F0F3FA] rounded-full transition"
              title="Open Watchlist"
            >
              <Star className="w-5 h-5 text-[#131722]" />
              {watchlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2962FF] text-white text-[10px] font-bold flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[#131722] hover:bg-[#F0F3FA] rounded-md text-xs font-semibold uppercase tracking-wider transition"
              >
                <Globe className="w-4 h-4 text-[#131722]" />
                <span>{currentLang}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-[#E0E3EB] py-1 z-50 animate-in fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setCurrentLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-[#131722] hover:bg-[#F0F3FA] flex items-center justify-between"
                    >
                      <span>{l.name}</span>
                      {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="User profile"
                className="p-2 text-[#131722] hover:bg-[#F0F3FA] rounded-full transition"
              >
                <User className="w-5 h-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E0E3EB] p-3 z-50 animate-in fade-in">
                  <div className="pb-3 border-b border-[#E0E3EB]">
                    <div className="font-bold text-sm text-[#131722]">Guest Trader</div>
                    <div className="text-xs text-[#787B86]">Pro Plan Member</div>
                  </div>
                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        onOpenWatchlist();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left text-xs font-medium py-1.5 px-2 hover:bg-[#F0F3FA] rounded text-[#131722]"
                    >
                      My Watchlist ({watchlistCount})
                    </button>
                    <button
                      onClick={() => {
                        setInfoModal('Settings');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left text-xs font-medium py-1.5 px-2 hover:bg-[#F0F3FA] rounded text-[#131722]"
                    >
                      Chart Settings
                    </button>
                    <button
                      onClick={() => {
                        setInfoModal('Alerts');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left text-xs font-medium py-1.5 px-2 hover:bg-[#F0F3FA] rounded text-[#131722]"
                    >
                      Price Alerts
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Call to Action Button */}
            <button
              onClick={() => setInfoModal('GetStarted')}
              className="tv-btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-full shadow-xs transition active:scale-95 whitespace-nowrap"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Info / Products Modal */}
      {infoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setInfoModal(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E0E3EB]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#131722]">
                {infoModal === 'GetStarted' ? 'Welcome to TradingView' : infoModal}
              </h3>
              <button
                onClick={() => setInfoModal(null)}
                className="text-[#787B86] hover:text-[#131722] text-sm"
              >
                ✕
              </button>
            </div>
            {infoModal === 'GetStarted' ? (
              <div className="space-y-4 text-sm text-[#787B86]">
                <p>
                  Experience the fastest financial charting platform with real-time global markets data,
                  technical indicators, and financial analytics.
                </p>
                <div className="p-4 rounded-xl bg-[#F0F3FA] text-[#131722] space-y-2">
                  <div className="font-semibold text-xs text-[#2962FF] uppercase">Ready to explore</div>
                  <div className="text-sm font-bold">TradingView All-Access Hub</div>
                  <div className="text-xs text-[#787B86]">
                    ✓ Real-time quotes for US stocks, Crypto, Commodities & Indices
                  </div>
                  <div className="text-xs text-[#787B86]">
                    ✓ Multi-timeframe interactive candlestick charts & technical indicators
                  </div>
                </div>
                <button
                  onClick={() => setInfoModal(null)}
                  className="w-full py-2.5 tv-btn-gradient text-white font-bold rounded-xl shadow-xs"
                >
                  Start Exploring Now
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-[#787B86]">
                <p>
                  TradingView provides world-class financial analysis tools, advanced charting, and social
                  community features for {infoModal.toLowerCase()}.
                </p>
                <div className="p-3 bg-[#F0F3FA] rounded-lg text-xs text-[#131722] font-medium">
                  Feature active: Explore indices, stocks, and crypto benchmarks right below in the live dashboard!
                </div>
                <button
                  onClick={() => setInfoModal(null)}
                  className="w-full py-2 bg-[#131722] text-white font-semibold rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
