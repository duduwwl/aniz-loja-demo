// Todos os valores circulam em centavos (inteiros); só a exibição vira reais.
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatBRL = (cents: number) => brl.format(cents / 100).replace(/ /g, ' ');

/** Divide o total em n parcelas inteiras; a primeira absorve o resto, então a soma bate sempre. */
export function splitInstallments(totalCents: number, n: number): number[] {
  if (!Number.isInteger(totalCents) || totalCents < 0) throw new Error('total inválido');
  if (!Number.isInteger(n) || n < 1) throw new Error('parcelas inválidas');
  const base = Math.floor(totalCents / n);
  return Array.from({ length: n }, (_, i) => (i === 0 ? base + (totalCents - base * n) : base));
}
