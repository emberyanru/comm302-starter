import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  const modalContent: Record<string, string> = {
    'Terms of use':
      'TradingView Markets Hub provides market data for educational and personal analysis purposes. All automated or programmatic trading actions simulated in this interface are demo models.',
    'Privacy policy':
      'Your privacy is respected. No personal financial information or credentials are transmitted or stored without your explicit authorization. Watchlist settings remain on your local client device.',
    Cookies:
      'We use cookies and localStorage strictly to remember your interface preferences, selected timeframe settings, and starred watchlist assets.',
    Disclaimers:
      'Select market data provided by ICE Data Services. Quotes delayed by at least 15 minutes unless real-time simulated feed is activated. Market commentary and pricing indicators do not constitute financial advice.',
  };

  return (
    <>
      <footer className="border-t border-[#E0E3EB] bg-white mt-auto text-xs text-[#787B86] py-8">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            Select market data provided by ICE Data Services. Quotes delayed by at least 15 min.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#131722] font-medium">
            <button
              onClick={() => setModalTitle('Terms of use')}
              className="hover:text-[#2962FF] transition cursor-pointer"
            >
              Terms of use
            </button>
            <button
              onClick={() => setModalTitle('Privacy policy')}
              className="hover:text-[#2962FF] transition cursor-pointer"
            >
              Privacy policy
            </button>
            <button
              onClick={() => setModalTitle('Cookies')}
              className="hover:text-[#2962FF] transition cursor-pointer"
            >
              Cookies
            </button>
            <button
              onClick={() => setModalTitle('Disclaimers')}
              className="hover:text-[#2962FF] transition cursor-pointer"
            >
              Disclaimers
            </button>
            <span className="text-[#787B86]">© 2026 TradingView</span>
          </div>
        </div>
      </footer>

      {modalTitle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setModalTitle(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E0E3EB]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#131722]">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="text-[#787B86] hover:text-[#131722]"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-[#787B86] leading-relaxed mb-6">
              {modalContent[modalTitle]}
            </p>
            <button
              onClick={() => setModalTitle(null)}
              className="w-full py-2 bg-[#131722] text-white rounded-lg text-xs font-semibold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
