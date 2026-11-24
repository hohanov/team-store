export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
}

export function searchProducts(products: Product[], query: string): Product[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [...products];
    return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
}

export function filterByCategory(products: Product[], category?: string): Product[] {
    if (!category || category === 'all') return [...products];
    return products.filter((product) => product.category === category);
}
