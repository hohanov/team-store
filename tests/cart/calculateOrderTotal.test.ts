import { describe, expect, it } from '@jest/globals';
import { calculateOrderTotal } from '../../src/cart.js';
import type { OrderItem } from '../../src/cart.js';

const headphones: OrderItem = { price: 49900, quantity: 1 };
const lamp: OrderItem = { price: 27900, quantity: 2 };

describe('calculateOrderTotal', () => {
    it('returns zero totals for an empty cart', () => {
        expect(calculateOrderTotal([])).toEqual({ subtotal: 0, discount: 0, delivery: 0, total: 0 });
    });

    it('calculates subtotal for multiple items and free delivery over the threshold', () => {
        expect(calculateOrderTotal([headphones, lamp])).toEqual({
            subtotal: 105700,
            discount: 0,
            delivery: 0,
            total: 105700,
        });
    });

    it('adds delivery when the subtotal is below the free-delivery threshold', () => {
        expect(calculateOrderTotal([headphones])).toEqual({
            subtotal: 49900,
            discount: 0,
            delivery: 30000,
            total: 79900,
        });
    });

    it('applies SAVE10 to an eligible order', () => {
        expect(calculateOrderTotal([headphones], 'SAVE10')).toEqual({
            subtotal: 49900,
            discount: 4990,
            delivery: 30000,
            total: 74910,
        });
    });

    it('does not apply a discount to an ineligible subtotal or unknown promo code', () => {
        const inexpensiveItem: OrderItem = { price: 19900, quantity: 1 };
        expect(calculateOrderTotal([inexpensiveItem], 'SAVE10')).toEqual({
            subtotal: 19900,
            discount: 0,
            delivery: 30000,
            total: 49900,
        });
        expect(calculateOrderTotal([headphones], 'UNKNOWN').discount).toBe(0);
    });

    it('includes the exact promo and free-delivery threshold amounts', () => {
        expect(calculateOrderTotal([{ price: 20000, quantity: 1 }], 'SAVE10')).toEqual({
            subtotal: 20000,
            discount: 2000,
            delivery: 30000,
            total: 48000,
        });
        expect(calculateOrderTotal([{ price: 50000, quantity: 1 }])).toEqual({
            subtotal: 50000,
            discount: 0,
            delivery: 0,
            total: 50000,
        });
    });
});
