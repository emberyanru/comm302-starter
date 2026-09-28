import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { HeroSection } from './components/HeroSection';
import { CategoryPills, CategoryType } from './components/CategoryPills';
import { IndicesCards } from './components/IndicesCards';
import { ActiveStocksTable } from './components/ActiveStocksTable';
import { WorldIndicesTable } from './components/WorldIndicesTable';
import { CryptoCommoditiesSection } from './components/CryptoCommoditiesSection';
import { MarketHeatmap } from './components/MarketHeatmap';
import { MarketNews } from './components/MarketNews';
import { CommunityIdeasSection } from './components/CommunityIdeasSection';
import { EconomicCalendar } from './components/EconomicCalendar';
import { ChartModal } from './components/ChartModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';
import {
  TOP_INDICES,
  ACTIVE_STOCKS,
  WORLD_INDICES,
  CRYPTO_COMMODITIES,
  FOREX_PAIRS,
  BONDS_DATA,
  ETFS_DATA,
  AssetData,
  ALL_ASSETS,
} from './data/marketData';

export default function App() {
  const [topIndices, setTopIndices] = useState<AssetData[]>(TOP_INDICES);
  const [activeStocks, setActiveStocks] = useState(ACTIVE_STOCKS);
  const [worldIndices, setWorldIndices] = useState<AssetData[]>(WORLD_INDICES);
  const [cryptoCommodities, setCryptoCommodities] = useState<AssetData[]>(CRYPTO_COMMODITIES);
  const [forexPairs, setForexPairs] = useState<AssetData[]>(FOREX_PAIRS);
  const [bonds, setBonds] = useState<AssetData[]>(BONDS_DATA);
  const [etfs, setEtfs] = useState<AssetData[]>(ETFS_DATA);

  const [activeCategory, setActiveCategory] = useState<CategoryType>('indices');
  const [region, setRegion] = useState('global');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [lastUpdatedSymbols, setLastUpdatedSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Local storage for watchlist
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'BTC/USD', 'SPX'];
    } catch {
      return ['NVDA', 'AAPL', 'BTC/USD', 'SPX'];
    }
  });

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlistSymbols((prev) => {
      const updated = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(updated));
      } catch (e) {
        console.error('LocalStorage write error', e);
      }
      return updated;
    });
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market feed simulation
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      // Pick 1-2 random assets across all categories to update
      const allPickable = [
        ...topIndices,
        ...activeStocks.volume,
        ...worldIndices,
        ...cryptoCommodities,
      ];
      const target = allPickable[Math.floor(Math.random() * allPickable.length)];
      if (!target) return;

      const deltaPercent = (Math.random() - 0.49) * 0.18; // -0.09% to +0.09%
      const priceDelta = target.price * (deltaPercent / 100);
      const newPrice = Math.max(0.01, Number((target.price + priceDelta).toFixed(2)));
      const newChange = Number((target.change + priceDelta).toFixed(2));
      const newChangePercent = Number(
        (((newPrice - target.previousClose) / target.previousClose) * 100).toFixed(2)
      );
      const direction: 'up' | 'down' = priceDelta >= 0 ? 'up' : 'down';

      // Update flash indicator
      setLastUpdatedSymbols((prev) => ({ ...prev, [target.symbol]: direction }));
      setTimeout(() => {
        setLastUpdatedSymbols((prev) => {
          const next = { ...prev };
          delete next[target.symbol];
          return next;
        });
      }, 1000);

      // Update in corresponding array
      const updateFn = (item: AssetData): AssetData =>
        item.symbol === target.symbol
          ? {
              ...item,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              sparkline: [...item.sparkline.slice(1), newPrice],
            }
          : item;

      setTopIndices((prev) => prev.map(updateFn));
      setActiveStocks((prev) => ({
        ...prev,
        volume: prev.volume.map(updateFn),
        gainers: prev.gainers.map(updateFn),
        losers: prev.losers.map(updateFn),
      }));
      setWorldIndices((prev) => prev.map(updateFn));
      setCryptoCommodities((prev) => prev.map(updateFn));

      // Also update selectedAsset if open
      setSelectedAsset((curr) => (curr && curr.symbol === target.symbol ? updateFn(curr) : curr));
    }, 2400);

    return () => clearInterval(interval);
  }, [liveUpdates, topIndices, activeStocks, worldIndices, cryptoCommodities]);

  const handleSelectSymbolByName = (symbol: string) => {
    const found = ALL_ASSETS.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      setSelectedAsset(found);
    }
  };

  const tickerItems = [
    ...topIndices,
    ...cryptoCommodities.slice(0, 3),
    ...activeStocks.volume.slice(0, 2),
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-sm selection:bg-blue-100 bg-white text-[#131722]">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistSymbols.length}
        liveUpdates={liveUpdates}
        onToggleLive={() => setLiveUpdates(!liveUpdates)}
        onSelectNav={(item) => {
          if (item === 'Markets') {
            setActiveCategory('indices');
            setRegion('global');
          }
        }}
        activeNav="Markets"
      />

      {/* Real-time Ticker Tape Marquee */}
      <TickerTape
        items={tickerItems}
        onSelectItem={(item) => setSelectedAsset(item)}
      />

      {/* Hero Headline Section */}
      <HeroSection currentRegion={region} onSelectRegion={(r) => setRegion(r)} />

      {/* Category Navigation Pills */}
      <CategoryPills
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Main Content Viewport */}
      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 flex-1 w-full space-y-10 pb-16">
        {/* Top Key Indices Highlight Cards */}
        <IndicesCards
          indices={topIndices}
          onSelectIndex={(item) => setSelectedAsset(item)}
          lastUpdatedSymbols={lastUpdatedSymbols}
        />

        {/* Alternate Category Views if user clicked other pills (e.g. Forex, Bonds, ETFs, Economy) */}
        {activeCategory === 'forex' && (
          <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#131722]">Foreign Exchange (Forex)</h3>
                <p className="text-xs text-[#787B86]">Major currency pair crosses</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {forexPairs.map((pair) => (
                <div
                  key={pair.symbol}
                  onClick={() => setSelectedAsset(pair)}
                  className="p-3.5 rounded-lg border border-[#E0E3EB] hover:border-[#2962FF]/40 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{pair.flagEmoji}</span>
                    <span className="font-bold text-sm">{pair.symbol}</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{pair.price.toFixed(4)}</div>
                  <div
                    className={`text-xs font-semibold mt-0.5 tabular-nums ${
                      pair.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {pair.changePercent >= 0 ? '+' : ''}
                    {pair.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeCategory === 'bonds' && (
          <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#131722]">Government Bond Yields</h3>
                <p className="text-xs text-[#787B86]">Sovereign 10-year and 2-year sovereign debt benchmarks</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bonds.map((bond) => (
                <div
                  key={bond.symbol}
                  onClick={() => setSelectedAsset(bond)}
                  className="p-3.5 rounded-lg border border-[#E0E3EB] hover:border-[#2962FF]/40 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{bond.flagEmoji}</span>
                    <span className="font-bold text-sm">{bond.name}</span>
                  </div>
                  <div className="text-lg font-bold tabular-nums">{bond.price.toFixed(3)}%</div>
                  <div
                    className={`text-xs font-semibold mt-0.5 tabular-nums ${
                      bond.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {bond.change >= 0 ? '+' : ''}
                    {bond.change.toFixed(3)} pts ({bond.changePercent.toFixed(2)}%)
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeCategory === 'etfs' && (
          <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#131722]">Exchange Traded Funds (ETFs)</h3>
                <p className="text-xs text-[#787B86]">Most actively traded index & volatility trackers</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {etfs.map((etf) => (
                <div
                  key={etf.symbol}
                  onClick={() => setSelectedAsset(etf)}
                  className="p-3.5 rounded-lg border border-[#E0E3EB] hover:border-[#2962FF]/40 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#131722]">{etf.symbol}</span>
                    <span className="text-xs text-[#787B86]">{etf.exchange}</span>
                  </div>
                  <div className="text-xs text-[#787B86] mb-1">{etf.name}</div>
                  <div className="text-lg font-bold tabular-nums">${etf.price.toFixed(2)}</div>
                  <div
                    className={`text-xs font-semibold mt-0.5 tabular-nums ${
                      etf.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {etf.changePercent >= 0 ? '+' : ''}
                    {etf.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dense Two-Column Market Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ActiveStocksTable
            stocksData={activeStocks}
            onSelectStock={(item) => setSelectedAsset(item)}
            lastUpdatedSymbols={lastUpdatedSymbols}
          />
          <WorldIndicesTable
            indices={worldIndices}
            onSelectIndex={(item) => setSelectedAsset(item)}
            lastUpdatedSymbols={lastUpdatedSymbols}
          />
        </div>

        {/* Crypto & Commodities Quick View Section */}
        <CryptoCommoditiesSection
          assets={cryptoCommodities}
          onSelectAsset={(item) => setSelectedAsset(item)}
          lastUpdatedSymbols={lastUpdatedSymbols}
        />

        {/* Stock Market Heatmap Section */}
        <MarketHeatmap onSelectStock={(stock) => setSelectedAsset(stock)} />

        {/* Market News & Top Stories Section */}
        <MarketNews onSelectSymbol={handleSelectSymbolByName} />

        {/* Community Trade Ideas & Technical Analysis Section */}
        <CommunityIdeasSection onSelectSymbol={handleSelectSymbolByName} />

        {/* Economic Calendar Section */}
        <EconomicCalendar />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Symbol Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* Detailed Interactive Chart Modal */}
      <ChartModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={selectedAsset ? watchlistSymbols.includes(selectedAsset.symbol) : false}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        onRemove={toggleWatchlist}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />
    </div>
  );
}
