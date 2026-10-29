// Adaptado de Spell UI — Blur Reveal (https://spell.sh/docs), licença MIT.
// Mudanças: anima por palavra (não por letra), e com prefers-reduced-motion mostra o texto sem animação.
import { motion, useReducedMotion } from 'motion/react';

export function BlurReveal({ children, className, id }: { children: string; className?: string; id?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <h1 id={id} className={className}>{children}</h1>;
  const words = children.split(' ');
  return (
    <motion.h1
      id={id}
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
    >
      <span className="sr-only">{children}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <motion.span
            className="inline-block"
            variants={{ hidden: { opacity: 0, filter: 'blur(10px)', y: 8 }, visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.5 } } }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.h1>
  );
}
