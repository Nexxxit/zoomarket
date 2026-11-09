export type { Product, ProductSpecification } from './model/types';
export { MOCK_PRODUCTS, DEMO_FAVORITE_IDS } from './model/mock';
export { getDefaultProductSize } from './model/defaultSize';
export { getAllProducts, getProductById } from './api';
export { default as ProductCard } from './ui/ProductCard';
