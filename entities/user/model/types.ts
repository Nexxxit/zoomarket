export type UserRole = 'customer' | 'admin';

/**
 * Структурированный адрес доставки: отдельные поля улицы/дома/квартиры/
 * подъезда.
 */
export interface UserAddress {
  street: string;
  house: string;
  flat?: string;
  entrance?: string;
}

/**
 * Профиль пользователя — приходит с бэка в ответе `POST /api/auth/login`
 * (`{ token, user }`) и `PATCH /api/user/address` (обновлённый профиль).
 */
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  address?: UserAddress;
  role: UserRole;
  /** ISO-дата регистрации */
  registeredAt: string;
}
