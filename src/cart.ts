export interface OrderItem {
    price: number;
    quantity: number;
}

export interface OrderTotal {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
}

const PROMO_CODE = 'SAVE10';
const PROMO_RATE = 0.1;
const PROMO_MIN_SUBTOTAL = 20000;
const DELIVERY_PRICE = 30000;
const FREE_DELIVERY_SUBTOTAL = 50000;

export function calculateOrderTotal(cart: OrderItem[], promoCode = ''): OrderTotal {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasDiscount = promoCode === PROMO_CODE && subtotal >= PROMO_MIN_SUBTOTAL;
    const discount = hasDiscount ? Math.round(subtotal * PROMO_RATE) : 0;
    const delivery = subtotal > 0 && subtotal < FREE_DELIVERY_SUBTOTAL ? DELIVERY_PRICE : 0;

    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
