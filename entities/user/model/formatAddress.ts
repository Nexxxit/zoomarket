import type { UserAddress } from './types';

/** Собирает человекочитаемую строку из структуры адреса. */
export function formatAddress(address?: UserAddress): string {
  if (!address) return '';
  return [address.street, address.house, address.flat, address.entrance]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(', ');
}

/** True, если заполнены обязательные поля адреса. */
export function isAddressComplete(address?: UserAddress): boolean {
  return Boolean(address?.street.trim() && address?.house.trim());
}
