import { describe, expect, it, beforeEach, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { STORAGE_KEY } from './lib/cart';

const go = async (hash: string) => {
  await act(async () => { window.location.hash = hash; window.dispatchEvent(new HashChangeEvent('hashchange')); });
};

async function fillCheckout(user: ReturnType<typeof userEvent.setup>, phone = '35999991234') {
  await user.type(screen.getByLabelText('Nome completo'), 'Ana Souza');
  await user.type(screen.getByLabelText('E-mail'), 'ana@email.com');
  await user.type(screen.getByLabelText('Telefone com DDD'), phone);
  await user.click(screen.getByRole('button', { name: 'Continuar para entrega' }));
  for (const [l, v] of [['CEP', '37200000'], ['Rua ou avenida', 'Rua das Flores'], ['Número', '10'], ['Bairro', 'Centro'], ['Cidade', 'Lavras']]) {
    await user.type(screen.getByLabelText(l), v);
  }
  await user.selectOptions(screen.getByLabelText('Estado'), 'MG');
}

describe('fluxo de compra demonstrativo', () => {
  beforeEach(() => { localStorage.clear(); window.location.hash = '#/'; });

  it('apresenta a nova vitrine sem etiqueta de compra nem CTA genérica', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'ANIZ' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Peças em destaque' })).toBeInTheDocument();
    expect(screen.queryByRole('form', { name: 'Comprar Pijama curto estampa cerejas' })).toBeNull();
    expect(screen.queryByText('Pijamas em tons de rosa, coleção de outubro')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Ver todas as peças' })).toBeNull();
  });

  it('mantém oito roupas recortadas na arara', () => {
    render(<App />);

    const rail = screen.getByRole('region', { name: 'Peças em destaque' });
    expect(within(rail).getAllByRole('link')).toHaveLength(8);
    expect(within(rail).getByRole('link', { name: /Pijama de alcinha listrado/ })).toBeInTheDocument();
    expect(within(rail).getByRole('link', { name: /Pijama regata cãezinhos/ })).toBeInTheDocument();
    expect(within(rail).getByRole('link', { name: /Top e calcinha canelados/ })).toBeInTheDocument();
    expect(within(rail).getByRole('link', { name: /Biquíni estampa garças/ })).toBeInTheDocument();
    expect(within(rail).queryByRole('link', { name: /Mala de bordo|Bolsa/ })).toBeNull();
  });

  it('exige tamanho, adiciona dois tamanhos, persiste e conclui com Pix', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await go('#/produto/pijama-curto-cerejas');
    expect(await screen.findByRole('heading', { level: 1, name: 'Pijama curto estampa cerejas' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Adicionar à sacola' }));
    expect(screen.getByText('Escolha um tamanho antes de adicionar.')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'M' }));
    await user.click(screen.getByRole('button', { name: 'Adicionar à sacola' }));
    await user.click(screen.getByRole('radio', { name: 'G' }));
    await user.click(screen.getByRole('button', { name: 'Adicionar à sacola' }));

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved).toHaveLength(2);
    expect(Object.keys(saved[0]).sort()).toEqual(['color', 'productId', 'qty', 'size']); // nada de preço nem dado pessoal
    expect(screen.getByRole('button', { name: /Abrir sacola, 2 itens/ })).toBeInTheDocument();

    // "recarregar": a sacola volta do armazenamento
    unmount();
    render(<App />);
    expect(screen.getByRole('button', { name: /Abrir sacola, 2 itens/ })).toBeInTheDocument();

    await go('#/checkout');
    await screen.findByRole('heading', { level: 1, name: 'Checkout' });
    expect(screen.getByText('Compra demonstrativa — nenhuma cobrança será realizada')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar para entrega' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Informe seu nome completo.');
    expect(screen.getByLabelText('Nome completo')).toHaveAttribute('aria-invalid', 'true');

    await fillCheckout(user);
    // voltar e avançar não perde dados
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(screen.getByLabelText('Nome completo')).toHaveValue('Ana Souza');
    await user.click(screen.getByRole('button', { name: 'Continuar para entrega' }));
    expect(screen.getByLabelText('Cidade')).toHaveValue('Lavras');
    // pular de etapa pelo indicador também não perde o que foi digitado
    await user.clear(screen.getByLabelText('Bairro'));
    await user.type(screen.getByLabelText('Bairro'), 'Jardim');
    await user.click(screen.getByRole('button', { name: /Identificação/ }));
    await user.click(screen.getByRole('button', { name: 'Continuar para entrega' }));
    expect(screen.getByLabelText('Bairro')).toHaveValue('Jardim');
    await user.click(screen.getByRole('button', { name: 'Continuar para pagamento' }));

    await user.click(screen.getByRole('radio', { name: /Pix/ }));
    await user.click(screen.getByRole('button', { name: 'Revisar pedido' }));
    await user.click(screen.getByRole('button', { name: /Pagar R\$ 379,70 \(simulação\)/ }));
    expect(screen.getByRole('img', { name: /QR Code de demonstração/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Simular pagamento aprovado' }));

    expect(await screen.findByText('Pedido de demonstração. Nenhuma cobrança foi realizada.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /Pedido AZ-\d{6} confirmado/ })).toBeInTheDocument();
    const values = within(screen.getByRole('complementary', { name: 'Valores' })).getAllByRole('definition');
    expect(values.map((d) => d.textContent)).toEqual(['R$ 359,80', 'R$ 19,90', 'R$ 379,70']);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([]);
    expect(screen.getByRole('button', { name: /Abrir sacola, 0 itens/ })).toBeInTheDocument();
  });

  it('cartão recusado permite nova tentativa e depois aprova no crédito parcelado', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ productId: 'mala-de-bordo-avec-vous', color: 'Bordô losangos', size: 'Único', qty: 1 }]));
    render(<App />);
    await go('#/checkout');
    await screen.findByRole('heading', { level: 1, name: 'Checkout' });
    await fillCheckout(user, '3538223983');
    await user.click(screen.getByRole('button', { name: 'Continuar para pagamento' }));
    await user.click(screen.getByRole('radio', { name: /Cartão de crédito/ }));
    await user.selectOptions(screen.getByLabelText('Parcelamento (fictício)'), '3');
    await user.click(screen.getByRole('button', { name: 'Revisar pedido' }));
    await user.click(screen.getByRole('button', { name: /Pagar/ }));
    await user.click(screen.getByRole('radio', { name: 'Pagamento recusado' }));
    await user.click(screen.getByRole('button', { name: /Pagar/ }));
    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(await screen.findByText(/Pagamento recusado \(simulação\)/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toHaveLength(1); // falha não limpa a sacola
    await user.click(screen.getByRole('radio', { name: 'Pagamento aprovado' }));
    await user.click(screen.getByRole('button', { name: /Pagar/ }));
    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(await screen.findByText('Pedido de demonstração. Nenhuma cobrança foi realizada.')).toBeInTheDocument();
    // 349,90 + 19,90 = 369,80 em 3x: 123,28 + 123,26 + 123,26
    expect(screen.getByText(/em 3x \(R\$ 123,28 \+ R\$ 123,26 \+ R\$ 123,26\)/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('checkout com sacola vazia bloqueia a finalização', async () => {
    render(<App />);
    await go('#/checkout');
    await screen.findByRole('heading', { level: 1, name: 'Checkout' });
    expect(screen.getByText(/Sua sacola está vazia, então não há o que finalizar/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pagar/ })).toBeNull();
  });

  it('sacola: altera quantidade, remove e mostra estado vazio', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ productId: 'pijama-curto-cerejas', color: 'Rosa-claro', size: 'M', qty: 1 }]));
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Abrir sacola/ }));
    const bag = screen.getByRole('dialog', { name: /Sacola/ });
    await user.click(within(bag).getByRole('button', { name: /Aumentar quantidade/ }));
    expect(within(bag).getAllByText('R$ 359,80').length).toBeGreaterThan(0);
    await user.click(within(bag).getByRole('button', { name: /Remover/ }));
    expect(within(bag).getByText('Sua sacola está vazia.')).toBeInTheDocument();
  });
});
