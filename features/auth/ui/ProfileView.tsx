'use client';

import type { UserAddress, UserProfile } from '@/entities/user';
import type { OrderSummary } from '@/entities/order';
import AuthErrorBanner from './AuthErrorBanner';
import ProfileSummaryCard from './ProfileSummaryCard';
import ProfileDetailsCard from './ProfileDetailsCard';
import AddressSection from './AddressSection';
import OrderHistorySection from './OrderHistorySection';
import LogoutButton from './LogoutButton';

interface ProfileViewProps {
  user: UserProfile;
  orders: OrderSummary[] | null;
  ordersLoading: boolean;
  isSavingAddress: boolean;
  isLoggingOut: boolean;
  error: string | null;
  onSaveAddress: (address: UserAddress) => Promise<boolean>;
  onLogout: () => void;
}

export default function ProfileView({
  user,
  orders,
  ordersLoading,
  isSavingAddress,
  isLoggingOut,
  error,
  onSaveAddress,
  onLogout,
}: ProfileViewProps) {
  return (
    <div className="space-y-6">
      {error && <AuthErrorBanner message={error} />}

      <ProfileSummaryCard user={user} />

      <ProfileDetailsCard user={user} />

      <AddressSection address={user.address} isSaving={isSavingAddress} onSave={onSaveAddress} />

      <OrderHistorySection orders={orders} loading={ordersLoading} />

      <LogoutButton onClick={onLogout} isPending={isLoggingOut} />
    </div>
  );
}
