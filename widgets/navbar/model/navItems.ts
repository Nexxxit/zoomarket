import {
  Percent, Cat, Dog, Bird, Rabbit, Fish, Pill, Award,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryNavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  isPromo?: boolean;
  match: (p: string) => boolean;
}

export const categoryNavItems: CategoryNavItem[] = [
  { id: 'promotions', name: 'Акции', href: '/promotions', icon: Percent, isPromo: true, match: (p: string) => p === '/promotions' },
  { id: 'cat', name: 'Кошки', href: '/catalog/cat', icon: Cat, match: (p: string) => p.startsWith('/catalog/cat') && !p.includes('cat-flea') },
  { id: 'dog', name: 'Собаки', href: '/catalog/dog', icon: Dog, match: (p: string) => p.startsWith('/catalog/dog') && !p.includes('dog-flea') },
  { id: 'bird', name: 'Птицы', href: '/catalog/bird', icon: Bird, match: (p: string) => p.startsWith('/catalog/bird') },
  { id: 'rodent', name: 'Грызуны', href: '/catalog/rodent', icon: Rabbit, match: (p: string) => p.startsWith('/catalog/rodent') },
  { id: 'fish', name: 'Рыбки', href: '/catalog/fish', icon: Fish, match: (p: string) => p.startsWith('/catalog/fish') },
  { id: 'vet', name: 'Ветаптека', href: '/catalog/vet', icon: Pill, match: (p: string) => p.includes('cat-flea') || p.includes('dog-flea') || p.includes('pharmacy') || p.startsWith('/catalog/vet') },
  { id: 'brands', name: 'Бренды', href: '/catalog/brands', icon: Award, match: (p: string) => p === '/catalog/brands' || p.startsWith('/catalog/brands/') },
];
