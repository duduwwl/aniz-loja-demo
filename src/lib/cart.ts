import { findProduct, type Product } from '../data/products';

/** Uma linha da sacola. Só isto é salvo no navegador: produto, variação e quantidade. */
export interface CartLine {
  productId: string;
  color: string;
  size: string;
  model?: string;
  qty: number;
}

export const MAX_QTY = 10;
export const STORAGE_KEY = 'aniz-sacola-v1';
/** Frete exibido na sacola: valor simulado do envio econômico. */
export const DEMO_SHIPPING_CENTS = 1990;

export const lineKey = (l: Pick<CartLine, 'productId' | 'color' | 'size' | 'model'>) =>
  [l.productId, l.color, l.size, l.model ?? ''].join('|');

export type CartAction =
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n)));

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      const existing = state.find((l) => lineKey(l) === key);
      if (existing) return state.map((l) => (l === existing ? { ...l, qty: clampQty(l.qty + action.line.qty) } : l));
      return [...state, { ...action.line, qty: clampQty(action.line.qty) }];
    }
    case 'setQty':
      return state.map((l) => (lineKey(l) === action.key ? { ...l, qty: clampQty(action.qty) } : l));
    case 'remove':
      return state.filter((l) => lineKey(l) !== action.key);
    case 'clear':
      return [];
  }
}

export interface PricedLine extends CartLine { key: string; product: Product; lineCents: number }

export function priceLines(lines: CartLine[]): PricedLine[] {
  return lines.flatMap((l) => {
    const product = findProduct(l.productId);
    return product ? [{ ...l, key: lineKey(l), product, lineCents: product.priceCents * l.qty }] : [];
  });
}

export function totals(lines: CartLine[], shippingCents = DEMO_SHIPPING_CENTS) {
  const priced = priceLines(lines);
  const subtotal = priced.reduce((s, l) => s + l.lineCents, 0);
  const count = priced.reduce((s, l) => s + l.qty, 0);
  const shipping = subtotal > 0 ? shippingCents : 0;
  return { priced, subtotal, shipping, total: subtotal + shipping, count };
}

/** Lê a sacola salva descartando o que não existe mais no catálogo ou veio corrompido. */
export function loadCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((l): l is CartLine => {
        if (!l || typeof l.productId !== 'string' || typeof l.color !== 'string' || typeof l.size !== 'string') return false;
        const p = findProduct(l.productId);
        return !!p && p.colors.some((c) => c.name === l.color) && p.sizes.includes(l.size) &&
          (p.models ? p.models.includes(l.model as string) : l.model === undefined) && Number.isFinite(l.qty);
      })
      .map((l) => ({ productId: l.productId, color: l.color, size: l.size, ...(l.model ? { model: l.model } : {}), qty: clampQty(l.qty) }));
  } catch {
    return [];
  }
}

export const variantLabel = (l: Pick<CartLine, 'color' | 'size' | 'model'>) =>
  [l.model, l.color, l.size === 'Único' ? 'Tamanho único' : `Tam. ${l.size}`].filter(Boolean).join(' · ');
