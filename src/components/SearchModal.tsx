import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight, CornerDownLeft } from 'lucide-react';
import { ALL_ASSETS, AssetData } from '../data/marketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: AssetData) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'us-stocks' | 'crypto' | 'indices' | 'forex' | 'futures'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredAssets = ALL_ASSETS.filter((item) => {
    const matchesCategory =
      activeTab === 'all'
        ? true
        : activeTab === 'indices'
        ? item.category === 'indices' || item.category === 'world-stocks'
        : item.category === activeTab;

    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      item.symbol.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.exchange.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredAssets.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredAssets.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredAssets[selectedIndex]) {
          onSelectAsset(filteredAssets[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredAssets, selectedIndex, onSelectAsset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbol, company name, or index (e.g. NVDA, AAPL, BTC)..."
            className="w-full text-base font-medium text-[#131722] placeholder:text-[#787B86] outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#F0F3FA] rounded-md text-[#787B86]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-[#787B86] bg-[#F0F3FA] rounded border border-[#E0E3EB]">
            ESC
          </kbd>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 border-b border-[#E0E3EB] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#F9FAFC]">
          {[
            { id: 'all', label: 'All' },
            { id: 'us-stocks', label: 'Stocks' },
            { id: 'indices', label: 'Indices' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'futures', label: 'Futures & Commodities' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3EB]/50 p-2">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#787B86]">
              <Search className="w-8 h-8 mx-auto mb-2 text-[#787B86]/60" />
              No matching symbols found for "<span className="font-semibold text-[#131722]">{query}</span>"
            </div>
          ) : (
            filteredAssets.map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = asset.changePercent >= 0;

              return (
                <div
                  key={`${asset.symbol}-${idx}`}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-[#F0F3FA]' : 'hover:bg-[#F0F3FA]/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Badge / Flag */}
                    {asset.flagEmoji ? (
                      <span className="text-xl shrink-0 w-8 h-8 flex items-center justify-center bg-[#F0F3FA] rounded-full">
                        {asset.flagEmoji}
                      </span>
                    ) : (
                      <span
                        className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: asset.badgeColor || '#2563EB' }}
                      >
                        {asset.badgeText || asset.symbol.slice(0, 2)}
                      </span>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#131722] text-sm">{asset.symbol}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[#E0E3EB] text-[#787B86] font-medium uppercase">
                          {asset.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-xs sm:max-w-md">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#131722] tabular-nums">
                        {asset.category === 'forex' || asset.price < 5
                          ? asset.price.toFixed(4)
                          : asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {isSelected && (
                      <div className="hidden sm:flex items-center text-[#2962FF] text-xs font-semibold gap-1">
                        <span>Open</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 bg-[#F9FAFC] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#787B86]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded text-[10px]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded text-[10px]">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#E0E3EB] rounded text-[10px]">↵</kbd> Select
            </span>
          </div>
          <span>Showing {filteredAssets.length} symbols</span>
        </div>
      </div>
    </div>
  );
};
