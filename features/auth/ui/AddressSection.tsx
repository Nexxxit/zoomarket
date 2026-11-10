'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { UserAddress } from '@/entities/user';
import { formatAddress } from '@/entities/user';

interface AddressSectionProps {
  address?: UserAddress;
  isSaving: boolean;
  /** Возвращает true при успехе (ответ `PATCH /api/user/address`). */
  onSave: (address: UserAddress) => Promise<boolean>;
  /** Возвращает true при успехе (ответ `DELETE /api/user/address`). */
  onClear: () => Promise<boolean>;
}

interface Draft {
  street: string;
  house: string;
  flat: string;
  entrance: string;
}

const INPUT =
  'w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-inter text-stone-900 focus:outline-hidden focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 disabled:opacity-60';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
      {children}
    </label>
  );
}

function toDraft(address?: UserAddress): Draft {
  return {
    street: address?.street ?? '',
    house: address?.house ?? '',
    flat: address?.flat ?? '',
    entrance: address?.entrance ?? '',
  };
}

function toAddress(draft: Draft): UserAddress {
  return {
    street: draft.street.trim(),
    house: draft.house.trim(),
    flat: draft.flat.trim() || undefined,
    entrance: draft.entrance.trim() || undefined,
  };
}

export default function AddressSection({ address, isSaving, onSave, onClear }: AddressSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(address));
  const lastSavedRef = useRef(toDraft(address));

  // Внешнее изменение адреса (сохранён с чекаута или очищен) во время
  // редактирования — пересобираем draft, чтобы не показывать устаревшие поля.
  useEffect(() => {
    const current = toDraft(address);
    const previous = lastSavedRef.current;
    if (
      current.street !== previous.street ||
      current.house !== previous.house ||
      current.flat !== previous.flat ||
      current.entrance !== previous.entrance
    ) {
      lastSavedRef.current = current;
      setDraft(current);
    }
  }, [address]);

  const startEditing = () => {
    setDraft(toDraft(address));
    lastSavedRef.current = toDraft(address);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const saved = await onSave(toAddress(draft));
    if (saved) setIsEditing(false);
  };

  const handleClear = async () => {
    await onClear();
  };

  const setField = (key: 'street' | 'house' | 'flat' | 'entrance', value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const formatted = formatAddress(address);
  const canSave = Boolean(draft.street.trim() && draft.house.trim());

  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block pl-1">
        Адрес доставки покупателя
      </span>
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-xs text-stone-700 space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <FieldLabel htmlFor="address-street">Улица *</FieldLabel>
                <input
                  id="address-street"
                  placeholder="ул. Александра Невского"
                  value={draft.street}
                  onChange={(e) => setField('street', e.target.value)}
                  disabled={isSaving}
                  className={INPUT}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="address-house">Дом *</FieldLabel>
                <input
                  id="address-house"
                  placeholder="д. 14Б"
                  value={draft.house}
                  onChange={(e) => setField('house', e.target.value)}
                  disabled={isSaving}
                  className={INPUT}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="address-flat">Квартира / офис</FieldLabel>
                <input
                  id="address-flat"
                  placeholder="кв. 102"
                  value={draft.flat}
                  onChange={(e) => setField('flat', e.target.value)}
                  disabled={isSaving}
                  className={INPUT}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="address-entrance">Подъезд / домофон</FieldLabel>
                <input
                  id="address-entrance"
                  placeholder="Подъезд 3, код 123"
                  value={draft.entrance}
                  onChange={(e) => setField('entrance', e.target.value)}
                  disabled={isSaving}
                  className={INPUT}
                />
              </div>
            </div>

            {!canSave && (
              <p className="text-[10px] text-stone-400">Заполните улицу и дом, чтобы сохранить адрес.</p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSaving}
                className="px-3 py-1.5 border border-stone-200 text-stone-500 rounded-lg font-bold font-comfortaa text-[11px] hover:bg-stone-100 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !canSave}
                className="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-bold font-comfortaa text-[11px] hover:bg-orange-600 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
              >
                {isSaving ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span className={formatted ? 'text-stone-800 font-medium' : 'text-stone-400 italic'}>
                {formatted || 'Адрес не указан. Добавьте его для быстрого заказа!'}
              </span>
            </div>
            <button
              type="button"
              onClick={startEditing}
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 font-comfortaa cursor-pointer shrink-0"
            >
              Изменить
            </button>
            {formatted && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSaving}
                className="text-[11px] font-bold text-stone-400 hover:text-red-600 font-comfortaa cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-wait"
              >
                Очистить адрес
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
