import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { categories, products } from '../data/products';
import { store } from '../data/store';
import { formatBRL } from '../lib/money';
import { Img } from '../components/Img';
import { InView } from '../components/ui/in-view';
import { TransitionPanel } from '../components/ui/transition-panel';
import { AnimatedBackground } from '../components/ui/animated-background';
import { SwingingRail } from '../components/ui/swinging-rail';
import type { Route } from '../lib/router';

// As vitrines que a Aniz monta na loja.
const WINDOWS = [
  { id: 'lua', name: 'Lua Luá', image: 'Dd-PqM6DSWz_1', alt: 'Canto da Lua Luá na Aniz, com pijamas rosa na arara e a placa da marca' },
  { id: 'caes', name: 'Cãezinhos fofos', image: 'Dc_BSPZEQK6_3', alt: 'Vitrine da Aniz com camisola de cachorrinhos e o letreiro Cãezinhos fofos' },
  { id: 'praia', name: 'Verão na praia', image: 'DcblDxjERIb_6', alt: 'Biquíni e maiô de folhagens preto e branco pendurados na loja' },
  { id: 'viagem', name: 'Pra viajar', image: 'Dax6Re8Dout_4', alt: 'Mala e frasqueira bordô de losangos sobre colcha branca' },
] as const;

const RACK_PRODUCTS = products.filter((p) => [
  'pijama-curto-listras-rosa',
  'pijama-curto-cerejas',
  'pijama-alcinha-listras',
  'pijama-regata-caezinhos',
  'conjunto-top-canelado',
  'praia-palmeiras',
  'praia-marinho-macrame',
  'biquini-garcas',
].includes(p.id));

const RACK_CUTOUTS: Record<string, string> = {
  'pijama-curto-listras-rosa': 'rail-pijama-listras.png',
  'pijama-curto-cerejas': 'rail-pijama-cerejas.png',
  'pijama-alcinha-listras': 'rail-pijama-alcinha.png',
  'pijama-regata-caezinhos': 'rail-pijama-caezinhos.png',
  'conjunto-top-canelado': 'rail-top-canelado.png',
  'praia-palmeiras': 'rail-moda-praia.png',
  'praia-marinho-macrame': 'rail-praia-marinho.png',
  'biquini-garcas': 'rail-biquini-garcas.png',
};

function Vitrine() {
  const [active, setActive] = useState(0);
  const w = WINDOWS[active];
  return (
    <section className="vitrine" aria-labelledby="hero-title">
      <div className="glass">
        <TransitionPanel
          activeIndex={active}
          className="glass-panel"
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          variants={{ enter: { opacity: 0, filter: 'blur(6px)', scale: 1.02 }, center: { opacity: 1, filter: 'blur(0px)', scale: 1 }, exit: { opacity: 0, filter: 'blur(6px)' } }}
        >
          {WINDOWS.map((v, i) => (
            <figure key={v.id} className="glass-scene">
              <Img id={v.image} alt={v.alt} sizes="(min-width: 900px) 62vw, 100vw" eager={i === 0} />
            </figure>
          ))}
        </TransitionPanel>
        <span className="glass-sheen" aria-hidden="true" />
      </div>

      <div className="counter">
        <p className="hero-kicker">Lavras, Minas Gerais · desde {store.since}</p>
        <h1 id="hero-title" className="vitrine-title">ANIZ</h1>
        <p className="vitrine-sub">Pijamas, lingerie, moda praia e malas. Uma vitrine de verdade, agora também online.</p>
        <AnimatedBackground
          label="Escolher vitrine"
          className="switcher"
          items={WINDOWS.map((v) => ({ id: v.id, label: v.name }))}
          value={w.id}
          onChange={(id) => setActive(WINDOWS.findIndex((v) => v.id === id))}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        />
        <a href="#/produtos" className="link-arrow">Conhecer produtos <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Rail() {
  return (
    <section className="section rail-section" aria-labelledby="rail-title">
      <InView className="section-head">
        <h2 id="rail-title" className="h-section">Na arara</h2>
        <p className="section-sub">Arraste os cabides, ou use as setas, para ver as peças fotografadas na loja.</p>
      </InView>
      <SwingingRail
        label="Peças em destaque"
        items={RACK_PRODUCTS.map((p) => ({
          key: p.id,
          node: (
            <a href={`#/produto/${p.id}`} className="garment" draggable={false}>
              <span className="garment-cutout">
                <img src={`${import.meta.env.BASE_URL}img/${RACK_CUTOUTS[p.id]}`} alt="" width="1080" height="1440" loading="lazy" decoding="async" />
              </span>
              <span className="garment-name">{p.name}</span>
              <span className="garment-price">{formatBRL(p.priceCents)}</span>
            </a>
          ),
        }))}
      />
    </section>
  );
}

function Departments() {
  return (
    <section className="section depts" aria-labelledby="dept-title">
      <InView className="section-head">
        <h2 id="dept-title" className="h-section">Os cantinhos da loja</h2>
      </InView>
      <ul className="dept-list">
        {categories.map((c, i) => {
          const n = products.filter((p) => p.category === c.id).length;
          return (
            <InView as="li" key={c.id} delay={i * 0.06}>
              <a href={`#/produtos?categoria=${c.id}`} className="dept">
                <span className="dept-img"><Img id={c.image} alt="" sizes="(min-width: 900px) 25vw, 50vw" /></span>
                <span className="dept-name">{c.name}</span>
                <span className="dept-meta">{n} peças</span>
              </a>
            </InView>
          );
        })}
      </ul>
    </section>
  );
}

function About() {
  return (
    <section id="loja" className="section about" aria-labelledby="about-title">
      <div className="about-photo">
        <Img id="Dc_BSPZEQK6_1" alt="Cachorro salsicha de óculos de coração, mascote da coleção de cachorrinhos" sizes="(min-width: 900px) 40vw, 100vw" />
      </div>
      <div className="about-text">
        <InView><h2 id="about-title" className="h-section">Desde 1988, em Lavras</h2></InView>
        <InView delay={0.08}><p className="lead">A Aniz se apresenta assim: pijamas, lingeries, biquínis e malas. Uma loja de Minas Gerais que monta a vitrine por tema.</p></InView>
        <InView delay={0.16}><p>Nas publicações recentes estão a coleção Lua Luá em rosa, os pijamas de cachorrinhos, as bolsas De Chelles, as malas Avec Vous e os pijamas Recco de mãe e filha. Cada peça desta página veio dessas fotos.</p></InView>
      </div>
    </section>
  );
}

function Door() {
  return (
    <section id="contato" className="door" aria-labelledby="contact-title">
      <div className="door-glass">
        <h2 id="contact-title" className="door-title">Fale com a Aniz</h2>
        <p className="door-line">Pijamas · Lingerie · Moda praia · Malas · {store.city}</p>
        <ul className="door-links">
          <li><a href={store.whatsapp.url} target="_blank" rel="noopener noreferrer">WhatsApp {store.whatsapp.label}</a></li>
          <li><a href={store.phone.url}>Telefone {store.phone.label}</a></li>
          <li><a href={store.instagram.url} target="_blank" rel="noopener noreferrer">Instagram {store.instagram.handle}</a></li>
        </ul>
        <p className="door-note">Para comprar de verdade, confirmar preços, tamanhos ou o endereço, fale direto com a loja.</p>
      </div>
      <div className="door-photo">
        <Img id="Dd-PqM6DSWz_4" alt="Pijama rosa de cerejas exposto na loja, com a placa Lua Luá" sizes="(min-width: 900px) 40vw, 100vw" />
      </div>
    </section>
  );
}

export function Home({ route }: { route: Route }) {
  const section = route.params.get('secao');
  useEffect(() => {
    if (!section) return;
    const el = document.getElementById(section);
    const h = el?.querySelector<HTMLElement>('h2');
    if (el && h) requestAnimationFrame(() => { el.scrollIntoView({ block: 'start' }); h.tabIndex = -1; h.focus({ preventScroll: true }); });
  }, [section, route.nav]);
  return (
    <>
      <Vitrine />
      <Rail />
      <Departments />
      <About />
      <Door />
    </>
  );
}
