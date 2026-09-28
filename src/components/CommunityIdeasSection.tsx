import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, TrendingUp, Sparkles, UserCheck } from 'lucide-react';
import { AssetData } from '../data/marketData';

export interface CommunityIdea {
  id: string;
  author: string;
  avatar: string;
  title: string;
  symbol: string;
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timeframe: string;
  likes: number;
  comments: number;
  description: string;
  published: string;
}

const COMMUNITY_IDEAS: CommunityIdea[] = [
  {
    id: 'idea-1',
    author: 'Quantum_Flows',
    avatar: '👨‍💼',
    title: 'S&P 500 (SPX): Breakout retest holding key 5,950 support confluence',
    symbol: 'SPX',
    bias: 'BULLISH',
    timeframe: '4H',
    likes: 184,
    comments: 32,
    description: 'SPX printed an ascending triangle breakout. Looking for continuation toward 6,050 psychological target as weekly momentum expands.',
    published: '3h ago'
  },
  {
    id: 'idea-2',
    author: 'SatoshiSignals',
    avatar: '🦊',
    title: 'BTC/USD: Cup and handle on daily charts targeting $100K expansion',
    symbol: 'BTC/USD',
    bias: 'BULLISH',
    timeframe: '1D',
    likes: 312,
    comments: 58,
    description: 'Volume on spot venues confirming accumulation near local highs. Stop loss below 91,200 swing low.',
    published: '5h ago'
  },
  {
    id: 'idea-3',
    author: 'MacroAlphaDesk',
    avatar: '📈',
    title: 'Crude Oil (WTI): Head & shoulders formation testing neckline at $70.80',
    symbol: 'CL1!',
    bias: 'BEARISH',
    timeframe: '1D',
    likes: 95,
    comments: 18,
    description: 'Inventory build data suggests persistent supply overhang. A break below $70.50 invalidates support and opens downside towards $66.',
    published: '7h ago'
  }
];

interface CommunityIdeasSectionProps {
  onSelectSymbol?: (symbol: string) => void;
}

export const CommunityIdeasSection: React.FC<CommunityIdeasSectionProps> = ({ onSelectSymbol }) => {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [hasLikedMap, setHasLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, initialLikes: number) => {
    const isLiked = hasLikedMap[id];
    setHasLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setLikesMap(prev => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + (isLiked ? -1 : 1)
    }));
  };

  return (
    <section className="border border-[#E0E3EB] rounded-xl bg-white p-5 shadow-xs mb-10" data-purpose="community-ideas">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-[#131722]">Community Trade Ideas</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-[#2962FF] font-semibold">
              Top Authors
            </span>
          </div>
          <p className="text-xs text-[#787B86]">Technical analyses, chart patterns, and trading plans shared by verified traders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COMMUNITY_IDEAS.map((idea) => {
          const currentLikes = likesMap[idea.id] ?? idea.likes;
          const isLiked = hasLikedMap[idea.id];

          return (
            <div
              key={idea.id}
              className="p-4 rounded-xl border border-[#E0E3EB] hover:border-[#2962FF]/40 hover:shadow-xs transition bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{idea.avatar}</span>
                    <div>
                      <div className="font-bold text-xs text-[#131722]">{idea.author}</div>
                      <div className="text-[10px] text-[#787B86]">{idea.published}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      idea.bias === 'BULLISH'
                        ? 'bg-[#E6F4F1] text-[#089981]'
                        : idea.bias === 'BEARISH'
                        ? 'bg-[#FDE8E9] text-[#F23645]'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {idea.bias}
                  </span>
                </div>

                <h4
                  onClick={() => onSelectSymbol && onSelectSymbol(idea.symbol)}
                  className="font-bold text-sm text-[#131722] hover:text-[#2962FF] transition cursor-pointer leading-snug line-clamp-2 mb-2"
                >
                  {idea.title}
                </h4>

                <p className="text-xs text-[#787B86] leading-relaxed line-clamp-3 mb-4">
                  {idea.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E0E3EB]/70 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectSymbol && onSelectSymbol(idea.symbol)}
                  className="font-bold text-[#2962FF] hover:underline bg-blue-50 px-2 py-0.5 rounded text-[11px]"
                >
                  ${idea.symbol} • {idea.timeframe}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(idea.id, idea.likes)}
                    className={`flex items-center gap-1 transition ${
                      isLiked ? 'text-[#2962FF] font-bold' : 'text-[#787B86] hover:text-[#131722]'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="tabular-nums">{currentLikes}</span>
                  </button>
                  <div className="flex items-center gap-1 text-[#787B86]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{idea.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
