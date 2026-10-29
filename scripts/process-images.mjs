// Gera versões WebP (600 e 1200 px de largura) de cada foto em photos-src/ para public/img/
// e grava as dimensões em src/data/image-sizes.json. Uso: npm run images
import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';

const SRC = 'photos-src', OUT = 'public/img', WIDTHS = [600, 1200];
await mkdir(OUT, { recursive: true });
const sizes = {};
for (const file of (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
  const id = file.replace(/\.[^.]+$/, '');
  const meta = await sharp(`${SRC}/${file}`).metadata();
  sizes[id] = { w: meta.width, h: meta.height };
  for (const w of WIDTHS) {
    await sharp(`${SRC}/${file}`).resize({ width: Math.min(w, meta.width) }).webp({ quality: 78 }).toFile(`${OUT}/${id}-${w}.webp`);
  }
}
await writeFile('src/data/image-sizes.json', JSON.stringify(sizes, null, 2) + '\n');
console.log(`${Object.keys(sizes).length} imagens processadas`);
