// Adaptado de Watermelon UI — Wiggling Cards (https://ui.watermelon.sh/animated-components/wiggling-cards), licença MIT.
// Mudanças: cartões viram cabides numa arara; a inclinação pela distância do centro vira o balanço do cabide;
// setas e lista navegável por teclado substituem os pontos; com prefers-reduced-motion não há balanço.
import { useEffect, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 450;

function Hanger({ i, x, step, children, active, reduce }: { i: number; x: MotionValue<number>; step: number; children: ReactNode; active: boolean; reduce: boolean | null }) {
  const distance = useTransform(x, (v) => v + i * step);
  const rotate = useTransform(distance, [-step, 0, step], reduce ? [0, 0, 0] : [7, 0, -7]);
  return (
    <motion.li className={`hanger ${active ? 'is-active' : ''}`} style={{ rotate, width: step }} aria-current={active || undefined}>
      <svg className="hanger-hook" viewBox="0 0 60 28" aria-hidden="true">
        <path d="M30 2c4 0 6 3 6 6s-3 5-6 6L4 26h52L30 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <motion.div
        className="hanger-swing"
        animate={reduce ? { rotate: 0 } : { rotate: active ? [0, -1.6, 1.25, -0.7, 0] : [0, -0.55, 0.45, 0] }}
        transition={reduce ? { duration: 0 } : { duration: active ? 1.8 : 3.8, delay: i * 0.12, ease: 'easeInOut', repeat: Infinity, repeatDelay: active ? 1.8 : 3.2 }}
      >
        {children}
      </motion.div>
    </motion.li>
  );
}

export function SwingingRail({ items, label }: { items: { key: string; node: ReactNode }[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(300);
  const reduce = useReducedMotion();
  useEffect(() => {
    const update = () => setStep(window.innerWidth < 640 ? Math.min(window.innerWidth * 0.66, 260) : 300);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const x = useMotionValue(0);
  const max = items.length - 1;
  const go = (n: number) => setIndex(Math.max(0, Math.min(max, n)));
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_BUFFER || info.velocity.x < -VELOCITY_THRESHOLD) go(index + 1);
    else if (info.offset.x > DRAG_BUFFER || info.velocity.x > VELOCITY_THRESHOLD) go(index - 1);
  };
  return (
    <div className="rail" role="region" aria-roledescription="carrossel" aria-label={label}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1); }}>
      <div className="rail-bar" aria-hidden="true" />
      <motion.ul
        className="rail-track"
        drag="x"
        dragConstraints={{ left: -max * step, right: 0 }}
        style={{ x, paddingLeft: `calc(50% - ${step / 2}px)` }}
        animate={{ x: -index * step }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 }}
        onDragEnd={onDragEnd}
      >
        {items.map((it, i) => (
          <Hanger key={it.key} i={i} x={x} step={step} active={i === index} reduce={reduce}>{it.node}</Hanger>
        ))}
      </motion.ul>
      <div className="rail-controls">
        <button type="button" className="rail-btn" onClick={() => go(index - 1)} aria-disabled={index === 0} aria-label="Peça anterior"><ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" /></button>
        <p className="rail-count" aria-live="polite">{index + 1} de {items.length}</p>
        <button type="button" className="rail-btn" onClick={() => go(index + 1)} aria-disabled={index === max} aria-label="Próxima peça"><ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
