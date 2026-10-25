export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  imageType: 'food' | 'medicine' | 'accessory' | 'toy';
  size?: string;
}
