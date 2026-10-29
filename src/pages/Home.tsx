import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { categories, products, type CategoryId } from '../data/products';
import { store } from '../data/store';
import { formatBRL } from '../lib/money';
import { Img } from '../components/Img';
import { InView } from '../components/ui/in-view';
import { BlurReveal } from '../components/ui/blur-reveal';
import type { Route } from '../lib/router';

const FIELDS = ['f-rosa', 'f-nevoa', 'f-areia', 'f-salvia'];

// Parede de peças do hero: uma foto real por peça, em campos de cor que se repetem.
const WALL = [
  'pijama-curto-cerejas', 'praia-palmeiras', 'sutia-bojo-liso', 'pijama-love-fur-ever', 'bolsa-praia-de-chelles',
  'biquini-garcas', 'pijama-pasta-lover', 'praia-marinho-macrame', 'mala-de-bordo-avec-vous', 'pijama-curto-listras-rosa',
  'conjunto-top-canelado', 'praia-folhagens-pb', 'pijama-regata-caezinhos', 'pijama-alcinha-listras', 'biquini-faixa-macrame-preto',
].map((id) => products.find((p) => p.id === id)!);

function Hero() {
  const rows = [0, 1, 2];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wall" aria-hidden="true">
        {rows.map((r) => (
          <div key={r} className={`wall-row ${r % 2 ? 'is-offset' : ''}`}>
            {[...WALL.slice(r * 5, r * 5 + 5), ...WALL.slice(((r + 1) % 3) * 5, ((r + 1) % 3) * 5 + 5)].map((p, i) => (
              <a key={`${r}-${i}`} href={`#/produto/${p.id}`} className={`tile ${FIELDS[(r + i) % 4]}`} tabIndex={-1}>
                <Img id={p.images[0].id} alt="" sizes="(min-width: 1024px) 16vw, 30vw" eager={r < 2 && i < 6} />
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="hero-panel">
        <div className="hero-copy">
          <BlurReveal id="hero-title" className="hero-title">Pijamas, lingerie, praia e malas</BlurReveal>
          <p className="hero-sub">A Aniz, de Lavras – MG, desde 1988. As peças desta loja online de demonstração foram fotografadas na nossa vitrine.</p>
        </div>
        <a href="#/produtos" className="btn btn-paper hero-cta">Ver produtos <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

/** Movimento-assinatura: índice de categorias com prévia. No toque, cada linha mostra a foto inline. */
function CategoryIndex() {
  const [active, setActive] = useState<CategoryId>('pijamas');
  const reduce = useReducedMotion();
  const current = categories.find((c) => c.id === active)!;
  return (
    <section className="section cat-index" aria-labelledby="cat-title">
      <div className="cat-list">
        <InView><h2 id="cat-title" className="h-section">O que tem na Aniz</h2></InView>
        <ul className={`cat-rows ${active ? 'has-active' : ''}`}>
          {categories.map((c, i) => {
            const items = products.filter((p) => p.category === c.id);
            const from = Math.min(...items.map((p) => p.priceCents));
            return (
              <InView as="li" key={c.id} delay={i * 0.07}>
                <a
                  href={`#/produtos?categoria=${c.id}`}
                  className={`cat-row ${active === c.id ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(c.id)}
                  onFocus={() => setActive(c.id)}
                >
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-meta">{items.length} peças · a partir de {formatBRL(from)}</span>
                  <span className={`cat-inline ${FIELDS[i]}`}><Img id={c.image} alt="" sizes="90vw" /></span>
                </a>
              </InView>
            );
          })}
        </ul>
      </div>
      <div className="cat-preview" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            className={`cat-frame ${FIELDS[categories.indexOf(current)]}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <Img id={current.image} alt="" sizes="(min-width: 1024px) 40vw, 1px" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Showcase() {
  const pair = [products.find((p) => p.id === 'pijama-love-fur-ever')!, products.find((p) => p.id === 'bolsa-praia-de-chelles')!];
  return (
    <section className="showcase" aria-labelledby="show-title">
      {pair.map((p, i) => (
        <div key={p.id} className={`show-panel ${i ? 'f-nevoa' : 'f-rosa'}`}>
          {i === 0 && <h2 id="show-title" className="h-section show-heading">Chegaram agora</h2>}
          <div className="show-object"><Img id={p.images[0].id} alt={p.images[0].alt} sizes="(min-width: 900px) 50vw, 100vw" /></div>
          <div className="show-bar">
            <p><span className="show-name">{p.name}</span><span className="show-price">{formatBRL(p.priceCents)}</span></p>
            <div className="show-actions">
              <a href={`#/produto/${p.id}`} className="btn btn-primary">Ver peça<span className="sr-only">: {p.name}</span></a>
              <a href={`#/produtos?categoria=${p.category}`} className="btn btn-paper">Ver a categoria<span className="sr-only"> de {p.name}</span></a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function Highlights() {
  const featured = products.filter((p) => p.featured);
  return (
    <section className="section strip" aria-labelledby="strip-title">
      <h2 id="strip-title" className="strip-title">Destaques da vitrine <span className="muted">{featured.length} peças</span></h2>
      <ul className="strip-row" aria-label="Destaques: role para o lado">
        {featured.map((p, i) => (
          <li key={p.id}>
            <a href={`#/produto/${p.id}`} className={`frame ${FIELDS[i % 4]}`}>
              <Img id={p.images[0].id} alt="" sizes="(min-width: 1024px) 14vw, 40vw" />
              <span className="frame-label"><span>{p.name}</span><span>{formatBRL(p.priceCents)}</span></span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  const tiles = [
    { id: 'Dd-PqM6DSWz_1', alt: 'Canto da Lua Luá na Aniz, com pijamas rosa em arara e prateleiras brancas', cap: 'O canto Lua Luá, com a coleção de outubro' },
    { id: 'Dc_BSPZEQK6_3', alt: 'Vitrine da Aniz com camisola de cachorrinhos e o texto Nossa vitrine especial Cãezinhos fofos', cap: 'A vitrine dos cãezinhos fofos' },
    { id: 'Dc_BSPZEQK6_1', alt: 'Cachorro salsicha com óculos de coração vermelho e laço no rabo', cap: 'O mascote da coleção de cachorrinhos' },
    { id: 'DcblDxjERIb_6', alt: 'Biquíni e maiô de folhagens preto e branco pendurados na loja', cap: 'Moda praia na arara da loja' },
  ];
  return (
    <section id="loja" className="section about" aria-labelledby="about-title">
      <div className="about-text">
        <InView><h2 id="about-title" className="h-section">A loja desde 1988</h2></InView>
        <InView delay={0.08}>
          <p className="lead">A Aniz é uma loja de Lavras, Minas Gerais, aberta em {store.since}. No perfil, ela se resume assim: pijamas, lingeries, biquínis e malas.</p>
        </InView>
        <InView delay={0.16}>
          <p>Nas publicações recentes aparecem a coleção Lua Luá em tons de rosa, os pijamas de cachorrinhos, as bolsas De Chelles, a linha de malas Avec Vous e os pijamas Recco de mãe e filha. É dessas fotos que vem cada peça deste catálogo.</p>
        </InView>
      </div>
      <ul className="about-tiles">
        {tiles.map((t, i) => (
          <InView as="li" key={t.id} delay={0.1 + i * 0.07}>
            <figure>
              <div className={`about-img ${FIELDS[i]}`}><Img id={t.id} alt={t.alt} sizes="(min-width: 1024px) 22vw, 45vw" /></div>
              <figcaption>{t.cap}</figcaption>
            </figure>
          </InView>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  const strip = ['DcblDxjERIb_5', 'Dddv5NAlYxE_2', 'Dd-PqM6DSWz_3', 'DcblDxjERIb_2', 'Dc_BSPZEQK6_6', 'Dax6Re8Dout_1', 'Dc57t_bEZ3p_2', 'DcblDxjERIb_3'];
  return (
    <section id="contato" className="contact" aria-labelledby="contact-title">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...strip, ...strip].map((id, i) => <Img key={i} id={id} alt="" sizes="160px" className="marquee-img" />)}
        </div>
      </div>
      <div className="contact-body">
        <div className="contact-intro">
          <h2 id="contact-title" className="h-contact">Fale com a Aniz</h2>
          <p className="contact-sub">Para comprar de verdade, confirmar preços, tamanhos ou o endereço da loja, fale direto com a Aniz.</p>
          <p className="contact-small">Loja física em {store.city}. Contatos tirados do Linktree e do Instagram oficiais da loja.</p>
        </div>
        <ul className="contact-cells">
          <li><a href={store.whatsapp.url} target="_blank" rel="noopener noreferrer"><span className="cell-v">WhatsApp {store.whatsapp.label}</span></a></li>
          <li><a href={store.phone.url}><span className="cell-v">Telefone {store.phone.label}</span></a></li>
          <li><a href={store.instagram.url} target="_blank" rel="noopener noreferrer" className="cell-invert"><span className="cell-v">Instagram {store.instagram.handle}</span></a></li>
        </ul>
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
      <Hero />
      <CategoryIndex />
      <Showcase />
      <Highlights />
      <About />
      <Contact />
    </>
  );
}
