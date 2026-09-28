import React, { useState } from 'react';
import { Clock, ExternalLink, Bookmark, Sparkles } from 'lucide-react';
import { AssetData } from '../data/marketData';

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  category: 'Breaking' | 'Stocks' | 'Crypto' | 'Economy' | 'Forex';
  relatedSymbol?: string;
  summary: string;
}

const MARKET_NEWS: NewsItem[] = [
  {
    id: 'n1',
    headline: 'NVIDIA accelerates AI server chip shipments amid surging hyperscaler compute demand',
    source: 'Bloomberg Markets',
    timeAgo: '12m ago',
    category: 'Stocks',
    relatedSymbol: 'NVDA',
    summary: 'Cloud providers increase capital expenditure for Blackwell infrastructure with order backlogs extending through 2026.'
  },
  {
    id: 'n2',
    headline: 'Federal Reserve policymakers signal measured approach to rate cuts as inflation stabilizes',
    source: 'Reuters Financial',
    timeAgo: '28m ago',
    category: 'Economy',
    relatedSymbol: 'SPX',
    summary: 'Treasury yields tick lower after minutes reveal confidence in achieving sustainable 2% target.'
  },
  {
    id: 'n3',
    headline: 'Bitcoin tests $95,000 threshold as institutional ETF weekly inflows exceed $2.4B',
    source: 'CoinDesk',
    timeAgo: '45m ago',
    category: 'Crypto',
    relatedSymbol: 'BTC/USD',
    summary: 'Sustained spot ETF net creations and corporate treasury purchases propel global digital asset sentiment.'
  },
  {
    id: 'n4',
    headline: 'European indices advance as DAX reaches new record high on export earnings surprise',
    source: 'Financial Times',
    timeAgo: '1h ago',
    category: 'Breaking',
    relatedSymbol: 'DAX',
    summary: 'German engineering and industrial components beat quarterly projections, lifting the Stoxx 600 benchmark.'
  },
  {
    id: 'n5',
    headline: 'Crude oil remains pressured near $71 as OPEC+ clarifies production increase schedule',
    source: 'WSJ Markets',
    timeAgo: '2h ago',
    category: 'Economy',
    relatedSymbol: 'CL1!',
    summary: 'Global supply balance forecasts indicate steady reserves buildup ahead of next quarter.'
  }
];

interface MarketNewsProps {
  onSelectSymbol?: (symbol: string) => void;
}

export const MarketNews: React.FC<MarketNewsProps> = ({ onSelectSymbol }) => {
  const [filter, setFilter] = useState<'all' | 'Stocks' | 'Crypto' | 'Economy'>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const filteredNews = MARKET_NEWS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <>
      <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10" data-purpose="market-news">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-[#131722]">Market News & Top Stories</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
              </span>
            </div>
            <p className="text-xs text-[#787B86]">Real-time coverage and breaking market headlines</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F0F3FA] p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
            {(['all', 'Stocks', 'Crypto', 'Economy'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-md transition ${filter === cat ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
              >
                {cat === 'all' ? 'All Stories' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="p-4 rounded-xl border border-[#E0E3EB] hover:border-[#2962FF]/40 hover:shadow-xs transition bg-white flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.category === 'Breaking' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F0F3FA] text-[#2962FF]'}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#787B86]">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeAgo}</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition leading-snug line-clamp-2">
                  {item.headline}
                </h4>
                <p className="text-xs text-[#787B86] mt-2 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E0E3EB]/70 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#131722]">{item.source}</span>
                {item.relatedSymbol && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectSymbol) onSelectSymbol(item.relatedSymbol!);
                    }}
                    className="font-bold text-[#2962FF] hover:underline bg-blue-50 px-2 py-0.5 rounded text-[11px]"
                  >
                    ${item.relatedSymbol}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#E0E3EB]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#2962FF] uppercase bg-blue-50 px-2 py-0.5 rounded">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#787B86]">• {selectedArticle.source}</span>
                <span className="text-xs text-[#787B86]">• {selectedArticle.timeAgo}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#787B86] hover:text-[#131722] text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#131722] mb-3 leading-snug">
              {selectedArticle.headline}
            </h3>

            <div className="p-4 bg-[#F9FAFC] rounded-xl text-xs sm:text-sm text-[#131722] leading-relaxed mb-4 border border-[#E0E3EB]">
              {selectedArticle.summary}
              <p className="mt-3 text-[#787B86]">
                Institutional desk flows and order books report steady liquidity depth across major trading venues.
                Technical analysts continue to monitor volume confirmation along benchmark moving averages.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E0E3EB]">
              {selectedArticle.relatedSymbol && (
                <button
                  onClick={() => {
                    const sym = selectedArticle.relatedSymbol!;
                    setSelectedArticle(null);
                    if (onSelectSymbol) onSelectSymbol(sym);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2962FF] hover:bg-[#1E53E5] transition"
                >
                  View {selectedArticle.relatedSymbol} Chart
                </button>
              )}
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[#131722] hover:bg-[#F0F3FA] transition ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
