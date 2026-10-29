import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { cartReducer, loadCart, STORAGE_KEY, totals, type CartAction, type CartLine } from '../lib/cart';
import type { Address, Identity } from '../lib/validation';
import type { Order, PayMethod, ShippingOption } from '../lib/payment';

/** Dados do checkout: só na memória desta aba. Recarregar ou fechar apaga tudo. */
export interface CheckoutDraft {
  step: number;
  identity: Identity;
  address: Address;
  shippingId: ShippingOption['id'];
  method: PayMethod;
  installments: number;
}

export const emptyDraft = (): CheckoutDraft => ({
  step: 0,
  identity: { name: '', email: '', phone: '' },
  address: { cep: '', street: '', number: '', complement: '', district: '', city: '', uf: '' },
  shippingId: 'economico',
  method: 'pix',
  installments: 1,
});

interface Toast { id: number; text: string }

interface Shop {
  lines: CartLine[];
  dispatch: (a: CartAction) => void;
  summary: ReturnType<typeof totals>;
  bagOpen: boolean;
  openBag: (opener?: HTMLElement | null) => void;
  closeBag: () => void;
  toast: Toast | null;
  notify: (text: string) => void;
  draft: CheckoutDraft;
  setDraft: (fn: (d: CheckoutDraft) => CheckoutDraft) => void;
  lastOrder: Order | null;
  completeOrder: (o: Order) => void;
}

const Ctx = createContext<Shop | null>(null);

function readStorage() {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, () => loadCart(readStorage()));
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [draft, setDraftState] = useState<CheckoutDraft>(emptyDraft);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* armazenamento indisponível: a sacola vive só nesta aba */ }
  }, [lines]);

  const notify = useCallback((text: string) => setToast({ id: Date.now(), text }), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const openBag = useCallback((el?: HTMLElement | null) => {
    opener.current = el ?? (document.activeElement as HTMLElement | null);
    setToast(null);
    setBagOpen(true);
  }, []);
  const closeBag = useCallback(() => {
    setBagOpen(false);
    // devolve o foco a quem abriu a sacola
    // (se quem abriu já saiu da página, como o aviso "Ver sacola", volta ao botão da sacola)
    requestAnimationFrame(() => {
      const el = opener.current?.isConnected ? opener.current : document.querySelector<HTMLElement>('.bag-btn');
      el?.focus();
    });
  }, []);

  const completeOrder = useCallback((o: Order) => {
    setLastOrder(o);
    dispatch({ type: 'clear' });
    setDraftState(emptyDraft());
  }, []);

  const value = useMemo<Shop>(() => ({
    lines, dispatch, summary: totals(lines), bagOpen, openBag, closeBag, toast, notify,
    draft, setDraft: (fn) => setDraftState(fn), lastOrder, completeOrder,
  }), [lines, bagOpen, openBag, closeBag, toast, notify, draft, lastOrder, completeOrder]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useShop fora do ShopProvider');
  return v;
}
