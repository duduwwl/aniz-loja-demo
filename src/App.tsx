import { lazy, Suspense, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { useRoute } from './lib/router';
import { ShopProvider } from './state/shop';
import { Footer, Header, Toast } from './components/Chrome';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductPage } from './pages/ProductPage';
import { Confirmation } from './pages/Confirmation';
import { NotFound } from './pages/NotFound';

// o checkout (QR Code, formulários) só carrega quando alguém chega nele
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })));

const TITLES: Record<string, string> = {
  '': 'Aniz · Pijamas, lingerie, praia e malas em Lavras (demonstração)',
  produtos: 'Produtos · Aniz (demonstração)',
  checkout: 'Checkout · Aniz (demonstração)',
  pedido: 'Pedido de demonstração · Aniz',
};

export default function App() {
  const route = useRoute();
  const [head, arg] = route.parts;

  useEffect(() => {
    if (head !== 'produto') document.title = TITLES[head ?? ''] ?? 'Aniz (demonstração)';
    // checkout e confirmação não devem ser indexados
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute('content', head === 'checkout' || head === 'pedido' ? 'noindex, nofollow' : 'index, follow');
  }, [head]);

  // nova página: topo e foco no título, para teclado e leitor de tela
  useEffect(() => {
    if (route.params.get('secao')) return;
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => {
      const h1 = document.querySelector<HTMLElement>('main h1');
      if (h1 && route.nav > 0) { if (!h1.hasAttribute('tabindex')) h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    });
  }, [route.path, route.nav]); // eslint-disable-line react-hooks/exhaustive-deps

  let page;
  if (!head) page = <Home route={route} />;
  else if (head === 'produtos') page = <Catalog key={route.nav} route={route} />; // cada navegação externa relê os filtros da URL;
  else if (head === 'produto' && arg) page = <ProductPage id={arg} />;
  else if (head === 'checkout') page = <Checkout />;
  else if (head === 'pedido') page = <Confirmation />;
  else page = <NotFound />;

  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>
        <a href="#conteudo" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus(); }}>Pular para o conteúdo</a>
        <Header route={route} />
        <main id="conteudo" tabIndex={-1} key={head ?? 'home'} className="route-fade"><Suspense fallback={<p className="page">Carregando…</p>}>{page}</Suspense></main>
        <Footer />
        <CartDrawer />
        <Toast />
      </ShopProvider>
    </MotionConfig>
  );
}
