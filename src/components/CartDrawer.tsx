import { Minus, Plus, X } from 'lucide-react';
import { useShop } from '../state/shop';
import { useDialog } from './useDialog';
import { Img } from './Img';
import { formatBRL } from '../lib/money';
import { MAX_QTY, variantLabel, type PricedLine } from '../lib/cart';

export function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  return (
    <div className="qty" role="group" aria-label={`Quantidade de ${label}`}>
      <button type="button" className="qty-btn" onClick={() => value > min && onChange(value - 1)} aria-disabled={value <= min} aria-label={`Diminuir quantidade de ${label}`}>
        <Minus size={16} aria-hidden="true" />
      </button>
      <output className="qty-value" aria-live="polite" aria-label={`${value} ${value === 1 ? 'unidade' : 'unidades'}`}>{value}</output>
      <button type="button" className="qty-btn" onClick={() => value < MAX_QTY && onChange(value + 1)} aria-disabled={value >= MAX_QTY} aria-label={`Aumentar quantidade de ${label}`}>
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export function LineItem({ line, editable }: { line: PricedLine; editable: boolean }) {
  const { dispatch } = useShop();
  return (
    <li className="line">
      <a href={`#/produto/${line.product.id}`} className="line-img" tabIndex={-1} aria-hidden="true">
        <Img id={line.product.images[0].id} alt="" sizes="96px" />
      </a>
      <div className="line-body">
        <p className="line-name"><a href={`#/produto/${line.product.id}`}>{line.product.name}</a></p>
        <p className="line-meta">{variantLabel(line)}</p>
        <p className="line-meta">{formatBRL(line.product.priceCents)} cada</p>
        {editable ? (
          <div className="line-actions">
            <QtyStepper value={line.qty} label={`${line.product.name}, ${variantLabel(line)}`} onChange={(n) => dispatch({ type: 'setQty', key: line.key, qty: n })} />
            <button type="button" className="link-btn" onClick={(e) => {
              // o botão some junto com a linha: leva o foco ao título do painel
              const h = e.currentTarget.closest('dialog, aside')?.querySelector<HTMLElement>('h2');
              dispatch({ type: 'remove', key: line.key });
              if (h) { h.tabIndex = -1; h.focus(); }
            }}>
              Remover<span className="sr-only"> {line.product.name}, {variantLabel(line)}</span>
            </button>
          </div>
        ) : (
          <p className="line-meta">Quantidade: {line.qty}</p>
        )}
      </div>
      <p className="line-total">{formatBRL(line.lineCents)}</p>
    </li>
  );
}

export function Totals({ subtotal, shipping, total, shippingNote = 'Frete demonstrativo' }: { subtotal: number; shipping: number; total: number; shippingNote?: string }) {
  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
      <div><dt>{shippingNote}</dt><dd>{formatBRL(shipping)}</dd></div>
      <div className="totals-grand"><dt>Total</dt><dd>{formatBRL(total)}</dd></div>
    </dl>
  );
}

export function CartDrawer() {
  const { bagOpen, closeBag, summary } = useShop();
  const ref = useDialog(bagOpen, closeBag);
  return (
    <dialog ref={ref} className="sheet sheet-right" aria-labelledby="bag-title">
      <div className="sheet-panel bag">
        <div className="sheet-head">
          <h2 id="bag-title" className="bag-title">Sacola {summary.count > 0 && <span className="muted">({summary.count})</span>}</h2>
          <button type="button" className="icon-btn" onClick={closeBag} aria-label="Fechar sacola"><X size={22} aria-hidden="true" /></button>
        </div>
        {summary.priced.length === 0 ? (
          <div className="bag-empty">
            <p className="lead">Sua sacola está vazia.</p>
            <p>Escolha um pijama, uma lingerie ou uma peça de praia no catálogo.</p>
            <a href="#/produtos" className="btn btn-primary" onClick={closeBag}>Ver produtos</a>
          </div>
        ) : (
          <>
            <ul className="lines">
              {summary.priced.map((l) => <LineItem key={l.key} line={l} editable />)}
            </ul>
            <div className="bag-foot">
              <Totals subtotal={summary.subtotal} shipping={summary.shipping} total={summary.total} shippingNote="Frete (simulado, envio econômico)" />
              <p className="note">Valores ilustrativos. O frete final é escolhido no checkout.</p>
              <a href="#/checkout" className="btn btn-primary btn-block" onClick={closeBag}>Ir para o checkout</a>
              <button type="button" className="btn btn-ghost btn-block" onClick={closeBag}>Continuar comprando</button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
