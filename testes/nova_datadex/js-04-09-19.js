// =============================================================
//  SCRIPT POKÉMON UNIFICADO com datadex 17/12/2025)
// =============================================================

// =============================================================
//  0. CONTROLE DE VERSÃO E CACHE (SISTEMA MESTRE)
// =============================================================
// Mude este valor sempre que quiser obrigar o usuário a baixar tudo de novo
const VERSAO_ATUAL = "2025.12.16-v1"; 

function gerenciarCacheLocal() {
    const versaoSalva = localStorage.getItem("pokedragon_versao");

    if (versaoSalva !== VERSAO_ATUAL) {
        console.log(`🚀 Nova versão detectada: ${VERSAO_ATUAL}. Limpando dados antigos...`);
        
        // 1. Limpa o localStorage (remove filtro de geração salvo, ultimo pokemon visto, etc)
        localStorage.clear();
        
        // 2. Salva a nova versão para não limpar de novo no próximo F5
        localStorage.setItem("pokedragon_versao", VERSAO_ATUAL);
        
        // 3. Aviso visual no console
        console.log("✅ Cache limpo com sucesso!");
    }
}

// Executa a limpeza antes de qualquer coisa
gerenciarCacheLocal();

// --- 1. CONSTANTES DE CONFIGURAÇÃO (CORRIGIDAS COM CDN) ---
// Função auxiliar para colocar a versão no final do link (ex: dados.json?v=2025...)
const addVer = (url) => `${url}?v=${VERSAO_ATUAL}`;

const URLS = {
  MAIN_DATA: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data.json"),
  
  MAIN_DATA_FALLBACK: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@f704cfb1038e72cfff7d5b1b29799042eff00d2b/json/poke_data.json"),
  
  MEGA_DATA: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/mega_reides.json"),
  
  GIGAMAX_DATA: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data_gigamax.json"),
  
  IMAGES_PRIMARY: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/imagens_pokemon.json"),
  
  IMAGES_SEED: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@da740ce8daf7b85137c01faa8b1a1dbe72052f95/json/imagens_pokemon.json"),
  
  IMAGES_ALT: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/imagens_pokemon_alt.json"),
  
  TYPE_DATA: addVer("https://cdn.jsdelivr.net/gh/nowadraco/bloggerpoke@main/src/data/gamemaster/tipos_poke.json"),

  TYPE_EFFECTIVENESS: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/eficacia_tipos_poke.json"),
  
  MOVE_TRANSLATIONS: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_portugues.json"),
  
  MOVE_DATA: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/moves.json"),

  MOVES_GYM_FAST: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_rapidos_gym.json"),

  MOVES_GYM_CHARGED: addVer("https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_carregados_gym.json"),
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
    "Tauros (Aqua)": "Tauros de Paldea Espécie Aquática",
    "Tauros (Blaze)": "Tauros de Paldea Espécie Labareda",
    "Tauros (Combat)": "Tauros de Paldea Espécie de Combate",
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
      ["Cubchoo com Laço Festivo", "Cubchoo"],
      ["Pichu com um Chapéu Festivo", "Pichu"],
      ["Sudowoodo com Traje Festivo", "Sudowoodo"],
      ["Charjabug com Traje Festivo", "Charjabug"],
      ["Vikavolt com Traje Festivo", "Vikavolt"],
      ["Stantler com Traje Festivo", "Stantler"],
      ["Dedenne com Traje Festivo", "Dedenne"],
      ["Bulbasaur com Chapéu de Festa", "Bulbasaur"],
      ["Jigglypuff com um Laço", "Jigglypuff"],
      ["Hoothoot com Traje de Ano Novo", "Hoothoot"],
      ["Pikachu com Cartola de Festa", "Pikachu"],
      ["Wurmple com Chapéu de Festa", "Wurmple"],
      ["Raticate com Chapéu de Festa", "Raticate"],
      ["Nidorino com Chapéu de Festa", "Nidorino"],
      ["Gengar com Chapéu de Festa", "Gengar"],
      ["Wobbuffet com Chapéu de Festa", "Wobbuffet"],
      ["Spheal com Traje Festivo", "Spheal"],
      ["Delibird com Laço Festivo", "Delibird"],
      ["Pikachu com Gorro de Natal (2016)", "Pikachu"],
      ["Pikachu Roupa de Inverno (2020)", "Pikachu"],
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
async function carregarTodaABaseDeDados() {
  try {
    const responses = await Promise.all([
      fetch(URLS.MAIN_DATA).then((res) => res.json()),
      fetch(URLS.MAIN_DATA_FALLBACK).then((res) => res.json()),
      fetch(URLS.MEGA_DATA).then((res) => res.json()),
      fetch(URLS.GIGAMAX_DATA).then((res) => res.json()),
      fetch(URLS.IMAGES_PRIMARY).then((res) => res.json()),
      fetch(URLS.IMAGES_SEED).then((res) => res.json()),
      fetch(URLS.IMAGES_ALT).then((res) => res.json()),
      fetch(URLS.TYPE_DATA).then((res) => res.json()),
      
      // ▼▼▼ NOVO FETCH AQUI ▼▼▼
      fetch(URLS.TYPE_EFFECTIVENESS).then((res) => res.json()), 

      fetch(URLS.MOVE_TRANSLATIONS).then((res) => res.json()),
      fetch(URLS.MOVE_DATA).then((res) => res.json()),
      fetch(URLS.MOVES_GYM_FAST).then((res) => res.json()),
      fetch(URLS.MOVES_GYM_CHARGED).then((res) => res.json()),
    ]);

    const [
      mainData,
      fallbackData,
      megaData,
      gigaData,
      primaryImages,
      seedImages,
      altImages,
      typeData,
      // ▼▼▼ RECEBE O DADO NOVO AQUI ▼▼▼
      effectivenessData, 
      
      rawMoveTranslations,
      moveData,
      gymFastData,
      gymChargedData,
    ] = responses;

    window.GLOBAL_MOVES_DB = moveData;

    const moveTranslations = rawMoveTranslations.reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {});

    const moveDataMap = new Map(moveData.map((move) => [move.moveId, move]));
    const gymFastMap = new Map(gymFastData.map((move) => [move.moveId, move]));
    const gymChargedMap = new Map(gymChargedData.map((move) => [move.moveId, move]));

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
      mapaImagensPrimario: new Map(primaryImages.map((item) => [item.nome, item])),
      mapaImagensSeed: new Map(seedImages.map((item) => [item.nome, item])),
      mapaImagensAlternativo: new Map(altImages.map((item) => [item.name, item])),
      dadosDosTipos: typeData,
      
      // ▼▼▼ SALVA NO OBJETO GLOBAL ▼▼▼
      dadosEficacia: effectivenessData, 
      
      moveTranslations: moveTranslations, 
      moveDataMap: moveDataMap,
      gymFastMap: gymFastMap,       
      gymChargedMap: gymChargedMap, 
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
    console.error(`Dados não encontrados para: ${nomeOriginal}`);
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
    nomeOriginal.includes("com um Chapéu Festivo") ||
    nomeOriginal.includes("com Laço Festivo") ||
    nomeOriginal.includes("com Traje Festivo") ||
    nomeOriginal.includes("com fantasia de Dia das Bruxas") ||
    nomeOriginal.includes("com um Laço") ||
    nomeOriginal.includes("com Traje de Ano Novo") ||
    nomeOriginal.includes("com Cartola de Festa") ||
    nomeOriginal.includes("com Chapéu de Festa") ||
    nomeOriginal.includes("Cubchoo com laço festivo")
  ) {
    const nomeLimpoParaBuscaDeImagem = nomeOriginal.replace(/\*/g, "").trim();
    // console.log(`[Debug Imagem - Caso Especial] Procurando: "${nomeLimpoParaBuscaDeImagem}"`);
    infoImagens = database.mapaImagensPrimario.get(nomeLimpoParaBuscaDeImagem);
  } else {
    const chavesDeBuscaDeImagem = gerarChavesDeBuscaPossiveis(pokemonData.speciesName);
    for (const chave of chavesDeBuscaDeImagem) {
      infoImagens = database.mapaImagensPrimario.get(chave);
      if (infoImagens) break;
    }
  }

  if (!infoImagens) {
    console.error(`[Debug Imagem] ❌ FALHA Primária: Nenhuma imagem encontrada para "${nomeOriginal}"`);
  }

  // --- 1. DEFINIÇÃO DAS IMAGENS PRIMÁRIAS ---
  const imgNormal = infoImagens?.imgNormal;
  const imgShiny = infoImagens?.imgShiny;

 // --- 2. DEFINIÇÃO DAS IMAGENS SEED (COM LOGS DE RASTREIO) ---
  let infoImagensSeed = null;
   
  if (infoImagens && infoImagens.nome) {
      // Caminho Feliz: Achou a primária, pega a seed pelo nome dela
      infoImagensSeed = database.mapaImagensSeed.get(infoImagens.nome);
  } else {
      // Caminho Triste: Primária falhou. Vamos rastrear a busca na Seed!
      console.warn(`🕵️‍♂️ [SEED DEBUG] Primária vazia para "${nomeOriginal}". Tentando recuperar na Seed...`);
      
      const chaves = gerarChavesDeBuscaPossiveis(pokemonData.speciesName);
      
      // Vamos mostrar quais chaves ele está tentando
      // console.log(`   🔑 Chaves geradas:`, chaves); 

      for (const chave of chaves) {
          infoImagensSeed = database.mapaImagensSeed.get(chave);
          
          if (infoImagensSeed) {
              console.log(`✅ [SEED DEBUG] SALVO! Encontrado na Seed como: "${chave}"`);
              break; // Achou, para de procurar
          }
      }

      if (!infoImagensSeed) {
          console.error(`💀 [SEED DEBUG] MORREU: Não existe nem na Primária nem na Seed: "${nomeOriginal}"`);
      }
  }

  const imgNormalSeed = infoImagensSeed?.imgNormal;
  const imgShinySeed = infoImagensSeed?.imgShiny;

  // --- 3. DEFINIÇÃO DAS IMAGENS ALTERNATIVAS ---
  const infoImagensAlt = database.mapaImagensAlternativo.get(pokemonData.speciesId);
  const imgNormalFallback = infoImagensAlt?.imgNormal;
  const imgShinyFallback = infoImagensAlt?.imgShiny;

  return {
    ...pokemonData,
    imgNormal,
    imgShiny,
    imgNormalSeed,
    imgShinySeed,
    imgNormalFallback,
    imgShinyFallback,
    nomeParaExibicao,
  };
}

// --- 7. PROCESSAMENTO E RENDERIZAÇÃO DAS LISTAS HTML (COM FALLBACK INTELIGENTE) ---
function processarListas(selector, tipoCard, database) {
  const listas = document.querySelectorAll(selector);
  const tabelaDeTipos = formatarTabelaTiposDetalhes(database.dadosDosTipos);

  listas.forEach((lista) => {
    const itensOriginais = Array.from(lista.querySelectorAll("li"));
    lista.innerHTML = ""; // Limpa a lista para recriar

    itensOriginais.forEach((item) => {
      const nomeOriginal = item.textContent.trim();
      
      // 1. TENTATIVA PRINCIPAL: Busca o nome exato (ex: "Bulbasaur com Chapéu")
      let pokemonCompleto = buscarDadosCompletosPokemon(nomeOriginal, database);
      
      // Variável para controlar o texto que aparece embaixo da imagem
      let nomeParaExibirNoCard = nomeOriginal; 

      // 2. LÓGICA DE "SEGUNDA CHANCE" (Fallback)
      if (!pokemonCompleto) {
        // Tenta pegar o nome base cortando em " com " ou abre parênteses "("
        // Ex: "Bulbasaur com Chapéu" -> vira "Bulbasaur"
        // Ex: "Pikachu (Oceano)" -> vira "Pikachu"
        const nomeBaseTentativa = nomeOriginal.split(/ com | \(/i)[0].trim();

        // Se o nome base for diferente do original, tenta buscar de novo
        if (nomeBaseTentativa && nomeBaseTentativa !== nomeOriginal) {
           const dadosBase = buscarDadosCompletosPokemon(nomeBaseTentativa, database);
           
           if (dadosBase) {
             console.log(`⚠️ [Fallback] "${nomeOriginal}" não encontrado. Usando imagem de "${nomeBaseTentativa}".`);
             pokemonCompleto = dadosBase;
             
             // Aqui adicionamos o aviso que você pediu
             // O <small> deixa a letra menor para ficar estético
             nomeParaExibirNoCard = `${nomeOriginal} <br><small style="color: #f39c12; font-size: 0.85em;">(Imagem Base)</small>`;
           }
        }
      }

      // 3. RENDERIZAÇÃO
      if (pokemonCompleto) {
        const geradorDeCard = {
          detalhes: generatePokemonListItemDetalhes,
          reide: generatePokemonListItemReide,
          selvagem: criarElementoPokemonSelvagem,
          gorocket: generatePokemonListItemGoRocket,
        }[tipoCard];

        const novoItem = geradorDeCard(
          pokemonCompleto,
          nomeOriginal, // Mantemos o ID original para links funcionarem
          tabelaDeTipos
        );

        // AQUI ESTÁ O TRUQUE: Substituímos o texto do span pelo texto com aviso
        // Precisamos encontrar o <span> onde fica o nome e atualizar
        const spanNome = novoItem.querySelector("span");
        if (spanNome) {
            spanNome.innerHTML = nomeParaExibirNoCard;
        }

        lista.appendChild(novoItem);
      } else {
        // 4. FALHA TOTAL: Não achou nem o original, nem o base
        console.warn(`Pokémon "${nomeOriginal}" não encontrado (nem busca base).`);
        const liErro = document.createElement("li");
        liErro.className = "item-erro";
        liErro.innerHTML = `<span>${nomeOriginal} (?)</span>`;
        lista.appendChild(liErro);
      }
    });
  });

  iniciarAlternanciaImagens(selector + " li", database);
}

// --- 8. UTILITÁRIO DE IMAGEM (FALLBACK DE ERRO) ---
function attachImageFallbackHandler(imgElement, pokemonData) {
  if (!imgElement) return;

  imgElement.onerror = function () {
    console.warn(`[Erro Imagem] Falha em: ${this.src}`);

    // --- LÓGICA PARA IMAGEM NORMAL ---
    
    // 1. Se falhou a Normal Primária -> Tenta a Seed
    if (this.src === pokemonData.imgNormal && pokemonData.imgNormalSeed) {
      console.log(`🚀 [SEED ATIVADO] Trocando imagem Normal para versão Seed...`); // <--- LOG AQUI
      this.src = pokemonData.imgNormalSeed;
    }
    // 2. Se falhou a Seed -> Tenta a Alternativa (Fallback)
    else if (this.src === pokemonData.imgNormalSeed && pokemonData.imgNormalFallback) {
      console.warn(`⚠️ [SEED FALHOU] Indo para Fallback Alternativo...`);
      this.src = pokemonData.imgNormalFallback;
    }
    // (Segurança) Se falhou a Primária e NÃO TEM Seed -> Vai direto pro Fallback
    else if (this.src === pokemonData.imgNormal && pokemonData.imgNormalFallback) {
       this.src = pokemonData.imgNormalFallback;
    }


    // --- LÓGICA PARA IMAGEM SHINY ---
    
    // 1. Se falhou a Shiny Primária -> Tenta a Shiny Seed
    else if (this.src === pokemonData.imgShiny && pokemonData.imgShinySeed) {
      console.log(`✨ [SEED SHINY ATIVADO] Trocando imagem Shiny para versão Seed...`); // <--- LOG AQUI
      this.src = pokemonData.imgShinySeed;
    }
    // 2. Se falhou a Shiny Seed -> Tenta a Shiny Alternativa (Fallback)
    else if (this.src === pokemonData.imgShinySeed && pokemonData.imgShinyFallback) {
      this.src = pokemonData.imgShinyFallback;
    }
    // (Segurança) Se falhou a Shiny Primária e NÃO TEM Seed -> Vai direto pro Fallback
    else if (this.src === pokemonData.imgShiny && pokemonData.imgShinyFallback) {
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

  const mainTitle = document.querySelector(".dynamic-title-target");
  if (mainTitle) {
      mainTitle.textContent = "Selecione uma Geração";
      mainTitle.classList.remove("hidden");
      mainTitle.style.display = "block";
  }

  topControls.innerHTML =
    '<h2 class="text-white text-center font-bold">Banco de Dados</h2>';

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

    // ▼▼▼ CORREÇÃO: Ativar Seed nos resultados da busca ▼▼▼
    resultsContainer.querySelectorAll("img").forEach(img => {
        // Precisamos achar os dados do pokemon pelo nome que está no alt
        // ou você pode buscar pelo ID do pai. Vamos pelo mais seguro:
        const itemDiv = img.closest(".search-result-item");
        if(itemDiv && itemDiv.dataset.speciesId) {
             // Acha o pokemon na lista global
             const pokeData = allPokemonDataForList.find(p => p.speciesId === itemDiv.dataset.speciesId);
             if(pokeData) {
                 attachImageFallbackHandler(img, pokeData);
             }
        }
    });
    // ▲▲▲

    document.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", () => {
        const fullId = item.dataset.speciesId;

        let baseId = fullId.replace("-", "_").split("_")[0];
        // Adicionado "tapu" na lista de exceções
        if (
          baseId === "nidoran" ||
          baseId === "meowstic" ||
          baseId === "indeedee" ||
          baseId === "basculegion" ||
          baseId === "oinkologne" ||
          baseId === "tapu"
        ) {
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

  const mainTitle = document.querySelector(".dynamic-title-target");
  if (mainTitle) {
      mainTitle.textContent = "Selecione um Pokémon";
      mainTitle.classList.remove("hidden");
      mainTitle.style.display = "block";
  }

  let currentSortKey = "dex";

  topControls.innerHTML = `
    <div class="controls-single-line">
        <div class="controls-left">
            <button id="backToGenButton">&larr; Voltar</button>
            <div class="search-wrapper">
                <input type="text" id="searchInput" placeholder="Pesquisar...">
                <span id="pokemon-list-count"></span>
            </div>
        </div>

        <div class="sort-controls-container">
            <span class="sort-label">Ordenar:</span>
            <button class="sort-button active" data-sort="dex">#</button>
            <button class="sort-button" data-sort="cp">CP</button>
            <button class="sort-button" data-sort="atk">Atk</button>
            <button class="sort-button" data-sort="def">Def</button>
            <button class="sort-button" data-sort="hp">HP</button>
        </div>
    </div>
  `;

  datadexContent.innerHTML =
    '<div id="pokemon-grid" class="pokemon-grid"></div>';
  const grid = document.getElementById("pokemon-grid");
  const searchInput = document.getElementById("searchInput");

  const renderList = (list, sortKey) => {
    grid.innerHTML = "";

    let uniquePokemonList;

    if (sortKey === "dex") {
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
        if (
          sId.startsWith("nidoran_") ||
          sId.startsWith("meowstic_") ||
          sId.startsWith("indeedee_") ||
          sId.startsWith("basculegion_") ||
          sId.startsWith("oinkologne_") ||
          sId.startsWith("tapu_")
        ) {
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
      uniquePokemonList = list.filter(
        (p) =>
          p &&
          p.speciesName &&
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

      let statHtml = "";
      switch (sortKey) {
        case "cp":
          statHtml = `CP Máx: ${pokemon.maxCP || 0}`;
          break;
        case "atk":
          statHtml = `Ataque: ${pokemon.baseStats?.atk || 0}`;
          break;
        case "def":
          statHtml = `Defesa: ${pokemon.baseStats?.def || 0}`;
          break;
        case "hp":
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
        if (
          baseId === "nidoran" ||
          baseId === "meowstic" ||
          baseId === "indeedee" ||
          baseId === "basculegion" ||
          baseId === "oinkologne" ||
          baseId === "tapu"
        ) {
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
        (p &&
          p.nomeParaExibicao &&
          p.nomeParaExibicao.toLowerCase().includes(searchTerm)) ||
        (p && p.dex && String(p.dex).includes(searchTerm))
    );

    const sortedList = sortList(filteredList, currentSortKey);
    renderList(sortedList, currentSortKey);
  }

  document
    .getElementById("backToGenButton")
    .addEventListener("click", displayGenerationSelection);
  searchInput.addEventListener("input", masterRender);

  document.querySelectorAll(".sort-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      currentSortKey = e.currentTarget.dataset.sort;

      // Atualiza a classe 'active'
      document
        .querySelectorAll(".sort-button")
        .forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");

      // Renderiza a lista novamente
      masterRender();

      // TELA ROLA PARA O TOPO SUAVEMENTE
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const mainTitle = document.querySelector(".dynamic-title-target");
  if (mainTitle) {
      mainTitle.classList.add("hidden");
      mainTitle.style.display = "none";
  }

  const allForms = allPokemonDataForList.filter((p) => {
    if (!p || !p.speciesId) return false;

    const pId = p.speciesId.replace(/-/g, "_");
    const baseId = baseSpeciesId.replace(/-/g, "_");

    if (
      baseId.startsWith("nidoran_") ||
      baseId.startsWith("meowstic_") ||
      baseId.startsWith("indeedee_") ||
      baseId.startsWith("basculegion_") ||
      baseId.startsWith("oinkologne_") ||
      baseId.startsWith("tapu_")
    ) {
      return pId === baseId || pId.startsWith(baseId + "_");
    }

    return pId === baseId || pId.startsWith(baseId + "_");
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
    console.warn(
      "Fallback de navegação: usando allPokemonDataForList ordenada por Dex."
    );
    const displayedSpecies = new Set();
    uniqueList = allPokemonDataForList
      .filter((pokemon) => {
        if (
          !pokemon ||
          !pokemon.speciesId ||
          pokemon.speciesName.startsWith("Mega ") ||
          pokemon.speciesName.includes("Dinamax") ||
          pokemon.speciesName.toLowerCase().includes("(shadow)")
        ) {
          return false;
        }

        let currentItemBaseId;
        const sId = pokemon.speciesId.replace("-", "_");

        if (
          sId.startsWith("nidoran_") ||
          sId.startsWith("meowstic_") ||
          sId.startsWith("indeedee_") ||
          sId.startsWith("basculegion_") ||
          sId.startsWith("oinkologne_") ||
          sId.startsWith("tapu_")
        ) {
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
    currentIndexInList = uniqueList.findIndex(
      (p) => p.speciesId === targetSpeciesId
    );
  } else {
    currentIndexInList = uniqueList.findIndex((p) => {
      let currentItemBaseId;
      const sId = p.speciesId.replace("-", "_");
      if (
        sId.startsWith("nidoran_") ||
        sId.startsWith("meowstic_") ||
        sId.startsWith("indeedee_") ||
        sId.startsWith("basculegion_") ||
        sId.startsWith("oinkologne_") ||
        sId.startsWith("tapu_")
      ) {
        currentItemBaseId = sId;
      } else {
        currentItemBaseId = sId.split("_")[0];
      }
      return currentItemBaseId === baseSpeciesId;
    });
  }

  if (currentIndexInList === -1) {
    currentIndexInList = 0;
  }

  const prevPokemon =
    currentIndexInList > 0 ? uniqueList[currentIndexInList - 1] : null;
  const nextPokemon =
    currentIndexInList < uniqueList.length - 1
      ? uniqueList[currentIndexInList + 1]
      : null;

  let currentFormIndex = 0;
  if (targetSpeciesId) {
    const foundIndex = allForms.findIndex(
      (p) => p.speciesId === targetSpeciesId
    );
    if (foundIndex !== -1) {
      currentFormIndex = foundIndex;
    }
  }

 // =============================================================
//  FUNÇÕES GLOBAIS DE SIMULAÇÃO (Coloque na raiz do arquivo!)
// =============================================================

// =============================================================
//  SIMULADOR DE BATALHA DE GINÁSIO (PvE)
//  Fórmula: PvE Padrão (0.5x Dano)
// =============================================================
function calcularMelhoresCombos(pokemon, oponenteInput) {
    if (!pokemon || !pokemon.baseStats) return [];

    console.group(`🏛️ SIMULAÇÃO DE GINÁSIO: ${pokemon.speciesName}`);

    // 1. CONFIGURA O OPONENTE
    // Mudei Def de 200 para 160 (Padrão de Ranking Global)
    let oponente = { tipos: ["Null"], baseStats: { atk: 180, def: 160, hp: 15000 } };
    
    if (oponenteInput && typeof oponenteInput === 'object') {
        oponente = {
            nome: oponenteInput.nome || "Custom",
            tipos: oponenteInput.tipos || ["Null"],
            // Garante o padrão 160 se vier vazio
            baseStats: oponenteInput.baseStats || { atk: 180, def: 160, hp: 15000 }
        };
    }
    
    console.log(`🛡️ VS Defensor: ${oponente.nome} [${oponente.tipos.join(", ")}] | HP: ${oponente.baseStats.hp}`);

    // 2. ATACANTE (Você - Nível 50)
    const CPM = 0.8403;
    const atkUser = ((pokemon.baseStats.atk || 10) + 15) * CPM;
    const defUser = ((pokemon.baseStats.def || 10) + 15) * CPM;
    const hpUser  = Math.floor(((pokemon.baseStats.hp || 10) + 15) * CPM);

    // Bônus
    const isShadow = pokemon.speciesName.toLowerCase().includes("shadow");
    const isMega = pokemon.speciesName.toLowerCase().startsWith("mega ");
    
    const bonusShadowAtk = isShadow ? 1.2 : 1.0;
    const atkFinalUser = atkUser * bonusShadowAtk;

    // Bônus Extra (Mega)
    let damageBonusMult = 1.0;
    if (isMega) damageBonusMult *= 1.1;

    // Defesa do Defensor
    const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM);
    const defUserFinal = isShadow ? (defUser * 0.833) : defUser;
    
    const razaoDano = atkFinalUser / defInimigoReal;

    // Estimativa de Dano Recebido (Defensor de Ginásio ataca mais lento que PvP)
    // Usamos uma média para calcular quanto tempo você sobrevive
    const danoRecebidoPorSegundo = (160 * (oponente.baseStats.atk / Math.max(1, defUserFinal))) / 20.0; 
    const tempoDeVida = hpUser / Math.max(0.1, danoRecebidoPorSegundo); 

    const combos = [];
    const fastMoves = pokemon.fastMoves || [];
    const chargedMoves = pokemon.chargedMoves || [];

    // --- BUSCA DE GOLPES (Prioridade: Mapas de Ginásio) ---
    const getMoveData = (id, isFast) => {
        let move = null;
        let source = "N/A";
        
        if (typeof GLOBAL_POKE_DB !== 'undefined' && GLOBAL_POKE_DB) {
            const map = isFast ? GLOBAL_POKE_DB.gymFastMap : GLOBAL_POKE_DB.gymChargedMap;
            if (map) {
                move = map.get(id); 
                if (!move && !id.endsWith("_FAST")) move = map.get(id + "_FAST");
                if (!move && id.endsWith("_FAST")) move = map.get(id.replace("_FAST", ""));
                if (move) source = "GYM";
            }
        }
        // Fallback apenas se não achar no mapa de ginásio
        if (!move && typeof window.GLOBAL_MOVES_DB !== 'undefined') {
            move = window.GLOBAL_MOVES_DB.find(m => m.moveId === id);
            source = "GENERIC";
        }
        return { move, source };
    };

    fastMoves.forEach(fastId => {
        const fData = getMoveData(fastId, true);
        const fastMove = fData.move;
        if (!fastMove) return;

        chargedMoves.forEach(chargedId => {
            const cData = getMoveData(chargedId, false);
            const chargedMove = cData.move;
            if (!chargedMove) return;

            // Log para debug (apenas combo principal)
            const isTarget = (fastMove.name === "Vine Whip" || fastMove.name === "Razor Leaf") && chargedMove.name === "Frenzy Plant";
            if (isTarget) {
                console.log(`⚡ ${fastMove.name}+${chargedMove.name} | Poder Base: ${fastMove.power}/${chargedMove.power}`);
            }

            // A) Multiplicadores
            const getMult = (moveType) => {
                let m = 1.0;
                // STAB
                if (pokemon.types.some(t => t.toLowerCase() === moveType.toLowerCase())) m *= 1.2;
                
                // Eficácia
                let ef = 1.0;
                if (!oponente.tipos.includes("Null") && typeof GLOBAL_POKE_DB !== 'undefined' && GLOBAL_POKE_DB.dadosEficacia) {
                    const tiposOp = Array.isArray(oponente.tipos) ? oponente.tipos : [oponente.tipos];
                    if (typeof getTypeEffectiveness === "function") {
                        ef = getTypeEffectiveness(moveType, tiposOp, GLOBAL_POKE_DB.dadosEficacia);
                        m *= ef;
                    }
                }
                return { total: m, ef };
            };

            const mFast = getMult(fastMove.type);
            const mCharged = getMult(chargedMove.type);

            if (isTarget) console.log(`   ✖️ Eficácia: ${mFast.ef}x`);

            // B) Dano Real (Fórmula PvE 0.5)
            const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDano * mFast.total * damageBonusMult) + 1;
            const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDano * mCharged.total * damageBonusMult) + 1;

            // C) Tempo
            let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown / 1000) || 1.0;
            if (tFast > 10) tFast = tFast / 1000; 
            if (tFast < 0.1) tFast = 0.5;

            let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown / 1000) || 2.0;
            if (tCharged > 10) tCharged = tCharged / 1000;
            if (tCharged < 0.1) tCharged = 2.0;

            // D) Energia
            const enGain = Math.max(1, (fastMove.energy || fastMove.energyGain || 6));
            const enCost = Math.abs(chargedMove.energy || 50);

            // E) Ciclo DPS
            const numFastNeeded = Math.ceil(enCost / enGain);
            const totalDmgCycle = (dmgFast * numFastNeeded) + dmgCharged;
            const totalTimeCycle = (tFast * numFastNeeded) + tCharged;

            const dpsCombo = totalDmgCycle / totalTimeCycle;
            
            // TDO em Ginásio: Quanto dano causo antes de morrer?
            const tdo = dpsCombo * tempoDeVida;

            // Critério visual (16 é um bom DPS em PvE)
            const vitoria = dpsCombo > 16; 

            combos.push({
                fast: fastMove,
                charged: chargedMove,
                dps: isNaN(dpsCombo) ? 0 : dpsCombo,
                tdo: isNaN(tdo) ? 0 : tdo,
                win: vitoria
            });
        });
    });

    console.groupEnd();
    return combos.sort((a, b) => b.dps - a.dps);
}

// =============================================================
//  ATUALIZADOR DA UI (Com Paginação Integrada)
// =============================================================
window.atualizarSimulacaoUI = function(valorInput) {
    if (typeof pokemonParaSimulacao === 'undefined') return;

    // Se o elemento não existir ainda (pagina carregando), sai
    if (!document.getElementById('lista-melhores-combos')) return;

    const valor = valorInput ? valorInput.trim() : "Null";
    let oponenteConfigurado = null;

    // ... (Lógica de identificar o oponente igual ao anterior) ...
    const tiposPtParaIngles = Object.entries(TYPE_TRANSLATION_MAP).reduce((acc, [key, val]) => {
        acc[val.toLowerCase()] = key; 
        return acc;
    }, {});
    const tipoIngles = tiposPtParaIngles[valor.toLowerCase()];
    
    if (valor === "Null" || valor.includes("Neutro") || valor === "") {
        oponenteConfigurado = "Null"; 
    } else if (tipoIngles) {
        const tipoFormatado = tipoIngles.charAt(0).toUpperCase() + tipoIngles.slice(1);
        oponenteConfigurado = { 
            nome: `Tipo ${valor}`,
            tipos: [valor], 
            baseStats: { atk: 180, def: 200, hp: 15000 } 
        };
    } else {
        const pokemonEncontrado = GLOBAL_POKE_DB.pokemonsByNameMap.get(valor.toLowerCase());
        if (pokemonEncontrado) {
            oponenteConfigurado = {
                nome: pokemonEncontrado.nomeParaExibicao,
                tipos: pokemonEncontrado.types, 
                baseStats: pokemonEncontrado.baseStats 
            };
        }
    }

    if (!oponenteConfigurado) {
        oponenteConfigurado = { tipos: ["Null"], baseStats: { atk: 180, def: 200, hp: 15000 } };
    }

    // 1. CALCULA A LISTA COMPLETA
    const listaCombos = calcularMelhoresCombos(pokemonParaSimulacao, oponenteConfigurado);

    // 2. MANDA PARA A PAGINAÇÃO (Em vez de desenhar manualmente aqui)
    if (typeof iniciarPaginacao === "function") {
        iniciarPaginacao(listaCombos);
    } else {
        console.error("Função iniciarPaginacao não encontrada!");
    }
};

  const renderPage = () => {
    const pokemon = allForms[currentFormIndex];
    localStorage.setItem("lastViewedPokemonDex", pokemon.dex);

    const {
      dex,
      nomeParaExibicao,
      types,
      baseStats,
      fastMoves,
      chargedMoves,
      speciesName,
    } = pokemon;

    const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);
    const isShadow = speciesName && speciesName.toLowerCase().includes("(shadow)");

    // Ranks
    const cpRankNum = GLOBAL_POKE_DB.cpRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const atkRankNum = GLOBAL_POKE_DB.atkRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const defRankNum = GLOBAL_POKE_DB.defRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const hpRankNum = GLOBAL_POKE_DB.hpRankList.findIndex(p => p.speciesId === pokemon.speciesId);
    const cpRank = cpRankNum === -1 ? "N/A" : cpRankNum + 1;
    const atkRank = atkRankNum === -1 ? "N/A" : atkRankNum + 1;
    const defRank = defRankNum === -1 ? "N/A" : defRankNum + 1;
    const hpRank = hpRankNum === -1 ? "N/A" : hpRankNum + 1;

    const normalSrc = pokemon.imgNormal || pokemon.imgNormalFallback;
    const shinySrc = pokemon.imgShiny || pokemon.imgShinyFallback;
    let isCurrentlyShiny = false;

    // --- HTML DOS TIPOS ---
    const tiposHTML = types
      .filter((t) => t && t.toLowerCase() !== "none")
      .map((tipo) => {
        const englishType = tipo.toLowerCase();
        const portugueseType = TYPE_TRANSLATION_MAP[englishType] || tipo;
        const color = getTypeColor(englishType);
        const icon = getTypeIcon(englishType);
        return `<span class="pokedex-tipo-badge" style="background-color: ${color};">
                  <img src="${icon}" alt="${portugueseType}" class="pokedex-tipo-icon">
                  ${portugueseType}
                </span>`;
      })
      .join("");

    // =================================================================================
    // 1. GERADOR DE HTML PARA GINÁSIO / REIDE (PVE) - AJUSTADO (SEM DPS NO CARREGADO)
    // =================================================================================
    const criarHtmlDoMovimentoGYM = (moveId, isFast) => {
      const moveKey = moveId.replace(/_FAST$/, "");
      const map = isFast ? GLOBAL_POKE_DB.gymFastMap : GLOBAL_POKE_DB.gymChargedMap;
      if (!map) return "";

      const moveData = map.get(moveKey);
      
      let styleAttribute = "";
      let textColor = "#FFF";
      let moveType = "normal"; 
      
      if (moveData && moveData.type) {
        moveType = moveData.type.toLowerCase();
        const color = getTypeColor(moveType);
        const isLight = isColorLight(color);
        textColor = isLight ? "#222" : "#FFF";
        styleAttribute = `style="background-color: ${color}; color: ${textColor}; border-left-color: ${color}CC;"`;
      }

      const formattedKey = moveKey.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      const translatedName = GLOBAL_POKE_DB.moveTranslations[formattedKey] || (moveData ? moveData.name : formattedKey);

      let statsHtml = "";
      if (moveData) {
          const power = moveData.power || 0;
          let durationVal = moveData.duration;
          if (durationVal > 100) durationVal = durationVal / 1000; 
          
          const durationNum = durationVal > 0 ? durationVal : 1; 
          const duration = durationNum.toFixed(1); 
          
          if (isFast) {
              // --- ATAQUE RÁPIDO (DPS e EPS) ---
              const energy = moveData.energy || 0;
              const dps = (power / durationNum).toFixed(1);
              const eps = (energy / durationNum).toFixed(1);

              statsHtml = `<div class="move-stats-container">
                             <span class="move-stat" style="color: ${textColor};">Dano: ${power}</span>
                             <span class="move-stat" style="color: ${textColor};">Energia: ${energy}</span>
                             <span class="move-stat" style="color: ${textColor};">Cooldown: ${duration}s</span>
                             <span class="move-stat" style="color: ${textColor}; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 8px;">DPS: ${dps}</span>
                             <span class="move-stat" style="color: ${textColor};">EPS: ${eps}</span>
                           </div>`;
          } else {
              // --- ATAQUE CARREGADO (Apenas DPE, sem DPS) ---
              const energy = Math.abs(moveData.energy || 0);
              // DPE = Dano / Energia (Eficiência)
              const dpe = energy > 0 ? (power / energy).toFixed(2) : "0";

              statsHtml = `<div class="move-stats-container">
                             <span class="move-stat" style="color: ${textColor};">Dano: ${power}</span>
                             <span class="move-stat" style="color: ${textColor};">Custo: ${energy}</span>
                             <span class="move-stat" style="color: ${textColor};">Cooldown: ${duration}s</span>
                             <span class="move-stat" style="color: ${textColor}; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 8px;">DPE: ${dpe}</span>
                           </div>`;
          }
      } else {
          statsHtml = `<div class="move-stats-container"><span class="move-stat">Dados não disp.</span></div>`;
      }

      return `<li ${styleAttribute}>
                <div class="move-header">
                    <img src="${getTypeIcon(moveType)}" alt="${moveType}" class="move-type-icon">
                    <span class="move-name" style="color: ${textColor};">${translatedName}</span>
                </div>
                ${statsHtml}
              </li>`;
    };

    // Gera as listas de HTML para PVE
    const gymFastHtml = fastMoves.map(m => criarHtmlDoMovimentoGYM(m, true)).join("");
    const gymChargedHtml = chargedMoves.map(m => criarHtmlDoMovimentoGYM(m, false)).join("");


    // =================================================================================
    // 2. GERADOR DE HTML PARA PVP - COMPLETO (DPT, EPT + DPS REFERÊNCIA)
    // =================================================================================
    const criarHtmlDoMovimentoPVP = (moveId) => {
      const moveKey = moveId.replace(/_FAST$/, "");
      const moveData = GLOBAL_POKE_DB.moveDataMap.get(moveKey);
      
      const moveType = moveData?.type;
      const power = moveData?.power || 0;
      const energyGain = moveData?.energyGain || 0;
      const energy = moveData?.energy || 0;
      const cooldownMs = moveData?.cooldown || 0; 
      
      let styleAttribute = "";
      let textColor = "#FFF";
      if (moveType) {
        const color = getTypeColor(moveType);
        const isLight = isColorLight(color);
        textColor = isLight ? "#222" : "#FFF";
        styleAttribute = `style="background-color: ${color}; color: ${textColor}; border-left-color: ${color}CC;"`;
      }
      
      const formattedKey = moveKey.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      const translatedName = GLOBAL_POKE_DB.moveTranslations[formattedKey] || formattedKey;
      
      let statsHtml = "";
      
      // --- ATAQUE RÁPIDO (DPT, EPT e DPS) ---
      if (energyGain > 0) {
        const turns = cooldownMs > 0 ? cooldownMs / 500 : 1; 
        const cooldownSec = (cooldownMs / 1000).toFixed(1);
        
        // Métricas de Turno (Padrão Competitivo)
        const dpt = (power / turns).toFixed(2);
        const ept = (energyGain / turns).toFixed(2);
        
        // Métrica de Tempo (Padrão Casual/Referência)
        // Dano / Segundos reais
        const dps = (power / parseFloat(cooldownSec)).toFixed(2);

        statsHtml = `<div class="move-stats-container">
                       <span class="move-stat" style="color: ${textColor};">Dano: ${power}</span>
                       <span class="move-stat" style="color: ${textColor};">Energia: ${energyGain}</span>
                       <span class="move-stat" style="color: ${textColor};">Turnos: ${turns} (${cooldownSec}s)</span>
                       <span class="move-stat" style="color: ${textColor}; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 8px;">DPT: ${dpt}</span>
                       <span class="move-stat" style="color: ${textColor};">EPT: ${ept}</span>
                       <span class="move-stat" style="color: ${textColor}; opacity: 0.8; font-size: 0.9em;">(DPS: ${dps})</span>
                     </div>`;
      
      // --- ATAQUE CARREGADO (DPE) ---
      } else if (energy !== 0) {
        const energyCost = Math.abs(energy);
        const dpe = energyCost > 0 ? (power / energyCost).toFixed(2) : "0";
        
        statsHtml = `<div class="move-stats-container">
                       <span class="move-stat" style="color: ${textColor};">Dano: ${power}</span>
                       <span class="move-stat" style="color: ${textColor};">Custo: ${energyCost}</span>
                       <span class="move-stat" style="color: ${textColor}; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 8px;">DPE: ${dpe}</span>
                     </div>`;
      } else {
        statsHtml = `<div class="move-stats-container"><span class="move-stat" style="color: ${textColor};">Dano: ${power}</span></div>`;
      }
      
      return `<li ${styleAttribute}>
                <div class="move-header">
                    <img src="${getTypeIcon(moveType)}" alt="${moveType}" class="move-type-icon">
                    <span class="move-name" style="color: ${textColor};">${translatedName}</span>
                </div>
                ${statsHtml}
              </li>`;
    };
    
    // Gera as listas de HTML para PVP
    const pvpFastHtml = fastMoves.map(criarHtmlDoMovimentoPVP).join("");
    const pvpChargedHtml = chargedMoves.map(criarHtmlDoMovimentoPVP).join("");

    // --- TABELA DE CP ---
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

    // --- DROPDOWN ---
    let formDropdownHTML = '<div class="form-dropdown">';
    formDropdownHTML += `<div class="form-dropdown-selected" tabindex="0"><img src="${
      pokemon.imgNormal || pokemon.imgNormalFallback
    }" alt="${nomeParaExibicao}"><span>${nomeParaExibicao}</span><i class="arrow down"></i></div>`;
    formDropdownHTML += '<div class="form-dropdown-list">';
    const filteredDropdownForms = allForms.filter(
      (form) => form && form.speciesName && !form.speciesName.startsWith("Mega ")
    );
    filteredDropdownForms.forEach((form) => {
      const originalIndex = allForms.findIndex(
        (p) => p.speciesId === form.speciesId
      );
      formDropdownHTML += `<div class="form-dropdown-item" data-index="${originalIndex}"><img src="${
        form.imgNormal || form.imgNormalFallback
      }" alt="${form.nomeParaExibicao}"><span>${
        form.nomeParaExibicao
      }</span></div>`;
    });
    formDropdownHTML += "</div></div>";

    // --- NAVEGAÇÃO ---
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

      // Usamos .dadosEficacia porque é onde salvamos o json novo
      const htmlDefesa = gerarHtmlFraquezas(pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

      // =================================================================
    // 3. SIMULAÇÃO DE COMBOS PVE (Com Busca de Pokémon/Tipo)
    // =================================================================
    
    // Salva o pokemon atual numa variavel global para a função de update usar
    window.pokemonParaSimulacao = pokemon; 

    // 1. Gera as opções do Datalist (Tipos + Pokémons Populares)
    const listaTiposBasicos = ["Normal", "Fogo", "Água", "Planta", "Elétrico", "Gelo", "Lutador", "Venenoso", "Terrestre", "Voador", "Psíquico", "Inseto", "Pedra", "Fantasma", "Dragão", "Sombrio", "Aço", "Fada"];
    let datalistHTML = `<option value="Null">Neutro (Padrão)</option>`;
    
    // Adiciona Tipos
    listaTiposBasicos.forEach(t => {
        datalistHTML += `<option value="${t}">Tipo Genérico</option>`;
    });

    // Adiciona Pokémons (Limitado a 500 para não travar, ou use lógica de busca dinâmica)
    if (GLOBAL_POKE_DB.pokemonsByNameMap) {
        let contador = 0;
        for (const [key, val] of GLOBAL_POKE_DB.pokemonsByNameMap) {
            // Filtra formas muito específicas para limpar a lista
            if (!val.speciesName.includes("Shadow") && !val.speciesName.includes("Purified")) {
                 // Formata o nome bonito
                 const nomeBonito = formatarNomeParaExibicao(val.speciesName);
                 datalistHTML += `<option value="${nomeBonito}">Pokémon</option>`;
                 contador++;
            }
            if (contador > 500) break; // Limite de segurança
        }
    }

    // 2. Calcula inicial (Neutro)

// 4. Painel com INPUT de Busca e PAGINAÇÃO
    const painelSimulacaoHTML = `
        <div class="simulacao-box">
            <div class="simulacao-header">
                <h4>⚔️ Melhores Combos (DPS)</h4>
                
                <div style="position: relative;">
                    <input 
                        list="oponentes-list" 
                        class="opponent-selector" 
                        placeholder="Escolha o Inimigo..." 
                        oninput="window.atualizarSimulacaoUI(this.value)" 
                        onchange="window.atualizarSimulacaoUI(this.value)"
                        onfocus="this.value=''" 
                        style="width: 150px; border:none; outline:none; color: #fff; text-align: right;"
                    >
                    <datalist id="oponentes-list">
                        ${datalistHTML}
                    </datalist>
                </div>
            </div>

            <div id="lista-melhores-combos" class="combos-list" style="min-height: 50px;">
                </div>

            <div class="pagination-container">
                <span id="info-paginacao"></span>
                <div id="controles-paginacao"></div>
            </div>
        </div>
    `;

    // --- HTML FINAL DO CARD (COM BUSCA NOVA) ---
    const finalHTML = `
            <div class="pokedex-card-detalhes">
                <div class="detalhes-navegacao">${prevButtonHTML}${nextButtonHTML}</div>
                
                <div class="quick-search-wrapper">
                    <input type="text" id="quick-search-input" placeholder="🔍 Ir para outro Pokémon..." autocomplete="off">
                    <div id="quick-search-results" class="quick-search-results"></div>
                </div>
                ${formDropdownHTML}
                <div class="imagem-container pokemon-image-container ${
                  isShadow ? "is-shadow" : ""
                }"><img src="${normalSrc}" alt="${nomeParaExibicao}"></div>
                
                <div class="shiny-toggle-container" ${
                  !shinySrc ? 'style="display: none;"' : ""
                }>
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

                ${htmlDefesa}

                <div class="secao-detalhes">
                    <h3>Movimentos de Ginásio & Reides</h3>
                    <div class="ataques-grid">
                        <div><h4>Ataques Rápidos</h4><ul>${gymFastHtml}</ul></div>
                        <div><h4>Ataques Carregados</h4><ul>${gymChargedHtml}</ul></div>
                    </div>
                </div>

                <div class="secao-detalhes">
                    ${typeof painelSimulacaoHTML !== 'undefined' ? painelSimulacaoHTML : ''}
                </div>
                
                <div class="secao-detalhes">
                    <h3>Movimentos PVP</h3>
                    <div class="ataques-grid">
                        <div><h4>Ataques Rápidos</h4><ul>${pvpFastHtml}</ul></div>
                        <div><h4>Ataques Carregados</h4><ul>${pvpChargedHtml}</ul></div>
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
    const quickInput = document.getElementById("quick-search-input");
    const quickResults = document.getElementById("quick-search-results");

    if (quickInput) {
        // Evento de digitação
        quickInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            quickResults.innerHTML = "";
            
            if (term.length < 2) {
                quickResults.style.display = "none";
                return;
            }

            // Filtra da lista global (exclui Megas e Shadows para não poluir)
            const filtered = allPokemonDataForList.filter(p => 
                (p.nomeParaExibicao.toLowerCase().includes(term) || String(p.dex).includes(term)) &&
                !p.speciesName.startsWith("Mega ") && 
                !p.speciesName.includes("Shadow")
            ).slice(0, 6); // Mostra só 6 resultados

            if (filtered.length > 0) {
                quickResults.style.display = "block";
                filtered.forEach(p => {
                    const div = document.createElement("div");
                    div.className = "quick-result-item";
                    div.innerHTML = `
                        <img src="${p.imgNormal || p.imgNormalFallback}" alt="${p.nomeParaExibicao}">
                        <span>#${p.dex} - ${p.nomeParaExibicao}</span>
                    `;
                    // Ao clicar, vai para o Pokémon
                    div.addEventListener("click", () => {
                        let baseId = p.speciesId.replace("-", "_").split("_")[0];
                        // Exceções de sempre
                        if (["nidoran", "meowstic", "indeedee", "basculegion", "oinkologne", "tapu"].includes(baseId)) {
                             baseId = p.speciesId;
                        }
                        showPokemonDetails(baseId, null, p.speciesId);
                    });
                    quickResults.appendChild(div);
                });
            } else {
                quickResults.style.display = "none";
            }
        });

        // Fechar se clicar fora
        document.addEventListener("click", (e) => {
            if (!quickInput.contains(e.target) && !quickResults.contains(e.target)) {
                quickResults.style.display = "none";
            }
        });
    }
    // ▲▲▲ FIM DA LÓGICA DA BUSCA ▲▲▲

    setTimeout(() => {
        if (typeof window.atualizarSimulacaoUI === "function") {
            window.atualizarSimulacaoUI("Null");
        }
    }, 50);

    // Eventos de clique (Navegação, Dropdown, ShowMore, Shiny)
    // (Mantive igual ao seu código original para economizar espaço visual, 
    //  mas se precisar eu copio eles aqui de novo)
    
    document.getElementById("prev-pokemon")?.addEventListener("click", () => {
      let prevBaseId = prevPokemon.speciesId.replace("-", "_").split("_")[0];
      const prevFullId = prevPokemon.speciesId;
      if (prevBaseId === "nidoran" || prevBaseId === "meowstic" || prevBaseId === "indeedee" || prevBaseId === "basculegion" || prevBaseId === "oinkologne" || prevBaseId === "tapu") {
        prevBaseId = prevFullId;
      }
      showPokemonDetails(prevBaseId, navigationList, prevFullId);
    });

    document.getElementById("next-pokemon")?.addEventListener("click", () => {
      let nextBaseId = nextPokemon.speciesId.replace("-", "_").split("_")[0];
      const nextFullId = nextPokemon.speciesId;
      if (nextBaseId === "nidoran" || nextBaseId === "meowstic" || nextBaseId === "indeedee" || nextBaseId === "basculegion" || nextBaseId === "oinkologne" || nextBaseId === "tapu") {
        nextBaseId = nextFullId;
      }
      showPokemonDetails(nextBaseId, navigationList, nextFullId);
    });

    const dropdown = document.querySelector(".form-dropdown");
    dropdown.querySelector(".form-dropdown-selected").addEventListener("click", () => {
        dropdown.querySelector(".form-dropdown-list").classList.toggle("show");
        dropdown.querySelector(".arrow").classList.toggle("up");
    });
    dropdown.querySelectorAll(".form-dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        currentFormIndex = parseInt(item.dataset.index, 10);
        renderPage();
      });
    });
    
    // Seed para o dropdown
    const dropdownImgs = datadexContent.querySelectorAll(".form-dropdown-item img, .form-dropdown-selected img");
    dropdownImgs.forEach(img => {
        if(img.parentElement.classList.contains("form-dropdown-selected")) {
             attachImageFallbackHandler(img, pokemon);
        } else if(img.parentElement.classList.contains("form-dropdown-item")) {
             const index = img.parentElement.dataset.index;
             const formPokemon = allForms[index];
             if(formPokemon) attachImageFallbackHandler(img, formPokemon);
        }
    });

    const showMoreButton = document.getElementById("show-more-cp");
    showMoreButton?.addEventListener("click", () => {
      const hiddenRows = document.getElementById("hidden-cp-rows");
      const visibleRows = document.getElementById("visible-cp-grid");
      const isShowingMore = hiddenRows.classList.toggle("show");
      visibleRows.classList.toggle("hidden", isShowingMore);
      showMoreButton.textContent = isShowingMore ? "Mostrar menos" : "Mostrar mais...";
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
      Array.from(GLOBAL_POKE_DB.pokemonsByNameMap.values()).map(async (p) => {
        const pokemon = await buscarDadosCompletosPokemon(
          p.speciesName,
          GLOBAL_POKE_DB
        );
        if (pokemon && pokemon.baseStats) {
          pokemon.maxCP = calculateCP(
            pokemon.baseStats,
            { atk: 15, def: 15, hp: 15 },
            50
          );
        } else if (pokemon) {
          pokemon.maxCP = 0;
        }
        return pokemon;
      })
    );

    // =============================================================
    //          ▼▼▼ MUDANÇA IMPORTANTE AQUI ▼▼▼
    // Removemos o filtro de Mega e Dinamax da lista principal
    // =============================================================
    allPokemonDataForList = mappedList
      .filter((p) => p !== null) // Apenas filtramos os nulos
      .sort((a, b) => a.dex - b.dex);
    // =============================================================

    console.log("Calculando listas de rank...");
    GLOBAL_POKE_DB.cpRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.maxCP || 0) - (a.maxCP || 0)
    );
    GLOBAL_POKE_DB.atkRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.baseStats?.atk || 0) - (a.baseStats?.atk || 0)
    );
    GLOBAL_POKE_DB.defRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.baseStats?.def || 0) - (a.baseStats?.def || 0)
    );
    GLOBAL_POKE_DB.hpRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.baseStats?.hp || 0) - (a.baseStats?.hp || 0)
    );
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

// =============================================================
//  FUNÇÃO DE CÁLCULO DE EFICÁCIA (VERSÃO BLINDADA)
// =============================================================
function getTypeEffectiveness(moveType, defenderTypes, typeData) {
    if (!moveType || !defenderTypes || !typeData) return 1.0;

    try {
        // Função auxiliar: Traduz e Capitaliza (ex: "water" -> "Água")
        const formatarTipo = (t) => {
            if (!t) return "";
            const tLower = t.toLowerCase().trim();
            
            // Dicionário Inglês/Pt-br -> Chave exata do JSON (Capitalizada)
            const dict = {
                "normal": "Normal", "fire": "Fogo", "water": "Água", "electric": "Elétrico",
                "grass": "Planta", "ice": "Gelo", "fighting": "Lutador", "poison": "Venenoso",
                "ground": "Terrestre", "flying": "Voador", "psychic": "Psíquico", "bug": "Inseto",
                "rock": "Pedra", "ghost": "Fantasma", "dragon": "Dragão", "steel": "Aço",
                "dark": "Sombrio", "fairy": "Fada",
                // Redundância para PT minúsculo
                "fogo": "Fogo", "água": "Água", "agua": "Água", "planta": "Planta",
                "elétrico": "Elétrico", "eletrico": "Elétrico"
            };

            // Retorna o valor do dicionário ou capitaliza a primeira letra
            return dict[tLower] || (tLower.charAt(0).toUpperCase() + tLower.slice(1));
        };

        // 1. Prepara Ataque
        const ataquePT = formatarTipo(moveType);

        // 2. Prepara Defensor (Remove 'none', traduz e ordena para bater com o JSON)
        const defensorPT = defenderTypes
            .filter(t => t && t.toLowerCase() !== "none")
            .map(t => formatarTipo(t))
            .sort();

        // 3. Busca no JSON
        // O JSON tem entradas como: { "tipos": ["Água", "Terrestre"] }
        const dadosMatch = typeData.find(entry => {
            if (!entry.tipos) return false;
            const jsonTipos = entry.tipos.slice().sort(); 
            return JSON.stringify(defensorPT) === JSON.stringify(jsonTipos);
        });

        // Se não achou a combinação no JSON, retorna neutro
        if (!dadosMatch || !dadosMatch.defesa) return 1.0;

        // 4. Verifica Multiplicadores
        const check = (categoria) => {
            if (!categoria) return null;
            for (const multKey in categoria) {
                // A lista no JSON é ["Planta", "Elétrico"]. Se "Planta" estiver lá, retorna o valor.
                if (categoria[multKey].includes(ataquePT)) {
                    return parseFloat(multKey.replace('x', ''));
                }
            }
            return null;
        };

        const fFraq = check(dadosMatch.defesa.fraqueza);
        if (fFraq !== null) return fFraq;

        const fRes = check(dadosMatch.defesa.resistencia);
        if (fRes !== null) return fRes;

        // Imunidade
        if (dadosMatch.defesa.imunidade && dadosMatch.defesa.imunidade.includes(ataquePT)) {
            return 0.390625;
        }

        return 1.0;

    } catch (erro) {
        console.error("Erro eficácia:", erro);
        return 1.0;
    }
}

// =============================================================
//  FUNÇÃO GERADORA DE HTML DE FRAQUEZAS/RESISTÊNCIAS
//  (Versão Específica para o seu JSON de Combinações)
// =============================================================
function gerarHtmlFraquezas(types, typeData) {
    if (!types || !typeData) return "";

    // 1. Traduz os tipos do Pokémon atual para Português (ex: ["Fire", "Flying"] -> ["Fogo", "Voador"])
    // E ordena para garantir que a busca funcione independente da ordem (Aço/Fada = Fada/Aço)
    const meusTiposPT = types.map(t => {
        const tLower = t.toLowerCase();
        // Garante a primeira letra maiúscula para bater com o JSON (ex: "fogo" -> "Fogo")
        let trad = TYPE_TRANSLATION_MAP[tLower] || t;
        return trad.charAt(0).toUpperCase() + trad.slice(1);
    }).sort();

    // 2. Procura no JSON a entrada que tem EXATAMENTE esses tipos
    const dadosDefesa = typeData.find(entry => {
        if (!entry.tipos) return false;
        const jsonTipos = entry.tipos.slice().sort(); // Copia e ordena
        
        // Compara se os arrays são iguais
        return JSON.stringify(meusTiposPT) === JSON.stringify(jsonTipos);
    });

    if (!dadosDefesa || !dadosDefesa.defesa) {
        console.warn("Combinação de defesa não encontrada no JSON para:", meusTiposPT);
        return ""; 
    }

    // 3. Função auxiliar para extrair dados do JSON e criar linhas
    const processarCategoria = (categoriaObj) => {
        if (!categoriaObj) return [];
        
        const listaFinal = [];
        
        // Itera sobre as chaves de multiplicador (ex: "1.6x", "2.56x")
        Object.keys(categoriaObj).forEach(multKey => {
            const multNum = parseFloat(multKey.replace('x', ''));
            const tiposDaCategoria = categoriaObj[multKey];
            
            if (tiposDaCategoria && tiposDaCategoria.length > 0) {
                listaFinal.push({
                    mult: multNum,
                    types: tiposDaCategoria
                });
            }
        });
        
        return listaFinal;
    };

    // Extrai Fraquezas e Resistências direto do objeto encontrado
    const weaknesses = processarCategoria(dadosDefesa.defesa.fraqueza);
    const resistances = processarCategoria(dadosDefesa.defesa.resistencia);
    
    // Adiciona Imunidades (se houver, no seu JSON parece estar vazio ou misturado em resistencia, 
    // mas vamos checar a chave "imunidade" por segurança)
    if (dadosDefesa.defesa.imunidade) {
        const imunes = dadosDefesa.defesa.imunidade;
        if (imunes.length > 0) {
             resistances.push({ mult: 0, types: imunes }); // 0x de dano
        }
    }

    // 4. Ordena: Maior dano primeiro nas fraquezas, Menor dano primeiro nas resistências
    weaknesses.sort((a, b) => b.mult - a.mult);
    resistances.sort((a, b) => a.mult - b.mult);

    // 5. Gera o HTML Visual
    const createRow = (item) => {
        let label = item.mult + "x";
        let classMult = "";

        // Define cores baseadas no valor exato do seu JSON
        if (item.mult >= 2.56) { label = "2.56x"; classMult = "mult-256"; }
        else if (item.mult >= 1.6) { label = "1.6x"; classMult = "mult-160"; }
        else if (item.mult <= 0.244) { label = "0.24x"; classMult = "mult-024"; } // Imunidade dupla
        else if (item.mult <= 0.391) { label = "0.39x"; classMult = "mult-039"; } // Resistência dupla
        else if (item.mult === 0) { label = "0x"; classMult = "mult-024"; }       // Imunidade total (msg)
        else { label = "0.63x"; classMult = "mult-062"; }                         // Resistência normal

        const badges = item.types.map(t => {
            const tLower = t.toLowerCase();
            const color = getTypeColor(tLower);
            const icon = getTypeIcon(tLower);
            
            return `<span class="pokedex-tipo-badge" style="background-color: ${color}; font-size: 0.8em; padding: 4px 10px;">
                        <img src="${icon}" alt="${t}" style="width: 15px; height: 15px;">
                        ${t}
                    </span>`;
        }).join("");

        return `<div class="defense-row">
                    <span class="multiplier-tag ${classMult}">${label}</span>
                    <div class="type-badges-container">${badges}</div>
                </div>`;
    };

    const weakHtml = weaknesses.length > 0 ? weaknesses.map(createRow).join("") : "<p style='text-align:center; opacity:0.6; font-size:0.9em;'>Sem fraquezas</p>";
    const resistHtml = resistances.length > 0 ? resistances.map(createRow).join("") : "<p style='text-align:center; opacity:0.6; font-size:0.9em;'>Sem resistências</p>";

    return `
    <div class="secao-detalhes defense-section">
        <h3>Resistências & Fraquezas</h3>
        <div class="defense-grid">
            <div class="defense-column">
                <h4>Fraquezas</h4>
                ${weakHtml}
            </div>
            <div class="defense-column">
                <h4>Resistências</h4>
                ${resistHtml}
            </div>
        </div>
    </div>`;
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
// =============================================================
//  FUNÇÕES DE INTERFACE (MENU MOBILE)
// =============================================================

// Função chamada pelo botão do menu no HTML
window.toggleHeader = function() {
    // Tenta encontrar o cabeçalho ou o menu de navegação
    const header = document.querySelector('header') || document.querySelector('.header');
    const nav = document.querySelector('nav') || document.querySelector('.nav-links');
    
    // Alterna a classe 'active' para mostrar/esconder
    if (header) {
        header.classList.toggle('active');
    }
    if (nav) {
        nav.classList.toggle('active');
    }
};

// =============================================================
//  SISTEMA DE PAGINAÇÃO DE COMBOS (MODO INTEGRADO)
// =============================================================

let estadoPaginacao = {
    todosCombos: [],
    paginaAtual: 1,
    itensPorPagina: 5
};

function iniciarPaginacao(listaCombos) {
    estadoPaginacao.todosCombos = listaCombos;
    estadoPaginacao.paginaAtual = 1;
    renderizarTabela();
    renderizarControles();
}

/**
 * Desenha apenas os cards da página atual (COM SISTEMA DE RANK S/A/B/C/D)
 */
function renderizarTabela() {
    const container = document.getElementById('lista-melhores-combos');
    if (!container) return;

    container.innerHTML = "";

    // 1. Pega o DPS Máximo (O primeiro da lista geral é sempre o maior)
    const maxDPS = estadoPaginacao.todosCombos.length > 0 ? estadoPaginacao.todosCombos[0].dps : 1;

    const inicio = (estadoPaginacao.paginaAtual - 1) * estadoPaginacao.itensPorPagina;
    const fim = inicio + estadoPaginacao.itensPorPagina;
    const combosDaPagina = estadoPaginacao.todosCombos.slice(inicio, fim);

    const htmlCards = combosDaPagina.map((c, index) => {
        const globalIndex = inicio + index;
        const isBest = globalIndex === 0 ? "best-combo" : "";
        
        // --- LÓGICA DE RANKING (S, A+, A, B, C, D) ---
        // Calcula a % de força comparada ao melhor golpe
        const forca = c.dps / maxDPS; 
        
        let rank = "D";
        let rankClass = "rank-d";

        if (forca >= 0.98) {
            rank = "S";
            rankClass = "rank-s";
        } else if (forca >= 0.90) {
            rank = "A+";
            rankClass = "rank-a-plus";
        } else if (forca >= 0.80) {
            rank = "A";
            rankClass = "rank-a";
        } else if (forca >= 0.65) {
            rank = "B";
            rankClass = "rank-b";
        } else if (forca >= 0.50) {
            rank = "C";
            rankClass = "rank-c";
        }

        const iconFast = getTypeIcon(c.fast.type);
        const iconCharged = getTypeIcon(c.charged.type);
        
        const fmt = (n) => {
            const raw = n.replace(/_FAST$/, "").replace(/_/g, " ").toLowerCase();
            return GLOBAL_POKE_DB.moveTranslations[raw] || raw.replace(/\b\w/g, l => l.toUpperCase());
        };
        const nomeFast = fmt(c.fast.name);
        const nomeCharged = fmt(c.charged.name);

        return `
        <div class="combo-row ${isBest} fade-in">
            <div class="combo-moves">
                <img src="${iconFast}" class="combo-move-type"> <span>${nomeFast}</span>
                <span class="combo-arrow">+</span>
                <img src="${iconCharged}" class="combo-move-type"> <span>${nomeCharged}</span>
            </div>
            <div class="combo-stats">
                <span>DPS: <span class="dps-val">${c.dps.toFixed(1)}</span></span>
                <span>TDO: <span class="tdo-val">${Math.round(c.tdo)}</span></span>
                <span class="result-tag ${rankClass}">${rank}</span>
            </div>
        </div>`;
    }).join("");

    container.innerHTML = htmlCards;

    const infoTexto = document.getElementById('info-paginacao');
    if (infoTexto) {
        infoTexto.innerText = `Mostrando ${inicio + 1}-${Math.min(fim, estadoPaginacao.todosCombos.length)} de ${estadoPaginacao.todosCombos.length}`;
    }
}

function renderizarControles() {
    const containerControles = document.getElementById('controles-paginacao');
    if (!containerControles) return;

    containerControles.innerHTML = "";

    // Dropdown
    const divQtd = document.createElement('div');
    divQtd.className = "items-per-page";
    // Estilo inline para garantir visibilidade se o CSS falhar
    divQtd.style.display = "flex"; 
    divQtd.style.alignItems = "center";
    divQtd.style.gap = "5px";
    divQtd.style.color = "#333";

    divQtd.innerHTML = `
        <label style="font-size:0.9em;">Exibir:</label>
        <select id="select-qtd" style="padding: 5px; border-radius: 4px; color:#000;">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
        </select>
    `;
    containerControles.appendChild(divQtd);

    const select = divQtd.querySelector('select');
    select.value = estadoPaginacao.itensPorPagina;
    select.addEventListener('change', (e) => {
        estadoPaginacao.itensPorPagina = parseInt(e.target.value);
        estadoPaginacao.paginaAtual = 1;
        renderizarTabela();
        renderizarControles();
    });

    // Botões
    const divBotoes = document.createElement('div');
    divBotoes.className = "pagination-controls";
    divBotoes.style.display = "flex";
    divBotoes.style.gap = "5px";

    const totalPaginas = Math.ceil(estadoPaginacao.todosCombos.length / estadoPaginacao.itensPorPagina);
    
    const criarBotao = (texto, pagDestino, disabled = false, active = false) => {
        const btn = document.createElement('button');
        btn.innerText = texto;
        // Classes simples para facilitar a estilização
        btn.className = `page-btn ${active ? 'active' : ''}`;
        // Estilos inline básicos para garantir que apareça bonito
        btn.style.padding = "5px 10px";
        btn.style.cursor = "pointer";
        btn.style.border = "1px solid #ccc";
        btn.style.borderRadius = "4px";
        btn.style.backgroundColor = active ? "#2ecc71" : "#fff";
        btn.style.color = active ? "#fff" : "#333";

        btn.disabled = disabled;
        if(disabled) btn.style.opacity = "0.5";

        btn.onclick = () => {
            estadoPaginacao.paginaAtual = pagDestino;
            renderizarTabela();
            renderizarControles();
        };
        divBotoes.appendChild(btn);
    };

    criarBotao("«", estadoPaginacao.paginaAtual - 1, estadoPaginacao.paginaAtual === 1);

    let pagsParaMostrar = [];
    if (totalPaginas <= 5) {
        pagsParaMostrar = Array.from({length: totalPaginas}, (_, i) => i + 1);
    } else {
        if (estadoPaginacao.paginaAtual <= 3) {
            pagsParaMostrar = [1, 2, 3, 4, "...", totalPaginas];
        } else if (estadoPaginacao.paginaAtual >= totalPaginas - 2) {
            pagsParaMostrar = [1, "...", totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
        } else {
            pagsParaMostrar = [1, "...", estadoPaginacao.paginaAtual - 1, estadoPaginacao.paginaAtual, estadoPaginacao.paginaAtual + 1, "...", totalPaginas];
        }
    }

    pagsParaMostrar.forEach(p => {
        if (p === "...") {
            const span = document.createElement('span');
            span.innerText = "...";
            span.style.padding = "5px";
            span.style.color = "#333";
            divBotoes.appendChild(span);
        } else {
            criarBotao(p, p, false, p === estadoPaginacao.paginaAtual);
        }
    });

    criarBotao("»", estadoPaginacao.paginaAtual + 1, estadoPaginacao.paginaAtual === totalPaginas);
    containerControles.appendChild(divBotoes);
}