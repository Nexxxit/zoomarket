'use client';

import { X } from 'lucide-react';

interface DrawerHeaderProps {
  title: string;
  onClose?: () => void;
}

export default function DrawerHeader({ title, onClose }: DrawerHeaderProps) {
  return (
    <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">🐾</span>
        <span className="font-extrabold font-comfortaa text-stone-950 text-base md:text-lg">
          {title}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-all cursor-pointer"
      >
        <X className="w-5.5 h-5.5" />
      </button>
    </div>
  );
}
