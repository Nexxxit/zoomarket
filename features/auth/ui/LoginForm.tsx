'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Award } from 'lucide-react';
import type { AuthCredentials } from '../model/types';
import AuthInput from './AuthInput';
import AuthErrorBanner from './AuthErrorBanner';

interface LoginFormProps {
  onSubmit: (credentials: AuthCredentials) => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function LoginForm({ onSubmit, isSubmitting, error }: LoginFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    onSubmit({ name, phone, email: email || undefined });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold font-comfortaa text-stone-900 leading-tight">
          Авторизуйтесь в 1 клик!
        </h3>
        <p className="text-xs text-stone-500 font-inter leading-relaxed">
          Введите ваше имя и телефон, чтобы сохранять питомцев в избранном, копить бонусы и отслеживать курьера на карте.
        </p>
      </div>

      {error && <AuthErrorBanner message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Ваше Имя"
          icon={User}
          type="text"
          required
          placeholder="Василий Иванович"
          value={name}
          onChange={setName}
        />

        <AuthInput
          label="Номер телефона"
          icon={Phone}
          type="tel"
          required
          placeholder="+7 (999) 123-45-67"
          value={phone}
          onChange={setPhone}
        />

        <AuthInput
          label="Электронная почта (Email)"
          icon={Mail}
          type="email"
          placeholder="example@aibolit.ru"
          value={email}
          onChange={setEmail}
        />

        <div className="pt-3">
          <motion.button
            whileHover={isSubmitting ? undefined : { scale: 1.01 }}
            whileTap={isSubmitting ? undefined : { scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-sm rounded-full shadow-md shadow-orange-500/10 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {isSubmitting ? '⏳ Входим...' : '🚀 Войти в личный кабинет'}
          </motion.button>
        </div>
      </form>

      <div className="pt-6 border-t border-stone-100 flex items-start gap-2.5 text-[11px] text-stone-400 font-inter leading-relaxed">
        <Award className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
        <p>
          Авторизация полностью безопасна. Данные сеанса шифруются локально на вашем устройстве в соответствии с регламентом «Айболит Охрана».
        </p>
      </div>
    </div>
  );
}
