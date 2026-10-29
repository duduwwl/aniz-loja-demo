// Roteamento por hash: funciona no GitHub Pages sem servidor, com atualização e acesso direto.
import { useSyncExternalStore } from 'react';

// Conta cada navegação: o catálogo reescreve o hash com replaceState (sem evento), então o mesmo
// hash pode voltar a ser navegado e ainda assim precisa ser percebido como navegação nova.
let navCount = 0;
const subscribe = (cb: () => void) => {
  const on = () => { navCount++; cb(); };
  window.addEventListener('hashchange', on);
  return () => window.removeEventListener('hashchange', on);
};
const getSnapshot = () => `${navCount}\n${window.location.hash}`;

export interface Route { path: string; params: URLSearchParams; parts: string[]; nav: number }

export function parseHash(hash: string, nav = 0): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return { path: clean, params: new URLSearchParams(query), parts: clean.split('/').filter(Boolean), nav };
}

export function useRoute(): Route {
  const [nav, hash] = useSyncExternalStore(subscribe, getSnapshot, () => '0\n').split('\n');
  return parseHash(hash, Number(nav));
}

export const navigate = (to: string) => { window.location.hash = to; };
