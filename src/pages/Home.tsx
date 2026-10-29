import { useEffect, useId, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { categories, findProduct, products, type Product } from '../data/products';
import { store } from '../data/store';
import { formatBRL } from '../lib/money';
import { variantLabel } from '../lib/cart';
import { useShop } from '../state/shop';
import { Img } from '../components/Img';
import { InView } from '../components/ui/in-view';
import { TransitionPanel } from '../components/ui/transition-panel';
import { AnimatedBackground } from '../components/ui/animated-background';
import { SwingingRail } from '../components/ui/swinging-rail';
import type { Route } from '../lib/router';

// As vitrines que a Aniz monta na loja, cada uma com uma peça em destaque na etiqueta.
const WINDOWS = [
  { id: 'lua', name: 'Lua Luá', note: 'Pijamas em tons de rosa, coleção de outubro', image: 'Dd-PqM6DSWz_1', alt: 'Canto da Lua Luá na Aniz, com pijamas rosa na arara e a placa da marca', product: 'pijama-curto-cerejas' },
  { id: 'caes', name: 'Cãezinhos fofos', note: 'A vitrine dos pijamas de cachorrinho', image: 'Dc_BSPZEQK6_3', alt: 'Vitrine da Aniz com camisola de cachorrinhos e o letreiro Cãezinhos fofos', product: 'pijama-love-fur-ever' },
  { id: 'praia', name: 'Verão na praia', note: 'Biquínis e maiôs nas araras da loja', image: 'DcblDxjERIb_6', alt: 'Biquíni e maiô de folhagens preto e branco pendurados na loja', product: 'praia-folhagens-pb' },
  { id: 'viagem', name: 'Pra viajar', note: 'Malas e frasqueiras Avec Vous', image: 'Dax6Re8Dout_4', alt: 'Mala e frasqueira bordô de losangos sobre colcha branca', product: 'mala-de-bordo-avec-vous' },
] as const;

/** A etiqueta pendurada na vitrine: escolhe modelo e tamanho e já põe na sacola. */
function PriceTag({ p }: { p: Product }) {
  const { dispatch, notify } = useShop();
  const uid = useId();
  const one = <T,>(xs?: readonly T[]) => (xs && xs.length === 1 ? xs[0] : undefined);
  const [size, setSize] = useState(one(p.sizes) ?? '');
  const [model, setModel] = useState(one(p.models) ?? '');
  const [error, setError] = useState('');
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (p.models && !model) return setError('Escolha o modelo antes de adicionar.');
    if (!size) return setError('Escolha o tamanho antes de adicionar.');
    const line = { productId: p.id, color: p.colors[0].name, size, ...(p.models ? { model } : {}), qty: 1 };
    dispatch({ type: 'add', line });
    notify(`${p.name} (${variantLabel(line)}) adicionado à sacola.`);
    setError('');
  };
  const errId = `${uid}-erro`;
  const invalid = (missing: boolean) => (error && missing ? true : undefined);
  return (
    <form className="tag" onSubmit={add} noValidate aria-label={`Comprar ${p.name}`}>
      <span className="tag-eyelet" aria-hidden="true" />
      <p className="tag-name"><a href={`#/produto/${p.id}`}>{p.name}</a></p>
      <p className="tag-price">{formatBRL(p.priceCents)} <span>preço fictício</span></p>
      {p.models && (
        <fieldset className="tag-opts">
          <legend>Modelo</legend>
          {p.models.map((m) => (
            <label key={m} className="tag-opt">
              <input type="radio" name={`${uid}-m`} checked={model === m} onChange={() => { setModel(m); setError(''); }}
                aria-invalid={invalid(!model)} aria-describedby={error ? errId : undefined} />
              <span>{m}</span>
            </label>
          ))}
        </fieldset>
      )}
      {p.sizes.length > 1 && (
        <fieldset className="tag-opts">
          <legend>Tamanho</legend>
          {p.sizes.map((s) => (
            <label key={s} className="tag-opt">
              <input type="radio" name={`${uid}-s`} checked={size === s} onChange={() => { setSize(s); setError(''); }}
                aria-invalid={invalid(!size)} aria-describedby={error ? errId : undefined} />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>
      )}
      {error && <p id={errId} className="field-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary btn-block">Adicionar à sacola</button>
    </form>
  );
}

function Vitrine() {
  const [active, setActive] = useState(0);
  const w = WINDOWS[active];
  const p = findProduct(w.product)!;
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
              <figcaption className="glass-letters">
                <span className="glass-name">{v.name}</span>
                <span className="glass-note">{v.note}</span>
              </figcaption>
            </figure>
          ))}
        </TransitionPanel>
        <span className="glass-sheen" aria-hidden="true" />
      </div>

      <div className="counter">
        <h1 id="hero-title" className="vitrine-title">A vitrine da Aniz, agora online</h1>
        <p className="vitrine-sub">Pijamas, lingerie, moda praia e malas em Lavras, Minas Gerais, desde {store.since}. Uma loja de demonstração montada com as fotos da própria vitrine.</p>
        <AnimatedBackground
          label="Escolher vitrine"
          className="switcher"
          items={WINDOWS.map((v) => ({ id: v.id, label: v.name }))}
          value={w.id}
          onChange={(id) => setActive(WINDOWS.findIndex((v) => v.id === id))}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
        />
        <PriceTag key={p.id} p={p} />
        <a href="#/produtos" className="link-arrow">Ver todas as peças <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Rail() {
  const featured = products.filter((p) => p.featured);
  return (
    <section className="section rail-section" aria-labelledby="rail-title">
      <InView className="section-head">
        <h2 id="rail-title" className="h-section">Na arara</h2>
        <p className="section-sub">Arraste os cabides, ou use as setas, para ver as peças fotografadas na loja.</p>
      </InView>
      <SwingingRail
        label="Peças em destaque"
        items={featured.map((p) => ({
          key: p.id,
          node: (
            <a href={`#/produto/${p.id}`} className="garment" draggable={false}>
              <span className="garment-img"><Img id={p.images[0].id} alt="" sizes="300px" /></span>
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
