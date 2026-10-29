import { describe, expect, it } from 'vitest';
import { formatBRL, splitInstallments } from './money';
import { cartReducer, lineKey, loadCart, totals, DEMO_SHIPPING_CENTS, MAX_QTY, type CartLine } from './cart';
import { maskCep, maskPhone, validateAddress, validateIdentity } from './validation';
import { buildOrder, demoPixCode, SHIPPING } from './payment';
import { filterProducts } from '../pages/Catalog';
import { products } from '../data/products';
import imageSizes from '../data/image-sizes.json';

const P = 'pijama-curto-cerejas'; // R$ 179,90
const line = (size: string, qty = 1): CartLine => ({ productId: P, color: 'Rosa-claro', size, qty });

describe('dinheiro em centavos', () => {
  it('formata em reais', () => {
    expect(formatBRL(17990)).toBe('R$ 179,90');
    expect(formatBRL(0)).toBe('R$ 0,00');
  });
  it('parcelas sempre somam o total', () => {
    for (const total of [1, 99, 10001, 53997, 123457]) for (let n = 1; n <= 6; n++) {
      const parts = splitInstallments(total, n);
      expect(parts).toHaveLength(n);
      expect(parts.reduce((a, b) => a + b, 0)).toBe(total);
      expect(parts.every(Number.isInteger)).toBe(true);
    }
    expect(splitInstallments(10000, 3)).toEqual([3334, 3333, 3333]);
  });
  it('recusa entradas inválidas', () => {
    expect(() => splitInstallments(10.5, 2)).toThrow();
    expect(() => splitInstallments(100, 0)).toThrow();
  });
});

describe('sacola', () => {
  it('mesmo produto em tamanhos diferentes vira linhas distintas', () => {
    let s = cartReducer([], { type: 'add', line: line('M') });
    s = cartReducer(s, { type: 'add', line: line('G') });
    expect(s).toHaveLength(2);
  });
  it('mesma variação soma quantidade, com teto', () => {
    let s = cartReducer([], { type: 'add', line: line('M', 2) });
    s = cartReducer(s, { type: 'add', line: line('M', 3) });
    expect(s).toHaveLength(1);
    expect(s[0].qty).toBe(5);
    s = cartReducer(s, { type: 'add', line: line('M', 50) });
    expect(s[0].qty).toBe(MAX_QTY);
  });
  it('modelos diferentes da mesma estampa são linhas distintas', () => {
    const a = { productId: 'praia-palmeiras', color: 'Terracota', size: 'M', model: 'Biquíni', qty: 1 };
    const s = cartReducer(cartReducer([], { type: 'add', line: a }), { type: 'add', line: { ...a, model: 'Maiô' } });
    expect(s).toHaveLength(2);
  });
  it('altera quantidade (mínimo 1) e remove', () => {
    let s = cartReducer([], { type: 'add', line: line('M') });
    const key = lineKey(s[0]);
    s = cartReducer(s, { type: 'setQty', key, qty: 0 });
    expect(s[0].qty).toBe(1);
    s = cartReducer(s, { type: 'setQty', key, qty: 4 });
    expect(s[0].qty).toBe(4);
    s = cartReducer(s, { type: 'remove', key });
    expect(s).toEqual([]);
  });
  it('calcula subtotal, frete e total em centavos', () => {
    const t = totals([line('M', 2), line('G', 1)]);
    expect(t.subtotal).toBe(17990 * 3);
    expect(t.shipping).toBe(DEMO_SHIPPING_CENTS);
    expect(t.total).toBe(17990 * 3 + DEMO_SHIPPING_CENTS);
    expect(t.count).toBe(3);
    expect(totals([]).total).toBe(0);
  });
  it('persistência: só aceita linhas válidas do catálogo', () => {
    const saved = JSON.stringify([
      line('M', 2),
      { productId: 'nao-existe', color: 'x', size: 'M', qty: 1 },
      { productId: P, color: 'Azul', size: 'M', qty: 1 },
      { productId: P, color: 'Rosa-claro', size: 'XXL', qty: 1 },
      { productId: P, color: 'Rosa-claro', size: 'G', qty: 99, price: 1 },
    ]);
    expect(loadCart(saved)).toEqual([line('M', 2), line('G', MAX_QTY)]);
    expect(loadCart('{lixo')).toEqual([]);
    expect(loadCart(null)).toEqual([]);
  });
});

describe('validação', () => {
  it('identificação', () => {
    expect(validateIdentity({ name: '', email: '', phone: '' })).toEqual({
      name: 'Informe seu nome completo.', email: 'Informe seu e-mail.', phone: 'Informe um telefone com DDD.',
    });
    expect(validateIdentity({ name: 'Ana', email: 'ana@x', phone: '(35) 9999' })).toMatchObject({
      name: 'Informe nome e sobrenome.', email: expect.stringContaining('inválido'), phone: expect.stringContaining('incompleto'),
    });
    expect(validateIdentity({ name: 'Ana Souza', email: 'ana@email.com', phone: '(35) 99999-1234' })).toEqual({});
  });
  it('endereço', () => {
    const ok = { cep: '37200-000', street: 'Rua A', number: '10', complement: '', district: 'Centro', city: 'Lavras', uf: 'MG' };
    expect(validateAddress(ok)).toEqual({});
    expect(validateAddress({ ...ok, cep: '3720', uf: 'XX' })).toMatchObject({ cep: expect.stringContaining('8 dígitos'), uf: 'Selecione o estado.' });
  });
  it('máscaras', () => {
    expect(maskPhone('35999991234')).toBe('(35) 99999-1234');
    expect(maskPhone('3538223983')).toBe('(35) 3822-3983');
    expect(maskCep('37200000')).toBe('37200-000');
  });
});

describe('pedido simulado', () => {
  const priced = totals([line('M', 2), line('G')]).priced;
  it('totais e parcelas consistentes no crédito', () => {
    const o = buildOrder('AZ-1', priced, () => 'v', SHIPPING[1], 'credito', 4);
    expect(o.subtotal).toBe(17990 * 3);
    expect(o.total).toBe(17990 * 3 + SHIPPING[1].cents);
    expect(o.installments).toHaveLength(4);
    expect(o.installments.reduce((a, b) => a + b, 0)).toBe(o.total);
  });
  it('pix e débito são à vista; sacola vazia não fecha pedido', () => {
    expect(buildOrder('AZ-1', priced, () => 'v', SHIPPING[0], 'pix', 6).installments).toHaveLength(1);
    expect(buildOrder('AZ-1', priced, () => 'v', SHIPPING[0], 'debito', 6).installments).toHaveLength(1);
    expect(() => buildOrder('AZ-1', [], () => 'v', SHIPPING[0], 'pix', 1)).toThrow();
  });
  it('código Pix de teste não é um BR Code válido', () => {
    const c = demoPixCode('123');
    expect(c.startsWith('000201')).toBe(false);
    expect(c).toContain('NAO-PAGAVEL');
  });
});

describe('catálogo', () => {
  const base = { q: '', cat: '' as const, onlyAvailable: false, sort: 'relevancia' as const };
  it('busca por nome sem acento', () => {
    const r = filterProducts(products, { ...base, q: 'biquini' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => /biquíni/i.test(p.name))).toBe(true);
  });
  it('ordena por preço e nome', () => {
    const asc = filterProducts(products, { ...base, sort: 'menor-preco' }).map((p) => p.priceCents);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const names = filterProducts(products, { ...base, sort: 'nome' }).map((p) => p.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  });
  it('filtra categoria e disponibilidade', () => {
    const r = filterProducts(products, { ...base, cat: 'bolsas', onlyAvailable: true });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.category === 'bolsas' && p.availability !== 'esgotado')).toBe(true);
  });
  it('ids únicos e todas as imagens existem', () => {
    const sizes = imageSizes as Record<string, unknown>;
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    for (const p of products) for (const im of p.images) expect(sizes[im.id], im.id).toBeTruthy();
  });
});
