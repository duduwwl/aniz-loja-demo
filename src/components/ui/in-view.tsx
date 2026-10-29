// Adaptado de Motion Primitives — InView (https://motion-primitives.com/docs/in-view), licença MIT.
// Mudança: com prefers-reduced-motion o conteúdo aparece já visível, sem deslocamento.
import { type ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion, type Transition, type Variant } from 'motion/react';

export type InViewProps = {
  children: ReactNode;
  variants?: { hidden: Variant; visible: Variant };
  transition?: Transition;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'figure';
};

const defaultVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export function InView({ children, variants = defaultVariants, transition, delay = 0, className, as = 'div' }: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const MotionComponent = motion[as];
  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={reduce ? false : 'hidden'}
      animate={isInView || reduce ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition ?? { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionComponent>
  );
}
