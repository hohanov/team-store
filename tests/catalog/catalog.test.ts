import { describe, expect, it } from '@jest/globals';
import { filterByCategory, searchProducts } from '../../src/catalog.js';
import type { Product } from '../../src/catalog.js';

const products: Product[] = [
    { id: 1, name: 'Наушники', category: 'electronics', price: 49900, stock: 8 },
    { id: 2, name: 'JavaScript для начинающих', category: 'books', price: 18900, stock: 14 },
    { id: 3, name: 'Чехол для ноутбука', category: 'home', price: 24900, stock: 6 },
];

describe('searchProducts', () => {
    it('finds partial product names regardless of letter case and surrounding whitespace', () => {
        expect(searchProducts(products, '  JAVASCRIPT  ').map(({ id }) => id)).toEqual([2]);
    });

    it('returns all products for an empty or whitespace-only query', () => {
        expect(searchProducts(products, '')).toEqual(products);
        expect(searchProducts(products, ' \t\n')).toEqual(products);
    });

    it('returns an empty list when no product name matches', () => {
        expect(searchProducts(products, 'несуществующий товар')).toEqual([]);
    });
});

describe('filterByCategory', () => {
    it('returns products in the selected category', () => {
        expect(filterByCategory(products, 'books').map(({ id }) => id)).toEqual([2]);
    });

    it('returns all products when all categories are selected', () => {
        expect(filterByCategory(products, 'all')).toEqual(products);
    });

    it('returns an empty list when the category has no products', () => {
        expect(filterByCategory(products, 'toys')).toEqual([]);
    });
});
