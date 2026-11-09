'use client';

interface SortBarProps {
  count: number;
  sortType: 'popular' | 'cheap-first' | 'expensive-first';
}

export default function SortBar({ count, sortType }: SortBarProps) {
  return (
    <div className="flex justify-between items-center text-xs py-2 border-b border-stone-100/60 pb-3">
      <span className="font-semibold font-comfortaa text-stone-500">
        Найдено <strong className="text-stone-900">{count}</strong> предложений
      </span>

      <div className="flex items-center gap-2 font-inter text-stone-700">
        <span className="hidden sm:inline text-stone-400">Сортировать по:</span>
        <select
          defaultValue={sortType}
          className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 font-semibold text-xs animate-none"
        >
          <option value="popular">По популярности</option>
          <option value="cheap-first">Сначала дешевые</option>
          <option value="expensive-first">Сначала дорогие</option>
        </select>
      </div>
    </div>
  );
}
