import React from 'react';

export type CategoryType =
  | 'indices'
  | 'us-stocks'
  | 'world-stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds'
  | 'corp-bonds'
  | 'etfs'
  | 'economy';

interface CategoryPillsProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories: { id: CategoryType; label: string }[] = [
    { id: 'indices', label: 'Indices' },
    { id: 'us-stocks', label: 'US stocks' },
    { id: 'world-stocks', label: 'World stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Government bonds' },
    { id: 'corp-bonds', label: 'Corporate bonds' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'economy', label: 'Economy' },
  ];

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-6 mb-8 overflow-hidden" data-purpose="category-pills">
      <div className="flex items-center justify-start lg:justify-center overflow-x-auto no-scrollbar py-2">
        <div className="inline-flex items-center p-1.5 bg-white border border-[#E0E3EB] rounded-full shadow-xs gap-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#131722] hover:bg-[#F0F3FA]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
