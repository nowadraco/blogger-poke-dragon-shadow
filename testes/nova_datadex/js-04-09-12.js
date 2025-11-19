// =============================================================
//  SCRIPT POKÉMON UNIFICADO com datadex 18/09/2025)
// =============================================================

// --- 1. CONSTANTES DE CONFIGURAÇÃO (CORRIGIDAS COM CDN) ---
const URLS = {
  MAIN_DATA:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data.json",
  MAIN_DATA_FALLBACK:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@18f7702d32cdf657ab1aba43a53894aed4462283/json/poke_data.json",
  MEGA_DATA:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/mega_reides.json",
  GIGAMAX_DATA:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data_gigamax.json",
  IMAGES_PRIMARY:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/imagens_pokemon.json",
  IMAGES_ALT:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/imagens_pokemon_alt.json",
  TYPE_DATA:
    "https://cdn.jsdelivr.net/gh/nowadraco/bloggerpoke@main/src/data/gamemaster/tipos_poke.json",
  MOVE_TRANSLATIONS:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_portugues.json",
  MOVE_DATA:
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/moves.json",
};
const cpms = [
  0.0939999967813491, 0.135137430784308, 0.166397869586944, 0.192650914456886,
  0.215732470154762, 0.236572655026622, 0.255720049142837, 0.273530381100769,
  0.29024988412857, 0.306057381335773, 0.321087598800659, 0.335445032295077,
  0.349212676286697, 0.36245774877879, 0.375235587358474, 0.387592411085168,
  0.399567276239395, 0.41119354951725, 0.422500014305114, 0.432926413410414,
  0.443107545375824, 0.453059953871985, 0.46279838681221, 0.472336077786704,
  0.481684952974319, 0.490855810259008, 0.499858438968658, 0.508701756943992,
  0.517393946647644, 0.525942508771329, 0.534354329109191, 0.542635762230353,
  0.550792694091796, 0.558830599438087, 0.566754519939422, 0.574569148039264,
  0.582278907299041, 0.589887911977272, 0.59740000963211, 0.604823657502073,
  0.61215728521347, 0.61940411056605, 0.626567125320434, 0.633649181622743,
  0.640652954578399, 0.647580963301656, 0.654435634613037, 0.661219263506722,
  0.667934000492096, 0.674581899290818, 0.681164920330047, 0.687684905887771,
  0.694143652915954, 0.700542893277978, 0.706884205341339, 0.713169102333341,
  0.719399094581604, 0.725575616972598, 0.731700003147125, 0.734741011137376,
  0.737769484519958, 0.740785574597326, 0.743789434432983, 0.746781208702482,
  0.749761044979095, 0.752729105305821, 0.75568550825119, 0.758630366519684,
  0.761563837528228, 0.764486065255226, 0.767397165298461, 0.77029727397159,
  0.77318650484085, 0.776064945942412, 0.778932750225067, 0.781790064808426,
  0.784636974334716, 0.787473583646825, 0.790300011634826, 0.792803950958807,
  0.795300006866455, 0.79780392148697, 0.800300002098083, 0.802803892322847,
  0.805299997329711, 0.807803863460723, 0.81029999256134, 0.812803834895026,
  0.815299987792968, 0.817803806620319, 0.820299983024597, 0.822803778631297,
  0.825299978256225, 0.827803750922782, 0.830299973487854, 0.832803753381377,
  0.835300028324127, 0.837803755931569, 0.840300023555755, 0.842803729034748,
  0.845300018787384, 0.847803702398935, 0.850300014019012, 0.852803676019539,
  0.85530000925064, 0.857803649892077, 0.860300004482269, 0.862803624012168,
  0.865299999713897,
];
const TYPE_TRANSLATION_MAP = {
  grass: "Planta",
  poison: "Venenoso",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  ice: "Gelo",
  fighting: "Lutador",
  ground: "Terrestre",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
  normal: "Normal",
};

// =============================================================
//         ▼▼▼ ADICIONE ESTE BLOCO DE CONSTANTES AQUI ▼▼▼
// (Você precisa definir as constantes globais que removemos de 'renderPage')
// =============================================================
const MAX_STAT_ATK = 414;
const MAX_STAT_DEF = 505;
const MAX_STAT_HP = 496;
const MAX_POSSIBLE_CP = 9255;
// =============================================================

// --- 2. VARIÁVEIS GLOBAIS DE ESTADO ---

let GLOBAL_POKE_DB = null;

let allPokemonDataForList = [];
let currentPokemonList = [];
let topControls = null;
let datadexContent = null;

// --- 3. FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO E CÁLCULO ---

function getTypeColor(tipo) {
  const typeColors = {
    normal: "#A8A77A",
    fogo: "#FF4500",
    água: "#1E90FF",
    elétrico: "#F7D02C",
    planta: "#32CD32",
    gelo: "#96D9D6",
    lutador: "#C22E28",
    venenoso: "#A33EA1",
    terrestre: "#E2BF65",
    voador: "#A98FF3",
    psíquico: "#F95587",
    inseto: "#A6B91A",
    pedra: "#B6A136",
    fantasma: "#735797",
    dragão: "#6F35FC",
    sombrio: "#705746",
    aço: "#B7B7CE",
    fada: "#D685AD",
    grass: "#32CD32",
    poison: "#A33EA1",
    fire: "#FF4500",
    water: "#1E90FF",
    electric: "#F7D02C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };
  return typeColors[tipo.toLowerCase()] || "#FFFFFF";
}

function getTypeIcon(tipo) {
  const typeIcons = {
    aço: "aco",
    água: "agua",
    dragão: "dragao",
    elétrico: "eletrico",
    fada: "fada",
    fantasma: "fantasma",
    fogo: "fogo",
    gelo: "gelo",
    inseto: "inseto",
    lutador: "lutador",
    normal: "normal",
    pedra: "pedra",
    planta: "planta",
    psíquico: "psiquico",
    sombrio: "sombrio",
    terrestre: "terrestre",
    venenoso: "venenoso",
    voador: "voador",
    grass: "planta",
    poison: "venenoso",
    fire: "fogo",
    water: "agua",
    electric: "eletrico",
    ice: "gelo",
    fighting: "lutador",
    ground: "terrestre",
    flying: "voador",
    psychic: "psiquico",
    bug: "inseto",
    rock: "pedra",
    ghost: "fantasma",
    dragon: "dragao",
    dark: "sombrio",
    steel: "aco",
    fairy: "fada",
  };
  const iconName = typeIcons[tipo.toLowerCase()];
  return iconName
    ? `https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/${iconName}.png`
    : "";
}

function getWeatherIcon(tipo) {
  const weatherMap = {
    planta: "ensolarado",
    fogo: "ensolarado",
    terrestre: "ensolarado",
    água: "chovendo",
    elétrico: "chovendo",
    inseto: "chovendo",
    normal: "parcialmente_nublado",
    pedra: "parcialmente_nublado",
    fada: "nublado",
    lutador: "nublado",
    venenoso: "nublado",
    voador: "ventando",
    dragão: "ventando",
    psíquico: "ventando",
    gelo: "nevando",
    aço: "nevando",
    sombrio: "neblina",
    fantasma: "neblina",
  };
  const translatedType = TYPE_TRANSLATION_MAP[tipo.toLowerCase()] || tipo;
  const icon = weatherMap[translatedType.toLowerCase()];
  return icon
    ? `https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/${icon}.png`
    : "";
}

// =============================================================
//        ▼▼▼ ADICIONE ESTA NOVA FUNÇÃO AUXILIAR ▼▼▼
// (Ela verifica se uma cor hex é "clara" ou "escura")
// =============================================================
function isColorLight(hexColor) {
  if (!hexColor) return false;
  // Remove o #
  const hex = hexColor.replace("#", "");
  // Converte r, g, b
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Calcula a luminância (brilho) da cor
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  // Retorna 'true' (verdadeiro) se a cor for clara (ex: amarelo)
  // e 'false' (falso) se for escura (ex: azul)
  return yiq >= 150; 
}
// =============================================================

function calculateCP(baseStats, ivs, level) {
  const cpm = cpms[Math.round((level - 1) * 2)];
  return Math.floor(
    ((baseStats.atk + ivs.atk) *
      Math.sqrt(baseStats.def + ivs.def) *
      Math.sqrt(baseStats.hp + ivs.hp) *
      cpm *
      cpm) /
      10
  );
}

/**
 * Ordena uma lista de Pokémon com base em uma chave.
 * @param {Array} list - A lista de Pokémon para ordenar.
 * @param {string} key - A chave de ordenação ('dex', 'cp', 'atk', 'def', 'hp').
 * @returns {Array} A lista ordenada.
 */
function sortList(list, key) {
  return list.sort((a, b) => {
    // Garante que temos dados válidos para comparar
    if (!a || !b) return 0;

    switch (key) {
      case "cp":
        // Ordena por CP Máximo (Decrescente)
        return (b.maxCP || 0) - (a.maxCP || 0);
      case "atk":
        // Ordena por Ataque (Decrescente)
        return (b.baseStats?.atk || 0) - (a.baseStats?.atk || 0);
      case "def":
        // Ordena por Defesa (Decrescente)
        return (b.baseStats?.def || 0) - (a.baseStats?.def || 0);
      case "hp":
        // Ordena por HP/Stamina (Decrescente)
        return (b.baseStats?.hp || 0) - (a.baseStats?.hp || 0);
      case "dex":
      default:
        // Ordena por Número da Dex (Crescente)
        return (a.dex || 0) - (b.dex || 0);
    }
  });
}

function formatarNomeParaExibicao(speciesName) {
  if (!speciesName) return "";

  // Mapa para traduzir nomes técnicos para nomes de exibição amigáveis
  const mapaDeNomesEspeciais = {
    "Zacian (Hero)": "Zacian",
    "Zamazenta (Hero)": "Zamazenta",
    "Giratina (Origin)": "Giratina (Forma Original)",
    "Aegislash (Shield)": "Aegislash",
    "Urshifu (Single Strike)": "Urshifu Golpe Decisivo",
    "Urshifu (Rapid Strike)": "Urshifu Golpe Fluido",
    "Tornadus (Incarnate)": "Tornadus",
    "Thundurus (Incarnate)": "Thundurus",
    "Landorus (Incarnate)": "Landorus",
    "Indeedee (Male)": "Indeedee (Macho)",
    "Indeedee (Female)": "Indeedee (Fêmea)",
    "Pikachu (Libre)": "Pikachu Libre",
  };

  // 1. Primeiro, ele verifica se o nome é um caso especial no mapa
  if (mapaDeNomesEspeciais[speciesName]) {
    return mapaDeNomesEspeciais[speciesName];
  }

  // 2. Se não for, ele aplica a sua lista de substituições simples
  return speciesName
    .replace("(Alolan)", "de Alola")
    .replace("(Galarian)", "de Galar")
    .replace("(Hisuian)", "de Hisui")
    .replace("(Paldean)", "de Paldea")
    .replace("Nidoran Male", "Nidoran\u2642")
    .replace("Nidoran Female", "Nidoran\u2640")
    .replace("Greattusk", "Great Tusk")
    .replace("Screamtail", "Scream Tail")
    .replace("Brutebonnet", "Brute Bonnet")
    .replace("Fluttermane", "Flutter Mane")
    .replace("Slitherwing", "Slither Wing")
    .replace("Sandyshocks", "Sandy Shocks")
    .replace("Irontreads", "Iron Treads")
    .replace("Ironbundle", "Iron Bundle")
    .replace("Ironhands", "Iron Hands")
    .replace("Ironjugulis", "Iron Jugulis")
    .replace("Ironmoth", "Iron Moth")
    .replace("Ironthorns", "Iron Thorns")
    .replace("Roaringmoon", "Roaring Moon")
    .replace("Ironvaliant", "Iron Valiant")
    .replace("Cherrim (Overcast)", "Cherrim (Forma Nublada)")
    .replace("Cherrim (Sunshine)", "Cherrim (Forma Ensolarada)")
    .replace("Shaymin (Land)", "Shaymin (Forma Terrestre)")
    .replace("Shaymin (Sky)", "Shaymin (Forma Céu)")
    .replace("Mewtwo (Armored)", "Mewtwo de Armadura")
    .replace("Oricorio (Baile)", "Oricorio Estilo Flamenco")
    .replace("Toxtricity (Amped)", "Toxtricity (Forma Aguda)")
    .replace("Toxtricity (Low Key)", "Toxtricity (Forma Grave)")
    .replace("Urshifu (Rapid Strike) Gigamax", "Urshifu Golpe Fluido Gigamax")
    .replace(
      "Urshifu (Single Strike) Gigamax",
      "Urshifu Golpe Decisivo Gigamax"
    )
    .replace("Basculegion (Female)", "Basculegion Femea")
    .replace("Basculegion (Male)", "Basculegion Macho")
    .replace("Enamorus (Incarnate)", "Enamorus Forma Materializada")
    .replace("Enamorus (Therian)", "Enamorus Forma Therian")
    .replace("Morpeko (Full Belly)", "Morpeko (Saciada)")
    .replace("Morpeko (Hangry)", "Morpeko (Voraz)")
    .replace("Zacian (Crowned Sword)", "Zacian Espada Coroada")
    .replace("Zamazenta (Crowned Shield)", "Zamazenta Escudo Coroado")
    .replace("Calyrex (Ice Rider)", "Calyrex (Cavaleiro do Glacial)")
    .replace("Minior (Core)", "Minior (Nucleo)")
    .replace("Minior (Meteor)", "Minior (Meteoro)")
    .replace("Eiscue (Ice)", "Eiscue (Gelo)")
    .replace("Silvally (Bug)", "Silvally (Inseto)")
    .replace("Silvally (Dark)", "Silvally (Sombrio)")
    .replace("Silvally (Dragon)", "Silvally (Dragão)")
    .replace("Silvally (Electric)", "Silvally (Elétrico)")
    .replace("Silvally (Fairy)", "Silvally (Fada)")
    .replace("Silvally (Fighting)", "Silvally (Lutador)")
    .replace("Silvally (Fire)", "Silvally (Fogo)")
    .replace("Silvally (Flying)", "Silvally (Voador)")
    .replace("Silvally (Ghost)", "Silvally (Fantasma)")
    .replace("Silvally (Grass)", "Silvally (Planta)")
    .replace("Silvally (Ground)", "Silvally (Terrestre)")
    .replace("Silvally (Ice)", "Silvally (Gelo)")
    .replace("Silvally (Normal)", "Silvally (Normal)")
    .replace("Silvally (Poison)", "Silvally (Venenoso)")
    .replace("Silvally (Psychic)", "Silvally (Psíquico)")
    .replace("Silvally (Rock)", "Silvally (Pedra)")
    .replace("Silvally (Steel)", "Silvally (Metálico)")
    .replace("Silvally (Water)", "Silvally (Água)")
    .replace("Oricorio (Pa'u)", "Oricorio Estilo Hula")
    .replace("Oricorio (Pom-Pom)", "Oricorio Estilo Animado")
    .replace("Oricorio (Sensu)", "Oricorio Estilo Elegante")
    .replace("Lycanroc (Dusk)", "Lycanroc (Crepúsculo)")
    .replace("Lycanroc (Midday)", "Lycanroc (Diurno)")
    .replace("Lycanroc (Midnight)", "Lycanroc (Noturno)")
    .replace("Wishiwashi (School)", "Wishiwashi Cardume")
    .replace("Wishiwashi (Solo)", "Wishiwashi Solo")
    .replace("Keldeo (Ordinary)", "Keldeo (Normal)")
    .replace("Meloetta (Aria)", "Meloetta (Canto)")
    .replace("Meloetta (Pirouette)", "Meloetta (Dança)")
    .replace("Genesect (Burn)", "Genesect Disco Incendiante")
    .replace("Genesect (Chill)", "Genesect Disco Congelante")
    .replace("Genesect (Douse)", "Genesect Disco Hídrico")
    .replace("Genesect (Shock)", "Genesect Disco Elétrico")
    .replace("Meowstic (Female)", "Meowstic (Femea)")
    .replace("Meowstic (Male)", "Meowstic (Macho)")
    .replace("Pumpkaboo (Average)", "Pumpkaboo (Médio)")
    .replace("Pumpkaboo (Large)", "Pumpkaboo (Grande)")
    .replace("Pumpkaboo (Small)", "Pumpkaboo (Pequeno)")
    .replace("Pumpkaboo (Super)", "Pumpkaboo (Super)")
    .replace("Gourgeist (Average)", "Gourgeist (Médio)")
    .replace("Gourgeist (Large)", "Gourgeist (Grande)")
    .replace("Gourgeist (Small)", "Gourgeist (Pequeno)")
    .replace("Gourgeist (Super)", "Gourgeist (Super)")
    .replace("Zygarde (10% Forme)", "Zygarde Forma 10%")
    .replace("Zygarde (50% Forme)", "Zygarde Forma 50%")
    .replace("Zygarde (Complete Forme)", "Zygarde Forma Completa")
    .replace("Hoopa (Confined)", "Hoopa")
    .replace("Hoopa (Unbound)", "Hoopa Libertado")
    .replace("Darmanitan (Zen)", "Darmanitan (Estilo Zen)");
}

// --- 4. LÓGICA DE BUSCA E NOMENCLATURA ---

function gerarChavesDeBuscaPossiveis(nomeOriginal) {
  let nomeLimpo = nomeOriginal
    .replace(/(Dinamax|Gigantamax)/i, "")
    .replace(/\*/g, "")
    .trim();

  if (nomeLimpo.includes("Flabébé")) {
    nomeLimpo = "Flabebe";
  } else if (nomeLimpo.includes("Floette")) {
    nomeLimpo = "Floette";
  } else if (nomeLimpo.includes("Florges")) {
    nomeLimpo = "Florges";
  }

  const chaves = new Set();

  chaves.add(nomeLimpo);

  // 2. LÓGICA DE MEGA CORRIGIDA: Adiciona a outra variação possível
  if (nomeLimpo.startsWith("Mega ")) {
    const nomeBase = nomeLimpo.substring(5);
    chaves.add(`${nomeBase} (Mega)`); // Adiciona "Sharpedo (Mega)"
  } else if (nomeLimpo.endsWith(" (Mega)")) {
    const nomeBase = nomeLimpo.replace(" (Mega)", "");
    chaves.add(`Mega ${nomeBase}`); // Adiciona "Mega Sharpedo"
  }

  // 3. Clona o Set para iterar e adicionar mais variações
  const chavesAtuais = Array.from(chaves);

  const adicionarVariacoes = (nome) => {
    chaves.add(nome);
    const pares = [
      [" de Alola", " (Alolan)"],
      [" de Galar", " (Galarian)"],
      [" de Hisui", " (Hisuian)"],
      [" de Paldea", " (Paldean)"],
      ["Nidoran\u2642", "Nidoran Male"],
      ["Nidoran\u2640", "Nidoran Female"],
      [" (Forma Curvada)", " (Curly)"],
      [" (Forma Pendular)", " (Droopy)"],
      [" (Forma Estendida)", " (Stretchy)"],
      [" (Forma Aguda)", " (Amped)"],
      [" (Forma Grave)", " (Low Key)"],
      ["Urshifu Golpe Decisivo", "Urshifu (Single Strike)"],
      ["Urshifu Golpe Fluido", "Urshifu (Rapid Strike)"],
      ["Slakoth de viseira", "Slakoth"],
      ["Oricorio Estilo Animado", "Oricorio (Pom-Pom)"],
      ["Oricorio Estilo Flamenco", "Oricorio (Baile)"],
      ["Oricorio Estilo Hula", "Oricorio (Pa'u)"],
      ["Oricorio Estilo Elegante", "Oricorio (Sensu)"],
      ["Espada Coroada", "(Crowned Sword)"],
      ["Escudo Coroado", "(Crowned Shield)"],
      ["Pikachu Elegante (detalhes vermelhos)", "Pikachu"],
      ["Pikachu Elegante (detalhes azuis)", "Pikachu"],
      ["Pikachu Elegante (detalhes amarelos)", "Pikachu"],
      ["Pikachu Libre", "Pikachu (Libre)"],
      ["Falinks em treinamento", "Falinks"],
      ["Zacian", "Zacian (Hero)"],
      ["Zamazenta", "Zamazenta (Hero)"],
      ["Giratina (Forma Original)", "Giratina (Origin)"],
      ["Aegislash", "Aegislash (Shield)"],
      ["Aegislash (Espada)", "Aegislash (Blade)"],
      ["Aegislash (Escudo)", "Aegislash (Shield)"],
      ["Unown A", "Unown"],
      ["Unown B", "Unown"],
      ["Unown C", "Unown"],
      ["Unown D", "Unown"],
      ["Unown E", "Unown"],
      ["Unown F", "Unown"],
      ["Unown G", "Unown"],
      ["Unown H", "Unown"],
      ["Unown I", "Unown"],
      ["Unown J", "Unown"],
      ["Unown K", "Unown"],
      ["Unown L", "Unown"],
      ["Unown M", "Unown"],
      ["Unown N", "Unown"],
      ["Unown O", "Unown"],
      ["Unown P", "Unown"],
      ["Unown Q", "Unown"],
      ["Unown R", "Unown"],
      ["Unown S", "Unown"],
      ["Unown T", "Unown"],
      ["Unown U", "Unown"],
      ["Unown V", "Unown"],
      ["Unown W", "Unown"],
      ["Unown X", "Unown"],
      ["Unown Y", "Unown"],
      ["Unown Z", "Unown"],
      ["Unown !", "Unown"],
      ["Unown ?", "Unown"],
      ["Tornadus", "Tornadus (Incarnate)"],
      ["Thundurus", "Thundurus (Incarnate)"],
      ["Landorus", "Landorus (Incarnate)"],
      ["Indeedee (Macho)", "Indeedee (Male)"],
      ["Indeedee (Femea)", "Indeedee (Female)"],
      ["Greattusk", "Great Tusk"],
      ["Screamtail", "Scream Tail"],
      ["Brutebonnet", "Brute Bonnet"],
      ["Fluttermane", "Flutter Mane"],
      ["Slitherwing", "Slither Wing"],
      ["Sandyshocks", "Sandy Shocks"],
      ["Irontreads", "Iron Treads"],
      ["Ironbundle", "Iron Bundle"],
      ["Ironhands", "Iron Hands"],
      ["Ironjugulis", "Iron Jugulis"],
      ["Ironmoth", "Iron Moth"],
      ["Ironthorns", "Iron Thorns"],
      ["Roaringmoon", "Roaring Moon"],
      ["Ironvaliant", "Iron Valiant"],
      ["Kyurem Branco", "Kyurem (White)"],
      ["Kyurem Preto", "Kyurem (Black)"],
      ["Kyurem Branco", "Kyurem (White)"],
      ["Kyurem Preto", "Kyurem (Black)"],
      ["Ursaluna com Chapéu de Bruxa", "Ursaluna"],
      ["Teddiursa com Chapéu de Bruxa", "Teddiursa"],
      ["Ursaring com Chapéu de Bruxa", "Ursaring"],
      ["Noibat com Tiara", "Noibat"],
      ["Noivern com Tiara", "Noivern"],
      ["Burmy (Plant)", "Burmy Manto Vegetal"],
      ["Giratina (Altered)", "Giratina (Forma Alternada)"],
      ["Wormadam (Plant)", "Wormadam Manto Vegetal"],
      ["Cherrim (Overcast)", "Cherrim (Forma Nublada)"],
      ["Cherrim (Sunshine)", "Cherrim (Forma Ensolarada)"],
      ["Cherrim (Sunshine)", "Cherrim (Forma Ensolarada)"],
      ["Pikachu (5th Anniversary)", "Pikachu 5th Aniversário"],
      ["Pikachu (Flying)", "Pikachu Voador"],
      ["Pikachu (Horizons)", "Pikachu Horizons"],
      ["Pikachu (Kariyushi)", "Pikachu Kariyushi"],
      ["Pikachu (Pop Star)", "Pikachu Pop Star"],
      ["Pikachu (Rock Star)", "Pikachu Rock Star"],
      ["Pikachu (Shaymin Scarf)", "Pikachu Shaymin Scarf"],
      ["Tauros (Aqua)", "Tauros de Paldea Espécie Aquática"],
      ["Tauros (Blaze)", "Tauros de Paldea Espécie Labareda"],
      ["Tauros (Combat)", "Tauros de Paldea Espécie de Combate"],
      ["Mewtwo (Armored)", "Mewtwo de Armadura"],
      ["Castform (Rainy)", "Castform Chuvosa"],
      ["Castform (Snowy)", "Castform Nevada"],
      ["Castform (Sunny)", "Castform Emsolarada"],
      ["Deoxys (Attack)", "Deoxys Forma Ataque"],
      ["Deoxys (Defense)", "Deoxys Forma Defesa"],
      ["Deoxys (Speed)", "Deoxys Forma Velocidade"],
      ["Burmy (Sandy)", "Burmy Manto Arenoso"],
      ["Burmy (Trash)", "Burmy Manto de Lixo"],
      ["Wormadam (Sandy)", "Wormadam Manto Arenoso"],
      ["Wormadam (Trash)", "Wormadam Manto de Lixo"],
      ["Rotom (Fan)", "Rotom Fan"],
      ["Rotom (Frost)", "Rotom Frost"],
      ["Rotom (Heat)", "Rotom Heat"],
      ["Rotom (Mow)", "Rotom Mow"],
      ["Rotom (Wash)", "Rotom Wash"],
      ["Dialga (Origin)", "Dialga (Origem)"],
      ["Palkia (Origin)", "Palkia (Origem)"],
      ["Shaymin (Land)", "Shaymin (Forma Terrestre)"],
      ["Shaymin (Sky)", "Shaymin (Forma Céu)"],
      ["Arceus (Bug)", "Arceus Tipo Inseto"],
      ["Arceus (Dark)", "Arceus Tipo Sombrio"],
      ["Arceus (Dragon)", "Arceus Tipo Dragão"],
      ["Arceus (Electric)", "Arceus Tipo Elétrico"],
      ["Arceus (Fairy)", "Arceus Tipo Fada"],
      ["Arceus (Fighting)", "Arceus Tipo Lutador"],
      ["Arceus (Fire)", "Arceus Tipo Fogo"],
      ["Arceus (Flying)", "Arceus Tipo Voador"],
      ["Arceus (Ghost)", "Arceus Tipo Fantasma"],
      ["Arceus (Grass)", "Arceus Tipo Grama"],
      ["Arceus (Ground)", "Arceus Tipo Terrestre"],
      ["Arceus (Ice)", "Arceus Tipo Gelo"],
      ["Arceus (Poison)", "Arceus Tipo Venenoso"],
      ["Arceus (Psychic)", "Arceus Tipo Psíquico"],
      ["Arceus (Rock)", "Arceus Tipo Pedra"],
      ["Arceus (Steel)", "Arceus Tipo Aço"],
      ["Arceus (Water)", "Arceus Tipo Água"],
      ["Samurott (Hisuian)", "Samurott (Hisuian)"],
      ["Lilligant (Hisuian)", "Lilligant (Hisuian)"],
      ["Darumaka (Galarian)", "Darumaka de Galar"],
      ["Darmanitan (Galarian Zen)", "Darmanitan de Galar (Estilo Zen)"],
      ["Darmanitan (Galarian)", "Darmanitan de Galar"],
      ["Darmanitan (Standard)", "Darmanitan"],
      ["Darmanitan (Standard) (Shadow)", "Darmanitan (Shadow)"],
      ["Darmanitan (Zen)", "Darmanitan (Estilo Zen)"],
      ["Yamask (Galarian)", "Yamask de Galar"],
      ["Keldeo (Ordinary)", "Keldeo (Normal)"],
      ["Meloetta (Aria)", "Meloetta (Canto)"],
      ["Meloetta (Pirouette)", "Meloetta (Dança)"],
      ["Genesect (Burn)", "Genesect Disco Incendiante"],
      ["Genesect (Chill)", "Genesect Disco Congelante"],
      ["Genesect (Douse)", "Genesect Disco Hídrico"],
      ["Genesect (Shock)", "Genesect Disco Elétrico"],
      ["Meowstic (Female)", "Meowstic (Femea)"],
      ["Meowstic (Male)", "Meowstic (Macho)"],
      ["Pumpkaboo (Average)", "Pumpkaboo (Médio)"],
      ["Pumpkaboo (Large)", "Pumpkaboo (Grande)"],
      ["Pumpkaboo (Small)", "Pumpkaboo (Pequeno)"],
      ["Pumpkaboo (Super)", "Pumpkaboo (Super)"],
      ["Gourgeist (Average)", "Gourgeist (Médio)"],
      ["Gourgeist (Large)", "Gourgeist (Grande)"],
      ["Gourgeist (Small)", "Gourgeist (Pequeno)"],
      ["Gourgeist (Super)", "Gourgeist (Super)"],
      ["Zygarde (10% Forme)", "Zygarde Forma 10%"],
      ["Zygarde (50% Forme)", "Zygarde Forma 50%"],
      ["Zygarde (Complete Forme)", "Zygarde Forma Completa"],
      ["Hoopa (Confined)", "Hoopa"],
      ["Hoopa (Unbound)", "Hoopa Libertado"],
      ["Decidueye (Hisuian)", "Decidueye (Hisuian)"],
      ["Oricorio (Baile)", "Oricorio Estilo Flamenco"],
      ["Oricorio (Pa'u)", "Oricorio Estilo Hula"],
      ["Oricorio (Pom-Pom)", "Oricorio Estilo Animado"],
      ["Oricorio (Sensu)", "Oricorio Estilo Elegante"],
      ["Lycanroc (Dusk)", "Lycanroc (Crepúsculo)"],
      ["Lycanroc (Midday)", "Lycanroc (Diurno)"],
      ["Lycanroc (Midnight)", "Lycanroc (Noturno)"],
      ["Wishiwashi (School)", "Wishiwashi Cardume"],
      ["Wishiwashi (Solo)", "Wishiwashi Solo"],
      ["Silvally (Bug)", "Silvally (Inseto)"],
      ["Silvally (Dark)", "Silvally (Sombrio)"],
      ["Silvally (Dragon)", "Silvally (Dragão)"],
      ["Silvally (Electric)", "Silvally (Elétrico)"],
      ["Silvally (Fairy)", "Silvally (Fada)"],
      ["Silvally (Fighting)", "Silvally (Lutador)"],
      ["Silvally (Fire)", "Silvally (Fogo)"],
      ["Silvally (Flying)", "Silvally (Voador)"],
      ["Silvally (Ghost)", "Silvally (Fantasma)"],
      ["Silvally (Grass)", "Silvally (Planta)"],
      ["Silvally (Ground)", "Silvally (Terrestre)"],
      ["Silvally (Ice)", "Silvally (Gelo)"],
      ["Silvally (Normal)", "Silvally (Normal)"],
      ["Silvally (Poison)", "Silvally (Venenoso)"],
      ["Silvally (Psychic)", "Silvally (Psíquico)"],
      ["Silvally (Rock)", "Silvally (Pedra)"],
      ["Silvally (Steel)", "Silvally (Metálico)"],
      ["Silvally (Water)", "Silvally (Água)"],
      ["Minior (Core)", "Minior (Nucleo)"],
      ["Minior (Meteor)", "Minior (Meteoro)"],
      ["Toxtricity (Amped)", "Toxtricity (Forma Aguda)"],
      ["Toxtricity (Low Key)", "Toxtricity (Forma Grave)"],
      ["Eiscue (Ice)", "Eiscue (Gelo)"],
      ["Eiscue (Noice)", "Eiscue (Noice)"],
      ["Morpeko (Full Belly)", "Morpeko (Saciada)"],
      ["Morpeko (Hangry)", "Morpeko (Voraz)"],
      ["Zacian (Crowned Sword)", "Zacian Espada Coroada"],
      ["Zacian (Hero)", "Zacian"],
      ["Zamazenta (Crowned Shield)", "Zamazenta Escudo Coroado"],
      ["Zamazenta (Hero)", "Zamazenta"],
      ["Urshifu (Rapid Strike)", "Urshifu Golpe Fluido"],
      ["Urshifu (Single Strike)", "Urshifu Golpe Decisivo"],
      ["Calyrex (Ice Rider)", "Calyrex (Cavaleiro do Glacial)"],
      ["Basculegion (Female)", "Basculegion Femea"],
      ["Basculegion (Male)", "Basculegion Macho"],
      ["Enamorus (Incarnate)", "Enamorus Forma Materializada"],
      ["Enamorus (Therian)", "Enamorus Forma Therian"],
      ["Oinkologne (Female)", "Oinkologne"],
      ["Maushold_family_of_four", "Maushold"],
      ["Maushold_family_of_three", "Maushold"],
      ["Squawkabilly_blue", "Squawkabilly"],
      ["Squawkabilly_green", "Squawkabilly"],
      ["Squawkabilly_white", "Squawkabilly"],
      ["Squawkabilly_yellow", "Squawkabilly"],
      ["Palafin_hero", "Palafin"],
      ["Palafin_zero", "Palafin"],
      ["Koraidon_apex", "Koraidon (Apex)"],
      ["Miraidon_ultimate", "Miraidon (Ultimate)"],
      ["Dudunsparce_three", "Dudunsparce (Três Segmentos)"],
      ["Dudunsparce_two", "Dudunsparce"],
      ["Urshifu (Rapid Strike) Gigamax", "Urshifu Golpe Fluido Gigamax"],
      ["Urshifu (Single Strike) Gigamax", "Urshifu Golpe Decisivo Gigamax"],
    ];
    pares.forEach(([pt, en]) => {
      if (nome.includes(pt)) chaves.add(nome.replace(pt, en));
      if (nome.includes(en)) chaves.add(nome.replace(en, pt));
    });
  };

  chavesAtuais.forEach(adicionarVariacoes);

  if (nomeLimpo.toLowerCase().includes("(shadow)")) {
    const nomeSemShadow = nomeLimpo
      .replace(/\s*\(\s*shadow\s*\)\s*/i, "")
      .trim();
    adicionarVariacoes(nomeSemShadow);
  }

  return Array.from(chaves);
}

// --- 5. CARREGAMENTO E PREPARAÇÃO DOS DADOS DA API ---
// --- 5. CARREGAMENTO E PREPARAÇÃO DOS DADOS DA API ---
// --- 5. CARREGAMENTO E PREPARAÇÃO DOS DADOS DA API ---
async function carregarTodaABaseDeDados() {
  try {
    const responses = await Promise.all([
      fetch(URLS.MAIN_DATA).then((res) => res.json()),
      fetch(URLS.MAIN_DATA_FALLBACK).then((res) => res.json()),
      fetch(URLS.MEGA_DATA).then((res) => res.json()),
      fetch(URLS.GIGAMAX_DATA).then((res) => res.json()),
      fetch(URLS.IMAGES_PRIMARY).then((res) => res.json()),
      fetch(URLS.IMAGES_ALT).then((res) => res.json()),
      fetch(URLS.TYPE_DATA).then((res) => res.json()),
      fetch(URLS.MOVE_TRANSLATIONS).then((res) => res.json()),
      fetch(URLS.MOVE_DATA).then((res) => res.json()),
    ]);

    const [
      mainData,
      fallbackData,
      megaData,
      gigaData,
      primaryImages,
      altImages,
      typeData,
      rawMoveTranslations, // <--- Este é o seu JSON de movimentos
      moveData,
    ] = responses;

    // =============================================================
    //                ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼
    // Removemos o '.reduce()' e usamos o JSON (objeto) diretamente
    // =============================================================
    const moveTranslations = rawMoveTranslations.reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {});
    // =============================================================

    const moveDataMap = new Map(moveData.map((move) => [move.moveId, move]));
    const todosOsPokemons = [
      ...mainData,
      ...fallbackData,
      ...megaData,
      ...gigaData,
    ];
    const pokemonsByNameMap = new Map();
    const pokemonsByDexMap = new Map();

    todosOsPokemons.forEach((p) => {
      if (p.speciesName) {
        pokemonsByNameMap.set(p.speciesName.toLowerCase(), p);
      }
      if (p.dex && !pokemonsByDexMap.has(p.dex)) {
        if (!p.speciesName.toLowerCase().includes("(shadow)")) {
          pokemonsByDexMap.set(p.dex, p);
        }
      }
    });

    return {
      pokemonsByNameMap,
      pokemonsByDexMap,
      mapaImagensPrimario: new Map(
        primaryImages.map((item) => [item.nome, item])
      ),
      mapaImagensAlternativo: new Map(
        altImages.map((item) => [item.name, item])
      ),
      dadosDosTipos: typeData,
      moveTranslations: moveTranslations, // <--- Agora 'moveTranslations' terá seu objeto completo
      moveDataMap: moveDataMap,
    };
  } catch (error) {
    console.error("❌ Erro fatal ao carregar os arquivos JSON:", error);
    return null;
  }
}

// --- 6. BUSCA PRINCIPAL DE DADOS DO POKÉMON ---
function buscarDadosCompletosPokemon(nomeOriginal, database) {
  const chavesPossiveis = gerarChavesDeBuscaPossiveis(nomeOriginal);
  let pokemonData = null;

  for (const chave of chavesPossiveis) {
    pokemonData = database.pokemonsByNameMap.get(chave.toLowerCase());
    if (pokemonData) break;
  }

  if (!pokemonData) {
    console.error(
      `Dados não encontrados para: ${nomeOriginal} (Chaves testadas: ${chavesPossiveis.join(
        ", "
      )})`
    );
    return null;
  }

  const nomeParaExibicao = formatarNomeParaExibicao(pokemonData.speciesName);
  let infoImagens = null;

  // Lógica Híbrida para busca de imagens
  if (
    nomeOriginal.includes("Flabébé") ||
    nomeOriginal.includes("Floette") ||
    nomeOriginal.includes("Florges") ||
    nomeOriginal.includes("Slakoth de viseira") ||
    nomeOriginal.includes("Pikachu Elegante (detalhes vermelhos)") ||
    nomeOriginal.includes("Pikachu Elegante (detalhes azuis)") ||
    nomeOriginal.includes("Pikachu Elegante (detalhes amarelos)") ||
    nomeOriginal.includes("Falinks em treinamento") ||
    nomeOriginal.includes("Unown") ||
    nomeOriginal.includes("com Chapéu de Bruxa") ||
    nomeOriginal.includes("com Tiara") ||
    nomeOriginal.includes("com Fantasia Travessura de Dia das Bruxas") ||
    nomeOriginal.includes("com Fantasia de Gostosuras e Travessuras") ||
    nomeOriginal.includes("com fantasia de Dia das Bruxas")
  ) {
    // Para estes casos especiais, usa o nome original exato para pegar a imagem correta.
    const nomeLimpoParaBuscaDeImagem = nomeOriginal.replace(/\*/g, "").trim();

    // =========================================================================
    // ADICIONE O CONSOLE.LOG AQUI (PARA CASOS ESPECIAIS)
    console.log(
      `[Debug Imagem - Caso Especial] Procurando imagem com a chave: "${nomeLimpoParaBuscaDeImagem}"`
    );
    // =========================================================================

    infoImagens = database.mapaImagensPrimario.get(nomeLimpoParaBuscaDeImagem);
  } else {
    // Para todos os outros Pokémon, usa a busca flexível padrão.
    const chavesDeBuscaDeImagem = gerarChavesDeBuscaPossiveis(
      pokemonData.speciesName
    );

    // =========================================================================
    // ADICIONE O CONSOLE.LOG AQUI (PARA CASOS PADRÃO)
    // =========================================================================

    for (const chave of chavesDeBuscaDeImagem) {
      infoImagens = database.mapaImagensPrimario.get(chave);
      if (infoImagens) break;
    }
  }

  // ADICIONAL: VERIFICA SE A BUSCA DEU CERTO
  if (!infoImagens) {
    console.error(
      `[Debug Imagem] ❌ FALHA: Nenhuma imagem encontrada para "${nomeOriginal}"`
    );
  }

  // Busca as imagens primárias e alternativas
  const imgNormal = infoImagens?.imgNormal;
  const imgShiny = infoImagens?.imgShiny;

  const infoImagensAlt = database.mapaImagensAlternativo.get(
    pokemonData.speciesId
  );
  const imgNormalFallback = infoImagensAlt?.imgNormal;
  const imgShinyFallback = infoImagensAlt?.imgShiny;

  return {
    ...pokemonData,
    imgNormal,
    imgShiny,
    imgNormalFallback,
    imgShinyFallback,
    nomeParaExibicao,
  };
}

// --- 7. PROCESSAMENTO E RENDERIZAÇÃO DAS LISTAS HTML ---
function processarListas(selector, tipoCard, database) {
  const listas = document.querySelectorAll(selector);
  const tabelaDeTipos = formatarTabelaTiposDetalhes(database.dadosDosTipos);
  listas.forEach((lista) => {
    const itensOriginais = Array.from(lista.querySelectorAll("li"));
    lista.innerHTML = "";
    itensOriginais.forEach((item) => {
      const nomeOriginal = item.textContent.trim();
      const pokemonCompleto = buscarDadosCompletosPokemon(
        nomeOriginal,
        database
      );
      if (pokemonCompleto) {
        const geradorDeCard = {
          detalhes: generatePokemonListItemDetalhes,
          reide: generatePokemonListItemReide,
          selvagem: criarElementoPokemonSelvagem,
          gorocket: generatePokemonListItemGoRocket,
        }[tipoCard];
        const novoItem = geradorDeCard(
          pokemonCompleto,
          nomeOriginal,
          tabelaDeTipos
        );
        lista.appendChild(novoItem);
      } else {
        console.warn(`Pokémon "${nomeOriginal}" não encontrado.`);
      }
    });
  });
  iniciarAlternanciaImagens(selector + " li", database);
}

// --- 8. UTILITÁRIO DE IMAGEM (FALLBACK DE ERRO) ---
function attachImageFallbackHandler(imgElement, pokemonData) {
  if (!imgElement) return;

  imgElement.onerror = function () {
    // 'this' se refere ao elemento <img> que deu erro
    console.warn(`Erro ao carregar: ${this.src}. Tentando fallback.`);

    // Verifica se a imagem que falhou era a normal primária e se existe um fallback
    if (this.src === pokemonData.imgNormal && pokemonData.imgNormalFallback) {
      this.src = pokemonData.imgNormalFallback;
    }
    // Verifica se a imagem que falhou era a shiny primária e se existe um fallback
    else if (
      this.src === pokemonData.imgShiny &&
      pokemonData.imgShinyFallback
    ) {
      this.src = pokemonData.imgShinyFallback;
    }

    this.onerror = null;
  };
}

// --- 9. GERADORES DE CARDS HTML ---
// =============================================================
//        ▼▼▼ FUNÇÃO 'criarElementoPokemonSelvagem' CORRIGIDA ▼▼▼
// (Agora Gigantamax também ganha a 'fumacinha' do Dinamax)
// =============================================================
function criarElementoPokemonSelvagem(pokemon, nomeOriginal) {
  const li = document.createElement("li");
  li.dataset.nomeOriginal = nomeOriginal;
  const validTipos = pokemon.types.filter(
    (t) => t && t.toLowerCase() !== "none"
  );
  const [tipo1, tipo2] = validTipos;
  li.className = `Selvagem ${tipo1}`;
  if (tipo2) li.classList.add(tipo2);
  if (tipo2)
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      tipo1
    )}, ${getTypeColor(tipo2)})`;
  else if (tipo1) li.style.backgroundColor = getTypeColor(tipo1);

  // --- VERIFICAÇÕES CORRIGIDAS ---
  const isShadow = /\(shadow\)/i.test(nomeOriginal);
  const isGigantamax = /Giga(nta)?max/i.test(nomeOriginal);
  
  // MUDANÇA: Se for Gigamax, também conta como Dynamax (para ter a fumaça)
  const isDynamax = /Dinamax/i.test(nomeOriginal) || isGigantamax;

  const initialImageSrc = pokemon.imgNormal || pokemon.imgNormalFallback || "";

  li.innerHTML = `
    <div class="pokemon-image-container ${isShadow ? "is-shadow" : ""} ${
    isDynamax ? "is-dynamax" : ""
  } ${isGigantamax ? "is-gigantamax" : ""}">
        <img class="imgSelvagem" src="${initialImageSrc}" alt="${
    pokemon.nomeParaExibicao
  }">
    </div>
    <span>${nomeOriginal}</span>
    `;

  attachImageFallbackHandler(li.querySelector("img"), pokemon);
  return li;
}

// ALTERADO: Agora chama attachImageFallbackHandler
function generatePokemonListItemReide(pokemon, nomeOriginal) {
  const li = document.createElement("li");
  li.dataset.nomeOriginal = nomeOriginal;
  li.className = "PokemonReideItem";
  const validTipos = pokemon.types.filter(
    (t) => t && t.toLowerCase() !== "none"
  );
  validTipos.forEach((t) => li.classList.add(t.toLowerCase()));
  if (validTipos.length > 1)
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      validTipos[0]
    )}, ${getTypeColor(validTipos[1])})`;
  else if (validTipos.length === 1)
    li.style.backgroundColor = getTypeColor(validTipos[0]);

  const isShadow = /\(shadow\)/i.test(nomeOriginal);
  const isDynamax = /Dinamax/i.test(nomeOriginal);
  const isGigantamax = /Giga(nta)?max/i.test(nomeOriginal);

  const minIVs = isShadow
    ? { atk: 6, def: 6, hp: 6 }
    : { atk: 10, def: 10, hp: 10 };
  const cpInfo = {
    normal: calculateCP(pokemon.baseStats, minIVs, 20),
    perfect: calculateCP(pokemon.baseStats, { atk: 15, def: 15, hp: 15 }, 20),
  };

  // --- INÍCIO DA MODIFICAÇÃO ---
  let boostHTML = "";
  if (!isDynamax && !isGigantamax) {
    const cpBoost = {
      normal: calculateCP(pokemon.baseStats, minIVs, 25),
      perfect: calculateCP(pokemon.baseStats, { atk: 15, def: 15, hp: 15 }, 25),
    };
    const weatherIcons = [
      ...new Set(validTipos.map((tipo) => getWeatherIcon(tipo))),
    ]
      .map((icon) => (icon ? `<img class="clima-boost" src="${icon}">` : ""))
      .join("");
    boostHTML = `
                <div class="boost">
                    ${weatherIcons}
                    <div class="pc-boost"> ${cpBoost.normal} - ${cpBoost.perfect}</div>
                </div>`;
  }
  // --- FIM DA MODIFICAÇÃO ---

  const initialImageSrc = pokemon.imgNormal || pokemon.imgNormalFallback || "";

  li.innerHTML = `
    <div class="pokemon-image-container ${isShadow ? "is-shadow" : ""} ${
    isDynamax ? "is-dynamax" : ""
  } ${isGigantamax ? "is-gigantamax" : ""}">
        <img class="pokemon-reide-img" src="${initialImageSrc}" alt="${
    pokemon.nomeParaExibicao
  }">
    </div>
    <span>${nomeOriginal}</span>
    <div class="tipo-icons">${validTipos
      .map(
        (tipo) =>
          `<img src="${getTypeIcon(tipo)}" alt="${
            TYPE_TRANSLATION_MAP[tipo.toLowerCase()] || tipo
          }">`
      )
      .join("")}</div>
    <div class="pc-info">PC: ${cpInfo.normal} - ${cpInfo.perfect}</div>
    ${boostHTML}`; // Variável inserida aqui

  attachImageFallbackHandler(li.querySelector("img"), pokemon);

  return li;
}

// ALTERADO: Agora chama attachImageFallbackHandler
function generatePokemonListItemDetalhes(pokemon, nomeOriginal, tabelaDeTipos) {
  const li = document.createElement("li");
  li.dataset.nomeOriginal = nomeOriginal;
  li.className = "ItemDetalhes";
  const validTipos = pokemon.types.filter(
    (t) => t && t.toLowerCase() !== "none"
  );
  validTipos.forEach((t) => li.classList.add(t.toLowerCase()));
  if (validTipos.length > 1) {
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      validTipos[0]
    )}, ${getTypeColor(validTipos[1])})`;
  } else if (validTipos.length === 1) {
    li.style.backgroundColor = getTypeColor(validTipos[0]);
  }

  const isShadow = /\(shadow\)/i.test(nomeOriginal);
  const isDynamax = /Dinamax/i.test(nomeOriginal);
  const isGigantamax = /Giga(nta)?max/i.test(nomeOriginal);

  const minIVs = isShadow
    ? { atk: 6, def: 6, hp: 6 }
    : { atk: 10, def: 10, hp: 10 };
  const cpInfo = {
    normal: calculateCP(pokemon.baseStats, minIVs, 20),
    perfect: calculateCP(pokemon.baseStats, { atk: 15, def: 15, hp: 15 }, 20),
  };

  // --- INÍCIO DA MODIFICAÇÃO ---
  let boostHTML = "";
  if (!isDynamax && !isGigantamax) {
    const cpBoost = {
      normal: calculateCP(pokemon.baseStats, minIVs, 25),
      perfect: calculateCP(pokemon.baseStats, { atk: 15, def: 15, hp: 15 }, 25),
    };
    const weatherIcons = [
      ...new Set(validTipos.map((tipo) => getWeatherIcon(tipo))),
    ]
      .map((icon) => (icon ? `<img class="clima-boost" src="${icon}">` : ""))
      .join("");
    boostHTML = `
                <div class="boost">
                    ${weatherIcons}
                    <div class="pc-boost"> ${cpBoost.normal} - ${cpBoost.perfect}</div>
                </div>`;
  }
  // --- FIM DA MODIFICAÇÃO ---

  const fraquezas = calcularFraquezasDetalhes(validTipos, tabelaDeTipos);
  const fraquezasHTML =
    Object.keys(fraquezas).length > 0
      ? `
    <div class="detalhes-weakness-section">
        <h4>FRAQUEZAS</h4>
        <ul class="detalhes-weakness-list">
            ${Object.entries(fraquezas)
              .sort(([, a], [, b]) => b - a)
              .map(
                ([tipo, mult]) => `
                <li class="detalhes-weakness-item">
                    <div class="detalhes-weakness-type">
                        <img src="${getTypeIcon(tipo)}" alt="${tipo}">
                        <span>${tipo}</span>
                    </div>
                    <span class="detalhes-weakness-percentage">${Math.round(
                      mult * 100
                    )}%</span>
                </li>`
              )
              .join("")}
        </ul>
    </div>`
      : "";

  const initialImageSrc = pokemon.imgNormal || pokemon.imgNormalFallback || "";

  li.innerHTML = `
    <div class="pokemon-image-container ${isShadow ? "is-shadow" : ""} ${
    isDynamax ? "is-dynamax" : ""
  } ${isGigantamax ? "is-gigantamax" : ""}">
        <img class="img-detalhes" src="${initialImageSrc}" alt="${
    pokemon.nomeParaExibicao
  }">
    </div>
    <span>${nomeOriginal}</span>
    <div class="tipo-icons">${validTipos
      .map(
        (tipo) =>
          `<img src="${getTypeIcon(tipo)}" alt="${
            TYPE_TRANSLATION_MAP[tipo.toLowerCase()] || tipo
          }">`
      )
      .join("")}</div>
    <div class="pc-info">PC: ${cpInfo.normal} - ${cpInfo.perfect}</div>
    ${boostHTML} ${fraquezasHTML}
    `;

  attachImageFallbackHandler(li.querySelector("img"), pokemon);

  return li;
}

// --- FUNÇÃO PARA VERIFICAR POKÉMON FALTANDO ---
function verificarPokemonsFaltando() {
  if (!GLOBAL_POKE_DB || !GLOBAL_POKE_DB.pokemonsByDexMap) {
    console.error("Banco de dados não está pronto para verificação.");
    return;
  }

  console.log("🔍 Verificando se há Pokémon faltando na base de dados...");

  const todosOsDex = Array.from(GLOBAL_POKE_DB.pokemonsByDexMap.keys());
  const maxDex = Math.max(...todosOsDex);
  const pokemonsFaltando = [];

  // Loop de 1 até o maior número da Dex encontrado
  for (let i = 1; i <= maxDex; i++) {
    // Se o mapa NÃO tiver o número 'i', adiciona à lista de faltantes
    if (!GLOBAL_POKE_DB.pokemonsByDexMap.has(i)) {
      pokemonsFaltando.push(i);
    }
  }

  if (pokemonsFaltando.length === 0) {
    console.log(
      `✅ Verificação completa! Nenhum Pokémon faltando até o número #${maxDex}.`
    );
  } else {
    console.warn(
      `⚠️ Atenção! Faltam os seguintes Pokémon na Dex:`,
      pokemonsFaltando
    );
  }
}

// NOVO: 4ª Configuração para Go Rocket
function generatePokemonListItemGoRocket(pokemon, nomeOriginal, tabelaDeTipos) {
  const li = document.createElement("li");
  li.dataset.nomeOriginal = nomeOriginal;
  // Usa uma nova classe CSS para o item
  li.className = "GoRocketItem";
  const validTipos = pokemon.types.filter(
    (t) => t && t.toLowerCase() !== "none"
  );
  validTipos.forEach((t) => li.classList.add(t.toLowerCase()));

  // Lógica de cor de fundo
  if (validTipos.length > 1) {
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      validTipos[0]
    )}, ${getTypeColor(validTipos[1])})`;
  } else if (validTipos.length === 1) {
    li.style.backgroundColor = getTypeColor(validTipos[0]);
  }

  const isShadow = /\(shadow\)/i.test(nomeOriginal);
  const isDynamax = /Dinamax/i.test(nomeOriginal);
  const isGigantamax = /Gigantamax/i.test(nomeOriginal);

  // Lógica de Fraquezas (copiada da função 'detalhes')
  const fraquezas = calcularFraquezasDetalhes(validTipos, tabelaDeTipos);
  const fraquezasHTML =
    Object.keys(fraquezas).length > 0
      ? `
    <div class="detalhes-weakness-section">
        <h4>FRAQUEZAS</h4>
        <ul class="detalhes-weakness-list">
            ${Object.entries(fraquezas)
              .sort(([, a], [, b]) => b - a)
              .map(
                ([tipo, mult]) => `
                <li class="detalhes-weakness-item">
                    <div class="detalhes-weakness-type">
                        <img src="${getTypeIcon(tipo)}" alt="${tipo}">
                        <span>${tipo}</span>
                    </div>
                    <span class="detalhes-weakness-percentage">${Math.round(
                      mult * 100
                    )}%</span>
                </li>`
              )
              .join("")}
        </ul>
    </div>`
      : "";

  const initialImageSrc = pokemon.imgNormal || pokemon.imgNormalFallback || "";

  li.innerHTML = `
    <div class="pokemon-image-container ${isShadow ? "is-shadow" : ""} ${
    isDynamax ? "is-dynamax" : ""
  } ${isGigantamax ? "is-gigantamax" : ""}">
        <img class="img-detalhes" src="${initialImageSrc}" alt="${
    pokemon.nomeParaExibicao
  }">
    </div>
    <span>${nomeOriginal}</span>
    <div class="tipo-icons">${validTipos
      .map(
        (tipo) =>
          `<img src="${getTypeIcon(tipo)}" alt="${
            TYPE_TRANSLATION_MAP[tipo.toLowerCase()] || tipo
          }">`
      )
      .join("")}</div>
    ${fraquezasHTML}
    `;

  attachImageFallbackHandler(li.querySelector("img"), pokemon);
  return li;
}

// --- 10. LÓGICA DE ANIMAÇÕES (ALTERNÂNCIA SHINY) ---
function iniciarAlternanciaImagens(selector, database) {
  document.querySelectorAll(selector).forEach((item) => {
    const nomeOriginal = item.dataset.nomeOriginal;
    if (!nomeOriginal || !nomeOriginal.includes("*")) return;
    const img = item.querySelector("img");
    const pokemonCompleto = buscarDadosCompletosPokemon(nomeOriginal, database);

    // O manipulador de fallback já foi anexado na criação do card,
    // então a lógica de shiny funcionará corretamente com os fallbacks.
    if (img && pokemonCompleto?.imgNormal && pokemonCompleto?.imgShiny) {
      let showShiny = false;
      setInterval(() => {
        img.style.transition = "opacity 0.5s";
        img.style.opacity = 0;
        setTimeout(() => {
          // Tenta carregar a imagem primária. Se ela não existir no JSON, usa o fallback como primário.
          const normalSrc =
            pokemonCompleto.imgNormal || pokemonCompleto.imgNormalFallback;
          const shinySrc =
            pokemonCompleto.imgShiny || pokemonCompleto.imgShinyFallback;

          img.src = showShiny ? shinySrc : normalSrc;
          img.style.opacity = 1;
          showShiny = !showShiny;
        }, 500);
      }, 2500);
    }
  });
}

// --- 11. LÓGICA DE CÁLCULO DE TIPOS E FRAQUEZAS ---

function formatarTabelaTiposDetalhes(dadosDefensivos) {
  const tabelaOfensiva = {};
  dadosDefensivos.forEach((t) => {
    tabelaOfensiva[t.tipo] = { ataca: {} };
  });
  dadosDefensivos.forEach((info) => {
    const defensor = info.tipo;
    for (const mult in info.defesa.fraqueza) {
      info.defesa.fraqueza[mult].forEach((atacante) => {
        tabelaOfensiva[atacante].ataca[defensor] = parseFloat(mult);
      });
    }
    for (const mult in info.defesa.resistencia) {
      info.defesa.resistencia[mult].forEach((atacante) => {
        tabelaOfensiva[atacante].ataca[defensor] = parseFloat(mult);
      });
    }
    if (info.defesa.imunidade) {
      info.defesa.imunidade.forEach((atacante) => {
        tabelaOfensiva[atacante].ataca[defensor] = 0;
      });
    }
  });
  return tabelaOfensiva;
}

function calcularFraquezasDetalhes(tiposDoPokemon, tabelaDeTipos) {
  const fraquezas = {};
  if (!tabelaDeTipos || Object.keys(tabelaDeTipos).length === 0)
    return fraquezas;
  Object.keys(tabelaDeTipos).forEach((tipoAtacante) => {
    let multiplicadorFinal = 1;
    tiposDoPokemon.forEach((tipoDefensorIngles) => {
      const tipoDefensorPortugues =
        TYPE_TRANSLATION_MAP[tipoDefensorIngles.toLowerCase()];
      if (tipoDefensorPortugues) {
        const interacao =
          tabelaDeTipos[tipoAtacante]?.ataca?.[tipoDefensorPortugues];
        if (interacao !== undefined) multiplicadorFinal *= interacao;
      }
    });
    if (multiplicadorFinal > 1) {
      const tipoCapitalizado =
        tipoAtacante.charAt(0).toUpperCase() + tipoAtacante.slice(1);
      fraquezas[tipoCapitalizado] = multiplicadorFinal;
    }
  });
  return fraquezas;
}

// --- 12. FUNCIONALIDADES DA INTERFACE DATADEX ---
// =============================================================
//              NOVA FUNÇÃO POKÉDEX COMPLETA
// =============================================================
/**
 * Busca um Pokémon pelo seu número da Dex e gera um card de Pokedex completo,
 * inserindo-o em um container específico no HTML.
 *
 * @param {number} dexNumber - O número da Pokédex (ex: 1 para Bulbasaur).
 * @param {HTMLElement | string} container - O elemento HTML ou seletor CSS onde o card será inserido.
 */
function gerarCardPokedexPorDex(dexNumber, container) {
  const containerElement =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  if (!containerElement) {
    console.error(`[Pokedex] Container não encontrado: ${container}`);
    return;
  }

  if (!GLOBAL_POKE_DB || !GLOBAL_POKE_DB.pokemonsByDexMap) {
    containerElement.innerHTML = `<p>Aguardando a base de dados carregar...</p>`;
    console.warn(
      `[Pokedex] A base de dados ainda não está pronta. Tente novamente em breve.`
    );
    return;
  }

  // 1. ACHAR O POKÉMON PELO DEX (USANDO NOSSA MODIFICAÇÃO)
  const basePokemonData = GLOBAL_POKE_DB.pokemonsByDexMap.get(dexNumber);

  if (!basePokemonData) {
    containerElement.innerHTML = `<p>Pokémon #${dexNumber} não encontrado.</p>`;
    return;
  }

  // 2. BUSCAR DADOS COMPLETOS (REUTILIZANDO SEU SCRIPT ORIGINAL)
  const pokemon = buscarDadosCompletosPokemon(
    basePokemonData.speciesName,
    GLOBAL_POKE_DB
  );
  if (!pokemon) {
    containerElement.innerHTML = `<p>Falha ao carregar dados completos para #${dexNumber}.</p>`;
    return;
  }

  // 3. EXTRAIR E PROCESSAR OS DADOS QUE VAMOS USAR
  const {
    dex,
    nomeParaExibicao,
    types,
    baseStats,
    fastMoves,
    chargedMoves,
    speciesName,
  } = pokemon;
  const imagemSrc = pokemon.imgNormal || pokemon.imgNormalFallback;

  // Calcular o PC Máximo (Nível 50, 100% IVs)
  const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);

  // Gerar HTML para os TIPOS (reutilizando sua função getTypeColor)
  const tiposHTML = types
      .filter((t) => t && t.toLowerCase() !== "none")
      .map((tipo) => {
        const englishType = tipo.toLowerCase();
        const portugueseType = TYPE_TRANSLATION_MAP[englishType] || tipo;
        const iconSrc = getTypeIcon(englishType);
        const bgColor = getTypeColor(englishType);
        
        return `<span class="pokedex-tipo-badge" style="background-color: ${bgColor};">
                  <img src="${iconSrc}" alt="${portugueseType}" class="pokedex-tipo-icon">
                  ${portugueseType}
                </span>`;
      })
      .join("");

  // Formatar os nomes dos MOVIMENTOS (trocar _ por espaço e capitalizar)
  const formatarNomeMovimento = (nomeIngles) => {
    // Formata o nome em inglês primeiro para garantir que fique bonito
    const nomeInglesFormatado = nomeIngles
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    // Procura pela tradução e, se não encontrar, usa o nome em inglês já formatado
    const nomeTraduzido =
      GLOBAL_POKE_DB.moveTranslations[nomeIngles] || nomeInglesFormatado;
    return nomeTraduzido;
  };

  const ataquesRapidosHTML = fastMoves
    .map((ataque) => `<li>${formatarNomeMovimento(ataque)}</li>`)
    .join("");
  const ataquesCarregadosHTML = chargedMoves
    .map((ataque) => `<li>${formatarNomeMovimento(ataque)}</li>`)
    .join("");

  // 4. MONTAR O CARD HTML COMPLETO
  const pokedexHTML = `
        <div class="pokedex-card" style="border-color: ${getTypeColor(
          types[0]
        )}">
            <div class="pokedex-header">
                <div class="pokedex-imagem-container">
                    <img src="${imagemSrc}" alt="${nomeParaExibicao}" class="pokedex-imagem">
                </div>
                <div class="pokedex-info-principal">
                    <span class="pokedex-numero">#${String(dex).padStart(
                      3,
                      "0"
                    )}</span>
                    <h2 class="pokedex-nome">${nomeParaExibicao}</h2>
                    <div class="pokedex-tipos-container">
                        ${tiposHTML}
                    </div>
                </div>
            </div>
            <div class="pokedex-body">
                <div class="pokedex-stats">
                    <h3>Status Base</h3>
                    <div class="stat-item"><span>Ataque</span><div class="stat-bar"><div style="width: ${
                      (baseStats.atk / 300) * 100
                    }%; background-color: #f34444;"></div></div><span>${
    baseStats.atk
  }</span></div>
                    <div class="stat-item"><span>Defesa</span><div class="stat-bar"><div style="width: ${
                      (baseStats.def / 300) * 100
                    }%; background-color: #448cf3;"></div></div><span>${
    baseStats.def
  }</span></div>
                    <div class="stat-item"><span>Stamina</span><div class="stat-bar"><div style="width: ${
                      (baseStats.hp / 300) * 100
                    }%; background-color: #23ce23;"></div></div><span>${
    baseStats.hp
  }</span></div>
                    <div class="pokedex-cp-max">
                        <strong>PC Máximo:</strong> ${maxCP}
                    </div>
                </div>
                <div class="pokedex-movimentos">
                    <h3>Movimentos</h3>
                    <div class="movimentos-coluna">
                        <h4>Ataques Rápidos</h4>
                        <ul>${ataquesRapidosHTML}</ul>
                    </div>
                    <div class="movimentos-coluna">
                        <h4>Ataques Carregados</h4>
                        <ul>${ataquesCarregadosHTML}</ul>
                    </div>
                </div>
            </div>
        </div>
    `;

  // 5. INSERIR O HTML NO CONTAINER E ATIVAR FALLBACK DE IMAGEM
  containerElement.innerHTML = pokedexHTML;
  attachImageFallbackHandler(
    containerElement.querySelector(".pokedex-imagem"),
    pokemon
  );
}

// ▼▼▼ ADICIONE ESTE BLOCO DE CÓDIGO NOVO ▼▼▼

// --- FUNÇÕES DA NOVA INTERFACE DATADEX ---

// =============================================================
//        ▼▼▼ SUBSTITUA 'displayGenerationSelection' ▼▼▼
// (Adicionado 'tapu' na lista de exceções da busca)
// =============================================================
function displayGenerationSelection() {
  window.scrollTo(0, 0);
  localStorage.removeItem("lastViewedPokemonDex");
  topControls.innerHTML =
    '<h2 class="text-white text-center font-bold">Selecione uma Geração</h2>';

  const searchBarHTML = `
        <div class="geral-search-container">
            <input type="text" id="geral-search-input" placeholder="Ou busque um Pokémon pelo nome...">
            <div id="search-results-container"></div>
        </div>
    `;

  const generationRanges = {
    1: { start: 1, end: 151, region: "Kanto" },
    2: { start: 152, end: 251, region: "Johto" },
    3: { start: 252, end: 386, region: "Hoenn" },
    4: { start: 387, end: 493, region: "Sinnoh" },
    5: { start: 494, end: 649, region: "Unova" },
    6: { start: 650, end: 721, region: "Kalos" },
    7: { start: 722, end: 809, region: "Alola" },
    8: { start: 810, end: 905, region: "Galar" },
    9: { start: 906, end: 1025, region: "Paldea" },
  };

  let generationHtml = '<div class="generation-grid">';

  for (const gen in generationRanges) {
    generationHtml += `<div class="generation-card" data-gen="${gen}"><h3>Geração ${gen}</h3><p>${generationRanges[gen].region}</p></div>`;
  }
  generationHtml += `<div class="generation-card all-gens" data-gen="all"><h3>Todas as Gerações</h3></div>`;
  generationHtml += "</div>";

  let typeHtml = '<h2 class="section-title-h2">Ou selecione por Tipo</h2>';
  typeHtml += '<div class="type-grid">';

  for (const [key, value] of Object.entries(TYPE_TRANSLATION_MAP)) {
    const englishType = key;
    const portugueseType = value;
    const color = getTypeColor(englishType);
    const icon = getTypeIcon(englishType);

    typeHtml += `
            <div class="type-card" data-type-english="${englishType}" style="background-color: ${color};">
                <img src="${icon}" alt="${portugueseType}">
                <h3>${portugueseType}</h3>
            </div>
        `;
  }
  typeHtml += "</div>";

  datadexContent.innerHTML = searchBarHTML + generationHtml + typeHtml;

  document.querySelectorAll(".generation-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const gen = e.currentTarget.dataset.gen;
      currentPokemonList =
        gen === "all"
          ? allPokemonDataForList
          : allPokemonDataForList.filter(
              (p) =>
                p.dex >= generationRanges[gen].start &&
                p.dex <= generationRanges[gen].end
            );
      displayPokemonList(currentPokemonList);
    });
  });

  document.querySelectorAll(".type-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const typeToFilter = e.currentTarget.dataset.typeEnglish;
      currentPokemonList = allPokemonDataForList.filter(
        (pokemon) =>
          pokemon && pokemon.types && pokemon.types.includes(typeToFilter)
      );
      displayPokemonList(currentPokemonList);
    });
  });

  const searchInput = document.getElementById("geral-search-input");
  const resultsContainer = document.getElementById("search-results-container");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 1) {
      resultsContainer.innerHTML = "";
      return;
    }

    const filteredList = allPokemonDataForList
      .filter(
        (p) =>
          p.nomeParaExibicao.toLowerCase().includes(searchTerm) ||
          String(p.dex).includes(searchTerm)
      )
      .slice(0, 7);

    let resultsHTML = "";
    filteredList.forEach((pokemon) => {
      const imgSrc = pokemon.imgNormal || pokemon.imgNormalFallback;
      resultsHTML += `
                <div class="search-result-item" data-species-id="${pokemon.speciesId}">
                    <img src="${imgSrc}" alt="${pokemon.nomeParaExibicao}">
                    <span>${pokemon.nomeParaExibicao}</span>
                </div>
            `;
    });

    resultsContainer.innerHTML = resultsHTML;

    document.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", () => {
        const fullId = item.dataset.speciesId;
        
        let baseId = fullId.replace("-", "_").split("_")[0];
        // Adicionado "tapu" na lista de exceções
        if (baseId === "nidoran" || baseId === "meowstic" || baseId === "indeedee" || baseId === "basculegion" || baseId === "oinkologne" || baseId === "tapu") {
          baseId = fullId;
        }

        showPokemonDetails(baseId, null, fullId);
      });
    });
  });
}

// =============================================================
//        ▼▼▼ SUBSTITUA 'displayPokemonList' ▼▼▼
// (Adicionado 'tapu_' na lógica de renderList e click)
// =============================================================
function displayPokemonList(pokemonList) {
  window.scrollTo(0, 0);
  localStorage.removeItem("lastViewedPokemonDex");

  let currentSortKey = 'dex';

  topControls.innerHTML = `
    <div class="flex justify-between items-center w-full mb-2">
        <button id="backToGenButton">&larr; Voltar</button>
        <div class="flex items-center gap-4">
            <input type="text" id="searchInput" placeholder="Pesquisar Pokémon...">
            <span id="pokemon-list-count" class="text-white text-nowrap"></span>
        </div>
    </div>
    <div class="sort-controls-container">
        <span class="sort-label">Ordenar por:</span>
        <button class="sort-button active" data-sort="dex">#</button>
        <button class="sort-button" data-sort="cp">CP Máx.</button>
        <button class="sort-button" data-sort="atk">Ataque</button>
        <button class="sort-button" data-sort="def">Defesa</button>
        <button class="sort-button" data-sort="hp">HP</button>
    </div>
  `;

  datadexContent.innerHTML = '<div id="pokemon-grid" class="pokemon-grid"></div>';
  const grid = document.getElementById("pokemon-grid");
  const searchInput = document.getElementById("searchInput");

  const renderList = (list, sortKey) => {
    grid.innerHTML = "";

    let uniquePokemonList; 

    if (sortKey === 'dex') {
      const listToDisplay = list.filter(
        (p) =>
          p &&
          p.speciesName &&
          !p.speciesName.startsWith("Mega ") &&
          !p.speciesName.includes("Dinamax") &&
          !p.speciesName.toLowerCase().includes("(shadow)")
      );

      const displayedSpecies = new Set();
      uniquePokemonList = listToDisplay.filter((pokemon) => {
        if (!pokemon || !pokemon.speciesId) return false;

        let baseSpeciesId;
        const sId = pokemon.speciesId.replace("-", "_");

        // Adicionado tapu_ aqui
        if (sId.startsWith("nidoran_") || 
            sId.startsWith("meowstic_") || 
            sId.startsWith("indeedee_") ||
            sId.startsWith("basculegion_") ||
            sId.startsWith("oinkologne_") ||
            sId.startsWith("tapu_")) {
          baseSpeciesId = sId;
        } else {
          baseSpeciesId = sId.split("_")[0];
        }

        if (displayedSpecies.has(baseSpeciesId)) {
          return false;
        } else {
          displayedSpecies.add(baseSpeciesId);
          return true;
        }
      });

    } else {
      // Filtro para ordenação por CP/ATK (sem shadow, sem Mega prefixo)
      uniquePokemonList = list.filter(p => 
        p && p.speciesName && 
        !p.speciesName.toLowerCase().includes("(shadow)") &&
        !p.speciesName.startsWith("Mega ")
      );
    }

    const countElement = document.getElementById("pokemon-list-count");
    if (countElement) {
      countElement.textContent = `Pokémon (${uniquePokemonList.length})`;
    }

    uniquePokemonList.forEach((pokemon) => {
      const card = document.createElement("div");
      card.className = "pokemon-card-list fade-in";

      const img = document.createElement("img");
      img.src = pokemon.imgNormal || pokemon.imgNormalFallback;
      img.alt = pokemon.nomeParaExibicao;
      attachImageFallbackHandler(img, pokemon);
      card.appendChild(img);

      const number = document.createElement("span");
      number.className = "pokemon-card-number";
      number.textContent = `#${String(pokemon.dex).padStart(3, "0")}`;
      card.appendChild(number);

      const p = document.createElement("p");
      p.textContent = pokemon.nomeParaExibicao;
      card.appendChild(p);
      
      let statHtml = '';
      switch (sortKey) {
        case 'cp':
          statHtml = `CP Máx: ${pokemon.maxCP || 0}`;
          break;
        case 'atk':
          statHtml = `Ataque: ${pokemon.baseStats?.atk || 0}`;
          break;
        case 'def':
          statHtml = `Defesa: ${pokemon.baseStats?.def || 0}`;
          break;
        case 'hp':
          statHtml = `HP: ${pokemon.baseStats?.hp || 0}`;
          break;
      }

      if (statHtml) {
        const statSpan = document.createElement("span");
        statSpan.className = "pokemon-card-stat";
        statSpan.textContent = statHtml;
        card.appendChild(statSpan);
      }

      card.addEventListener("click", () => {
        let baseId = pokemon.speciesId.replace("-", "_").split("_")[0];
        const fullId = pokemon.speciesId;
        
        // Adicionado tapu aqui também
        if (baseId === "nidoran" || baseId === "meowstic" || baseId === "indeedee" || baseId === "basculegion" || baseId === "oinkologne" || baseId === "tapu") {
          baseId = fullId;
        }
        
        showPokemonDetails(baseId, uniquePokemonList, fullId); 
      });

      grid.appendChild(card);
    });
  };

  function masterRender() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredList = pokemonList.filter(
      (p) =>
        (p && p.nomeParaExibicao && p.nomeParaExibicao.toLowerCase().includes(searchTerm)) ||
        (p && p.dex && String(p.dex).includes(searchTerm))
    );

    const sortedList = sortList(filteredList, currentSortKey);
    renderList(sortedList, currentSortKey);
  }

  document.getElementById("backToGenButton").addEventListener("click", displayGenerationSelection);
  searchInput.addEventListener("input", masterRender);

  document.querySelectorAll(".sort-button").forEach(button => {
    button.addEventListener("click", (e) => {
      currentSortKey = e.currentTarget.dataset.sort;
      document.querySelectorAll(".sort-button").forEach(btn => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
      masterRender();
    });
  });

  masterRender();
}

// =============================================================
//        ▼▼▼ SUBSTITUA 'showPokemonDetails' ▼▼▼
// (Adicionado 'tapu_' em allForms, fallback e findIndex)
// =============================================================
function showPokemonDetails(baseSpeciesId, navigationList, targetSpeciesId) {
  window.scrollTo(0, 0);

  const allForms = allPokemonDataForList.filter((p) => {
    if (!p || !p.speciesId) return false;
    
    const pId = p.speciesId.replace(/-/g, "_");
    const baseId = baseSpeciesId.replace(/-/g, "_");

    if (baseId.startsWith("nidoran_") || 
        baseId.startsWith("meowstic_") || 
        baseId.startsWith("indeedee_") ||
        baseId.startsWith("basculegion_") ||
        baseId.startsWith("oinkologne_") ||
        baseId.startsWith("tapu_")) {
      return pId === baseId || pId.startsWith(baseId + "_");
    }
    
    return (
      pId === baseId ||
      pId.startsWith(baseId + "_")
    );
  });

  if (allForms.length === 0) {
    datadexContent.innerHTML = `<p class="text-white text-center">Nenhuma forma encontrada para ${baseSpeciesId}.</p>`;
    return;
  }

  if (currentPokemonList.length === 0) {
    currentPokemonList = allPokemonDataForList;
  }

  let uniqueList;
  if (navigationList) {
    uniqueList = navigationList;
  } else {
    console.warn("Fallback de navegação: usando allPokemonDataForList ordenada por Dex.");
    const displayedSpecies = new Set();
    uniqueList = allPokemonDataForList
      .filter((pokemon) => {
        if (!pokemon || !pokemon.speciesId || 
            pokemon.speciesName.startsWith("Mega ") || 
            pokemon.speciesName.includes("Dinamax") ||
            pokemon.speciesName.toLowerCase().includes("(shadow)")
           ) {
          return false;
        }
        
        let currentItemBaseId;
        const sId = pokemon.speciesId.replace("-", "_");

        if (sId.startsWith("nidoran_") || 
            sId.startsWith("meowstic_") || 
            sId.startsWith("indeedee_") ||
            sId.startsWith("basculegion_") ||
            sId.startsWith("oinkologne_") ||
            sId.startsWith("tapu_")) {
          currentItemBaseId = sId;
        } else {
          currentItemBaseId = sId.split("_")[0];
        }

        if (displayedSpecies.has(currentItemBaseId)) {
          return false;
        } else {
          displayedSpecies.add(currentItemBaseId);
          return true;
        }
      })
      .sort((a, b) => (a.dex || 0) - (b.dex || 0));
  }

  let currentIndexInList;
  if (targetSpeciesId) {
    currentIndexInList = uniqueList.findIndex(p => p.speciesId === targetSpeciesId);
  } else {
    currentIndexInList = uniqueList.findIndex((p) => {
      let currentItemBaseId;
      const sId = p.speciesId.replace("-", "_");
      if (sId.startsWith("nidoran_") || 
          sId.startsWith("meowstic_") || 
          sId.startsWith("indeedee_") || 
          sId.startsWith("basculegion_") || 
          sId.startsWith("oinkologne_") || 
          sId.startsWith("tapu_")) {
        currentItemBaseId = sId;
      } else {
        currentItemBaseId = sId.split("_")[0];
      }
      return currentItemBaseId === baseSpeciesId;
    });
  }
  
  if (currentIndexInList === -1) { currentIndexInList = 0; }

  const prevPokemon =
    currentIndexInList > 0 ? uniqueList[currentIndexInList - 1] : null;
  const nextPokemon =
    currentIndexInList < uniqueList.length - 1
      ? uniqueList[currentIndexInList + 1]
      : null;

  let currentFormIndex = 0;
  if (targetSpeciesId) {
    const foundIndex = allForms.findIndex(p => p.speciesId === targetSpeciesId);
    if (foundIndex !== -1) {
      currentFormIndex = foundIndex;
    }
  }

  const renderPage = () => {
    const pokemon = allForms[currentFormIndex];
    localStorage.setItem("lastViewedPokemonDex", pokemon.dex);

    const { dex, nomeParaExibicao, types, baseStats, fastMoves, chargedMoves, speciesName } =
      pokemon;

    const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);
    const isShadow = speciesName && speciesName.toLowerCase().includes("(shadow)");

    const cpRankNum = GLOBAL_POKE_DB.cpRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const atkRankNum = GLOBAL_POKE_DB.atkRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const defRankNum = GLOBAL_POKE_DB.defRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const hpRankNum = GLOBAL_POKE_DB.hpRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const cpRank = cpRankNum === -1 ? 'N/A' : cpRankNum + 1;
    const atkRank = atkRankNum === -1 ? 'N/A' : atkRankNum + 1;
    const defRank = defRankNum === -1 ? 'N/A' : defRankNum + 1;
    const hpRank = hpRankNum === -1 ? 'N/A' : hpRankNum + 1;

    const normalSrc = pokemon.imgNormal || pokemon.imgNormalFallback;
    const shinySrc = pokemon.imgShiny || pokemon.imgShinyFallback;
    let isCurrentlyShiny = false; 

    // =============================================================
    //        ▼▼▼ GERAÇÃO DOS BADGES DE TIPO COM ÍCONE ▼▼▼
    // =============================================================
    const tiposHTML = types
      .filter((t) => t && t.toLowerCase() !== "none")
      .map((tipo) => {
        const englishType = tipo.toLowerCase();
        const portugueseType = TYPE_TRANSLATION_MAP[englishType] || tipo;
        const color = getTypeColor(englishType);
        const icon = getTypeIcon(englishType); // Pega o ícone

        // Cria o HTML com a imagem (ícone) antes do texto
        return `<span class="pokedex-tipo-badge" style="background-color: ${color};">
                  <img src="${icon}" alt="${portugueseType}" class="pokedex-tipo-icon">
                  ${portugueseType}
                </span>`;
      })
      .join("");
    // =============================================================
    const criarHtmlDoMovimento = (moveId) => {
      const moveKey = moveId.replace(/_FAST$/, "");
      const moveData = GLOBAL_POKE_DB.moveDataMap.get(moveKey);
      const moveType = moveData?.type;
      const power = moveData?.power;
      const energyGain = moveData?.energyGain;
      const energy = moveData?.energy;
      const cooldown = moveData?.cooldown;
      let styleAttribute = "";
      let textColor = "#FFF";
      if (moveType) {
        const color = getTypeColor(moveType);
        const isLight = isColorLight(color);
        textColor = isLight ? "#222" : "#FFF";
        styleAttribute = `style="background-color: ${color}; color: ${textColor}; border-left-color: ${color}CC;"`;
      }
      const formattedKey = moveKey
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const translatedName = GLOBAL_POKE_DB.moveTranslations[formattedKey] || formattedKey;
      let statsHtml = "";
      const powerHtml = power ? `<span class="move-stat" style="color: ${textColor};">Dmg: ${power}</span>` : "";
      if (energyGain && energyGain > 0) {
        const energyHtml = `<span class="move-stat" style="color: ${textColor};">Ge: ${energyGain}</span>`;
        const cdHtml = cooldown ? `<span class="move-stat" style="color: ${textColor};">CD: ${cooldown / 1000}s</span>` : "";
        statsHtml = `<div class="move-stats-container">${powerHtml}${energyHtml}${cdHtml}</div>`;
      } else if (energy && energy > 0) {
        const energyHtml = `<span class="move-stat" style="color: ${textColor};">Ce: ${Math.abs(energy)}</span>`;
        let dpeHtml = "";
        if (power && energy) {
          const dpe = (power / Math.abs(energy)).toFixed(2);
          dpeHtml = `<span class="move-stat" style="color: ${textColor};">DPE: ${dpe}</span>`;
        }
        statsHtml = `<div class="move-stats-container">${powerHtml}${energyHtml}${dpeHtml}</div>`; 
      } else {
        statsHtml = `<div class="move-stats-container">${powerHtml}</div>`;
      }
      return `<li ${styleAttribute}>
                <img src="${getTypeIcon(moveType)}" alt="${moveType}" class="move-type-icon">
                <span class="move-name" style="color: ${textColor};">${translatedName}</span>
                ${statsHtml}
              </li>`;
    };
    const ataquesRapidosHTML = fastMoves.map(criarHtmlDoMovimento).join("");
    const ataquesCarregadosHTML = chargedMoves
      .map(criarHtmlDoMovimento)
      .join("");

    let visibleCol1 = '<div class="cp-column">';
    let visibleCol2 = '<div class="cp-column">';
    let hiddenCol1_FULL = '<div class="cp-column">';
    let hiddenCol2_FULL = '<div class="cp-column">';
    for (let level = 1; level <= 50; level++) {
      const cp = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, level);
      const rowHTML = `<div class="cp-level-row"><span class="level">Nível ${level}</span><span class="cp">${cp} CP</span></div>`;
      if (level <= 5) {
        visibleCol1 += rowHTML;
      } else if (level <= 10) {
        visibleCol2 += rowHTML;
      }
      if (level <= 25) {
        hiddenCol1_FULL += rowHTML;
      } else {
        hiddenCol2_FULL += rowHTML;
      }
    }
    visibleCol1 += "</div>";
    visibleCol2 += "</div>";
    hiddenCol1_FULL += "</div>";
    hiddenCol2_FULL += "</div>";
    const cpTableFinalHTML = `
            <div class="cp-level-wrapper">
                <div class="cp-level-grid" id="visible-cp-grid">${visibleCol1}${visibleCol2}</div>
                <div class="cp-rows-hidden" id="hidden-cp-rows">
                  <div class="cp-level-grid">${hiddenCol1_FULL}${hiddenCol2_FULL}</div>
                </div>
            </div>
            <button id="show-more-cp" class="show-more-button">Mostrar mais...</button>`;

    let formDropdownHTML = '<div class="form-dropdown">';
    formDropdownHTML += `<div class="form-dropdown-selected" tabindex="0"><img src="${
      pokemon.imgNormal || pokemon.imgNormalFallback
    }" alt="${nomeParaExibicao}"><span>${nomeParaExibicao}</span><i class="arrow down"></i></div>`;
    formDropdownHTML += '<div class="form-dropdown-list">';
    
    const filteredDropdownForms = allForms.filter(form =>
      form && form.speciesName &&
      !form.speciesName.startsWith("Mega ") 
    );

    filteredDropdownForms.forEach((form) => {
      const originalIndex = allForms.findIndex(p => p.speciesId === form.speciesId);

      formDropdownHTML += `<div class="form-dropdown-item" data-index="${originalIndex}"><img src="${
        form.imgNormal || form.imgNormalFallback
      }" alt="${form.nomeParaExibicao}"><span>${
        form.nomeParaExibicao
      }</span></div>`;
    });
    formDropdownHTML += "</div></div>";

    const prevButtonHTML = prevPokemon
      ? `<div id="prev-pokemon" class="nav-botao"><img src="${
          prevPokemon.imgNormal || prevPokemon.imgNormalFallback
        }" alt="${
          prevPokemon.nomeParaExibicao
        }"><div class="nav-texto"><strong>Anterior</strong><span>#${String(
          prevPokemon.dex
        ).padStart(3, "0")}</span></div></div>`
      : `<div class="nav-botao hidden"></div>`;
    const nextButtonHTML = nextPokemon
      ? `<div id="next-pokemon" class="nav-botao"><div class="nav-texto" style="text-align: right;"><strong>Próximo</strong><span>#${String(
          nextPokemon.dex
        ).padStart(3, "0")}</span></div><img src="${
          nextPokemon.imgNormal || nextPokemon.imgNormalFallback
        }" alt="${nextPokemon.nomeParaExibicao}"></div>`
      : `<div class="nav-botao hidden"></div>`;

    const finalHTML = `
            <div class="pokedex-card-detalhes">
                <div class="detalhes-navegacao">${prevButtonHTML}${nextButtonHTML}</div>
                ${formDropdownHTML}
                <div class="imagem-container pokemon-image-container ${isShadow ? "is-shadow" : ""}"><img src="${
                  normalSrc
                }" alt="${nomeParaExibicao}"></div>
                <div class="shiny-toggle-container" ${!shinySrc ? 'style="display: none;"' : ''}>
                  <button id="shiny-toggle-button" class="shiny-toggle-button">
                    ✨ Ver Brilhante
                  </button>
                </div>
                <div class="tipos-container">${tiposHTML}</div>
                <div class="secao-detalhes">
                    <h3>Status</h3>
                    <div class="stats-grid">
                        <div class="stat-valor cp-max-stat">
                          <strong>${maxCP}</strong>
                          <span>CP Máx.</span>
                          <span class="stat-rank">(Rank: ${cpRank})</span>
                        </div>
                        <div class="stat-valor">
                          <strong>${baseStats.atk}</strong>
                          <span>Ataque</span>
                          <span class="stat-rank">(Rank: ${atkRank})</span>
                        </div>
                        <div class="stat-valor">
                          <strong>${baseStats.def}</strong>
                          <span>Defesa</span>
                          <span class="stat-rank">(Rank: ${defRank})</span>
                        </div>
                        <div class="stat-valor">
                          <strong>${baseStats.hp}</strong>
                          <span>Stamina</span>
                          <span class="stat-rank">(Rank: ${hpRank})</span>
                        </div>
                    </div>
                    <div class="stats-bars-container">
                      <div class="stat-bar-container"><span class="stat-label">CP</span><div class="stat-bar"><div style="width:${
                        (maxCP / MAX_POSSIBLE_CP) * 100
                      }%;background-color:#5dade2;"></div></div></div>
                      <div class="stat-bar-container"><span class="stat-label">ATK</span><div class="stat-bar"><div style="width:${
                        (baseStats.atk / MAX_STAT_ATK) * 100
                      }%;background-color:#f34444;"></div></div></div>
                      <div class="stat-bar-container"><span class="stat-label">DEF</span><div class="stat-bar"><div style="width:${
                        (baseStats.def / MAX_STAT_DEF) * 100
                      }%;background-color:#448cf3;"></div></div></div>
                      <div class="stat-bar-container"><span class="stat-label">HP</span><div class="stat-bar"><div style="width:${
                        (baseStats.hp / MAX_STAT_HP) * 100
                      }%;background-color:#23ce23;"></div></div></div>
                    </div>
                </div>
                <div class="secao-detalhes">
                    <h3>Movimentos PVP</h3>
                    <div class="ataques-grid">
                        <div><h4>Ataques Rápidos</h4><ul>${ataquesRapidosHTML}</ul></div>
                        <div><h4>Ataques Carregados</h4><ul>${ataquesCarregadosHTML}</ul></div>
                    </div>
                </div>
                <div class="secao-detalhes">
                    <h3>CP Máximo por Nível (100% IV)</h3>
                    ${cpTableFinalHTML}
                </div>
            </div>`;

    datadexContent.innerHTML = finalHTML;
    attachImageFallbackHandler(
      datadexContent.querySelector(".imagem-container img"),
      pokemon
    );

    document
      .getElementById("prev-pokemon")
      ?.addEventListener("click", () => {
        let prevBaseId = prevPokemon.speciesId.replace("-", "_").split("_")[0];
        const prevFullId = prevPokemon.speciesId;
        if (prevBaseId === "nidoran" || prevBaseId === "meowstic" || prevBaseId === "indeedee" || prevBaseId === "basculegion" || prevBaseId === "oinkologne" || prevBaseId === "tapu") {
          prevBaseId = prevFullId;
        }
        showPokemonDetails(prevBaseId, navigationList, prevFullId);
      });
      
    document
      .getElementById("next-pokemon")
      ?.addEventListener("click", () => {
        let nextBaseId = nextPokemon.speciesId.replace("-", "_").split("_")[0];
        const nextFullId = nextPokemon.speciesId;
        if (nextBaseId === "nidoran" || nextBaseId === "meowstic" || nextBaseId === "indeedee" || nextBaseId === "basculegion" || nextBaseId === "oinkologne" || nextBaseId === "tapu") {
          nextBaseId = nextFullId;
        }
        showPokemonDetails(nextBaseId, navigationList, nextFullId);
      });

    const dropdown = document.querySelector(".form-dropdown");
    dropdown
      .querySelector(".form-dropdown-selected")
      .addEventListener("click", () => {
        dropdown.querySelector(".form-dropdown-list").classList.toggle("show");
        dropdown.querySelector(".arrow").classList.toggle("up");
      });
    dropdown.querySelectorAll(".form-dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        currentFormIndex = parseInt(item.dataset.index, 10);
        renderPage();
      });
    });

    const showMoreButton = document.getElementById("show-more-cp");
    showMoreButton?.addEventListener("click", () => {
      const hiddenRows = document.getElementById("hidden-cp-rows");
      const visibleRows = document.getElementById("visible-cp-grid");
      const isShowingMore = hiddenRows.classList.toggle("show");
      visibleRows.classList.toggle("hidden", isShowingMore);
      showMoreButton.textContent = isShowingMore
        ? "Mostrar menos"
        : "Mostrar mais...";
    });
    
    const shinyButton = document.getElementById("shiny-toggle-button");
    const pokemonImage = datadexContent.querySelector(".imagem-container img");

    if (shinyButton && pokemonImage && shinySrc) {
      shinyButton.addEventListener("click", () => {
        isCurrentlyShiny = !isCurrentlyShiny;
        if (isCurrentlyShiny) {
          pokemonImage.src = shinySrc;
          shinyButton.innerHTML = "🎨 Ver Normal";
        } else {
          pokemonImage.src = normalSrc;
          shinyButton.innerHTML = "✨ Ver Brilhante";
        }
      });
    }

  };

  renderPage();
  topControls.innerHTML = `<button id="backToListButton">&larr; Voltar à Lista</button>`;
  document
    .getElementById("backToListButton")
    .addEventListener("click", () => displayPokemonList(currentPokemonList));
}

// --- 13. FUNÇÃO PRINCIPAL DE EXECUÇÃO ---

async function main() {
  console.log("🚀 Iniciando Script Mestre...");

  topControls = document.getElementById("top-controls");
  datadexContent = document.getElementById("datadex-content");

  const datadexScreen = document.getElementById("datadex-screen");
  if (datadexScreen) {
    datadexContent.innerHTML = `<p class="text-white text-center text-xl p-10">Carregando banco de dados...</p>`;
  }

  GLOBAL_POKE_DB = await carregarTodaABaseDeDados();
  if (!GLOBAL_POKE_DB) {
    console.error("Falha crítica ao carregar o banco de dados.");
    if (datadexScreen) {
      datadexContent.innerHTML = `<p class="text-red-500 text-center text-xl p-10">Falha ao carregar o banco de dados.</p>`;
    }
    return;
  }
  console.log("✅ Banco de dados carregado.");

  // Tarefas...
  processarListas(".pokemon-list", "selvagem", GLOBAL_POKE_DB);
  processarListas(".reide-list", "reide", GLOBAL_POKE_DB);
  processarListas(".lista-detalhes", "detalhes", GLOBAL_POKE_DB);
  processarListas(".go-rocket", "gorocket", GLOBAL_POKE_DB);

  if (datadexScreen) {
    console.log("🚀 Iniciando interface da Datadex...");

    const mappedList = await Promise.all(
      Array.from(GLOBAL_POKE_DB.pokemonsByNameMap.values()).map(
        async (p) => {
          const pokemon = await buscarDadosCompletosPokemon(p.speciesName, GLOBAL_POKE_DB);
          if (pokemon && pokemon.baseStats) {
            pokemon.maxCP = calculateCP(pokemon.baseStats, { atk: 15, def: 15, hp: 15 }, 50);
          } else if (pokemon) {
            pokemon.maxCP = 0; 
          }
          return pokemon;
        }
      )
    );

    // =============================================================
    //          ▼▼▼ MUDANÇA IMPORTANTE AQUI ▼▼▼
    // Removemos o filtro de Mega e Dinamax da lista principal
    // =============================================================
    allPokemonDataForList = mappedList
      .filter(p => p !== null) // Apenas filtramos os nulos
      .sort((a, b) => a.dex - b.dex);
    // =============================================================

    console.log("Calculando listas de rank...");
    GLOBAL_POKE_DB.cpRankList = [...allPokemonDataForList].sort((a, b) => (b.maxCP || 0) - (a.maxCP || 0));
    GLOBAL_POKE_DB.atkRankList = [...allPokemonDataForList].sort((a, b) => (b.baseStats?.atk || 0) - (a.baseStats?.atk || 0));
    GLOBAL_POKE_DB.defRankList = [...allPokemonDataForList].sort((a, b) => (b.baseStats?.def || 0) - (a.baseStats?.def || 0));
    GLOBAL_POKE_DB.hpRankList = [...allPokemonDataForList].sort((a, b) => (b.baseStats?.hp || 0) - (a.baseStats?.hp || 0));
    console.log("Listas de rank prontas.");

    console.log("👍 Interface da Datadex pronta.");

    verificarPokemonsFaltando();

    const lastViewedDex = localStorage.getItem("lastViewedPokemonDex");
    if (lastViewedDex) {
      const lastPokemon = allPokemonDataForList.find(
        (p) => p.dex === parseInt(lastViewedDex, 10)
      );
      if (lastPokemon) {
        // ATUALIZADO: Passa o baseId e o fullId
        const baseId = lastPokemon.speciesId.split("_")[0];
        const fullId = lastPokemon.speciesId;
        showPokemonDetails(baseId, null, fullId);
      } else {
        displayGenerationSelection();
      }
    } else {
      displayGenerationSelection();
    }
  }
}

// --- 14. INICIALIZADOR DO EFEITO ACORDEÃO PARA LÍDERES ---

window.addEventListener("load", main);

// ============================================================= //
// VERSÃO FINAL: Funcionalidade de Acordeão para LÍDERES E RECRUTAS //
// ============================================================= //

window.addEventListener("load", function () {
  // --- Função genérica para criar um acordeão ---
  function setupAccordion(titleSelector, contentSelectorFunction) {
    const titles = document.querySelectorAll(titleSelector);

    titles.forEach((title) => {
      title.addEventListener("click", function () {
        // "this" é o título que foi clicado
        this.classList.toggle("active");

        // Usa a função para encontrar o conteúdo
        const content = contentSelectorFunction(this);

        if (content) {
          content.classList.toggle("active");
        }
      });
    });
  }

  // --- Ativa o acordeão para os LÍDERES ---
  // O conteúdo é o próximo elemento irmão (div.leader-grid)
  setupAccordion(
    ".leader-section > h2, .leader-section > h3",
    (titleElement) => {
      return titleElement.nextElementSibling;
    }
  );

  // --- Ativa o acordeão para os RECRUTAS ---
  // O conteúdo é o próximo elemento irmão (ul.go-rocket)
  setupAccordion(".grunt-section h4", (titleElement) => {
    return titleElement.nextElementSibling;
  });
});
