import { describe, expect, it } from '@jest/globals';
import { addToCart } from '../../src/cart.js';
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
