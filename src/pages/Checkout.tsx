import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useShop, type CheckoutDraft } from '../state/shop';
import { LineItem, Totals } from '../components/CartDrawer';
import { QRCode } from '../components/ui/qr-code';
import { CopyButton } from '../components/ui/copy-button';
import { formatBRL, splitInstallments } from '../lib/money';
import { variantLabel } from '../lib/cart';
import {
  buildOrder, demoPixCode, MAX_INSTALLMENTS, METHOD_LABEL, newOrderNumber, SHIPPING, simulateCard, TEST_CARDS,
  type CardScenario, type PayMethod,
} from '../lib/payment';
import {
  hasErrors, maskCep, maskPhone, UFS, validateAddress, validateIdentity, type Address, type Errors, type Identity,
} from '../lib/validation';
import { navigate } from '../lib/router';

const STEPS = ['Identificação', 'Entrega', 'Pagamento', 'Revisão'];

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p id={`${id}-dica`} className="hint">{hint}</p>}
      {error && <p id={`${id}-erro`} className="field-error">{error}</p>}
    </div>
  );
}
const aria = (id: string, error?: string, hint?: string) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-erro` : hint ? `${id}-dica` : undefined,
});

/** Leva o foco ao primeiro campo com erro e anuncia o resumo. */
function focusFirstError(form: HTMLFormElement | null) {
  requestAnimationFrame(() => form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}

function Stepper({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  return (
    <ol className="stepper" aria-label="Etapas do checkout">
      {STEPS.map((s, i) => (
        <li key={s} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} aria-current={i === step ? 'step' : undefined}>
          {i < step ? (
            <button type="button" onClick={() => onGo(i)}><Check size={16} aria-hidden="true" /> {s}<span className="sr-only"> (concluída, editar)</span></button>
          ) : (
            <span>{s}{i > step ? <span className="sr-only"> (a fazer)</span> : null}</span>
          )}
        </li>
      ))}
    </ol>
  );
}

type SetDraft = (fn: (d: CheckoutDraft) => CheckoutDraft) => void;

// Os campos escrevem direto no rascunho da sessão: trocar de etapa por qualquer caminho não perde nada.
function IdentityStep({ draft, setDraft, onNext }: { draft: CheckoutDraft; setDraft: SetDraft; onNext: () => void }) {
  const v = draft.identity;
  const setV = (identity: Identity) => setDraft((d) => ({ ...d, identity }));
  const [e, setE] = useState<Errors<Identity>>({});
  const ref = useRef<HTMLFormElement>(null);
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const err = validateIdentity(v);
    setE(err);
    if (hasErrors(err)) return focusFirstError(ref.current);
    onNext();
  };
  return (
    <form ref={ref} onSubmit={submit} noValidate className="co-form" aria-labelledby="co-step-title">
      <ErrorSummary errors={e} />
      <Field id="nome" label="Nome completo" error={e.name}>
        <input {...aria('nome', e.name)} value={v.name} onChange={(x) => setV({ ...v, name: x.target.value })} autoComplete="name" />
      </Field>
      <Field id="email" label="E-mail" error={e.email} hint="Usado só nesta simulação; nada é enviado.">
        <input {...aria('email', e.email, 'x')} type="email" inputMode="email" value={v.email} onChange={(x) => setV({ ...v, email: x.target.value })} autoComplete="email" />
      </Field>
      <Field id="telefone" label="Telefone com DDD" error={e.phone}>
        <input {...aria('telefone', e.phone)} type="tel" inputMode="tel" value={v.phone} onChange={(x) => setV({ ...v, phone: maskPhone(x.target.value) })} autoComplete="tel-national" placeholder="(35) 99999-9999" />
      </Field>
      <div className="co-nav"><a href="#/produtos" className="btn btn-ghost">Continuar comprando</a><button type="submit" className="btn btn-primary">Continuar para entrega</button></div>
    </form>
  );
}

function AddressStep({ draft, setDraft, onBack, onNext }: { draft: CheckoutDraft; setDraft: SetDraft; onBack: () => void; onNext: () => void }) {
  const v = draft.address;
  const setV = (address: Address) => setDraft((d) => ({ ...d, address }));
  const ship = draft.shippingId;
  const setShip = (shippingId: CheckoutDraft['shippingId']) => setDraft((d) => ({ ...d, shippingId }));
  const [e, setE] = useState<Errors<Address>>({});
  const ref = useRef<HTMLFormElement>(null);
  const up = (k: keyof Address) => (x: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV({ ...v, [k]: k === 'cep' ? maskCep(x.target.value) : x.target.value });
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const err = validateAddress(v);
    setE(err);
    if (hasErrors(err)) return focusFirstError(ref.current);
    onNext();
  };
  return (
    <form ref={ref} onSubmit={submit} noValidate className="co-form" aria-labelledby="co-step-title">
      <ErrorSummary errors={e} />
      <div className="field-row">
        <Field id="cep" label="CEP" error={e.cep} hint="Não consultamos serviços externos: preencha o endereço abaixo.">
          <input {...aria('cep', e.cep, 'x')} inputMode="numeric" value={v.cep} onChange={up('cep')} autoComplete="postal-code" placeholder="00000-000" />
        </Field>
      </div>
      <Field id="rua" label="Rua ou avenida" error={e.street}><input {...aria('rua', e.street)} value={v.street} onChange={up('street')} autoComplete="address-line1" /></Field>
      <div className="field-row">
        <Field id="numero" label="Número" error={e.number}><input {...aria('numero', e.number)} value={v.number} onChange={up('number')} inputMode="text" /></Field>
        <Field id="complemento" label="Complemento (opcional)"><input id="complemento" value={v.complement} onChange={up('complement')} autoComplete="address-line2" /></Field>
      </div>
      <Field id="bairro" label="Bairro" error={e.district}><input {...aria('bairro', e.district)} value={v.district} onChange={up('district')} /></Field>
      <div className="field-row">
        <Field id="cidade" label="Cidade" error={e.city}><input {...aria('cidade', e.city)} value={v.city} onChange={up('city')} autoComplete="address-level2" /></Field>
        <Field id="uf" label="Estado" error={e.uf}>
          <select {...aria('uf', e.uf)} value={v.uf} onChange={up('uf')} autoComplete="address-level1">
            <option value="">Selecione</option>
            {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
      </div>
      <fieldset className="option-group">
        <legend>Frete e prazo (simulados)</legend>
        <div className="radio-cards">
          {SHIPPING.map((s) => (
            <label key={s.id} className="radio-card">
              <input type="radio" name="frete" checked={ship === s.id} onChange={() => setShip(s.id)} />
              <span><strong>{s.label}</strong> · {formatBRL(s.cents)}<br /><span className="note">{s.days}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="co-nav"><button type="button" className="btn btn-ghost" onClick={onBack}>Voltar</button><button type="submit" className="btn btn-primary">Continuar para pagamento</button></div>
    </form>
  );
}

function PaymentStep({ draft, setDraft, total, onBack, onNext }: { draft: CheckoutDraft; setDraft: SetDraft; total: number; onBack: () => void; onNext: () => void }) {
  const m = draft.method;
  const setM = (method: PayMethod) => setDraft((d) => ({ ...d, method }));
  const n = draft.installments;
  const setN = (installments: number) => setDraft((d) => ({ ...d, installments }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="co-form" aria-labelledby="co-step-title">
      <fieldset className="option-group">
        <legend>Forma de pagamento</legend>
        <div className="radio-cards">
          {(['pix', 'credito', 'debito'] as PayMethod[]).map((k) => (
            <label key={k} className="radio-card">
              <input type="radio" name="metodo" checked={m === k} onChange={() => setM(k)} />
              <span><strong>{METHOD_LABEL[k]}</strong><br /><span className="note">
                {k === 'pix' ? 'QR Code de teste, sem valor real.' : k === 'credito' ? `Até ${MAX_INSTALLMENTS}x sem juros (fictício).` : 'À vista, com cartão de teste.'}
              </span></span>
            </label>
          ))}
        </div>
      </fieldset>
      {m === 'credito' && (
        <div className="field">
          <label htmlFor="parcelas">Parcelamento (fictício)</label>
          <select id="parcelas" value={n} onChange={(e) => setN(Number(e.target.value))}>
            {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => i + 1).map((k) => {
              const parts = splitInstallments(total, k);
              return <option key={k} value={k}>{k}x de {formatBRL(parts[parts.length - 1])}{k > 1 && parts[0] !== parts[1] ? ` (1ª de ${formatBRL(parts[0])})` : ''} sem juros · total {formatBRL(total)}</option>;
            })}
          </select>
        </div>
      )}
      {m !== 'pix' && <p className="warn">Não digite dados de cartão real. A próxima etapa usa somente um cartão de teste predefinido.</p>}
      <div className="co-nav"><button type="button" className="btn btn-ghost" onClick={onBack}>Voltar</button><button type="submit" className="btn btn-primary">Revisar pedido</button></div>
    </form>
  );
}

function ErrorSummary({ errors }: { errors: object }) {
  const list = Object.values(errors) as string[];
  if (!list.length) return null;
  return (
    <div className="error-summary" role="alert">
      <p><strong>Corrija {list.length === 1 ? 'o campo' : `os ${list.length} campos`} abaixo:</strong></p>
      <ul>{list.map((m) => <li key={m}>{m}</li>)}</ul>
    </div>
  );
}

type PayState = { kind: 'idle' } | { kind: 'pix' } | { kind: 'card'; scenario: CardScenario; status: 'ready' | 'processing' | 'failed' };

function Review({ draft, onEdit, onPlace }: { draft: CheckoutDraft; onEdit: (step: number) => void; onPlace: () => void }) {
  const { summary } = useShop();
  const ship = SHIPPING.find((s) => s.id === draft.shippingId)!;
  const total = summary.subtotal + ship.cents;
  const [pay, setPay] = useState<PayState>({ kind: 'idle' });
  const [ref] = useState(() => String(Date.now()).slice(-6));
  const live = useRef<HTMLParagraphElement>(null);
  const installments = draft.method === 'credito' ? splitInstallments(total, draft.installments) : [total];

  // após a espera simulada, usa a versão atual de onPlace (sacola atual) e ignora se a página já saiu
  const placeRef = useRef(onPlace);
  placeRef.current = onPlace;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const start = () => setPay(draft.method === 'pix' ? { kind: 'pix' } : { kind: 'card', scenario: 'aprovado', status: 'ready' });
  const runCard = async (scenario: CardScenario) => {
    setPay({ kind: 'card', scenario, status: 'processing' });
    const ok = await simulateCard(scenario);
    if (!mounted.current) return;
    if (ok) placeRef.current();
    else setPay({ kind: 'card', scenario, status: 'failed' });
  };

  const a = draft.address;
  return (
    <div className="co-form">
      <dl className="review">
        <div><dt>Identificação</dt><dd>{draft.identity.name}<br />{draft.identity.email}<br />{draft.identity.phone}</dd><dd><button type="button" className="link-btn" onClick={() => onEdit(0)}>Editar<span className="sr-only"> identificação</span></button></dd></div>
        <div><dt>Entrega</dt><dd>{a.street}, {a.number}{a.complement ? ` – ${a.complement}` : ''}<br />{a.district} · {a.city}/{a.uf} · CEP {a.cep}<br />{ship.label}: {formatBRL(ship.cents)} · {ship.days}</dd><dd><button type="button" className="link-btn" onClick={() => onEdit(1)}>Editar<span className="sr-only"> entrega</span></button></dd></div>
        <div><dt>Pagamento</dt><dd>{METHOD_LABEL[draft.method]}{draft.method === 'credito' ? ` · ${installments.length}x de ${formatBRL(installments[installments.length - 1])}` : ''}</dd><dd><button type="button" className="link-btn" onClick={() => onEdit(2)}>Editar<span className="sr-only"> pagamento</span></button></dd></div>
      </dl>

      {pay.kind === 'idle' && (
        <div className="co-nav"><button type="button" className="btn btn-ghost" onClick={() => onEdit(2)}>Voltar</button><button type="button" className="btn btn-primary" onClick={start}>Pagar {formatBRL(total)} (simulação)</button></div>
      )}

      {pay.kind === 'pix' && (
        <section className="pay-box" aria-labelledby="pix-title">
          <h3 id="pix-title" className="h-small">Pix de demonstração</h3>
          <p className="warn">Este QR Code e este código são de teste. Não servem para pagamento real e nenhum banco os reconhece como cobrança.</p>
          <div className="pix">
            <QRCode value={demoPixCode(ref)} size={200} fgColor="#14223d" bgColor="#ffffff" />
            <div className="pix-code">
              <label htmlFor="pix-code">Código de demonstração</label>
              <textarea id="pix-code" readOnly value={demoPixCode(ref)} rows={3} onFocus={(e) => e.currentTarget.select()} />
              <CopyButton value={demoPixCode(ref)} />
            </div>
          </div>
          <div className="co-nav"><button type="button" className="btn btn-ghost" onClick={() => setPay({ kind: 'idle' })}>Voltar</button><button type="button" className="btn btn-primary" onClick={onPlace}>Simular pagamento aprovado</button></div>
        </section>
      )}

      {pay.kind === 'card' && (
        <section className="pay-box" aria-labelledby="card-title">
          <h3 id="card-title" className="h-small">{draft.method === 'credito' ? 'Cartão de crédito' : 'Cartão de débito'} de teste</h3>
          <p className="warn">Não insira cartão real. Os dados abaixo são fictícios e fixos; nada é salvo nem enviado.</p>
          <fieldset className="option-group" disabled={pay.status === 'processing'}>
            <legend>Cenário da simulação</legend>
            <div className="radio-cards">
              <label className="radio-card"><input type="radio" name="cenario" checked={pay.scenario === 'aprovado'} onChange={() => setPay({ ...pay, scenario: 'aprovado', status: 'ready' })} /><span><strong>Pagamento aprovado</strong></span></label>
              <label className="radio-card"><input type="radio" name="cenario" checked={pay.scenario === 'recusado'} onChange={() => setPay({ ...pay, scenario: 'recusado', status: 'ready' })} /><span><strong>Pagamento recusado</strong></span></label>
            </div>
          </fieldset>
          <dl className="test-card" aria-label="Cartão de teste">
            <div><dt>Número</dt><dd>{TEST_CARDS[pay.scenario].number}</dd></div>
            <div><dt>Nome</dt><dd>{TEST_CARDS[pay.scenario].holder}</dd></div>
            <div><dt>Validade</dt><dd>{TEST_CARDS[pay.scenario].expiry}</dd></div>
            <div><dt>CVV</dt><dd>{TEST_CARDS[pay.scenario].cvv}</dd></div>
          </dl>
          <p ref={live} role="status" aria-live="polite" className={pay.status === 'failed' ? 'field-error' : 'note'}>
            {pay.status === 'processing' && 'Processando pagamento simulado…'}
            {pay.status === 'failed' && 'Pagamento recusado (simulação). Nenhum valor foi cobrado. Tente de novo ou troque a forma de pagamento.'}
          </p>
          <div className="co-nav">
            <button type="button" className="btn btn-ghost" onClick={() => onEdit(2)} disabled={pay.status === 'processing'}>Trocar forma de pagamento</button>
            <button type="button" className="btn btn-primary" onClick={() => runCard(pay.scenario)} disabled={pay.status === 'processing'}>
              {pay.status === 'processing' ? <><Loader2 size={18} className="spin" aria-hidden="true" /> Processando…</> : pay.status === 'failed' ? 'Tentar novamente' : `Pagar ${formatBRL(total)} (simulação)`}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export function Checkout() {
  const { summary, draft, setDraft, completeOrder } = useShop();
  const heading = useRef<HTMLHeadingElement>(null);
  const ship = SHIPPING.find((s) => s.id === draft.shippingId)!;
  const total = summary.subtotal + ship.cents;
  const step = draft.step;
  const go = (n: number) => setDraft((d) => ({ ...d, step: n }));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    heading.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  const placing = useRef(false);
  const place = useMemo(() => () => {
    if (placing.current || summary.priced.length === 0) return; // clique duplo ou sacola esvaziada durante o pagamento
    placing.current = true;
    const order = buildOrder(newOrderNumber(), summary.priced, (l) => variantLabel(l), ship, draft.method, draft.installments);
    completeOrder(order);
    navigate('/pedido');
  }, [summary.priced, ship, draft.method, draft.installments, completeOrder]);

  if (summary.priced.length === 0) {
    return (
      <div className="page checkout">
        <h1 className="h-page" tabIndex={-1}>Checkout</h1>
        <div className="empty">
          <p className="lead">Sua sacola está vazia, então não há o que finalizar.</p>
          <a href="#/produtos" className="btn btn-primary">Ver produtos</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout">
      <p className="demo-banner" role="note">Compra demonstrativa — nenhuma cobrança será realizada</p>
      <h1 className="h-page" tabIndex={-1}>Checkout</h1>
      <Stepper step={step} onGo={go} />
      <div className="co-layout">
        <section aria-labelledby="co-step-title" className="co-main">
          <h2 id="co-step-title" ref={heading} tabIndex={-1} className="h-section">{STEPS[step]}</h2>
          {step === 0 && <IdentityStep draft={draft} setDraft={setDraft} onNext={() => go(1)} />}
          {step === 1 && <AddressStep draft={draft} setDraft={setDraft} onBack={() => go(0)} onNext={() => go(2)} />}
          {step === 2 && <PaymentStep draft={draft} setDraft={setDraft} total={total} onBack={() => go(1)} onNext={() => go(3)} />}
          {step === 3 && <Review draft={draft} onEdit={go} onPlace={place} />}
        </section>
        <aside className="co-summary" aria-labelledby="sum-title">
          <h2 id="sum-title" className="h-small">Resumo do pedido</h2>
          <ul className="lines lines-compact">{summary.priced.map((l) => <LineItem key={l.key} line={l} editable={step < 3} />)}</ul>
          <Totals subtotal={summary.subtotal} shipping={ship.cents} total={total} shippingNote={`Frete: ${ship.label}`} />
          <p className="note">Seus dados ficam só na memória desta aba e somem ao recarregar ou fechar a página.</p>
        </aside>
      </div>
    </div>
  );
}
