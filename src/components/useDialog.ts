import { useEffect, useRef } from 'react';

/**
 * Liga um <dialog> nativo ao estado do React. showModal() prende o foco dentro do diálogo e
 * torna o resto da página inerte; Escape dispara `cancel`, que repassamos para onClose.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    const onClick = (e: MouseEvent) => { if (e.target === d) onClose(); }; // clique fora do painel
    d.addEventListener('cancel', onCancel);
    d.addEventListener('click', onClick);
    return () => { d.removeEventListener('cancel', onCancel); d.removeEventListener('click', onClick); };
  }, [onClose]);
  return ref;
}
