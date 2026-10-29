import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { availabilityLabel, categories, categoryName, products, type CategoryId, type Product } from '../data/products';
import { DEMO_NOTICE } from '../data/store';
import { formatBRL } from '../lib/money';
import { Img } from '../components/Img';
import { InView } from '../components/ui/in-view';
import type { Route } from '../lib/router';

export type Sort = 'relevancia' | 'menor-preco' | 'maior-preco' | 'nome';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'relevancia', label: 'Destaques primeiro' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
  { id: 'nome', label: 'Nome (A–Z)' },
];
const FIELDS = ['f-rosa', 'f-nevoa', 'f-areia', 'f-salvia'];

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export interface Filters { q: string; cat: CategoryId | ''; onlyAvailable: boolean; sort: Sort }

export function filterProducts(list: Product[], f: Filters): Product[] {
  const q = normalize(f.q.trim());
  const out = list.filter((p) =>
    (!f.cat || p.category === f.cat) &&
    (!f.onlyAvailable || p.availability !== 'esgotado') &&
    (!q || normalize(p.name).includes(q)),
  );
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, 'pt-BR');
  if (f.sort === 'menor-preco') out.sort((a, b) => a.priceCents - b.priceCents || byName(a, b));
  if (f.sort === 'maior-preco') out.sort((a, b) => b.priceCents - a.priceCents || byName(a, b));
  if (f.sort === 'nome') out.sort(byName);
  if (f.sort === 'relevancia') out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return out;
}

export function ProductCard({ p, i, sizes }: { p: Product; i: number; sizes?: string }) {
  return (
    <a href={`#/produto/${p.id}`} className="card">
      <span className={`card-img ${FIELDS[i % 4]}`}>
        <Img id={p.images[0].id} alt={p.images[0].alt} sizes={sizes ?? '(min-width: 1200px) 23vw, (min-width: 700px) 31vw, 46vw'} />
        {p.availability !== 'disponivel' && <span className={`card-flag ${p.availability}`}>{availabilityLabel[p.availability]}</span>}
      </span>
      <span className="card-name">{p.name}</span>
      <span className="card-meta">{categoryName(p.category)}{p.brand ? ` · ${p.brand}` : ''}</span>
      <span className="card-price">{formatBRL(p.priceCents)}</span>
    </a>
  );
}

export function Catalog({ route }: { route: Route }) {
  const initial = (): Filters => {
    const cat = route.params.get('categoria');
    const sort = route.params.get('ordem') as Sort | null;
    return {
      q: route.params.get('busca') ?? '',
      cat: categories.some((c) => c.id === cat) ? (cat as CategoryId) : '',
      onlyAvailable: route.params.get('disponivel') === '1',
      sort: SORTS.some((s) => s.id === sort) ? sort! : 'relevancia',
    };
  };
  const [f, setF] = useState<Filters>(initial);

  // mantém a URL em dia sem empilhar histórico a cada tecla
  useEffect(() => {
    const p = new URLSearchParams();
    if (f.cat) p.set('categoria', f.cat);
    if (f.q) p.set('busca', f.q);
    if (f.onlyAvailable) p.set('disponivel', '1');
    if (f.sort !== 'relevancia') p.set('ordem', f.sort);
    const next = `#/produtos${p.toString() ? `?${p}` : ''}`;
    if (window.location.hash !== next) history.replaceState(null, '', next);
  }, [f]);

  const result = useMemo(() => filterProducts(products, f), [f]);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({ ...s, [k]: v }));
  const clear = () => setF({ q: '', cat: '', onlyAvailable: false, sort: 'relevancia' });
  const dirty = f.q || f.cat || f.onlyAvailable;

  return (
    <div className="page catalog">
      <div className="page-head">
        <h1 className="h-page" tabIndex={-1}>{f.cat ? categoryName(f.cat) : 'Produtos'}</h1>
        <p className="page-sub">Peças fotografadas na própria Aniz. {DEMO_NOTICE}</p>
      </div>

      <form className="filters" role="search" aria-label="Filtrar produtos" onSubmit={(e) => e.preventDefault()}>
        <div className="field field-search">
          <label htmlFor="busca">Buscar por nome</label>
          <div className="input-icon">
            <Search size={18} aria-hidden="true" />
            <input id="busca" type="search" value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Ex.: pijama, biquíni, bolsa" autoComplete="off" enterKeyHint="search" />
          </div>
        </div>
        <fieldset className="chips">
          <legend><SlidersHorizontal size={16} aria-hidden="true" /> Categoria</legend>
          <label className="chip"><input type="radio" name="cat" checked={!f.cat} onChange={() => set('cat', '')} /><span>Todas</span></label>
          {categories.map((c) => (
            <label key={c.id} className="chip"><input type="radio" name="cat" checked={f.cat === c.id} onChange={() => set('cat', c.id)} /><span>{c.name}</span></label>
          ))}
        </fieldset>
        <div className="filters-row">
          <label className="check"><input type="checkbox" checked={f.onlyAvailable} onChange={(e) => set('onlyAvailable', e.target.checked)} /> Só disponíveis</label>
          <div className="field field-inline">
            <label htmlFor="ordem">Ordenar por</label>
            <select id="ordem" value={f.sort} onChange={(e) => set('sort', e.target.value as Sort)}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </form>

      <div className="result-bar">
        <p aria-live="polite" role="status" className="result-count">{result.length} {result.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p>
        {dirty && <button type="button" className="link-btn" onClick={clear}>Limpar filtros</button>}
      </div>

      {result.length === 0 ? (
        <div className="empty">
          <p className="lead">Nenhuma peça com esses filtros.</p>
          <p>Tente outro nome ou outra categoria.</p>
          <button type="button" className="btn btn-primary" onClick={clear}>Limpar filtros</button>
        </div>
      ) : (
        <ul className="grid">
          {result.map((p, i) => (
            <InView as="li" key={p.id} delay={Math.min(i, 8) * 0.04}><ProductCard p={p} i={i} /></InView>
          ))}
        </ul>
      )}
    </div>
  );
}
