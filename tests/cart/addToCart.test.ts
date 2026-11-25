import { describe, expect, it } from '@jest/globals';
import { addToCart, changeQuantity, removeFromCart } from '../../src/cart.js';
import type { CartItem } from '../../src/cart.js';
import type { Product } from '../../src/catalog.js';

const headphones: Product = {
    id: 1,
    name: 'Наушники',
    category: 'electronics',
    price: 49900,
    stock: 2,
};

describe('addToCart', () => {
    it('adds a product to an empty cart with quantity one', () => {
        expect(addToCart([], headphones)).toEqual([{ ...headphones, quantity: 1 }]);
    });

    it('increments quantity when the product is already in the cart', () => {
        const cart: CartItem[] = [{ ...headphones, quantity: 1 }];
        expect(addToCart(cart, headphones)).toEqual([{ ...headphones, quantity: 2 }]);
    });

    it('rejects adding more than the available stock', () => {
        const cart: CartItem[] = [{ ...headphones, quantity: 2 }];
        expect(() => addToCart(cart, headphones)).toThrow(RangeError);
    });

    it('rejects adding a product with no stock', () => {
        expect(() => addToCart([], { ...headphones, stock: 0 })).toThrow(RangeError);
    });

    it('does not mutate the existing cart', () => {
        const cart: CartItem[] = [{ ...headphones, quantity: 1 }];
        addToCart(cart, headphones);
        expect(cart).toEqual([{ ...headphones, quantity: 1 }]);
    });
});

describe('changeQuantity', () => {
    const cart: CartItem[] = [{ ...headphones, quantity: 1 }];

    it('changes quantity when within available stock', () => {
        expect(changeQuantity(cart, headphones.id, 2)).toEqual([{ ...headphones, quantity: 2 }]);
    });

    it('rejects zero, negative, fractional, and over-stock quantities', () => {
        for (const quantity of [0, -1, 1.5, 3]) {
            expect(() => changeQuantity(cart, headphones.id, quantity)).toThrow(RangeError);
        }
    });

    it('returns the original cart when the product is absent', () => {
        expect(changeQuantity(cart, 999, 2)).toBe(cart);
    });
});

describe('removeFromCart', () => {
    it('removes the selected product and leaves other products unchanged', () => {
        const lamp: CartItem = {
            id: 2,
            name: 'Лампа',
            category: 'home',
            price: 27900,
            stock: 3,
            quantity: 1,
        };
        expect(removeFromCart([{ ...headphones, quantity: 1 }, lamp], headphones.id)).toEqual([lamp]);
    });

    it('returns a new unchanged cart when the product is absent', () => {
        const cart: CartItem[] = [{ ...headphones, quantity: 1 }];
        expect(removeFromCart(cart, 999)).toEqual(cart);
        expect(removeFromCart(cart, 999)).not.toBe(cart);
    });
});
