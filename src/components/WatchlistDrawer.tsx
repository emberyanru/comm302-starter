import React from 'react';
import { X, Star, Trash2, ArrowUpRight } from 'lucide-react';
import { ALL_ASSETS, AssetData } from '../data/marketData';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  onRemove: (symbol: string) => void;
  onSelectAsset: (asset: AssetData) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  onRemove,
  onSelectAsset,
}) => {
  if (!isOpen) return null;

  const watchlistItems = ALL_ASSETS.filter((a) => watchlistSymbols.includes(a.symbol));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl border-l border-[#E0E3EB] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-base text-[#131722]">My Watchlist</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#F0F3FA] text-xs font-semibold text-[#787B86]">
              {watchlistSymbols.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3EB]/50 p-2">
          {watchlistItems.length === 0 ? (
            <div className="py-16 text-center text-[#787B86] text-xs space-y-2">
              <Star className="w-8 h-8 mx-auto text-[#E0E3EB]" />
              <p className="font-semibold text-sm text-[#131722]">Your watchlist is empty</p>
              <p>Click the star icon on any asset or chart to monitor live prices here.</p>
            </div>
          ) : (
            watchlistItems.map((item) => {
              const isPositive = item.changePercent >= 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectAsset(item);
                    onClose();
                  }}
                  className="p-3 rounded-xl hover:bg-[#F0F3FA] cursor-pointer flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-2.5">
                    {item.flagEmoji ? (
                      <span className="text-xl">{item.flagEmoji}</span>
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full text-white font-bold text-[10px] flex items-center justify-center"
                        style={{ backgroundColor: item.badgeColor || '#2563EB' }}
                      >
                        {item.badgeText || item.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-[#131722] text-sm group-hover:text-[#2962FF] transition flex items-center gap-1">
                        {item.symbol}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="text-[11px] text-[#787B86] truncate max-w-[130px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-xs sm:text-sm text-[#131722] tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.symbol);
                      }}
                      className="p-1 text-[#787B86] hover:text-[#F23645] opacity-70 group-hover:opacity-100 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-[#E0E3EB] bg-[#F9FAFC] text-center">
          <p className="text-[11px] text-[#787B86]">
            Watchlist automatically saved to your local browser session.
          </p>
        </div>
      </div>
    </div>
  );
};
