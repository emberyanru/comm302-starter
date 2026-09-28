import React, { useState } from 'react';
import { AssetData } from '../data/marketData';

interface WorldIndicesTableProps {
  indices: AssetData[];
  onSelectIndex: (asset: AssetData) => void;
  lastUpdatedSymbols?: Record<string, 'up' | 'down'>;
}

export const WorldIndicesTable: React.FC<WorldIndicesTableProps> = ({
  indices,
  onSelectIndex,
  lastUpdatedSymbols = {},
}) => {
  const [showAllModal, setShowAllModal] = useState(false);

  // Show top 5 in the standard dashboard view
  const visibleIndices = indices.slice(0, 5);

  return (
    <>
      <section
        className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs"
        data-purpose="world-indices-table"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-[#131722]">World Indices</h3>
            <p className="text-xs text-[#787B86]">Key international benchmarks</p>
          </div>
          <button
            onClick={() => setShowAllModal(true)}
            className="text-xs text-[#2962FF] hover:underline font-semibold"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E0E3EB] text-[#787B86] font-normal text-xs uppercase tracking-wider">
                <th className="py-2 pl-1 font-medium">Index</th>
                <th className="py-2 text-right font-medium">Price</th>
                <th className="py-2 text-right font-medium">Change %</th>
                <th className="py-2 pr-1 text-right font-medium">Chart (24h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3EB]/60 font-medium">
              {visibleIndices.map((indexItem) => {
                const isPositive = indexItem.changePercent >= 0;
                const flashState = lastUpdatedSymbols[indexItem.symbol];

                // Generate mini sparkline path
                const data = indexItem.sparkline || [20, 22, 21, 24, 26];
                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min || 1;
                const points = data
                  .map((val, idx) => {
                    const x = (idx / (data.length - 1)) * 80;
                    const y = 18 - ((val - min) / range) * 16;
                    return `${x},${y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <tr
                    key={indexItem.symbol}
                    onClick={() => onSelectIndex(indexItem)}
                    className={`hover:bg-[#F0F3FA]/70 cursor-pointer transition-colors duration-150 ${
                      flashState === 'up' ? 'flash-up' : flashState === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none w-6 text-center">
                          {indexItem.flagEmoji || '🌐'}
                        </span>
                        <div>
                          <div className="font-bold text-[#131722]">{indexItem.symbol}</div>
                          <div className="text-[11px] text-[#787B86]">
                            {indexItem.shortName || indexItem.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-right tabular-nums text-[#131722] font-semibold">
                      {indexItem.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td
                      className={`py-3 text-right tabular-nums font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {indexItem.changePercent.toFixed(2)}%
                    </td>

                    <td className="py-3 pr-1 text-right w-24">
                      <svg
                        className="w-20 h-5 fill-none inline-block overflow-visible"
                        viewBox="0 0 80 20"
                      >
                        <polyline
                          points={points}
                          stroke={isPositive ? '#089981' : '#F23645'}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* View All World Indices Modal */}
      {showAllModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-[#E0E3EB] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E3EB]">
              <div>
                <h3 className="font-bold text-lg text-[#131722]">All Global Major Indices</h3>
                <p className="text-xs text-[#787B86]">Real-time international market benchmarks</p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="text-[#787B86] hover:text-[#131722] p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-[#E0E3EB]/60 py-2 flex-1">
              {indices.map((idx) => {
                const isPos = idx.changePercent >= 0;
                return (
                  <div
                    key={idx.symbol}
                    onClick={() => {
                      onSelectIndex(idx);
                      setShowAllModal(false);
                    }}
                    className="py-3 px-2 flex items-center justify-between hover:bg-[#F0F3FA] rounded-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{idx.flagEmoji || '🌐'}</span>
                      <div>
                        <div className="font-bold text-[#131722] text-sm">
                          {idx.symbol}{' '}
                          <span className="text-xs font-normal text-[#787B86]">({idx.name})</span>
                        </div>
                        <div className="text-xs text-[#787B86]">{idx.exchange}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#131722] tabular-nums">
                        {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {idx.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E0E3EB] flex justify-end">
              <button
                onClick={() => setShowAllModal(false)}
                className="px-4 py-2 bg-[#131722] text-white rounded-lg text-xs font-semibold"
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
