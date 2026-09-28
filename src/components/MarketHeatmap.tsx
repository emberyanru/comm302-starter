import React, { useState } from 'react';
import { AssetData } from '../data/marketData';

interface StockHeatmapBlock {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number; // in Billions USD
  changePercent: number;
  price: number;
}

const HEATMAP_STOCKS: StockHeatmapBlock[] = [
  // Technology
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Semiconductors', marketCap: 3390, changePercent: 2.84, price: 138.25 },
  { symbol: 'AAPL', name: 'Apple', sector: 'Consumer Electronics', marketCap: 3410, changePercent: 0.62, price: 224.50 },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Software - Infrastructure', marketCap: 3180, changePercent: -0.35, price: 428.15 },
  { symbol: 'GOOGL', name: 'Alphabet', sector: 'Internet Content', marketCap: 2080, changePercent: 1.45, price: 172.60 },
  { symbol: 'AMZN', name: 'Amazon', sector: 'Internet Retail', marketCap: 1940, changePercent: 1.15, price: 186.40 },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Internet Content', marketCap: 1480, changePercent: 1.92, price: 588.20 },
  { symbol: 'AVGO', name: 'Broadcom', sector: 'Semiconductors', marketCap: 780, changePercent: 2.10, price: 168.30 },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Auto Manufacturers', marketCap: 794, changePercent: 3.42, price: 248.98 },
  { symbol: 'AMD', name: 'Adv. Micro Devices', sector: 'Semiconductors', marketCap: 230, changePercent: 1.88, price: 142.10 },
  { symbol: 'ORCL', name: 'Oracle', sector: 'Software - Infrastructure', marketCap: 480, changePercent: 0.85, price: 174.50 },
  // Financial
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', marketCap: 680, changePercent: 0.42, price: 236.40 },
  { symbol: 'V', name: 'Visa', sector: 'Financial', marketCap: 560, changePercent: 0.28, price: 298.10 },
  { symbol: 'MA', name: 'Mastercard', sector: 'Financial', marketCap: 450, changePercent: -0.15, price: 512.60 },
  // Healthcare
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare', marketCap: 740, changePercent: -1.24, price: 782.40 },
  { symbol: 'UNH', name: 'UnitedHealth', sector: 'Healthcare', marketCap: 540, changePercent: -0.80, price: 586.20 },
  // Energy & Industrials
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', marketCap: 470, changePercent: -0.92, price: 118.50 },
  { symbol: 'CAT', name: 'Caterpillar', sector: 'Industrials', marketCap: 190, changePercent: 0.74, price: 395.20 },
  { symbol: 'GE', name: 'GE Aerospace', sector: 'Industrials', marketCap: 200, changePercent: 1.12, price: 185.90 },
];

interface MarketHeatmapProps {
  onSelectStock: (asset: AssetData) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ onSelectStock }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'green' | 'red'>('all');

  const filtered = HEATMAP_STOCKS.filter((item) => {
    if (activeTab === 'tech') return item.sector.includes('Semiconductors') || item.sector.includes('Software') || item.sector.includes('Internet') || item.sector.includes('Consumer Electronics');
    if (activeTab === 'green') return item.changePercent > 0;
    if (activeTab === 'red') return item.changePercent < 0;
    return true;
  });

  const getHeatmapColor = (change: number) => {
    if (change >= 3) return 'bg-[#089981] text-white';
    if (change >= 1.5) return 'bg-[#0eac93] text-white';
    if (change > 0) return 'bg-[#26a69a] text-white';
    if (change === 0) return 'bg-gray-500 text-white';
    if (change > -1.5) return 'bg-[#ef5350] text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10" data-purpose="market-heatmap">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-[#131722]">Stock Market Heatmap</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#F0F3FA] text-[#787B86] font-semibold uppercase">
              S&P 500 Leaders
            </span>
          </div>
          <p className="text-xs text-[#787B86]">Interactive visualization sized by market capitalization & colored by performance</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F0F3FA] p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition ${activeTab === 'all' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
          >
            All Sectors
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`px-3 py-1 rounded-md transition ${activeTab === 'tech' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
          >
            Mega Tech
          </button>
          <button
            onClick={() => setActiveTab('green')}
            className={`px-3 py-1 rounded-md transition ${activeTab === 'green' ? 'bg-white text-[#089981] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
          >
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('red')}
            className={`px-3 py-1 rounded-md transition ${activeTab === 'red' ? 'bg-white text-[#F23645] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
          >
            Decliners
          </button>
        </div>
      </div>

      {/* Heatmap Grid - Responsive proportional layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 min-h-[300px]">
        {filtered.map((stock) => {
          // Approximate size weighting
          const isLarge = stock.marketCap >= 2000;
          const isMedium = stock.marketCap >= 700 && stock.marketCap < 2000;
          const colSpan = isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-1 sm:col-span-2 row-span-1' : 'col-span-1 row-span-1';

          return (
            <div
              key={stock.symbol}
              onClick={() => {
                onSelectStock({
                  symbol: stock.symbol,
                  name: stock.name,
                  shortName: `${stock.symbol} • ${stock.sector}`,
                  category: 'us-stocks',
                  price: stock.price,
                  change: Number(((stock.price * stock.changePercent) / 100).toFixed(2)),
                  changePercent: stock.changePercent,
                  volume: `${(stock.marketCap / 50).toFixed(1)}M`,
                  sparkline: [stock.price * 0.98, stock.price * 0.99, stock.price],
                  badgeText: stock.symbol.slice(0, 2),
                  badgeColor: stock.changePercent >= 0 ? '#089981' : '#F23645',
                  exchange: 'NASDAQ / NYSE',
                  open: Number((stock.price * 0.995).toFixed(2)),
                  previousClose: Number((stock.price / (1 + stock.changePercent / 100)).toFixed(2)),
                  dayHigh: Number((stock.price * 1.01).toFixed(2)),
                  dayLow: Number((stock.price * 0.985).toFixed(2)),
                  yearHigh: Number((stock.price * 1.25).toFixed(2)),
                  yearLow: Number((stock.price * 0.75).toFixed(2)),
                  marketCap: `$${stock.marketCap}B`,
                  history: []
                });
              }}
              className={`${colSpan} ${getHeatmapColor(stock.changePercent)} rounded-lg p-3 cursor-pointer flex flex-col justify-between hover:opacity-90 hover:scale-[1.01] transition-transform duration-150 shadow-xs relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`font-black tracking-tight ${isLarge ? 'text-lg sm:text-xl' : 'text-sm'}`}>
                    {stock.symbol}
                  </div>
                  <div className={`opacity-85 truncate max-w-[120px] ${isLarge ? 'text-xs' : 'text-[11px]'}`}>
                    {stock.name}
                  </div>
                </div>
                <div className="text-[10px] font-semibold opacity-75 hidden sm:block">
                  ${stock.marketCap}B
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div className={`font-extrabold tabular-nums ${isLarge ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'}`}>
                  {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
                <div className={`tabular-nums opacity-90 ${isLarge ? 'text-xs sm:text-sm' : 'text-[11px]'}`}>
                  ${stock.price.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E0E3EB] text-xs text-[#787B86]">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#131722]">Performance Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-5 h-3.5 bg-[#F23645] rounded-xs inline-block text-[9px] text-white text-center font-bold">-3%</span>
            <span className="w-5 h-3.5 bg-[#ef5350] rounded-xs inline-block text-[9px] text-white text-center font-bold">-1%</span>
            <span className="w-5 h-3.5 bg-gray-400 rounded-xs inline-block text-[9px] text-white text-center font-bold">0%</span>
            <span className="w-5 h-3.5 bg-[#26a69a] rounded-xs inline-block text-[9px] text-white text-center font-bold">+1%</span>
            <span className="w-5 h-3.5 bg-[#089981] rounded-xs inline-block text-[9px] text-white text-center font-bold">+3%</span>
          </div>
        </div>
        <div>
          Click any block to inspect full interactive charts & execute trades
        </div>
      </div>
    </section>
  );
};
