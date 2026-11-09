export type { CartItem, CheckoutType } from './model/types';
export { INITIAL_CART_ITEMS, DEMO_CHECKOUT_TYPE, DEMO_PICKUP_ADDRESS } from './model/mock';
export {
  selectCartCount,
  selectSubtotal,
  selectOldSubtotal,
  selectDeliveryCost,
  selectPromoDiscount,
  selectGrandTotal,
} from './model/selectors';
export {
  addItemToCart,
  removeItemFromCart,
  changeItemQuantity,
  parseStoredCart,
} from './model/cart';
export type { CartItemSeed } from './model/cart';
