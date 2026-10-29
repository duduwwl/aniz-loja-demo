// Catálogo demonstrativo. Todas as fotos vêm de publicações públicas do @loja_aniz (campo `source`).
// Preços, tamanhos e disponibilidade são FICTÍCIOS. Descrições citam apenas o que se vê na foto
// ou o que a legenda da publicação afirma. Para editar: veja o README, seção "Editar produtos".

export type CategoryId = 'pijamas' | 'lingerie' | 'praia' | 'bolsas';
export type Availability = 'disponivel' | 'ultimas' | 'esgotado';
export type SizeGuide = 'roupa' | 'sutia' | null;

export interface Color { name: string; hex: string }
export interface ProductImage { id: string; alt: string }

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  brand?: string;
  priceCents: number;
  images: ProductImage[];
  colors: Color[];
  sizes: string[];
  /** Variação extra quando a mesma estampa vem em modelos diferentes (ex.: biquíni ou maiô). */
  models?: string[];
  description: string;
  details: string[];
  availability: Availability;
  sizeGuide: SizeGuide;
  featured?: boolean;
  source: { post: string; caption?: string };
}

export const categories: { id: CategoryId; name: string; image: string }[] = [
  { id: 'pijamas', name: 'Pijamas', image: 'Dd-PqM6DSWz_1' },
  { id: 'lingerie', name: 'Lingerie', image: 'Dc57t_bEZ3p_1' },
  { id: 'praia', name: 'Moda praia', image: 'DcblDxjERIb_8' },
  { id: 'bolsas', name: 'Bolsas e malas', image: 'Dax6Re8Dout_4' },
];

const post = (code: string) => `https://www.instagram.com/p/${code}/`;
const LUA = { post: post('Dd-PqM6DSWz'), caption: '“Outubro chegou em tons de rosa”, 01/10/2026' };
const CAES = { post: post('Dc_BSPZEQK6'), caption: 'Coleção de cachorrinhos, 07/09/2026' };
const PRAIA = { post: post('DcblDxjERIb'), caption: '“Nossa coleção beachwear”, 24/08/2026' };
const ROUPA = ['P', 'M', 'G', 'GG'];

export const products: Product[] = [
  {
    id: 'pijama-curto-listras-rosa',
    name: 'Pijama curto listras rosa',
    category: 'pijamas',
    brand: 'Lua Luá',
    priceCents: 16990,
    images: [
      { id: 'Dd-PqM6DSWz_2', alt: 'Pijama de camiseta e short com listras finas rosa e pink em manequim' },
      { id: 'Dd-PqM6DSWz_1', alt: 'Arara da Lua Luá na Aniz com pijamas em tons de rosa' },
    ],
    colors: [{ name: 'Rosa listrado', hex: '#ef8fb0' }],
    sizes: ROUPA,
    description:
      'Camiseta de manga curta com bolsinho no peito e short combinando, tudo em listras verticais finas de rosa e pink. Um conjunto leve para o dia a dia em casa.',
    details: ['Camiseta de manga curta e short', 'Bolso no peito com bordado discreto', 'Listras verticais rosa e pink'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    featured: true,
    source: LUA,
  },
  {
    id: 'pijama-curto-cerejas',
    name: 'Pijama curto estampa cerejas',
    category: 'pijamas',
    brand: 'Lua Luá',
    priceCents: 17990,
    images: [
      { id: 'Dd-PqM6DSWz_4', alt: 'Pijama rosa-claro com estampa de cerejas e cordão vermelho na cintura' },
      { id: 'Dd-PqM6DSWz_3', alt: 'Detalhe da camiseta rosa com cerejas e bolso com acabamento vermelho' },
    ],
    colors: [{ name: 'Rosa-claro', hex: '#f6c9d4' }],
    sizes: ROUPA,
    description:
      'Rosa-claro salpicado de cerejas vermelhas, com bolso de acabamento contrastante e cordão vermelho no short. Delicado e alegre, como a coleção que chegou em outubro.',
    details: ['Estampa de cerejas', 'Bolso com acabamento vermelho', 'Short com cordão de amarrar'],
    availability: 'ultimas',
    sizeGuide: 'roupa',
    featured: true,
    source: LUA,
  },
  {
    id: 'pijama-alcinha-listras',
    name: 'Pijama de alcinha listrado',
    category: 'pijamas',
    brand: 'Lua Luá',
    priceCents: 15990,
    images: [{ id: 'Dd-PqM6DSWz_5', alt: 'Regata de alças finas e short com listras rosa e vermelhas, com lacinho e cereja no decote' }],
    colors: [{ name: 'Rosa e vermelho', hex: '#e8798f' }],
    sizes: ROUPA,
    description:
      'Regata de alças finas com decote ondulado, lacinho e uma cereja bordada, mais short soltinho no mesmo listrado. Para as noites quentes.',
    details: ['Regata de alças finas', 'Lacinho e cereja no decote', 'Short listrado'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: LUA,
  },
  {
    id: 'pijama-love-fur-ever',
    name: 'Pijama curto Love Fur-ever',
    category: 'pijamas',
    priceCents: 17990,
    images: [{ id: 'Dc_BSPZEQK6_4', alt: 'Camiseta off-white com cachorro salsicha e frase Love you fur-ever, com short de coraçõezinhos' }],
    colors: [{ name: 'Off-white', hex: '#f4efe6' }],
    sizes: ROUPA,
    description:
      'Camiseta off-white com um cachorro salsicha segurando um osso e a frase “Love you fur-ever”, sobre fundo de coraçõezinhos marrons. O short repete os corações.',
    details: ['Camiseta de manga curta e short', 'Estampa de cachorro salsicha', 'Fundo de coraçõezinhos'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    featured: true,
    source: CAES,
  },
  {
    id: 'pijama-regata-caezinhos',
    name: 'Pijama regata cãezinhos',
    category: 'pijamas',
    priceCents: 16990,
    images: [{ id: 'Dc_BSPZEQK6_5', alt: 'Regata off-white com cachorro e short estampado com vários cachorrinhos e cordão bege' }],
    colors: [{ name: 'Off-white', hex: '#f4efe6' }],
    sizes: ROUPA,
    description:
      'Regata com o cachorrinho no peito e short coberto de pequenos cães desenhados, com cordão bege para ajustar. Para quem quer um de cada.',
    details: ['Regata com acabamento na cava', 'Short com estampa de vários cachorrinhos', 'Cordão de amarrar'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: CAES,
  },
  {
    id: 'pijama-regata-love',
    name: 'Pijama regata Love',
    category: 'pijamas',
    priceCents: 16990,
    images: [{ id: 'Dc_BSPZEQK6_6', alt: 'Regata off-white com LOVE you fur-ever e short com dois cachorros salsicha nas laterais' }],
    colors: [{ name: 'Off-white', hex: '#f4efe6' }],
    sizes: ROUPA,
    description:
      'Regata com “LOVE you fur-ever” escrito na vertical e short com dois cachorros salsicha, um de cada lado, segurando corações.',
    details: ['Regata de coraçõezinhos', 'Frase na vertical', 'Cachorros grandes nas pernas do short'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: CAES,
  },
  {
    id: 'camisola-love-fur-ever',
    name: 'Camisola Love Fur-ever',
    category: 'pijamas',
    priceCents: 15990,
    images: [{ id: 'Dc_BSPZEQK6_7', alt: 'Modelo veste camisola off-white de manga curta com corações e frase Love you fur-ever' }],
    colors: [{ name: 'Off-white', hex: '#f4efe6' }],
    sizes: ROUPA,
    description:
      'Camisola reta de manga curta, comprimento acima do joelho, com a frase da coleção no peito e o cachorrinho na manga.',
    details: ['Camisola de manga curta', 'Cachorro estampado na manga', 'Fundo de coraçõezinhos'],
    availability: 'ultimas',
    sizeGuide: 'roupa',
    source: CAES,
  },
  {
    id: 'pijama-pasta-lover',
    name: 'Pijama Pasta Lover',
    category: 'pijamas',
    priceCents: 18990,
    images: [{ id: 'DcVq2N0lWGj_1', alt: 'Camiseta branca com a frase Pasta lover e prato de espaguete, short xadrez vermelho e caixa de presente' }],
    colors: [{ name: 'Branco e xadrez vermelho', hex: '#c8323c' }],
    sizes: ROUPA,
    description:
      'Camiseta branca com “Pasta lover”, um prato de espaguete e tomatinhos, mais short xadrez vermelho e branco. Vem em caixa estampada, como na foto da loja.',
    details: ['Camiseta branca estampada', 'Short xadrez vermelho', 'Caixa estampada'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    featured: true,
    source: { post: post('DcVq2N0lWGj'), caption: '“Verão 2027”, 22/08/2026' },
  },
  {
    id: 'pijama-longo-floral-marinho',
    name: 'Pijama longo floral marinho',
    category: 'pijamas',
    brand: 'Recco',
    priceCents: 22990,
    images: [{ id: 'DX9FF4EDots_1', alt: 'Duas mulheres abraçadas na cama vestindo pijamas longos azul-marinho com florzinhas brancas' }],
    colors: [{ name: 'Azul-marinho floral', hex: '#232c4a' }],
    sizes: ROUPA,
    models: ['Flanelado', 'Leve'],
    description:
      'Blusa de manga longa e calça azul-marinho com florzinhas brancas. Segundo a publicação da loja, a mesma estampa vem em versão flanelada, mais quentinha, e em versão mais leve e fresquinha.',
    details: ['Manga longa e calça', 'Duas versões: flanelada ou leve', 'Estampa de florzinhas'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: { post: post('DX9FF4EDots'), caption: '“Gostoso como abraço de mãe”, 05/05/2026' },
  },
  {
    id: 'sutia-bojo-liso',
    name: 'Sutiã com bojo liso',
    category: 'lingerie',
    priceCents: 8990,
    images: [{ id: 'Dc57t_bEZ3p_1', alt: 'Três sutiãs com bojo liso, nas cores preto, rosa e rosa-claro' }],
    colors: [
      { name: 'Preto', hex: '#1b1b1d' },
      { name: 'Rosa', hex: '#e7a3a7' },
      { name: 'Rosa-claro', hex: '#f3dcdc' },
    ],
    sizes: ['40', '42', '44', '46', '48'],
    description:
      'Sutiã de bojo liso, sem renda, com alças de regular e plaquinha metálica no centro. Na foto da loja aparece em preto, rosa e rosa-claro.',
    details: ['Bojo liso', 'Alças reguláveis', 'Três cores'],
    availability: 'disponivel',
    sizeGuide: 'sutia',
    featured: true,
    source: { post: post('Dc57t_bEZ3p'), caption: '“Para cada tipo de copo um modelo ideal”, 05/09/2026' },
  },
  {
    id: 'conjunto-top-canelado',
    name: 'Top e calcinha canelados',
    category: 'lingerie',
    priceCents: 7990,
    images: [{ id: 'Dc57t_bEZ3p_2', alt: 'Top branco e calcinhas em branco, lilás e rosa-claro com textura canelada' }],
    colors: [
      { name: 'Branco', hex: '#f3f1ec' },
      { name: 'Lilás', hex: '#c9c4e6' },
      { name: 'Rosa-claro', hex: '#f1d6d3' },
    ],
    sizes: ['P', 'M', 'G'],
    description:
      'Top sem bojo aparente e calcinha com faixas de textura canelada. Tons claros, para usar por baixo de tudo.',
    details: ['Top e calcinha', 'Textura canelada', 'Cores claras'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: { post: post('Dc57t_bEZ3p'), caption: '“Para cada tipo de copo um modelo ideal”, 05/09/2026' },
  },
  {
    id: 'praia-palmeiras',
    name: 'Estampa palmeiras',
    category: 'praia',
    priceCents: 21990,
    images: [{ id: 'DcblDxjERIb_1', alt: 'Biquíni e maiô terracota com palmeiras, sol e listras brancas, em cabides na loja' }],
    colors: [{ name: 'Terracota', hex: '#a8443d' }],
    sizes: ['P', 'M', 'G'],
    models: ['Biquíni', 'Maiô'],
    description:
      'Terracota com palmeiras, sol, bolas e listras em branco. A mesma estampa em biquíni de top com laço ou em maiô de alças.',
    details: ['Biquíni ou maiô', 'Estampa de palmeiras e listras', 'Fundo terracota'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    featured: true,
    source: PRAIA,
  },
  {
    id: 'biquini-faixa-macrame-preto',
    name: 'Biquíni faixa com macramê',
    category: 'praia',
    priceCents: 22990,
    images: [{ id: 'DcblDxjERIb_2', alt: 'Modelo na praia com biquíni preto tomara que caia com detalhe de macramê creme' }],
    colors: [{ name: 'Preto e creme', hex: '#141414' }],
    sizes: ['P', 'M', 'G'],
    description:
      'Top faixa preto com aplicação central em trama de macramê creme e amarração no pescoço. A calcinha repete o detalhe na lateral.',
    details: ['Top faixa', 'Aplicação em macramê', 'Amarração no pescoço'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: PRAIA,
  },
  {
    id: 'praia-marinho-macrame',
    name: 'Azul-marinho com macramê',
    category: 'praia',
    priceCents: 23990,
    images: [
      { id: 'DcblDxjERIb_4', alt: 'Biquíni azul-marinho texturizado com faixas de macramê creme, em cabide' },
      { id: 'DcblDxjERIb_5', alt: 'Maiô azul-marinho texturizado com decote em V e macramê creme' },
    ],
    colors: [{ name: 'Azul-marinho', hex: '#1d2a4d' }],
    sizes: ['P', 'M', 'G', 'GG'],
    models: ['Biquíni', 'Maiô'],
    description:
      'Tecido azul-marinho de textura em relevo com aplicações de macramê creme. Biquíni de top com nó na frente ou maiô de decote em V profundo.',
    details: ['Biquíni ou maiô', 'Textura em relevo', 'Aplicações de macramê'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: PRAIA,
  },
  {
    id: 'praia-folhagens-pb',
    name: 'Folhagens preto e branco',
    category: 'praia',
    priceCents: 21990,
    images: [
      { id: 'DcblDxjERIb_7', alt: 'Biquínis com estampa de folhas e listras em preto e branco, em cabides' },
      { id: 'DcblDxjERIb_6', alt: 'Biquíni listrado e maiô de folhagens e quadriculado em preto e branco' },
    ],
    colors: [{ name: 'Preto e branco', hex: '#2a2a2a' }],
    sizes: ['P', 'M', 'G'],
    models: ['Biquíni', 'Maiô'],
    description:
      'Folhas grandes, listras e quadriculado em preto e branco, misturados no mesmo conjunto. Biquíni com amarração ou maiô de alças.',
    details: ['Biquíni ou maiô', 'Folhagens, listras e quadriculado', 'Preto e branco'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: PRAIA,
  },
  {
    id: 'biquini-garcas',
    name: 'Biquíni estampa garças',
    category: 'praia',
    priceCents: 22990,
    images: [{ id: 'DcblDxjERIb_8', alt: 'Dois biquínis com estampa de garças em caramelo, creme e azul-marinho' }],
    colors: [{ name: 'Caramelo e marinho', hex: '#c98b4e' }],
    sizes: ['P', 'M', 'G'],
    models: ['Top frente única', 'Top cropped'],
    description:
      'Garças de asas abertas em caramelo, creme e laranja sobre azul-marinho. Escolha entre o top frente única com amarração e o top cropped.',
    details: ['Dois modelos de top', 'Estampa de garças', 'Calcinha na mesma estampa'],
    availability: 'ultimas',
    sizeGuide: 'roupa',
    source: PRAIA,
  },
  {
    id: 'praia-aquarela',
    name: 'Biquíni aquarela e saída',
    category: 'praia',
    priceCents: 19990,
    images: [{ id: 'DcblDxjERIb_3', alt: 'Biquíni em aquarela azul e preta ao lado de saída de praia branca com pássaros e paisagem' }],
    colors: [{ name: 'Azul aquarela', hex: '#5d7fa6' }],
    sizes: ['P', 'M', 'G'],
    models: ['Biquíni', 'Saída de praia'],
    description:
      'Biquíni em manchas de aquarela azul, preto e areia, e saída de praia branca, sem mangas, com pássaros e uma paisagem pintada na barra.',
    details: ['Biquíni ou saída de praia', 'Estampa aquarelada', 'Saída branca com pássaros'],
    availability: 'disponivel',
    sizeGuide: 'roupa',
    source: PRAIA,
  },
  {
    id: 'bolsa-praia-de-chelles',
    name: 'Bolsa de praia De Chelles',
    category: 'bolsas',
    brand: 'De Chelles',
    priceCents: 14990,
    images: [
      { id: 'Dddv5NAlYxE_1', alt: 'Bolsas de lona De Chelles off-white e preta sobre balcão de vidro' },
      { id: 'Dddv5NAlYxE_2', alt: 'Bolsa de lona off-white com etiqueta De Chelles e bolso externo' },
      { id: 'Dddv5NAlYxE_3', alt: 'Detalhe da etiqueta De Chelles na lona off-white' },
      { id: 'Dddv5NAlYxE_4', alt: 'Bolsa off-white no ombro de manequim com saída de praia azul-marinho vazada' },
    ],
    colors: [
      { name: 'Off-white', hex: '#efe7d6' },
      { name: 'Preto', hex: '#151515' },
    ],
    sizes: ['Único'],
    description:
      'Bolsa grande de lona com alças de ombro, bolso externo e etiqueta De Chelles. A loja apresenta nas cores off-white e preto, para praia, piscina e viagem.',
    details: ['Lona com etiqueta De Chelles', 'Bolso externo', 'Off-white ou preto'],
    availability: 'disponivel',
    sizeGuide: null,
    featured: true,
    source: { post: post('Dddv5NAlYxE'), caption: '“As bolsas De Chelles chegaram”, 19/09/2026' },
  },
  {
    id: 'mala-de-bordo-avec-vous',
    name: 'Mala de bordo Avec Vous',
    category: 'bolsas',
    brand: 'Avec Vous',
    priceCents: 34990,
    images: [
      { id: 'Dax6Re8Dout_1', alt: 'Mala de mão bordô com losangos claros e alças cinza, segurada por uma pessoa' },
      { id: 'Dd-PqM6DSWz_6', alt: 'Mala bordô de losangos com necessaire de rolo na mesma estampa' },
    ],
    colors: [{ name: 'Bordô losangos', hex: '#8e2f3a' }],
    sizes: ['Único'],
    description:
      'Mala de mão em losangos bordô e creme, com alças e acabamentos cinza e alça transversal. A peça de divulgação da loja a apresenta como mala de bordo, impermeável e fácil de lavar.',
    details: ['Tamanho de bordo (segundo a divulgação)', 'Alças de mão e transversal', 'Estampa de losangos'],
    availability: 'disponivel',
    sizeGuide: null,
    featured: true,
    source: { post: post('Dax6Re8Dout'), caption: '“Nossas malas de mão”, 14/07/2026' },
  },
  {
    id: 'frasqueira-avec-vous',
    name: 'Frasqueira Avec Vous',
    category: 'bolsas',
    brand: 'Avec Vous',
    priceCents: 17990,
    images: [{ id: 'Dax6Re8Dout_4', alt: 'Frasqueira e mala bordô de losangos sobre colcha branca, com sacola de presente' }],
    colors: [{ name: 'Bordô losangos', hex: '#8e2f3a' }],
    sizes: ['Único'],
    description:
      'Frasqueira estruturada com alça de mão, da mesma linha de losangos bordô da mala de bordo. Faz par com ela na viagem.',
    details: ['Formato estruturado', 'Alça de mão', 'Combina com a mala de bordo'],
    availability: 'esgotado',
    sizeGuide: null,
    source: { post: post('Dax6Re8Dout'), caption: '“Nossas malas de mão”, 14/07/2026' },
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
export const categoryName = (id: CategoryId) => categories.find((c) => c.id === id)!.name;
export const availabilityLabel: Record<Availability, string> = {
  disponivel: 'Disponível',
  ultimas: 'Últimas unidades',
  esgotado: 'Esgotado',
};
