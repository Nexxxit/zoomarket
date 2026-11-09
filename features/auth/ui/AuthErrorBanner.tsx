'use client';

interface AuthErrorBannerProps {
  message: string;
}

export default function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  return (
    <div role="alert" className="p-3.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium font-inter">
      ⚠️ {message}
    </div>
  );
}
