'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../model/authContext';
import DrawerHeader from './DrawerHeader';
import LoginForm from './LoginForm';
import ProfileView from './ProfileView';

interface AuthDrawerProps {
  open?: boolean;

  onClose?: () => void;
}

let scrollLockCount = 0;
let savedBodyOverflow = '';

function lockBodyScroll() {
  scrollLockCount += 1;
  if (scrollLockCount === 1) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow;
  }
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
    clearAddress,
  } = useAuth();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Пока drawer открыт: скролл страницы под ним заблокирован (счётчик —
  // два лока не затирают друг друга), ESC закрывает, фокус входит в панель
  // и возвращается на открывший элемент при закрытии.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockBodyScroll();
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current?.();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockBodyScroll();
      previouslyFocused?.focus?.();
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
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={user ? 'Личный кабинет' : 'Вход в Айболит'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-100 outline-hidden"
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
                  onClearAddress={clearAddress}
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
