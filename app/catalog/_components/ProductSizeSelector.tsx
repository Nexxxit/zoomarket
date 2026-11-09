'use client';

interface ProductSizeSelectorProps {
  sizes?: string[];
  activeSize?: string;
  onSelectSize?: (size: string) => void;
}

export default function ProductSizeSelector({ sizes, activeSize, onSelectSize }: ProductSizeSelectorProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest font-comfortaa">Выберите фасовку / размер:</span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = activeSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize?.(size)}
              aria-pressed={isSelected}
              className={`px-4 py-2 text-xs font-bold font-comfortaa rounded-xl border transition-all cursor-pointer ${isSelected
                ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                : 'bg-stone-50 border-stone-200/50 text-stone-600 hover:bg-stone-100'
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
