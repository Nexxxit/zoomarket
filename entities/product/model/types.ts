/** Строка спецификации в формате «подпись: значение», приходит с сервера. */
export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  onSale: boolean;
  salePct?: number;
  badge?: string;
  type: 'food' | 'toy' | 'medicine' | 'accessory';
  animal: 'dog' | 'cat' | 'bird' | 'rodent' | 'fish' | 'universal';
  brand?: string;
  sizes?: string[];
  subcategoryId?: string;
  subSection?: string;
  inStock?: boolean;
  /** Абзацы описания товара с сервера. */
  description?: string[];
  /** Спецификации товара с сервера. */
  specifications?: ProductSpecification[];
}
