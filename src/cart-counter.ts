import { readCart } from './cart-storage.js';
import type { CartItem } from './cart.js';

export function getCartItemCount(cart: CartItem[]): number {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

export function initializeCartCounter(): void {
    const counter = document.querySelector<HTMLElement>('[data-cart-count]');
    if (counter === null) throw new Error('Не найден элемент счетчика корзины.');
    const counterElement: HTMLElement = counter;

    function renderCounter(): void {
        const count = getCartItemCount(readCart());
        counterElement.textContent = String(count);
        counterElement.hidden = count === 0;
        counterElement.setAttribute('aria-label', `Количество товаров в корзине: ${count}`);
    }

    renderCounter();
    window.addEventListener('storage', (event) => {
        if (event.key === null || event.key === 'team-store-cart') renderCounter();
    });
    window.addEventListener('team-store:cart-updated', renderCounter);
}
