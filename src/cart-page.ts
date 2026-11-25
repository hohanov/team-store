import type { CartItem } from './cart.js';
import { calculateOrderTotal, changeQuantity, removeFromCart } from './cart.js';
import { initializeCartCounter } from './cart-counter.js';
import { readCart, saveCart } from './cart-storage.js';
import { formatPrice } from './format-price.js';

function getRequiredElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Не найден обязательный элемент корзины: ${selector}.`);
    return element;
}

const cartItemsElement = getRequiredElement<HTMLElement>('#cart-items');
const cartStatusElement = getRequiredElement<HTMLElement>('#cart-status');
const cartTotalElement = getRequiredElement<HTMLElement>('#cart-total');
const promoForm = getRequiredElement<HTMLFormElement>('#promo-form');
const promoInput = getRequiredElement<HTMLInputElement>('#promo-code');
const promoStatusElement = getRequiredElement<HTMLElement>('#promo-status');

initializeCartCounter();
let appliedPromoCode = '';

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
    } else {
        const list = document.createElement('div');
        list.className = 'list-group mb-4';

        cart.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'list-group-item d-flex flex-wrap justify-content-between align-items-center gap-3';

            const description = document.createElement('div');
            const name = document.createElement('h2');
            name.className = 'h6 mb-1';
            name.textContent = item.name;

            const quantityText = document.createElement('p');
            quantityText.className = 'text-secondary mb-0';
            quantityText.textContent = `${formatPrice(item.price)} × ${item.quantity}`;
            description.append(name, quantityText);

            const lineTotal = document.createElement('span');
            lineTotal.className = 'fw-semibold text-nowrap';
            lineTotal.textContent = formatPrice(item.price * item.quantity);

            const actions = document.createElement('div');
            actions.className = 'btn-group btn-group-sm';

            const decreaseButton = document.createElement('button');
            decreaseButton.className = 'btn btn-outline-secondary';
            decreaseButton.type = 'button';
            decreaseButton.dataset.decrease = String(item.id);
            decreaseButton.setAttribute('aria-label', `Уменьшить количество: ${item.name}`);
            decreaseButton.textContent = '−';
            decreaseButton.disabled = item.quantity <= 1;

            const increaseButton = document.createElement('button');
            increaseButton.className = 'btn btn-outline-secondary';
            increaseButton.type = 'button';
            increaseButton.dataset.increase = String(item.id);
            increaseButton.setAttribute('aria-label', `Увеличить количество: ${item.name}`);
            increaseButton.textContent = '+';
            increaseButton.disabled = item.quantity >= item.stock;

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-outline-danger';
            removeButton.type = 'button';
            removeButton.dataset.remove = String(item.id);
            removeButton.textContent = 'Удалить';

            actions.append(decreaseButton, increaseButton, removeButton);
            row.append(description, lineTotal, actions);
            list.append(row);
        });

        cartItemsElement.append(list);
    }

    const total = calculateOrderTotal(cart, appliedPromoCode);
    cartTotalElement.replaceChildren();
    const subtotal = document.createElement('p');
    subtotal.className = 'mb-1';
    subtotal.textContent = `Товары: ${formatPrice(total.subtotal)}`;
    const discount = document.createElement('p');
    discount.className = 'mb-1';
    discount.textContent = `Скидка: −${formatPrice(total.discount)}`;
    const delivery = document.createElement('p');
    delivery.className = 'mb-1';
    delivery.textContent = `Доставка: ${formatPrice(total.delivery)}`;
    const grandTotal = document.createElement('p');
    grandTotal.className = 'fs-5 fw-bold mb-0';
    grandTotal.textContent = `Итого: ${formatPrice(total.total)}`;
    cartTotalElement.append(subtotal, discount, delivery, grandTotal);
}

cartItemsElement.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('[data-increase], [data-decrease], [data-remove]');
    if (!button) return;

    const productId = Number(button.dataset.increase ?? button.dataset.decrease ?? button.dataset.remove);
    try {
        const cart = readCart();
        const item = cart.find((cartItem) => cartItem.id === productId);
        let updatedCart = cart;

        if (button.dataset.increase && item) updatedCart = changeQuantity(cart, productId, item.quantity + 1);
        if (button.dataset.decrease && item) updatedCart = changeQuantity(cart, productId, item.quantity - 1);
        if (button.dataset.remove) updatedCart = removeFromCart(cart, productId);

        saveCart(updatedCart);
        renderCart();
    } catch (error) {
        cartStatusElement.textContent = error instanceof Error ? error.message : String(error);
    }
});

promoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    appliedPromoCode = promoInput.value.trim();

    if (!appliedPromoCode) {
        promoStatusElement.textContent = '';
        renderCart();
        return;
    }

    try {
        const total = calculateOrderTotal(readCart(), appliedPromoCode);
        if (total.discount > 0) {
            promoStatusElement.className = 'mt-2 text-success';
            promoStatusElement.textContent = 'Промокод применён.';
        } else {
            promoStatusElement.className = 'mt-2 text-danger';
            promoStatusElement.textContent = 'Промокод не применён: проверьте код и условия заказа.';
        }
        renderCart();
    } catch (error) {
        cartStatusElement.textContent = error instanceof Error ? error.message : String(error);
    }
});

renderCart();
