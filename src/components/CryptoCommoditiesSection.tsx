import React, { useState } from 'react';
import { AssetData } from '../data/marketData';

interface CryptoCommoditiesProps {
  assets: AssetData[];
  onSelectAsset: (asset: AssetData) => void;
  lastUpdatedSymbols?: Record<string, 'up' | 'down'>;
}

export const CryptoCommoditiesSection: React.FC<CryptoCommoditiesProps> = ({
  assets,
  onSelectAsset,
  lastUpdatedSymbols = {},
}) => {
  const [filter, setFilter] = useState<'all' | 'crypto' | 'commodities'>('all');

  const filteredAssets = assets.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'crypto') return item.category === 'crypto';
    if (filter === 'commodities') return item.category === 'futures';
    return true;
  });

  // Default to showing 4 primary cards in standard grid
  const displayItems = filteredAssets.slice(0, 4);

  return (
    <section
      className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10"
      data-purpose="crypto-commodities"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-xl text-[#131722]">Crypto & Commodities Leaders</h3>
          <p className="text-xs text-[#787B86]">Real-time global asset benchmarks</p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              filter === 'all'
                ? 'bg-[#131722] text-white shadow-xs'
                : 'bg-[#F0F3FA] text-[#131722] hover:bg-gray-200'
            }`}
          >
            All assets
          </button>
          <button
            onClick={() => setFilter('crypto')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              filter === 'crypto'
                ? 'bg-[#131722] text-white shadow-xs'
                : 'bg-[#F0F3FA] text-[#131722] hover:bg-gray-200'
            }`}
          >
            Cryptocurrency
          </button>
          <button
            onClick={() => setFilter('commodities')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              filter === 'commodities'
                ? 'bg-[#131722] text-white shadow-xs'
                : 'bg-[#F0F3FA] text-[#131722] hover:bg-gray-200'
            }`}
          >
            Commodities
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayItems.map((item) => {
          const isPositive = item.changePercent >= 0;
          const flashState = lastUpdatedSymbols[item.symbol];

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectAsset(item)}
              className={`p-3.5 rounded-lg border border-[#E0E3EB] hover:border-[#2962FF]/40 hover:shadow-xs transition bg-white cursor-pointer ${
                flashState === 'up' ? 'flash-up' : flashState === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs"
                  style={{
                    backgroundColor: item.badgeColor || '#2563EB',
                    color: item.symbol.includes('XAU') ? '#000000' : '#FFFFFF',
                  }}
                >
                  {item.badgeText || item.symbol.slice(0, 2)}
                </span>
                <span className="font-bold text-[#131722] text-sm truncate">{item.name}</span>
              </div>

              <div className="text-lg font-bold tabular-nums text-[#131722]">
                ${item.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <div
                className={`text-xs font-medium tabular-nums mt-0.5 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? '+' : ''}
                {item.changePercent.toFixed(2)}% • {isPositive ? '+' : ''}$
                {Math.abs(item.change).toLocaleString('en-US', { minimumFractionDigits: item.price < 50 ? 2 : 0, maximumFractionDigits: 2 })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
