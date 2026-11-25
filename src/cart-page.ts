import type { CartItem } from './cart.js';
import { calculateOrderTotal } from './cart.js';
import { readCart } from './cart-storage.js';
import { formatPrice } from './format-price.js';

function getRequiredElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Не найден обязательный элемент корзины: ${selector}.`);
    return element;
}

const cartItemsElement = getRequiredElement<HTMLElement>('#cart-items');
const cartStatusElement = getRequiredElement<HTMLElement>('#cart-status');
const cartTotalElement = getRequiredElement<HTMLElement>('#cart-total');

function renderCart(): void {
    let cart: CartItem[];
    try {
        cart = readCart();
    } catch (error) {
        cartStatusElement.textContent = error instanceof Error ? error.message : String(error);
        return;
    }

    cartStatusElement.textContent = '';
    cartItemsElement.replaceChildren();

    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'text-secondary';
        emptyMessage.textContent = 'Корзина пока пуста.';
        cartItemsElement.append(emptyMessage);
        cartTotalElement.textContent = formatPrice(0);
        return;
    }

    const list = document.createElement('div');
    list.className = 'list-group mb-4';

    cart.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'list-group-item d-flex justify-content-between align-items-center gap-3';

        const description = document.createElement('div');
        const name = document.createElement('h2');
        name.className = 'h6 mb-1';
        name.textContent = item.name;

        const quantity = document.createElement('p');
        quantity.className = 'text-secondary mb-0';
        quantity.textContent = `${formatPrice(item.price)} × ${item.quantity}`;
        description.append(name, quantity);

        const lineTotal = document.createElement('span');
        lineTotal.className = 'fw-semibold text-nowrap';
        lineTotal.textContent = formatPrice(item.price * item.quantity);

        row.append(description, lineTotal);
        list.append(row);
    });

    cartItemsElement.append(list);

    const total = calculateOrderTotal(cart);
    cartTotalElement.replaceChildren();
    const subtotal = document.createElement('p');
    subtotal.className = 'mb-1';
    subtotal.textContent = `Товары: ${formatPrice(total.subtotal)}`;
    const delivery = document.createElement('p');
    delivery.className = 'mb-1';
    delivery.textContent = `Доставка: ${formatPrice(total.delivery)}`;
    const grandTotal = document.createElement('p');
    grandTotal.className = 'fs-5 fw-bold mb-0';
    grandTotal.textContent = `Итого: ${formatPrice(total.total)}`;
    cartTotalElement.append(subtotal, delivery, grandTotal);
}

renderCart();
