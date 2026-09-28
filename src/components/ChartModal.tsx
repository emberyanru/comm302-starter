import React, { useState } from 'react';
import { X, Star, TrendingUp, TrendingDown, BarChart2, CandlestickChart, Bell, Share2, Check } from 'lucide-react';
import { AssetData } from '../data/marketData';

interface ChartModalProps {
  asset: AssetData | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

export const ChartModal: React.FC<ChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [showMA20, setShowMA20] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  if (!asset) return null;

  const isPositive = asset.changePercent >= 0;
  const history = asset.history || [];

  // Generate SVG path for area/line chart
  const minPrice = Math.min(...history.map((h) => h.low));
  const maxPrice = Math.max(...history.map((h) => h.high));
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 20;
  const paddingY = 30;
  const chartHeight = svgHeight - paddingY * 2;
  const chartWidth = svgWidth - paddingX * 2;

  const points = history.map((pt, index) => {
    const x = paddingX + (index / (history.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((pt.close - minPrice) / priceRange) * chartHeight;
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${svgHeight - paddingY} L ${
    points[0]?.x || 0
  } ${svgHeight - paddingY} Z`;

  // Moving average line (MA 20)
  const ma20Points = points.map((p, idx) => {
    const slice = points.slice(Math.max(0, idx - 4), idx + 1);
    const avgClose = slice.reduce((sum, item) => sum + item.close, 0) / slice.length;
    const y = paddingY + chartHeight - ((avgClose - minPrice) / priceRange) * chartHeight;
    return { x: p.x, y };
  });
  const ma20D = ma20Points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const currentHover = hoveredPoint || points[points.length - 1];

  const handleSimulateTrade = (action: 'BUY' | 'SELL') => {
    setTradeMessage(`Simulated ${action} executed for 10 units of ${asset.symbol} @ $${asset.price.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#E0E3EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {asset.flagEmoji ? (
              <span className="text-2xl">{asset.flagEmoji}</span>
            ) : (
              <div
                className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs"
                style={{ backgroundColor: asset.badgeColor || '#2563EB' }}
              >
                {asset.badgeText || asset.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#131722]">{asset.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F0F3FA] text-[#787B86] font-semibold uppercase">
                  {asset.exchange}
                </span>
                <span className="text-xs text-[#787B86] font-medium hidden sm:inline">
                  • {asset.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#787B86]">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`p-2 rounded-lg border transition ${
                isWatchlisted
                  ? 'bg-amber-50 border-amber-300 text-amber-500'
                  : 'border-[#E0E3EB] hover:bg-[#F0F3FA] text-[#787B86]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#E0E3EB] hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price & Stat Highlights Bar */}
        <div className="px-6 py-3 bg-[#F9FAFC] border-b border-[#E0E3EB] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-[#131722] tabular-nums">
              {asset.category === 'forex'
                ? currentHover?.close?.toFixed(4) || asset.price.toFixed(4)
                : `$${(currentHover?.close || asset.price).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </span>
            <div
              className={`flex items-center text-sm font-bold tabular-nums ${
                isPositive ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {isPositive ? '+' : ''}
              {asset.change >= 0 ? `$${asset.change.toFixed(2)}` : `-$${Math.abs(asset.change).toFixed(2)}`} (
              {isPositive ? '+' : ''}
              {asset.changePercent.toFixed(2)}%)
            </div>
            {currentHover && (
              <span className="text-xs text-[#787B86] font-medium hidden md:inline">
                Time: {currentHover.time} | O: {currentHover.open} H: {currentHover.high} L: {currentHover.low}
              </span>
            )}
          </div>

          {/* Quick Simulation Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateTrade('BUY')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#089981] hover:bg-[#07856f] transition shadow-xs"
            >
              Buy
            </button>
            <button
              onClick={() => handleSimulateTrade('SELL')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#F23645] hover:bg-[#dc2635] transition shadow-xs"
            >
              Sell
            </button>
          </div>
        </div>

        {tradeMessage && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            {tradeMessage}
          </div>
        )}

        {/* Chart Toolbar */}
        <div className="px-6 py-2.5 border-b border-[#E0E3EB] flex flex-wrap items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-1 bg-[#F0F3FA] p-0.5 rounded-lg">
            {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  timeframe === tf ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#E0E3EB] rounded-lg p-0.5">
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded-md ${
                  chartType === 'area' ? 'bg-[#F0F3FA] text-[#2962FF]' : 'text-[#787B86] hover:text-[#131722]'
                }`}
                title="Area Chart"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`p-1.5 rounded-md ${
                  chartType === 'candles' ? 'bg-[#F0F3FA] text-[#2962FF]' : 'text-[#787B86] hover:text-[#131722]'
                }`}
                title="Candlestick Chart"
              >
                <CandlestickChart className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowMA20(!showMA20)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                showMA20 ? 'bg-blue-50 border-blue-200 text-[#2962FF]' : 'border-[#E0E3EB] text-[#787B86]'
              }`}
            >
              MA 20
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                showVolume ? 'bg-purple-50 border-purple-200 text-purple-600' : 'border-[#E0E3EB] text-[#787B86]'
              }`}
            >
              Vol
            </button>
          </div>
        </div>

        {/* Interactive Chart Canvas View */}
        <div className="relative p-6 bg-white overflow-hidden flex-1 flex flex-col justify-center">
          <div className="relative w-full h-[280px]">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 1, 2, 3].map((i) => {
                const y = paddingY + (i / 3) * chartHeight;
                const priceLevel = maxPrice - (i / 3) * priceRange;
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#E0E3EB"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={svgWidth - paddingX + 6}
                      y={y + 4}
                      fill="#787B86"
                      fontSize="10"
                      className="font-mono tabular-nums"
                    >
                      {priceLevel.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Volume Bars */}
              {showVolume &&
                points.map((pt, idx) => {
                  const maxVol = Math.max(...points.map((p) => p.volume));
                  const barH = (pt.volume / maxVol) * 45;
                  const barW = chartWidth / points.length - 2;
                  const barY = svgHeight - paddingY - barH;
                  const isUp = pt.close >= pt.open;

                  return (
                    <rect
                      key={`vol-${idx}`}
                      x={pt.x - barW / 2}
                      y={barY}
                      width={Math.max(2, barW)}
                      height={barH}
                      fill={isUp ? '#089981' : '#F23645'}
                      opacity="0.28"
                    />
                  );
                })}

              {/* Candlesticks OR Area */}
              {chartType === 'area' ? (
                <>
                  <path d={areaD} fill="url(#chartGradient)" />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              ) : (
                /* Candlestick Render */
                points.map((pt, idx) => {
                  const candleW = Math.max(4, chartWidth / points.length - 3);
                  const isUp = pt.close >= pt.open;
                  const candleColor = isUp ? '#089981' : '#F23645';

                  const topBodyPrice = Math.max(pt.open, pt.close);
                  const bottomBodyPrice = Math.min(pt.open, pt.close);

                  const yHigh = paddingY + chartHeight - ((pt.high - minPrice) / priceRange) * chartHeight;
                  const yLow = paddingY + chartHeight - ((pt.low - minPrice) / priceRange) * chartHeight;
                  const yTop = paddingY + chartHeight - ((topBodyPrice - minPrice) / priceRange) * chartHeight;
                  const yBottom = paddingY + chartHeight - ((bottomBodyPrice - minPrice) / priceRange) * chartHeight;
                  const bodyHeight = Math.max(2, yBottom - yTop);

                  return (
                    <g key={`candle-${idx}`}>
                      {/* Wick */}
                      <line x1={pt.x} y1={yHigh} x2={pt.x} y2={yLow} stroke={candleColor} strokeWidth="1.5" />
                      {/* Body */}
                      <rect
                        x={pt.x - candleW / 2}
                        y={yTop}
                        width={candleW}
                        height={bodyHeight}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })
              )}

              {/* Moving Average 20 */}
              {showMA20 && (
                <path
                  d={ma20D}
                  fill="none"
                  stroke="#2962FF"
                  strokeWidth="1.8"
                  strokeDasharray="2 2"
                  opacity="0.85"
                />
              )}

              {/* Hover Crosshair & Pointer Tracking */}
              {hoveredPoint && (
                <g>
                  <line
                    x1={hoveredPoint.x}
                    y1={paddingY}
                    x2={hoveredPoint.x}
                    y2={svgHeight - paddingY}
                    stroke="#787B86"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={paddingX}
                    y1={hoveredPoint.y}
                    x2={svgWidth - paddingX}
                    y2={hoveredPoint.y}
                    stroke="#787B86"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="5"
                    fill={isPositive ? '#089981' : '#F23645'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Transparent overlay slices for seamless mouse hover */}
              {points.map((pt, idx) => {
                const sliceW = chartWidth / points.length;
                return (
                  <rect
                    key={`slice-${idx}`}
                    x={pt.x - sliceW / 2}
                    y={paddingY}
                    width={sliceW}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredPoint(pt)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Key Statistics Grid */}
        <div className="px-6 py-4 bg-[#F9FAFC] border-t border-[#E0E3EB] shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-[#787B86]">Open</div>
              <div className="font-bold text-[#131722] tabular-nums mt-0.5">${asset.open.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[#787B86]">Previous Close</div>
              <div className="font-bold text-[#131722] tabular-nums mt-0.5">${asset.previousClose.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[#787B86]">Day's Range</div>
              <div className="font-bold text-[#131722] tabular-nums mt-0.5">
                ${asset.dayLow.toFixed(2)} - ${asset.dayHigh.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[#787B86]">52-Week Range</div>
              <div className="font-bold text-[#131722] tabular-nums mt-0.5">
                ${asset.yearLow.toFixed(2)} - ${asset.yearHigh.toFixed(2)}
              </div>
            </div>
            {asset.marketCap && (
              <div>
                <div className="text-[#787B86]">Market Cap</div>
                <div className="font-bold text-[#131722] tabular-nums mt-0.5">{asset.marketCap}</div>
              </div>
            )}
            {asset.volume && (
              <div>
                <div className="text-[#787B86]">Volume</div>
                <div className="font-bold text-[#131722] tabular-nums mt-0.5">{asset.volume}</div>
              </div>
            )}
            {asset.peRatio && (
              <div>
                <div className="text-[#787B86]">P/E Ratio</div>
                <div className="font-bold text-[#131722] tabular-nums mt-0.5">{asset.peRatio}</div>
              </div>
            )}
            <div>
              <div className="text-[#787B86]">Status</div>
              <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Market
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
