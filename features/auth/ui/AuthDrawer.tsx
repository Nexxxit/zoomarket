'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../model/authContext';
import DrawerHeader from './DrawerHeader';
import LoginForm from './LoginForm';
import ProfileView from './ProfileView';

interface AuthDrawerProps {
  open?: boolean;

  onClose?: () => void;
}

export default function AuthDrawer({ open = false, onClose }: AuthDrawerProps) {
  const {
    user,
    isSubmitting,
    isSavingAddress,
    isLoggingOut,
    error,
    orders,
    ordersLoading,
    login,
    logout,
    updateAddress,
  } = useAuth();

  // Пока drawer открыт — страница под ним не скроллится; внутри drawer
  // скролл остаётся (flex-1 overflow-y-auto).
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-100"
          >

            <DrawerHeader
              title={user ? 'Личный кабинет' : 'Вход в Айболит'}
              onClose={onClose}
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {user ? (
                <ProfileView
                  user={user}
                  orders={orders}
                  ordersLoading={ordersLoading}
                  isSavingAddress={isSavingAddress}
                  isLoggingOut={isLoggingOut}
                  error={error}
                  onSaveAddress={updateAddress}
                  onLogout={() => {
                    void logout();
                  }}
                />
              ) : (
                <LoginForm
                  onSubmit={(credentials) => {
                    void login(credentials);
                  }}
                  isSubmitting={isSubmitting}
                  error={error}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
