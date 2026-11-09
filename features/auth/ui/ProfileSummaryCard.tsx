'use client';

import type { UserProfile } from '@/entities/user';


interface ProfileSummaryCardProps {
  user: UserProfile;
}

export default function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 p-5 rounded-2xl border border-orange-100 flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm border border-orange-200">
        {user.avatar || '🐱'}
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-extrabold font-comfortaa text-stone-900 leading-tight">
          {user.name}
        </h4>
        <p className="text-xs text-stone-500 font-mono font-medium">{user.phone}</p>
      </div>
    </div>
  );
}
