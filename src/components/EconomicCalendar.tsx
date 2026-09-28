import React, { useState } from 'react';
import { AssetData } from '../data/marketData';

export interface CalendarEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
}

const ECONOMIC_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', time: '08:30 AM', country: 'USD', flag: '🇺🇸', event: 'Non-Farm Payrolls (NFP)', impact: 'HIGH', actual: '224K', forecast: '200K', previous: '223K' },
  { id: 'e2', time: '08:30 AM', country: 'USD', flag: '🇺🇸', event: 'Unemployment Rate', impact: 'HIGH', actual: '4.1%', forecast: '4.1%', previous: '4.1%' },
  { id: 'e3', time: '10:00 AM', country: 'USD', flag: '🇺🇸', event: 'ISM Manufacturing PMI', impact: 'HIGH', actual: '48.4', forecast: '47.5', previous: '46.5' },
  { id: 'e4', time: '02:00 PM', country: 'USD', flag: '🇺🇸', event: 'FOMC Meeting Minutes', impact: 'HIGH', actual: '-', forecast: '-', previous: '-' },
  { id: 'e5', time: '09:00 AM', country: 'EUR', flag: '🇪🇺', event: 'Eurozone CPI (YoY)', impact: 'MED', actual: '2.3%', forecast: '2.3%', previous: '2.0%' },
  { id: 'e6', time: '11:30 PM', country: 'JPY', flag: '🇯🇵', event: 'BoJ Core CPI (YoY)', impact: 'MED', actual: '2.7%', forecast: '2.8%', previous: '2.7%' },
];

export const EconomicCalendar: React.FC = () => {
  const [filterImpact, setFilterImpact] = useState<'ALL' | 'HIGH'>('ALL');

  const filtered = ECONOMIC_CALENDAR_EVENTS.filter((e) => {
    if (filterImpact === 'HIGH') return e.impact === 'HIGH';
    return true;
  });

  return (
    <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10" data-purpose="economic-calendar">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-[#131722]">Economic Calendar</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-[#089981] font-semibold">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-[#787B86]">Global macroeconomic indicators, rate decisions, and labor reports</p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F0F3FA] p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setFilterImpact('ALL')}
            className={`px-3 py-1 rounded-md transition ${filterImpact === 'ALL' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterImpact('HIGH')}
            className={`px-3 py-1 rounded-md transition ${filterImpact === 'HIGH' ? 'bg-white text-[#F23645] shadow-xs' : 'text-[#787B86] hover:text-[#131722]'}`}
          >
            High Impact Only
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#E0E3EB] text-[#787B86] font-normal text-xs uppercase tracking-wider">
              <th className="py-2.5 pl-1 font-medium">Time (EST)</th>
              <th className="py-2.5 font-medium">Country</th>
              <th className="py-2.5 font-medium">Event</th>
              <th className="py-2.5 text-center font-medium">Impact</th>
              <th className="py-2.5 text-right font-medium">Actual</th>
              <th className="py-2.5 text-right font-medium">Forecast</th>
              <th className="py-2.5 pr-1 text-right font-medium">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E3EB]/60 font-medium">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#F0F3FA]/70 transition-colors">
                <td className="py-3 pl-1 text-[#787B86] tabular-nums font-mono">{item.time}</td>
                <td className="py-3">
                  <span className="flex items-center gap-1.5">
                    <span>{item.flag}</span>
                    <span className="font-bold text-[#131722]">{item.country}</span>
                  </span>
                </td>
                <td className="py-3 text-[#131722] font-semibold">{item.event}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.impact === 'HIGH'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {item.impact}
                  </span>
                </td>
                <td className="py-3 text-right font-bold tabular-nums text-[#131722]">{item.actual}</td>
                <td className="py-3 text-right text-[#787B86] tabular-nums">{item.forecast}</td>
                <td className="py-3 pr-1 text-right text-[#787B86] tabular-nums">{item.previous}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
