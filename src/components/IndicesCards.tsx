import React from 'react';
import { AssetData } from '../data/marketData';

interface IndicesCardsProps {
  indices: AssetData[];
  onSelectIndex: (asset: AssetData) => void;
  lastUpdatedSymbols?: Record<string, 'up' | 'down'>;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  indices,
  onSelectIndex,
  lastUpdatedSymbols = {},
}) => {
  return (
    <section data-purpose="indices-cards" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onSelectIndex(indices[0])}
          className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962FF] transition group"
        >
          <span>Indices</span>
          <svg
            className="w-6 h-6 transform group-hover:translate-x-1 transition duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-[#787B86] font-medium">Regular market hours</span>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((item) => {
          const isPositive = item.changePercent >= 0;
          const flashState = lastUpdatedSymbols[item.symbol];

          // Dynamic sparkline path coordinates
          const sparklineData = item.sparkline || [10, 12, 11, 14, 13, 16];
          const min = Math.min(...sparklineData);
          const max = Math.max(...sparklineData);
          const range = max - min || 1;
          const points = sparklineData.map((val, idx) => {
            const x = (idx / (sparklineData.length - 1)) * 100;
            const y = 23 - ((val - min) / range) * 20;
            return `${x},${y.toFixed(1)}`;
          }).join(' ');

          return (
            <article
              key={item.symbol}
              onClick={() => onSelectIndex(item)}
              className={`p-4 rounded-xl border border-[#E0E3EB] hover:shadow-md transition-all duration-200 bg-white cursor-pointer relative group flex flex-col justify-between ${
                flashState === 'up' ? 'flash-up' : flashState === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center tracking-tighter shadow-xs shrink-0"
                    style={{ backgroundColor: item.badgeColor || '#2563EB' }}
                  >
                    {item.badgeText || item.symbol}
                  </span>
                  <div>
                    <h2 className="font-bold text-base text-[#131722] leading-tight group-hover:text-[#2962FF] transition">
                      {item.name}
                    </h2>
                    <span className="text-xs text-[#787B86] uppercase">{item.shortName || item.symbol}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold tabular-nums ${
                    isPositive ? 'bg-[#E6F4F1] text-[#089981]' : 'bg-[#FDE8E9] text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Sparkline Chart */}
              <div className="h-10 my-2">
                <svg
                  className="w-full h-full fill-none"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 25"
                >
                  <polyline
                    points={points}
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Price & Dollar Change */}
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold tabular-nums text-[#131722]">
                  {item.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-xs font-medium tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.change.toFixed(2)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
