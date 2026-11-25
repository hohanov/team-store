import type { Product } from './catalog.js';
import { filterByCategory, searchProducts, sortProductsByPrice } from './catalog.js';
import { addToCart } from './cart.js';
import { initializeCartCounter } from './cart-counter.js';
import { readCart, saveCart } from './cart-storage.js';
import products from './data/products.js';
import { formatPrice } from './format-price.js';

function getRequiredElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Не найден обязательный элемент каталога: ${selector}.`);
    return element;
}

const catalogElement = getRequiredElement<HTMLElement>('#catalog');
const statusElement = getRequiredElement<HTMLElement>('#catalog-status');
const cartStatusElement = getRequiredElement<HTMLElement>('#cart-status');
const searchInput = getRequiredElement<HTMLInputElement>('#search');
const categorySelect = getRequiredElement<HTMLSelectElement>('#category');
const sortSelect = getRequiredElement<HTMLSelectElement>('#sort');

initializeCartCounter();

function renderProductCard(product: Product): HTMLElement {
    const column = document.createElement('div');
    column.className = 'col';

    const card = document.createElement('article');
    card.className = 'card catalog-card h-100';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';

    const category = document.createElement('p');
    category.className = 'small text-secondary text-uppercase mb-2';
    category.textContent = product.category;

    const title = document.createElement('h2');
    title.className = 'h5 card-title';
    title.textContent = product.name;

    const price = document.createElement('p');
    price.className = 'fs-5 fw-semibold mb-3';
    price.textContent = formatPrice(product.price);

    const stock = document.createElement('span');
    stock.className = `badge ${product.stock > 0 ? 'text-bg-success' : 'text-bg-secondary'}`;
    stock.textContent = product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии';

    const actions = document.createElement('div');
    actions.className = 'catalog-card-actions mt-auto';

    const addButton = document.createElement('button');
    addButton.className = 'btn btn-primary btn-sm';
    addButton.type = 'button';
    addButton.dataset.addToCart = String(product.id);
    addButton.textContent = 'В корзину';
    addButton.disabled = product.stock === 0;

    actions.append(stock, addButton);
    cardBody.append(category, title, price, actions);
    card.append(cardBody);
    column.append(card);
    return column;
}

function renderCatalog(): void {
    const categoryProducts = filterByCategory(products, categorySelect.value);
    const matchingProducts = searchProducts(categoryProducts, searchInput.value);
    const sortDirection = sortSelect.value === 'desc' ? 'desc' : 'asc';
    const visibleProducts = sortProductsByPrice(matchingProducts, sortDirection);

    statusElement.textContent = `Найдено товаров: ${visibleProducts.length}`;
    if (visibleProducts.length === 0) {
        const message = document.createElement('p');
        message.className = 'col-12 alert alert-light mb-0';
        message.textContent = 'По вашему запросу ничего не найдено.';
        catalogElement.replaceChildren(message);
        return;
    }

    catalogElement.replaceChildren(...visibleProducts.map(renderProductCard));
}

searchInput.addEventListener('input', renderCatalog);
categorySelect.addEventListener('change', renderCatalog);
sortSelect.addEventListener('change', renderCatalog);
renderCatalog();

catalogElement.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('[data-add-to-cart]');
    if (!button) return;

    const productId = Number(button.dataset.addToCart);
    const product = products.find((item) => item.id === productId);
    if (!product) {
        cartStatusElement.textContent = 'Не удалось найти выбранный товар.';
        return;
    }

    try {
        const cart = addToCart(readCart(), product);
        saveCart(cart);
        // cartStatusElement.textContent = `«${product.name}» добавлен в корзину.`;
    } catch (error) {
        cartStatusElement.textContent = error instanceof Error ? error.message : String(error);
    }
});
