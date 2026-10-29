import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { availabilityLabel, categoryName, findProduct, products, type Product } from '../data/products';
import { formatBRL } from '../lib/money';
import { variantLabel } from '../lib/cart';
import { useShop } from '../state/shop';
import { Img } from '../components/Img';
import { QtyStepper } from '../components/CartDrawer';
import { ColorSelector } from '../components/ui/color-selector';
import { ProductCard } from './Catalog';
import { NotFound } from './NotFound';

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const img = p.images[i] ?? p.images[0];
  return (
    <div className="gallery">
      <div className="gallery-main f-rosa">
        <Img key={img.id} id={img.id} alt={img.alt} sizes="(min-width: 900px) 50vw, 100vw" eager className="gallery-img" />
      </div>
      {p.images.length > 1 && (
        <div className="thumbs" role="group" aria-label="Fotos do produto">
          {p.images.map((im, n) => (
            <button key={im.id} type="button" className="thumb" aria-pressed={n === i} onClick={() => setI(n)} aria-label={`Ver foto ${n + 1} de ${p.images.length}: ${im.alt}`}>
              <Img id={im.id} alt="" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SizeGuide({ kind }: { kind: 'roupa' | 'sutia' }) {
  return (
    <details className="size-guide">
      <summary>Guia de medidas (ilustrativo)</summary>
      <p className="note">A Aniz não publicou tabela oficial. Estas medidas são <strong>apenas um exemplo</strong>; confirme com a loja antes de comprar.</p>
      {kind === 'roupa' ? (
        <table>
          <caption className="sr-only">Medidas ilustrativas em centímetros</caption>
          <thead><tr><th scope="col">Tam.</th><th scope="col">Busto</th><th scope="col">Cintura</th><th scope="col">Quadril</th></tr></thead>
          <tbody>
            <tr><th scope="row">P</th><td>84–88</td><td>64–68</td><td>90–94</td></tr>
            <tr><th scope="row">M</th><td>89–94</td><td>69–74</td><td>95–100</td></tr>
            <tr><th scope="row">G</th><td>95–100</td><td>75–80</td><td>101–106</td></tr>
            <tr><th scope="row">GG</th><td>101–108</td><td>81–88</td><td>107–114</td></tr>
          </tbody>
        </table>
      ) : (
        <table>
          <caption className="sr-only">Medidas ilustrativas de sutiã em centímetros</caption>
          <thead><tr><th scope="col">Tam.</th><th scope="col">Abaixo do busto</th></tr></thead>
          <tbody>
            <tr><th scope="row">40</th><td>66–70</td></tr>
            <tr><th scope="row">42</th><td>71–75</td></tr>
            <tr><th scope="row">44</th><td>76–80</td></tr>
            <tr><th scope="row">46</th><td>81–85</td></tr>
            <tr><th scope="row">48</th><td>86–90</td></tr>
          </tbody>
        </table>
      )}
    </details>
  );
}

function OptionRadios({ legend, name, options, value, onChange, error }: { legend: string; name: string; options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  const errId = `${name}-erro`;
  return (
    <fieldset className="option-group" aria-describedby={error ? errId : undefined} aria-invalid={error ? true : undefined}>
      <legend>{legend}</legend>
      <div className="opt-list">
        {options.map((o) => (
          <label key={o} className="opt"><input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} /><span>{o}</span></label>
        ))}
      </div>
      {error && <p id={errId} className="field-error">{error}</p>}
    </fieldset>
  );
}

export function ProductPage({ id }: { id: string }) {
  const p = findProduct(id);
  if (!p) return <NotFound />;
  return <ProductView key={p.id} p={p} />;
}

function ProductView({ p }: { p: Product }) {
  const { dispatch, notify } = useShop();
  const uid = useId();
  const single = <T,>(xs: T[] | undefined) => (xs && xs.length === 1 ? xs[0] : undefined);
  const [color, setColor] = useState(single(p.colors)?.name ?? '');
  const [size, setSize] = useState(single(p.sizes) ?? '');
  const [model, setModel] = useState(single(p.models) ?? '');
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<{ color?: string; size?: string; model?: string }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const soldOut = p.availability === 'esgotado';

  useEffect(() => { document.title = `${p.name} · Aniz (demonstração)`; }, [p.name]);

  const related = [
    ...products.filter((x) => x.category === p.category && x.id !== p.id),
    ...products.filter((x) => x.category !== p.category && x.featured),
  ].slice(0, 4);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (p.models && !model) err.model = `Escolha o modelo antes de adicionar.`;
    if (!color) err.color = 'Escolha uma cor antes de adicionar.';
    if (!size) err.size = 'Escolha um tamanho antes de adicionar.';
    setErrors(err);
    if (Object.keys(err).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"] input')?.focus());
      return;
    }
    const line = { productId: p.id, color, size, ...(p.models ? { model } : {}), qty };
    dispatch({ type: 'add', line });
    notify(`${p.name} (${variantLabel(line)}) × ${qty} adicionado à sacola.`);
  };

  return (
    <div className="page product">
      <nav aria-label="Trilha" className="crumbs">
        <a href="#/produtos">Produtos</a> <span aria-hidden="true">/</span>{' '}
        <a href={`#/produtos?categoria=${p.category}`}>{categoryName(p.category)}</a>
      </nav>
      <div className="product-layout">
        <Gallery p={p} />
        <div className="product-info">
          <h1 className="h-product" tabIndex={-1}>{p.name}</h1>
          <p className="product-meta">{categoryName(p.category)}{p.brand ? ` · ${p.brand}` : ''} · <span className={`avail ${p.availability}`}>{availabilityLabel[p.availability]}</span></p>
          <p className="product-price">{formatBRL(p.priceCents)} <span className="note">preço fictício</span></p>
          <p className="product-desc">{p.description}</p>

          <form ref={formRef} className="buy" onSubmit={add} noValidate aria-label="Escolher variação e adicionar à sacola">
            {p.models && <OptionRadios legend="Modelo" name={`${uid}-modelo`} options={p.models} value={model} onChange={(v) => { setModel(v); setErrors((e) => ({ ...e, model: undefined })); }} error={errors.model} />}
            <div>
              <ColorSelector name={`${uid}-cor`} colors={p.colors} value={color} invalid={!!errors.color} describedBy={errors.color ? `${uid}-cor-erro` : undefined}
                onChange={(v) => { setColor(v); setErrors((e) => ({ ...e, color: undefined })); }} />
              {errors.color && <p id={`${uid}-cor-erro`} className="field-error">{errors.color}</p>}
            </div>
            <OptionRadios legend="Tamanho" name={`${uid}-tam`} options={p.sizes} value={size} onChange={(v) => { setSize(v); setErrors((e) => ({ ...e, size: undefined })); }} error={errors.size} />
            {p.sizeGuide && <SizeGuide kind={p.sizeGuide} />}
            <div className="buy-row">
              <QtyStepper value={qty} onChange={setQty} label={p.name} />
              <button type="submit" className="btn btn-primary btn-grow" disabled={soldOut}>{soldOut ? 'Esgotado' : 'Adicionar à sacola'}</button>
            </div>
            <p className="note">Tamanhos e disponibilidade são demonstrativos. Confirme com a loja.</p>
          </form>

          <h2 className="h-small">O que se vê na foto</h2>
          <ul className="details">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>
          <p className="source">
            Foto original: <a href={p.source.post} target="_blank" rel="noopener noreferrer">publicação do @loja_aniz<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
            {p.source.caption ? ` · ${p.source.caption}` : ''}
          </p>
        </div>
      </div>

      <section className="related" aria-labelledby="rel-title">
        <h2 id="rel-title" className="h-section">Combina com</h2>
        <ul className="grid grid-4">
          {related.map((r, i) => <li key={r.id}><ProductCard p={r} i={i + 1} /></li>)}
        </ul>
      </section>
    </div>
  );
}
