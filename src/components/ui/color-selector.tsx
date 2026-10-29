// Adaptado de Spell UI — Color Selector (https://spell.sh/docs), licença MIT.
// Mudanças: virou um grupo de rádios nativo (teclado com setas, leitor de tela anuncia o nome da cor)
// e mostra o nome da cor escolhida em texto.
import type { Color } from '../../data/products';

interface Props { name: string; colors: Color[]; value: string; onChange: (v: string) => void; invalid?: boolean; describedBy?: string }

export function ColorSelector({ name, colors, value, onChange, invalid, describedBy }: Props) {
  return (
    <fieldset className="option-group">
      <legend>Cor{value ? <span className="option-current">: {value}</span> : null}</legend>
      <div className="swatches">
        {colors.map((c) => (
          <label key={c.name} className="swatch" title={c.name}>
            <input type="radio" name={name} value={c.name} checked={value === c.name} onChange={() => onChange(c.name)} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
            <span className="swatch-dot" style={{ backgroundColor: c.hex }} aria-hidden="true" />
            <span className="sr-only">{c.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
