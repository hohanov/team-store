import type { CartItem } from './cart.js';

export const CART_STORAGE_KEY = 'team-store-cart';

function isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) return false;
    const item = value as Partial<CartItem>;
    return (
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        typeof item.category === 'string' &&
        typeof item.price === 'number' &&
        typeof item.stock === 'number' &&
        typeof item.quantity === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
}

export function readCart(): CartItem[] {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart === null) return [];

    const parsed: unknown = JSON.parse(storedCart);
    if (!Array.isArray(parsed) || !parsed.every(isCartItem)) {
        throw new Error('Сохранённая корзина имеет неверный формат.');
    }
    return parsed;
}

export function saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('team-store:cart-updated'));
}
