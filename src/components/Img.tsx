import imageSizes from '../data/image-sizes.json';
import { cn } from '../lib/utils';

const dims = imageSizes as Record<string, { w: number; h: number }>;
const url = (id: string, w: number) => `${import.meta.env.BASE_URL}img/${id}-${w}.webp`;

interface Props { id: string; alt: string; sizes?: string; eager?: boolean; className?: string }

/** Foto local em WebP com srcset, dimensões explícitas e carregamento sob demanda. */
export function Img({ id, alt, sizes = '(min-width: 1024px) 33vw, 50vw', eager, className }: Props) {
  const d = dims[id] ?? { w: 941, h: 1254 };
  const small = Math.min(600, d.w), large = Math.min(1200, d.w);
  return (
    <img
      src={url(id, 600)}
      srcSet={`${url(id, 600)} ${small}w, ${url(id, 1200)} ${large}w`}
      sizes={sizes}
      width={d.w}
      height={d.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={cn('img', className)}
    />
  );
}
