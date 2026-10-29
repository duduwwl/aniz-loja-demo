import { useShop } from '../state/shop';
import { formatBRL } from '../lib/money';
import { METHOD_LABEL } from '../lib/payment';
import { Img } from '../components/Img';

export function Confirmation() {
  const { lastOrder: o } = useShop();
  if (!o) {
    return (
      <div className="page">
        <h1 className="h-page" tabIndex={-1}>Nenhum pedido nesta sessão</h1>
        <div className="empty">
          <p className="lead">O resumo do pedido de demonstração fica só na memória da aba e some ao recarregar.</p>
          <a href="#/produtos" className="btn btn-primary">Continuar navegando</a>
        </div>
      </div>
    );
  }
  const n = o.installments.length;
  return (
    <div className="page confirmation">
      <p className="demo-banner" role="note">Pedido de demonstração. Nenhuma cobrança foi realizada.</p>
      <h1 className="h-page" tabIndex={-1}>Pedido {o.number} confirmado</h1>
      <p className="page-sub">Número fictício, gerado só para esta simulação. Para comprar de verdade, fale com a Aniz pelo WhatsApp.</p>
      <div className="co-layout">
        <section aria-labelledby="conf-items" className="co-main">
          <h2 id="conf-items" className="h-small">Itens</h2>
          <ul className="lines">
            {o.lines.map((l, i) => (
              <li key={i} className="line">
                <span className="line-img"><Img id={l.image} alt="" sizes="96px" /></span>
                <div className="line-body">
                  <p className="line-name">{l.name}</p>
                  <p className="line-meta">{l.variant}</p>
                  <p className="line-meta">{l.qty} × {formatBRL(l.unitCents)}</p>
                </div>
                <p className="line-total">{formatBRL(l.lineCents)}</p>
              </li>
            ))}
          </ul>
        </section>
        <aside className="co-summary" aria-labelledby="conf-sum">
          <h2 id="conf-sum" className="h-small">Valores</h2>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{formatBRL(o.subtotal)}</dd></div>
            <div><dt>Frete</dt><dd>{formatBRL(o.shipping)}</dd></div>
            <div className="totals-grand"><dt>Total</dt><dd>{formatBRL(o.total)}</dd></div>
          </dl>
          <p><strong>Pagamento:</strong> {METHOD_LABEL[o.method]}{n > 1 ? ` em ${n}x (${o.installments.map(formatBRL).join(' + ')})` : ''}</p>
          <p className="note">{o.shippingLabel}</p>
          <a href="#/produtos" className="btn btn-primary btn-block">Continuar navegando</a>
        </aside>
      </div>
    </div>
  );
}
