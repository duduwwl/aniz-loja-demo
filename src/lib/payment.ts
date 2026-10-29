// Pagamento 100% simulado no navegador. Nada aqui chama gateway, gera cobrança ou envia dados.
import type { PricedLine } from './cart';
import { splitInstallments } from './money';

export type PayMethod = 'pix' | 'credito' | 'debito';
export type CardScenario = 'aprovado' | 'recusado';

export const METHOD_LABEL: Record<PayMethod, string> = {
  pix: 'Pix (simulado)',
  credito: 'Cartão de crédito (simulado)',
  debito: 'Cartão de débito (simulado)',
};

/** Cartões fictícios: não passam na validação de nenhuma bandeira e não são aceitos em lugar algum. */
export const TEST_CARDS: Record<CardScenario, { number: string; holder: string; expiry: string; cvv: string }> = {
  aprovado: { number: '0000 0000 0000 0001', holder: 'CLIENTE TESTE', expiry: '12/30', cvv: '000' },
  recusado: { number: '0000 0000 0000 0002', holder: 'CLIENTE TESTE', expiry: '12/30', cvv: '000' },
};

export const MAX_INSTALLMENTS = 6;

export interface ShippingOption { id: 'economico' | 'expresso'; label: string; cents: number; days: string }
export const SHIPPING: ShippingOption[] = [
  { id: 'economico', label: 'Econômico (simulado)', cents: 1990, days: '7 a 10 dias úteis (prazo fictício)' },
  { id: 'expresso', label: 'Expresso (simulado)', cents: 3490, days: '2 a 4 dias úteis (prazo fictício)' },
];

/**
 * Texto do “Pix” de teste. De propósito NÃO segue o padrão BR Code/EMV (sem chave, sem CRC),
 * então nenhum app de banco consegue lê-lo como cobrança.
 */
export const demoPixCode = (orderRef: string) => `DEMONSTRACAO-ANIZ-${orderRef}-SEM-VALOR-NAO-PAGAVEL`;

export const newOrderNumber = () => `AZ-${String(Math.floor(100000 + Math.random() * 900000))}`;

export interface Order {
  number: string;
  lines: { name: string; variant: string; qty: number; unitCents: number; lineCents: number; image: string }[];
  subtotal: number;
  shipping: number;
  shippingLabel: string;
  total: number;
  method: PayMethod;
  installments: number[];
}

export function buildOrder(
  number: string, priced: PricedLine[], variant: (l: PricedLine) => string,
  shipping: ShippingOption, method: PayMethod, nInstallments: number,
): Order {
  if (!priced.length) throw new Error('sacola vazia');
  const subtotal = priced.reduce((s, l) => s + l.lineCents, 0);
  const total = subtotal + shipping.cents;
  const n = method === 'credito' ? Math.min(Math.max(1, nInstallments), MAX_INSTALLMENTS) : 1;
  return {
    number,
    lines: priced.map((l) => ({
      name: l.product.name, variant: variant(l), qty: l.qty,
      unitCents: l.product.priceCents, lineCents: l.lineCents, image: l.product.images[0].id,
    })),
    subtotal,
    shipping: shipping.cents,
    shippingLabel: `${shipping.label} · ${shipping.days}`,
    total,
    method,
    installments: splitInstallments(total, n),
  };
}

/** Simula a autorização do cartão com um pequeno atraso. */
export const simulateCard = (scenario: CardScenario, ms = 1600) =>
  new Promise<boolean>((resolve) => setTimeout(() => resolve(scenario === 'aprovado'), ms));
