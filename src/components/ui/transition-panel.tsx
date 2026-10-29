// Adaptado de Motion Primitives — Transition Panel (https://motion-primitives.com/docs/transition-panel), licença MIT.
// Mudança: sem dependência de `cn`; com prefers-reduced-motion só troca a opacidade.
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variant } from 'motion/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode[];
  activeIndex: number;
  className?: string;
  transition?: Transition;
  variants?: { enter: Variant; center: Variant; exit: Variant };
};

export function TransitionPanel({ children, activeIndex, className, transition, variants }: Props) {
  const reduce = useReducedMotion();
  const v = reduce ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } } : variants;
  return (
    <div className={className} style={{ position: 'relative' }}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={activeIndex} variants={v} transition={transition} initial="enter" animate="center" exit="exit" style={{ height: '100%' }}>
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
