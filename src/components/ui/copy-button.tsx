// Adaptado de Spell UI — Copy Button (https://spell.sh/docs), licença MIT.
// Mudanças: rótulo em texto visível, aviso falado (aria-live) e tratamento de falha da área de transferência.
import { useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('ok');
    } catch {
      // sem permissão de clipboard (iframe, navegador antigo): tenta o caminho legado
      const ta = Object.assign(document.createElement('textarea'), { value, readOnly: true });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand?.('copy') ?? false;
      ta.remove();
      setState(ok ? 'ok' : 'fail');
    }
    setTimeout(() => setState('idle'), 2500);
  };
  return (
    <>
      <button type="button" onClick={copy} className={cn('btn btn-ghost copy-btn', className)}>
        <span className="copy-icons" aria-hidden="true">
          <CheckIcon size={18} className={cn('copy-icon', state === 'ok' ? 'is-on' : 'is-off')} />
          <CopyIcon size={18} className={cn('copy-icon', state === 'ok' ? 'is-off' : 'is-on')} />
        </span>
        {state === 'ok' ? 'Código copiado' : 'Copiar código'}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'ok' ? 'Código de demonstração copiado.' : state === 'fail' ? 'Não foi possível copiar. Selecione o texto do código e copie manualmente.' : ''}
      </span>
      {state === 'fail' && <p className="field-error">Não foi possível copiar automaticamente. Selecione o código acima e copie.</p>}
    </>
  );
}
