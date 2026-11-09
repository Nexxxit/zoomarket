'use client';

import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onClick: () => void;
  isPending: boolean;
}

export default function LogoutButton({ onClick, isPending }: LogoutButtonProps) {
  return (
    <div className="pt-6 border-t border-stone-100">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="w-full py-3 border-2 border-red-500/20 hover:border-red-500/40 hover:bg-red-50 text-red-600 font-bold font-comfortaa rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-wait"
      >
        <LogOut className="w-4 h-4" />
        <span>{isPending ? 'Выходим...' : 'Выйти из аккаунта'}</span>
      </button>
    </div>
  );
}
