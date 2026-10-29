// Adaptado de Motion Primitives — Animated Background (https://motion-primitives.com/docs/animated-background), licença MIT.
// Mudança: vira um grupo de botões controlado (aria-pressed) em vez de clonar filhos; o destaque desliza entre eles.
import { motion, type Transition } from 'motion/react';
import { useId } from 'react';

type Item = { id: string; label: string };
type Props = { items: Item[]; value: string; onChange: (id: string) => void; label: string; className?: string; transition?: Transition };

export function AnimatedBackground({ items, value, onChange, label, className, transition }: Props) {
  const uid = useId();
  return (
    <div role="group" aria-label={label} className={className}>
      {items.map((it) => (
        <button key={it.id} type="button" aria-pressed={value === it.id} onClick={() => onChange(it.id)} className="ab-item">
          {value === it.id && <motion.span layoutId={`ab-${uid}`} className="ab-bg" transition={transition} aria-hidden="true" />}
          <span className="ab-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
}
