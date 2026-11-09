'use client';

import { Mail } from 'lucide-react';
import type { UserProfile } from '@/entities/user';

interface ProfileDetailsCardProps {
  user: UserProfile;
}

function formatRegistrationDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProfileDetailsCard({ user }: ProfileDetailsCardProps) {
  return (
    <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100 text-xs text-stone-700 font-inter">
      {user.email && (
        <div className="flex items-center gap-2.5 pb-2 border-b border-stone-150">
          <Mail className="w-4 h-4 text-stone-400" />
          <span>{user.email}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
        <span>Дата регистрации:</span>
        <strong>{formatRegistrationDate(user.registeredAt)}</strong>
      </div>
    </div>
  );
}
