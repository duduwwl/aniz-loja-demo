# Aniz · loja online de demonstração

Site estático da **Aniz** (pijamas, lingerie, moda praia e malas — Lavras, MG, desde 1988), feito com as fotos públicas do Instagram [@loja_aniz](https://www.instagram.com/loja_aniz/).

> **Demonstração.** Preços, tamanhos, estoque, frete e pagamentos são fictícios. Nenhuma compra é real e nenhum dado é enviado. Para comprar, fale com a loja: WhatsApp (35) 99244-3983.

## Páginas

| Rota | O que tem |
| --- | --- |
| `#/` | Início: hero com parede de peças reais, índice de categorias com prévia, destaques, a loja, contatos |
| `#/produtos` | Catálogo: busca por nome, filtro por categoria e disponibilidade, ordenação, contagem, estado vazio |
| `#/produto/<id>` | Galeria, preço, modelo/cor/tamanho obrigatórios, quantidade, guia de medidas ilustrativo, relacionados, link para a foto original |
| `#/checkout` | Identificação → Entrega → Pagamento → Revisão; Pix, crédito (até 6x fictício) e débito simulados |
| `#/pedido` | Confirmação com número fictício e o aviso “Pedido de demonstração. Nenhuma cobrança foi realizada.” |

A sacola abre em painel lateral em qualquer página.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes (Vitest + Testing Library)
npm run typecheck  # TypeScript
npm run build      # gera dist/
```

O deploy acontece sozinho a cada push na `main` (`.github/workflows/deploy.yml`, GitHub Pages).

## Editar produtos, preços e fotos

Tudo fica em **`src/data/products.ts`**.

- **Preço:** `priceCents` em centavos. `17990` = R$ 179,90.
- **Tamanhos:** `sizes: ['P', 'M', 'G']`. Use `['Único']` para bolsas.
- **Cores:** `colors: [{ name: 'Preto', hex: '#1b1b1d' }]`. Com uma cor só, ela já vem selecionada.
- **Modelos** (mesma estampa em peças diferentes): `models: ['Biquíni', 'Maiô']`.
- **Disponibilidade:** `'disponivel' | 'ultimas' | 'esgotado'` (esgotado bloqueia o botão).
- **Fotos:**
  1. Coloque a foto (JPG/PNG) em `photos-src/`, por exemplo `photos-src/pijama-novo.jpg`.
  2. Rode `npm run images` (gera `public/img/pijama-novo-600.webp` e `-1200.webp` e atualiza as dimensões).
  3. No produto: `images: [{ id: 'pijama-novo', alt: 'Descrição do que aparece na foto' }]`.
- **Contatos da loja:** `src/data/store.ts`.

Frete simulado e cartões de teste: `src/lib/payment.ts`.

## Privacidade e segurança

- O navegador guarda **apenas** produto, variação e quantidade da sacola (`localStorage`, chave `aniz-sacola-v1`).
- Nome, e-mail, telefone e endereço ficam só na memória da aba e somem ao recarregar. Não há CPF nem campos de cartão: o cartão de teste é fixo e somente leitura.
- O “Pix” é um texto de demonstração que não segue o padrão BR Code; nenhum banco o lê como cobrança.
- Sem analytics, sem chamadas externas além da fonte do Google Fonts.
- O checkout e a confirmação recebem `noindex`.

## Componentes de terceiros

| Componente | Origem | Licença | Onde | Por quê |
| --- | --- | --- | --- | --- |
| In View | [Motion Primitives](https://motion-primitives.com/docs/in-view) | MIT | Entrada das seções e dos cards | Entrada discreta ao rolar, com `prefers-reduced-motion` |
| Blur Reveal | [Spell UI](https://spell.sh/docs) | MIT | Título do hero | Uma única entrada de destaque, por palavra |
| Copy Button | [Spell UI](https://spell.sh/docs) | MIT | Código Pix de teste | Feedback claro ao copiar |
| Color Selector | [Spell UI](https://spell.sh/docs) | MIT | Cores do produto | Adaptado para grupo de rádios nativo (teclado e leitor de tela) |
| QR Code | [Spell UI](https://spell.sh/docs) | MIT | QR de teste do Pix | Gera o QR localmente (`qrcode`, MIT) |

Os arquivos copiados estão em `src/components/ui/`, cada um com a origem e as mudanças no topo. Bibliotecas: `motion`, `lucide-react`, `qrcode`, Tailwind CSS v4.

Avaliados e não usados:

- **Canvas UI** (canvasui.dev): efeitos WebGL/WebGPU (Shatter, VHS, Liquid…) disputariam atenção com as fotos, a renderização de HTML em canvas ainda é experimental (Chrome com flag) e a licença tem Commons Clause.
- **Watermelon UI** (ui.watermelon.sh): o catálogo não trouxe componentes de sacola, etapas ou formulário que agregassem, e a licença não está clara na documentação.
- Demais itens de Spell UI e Motion Primitives (Tilt, Magnetic, Spotlight, Text Scramble…): decorativos demais para uma loja que vive das fotos.

Menu móvel, sacola lateral, etapas e mensagens de validação usam `<dialog>` nativo e HTML acessível, sem biblioteca.

## Fontes

Ver [FONTES.md](FONTES.md): o que foi confirmado, o que não foi, e a publicação de origem de cada foto.
