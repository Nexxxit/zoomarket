import type { CartItem } from './types';

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Ownat Adult Sterilized Classic Сухой корм для стерилизованных кошек средней активности, с птицей',
    category: 'Корма',
    price: 2400,
    oldPrice: 2999,
    quantity: 1,
    imageType: 'food',
    size: '1,5 кг'
  },
  {
    id: '3',
    name: 'Ownat Adult Sterilized Grain Free Just Беззерновой сухой корм для взрослых стерилизованных кошек, с курицей',
    category: 'Корма',
    price: 1529,
    quantity: 1,
    imageType: 'food',
    size: '1 кг'
  },
  {
    id: '5',
    name: 'Кошачий защитный ошейник Foresto от блох, клещей и вшей для мелких собак и кошек Elanco Foresto',
    category: 'Ветаптека',
    price: 3450,
    oldPrice: 4300,
    quantity: 1,
    imageType: 'medicine',
    size: '38 см'
  }
];

export const DEMO_CHECKOUT_TYPE: 'delivery' | 'pickup' = 'delivery';
export const DEMO_PICKUP_ADDRESS = 'ул. Ленина, д. 12 (м. Площадь Ленина, Зоомаркет Айболит)';
