import React from 'react';
import { AssetData } from '../data/marketData';

interface TickerTapeProps {
  items: AssetData[];
  onSelectItem: (item: AssetData) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ items, onSelectItem }) => {
  // Duplicate array for seamless infinite marquee scroll
  const marqueeItems = [...items, ...items];

  return (
    <div className="w-full bg-[#FAFBFC] border-b border-[#E0E3EB] overflow-hidden py-1.5 px-2 select-none">
      <div className="flex items-center gap-6 whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
        {marqueeItems.map((item, idx) => {
          const isPos = item.changePercent >= 0;
          return (
            <div
              key={`${item.symbol}-${idx}`}
              onClick={() => onSelectItem(item)}
              className="inline-flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-0.5 rounded transition text-xs font-medium"
            >
              <span className="font-bold text-[#131722]">{item.symbol}</span>
              <span className="tabular-nums font-semibold text-[#131722]">
                {item.category === 'forex' ? item.price.toFixed(4) : item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`tabular-nums text-[11px] font-bold ${
                  isPos ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
