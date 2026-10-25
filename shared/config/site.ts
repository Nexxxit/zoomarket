import { Package, Store, Truck, Trophy, type LucideIcon } from 'lucide-react';

export const SITE_NAME = 'Айболит';
export const SITE_TAGLINE = 'Заботливый зоомаркет';

export const CONTACT_PHONE = '8 (952) 677-07-77';
export const CONTACT_PHONE_HREF = 'tel:+79526770777';
export const WORK_HOURS = 'ежедневно, 8:00–20:00';
export const FOOTER_WORK_HOURS = 'Приём заказов по телефону: ежедневно, 8:00-20:00.';

export const TOP_BAR_LINKS = [
  { label: 'О компании', href: '#' },
  { label: 'Доставка и оплата', href: '/delivery' },
  { label: 'Наши магазины', href: '#' },
  { label: 'Статьи', href: '#' },
  { label: 'Вопросы и ответы', href: '#' },
  { label: 'Бренды', href: '/catalog/brands' },
  { label: 'Контакты', href: '#' },
];

export const HOME_FEATURES: { id: string; icon: LucideIcon; lines: [string, string?] }[] = [
  { id: 'same-day', icon: Truck, lines: ['Доставка день в день!', 'Бесплатно от 1000 ₽'] },
  { id: 'pickup', icon: Store, lines: ['Самовывоз из', 'магазинов'] },
  { id: 'loyalty', icon: Trophy, lines: ['10% на повторный', 'заказ'] },
  { id: 'russia', icon: Package, lines: ['Доставка по', 'России'] },
];

export interface PickupStore {
  id: string;
  name: string;
  address: string;
  hours: string;
  coords: { x: number; y: number };
  phone: string;
}

export const PICKUP_STORES: PickupStore[] = [
  {
    id: 'center',
    name: 'Зоомаркет «Айболит — Центр»',
    address: 'ул. Ленина, д. 12 (м. Площадь Ленина, Зоомаркет Айболит)',
    hours: '09:00 – 21:50',
    coords: { x: 50, y: 45 },
    phone: '8 (952) 677-07-77'
  },
  {
    id: 'south',
    name: 'Зоомаркет «Айболит — Юг»',
    address: 'Московский пр., д. 85 (м. Московские ворота, Зоомаркет Айболит)',
    hours: '10:00 – 21:00',
    coords: { x: 42, y: 75 },
    phone: '8 (952) 677-07-77'
  },
  {
    id: 'north',
    name: 'Зоомаркет «Айболит — Север»',
    address: 'пр. Просвещения, д. 43 (м. Проспект Просвещения, Зоомаркет Айболит)',
    hours: '09:00 – 21:00',
    coords: { x: 58, y: 22 },
    phone: '8 (952) 677-07-77'
  }
];

export const MOCK_DISTRICTS = [
  { value: 'central', label: 'Центральный административный округ (ЦАО)' },
  { value: 'north', label: 'Северный АО (САО)' },
  { value: 'east', label: 'Восточный АО (ВАО)' },
  { value: 'south', label: 'Южный АО (ЮАО)' },
  { value: 'west', label: 'Западный АО (ЗАО)' },
  { value: 'suburbs', label: 'Пригород / Московская область (до 30 км)' },
];
