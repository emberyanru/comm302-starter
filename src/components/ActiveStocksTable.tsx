import React, { useState } from 'react';
import { AssetData } from '../data/marketData';

interface ActiveStocksTableProps {
  stocksData: {
    volume: AssetData[];
    gainers: AssetData[];
    losers: AssetData[];
  };
  onSelectStock: (asset: AssetData) => void;
  lastUpdatedSymbols?: Record<string, 'up' | 'down'>;
}

export const ActiveStocksTable: React.FC<ActiveStocksTableProps> = ({
  stocksData,
  onSelectStock,
  lastUpdatedSymbols = {},
}) => {
  const [filterTab, setFilterTab] = useState<'volume' | 'gainers' | 'losers'>('volume');

  const currentStocks = stocksData[filterTab] || stocksData.volume;

  return (
    <section
      className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs"
      data-purpose="active-stocks-table"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-lg text-[#131722]">Most Active Stocks</h3>
          <p className="text-xs text-[#787B86]">Top traded volume in US sessions</p>
        </div>

        {/* Filter Segmented Control */}
        <div className="inline-flex rounded-lg bg-[#F0F3FA] p-0.5 text-xs font-semibold">
          <button
            onClick={() => setFilterTab('volume')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterTab === 'volume'
                ? 'bg-white shadow-xs text-[#131722]'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Volume
          </button>
          <button
            onClick={() => setFilterTab('gainers')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterTab === 'gainers'
                ? 'bg-white shadow-xs text-[#131722]'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setFilterTab('losers')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterTab === 'losers'
                ? 'bg-white shadow-xs text-[#131722]'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Losers
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#E0E3EB] text-[#787B86] font-normal text-xs uppercase tracking-wider">
              <th className="py-2 pl-1 font-medium">Symbol</th>
              <th className="py-2 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Change %</th>
              <th className="py-2 pr-1 text-right font-medium">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E3EB]/60 font-medium">
            {currentStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const flashState = lastUpdatedSymbols[stock.symbol];

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock)}
                  className={`hover:bg-[#F0F3FA]/70 cursor-pointer transition-colors duration-150 ${
                    flashState === 'up' ? 'flash-up' : flashState === 'down' ? 'flash-down' : ''
                  }`}
                >
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs"
                        style={{ backgroundColor: stock.badgeColor || '#2563EB' }}
                      >
                        {stock.badgeText || stock.symbol.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#131722]">{stock.symbol}</div>
                        <div className="text-[11px] text-[#787B86] truncate max-w-[140px] sm:max-w-[180px]">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-right tabular-nums text-[#131722] font-semibold">
                    ${stock.price.toFixed(2)}
                  </td>

                  <td
                    className={`py-3 text-right tabular-nums font-semibold ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </td>

                  <td className="py-3 pr-1 text-right tabular-nums text-[#787B86] font-normal">
                    {stock.volume || '25.0M'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
