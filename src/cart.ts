import type { Product } from './catalog.js';

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItem {
    price: number;
    quantity: number;
}

export interface OrderTotal {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
}

const PROMO_CODE = 'SAVE10';
const PROMO_RATE = 0.1;
const PROMO_MIN_SUBTOTAL = 20000;
const DELIVERY_PRICE = 30000;
const FREE_DELIVERY_SUBTOTAL = 50000;

export function addToCart(cart: CartItem[], product: Product, quantity = 1): CartItem[] {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new RangeError('Количество товара должно быть положительным целым числом.');
    }

    const existing = cart.find((item) => item.id === product.id);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;
    if (nextQuantity > product.stock) {
        throw new RangeError(`На складе есть только ${product.stock} шт. этого товара.`);
    }

    if (!existing) return [...cart, { ...product, quantity }];
    return cart.map((item) => (item.id === product.id ? { ...item, quantity: nextQuantity } : item));
}

export function calculateOrderTotal(cart: OrderItem[], promoCode = ''): OrderTotal {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasDiscount = promoCode === PROMO_CODE && subtotal >= PROMO_MIN_SUBTOTAL;
    const discount = hasDiscount ? Math.round(subtotal * PROMO_RATE) : 0;
    const delivery = subtotal > 0 && subtotal < FREE_DELIVERY_SUBTOTAL ? DELIVERY_PRICE : 0;

    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
