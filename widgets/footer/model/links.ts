import { MessageCircle, Phone, Send, type LucideIcon } from 'lucide-react';

export interface FooterLink {
  label: string;
  href: string;
}

export const catalogLinks: FooterLink[] = [
  { label: 'Собаки', href: '/catalog/dog' },
  { label: 'Кошки', href: '/catalog/cat' },
  { label: 'Птицы', href: '/catalog/bird' },
  { label: 'Грызуны', href: '/catalog/rodent' },
  { label: 'Рыбки', href: '/catalog/fish' },
  { label: 'Ветаптека', href: '/catalog/vet' },
  { label: 'Бренды', href: '/catalog/brands' },
];

export const customerLinks: FooterLink[] = [
  { label: 'О компании', href: '#' },
  { label: 'Доставка и оплата', href: '#' },
  { label: 'Наши магазины', href: '#' },
  { label: 'Статьи', href: '#' },
  { label: 'Бренды', href: '/catalog/brands' },
  { label: 'Вопросы и ответы', href: '#' },
  { label: 'Контакты', href: '#' },
];

export const infoLinks: FooterLink[] = [
  { label: 'Политика конфиденциальности', href: '#' },
  { label: 'Пользовательское соглашение', href: '#' },
  { label: 'Вакансии', href: '#' },
];

export interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
}

export const socialLinks: SocialLink[] = [
  {
    label: 'ВКонтакте',
    href: 'https://vk.ru/zootobol',
    external: true,
  },
];

export interface MessengerLink extends FooterLink {
  icon: LucideIcon;
}

export const messengerLinks: MessengerLink[] = [
  { label: 'Telegram', href: '#', icon: Send },
  { label: 'Чат', href: '#', icon: MessageCircle },
  { label: 'Телефон', href: 'tel:+79526770777', icon: Phone },
];
