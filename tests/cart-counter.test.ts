import { describe, expect, it } from '@jest/globals';
import { getCartItemCount } from '../src/cart-counter.js';
import type { CartItem } from '../src/cart.js';

describe('getCartItemCount', () => {
    it('returns zero for an empty cart', () => {
        expect(getCartItemCount([])).toBe(0);
    });

    it('sums item quantities rather than counting product rows', () => {
        const cart: CartItem[] = [
            { id: 1, name: 'Наушники', category: 'electronics', price: 49900, stock: 8, quantity: 2 },
            { id: 2, name: 'Книга', category: 'books', price: 18900, stock: 14, quantity: 3 },
        ];

        expect(getCartItemCount(cart)).toBe(5);
    });
});
