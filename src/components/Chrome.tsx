import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../state/shop';
import { useDialog } from './useDialog';
import { categories } from '../data/products';
import { DEMO_NOTICE, store } from '../data/store';
import type { Route } from '../lib/router';

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`wordmark ${className ?? ''}`}>
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" className="wordmark-star">
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7" />
        </g>
      </svg>
      ANIZ
    </span>
  );
}

const NAV = [
  { href: '#/', label: 'Início', match: (r: Route) => r.path === '/' },
  { href: '#/produtos', label: 'Produtos', match: (r: Route) => r.parts[0] === 'produtos' || r.parts[0] === 'produto' },
  { href: '#/?secao=loja', label: 'A loja', match: () => false },
  { href: '#/?secao=contato', label: 'Contato', match: () => false },
];

export function Header({ route }: { route: Route }) {
  const { summary, openBag } = useShop();
  const [menu, setMenu] = useState(false);
  const [bump, setBump] = useState(false);
  const menuRef = useDialog(menu, () => setMenu(false));

  useEffect(() => {
    if (!summary.count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [summary.count]);

  const bagLabel = `Abrir sacola, ${summary.count} ${summary.count === 1 ? 'item' : 'itens'}`;

  return (
    <>
      <aside aria-label="Aviso de demonstração"><p className="demo-strip">Loja demonstrativa · nenhuma compra é real · preços ilustrativos</p></aside>
      <header className="site-header">
        <div className="header-inner">
          <a href="#/" className="header-brand" aria-label="Aniz, página inicial"><Wordmark /></a>
          <nav aria-label="Principal" className="header-nav">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={n.match(route) ? 'page' : undefined}>{n.label}</a>
            ))}
          </nav>
          <div className="header-actions">
            <button type="button" className="bag-btn" onClick={(e) => openBag(e.currentTarget)} aria-label={bagLabel}>
              <ShoppingBag size={20} aria-hidden="true" />
              <span className="bag-text">Sacola</span>
              <span className={`bag-count ${bump ? 'is-bump' : ''}`} aria-hidden="true">{summary.count}</span>
            </button>
            <button type="button" className="menu-btn" onClick={() => setMenu(true)} aria-label="Abrir menu" aria-haspopup="dialog">
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <dialog ref={menuRef} className="sheet sheet-left" aria-label="Menu">
        <div className="sheet-panel">
          <div className="sheet-head">
            <Wordmark />
            <button type="button" className="icon-btn" onClick={() => setMenu(false)} aria-label="Fechar menu"><X size={22} aria-hidden="true" /></button>
          </div>
          <nav aria-label="Menu móvel" className="mobile-nav">
            {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setMenu(false)}>{n.label}</a>)}
          </nav>
          <p className="mobile-nav-label">Categorias</p>
          <nav aria-label="Categorias" className="mobile-cats">
            {categories.map((c) => <a key={c.id} href={`#/produtos?categoria=${c.id}`} onClick={() => setMenu(false)}>{c.name}</a>)}
          </nav>
        </div>
      </dialog>
    </>
  );
}

export function Toast() {
  const { toast, openBag, dismissToast, holdToast } = useShop();
  return (
    <div className="toast-region" aria-live="polite" role="status">
      {toast && (
        <div className="toast" key={toast.id} onMouseEnter={() => holdToast(true)} onMouseLeave={() => holdToast(false)}
          onFocus={() => holdToast(true)} onBlur={() => holdToast(false)}>
          <span>{toast.text}</span>
          <button type="button" className="toast-action" onClick={(e) => openBag(e.currentTarget)}>Ver sacola</button>
          <button type="button" className="toast-close" onClick={dismissToast} aria-label="Fechar aviso"><X size={18} aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  return <>{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}</>;
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="ft ft-statement">
          <p className="ft-lead">Aniz: pijamas, lingeries, biquínis e malas em Lavras desde 1988.</p>
          <p className="ft-small">{DEMO_NOTICE} Site de demonstração com fotos públicas do perfil {store.instagram.handle}; ver créditos no README do projeto.</p>
        </div>
        <nav className="ft ft-nav" aria-label="Rodapé">
          <a href="#/">Início</a>
          <a href="#/produtos">Todos os produtos</a>
          {categories.map((c) => <a key={c.id} href={`#/produtos?categoria=${c.id}`}>{c.name}</a>)}
        </nav>
        <div className="ft ft-time">
          <p className="ft-lead">{store.city}</p>
          <p>Agora em Lavras: <LocalTime /></p>
        </div>
        <div className="ft ft-contact">
          <a href={store.whatsapp.url} target="_blank" rel="noopener noreferrer">WhatsApp {store.whatsapp.label}</a>
          <a href={store.phone.url}>Telefone {store.phone.label}</a>
          <a href={store.instagram.url} target="_blank" rel="noopener noreferrer">Instagram {store.instagram.handle}</a>
          <a href={store.facebook} target="_blank" rel="noopener noreferrer">Facebook /anizloja</a>
        </div>
        <div className="ft ft-mark" aria-hidden="true"><Wordmark /></div>
        <a className="ft ft-cta" href="#/produtos">
          <span>Ver todas as peças</span>
          <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><path d="M8 40 40 8M16 8h24v24" fill="none" stroke="currentColor" strokeWidth="4" /></svg>
        </a>
      </div>
    </footer>
  );
}
