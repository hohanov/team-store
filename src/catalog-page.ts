import type { Product } from './catalog.js';
import products from './data/products.js';

function getRequiredElement<T extends Element>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Не найден обязательный элемент каталога: ${selector}.`);
    return element;
}

const catalogElement = getRequiredElement<HTMLElement>('#catalog');

const formatPrice = (price: number): string =>
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price / 100);

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
    stock.className = `badge align-self-start ${product.stock > 0 ? 'text-bg-success' : 'text-bg-secondary'}`;
    stock.textContent = product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии';

    cardBody.append(category, title, price, stock);
    card.append(cardBody);
    column.append(card);
    return column;
}

catalogElement.replaceChildren(...products.map(renderProductCard));
