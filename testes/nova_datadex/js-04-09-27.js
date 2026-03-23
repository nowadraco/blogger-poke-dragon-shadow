// =============================================================
//  SCRIPT POKÉMON UNIFICADO com datadex 17/12/2025)
// =============================================================

// =============================================================
//  0. CONTROLE DE VERSÃO E CACHE (SISTEMA MESTRE)
// =============================================================
// Mude este valor sempre que quiser obrigar o usuário a baixar tudo de novo
const VERSAO_ATUAL = "2025.12.16-v4";

function gerenciarCacheLocal() {
  const versaoSalva = localStorage.getItem("pokedragon_versao");

  if (versaoSalva !== VERSAO_ATUAL) {
    console.log(
      `🚀 Nova versão detectada: ${VERSAO_ATUAL}. Limpando dados antigos...`,
    );

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
  MAIN_DATA: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data.json",
  ),

  MAIN_DATA_FALLBACK: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@f704cfb1038e72cfff7d5b1b29799042eff00d2b/json/poke_data.json",
  ),

  MEGA_DATA: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/mega_reides.json",
  ),

  GIGAMAX_DATA: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data_gigamax.json",
  ),

  IMAGES_PRIMARY: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/imagens_pokemon.json",
  ),

  IMAGES_SEED: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@da740ce8daf7b85137c01faa8b1a1dbe72052f95/json/imagens_pokemon.json",
  ),

  IMAGES_ALT: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/imagens_pokemon_alt.json",
  ),

  TYPE_DATA: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/bloggerpoke@main/src/data/gamemaster/tipos_poke.json",
  ),

  TYPE_EFFECTIVENESS: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/eficacia_tipos_poke.json",
  ),

  MOVE_TRANSLATIONS: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_portugues.json",
  ),

  MOVE_DATA: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/moves.json",
  ),

  MOVES_GYM_FAST: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_rapidos_gym.json",
  ),

  MOVES_GYM_CHARGED: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_carregados_gym.json",
  ),

  CURRENT_RAID_BOSSES: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/dados_pogo/json/dados_pogo/raid_bosses/raid_bosses.json?t=" + new Date().getTime(),

  CANDY_COLORS: addVer(
    "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/dados_pogo/doces_colorir/PokemonCandyColorData.json"
  ),
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

const RAID_BOSS_HP = {
  1: 600,
  3: 3600,
  mega: 9000,
  5: 15000,
  elite: 20000,
};

// --- 2. VARIÁVEIS GLOBAIS DE ESTADO ---

let GLOBAL_POKE_DB = null;

let allPokemonDataForList = [];
let currentPokemonList = [];
let topControls = null;
let datadexContent = null;

window.currentWeather = "Extreme";

// --- 3. FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO E CÁLCULO ---

// =============================================================
//  LÓGICA DE CLIMA (WEATHER BOOST) - GLOBAL
// =============================================================
const CLIMA_BOOSTS = {
  Extreme: [],
  ensolarado: ["grass", "fire", "ground"],
  chovendo: ["water", "electric", "bug"],
  parcialmente_nublado: ["normal", "rock"],
  nublado: ["fairy", "fighting", "poison"],
  ventando: ["flying", "dragon", "psychic"],
  nevando: ["ice", "steel"],
  neblina: ["dark", "ghost"],
};

function getClimaMult(moveType, climaAtual) {
  // 🛡️ TRAVA 1: Se for nulo ou Extreme, não tem bônus de clima
  if (!climaAtual || !CLIMA_BOOSTS[climaAtual]) return 1.0;

  // 🛡️ TRAVA 2 (A CORREÇÃO DO ERRO): Se o ataque não tiver tipo no JSON, ignora!
  if (!moveType) return 1.0; 

  // O moveType vem do banco de dados (ex: "Grass" ou "grass")
  // Usamos String() por precaução caso o tipo venha como número sem querer
  const tipoNormalizado = String(moveType).toLowerCase();
  const tiposBoosted = CLIMA_BOOSTS[climaAtual];

  return tiposBoosted.includes(tipoNormalizado) ? 1.2 : 1.0;
}

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

// =============================================================
//  FUNÇÃO GERADORA DE BADGE ELITE
// =============================================================
function gerarBadgeEliteHTML(moveId, pokemonObj, isFast) {
    if (pokemonObj && pokemonObj.eliteMoves && pokemonObj.eliteMoves.includes(moveId)) {
        const urlBase = isFast 
            ? "https://raw.githubusercontent.com/nowadraco/pokedragonshadow/refs/heads/main/assets/imagens/icones/mt_elite_de_ataque_agil.png" 
            : "https://raw.githubusercontent.com/nowadraco/pokedragonshadow/refs/heads/main/assets/imagens/icones/mt_elite_de_ataque_carregado.png";
            
        const imgUrl = `https://images.weserv.nl/?url=${urlBase}`;

        return `
            <span title="Requer MT de Elite" style="display:inline-flex; align-items:center; gap:4px; background:rgba(255, 215, 0, 0.15); border:1px solid #f1c40f; color:#f1c40f; font-size:0.65em; padding:2px 6px; border-radius:4px; margin-left:6px; font-weight:bold; vertical-align:middle; text-transform: uppercase; letter-spacing: 0.5px;">
                <img src="${imgUrl}" style="width:14px; height:14px; object-fit:contain; filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.5));"> Elite
            </span>`;
    }
    return "";
}

function calculateCP(baseStats, ivs, level) {
  const cpm = cpms[Math.round((level - 1) * 2)];
  return Math.floor(
    ((baseStats.atk + ivs.atk) *
      Math.sqrt(baseStats.def + ivs.def) *
      Math.sqrt(baseStats.hp + ivs.hp) *
      cpm *
      cpm) /
      10,
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
      "Urshifu Golpe Decisivo Gigamax",
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
      ["Nidoqueen de Coroa", "Nidoqueen"],
      ["Nidoking de Coroa", "Nidoking"],
      ["Pikachu (Red)", "Pikachu"],
      ["Pikachu (Leaf)", "Pikachu"],
      ["Pikachu (Ethan)", "Pikachu"],
      ["Pikachu (Lyra)", "Pikachu"],
      ["Pikachu (Brendan)", "Pikachu"],
      ["Pikachu (May)", "Pikachu"],
      ["Pikachu (Lucas)", "Pikachu"],
      ["Pikachu (Dawn)", "Pikachu"],
      ["Pikachu (Rei)", "Pikachu"],
      ["Pikachu (Akari)", "Pikachu"],
      ["Pikachu (Hilbert)", "Pikachu"],
      ["Pikachu (Hilda)", "Pikachu"],
      ["Pikachu (Nate)", "Pikachu"],
      ["Pikachu (Rosa)", "Pikachu"],
      ["Pikachu com boné do Red", "Pikachu"],
      ["Pikachu com boné da Leaf", "Pikachu"],
      ["Pikachu com boné do Ethan", "Pikachu"],
      ["Pikachu com boné da Lyra", "Pikachu"],
      ["Pikachu vestindo gorro do Brendan", "Pikachu"],
      ["Pikachu vestindo laço da May", "Pikachu"],
      ["Pikachu usando a boina do Lucas", "Pikachu"],
      ["Pikachu usando o gorro da Dawn", "Pikachu"],
      ["Pikachu usando a boina do Rei", "Pikachu"],
      ["Pikachu usando o lenço da Akari", "Pikachu"],
      ["Pikachu com boné do Hilbert", "Pikachu"],
      ["Pikachu com boné da Hilda", "Pikachu"],
      ["Pikachu com viseira do Nate", "Pikachu"],
      ["Pikachu com viseira da Rosa", "Pikachu"],
      ["Pikachu com boné do Calem", "Pikachu"],
      ["Pikachu com boné da Serena", "Pikachu"],
      ["Butterfree Estiloso", "Butterfree"],
      ["Diglett Estiloso", "Diglett"],
      ["Dragonite Estiloso", "Dragonite"],
      ["Wooper Estiloso", "Wooper"],
      ["Sneasel Estiloso", "Sneasel"],
      ["Kirlia Estiloso", "Kirlia"],
      ["Absol Estiloso", "Absol"],
      ["Shinx Estiloso", "Shinx"],
      ["Croagunk Estiloso", "Croagunk"],
      ["Blitzle Estiloso", "Blitzle"],
      ["Minccino Estiloso", "Minccino"],
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
      fetch(URLS.TYPE_EFFECTIVENESS).then((res) => res.json()),
      fetch(URLS.MOVE_TRANSLATIONS).then((res) => res.json()),
      fetch(URLS.MOVE_DATA).then((res) => res.json()),
      fetch(URLS.MOVES_GYM_FAST).then((res) => res.json()),
      fetch(URLS.MOVES_GYM_CHARGED).then((res) => res.json()),
      // 🌟 O ALARME DE DOWNLOAD DOS BOSSES
      fetch(URLS.CURRENT_RAID_BOSSES).then(async (res) => {
          if (!res.ok) return null;
          return await res.json();
      }).catch(() => null),
      fetch(URLS.CANDY_COLORS).then((res) => res.json()).catch(() => null)
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
      effectivenessData,
      rawMoveTranslations,
      moveData,
      gymFastData,
      gymChargedData,
      raidBossesData,
      candyColorData,
    ] = responses;

    window.GLOBAL_MOVES_DB = moveData;

    const moveTranslations = rawMoveTranslations.reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {});

    const moveDataMap = new Map(moveData.map((move) => [move.moveId, move]));
    const gymFastMap = new Map(gymFastData.map((move) => [move.moveId, move]));
    const gymChargedMap = new Map(
      gymChargedData.map((move) => [move.moveId, move]),
    );

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

    // =============================================================
    // MÁGICA DO MOTOR: Cria o Dicionário de Tiers Dinâmico (LENDO TUDO)
    // =============================================================
    const mapaTiersDinamico = {};
    if (raidBossesData) {
        const listasParaLer = ["current", "previous"];
        listasParaLer.forEach(aba => {
            if (raidBossesData[aba]) {
                for (const tierLevel in raidBossesData[aba]) {
                    const listaDaTier = raidBossesData[aba][tierLevel];
                    if (Array.isArray(listaDaTier)) {
                        listaDaTier.forEach(boss => {
                            if (boss && boss.name) {
                                let nomeLimpo = boss.name.toLowerCase().trim();
                                
                                if (boss.form && boss.form.toLowerCase() !== "normal") {
                                    const form = boss.form.toLowerCase().trim();
                                    if (form === "alola") nomeLimpo += " de alola";
                                    else if (form === "galar") nomeLimpo += " de galar";
                                    else if (form === "hisui") nomeLimpo += " de hisui";
                                    else if (form === "paldea") nomeLimpo += " de paldea";
                                    else if (form === "mega") nomeLimpo = "mega " + nomeLimpo;
                                    else if (form === "primal") nomeLimpo += " primal";
                                }
                                
                                if (!mapaTiersDinamico[nomeLimpo]) {
                                    mapaTiersDinamico[nomeLimpo] = String(tierLevel).toLowerCase(); 
                                }
                            }
                        });
                    }
                }
            }
        });
    }

    return {
      pokemonsByNameMap,
      pokemonsByDexMap,
      mapaImagensPrimario: new Map(
        primaryImages.map((item) => [item.nome, item]),
      ),
      mapaImagensSeed: new Map(seedImages.map((item) => [item.nome, item])),
      mapaImagensAlternativo: new Map(
        altImages.map((item) => [item.name, item]),
      ),
      dadosDosTipos: typeData,
      dadosEficacia: effectivenessData,
      moveTranslations: moveTranslations,
      moveDataMap: moveDataMap,
      gymFastMap: gymFastMap,
      gymChargedMap: gymChargedMap,
      raidTiersMap: mapaTiersDinamico,
      raidBossesData: raidBossesData,
      candyColorData: candyColorData?.CandyColors || [],
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
    nomeOriginal.includes("Pikachu (Red)") ||
    nomeOriginal.includes("Pikachu (Leaf)") ||
    nomeOriginal.includes("Pikachu (Ethan)") ||
    nomeOriginal.includes("Pikachu (Lyra)") ||
    nomeOriginal.includes("Pikachu (Brendan)") ||
    nomeOriginal.includes("Pikachu (May)") ||
    nomeOriginal.includes("Pikachu (Lucas)") ||
    nomeOriginal.includes("Pikachu (Dawn)") ||
    nomeOriginal.includes("Pikachu (Rei)") ||
    nomeOriginal.includes("Pikachu (Akari)") ||
    nomeOriginal.includes("Pikachu (Hilbert)") ||
    nomeOriginal.includes("Pikachu (Hilda)") ||
    nomeOriginal.includes("Pikachu (Nate)") ||
    nomeOriginal.includes("Pikachu (Rosa)") ||
    nomeOriginal.includes("de Coroa") ||
    nomeOriginal.includes("Cubchoo com laço festivo") ||
    nomeOriginal.includes("Pikachu com boné do Red") ||
    nomeOriginal.includes("Pikachu com boné da Leaf") ||
    nomeOriginal.includes("Pikachu com boné do Ethan") ||
    nomeOriginal.includes("Pikachu com boné da Lyra") ||
    nomeOriginal.includes("Pikachu vestindo gorro do Brendan") ||
    nomeOriginal.includes("Pikachu vestindo laço da May") ||
    nomeOriginal.includes("Pikachu usando a boina do Lucas") ||
    nomeOriginal.includes("Pikachu usando o gorro da Dawn") ||
    nomeOriginal.includes("Pikachu usando a boina do Rei") ||
    nomeOriginal.includes("Pikachu usando o lenço da Akari") ||
    nomeOriginal.includes("Pikachu com boné do Hilbert") ||
    nomeOriginal.includes("Pikachu com boné da Hilda") ||
    nomeOriginal.includes("Pikachu com viseira do Nate") ||
    nomeOriginal.includes("Pikachu com viseira da Rosa") ||
    nomeOriginal.includes("Pikachu com boné do Calem") ||
    nomeOriginal.includes("Pikachu com boné da Serena") ||
    nomeOriginal.includes("Estiloso") ||
    nomeOriginal.includes("Cubchoo com laço festivo")
  ) {
    const nomeLimpoParaBuscaDeImagem = nomeOriginal.replace(/\*/g, "").trim();
    // console.log(`[Debug Imagem - Caso Especial] Procurando: "${nomeLimpoParaBuscaDeImagem}"`);
    infoImagens = database.mapaImagensPrimario.get(nomeLimpoParaBuscaDeImagem);
  } else {
    const chavesDeBuscaDeImagem = gerarChavesDeBuscaPossiveis(
      pokemonData.speciesName,
    );
    for (const chave of chavesDeBuscaDeImagem) {
      infoImagens = database.mapaImagensPrimario.get(chave);
      if (infoImagens) break;
    }
  }

  if (!infoImagens) {
    console.error(
      `[Debug Imagem] ❌ FALHA Primária: Nenhuma imagem encontrada para "${nomeOriginal}"`,
    );
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
    console.warn(
      `🕵️‍♂️ [SEED DEBUG] Primária vazia para "${nomeOriginal}". Tentando recuperar na Seed...`,
    );

    const chaves = gerarChavesDeBuscaPossiveis(pokemonData.speciesName);

    // Vamos mostrar quais chaves ele está tentando
    // console.log(`   🔑 Chaves geradas:`, chaves);

    for (const chave of chaves) {
      infoImagensSeed = database.mapaImagensSeed.get(chave);

      if (infoImagensSeed) {
        console.log(
          `✅ [SEED DEBUG] SALVO! Encontrado na Seed como: "${chave}"`,
        );
        break; // Achou, para de procurar
      }
    }

    if (!infoImagensSeed) {
      console.error(
        `💀 [SEED DEBUG] MORREU: Não existe nem na Primária nem na Seed: "${nomeOriginal}"`,
      );
    }
  }

  const imgNormalSeed = infoImagensSeed?.imgNormal;
  const imgShinySeed = infoImagensSeed?.imgShiny;

  // --- 3. DEFINIÇÃO DAS IMAGENS ALTERNATIVAS ---
  const infoImagensAlt = database.mapaImagensAlternativo.get(
    pokemonData.speciesId,
  );
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
          const dadosBase = buscarDadosCompletosPokemon(
            nomeBaseTentativa,
            database,
          );

          if (dadosBase) {
            console.log(
              `⚠️ [Fallback] "${nomeOriginal}" não encontrado. Usando imagem de "${nomeBaseTentativa}".`,
            );
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
          tabelaDeTipos,
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
        console.warn(
          `Pokémon "${nomeOriginal}" não encontrado (nem busca base).`,
        );
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
      console.log(
        `🚀 [SEED ATIVADO] Trocando imagem Normal para versão Seed...`,
      ); // <--- LOG AQUI
      this.src = pokemonData.imgNormalSeed;
    }
    // 2. Se falhou a Seed -> Tenta a Alternativa (Fallback)
    else if (
      this.src === pokemonData.imgNormalSeed &&
      pokemonData.imgNormalFallback
    ) {
      console.warn(`⚠️ [SEED FALHOU] Indo para Fallback Alternativo...`);
      this.src = pokemonData.imgNormalFallback;
    }
    // (Segurança) Se falhou a Primária e NÃO TEM Seed -> Vai direto pro Fallback
    else if (
      this.src === pokemonData.imgNormal &&
      pokemonData.imgNormalFallback
    ) {
      this.src = pokemonData.imgNormalFallback;
    }

    // --- LÓGICA PARA IMAGEM SHINY ---

    // 1. Se falhou a Shiny Primária -> Tenta a Shiny Seed
    else if (this.src === pokemonData.imgShiny && pokemonData.imgShinySeed) {
      console.log(
        `✨ [SEED SHINY ATIVADO] Trocando imagem Shiny para versão Seed...`,
      ); // <--- LOG AQUI
      this.src = pokemonData.imgShinySeed;
    }
    // 2. Se falhou a Shiny Seed -> Tenta a Shiny Alternativa (Fallback)
    else if (
      this.src === pokemonData.imgShinySeed &&
      pokemonData.imgShinyFallback
    ) {
      this.src = pokemonData.imgShinyFallback;
    }
    // (Segurança) Se falhou a Shiny Primária e NÃO TEM Seed -> Vai direto pro Fallback
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
    (t) => t && t.toLowerCase() !== "none",
  );
  const [tipo1, tipo2] = validTipos;
  li.className = `Selvagem ${tipo1}`;
  if (tipo2) li.classList.add(tipo2);
  if (tipo2)
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      tipo1,
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
    (t) => t && t.toLowerCase() !== "none",
  );
  validTipos.forEach((t) => li.classList.add(t.toLowerCase()));
  if (validTipos.length > 1)
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      validTipos[0],
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
          }">`,
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
    (t) => t && t.toLowerCase() !== "none",
  );
  validTipos.forEach((t) => li.classList.add(t.toLowerCase()));
  if (validTipos.length > 1) {
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      validTipos[0],
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
                      mult * 100,
                    )}%</span>
                </li>`,
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
          }">`,
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
      `✅ Verificação completa! Nenhum Pokémon faltando até o número #${maxDex}.`,
    );
  } else {
    console.warn(
      `⚠️ Atenção! Faltam os seguintes Pokémon na Dex:`,
      pokemonsFaltando,
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
    (t) => t && t.toLowerCase() !== "none",
  );
  validTipos.forEach((t) => li.classList.add(t.toLowerCase()));

  // Lógica de cor de fundo
  if (validTipos.length > 1) {
    li.style.background = `linear-gradient(to right, ${getTypeColor(
      validTipos[0],
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
                      mult * 100,
                    )}%</span>
                </li>`,
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
          }">`,
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
      `[Pokedex] A base de dados ainda não está pronta. Tente novamente em breve.`,
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
    GLOBAL_POKE_DB,
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
    .map((ataque) => `<li>${formatarNomeMovimento(ataque)} ${gerarBadgeEliteHTML(ataque, pokemon, true)}</li>`)
    .join("");
  const ataquesCarregadosHTML = chargedMoves
    .map((ataque) => `<li>${formatarNomeMovimento(ataque)} ${gerarBadgeEliteHTML(ataque, pokemon, false)}</li>`)
    .join("");

  // 4. MONTAR O CARD HTML COMPLETO
  const pokedexHTML = `
        <div class="pokedex-card" style="border-color: ${getTypeColor(
          types[0],
        )}">
            <div class="pokedex-header">
                <div class="pokedex-imagem-container">
                    <img src="${imagemSrc}" alt="${nomeParaExibicao}" class="pokedex-imagem">
                </div>
                <div class="pokedex-info-principal">
                    <span class="pokedex-numero">#${String(dex).padStart(
                      3,
                      "0",
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
    pokemon,
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
                p.dex <= generationRanges[gen].end,
            );
      displayPokemonList(currentPokemonList);
    });
  });

  document.querySelectorAll(".type-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const typeToFilter = e.currentTarget.dataset.typeEnglish;
      currentPokemonList = allPokemonDataForList.filter(
        (pokemon) =>
          pokemon && pokemon.types && pokemon.types.includes(typeToFilter),
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
          String(p.dex).includes(searchTerm),
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
    resultsContainer.querySelectorAll("img").forEach((img) => {
      // Precisamos achar os dados do pokemon pelo nome que está no alt
      // ou você pode buscar pelo ID do pai. Vamos pelo mais seguro:
      const itemDiv = img.closest(".search-result-item");
      if (itemDiv && itemDiv.dataset.speciesId) {
        // Acha o pokemon na lista global
        const pokeData = allPokemonDataForList.find(
          (p) => p.speciesId === itemDiv.dataset.speciesId,
        );
        if (pokeData) {
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
          !p.speciesName.toLowerCase().includes("(shadow)"),
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
          !p.speciesName.startsWith("Mega "),
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
        (p && p.dex && String(p.dex).includes(searchTerm)),
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
window.showPokemonDetails = async function (
  baseSpeciesId,
  navigationList,
  targetSpeciesId,
) {
  window.scrollTo(0, 0);
  window.currentRaidTier = null; 
  window.currentBossMoveset = "average";
  // =================================================================
  // 1. COLOCAR A POKÉBOLA NA TELA IMEDIATAMENTE (LOADING)
  // =================================================================
  if (typeof datadexContent !== "undefined") {
    datadexContent.innerHTML = `
            <div class="loading-db-container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" class="loading-db-img">
                <p class="loading-db-text">
                    ACESSANDO BANCO DE DADOS...
                </p>
            </div>
        `;
  }

  // 2. PAUSA OBRIGATÓRIA DE 50ms (Para o navegador ter tempo de desenhar a Pokébola)
  await new Promise((resolve) => setTimeout(resolve, 50));

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
      "Fallback de navegação: usando allPokemonDataForList ordenada por Dex.",
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
      (p) => p.speciesId === targetSpeciesId,
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
      (p) => p.speciesId === targetSpeciesId,
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
  // =============================================================
  //  SIMULADOR DE BATALHA DE GINÁSIO E REIDES (PvE)
  //  Fórmula: PvE Padrão (0.5x Dano)
  // =============================================================
  function calcularMelhoresCombos(
    pokemon,
    oponenteInput,
    climaSelecionado = "Extreme",
  ) {
    if (!pokemon || !pokemon.baseStats) return [];
  
    // 1. CONFIGURA O OPONENTE (O alvo que você vai bater)
    let oponente = {
      tipos: ["Null"],
      baseStats: { atk: 180, def: 160, hp: 15000 },
    };
  
    if (oponenteInput && typeof oponenteInput === "object") {
      oponente = {
        nome: oponenteInput.nome || "Custom",
        tipos: oponenteInput.tipos || ["Null"],
        baseStats: oponenteInput.baseStats || { atk: 180, def: 160, hp: 15000 },
        selectedMoveset: oponenteInput.selectedMoveset || "average",
        fastMoves: oponenteInput.fastMoves || [],
        chargedMoves: oponenteInput.chargedMoves || [],
      };
    }
  
    // 2. ATACANTE (Você - Nível 50)
    const CPM = 0.8403;
    const atkUser = ((pokemon.baseStats.atk || 10) + 15) * CPM;
    const defUser = ((pokemon.baseStats.def || 10) + 15) * CPM;
    const attackerHPMax = Math.floor(((pokemon.baseStats.hp || 10) + 15) * CPM);
  
    // Bônus do seu Pokémon
    const isShadow = pokemon.speciesName.toLowerCase().includes("shadow");
    const isMega = pokemon.speciesName.toLowerCase().startsWith("mega ");
  
    const bonusShadowAtk = isShadow ? 1.2 : 1.0;
    const atkFinalUser = atkUser * bonusShadowAtk;
    let damageBonusMult = 1.0;
    if (isMega) damageBonusMult *= 1.1;
  
    // Defesas reais do cálculo
    const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM);
    const defUserFinal = isShadow ? defUser * 0.833 : defUser;
    const razaoDano = atkFinalUser / defInimigoReal;
  
    // =========================================================
    // 3. A BUSCA INTELIGENTE DE GOLPES
    // =========================================================
    const getMoveData = (id, isFast) => {
      let move = null;
      if (typeof GLOBAL_POKE_DB !== "undefined" && GLOBAL_POKE_DB) {
        const map = isFast
          ? GLOBAL_POKE_DB.gymFastMap
          : GLOBAL_POKE_DB.gymChargedMap;
        if (map) {
          move = map.get(id);
          if (!move && !id.endsWith("_FAST")) move = map.get(id + "_FAST");
          if (!move && id.endsWith("_FAST"))
            move = map.get(id.replace("_FAST", ""));
        }
      }
      if (!move && typeof window.GLOBAL_MOVES_DB !== "undefined") {
        move = window.GLOBAL_MOVES_DB.find((m) => m.moveId === id);
      }
      return move;
    };
  
    // =========================================================
    // 4. MOTOR DE DANO DO BOSS CONTRA VOCÊ (DPS Base do Inimigo)
    // =========================================================
    let danoRecebidoPorSegundo =
      (160 * (oponente.baseStats.atk / Math.max(1, defUserFinal))) / 20.0; // Padrão seguro
  
    const calcularDpsDoBoss = (fastId, chargedId) => {
      const bFast = getMoveData(fastId, true);
      const bCharged = getMoveData(chargedId, false);
  
      if (!bFast || !bCharged) return null;
  
      const getBossDmgMult = (moveType) => {
        let m = 1.0;
        if (
          oponente.tipos &&
          oponente.tipos.some((t) => t.toLowerCase() === moveType.toLowerCase())
        )
          m *= 1.2;
        if (
          pokemon.types &&
          typeof GLOBAL_POKE_DB !== "undefined" &&
          GLOBAL_POKE_DB.dadosEficacia
        ) {
          if (typeof getTypeEffectiveness === "function") {
            m *= getTypeEffectiveness(
              moveType,
              pokemon.types,
              GLOBAL_POKE_DB.dadosEficacia,
            );
          }
        }
        return m;
      };
  
      const dmgB_Fast =
        Math.floor(
          0.5 *
            (bFast.power || 0) *
            (oponente.baseStats.atk / defUserFinal) *
            getBossDmgMult(bFast.type),
        ) + 1;
      const dmgB_Charged =
        Math.floor(
          0.5 *
            (bCharged.power || 0) *
            (oponente.baseStats.atk / defUserFinal) *
            getBossDmgMult(bCharged.type),
        ) + 1;
  
      const timeF = (bFast.cooldown || 1000) / 1000;
      const timeC = (bCharged.cooldown || 2000) / 1000;
      const energyG = bFast.energyGain || 6;
      const energyC = Math.abs(bCharged.energy || 50);
  
      const hitsF = Math.ceil(energyC / energyG);
      return (dmgB_Fast * hitsF + dmgB_Charged) / (timeF * hitsF + timeC);
    };
  
    if (oponente.selectedMoveset && oponente.selectedMoveset !== "average") {
      const [bossFastId, bossChargedId] = oponente.selectedMoveset.split("|");
      const dpsEspecifico = calcularDpsDoBoss(bossFastId, bossChargedId);
      if (dpsEspecifico) danoRecebidoPorSegundo = dpsEspecifico;
    } else if (
      oponente.selectedMoveset === "average" &&
      oponente.fastMoves &&
      oponente.chargedMoves
    ) {
      let somaDps = 0;
      let combosValidos = 0;
  
      oponente.fastMoves.forEach((fId) => {
        oponente.chargedMoves.forEach((cId) => {
          const dps = calcularDpsDoBoss(fId, cId);
          if (dps) {
            somaDps += dps;
            combosValidos++;
          }
        });
      });
      if (combosValidos > 0) danoRecebidoPorSegundo = somaDps / combosValidos;
    }
  
    danoRecebidoPorSegundo = danoRecebidoPorSegundo * 0.75; // Ajuste Pokebattler (Lag/Delay)
    const bossIncomingDPS = Math.max(0.1, danoRecebidoPorSegundo);
  
    // =========================================================
    // 5. MOTOR DE DANO DE VOCÊ CONTRA O BOSS (Loop Duplo)
    // =========================================================
    const combos = [];
    const fastMoves = pokemon.fastMoves || [];
    const chargedMoves = pokemon.chargedMoves || [];
  
    fastMoves.forEach((fastId) => {
      const fastMove = getMoveData(fastId, true);
      if (!fastMove) return;
  
      chargedMoves.forEach((chargedId) => {
        const chargedMove = getMoveData(chargedId, false);
        if (!chargedMove) return;
  
        // 🛡️ O ESCUDO ANTI-BUG (Filtra ataques incompletos do JSON)
        const rawTempoRapido = parseFloat(fastMove.duration) || (fastMove.cooldown / 1000) || 0;
        const rawEnergiaRapido = fastMove.energy || fastMove.energyGain || 0;
        const rawTempoCarregado = parseFloat(chargedMove.duration) || (chargedMove.cooldown / 1000) || 0;
        const rawEnergiaCarregado = Math.abs(chargedMove.energy || chargedMove.energyCost || 0);
        const rawDanoCarregado = chargedMove.power || 0;
  
        if (rawTempoRapido <= 0 || rawEnergiaRapido <= 0 || rawTempoCarregado <= 0 || rawEnergiaCarregado <= 0 || rawDanoCarregado <= 0) {
            return;
        }
  
        const mWeatherFast = getClimaMult(fastMove.type, climaSelecionado);
        const mWeatherCharged = getClimaMult(
          chargedMove.type,
          climaSelecionado,
        );
  
       const getMult = (moveType, weatherMult) => {
          let m = 1.0;

          // 🛡️ ESCUDO ANTI-BUG (STAB): Verifica se o golpe e os tipos do Pokémon são válidos
          if (moveType && pokemon.types && Array.isArray(pokemon.types)) {
            const moveTypeNormalizado = String(moveType).toLowerCase();
            
            const temStab = pokemon.types.some((t) => {
              // Se o tipo 2 do Pokémon for nulo ou "none", ignora e não quebra!
              if (!t || String(t).toLowerCase() === "none") return false;
              
              return String(t).toLowerCase() === moveTypeNormalizado;
            });

            if (temStab) m *= 1.2; // Bônus de mesmo tipo (STAB)
          }

          let ef = 1.0;
          if (
            !oponente.tipos.includes("Null") &&
            typeof GLOBAL_POKE_DB !== "undefined" &&
            GLOBAL_POKE_DB.dadosEficacia
          ) {
            const tiposOp = Array.isArray(oponente.tipos)
              ? oponente.tipos
              : [oponente.tipos];
            if (typeof getTypeEffectiveness === "function") {
              ef = getTypeEffectiveness(
                moveType, // Passamos o moveType mesmo que seja undefined, a função getTypeEffectiveness já é blindada
                tiposOp,
                GLOBAL_POKE_DB.dadosEficacia,
              );
              m *= ef;
            }
          }
          m *= weatherMult;
          return { total: m, ef };
        };
  
        const mFast = getMult(fastMove.type, mWeatherFast);
        const mCharged = getMult(chargedMove.type, mWeatherCharged);
  
        const dmgFast =
          Math.floor(
            0.5 *
              (fastMove.power || 0) *
              razaoDano *
              mFast.total *
              damageBonusMult,
          ) + 1;
        const dmgCharged =
          Math.floor(
            0.5 *
              (chargedMove.power || 0) *
              razaoDano *
              mCharged.total *
              damageBonusMult,
          ) + 1;
  
        let tFast = rawTempoRapido;
        if (tFast > 10) tFast = tFast / 1000;
        if (tFast < 0.1) tFast = 0.5;
  
        let tCharged = rawTempoCarregado;
        if (tCharged > 10) tCharged = tCharged / 1000;
        if (tCharged < 0.1) tCharged = 2.0;
  
        const enGain = Math.max(1, rawEnergiaRapido);
        const enCost = rawEnergiaCarregado;
  
        // ✅ MOTOR DEFINITIVO: LOOP DUPLO DETERMINÍSTICO
        let hpAtual = attackerHPMax;
        
        // Separação realista do dano do Boss
        const bossFastDmg = bossIncomingDPS * 2.0 * 0.6; 
        const bossChargedDmg = bossIncomingDPS * 10.0 * 0.4; 
        
        let energiaAtacante = 0;
        let energiaBoss = 0;
        let danoTotal = 0;
        
        let relogio = 0;
        let proxAcaoAtacante = 0;
        let proxAcaoBoss = 2.0; // Boss rugindo no início
  
        while (hpAtual > 0 && relogio < 300) {
            relogio = Math.min(proxAcaoAtacante, proxAcaoBoss);
        
            if (relogio >= proxAcaoBoss) {
                if (energiaBoss >= 60) {
                    hpAtual -= bossChargedDmg; 
                    energiaBoss -= 50; 
                    proxAcaoBoss = relogio + 2.5; 
                    energiaAtacante += Math.floor(bossChargedDmg / 2); // Ganha energia apanhando
                } else {
                    hpAtual -= bossFastDmg; 
                    energiaBoss += 10; 
                    proxAcaoBoss = relogio + 2.0; 
                    energiaAtacante += Math.floor(bossFastDmg / 2); // Ganha energia apanhando
                }
                if (energiaAtacante > 100) energiaAtacante = 100;
            }
        
            if (hpAtual <= 0) break; // Overkill!
        
            if (relogio >= proxAcaoAtacante) {
                if (energiaAtacante >= enCost) {
                    danoTotal += dmgCharged;
                    energiaAtacante -= enCost;
                    proxAcaoAtacante = relogio + tCharged;
                    energiaBoss += Math.floor(dmgCharged / 2);
                } else {
                    danoTotal += dmgFast;
                    energiaAtacante += enGain;
                    proxAcaoAtacante = relogio + tFast;
                    energiaBoss += Math.floor(dmgFast / 2);
                }
                if (energiaAtacante > 100) energiaAtacante = 100;
                if (energiaBoss > 100) energiaBoss = 100;
            }
        }
  
        const tempoDeVidaReal = relogio;
        const dpsCombo = tempoDeVidaReal > 0 ? (danoTotal / tempoDeVidaReal) : 0;
        const vitoria = dpsCombo > 16;
  
        combos.push({
          fast: fastMove,
          charged: chargedMove,
          dps: isNaN(dpsCombo) ? 0 : dpsCombo,
          tdo: isNaN(danoTotal) ? 0 : danoTotal,
          win: vitoria,
          fastHasBoost: mWeatherFast > 1.0,
          chargedHasBoost: mWeatherCharged > 1.0,
        });
      });
    });
  
    return combos.sort((a, b) => b.dps - a.dps);
  }

  // --- NOVO MOTOR DE COUNTERS (O CÉREBRO FINALIZADO) ---
  function calcularMelhoresCounters(defensor, criterio = "estimador") {
    if (!allPokemonDataForList || !defensor) return [];

    const RAID_BOSS_HP_MAP = {
      1: 600,
      3: 3600,
      mega: 9000,
      5: 15000,
      elite: 20000,
    };

    let tier = window.currentRaidTier;
    if (!tier) {
      tier = defensor.speciesName.toLowerCase().startsWith("mega ")
        ? "mega"
        : "5";
      window.currentRaidTier = tier;
    }

    const bossHPMax = RAID_BOSS_HP_MAP[tier];
    // Reides Tier 1 e 3 duram 180s. Lendárias/Megas duram 300s.
    const tempoRaid = tier === "1" || tier === "3" ? 180 : 300;

    let listaCounters = [];

    const oponenteRaid = {
      nome: defensor.nomeParaExibicao || defensor.speciesName,
      tipos: defensor.types,
      baseStats: {
        atk: (defensor.baseStats.atk + 15) * 0.8403,
        def: (defensor.baseStats.def + 15) * 0.8403,
        hp: bossHPMax,
      },
      selectedMoveset: window.currentBossMoveset,
      fastMoves: defensor.fastMoves,
      chargedMoves: defensor.chargedMoves,
    };

    allPokemonDataForList.forEach((atacante) => {
      // --- REGRA DE EXCLUSÃO DE MEGAS DUPLICADOS ---
      // Se for o próprio Boss, se for Purificado, OU se o nome COMEÇAR com "Mega ", o código pula ele!
      if (
        atacante.speciesId === defensor.speciesId ||
        atacante.speciesName.includes("Purified") ||
        atacante.speciesName.startsWith("Mega ") // Ignora "Mega Gengar", mas deixa passar "Gengar (Mega)"
      ) {
        return;
      }

      const combos = calcularMelhoresCombos(
        atacante,
        oponenteRaid,
        window.currentWeather,
      );

      if (combos && combos.length > 0) {
        const melhor = combos[0];
        const dps = Math.max(0.1, melhor.dps);
        const tdo = Math.max(1, melhor.tdo);
        const tempoDeVidaSingle = tdo / dps; // Quanto tempo 1 cópia sobrevive

        // 1. MORTES PARA VENCER
        const mortesReais = bossHPMax / tdo;

        // 2. TEMPO DE LOBBY (A cada 6 mortes, perde 15 segundos revivendo o time)
        const wipesDeTime = Math.floor(mortesReais / 6);

        // 3. TIME TO WIN (TTW) = Tempo batendo + (2s de animação por morte) + (15s por wipe)
        const tempoLuta = bossHPMax / dps;
        const ttw = tempoLuta + 2 * Math.floor(mortesReais) + 15 * wipesDeTime;

        // 4. ESTIMADOR = TTW / Tempo da Raid
        const estimador = ttw / tempoRaid;

        // 5. POTÊNCIA (POWER) = Dano de 6 cópias no tempo limite
        const tempoDeVidaDe6 = 6 * tempoDeVidaSingle + 5 * 2; // Vida de 6 + 5 trocas
        let danoDe6;

        if (tempoDeVidaDe6 >= tempoRaid) {
          // Se 6 cópias duram mais que o tempo da raid, o dano é limitado pelo tempo
          const mortesNoTempo = tempoRaid / tempoDeVidaSingle;
          const tempoAtacando = Math.max(0, tempoRaid - mortesNoTempo * 2);
          danoDe6 = tempoAtacando * dps;
        } else {
          // Se as 6 cópias morrem antes do tempo acabar
          danoDe6 = 6 * tdo;
        }

        // Fórmula do documento: Power = 100 * (DanoTotal / BossHP)
        const power = (danoDe6 / bossHPMax) * 100;

        listaCounters.push({
          pokemon: atacante,
          melhorCombo: melhor,
          ttw: ttw,
          estimador: estimador,
          power: power,
          mortes: Math.ceil(mortesReais),
        });
      }
    });

    // O Ranking Padrão agora é quem tem o menor Estimador (vence mais rápido)
    return listaCounters.sort((a, b) => {
      if (criterio === "dps") return b.melhorCombo.dps - a.melhorCombo.dps;
      if (criterio === "power") return (b.power || 0) - (a.power || 0);
      return (a.estimador || 999) - (b.estimador || 999);
    });
  }

  // --- LÓGICA VISUAL DOS COUNTERS (AGORA ASSÍNCRONA COM LOADING) ---
 // ====================================================================
// 📥 SISTEMA DE DADOS 10.0: CARDS + CLIMA + AMIZADE + FÚRIA DO BOSS (RAGE)
// ====================================================================
window.atualizarListaCountersUI = async function (defensor) {
    const listaDisplay = document.getElementById("lista-counters-display");
    if (!listaDisplay) return;

    listaDisplay.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; width: 100%;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
                 style="width: 45px; height: 45px; animation: spinPokeball 1s linear infinite; filter: drop-shadow(0 0 8px rgba(255,255,255,0.4)); margin-bottom: 15px;">
            <p style="color: #bdc3c7; margin: 0; font-size: 0.9em; font-weight: bold; letter-spacing: 1px;">Extraindo 550 realidades do Motor 10.0...</p>
        </div>
    `;

    try {
        const nomeArquivo = defensor.speciesName.toLowerCase().replace(/ /g, "_");
        let sufixoGolpes = "average";
        if (window.currentBossMoveset && window.currentBossMoveset !== "average") {
            sufixoGolpes = window.currentBossMoveset.replace("|", "_").toLowerCase();
        }

    // =================================================================
    // LÓGICA DO TIER INTELIGENTE
    // =================================================================
    if (!window.currentRaidTier) {
        const nomeLimpo = pokemon.speciesName.toLowerCase().trim(); 
        const nomeBase = nomeLimpo.split(/ \(| com | estilo | de /)[0].trim(); 
        const dicionarioTiers = GLOBAL_POKE_DB.raidTiersMap || {}; 
        
        if (dicionarioTiers[nomeLimpo]) {
            window.currentRaidTier = String(dicionarioTiers[nomeLimpo]);
        } else if (dicionarioTiers[nomeBase]) {
            window.currentRaidTier = String(dicionarioTiers[nomeBase]);
        } else if (nomeLimpo.includes("primal") || nomeLimpo.includes("primitivo")) {
            window.currentRaidTier = "primal";
        } else if (nomeLimpo.startsWith("mega ")) {
            window.currentRaidTier = "mega";
        } else if (nomeLimpo.includes("gigantamax")) {
            window.currentRaidTier = "gmax_6";
        } else {
            window.currentRaidTier = "5"; 
        }
    }

        const tierAtual = window.currentRaidTier || "5";
        const urlDoJson = `/json/simulacao_pve10/counters_${nomeArquivo}_t${tierAtual}.json`;

        const resposta = await fetch(`${urlDoJson}?t=${new Date().getTime()}`);
        
        if (!resposta.ok) {
            listaDisplay.innerHTML = `
                <div style="background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; border-radius: 8px; padding: 20px; text-align: center;">
                    <span style="font-size: 2em;">🚧</span>
                    <h4 style="color: #f1c40f; margin: 10px 0;">Em Construção</h4>
                    <p style="color: #bdc3c7; font-size: 0.9em; margin: 0;">As simulações de Monte Carlo (550x) para <strong>${defensor.nomeParaExibicao}</strong> ainda não foram processadas.</p>
                </div>
            `;
            return;
        }

        const jsonAgrupado = await resposta.json();
        let dadosCounters = jsonAgrupado[sufixoGolpes] || jsonAgrupado["average"];

        if (!dadosCounters || dadosCounters.length === 0) {
            listaDisplay.innerHTML = "<p style='text-align:center; color:#e74c3c; font-weight:bold;'>Nenhum counter encontrado neste arquivo.</p>";
            return;
        }

        // ==============================================================
        // 🌟 SALVA O JSON BRUTO PARA APLICAR A MATEMÁTICA DEPOIS
        // ==============================================================
        window.rawPveData = dadosCounters;
        window.currentPveSortColumn = 'e';
        window.pveSortAscending = true;
        window.paginaAtualPVE = 1;

        const fmt = (n) => {
            if (!n) return "???";
            const limpo = n.replace(/_FAST$/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
            return typeof GLOBAL_POKE_DB !== "undefined" && GLOBAL_POKE_DB.moveTranslations && GLOBAL_POKE_DB.moveTranslations[limpo] ? GLOBAL_POKE_DB.moveTranslations[limpo] : limpo;
        };

        const getIcon = (id, isFast) => {
            let key = id.replace(/_FAST$/, "");
            let data = null;
            if (typeof GLOBAL_POKE_DB !== 'undefined') {
                const map = isFast ? GLOBAL_POKE_DB.gymFastMap : GLOBAL_POKE_DB.gymChargedMap;
                if (map) data = map.get(key) || map.get(id) || map.get(key + "_FAST");
                if (!data && GLOBAL_POKE_DB.moveDataMap) data = GLOBAL_POKE_DB.moveDataMap.get(key);
            }
            if (data && data.type) {
                const url = typeof getTypeIcon === 'function' ? getTypeIcon(data.type) : "";
                if (url) return `<img src="${url}" style="width: 14px; height: 14px; object-fit: contain; margin-right: 5px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));">`;
            }
            return "";
        };

        window.sortTablePVE = function(key) {
            if (window.currentPveSortColumn === key) {
                window.pveSortAscending = !window.pveSortAscending; 
            } else {
                window.currentPveSortColumn = key;
                window.pveSortAscending = (key === 'm' || key === 'tw' || key === 'e') ? true : false;
            }
            window.renderTabelaPVE(1); 
        }

        const getSortIcon = (key) => {
            if (window.currentPveSortColumn !== key) return '<span style="opacity:0.4; font-size:0.8em; margin-left:4px;">↕️</span>';
            return window.pveSortAscending ? '<span style="font-size:0.8em; margin-left:4px;">🔼</span>' : '<span style="font-size:0.8em; margin-left:4px;">🔽</span>';
        }

        window.togglePveGroup = function(pokeId) {
            const gaveta = document.getElementById('gaveta-' + pokeId);
            const seta = document.getElementById('seta-' + pokeId);
            if (!gaveta) return;
            const isHidden = gaveta.style.display === 'none';
            gaveta.style.display = isHidden ? 'block' : 'none';
            if (seta) seta.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        // ==============================================================
        // 🎨 RENDERIZADOR (MATEMÁTICA DE CLIMA, AMIZADE E FÚRIA DO BOSS)
        // ==============================================================
        window.renderTabelaPVE = function(pagina = window.paginaAtualPVE) {
            window.paginaAtualPVE = pagina;
            
            // 1. LÊ OS FILTROS DA TELA E PUXA O HP CORRETO
            const friendMult = window.currentPveFriendship || 1.0;
            const weather = window.currentPveWeather || "Extreme";
            const tierStr = window.currentRaidTier || "5";
            
            // 🌟 TABELA INTELIGENTE DE HP E TEMPO (FRONT-END)
            const mapaRaidHP = { "1": 600, "2": 1800, "3": 3600, "4": 9000, "5": 15000, "mega": 9000, "mega_lendaria": 22500, "primal": 22500, "dmax_1": 1700, "dmax_3": 10000, "dmax_5": 15000, "gmax_6": 90000 };
            const bossHPMax = mapaRaidHP[tierStr] || 15000;
            const tempoLimite = (["1", "2", "3", "4", "dmax_1", "dmax_3"].includes(tierStr)) ? 180 : 300;

            // Pega os jogadores pra calcular o Spam do Boss
            const inputJog = document.getElementById('inputJogadoresPVE');
            let numJogadores = inputJog ? parseInt(inputJog.value) : null;

            if (!numJogadores) {
                let melhorE = 999;
                window.rawPveData.forEach(c => { if(c.e < melhorE) melhorE = c.e; });
                numJogadores = Math.ceil(melhorE);
            }

            // 2. APLICA A MATEMÁTICA PESADA NOS DADOS BRUTOS
            const dadosAjustados = window.rawPveData.map(p => {
                let fType = "normal", cType = "normal";
                
                const fData = GLOBAL_POKE_DB.gymFastMap?.get(p.f) || GLOBAL_POKE_DB.moveDataMap?.get(p.f);
                if(fData && fData.type) fType = fData.type.toLowerCase();
                
                const cData = GLOBAL_POKE_DB.gymChargedMap?.get(p.c) || GLOBAL_POKE_DB.moveDataMap?.get(p.c);
                if(cData && cData.type) cType = cData.type.toLowerCase();

                const wMultF = (typeof CLIMA_BOOSTS !== "undefined" && CLIMA_BOOSTS[weather] && CLIMA_BOOSTS[weather].includes(fType)) ? 1.2 : 1.0;
                const wMultC = (typeof CLIMA_BOOSTS !== "undefined" && CLIMA_BOOSTS[weather] && CLIMA_BOOSTS[weather].includes(cType)) ? 1.2 : 1.0;
                
                const weatherMult = (wMultF * 0.30) + (wMultC * 0.70); 
                const finalMult = friendMult * weatherMult;

                // 😈 PENALIDADE DA FÚRIA DO BOSS (BOSS RAGE)
                // Se bd > 100%, ele toma mais de 100% de dano do carregado do boss (Glass Cannon).
                // Quanto mais jogadores, mais o boss atira.
                const bossDmgRatio = (p.bd || 100) / 100; 
                // Cada jogador a mais aumenta a fúria em 10%, multiplicada pela fragilidade do Pokémon
                const bossRagePenalty = 1 + (Math.max(0, numJogadores - 1) * 0.10 * bossDmgRatio);

                const dpsAjustado = p.d * finalMult;
                const mortesAjustadas = (p.m / finalMult) * bossRagePenalty;
                const tdoAjustado = (p.td * finalMult) / bossRagePenalty;

                // Recalcula o TTW (Tempo para Vencer) considerando que as mortes aumentaram
                // Fórmula base: (Vida do Boss / DPS) + (Mortes * 2s) + (Wipes do Lobby * 15s)
                const tempoBatendo = bossHPMax / dpsAjustado;
                const wipesLobby = Math.floor(mortesAjustadas / 6);
                const ttwAjustado = tempoBatendo + (mortesAjustadas * 2.0) + (wipesLobby * 15.0);
                
                const estimadorAjustado = ttwAjustado / tempoLimite;

                // Recalcula a Nota (ER) -> (DPS^3 * TDO)^0.25
                const erAjustado = Math.pow(Math.pow(dpsAjustado, 3) * tdoAjustado, 0.25);

                return {
                    ...p,
                    _d: dpsAjustado,
                    _d0: p.d0 * finalMult,
                    _d1: p.d1 * finalMult,
                    _td: tdoAjustado,
                    _td0: (p.td0 * finalMult) / bossRagePenalty,
                    _td1: (p.td1 * finalMult) / bossRagePenalty,
                    _tw: ttwAjustado, 
                    _e: estimadorAjustado,   
                    _e0: p.e0 / finalMult, // Sorte continua usando a base
                    _e1: p.e1 / finalMult * bossRagePenalty, // Azar pune pesado
                    _m: mortesAjustadas,   
                    _m0: Math.floor(p.m0 / finalMult),
                    _m1: Math.ceil((p.m1 / finalMult) * bossRagePenalty),
                    _dp: Math.min(100, p.dp * finalMult), 
                    _er: erAjustado
                };
            });

            // 3. AGRUPA OS DADOS AJUSTADOS
            const grupos = {};
            dadosAjustados.forEach(p => {
                if (!grupos[p.i]) grupos[p.i] = [];
                grupos[p.i].push(p);
            });
            
            // 4. ORDENA OS DADOS (Agora lendo os atributos com '_')
            const sortKeyOriginal = window.currentPveSortColumn;
            const isAsc = window.pveSortAscending;
            const sortKey = ['d', 'td', 'tw', 'e', 'er', 'dp', 'm'].includes(sortKeyOriginal) ? '_' + sortKeyOriginal : sortKeyOriginal;

            Object.values(grupos).forEach(grupo => {
                grupo.sort((a, b) => isAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
            });

            const listaGrupos = Object.values(grupos).sort((gA, gB) => {
                return isAsc ? gA[0][sortKey] - gB[0][sortKey] : gB[0][sortKey] - gA[0][sortKey];
            });

            const margemSeguranca = 15; 

            // 5. GERA O HTML DO CABEÇALHO COM SUAS CLASSES NOVAS
            let html = `
                <div class="pve-players-container">
                    <label class="pve-players-label">👥 Jogadores na Reide:</label>
                    <input type="number" id="inputJogadoresPVE" class="pve-players-input" value="${numJogadores}" min="1" max="20" onchange="window.renderTabelaPVE(window.paginaAtualPVE)">
                </div>

                <div class="pve-sort-container">
                    <span class="pve-sort-label">ORDENAR POR:</span>
                    <button class="pve-sort-btn btn-er" onclick="window.sortTablePVE('er')">Nota Geral ${getSortIcon('er')}</button>
                    <button class="pve-sort-btn btn-dps" onclick="window.sortTablePVE('d')">DPS ${getSortIcon('d')}</button>
                    <button class="pve-sort-btn btn-danopc" onclick="window.sortTablePVE('dp')">Dano % ${getSortIcon('dp')}</button>
                    <button class="pve-sort-btn btn-tdo" onclick="window.sortTablePVE('td')">TDO ${getSortIcon('td')}</button>
                    <button class="pve-sort-btn btn-ttw" onclick="window.sortTablePVE('tw')">TTW ${getSortIcon('tw')}</button>
                    <button class="pve-sort-btn btn-mortes" onclick="window.sortTablePVE('m')">Mortes ${getSortIcon('m')}</button>
                    <button class="pve-sort-btn btn-est" onclick="window.sortTablePVE('e')">Estimador ${getSortIcon('e')}</button>
                </div>
            `;

            const itensPorPagina = 10;
            const inicio = (pagina - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const itensDaPagina = listaGrupos.slice(inicio, fim);

            // 6. LOOP DOS POKÉMONS
            itensDaPagina.forEach((grupo, index) => {
                const p = grupo[0]; // Melhor combo já ajustado
                const rankGlobal = inicio + index + 1;
                const temOutrosGolpes = grupo.length > 1;

                // Semáforo do Lobby
                const ttwGrupo = p._tw / numJogadores;
                const tempoSobra = tempoLimite - ttwGrupo;
                let bgLobby, corLobby, msgTempo, iconeLobby;
                if (tempoSobra >= margemSeguranca) {
                    bgLobby = 'rgba(16, 185, 129, 0.15)'; corLobby = '#10b981'; iconeLobby = '✅ Vitória Segura'; msgTempo = `Sobra ${Math.floor(tempoSobra)}s`;
                } else if (tempoSobra >= 0) {
                    bgLobby = 'rgba(245, 158, 11, 0.15)'; corLobby = '#f59e0b'; iconeLobby = '⚠️ Risco Lag'; msgTempo = `Sobra ${Math.floor(tempoSobra)}s`;
                } else {
                    bgLobby = 'rgba(244, 63, 94, 0.15)'; corLobby = '#f43f5e'; iconeLobby = '❌ Derrota'; msgTempo = `Faltou Dano`;
                }

                let pokeObj = allPokemonDataForList.find(b => b.speciesId === p.i);
                if (!pokeObj) pokeObj = buscarDadosCompletosPokemon(p.n, GLOBAL_POKE_DB);
                const imgSrc = pokeObj ? (pokeObj.imgNormal || pokeObj.imgNormalFallback) : "";

                // --- 🌟 NOVO: BADGES ELITE PARA O MELHOR COMBO DO COUNTER ---
                // Verifica o ID normal e com "_FAST" por garantia do banco de dados
                const badgeFastPrinc = pokeObj && typeof gerarBadgeEliteHTML === 'function' ? (gerarBadgeEliteHTML(p.f, pokeObj, true) || gerarBadgeEliteHTML(p.f + "_FAST", pokeObj, true)) : "";
                const badgeChargedPrinc = pokeObj && typeof gerarBadgeEliteHTML === 'function' ? gerarBadgeEliteHTML(p.c, pokeObj, false) : "";

                // GAVETA (FILHOS)
                let htmlOutrosGolpes = "";
                if (temOutrosGolpes) {
                    const filhos = grupo.slice(1, 11);
                    htmlOutrosGolpes = `
                        <div id="gaveta-${p.i}" class="pve-drawer" style="display: none;">
                            <h5 class="pve-drawer-title">⚔️ Outros movimentos eficientes:</h5>
                            <div class="pve-drawer-grid">
                    `;
                    filhos.forEach(outro => {
                        // --- 🌟 NOVO: BADGES ELITE PARA OS GOLPES DA GAVETA ---
                        const badgeFastOutro = pokeObj && typeof gerarBadgeEliteHTML === 'function' ? (gerarBadgeEliteHTML(outro.f, pokeObj, true) || gerarBadgeEliteHTML(outro.f + "_FAST", pokeObj, true)) : "";
                        const badgeChargedOutro = pokeObj && typeof gerarBadgeEliteHTML === 'function' ? gerarBadgeEliteHTML(outro.c, pokeObj, false) : "";

                        htmlOutrosGolpes += `
                            <div class="pve-drawer-item">
                                <div class="pve-drawer-moves">
                                    <div class="pve-drawer-move-fast">${getIcon(outro.f, true)} ${fmt(outro.f)} ${badgeFastOutro}</div>
                                    <div class="pve-drawer-move-charged"><span style="opacity:0.5;">+</span> ${getIcon(outro.c, false)} ${fmt(outro.c)} ${badgeChargedOutro}</div>
                                </div>
                                <div class="pve-drawer-stats">
                                    <span style="color:#f59e0b;">Nota: ${outro._er.toFixed(1)}</span>
                                    <span style="color:#38bdf8;">DPS: ${outro._d.toFixed(1)}</span>
                                    <span style="color:#10b981;">Dano: ${outro._dp.toFixed(1)}%</span>
                                    <span style="color:#3498db;">Est: ${outro._e.toFixed(2)}</span>
                                </div>
                            </div>
                        `;
                    });
                    htmlOutrosGolpes += `</div></div>`;
                }

                // O CARD PAI
                const isClickableClass = temOutrosGolpes ? "clickable" : "";
                const clickEvent = temOutrosGolpes ? `onclick="window.togglePveGroup('${p.i}')"` : "";

                html += `
                    <div class="combo-row fade-in pve-card-container">
                        <div class="pve-card-header ${isClickableClass}" ${clickEvent}>
                            
                            <div class="pve-card-pokemon">
                                <div class="pve-card-rank-num">#${rankGlobal}</div>
                                <img src="${imgSrc}" class="pve-card-img">
                                <div class="pve-card-info">
                                    <span class="pve-card-name">${p.n}</span>
                                    <span class="pve-card-level">Lv ${p.lv || 40} • CP ${p.cp || '---'}</span>
                                    <div class="pve-card-moves">
                                        ${getIcon(p.f, true)} ${fmt(p.f)} ${badgeFastPrinc} <span style="margin: 0 5px; opacity: 0.5;">+</span> ${getIcon(p.c, false)} ${fmt(p.c)} ${badgeChargedPrinc}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="pve-card-stats-wrapper">
                                <div class="pve-stat-box">
                                    <span class="pve-stat-label">Nota Geral</span>
                                    <span class="pve-stat-value" style="color: #f59e0b;">${p._er.toFixed(1)}</span>
                                </div>
                                <div class="pve-stat-box bordered">
                                    <span class="pve-stat-label">DPS</span>
                                    <span class="pve-stat-value" style="color: #38bdf8;">${p._d.toFixed(1)}</span>
                                    <span class="pve-stat-sub">${p._d0.toFixed(1)}-${p._d1.toFixed(1)}</span>
                                </div>
                                <div class="pve-stat-box bordered">
                                    <span class="pve-stat-label">Dano</span>
                                    <span class="pve-stat-value" style="color: #10b981;">${p._dp.toFixed(1)}%</span>
                                </div>
                                <div class="pve-stat-box bordered">
                                    <span class="pve-stat-label">TDO</span>
                                    <span class="pve-stat-value" style="color: #c084fc;">${Math.round(p._td)}</span>
                                    <span class="pve-stat-sub">${Math.round(p._td0)}-${Math.round(p._td1)}</span>
                                </div>
                                <div class="pve-stat-box bordered">
                                    <span class="pve-stat-label">TTW</span>
                                    <span class="pve-stat-value" style="color: #cbd5e1;">${p._tw.toFixed(0)}s</span>
                                </div>
                                <div class="pve-stat-box bordered">
                                    <span class="pve-stat-label">Mortes</span>
                                    <span class="pve-stat-value" style="color: #e74c3c;">${Math.round(p._m)}</span>
                                    <span class="pve-stat-sub">${p._m0}-${p._m1}</span>
                                </div>
                                <div class="pve-stat-box bordered">
                                    <span class="pve-stat-label">Est.</span>
                                    <span class="pve-stat-value" style="color: #3498db;">${p._e.toFixed(2)}</span>
                                    <span class="pve-stat-sub">${p._e0.toFixed(2)}-${p._e1.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div class="pve-card-status">
                                <div class="pve-lobby-box" style="background: ${bgLobby}; border: 1px solid ${corLobby};">
                                    <span class="pve-lobby-icon" style="color: ${corLobby};">${iconeLobby}</span>
                                    <span class="pve-lobby-text" style="color: ${corLobby};">${msgTempo}</span>
                                </div>
                                ${temOutrosGolpes ? `<div id="seta-${p.i}" class="pve-dropdown-arrow">▼</div>` : '<div style="width: 15px;"></div>'}
                            </div>

                        </div>
                        ${htmlOutrosGolpes}
                    </div>
                `;
            });

            listaDisplay.innerHTML = html;

            // PAGINAÇÃO
            const totalPaginas = Math.ceil(listaGrupos.length / itensPorPagina);
            if (totalPaginas > 1) {
                let botoesHTML = `<div style="display: flex; justify-content: center; gap: 8px; margin-top: 15px; padding-bottom: 20px; flex-wrap: wrap;">`;
                for (let i = 1; i <= totalPaginas; i++) {
                    const isAtivo = (i === pagina) ? "background: #e11d48; color: white; border-color: #e11d48;" : "background: rgba(255,255,255,0.1); color: #bdc3c7; border-color: rgba(255,255,255,0.2);";
                    botoesHTML += `<button onclick="window.renderTabelaPVE(${i})" style="padding: 8px 14px; border-radius: 6px; font-weight: bold; border: 1px solid; cursor: pointer; outline: none; transition: 0.2s; ${isAtivo}" onmouseover="this.style.filter='brightness(1.2)'" onmouseout="this.style.filter='none'">${i}</button>`;
                }
                botoesHTML += `</div>`;
                listaDisplay.innerHTML += botoesHTML;
            }
        };

        // Renderiza a primeira página imediatamente
        window.renderTabelaPVE(1);

    } catch (erro) {
        console.error("❌ Erro no Motor 10.0:", erro);
        listaDisplay.innerHTML = `<p style="color:#e74c3c; text-align:center;">Erro de conexão. Impossível baixar simulação 10.0.</p>`;
    }
};

// ==============================================================
// 🌟 FUNÇÃO GLOBAL QUE ATUALIZA O CÁLCULO AO TROCAR O SELECT
// ==============================================================
window.atualizarFiltrosGlobaisPVE = function () {
    const selectWeather = document.getElementById("raid-weather-select");
    const selectFriend = document.getElementById("raid-friend-select");

    // Salva as escolhas na memória global
    if (selectWeather) window.currentPveWeather = selectWeather.value;
    if (selectFriend) window.currentPveFriendship = parseFloat(selectFriend.value);

    // Manda a tabela desenhar tudo de novo (ela já pega o JSON e aplica a matemática!)
    if (typeof window.renderTabelaPVE === "function") {
        window.renderTabelaPVE(1); 
    }
};

  // Função para os botões de troca (DPS/TDO)
  window.alternarCriterioCounters = function (novoCriterio) {
    // Se o usuário clicar no botão de Poder, use 'score'. Se não, use 'tdo' ou 'dps'.
    // No seu caso, vamos manter 'dps' e 'tdo' para facilitar.

    document
      .getElementById("switch-dps")
      .classList.toggle("active", novoCriterio === "dps");
    document
      .getElementById("switch-tdo")
      .classList.toggle("active", novoCriterio === "tdo");

    if (window.pokemonParaSimulacao) {
      window.atualizarListaCountersUI(
        window.pokemonParaSimulacao,
        novoCriterio,
      );
    }
  };

  // --- INTERFACE DO RANKING (OS BOTÕES) ---

  let offsetCounters = 0;
  let countersFiltradosGlobal = [];

  // RANKING COMPLETO ASSÍNCRONO COM LOADING
  window.abrirRankingCompleto = async function (defensor) {
    // <-- Adicionado "async"
    window.scrollTo(0, 0);
    offsetCounters = 0;
    window.pokemonParaSimulacao = defensor;

    // 🌟 GARANTE QUE O RANKING COMPLETO TAMBÉM ABRA NA TIER CERTA
    if (!window.currentRaidTier) {
        const nomeLimpo = defensor.speciesName.toLowerCase();
        const dicionarioTiers = GLOBAL_POKE_DB.raidTiersMap || {}; 
        
        if (dicionarioTiers[nomeLimpo]) {
            window.currentRaidTier = String(dicionarioTiers[nomeLimpo]);
        } else if (nomeLimpo.includes("primal") || nomeLimpo.includes("primitivo")) {
            window.currentRaidTier = "primal";
        } else if (nomeLimpo.startsWith("mega ")) {
            window.currentRaidTier = "mega";
        } else if (nomeLimpo.includes("gigantamax")) {
            window.currentRaidTier = "gmax_6";
        } else {
            window.currentRaidTier = "5"; 
        }
    }

    const formatarNomeMov = (nome) => {
      const limpo = nome
        .replace(/_FAST$/, "")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return GLOBAL_POKE_DB.moveTranslations[limpo] || limpo;
    };

    let bossMovesOptions = `<option value="average">⚔️ Moveset Médio (Desconhecido)</option>`;
    if (defensor.fastMoves && defensor.chargedMoves) {
      defensor.fastMoves.forEach((fId) => {
        defensor.chargedMoves.forEach((cId) => {
          const val = `${fId}|${cId}`;
          const isSelected =
            window.currentBossMoveset === val ? "selected" : "";
          bossMovesOptions += `<option value="${val}" ${isSelected}>${formatarNomeMov(fId)} + ${formatarNomeMov(cId)}</option>`;
        });
      });
    }

    const bossImage = defensor.imgNormal || defensor.imgNormalFallback;

    // 1. MONTA A ESTRUTURA DO RANKING COM O LOADING JÁ INCLUSO

    // 2. RESPIRA E DEIXA O NAVEGADOR DESENHAR A TELA
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 3. EXECUTA O CÁLCULO PESADO
    countersFiltradosGlobal = calcularMelhoresCounters(defensor, "estimador");

    // 4. APAGA A POKÉBOLA E GERA OS 50 PRIMEIROS
    const loader = document.getElementById("loader-ranking");
    if (loader) loader.remove();

    document.getElementById("btn-carregar-mais-50").style.display = "block";
    carregarMaisCinquenta();
  };

  // =========================================================
  // CONTROLE DO SELETOR DE ATAQUES DO BOSS
  // =========================================================
  window.currentBossMoveset = "average"; // Valor padrão (Média)

  window.atualizarMovesetBoss = function () {
    const select = document.getElementById("boss-moveset-select");
    if (select) {
      window.currentBossMoveset = select.value;

      // Se já tiver um Pokémon carregado na tela, recalcula o Top 10 na hora
      if (window.pokemonParaSimulacao) {
        window.atualizarListaCountersUI(window.pokemonParaSimulacao, "score");
      }
    }
  };

  window.carregarMaisCinquenta = function () {
    const container = document.getElementById("lista-ranking-50");
    if (!container) return;

    const proximos = countersFiltradosGlobal.slice(
      offsetCounters,
      offsetCounters + 50,
    );

    proximos.forEach((c, i) => {
      const rankPos = offsetCounters + i + 1;
      const fmt = (n) => {
        if (!n) return "Desconhecido";
        const limpo = n
          .replace(/_FAST$/, "")
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase());
        return typeof GLOBAL_POKE_DB !== "undefined" &&
          GLOBAL_POKE_DB.moveTranslations &&
          GLOBAL_POKE_DB.moveTranslations[limpo]
          ? GLOBAL_POKE_DB.moveTranslations[limpo]
          : limpo;
      };

      // Travas de segurança
      const powerVisor = c.power || 0;
      const ttwVisor = c.ttw || 0;
      const estimadorVisor = c.estimador || 0;
      const mortesVisor = c.mortes || 0;

      // --- 🌟 NOVO: BADGE DE ELITE PARA O RANKING COMPLETO ---
      const fastIdRank = c.melhorCombo.fast.moveId || c.melhorCombo.fast.name || "";
      const chargedIdRank = c.melhorCombo.charged.moveId || c.melhorCombo.charged.name || "";
      const bFastR = typeof gerarBadgeEliteHTML === 'function' ? (gerarBadgeEliteHTML(fastIdRank, c.pokemon, true) || gerarBadgeEliteHTML(fastIdRank.replace(/_FAST$/, ""), c.pokemon, true)) : "";
      const bChargedR = typeof gerarBadgeEliteHTML === 'function' ? gerarBadgeEliteHTML(chargedIdRank, c.pokemon, false) : "";

      // LÓGICA DAS MEDALHAS DO TOP 3
      let classMedalha = "";
      let visualRank = rankPos;
      let estiloNumero = "font-weight:900; opacity:0.1; font-size:24px;"; // Padrão

      if (rankPos === 1) {
        classMedalha = "rank-ouro";
        visualRank = "🥇";
        estiloNumero = "font-size:26px; filter: drop-shadow(0 0 5px #ffd700);";
      } else if (rankPos === 2) {
        classMedalha = "rank-prata";
        visualRank = "🥈";
        estiloNumero = "font-size:26px; filter: drop-shadow(0 0 5px #c0c0c0);";
      } else if (rankPos === 3) {
        classMedalha = "rank-bronze";
        visualRank = "🥉";
        estiloNumero = "font-size:26px; filter: drop-shadow(0 0 5px #cd7f32);";
      }

      container.innerHTML += `
            <div class="combo-row fade-in ${classMedalha}" style="position:relative; padding-left:55px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
                <div style="position:absolute; left:10px; top:50%; transform:translateY(-50%); ${estiloNumero}">
                    ${visualRank}
                </div>
                <div class="combo-moves">
                    <img src="${c.pokemon.imgNormal || c.pokemon.imgNormalFallback}" style="width:40px; height:40px; margin-right:12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                    <div style="display:flex; flex-direction:column;">
                        <strong style="color: #fff; font-size: 1.1em;">${c.pokemon.nomeParaExibicao}</strong>
                        <small style="color: #bdc3c7; display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                            ${fmt(c.melhorCombo.fast.name)} ${bFastR} <span style="opacity: 0.5;">+</span> ${fmt(c.melhorCombo.charged.name)} ${bChargedR}
                        </small>
                    </div>
                </div>
                
                <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 8px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 0.8em; color: #aaa;">
                        Potência: <strong style="color: #2ecc71;">${powerVisor.toFixed(1)}%</strong>
                    </div>
                    <div style="font-size: 0.8em; color: #aaa;">
                        TTW: <strong style="color: #f1c40f;">${ttwVisor.toFixed(1)}s</strong>
                    </div>
                    <div style="font-size: 0.8em; color: #aaa;">
                        Estimador: <strong style="color: #3498db;">${estimadorVisor.toFixed(2)}</strong>
                    </div>
                    <div style="font-size: 0.8em; color: #aaa;">
                        Mortes: <strong style="color: #e74c3c;">×${mortesVisor}</strong>
                    </div>
                </div>
            </div>
        `;
    });

    offsetCounters += 50;
    if (offsetCounters >= countersFiltradosGlobal.length) {
      const btn = document.getElementById("btn-carregar-mais-50");
      if (btn) btn.style.display = "none";
    }
  };

  // Esta função atualiza o nível e avisa o motor
  window.atualizarNivelRaid = function () {
    const select = document.getElementById("raid-tier-select");
    if (select) {
      window.currentRaidTier = select.value;
      // Atualiza o Top 10 na hora
      window.atualizarListaCountersUI(
        window.pokemonParaSimulacao,
        window.currentCriterio || "score",
      );
    }
  };

  // =============================================================
  //  ATUALIZADOR DA UI (COM IMAGENS DE CLIMA)
  // =============================================================
  window.atualizarSimulacaoUI = function (valorInput) {
    if (typeof pokemonParaSimulacao === "undefined") return;

    // 1. Identifica os elementos da interface
    const avatar = document.getElementById("opponent-avatar");
    const inputElement = document.getElementById("dps-search-input");

    // 2. Define o valor de busca (prioriza o clique, senão lê o que está escrito)
    let valor =
      valorInput !== undefined
        ? valorInput
        : inputElement
          ? inputElement.value
          : "Null";
    if (!valor) valor = "Null";
    valor = valor.trim();

    // 3. LÓGICA DE ATUALIZAÇÃO DA FOTO DO OPONENTE
    if (avatar && inputElement) {
      const valorLower = valor.toLowerCase();

      // Verifica se é um Pokémon válido (não neutro e não apenas um tipo)
      if (
        valorLower !== "" &&
        valorLower !== "null" &&
        !valorLower.includes("neutro")
      ) {
        const oponenteData = GLOBAL_POKE_DB.pokemonsByNameMap.get(valorLower);

        if (oponenteData) {
          // Busca os dados completos para garantir a URL da imagem (Normal ou Fallback)
          const fullData = buscarDadosCompletosPokemon(
            oponenteData.speciesName,
            GLOBAL_POKE_DB,
          );
          avatar.src = fullData.imgNormal || fullData.imgNormalFallback;
          avatar.style.display = "block";
          inputElement.style.paddingLeft = "38px"; // Abre espaço para a miniatura
        } else {
          // Se for um tipo genérico ou não encontrado, esconde a foto
          avatar.style.display = "none";
          inputElement.style.paddingLeft = "12px";
        }
      } else {
        // Caso seja "Null" ou "Neutro"
        avatar.style.display = "none";
        inputElement.style.paddingLeft = "12px";
      }
    }

    // 4. CONFIGURAÇÃO DO OPONENTE PARA O CÁLCULO
    let oponenteConfigurado = null;
    const climaSelecionado = window.currentWeather || "Extreme";

    // Mapeamento para converter tradução PT para ID de tipo em Inglês
    const tiposPtParaIngles = Object.entries(TYPE_TRANSLATION_MAP).reduce(
      (acc, [key, val]) => {
        acc[val.toLowerCase()] = key;
        return acc;
      },
      {},
    );

    const tipoInglesencontrado = tiposPtParaIngles[valor.toLowerCase()];

    if (
      valor === "Null" ||
      valor.toLowerCase().includes("neutro") ||
      valor === ""
    ) {
      oponenteConfigurado = "Null";
    } else if (tipoInglesencontrado) {
      // Se for um Tipo Genérico
      oponenteConfigurado = {
        nome: `Tipo ${valor}`,
        tipos: [tipoInglesencontrado],
        baseStats: { atk: 180, def: 160, hp: 15000 },
      };
    } else {
      // Se for um Pokémon específico
      const pokemonEncontrado = GLOBAL_POKE_DB.pokemonsByNameMap.get(
        valor.toLowerCase(),
      );
      if (pokemonEncontrado) {
        oponenteConfigurado = {
          nome: pokemonEncontrado.nomeParaExibicao,
          tipos: pokemonEncontrado.types,
          baseStats: pokemonEncontrado.baseStats,
        };
      }
    }

    // Fallback de segurança
    if (!oponenteConfigurado) {
      oponenteConfigurado = {
        tipos: ["Null"],
        baseStats: { atk: 180, def: 160, hp: 15000 },
      };
    }

    // 5. EXECUTA O CÁLCULO (Passando o Clima e o Oponente)
    const listaCombos = calcularMelhoresCombos(
      pokemonParaSimulacao,
      oponenteConfigurado,
      climaSelecionado,
    );

    // 6. ATUALIZA A TABELA COM PAGINAÇÃO
    if (typeof iniciarPaginacao === "function") {
      iniciarPaginacao(listaCombos);
    }
  };

  // =============================================================
//  MÓDULO DA LINHA EVOLUTIVA E PINTOR DE DOCES
// =============================================================

function pintarDoceCanvas(familyId) {
    return new Promise((resolve) => {
        // Usa a imagem transparente que você enviou pelo CDN
        const imgSrc = "https://images.weserv.nl/?url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow/refs/heads/main/assets/imagens/icones/doce_para_pintar.png";
        
        if (!GLOBAL_POKE_DB || !GLOBAL_POKE_DB.candyColorData) {
            resolve(imgSrc); return;
        }

        const colorInfo = GLOBAL_POKE_DB.candyColorData.find(c => c.FamilyId === familyId);
        if (!colorInfo) {
            resolve(imgSrc); return;
        }

        // Converte o RGB do JSON (0 a 1) para o padrão de tela (0 a 255)
        const pR = Math.round(colorInfo.PrimaryColor.r * 255);
        const pG = Math.round(colorInfo.PrimaryColor.g * 255);
        const pB = Math.round(colorInfo.PrimaryColor.b * 255);
        
        const sR = Math.round(colorInfo.SecondaryColor.r * 255);
        const sG = Math.round(colorInfo.SecondaryColor.g * 255);
        const sB = Math.round(colorInfo.SecondaryColor.b * 255);

        const img = new Image();
        img.crossOrigin = "Anonymous"; // Evita bloqueio de segurança
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                if (a === 0) continue; // Ignora o fundo transparente
                
                // MÁGICA: Se o pixel for escuro (menos de 100), é o detalhe secundário. Se for claro, é o corpo principal.
                if (r < 100 && g < 100 && b < 100) {
                    data[i] = sR; data[i+1] = sG; data[i+2] = sB;
                } else {
                    data[i] = pR; data[i+1] = pG; data[i+2] = pB;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL("image/png")); // Devolve o doce pintado
        };
        img.onerror = () => resolve(imgSrc);
        img.src = imgSrc;
    });
}

// Descobre a árvore genealógica rastreando o "bebê" e lendo as evoluções
function buscarArvoreEvolutiva(pokemonBase) {
    if (!pokemonBase) return [];

    // 1. Rastreia para trás para achar o Pokémon "Estágio 1" (O bebê)
    let bebeFinal = pokemonBase;
    let safetyCounter = 0;
    
    while (safetyCounter < 5) {
        let parentName = null;
        
        // Tenta achar o pai pela tag 'family.parent' (Ex: Ivysaur tem o pai Bulbasaur)
        if (bebeFinal.family && bebeFinal.family.parent) {
            parentName = bebeFinal.family.parent;
        } else {
            // Busca na Força Bruta: Algum Pokémon na Dex tem uma 'evolution' que aponta para esse?
            const paiPerdido = allPokemonDataForList.find(p => 
                p.evolutions && p.evolutions.some(e => e.pokemon_id === bebeFinal.dex || e.pokemon_name.toLowerCase() === bebeFinal.speciesName.toLowerCase())
            );
            if (paiPerdido) parentName = paiPerdido.speciesId;
        }

        if (parentName) {
            const possibleParent = allPokemonDataForList.find(p => p.speciesId === parentName || p.speciesName.toLowerCase() === parentName.toLowerCase());
            if (possibleParent) {
                bebeFinal = possibleParent; // Sobe um degrau na árvore
            } else {
                break;
            }
        } else {
            break; // Se não achou nenhum pai, significa que ESTE é o bebê!
        }
        safetyCounter++;
    }

    // 2. Tendo o bebê Supremo, construímos a linha do tempo "pra frente" lendo as Evoluções
    let arvore = [bebeFinal];
    let geracaoAtual = [bebeFinal];

    safetyCounter = 0;
    while (geracaoAtual.length > 0 && safetyCounter < 5) {
        let proximaGeracao = [];
        
        geracaoAtual.forEach(pai => {
            if (pai.evolutions && pai.evolutions.length > 0) {
                pai.evolutions.forEach(evo => {
                    // Acha o filho usando o ID ou o Nome
                    const filhoObj = allPokemonDataForList.find(p => 
                        p.dex === evo.pokemon_id || 
                        p.speciesName.toLowerCase() === evo.pokemon_name.toLowerCase() ||
                        p.speciesId.toLowerCase() === evo.pokemon_name.toLowerCase()
                    );
                    
                    if (filhoObj && !arvore.find(x => x.dex === filhoObj.dex)) {
                        filhoObj._evoCusto = evo.candy_required || "?";
                        arvore.push(filhoObj);
                        proximaGeracao.push(filhoObj);
                    }
                });
            }
        });
        
        geracaoAtual = proximaGeracao;
        safetyCounter++;
    }

    // Remove duplicatas e ordena pelo número da Dex para garantir a ordem (Bulba -> Ivy -> Venu)
    const arvoreFinal = Array.from(new Set(arvore)).sort((a, b) => a.dex - b.dex);
    
    // Log para você ver no F12 do navegador se ele encontrou a família!
    console.log(`🧬 [EVOLUÇÃO] Família encontrada para ${pokemonBase.speciesName}:`, arvoreFinal.map(p => p.speciesName));
    
    return arvoreFinal;
}

  const renderPage = () => {
    const pokemon = allForms[currentFormIndex];
    localStorage.setItem("lastViewedPokemonDex", pokemon.dex);

    // =================================================================
    // 🌟 LÓGICA DO TIER INTELIGENTE (COM ESPIÃO DETALHADO)
    // =================================================================
    if (!window.currentRaidTier) {
        const nomeLimpo = pokemon.speciesName.toLowerCase().trim(); 
        const nomeBase = nomeLimpo.split(/ \(| com | estilo | de /)[0].trim(); 
        
        let dicionarioTiers = GLOBAL_POKE_DB.raidTiersMap || {}; 
        
        console.log(`%c[RAIO-X DO TIER] Buscando por: "${nomeLimpo}" ou "${nomeBase}"`, "background: #e67e22; color: #fff; padding: 4px; font-weight: bold;");
        
        // Testa o nome completo primeiro, se não achar, testa o nome base
        if (dicionarioTiers[nomeLimpo]) {
            window.currentRaidTier = String(dicionarioTiers[nomeLimpo]);
            console.log(`✅ SUCESSO! Achou no Dicionário pelo Nome Exato! Tier: ${window.currentRaidTier}`);
        } else if (dicionarioTiers[nomeBase]) {
            window.currentRaidTier = String(dicionarioTiers[nomeBase]);
            console.log(`✅ SUCESSO! Achou no Dicionário pelo Nome Base! Tier: ${window.currentRaidTier}`);
        } else {
            // Planos de Contingência (Se a API falhar)
            if (nomeLimpo.includes("primal") || nomeLimpo.includes("primitivo")) {
                window.currentRaidTier = "primal";
            } else if (nomeLimpo.startsWith("mega ")) {
                window.currentRaidTier = "mega";
            } else if (nomeLimpo.includes("gigantamax")) {
                window.currentRaidTier = "gmax_6";
            } else {
                window.currentRaidTier = "5"; 
            }
            console.log(`❌ Não achou no Dicionário. Usando fallback: Tier ${window.currentRaidTier}`);
        }
    }
    // =================================================================

    const {
      dex,
      nomeParaExibicao,
      types,
      baseStats,
      fastMoves,
      chargedMoves,
      speciesName,
    } = pokemon;

    // =================================================================
    // 🕵️‍♂️ MODO DETETIVE: RAIO-X DE MOVIMENTOS (AQUI VAI FUNCIONAR!)
    // =================================================================
    console.log(`%c[BUSCA DE MOVIMENTOS] 🔍 Pokémon: ${nomeParaExibicao}`, "color: #e67e22; font-weight: bold; font-size: 14px; background: #222; padding: 4px; border-radius: 4px;");
    console.log("▶️ Rápidos Brutos:", fastMoves);
    console.log("▶️ Carregados Brutos:", chargedMoves);
    
    fastMoves.forEach(mId => {
        if(!mId) return;
        const limpo = mId.replace(/_FAST$/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        const traduzido = GLOBAL_POKE_DB.moveTranslations[limpo];
        console.log(`   🗡️ Rápido: Original [${mId}] -> Limpo [${limpo}] -> Tradução: ${traduzido ? traduzido : "❌ NÃO ACHOU NO JSON"}`);
    });

    chargedMoves.forEach(mId => {
        if(!mId) return;
        const limpo = mId.replace(/_FAST$/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        const traduzido = GLOBAL_POKE_DB.moveTranslations[limpo];
        console.log(`   💥 Carregado: Original [${mId}] -> Limpo [${limpo}] -> Tradução: ${traduzido ? traduzido : "❌ NÃO ACHOU NO JSON"}`);
    });
    console.log("---------------------------------------------------");
    // =================================================================

    const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);
    const isShadow =
      speciesName && speciesName.toLowerCase().includes("(shadow)");

    // Ranks
    const cpRankNum = GLOBAL_POKE_DB.cpRankList.findIndex(
      (p) => p.speciesId === pokemon.speciesId,
    );
    const atkRankNum = GLOBAL_POKE_DB.atkRankList.findIndex(
      (p) => p.speciesId === pokemon.speciesId,
    );
    const defRankNum = GLOBAL_POKE_DB.defRankList.findIndex(
      (p) => p.speciesId === pokemon.speciesId,
    );
    const hpRankNum = GLOBAL_POKE_DB.hpRankList.findIndex(
      (p) => p.speciesId === pokemon.speciesId,
    );
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
      const map = isFast
        ? GLOBAL_POKE_DB.gymFastMap
        : GLOBAL_POKE_DB.gymChargedMap;
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

      const formattedKey = moveKey
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const translatedName =
        GLOBAL_POKE_DB.moveTranslations[formattedKey] ||
        (moveData ? moveData.name : formattedKey);

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

     const badgeElite = gerarBadgeEliteHTML(moveId, pokemon, isFast);

      return `<li ${styleAttribute}>
                <div class="move-header">
                    <img src="${getTypeIcon(moveType)}" alt="${moveType}" class="move-type-icon">
                    <span class="move-name" style="color: ${textColor};">${translatedName} ${badgeElite}</span>
                </div>
                ${statsHtml}
              </li>`;
    };

    // Gera as listas de HTML para PVE
    const gymFastHtml = fastMoves
      .map((m) => criarHtmlDoMovimentoGYM(m, true))
      .join("");
    const gymChargedHtml = chargedMoves
      .map((m) => criarHtmlDoMovimentoGYM(m, false))
      .join("");

    // =================================================================================
    // 2. GERADOR DE HTML PARA PVP - COMPLETO (DPT, EPT + DPS REFERÊNCIA)
    // =================================================================================
    const criarHtmlDoMovimentoPVP = (moveId, isFast) => {
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

      const formattedKey = moveKey
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const translatedName =
        GLOBAL_POKE_DB.moveTranslations[formattedKey] || formattedKey;

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

      const badgeElite = gerarBadgeEliteHTML(moveId, pokemon, isFast);

      return `<li ${styleAttribute}>
                <div class="move-header">
                    <img src="${getTypeIcon(moveType)}" alt="${moveType}" class="move-type-icon">
                    <span class="move-name" style="color: ${textColor};">${translatedName} ${badgeElite}</span>
                </div>
                ${statsHtml}
              </li>`;
    };

    // Gera as listas de HTML para PVP
    const pvpFastHtml = fastMoves.map(m => criarHtmlDoMovimentoPVP(m, true)).join("");
    const pvpChargedHtml = chargedMoves.map(m => criarHtmlDoMovimentoPVP(m, false)).join("");

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
      (form) =>
        form && form.speciesName && !form.speciesName.startsWith("Mega "),
    );
    filteredDropdownForms.forEach((form) => {
      const originalIndex = allForms.findIndex(
        (p) => p.speciesId === form.speciesId,
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
          prevPokemon.dex,
        ).padStart(3, "0")}</span></div></div>`
      : `<div class="nav-botao hidden"></div>`;
    const nextButtonHTML = nextPokemon
      ? `<div id="next-pokemon" class="nav-botao"><div class="nav-texto" style="text-align: right;"><strong>Próximo</strong><span>#${String(
          nextPokemon.dex,
        ).padStart(3, "0")}</span></div><img src="${
          nextPokemon.imgNormal || nextPokemon.imgNormalFallback
        }" alt="${nextPokemon.nomeParaExibicao}"></div>`
      : `<div class="nav-botao hidden"></div>`;

    // Usamos .dadosEficacia porque é onde salvamos o json novo
    const htmlDefesa = gerarHtmlFraquezas(
      pokemon.types,
      GLOBAL_POKE_DB.dadosEficacia,
    );

    // =================================================================
    // 3. SIMULAÇÃO DE COMBOS PVE (Com Busca de Pokémon/Tipo)
    // =================================================================

    // Salva o pokemon atual numa variavel global para a função de update usar
    window.pokemonParaSimulacao = pokemon;

    // 1. Gera as opções do Datalist (Tipos + Pokémons Populares)
    const listaTiposBasicos = [
      "Normal",
      "Fogo",
      "Água",
      "Planta",
      "Elétrico",
      "Gelo",
      "Lutador",
      "Venenoso",
      "Terrestre",
      "Voador",
      "Psíquico",
      "Inseto",
      "Pedra",
      "Fantasma",
      "Dragão",
      "Sombrio",
      "Aço",
      "Fada",
    ];
    let datalistHTML = `<option value="Null">Neutro (Padrão)</option>`;

    // Adiciona Tipos
    listaTiposBasicos.forEach((t) => {
      datalistHTML += `<option value="${t}">Tipo Genérico</option>`;
    });

    // Adiciona Pokémons (Limitado a 500 para não travar, ou use lógica de busca dinâmica)
    if (GLOBAL_POKE_DB.pokemonsByNameMap) {
      let contador = 0;
      for (const [key, val] of GLOBAL_POKE_DB.pokemonsByNameMap) {
        // Filtra formas muito específicas para limpar a lista
        if (
          !val.speciesName.includes("Shadow") &&
          !val.speciesName.includes("Purified")
        ) {
          // Formata o nome bonito
          const nomeBonito = formatarNomeParaExibicao(val.speciesName);
          datalistHTML += `<option value="${nomeBonito}">Pokémon</option>`;
          contador++;
        }
        if (contador > 500) break; // Limite de segurança
      }
    }

    // 4. Painel com Dropdown de Clima Customizado
    const painelSimulacaoHTML = `
    <div class="simulacao-box">
        <div class="simulacao-header">
            <h4>⚔️ Melhores Combos (DPS)</h4>
            
            <div class="header-controls-group">
                <div class="control-item">
                    <label>Clima Boost</label>
                    <div class="weather-custom-widget" style="position: relative;">
                        <button id="weather-btn" class="weather-btn" onclick="toggleWeatherDropdown()">
                            <span id="weather-btn-icon">🚫</span>
                            <span id="weather-btn-text">Neutro</span>
                            <span class="arrow down" style="margin-left: 5px; font-size: 8px;"></span>
                        </button>
                        <div id="weather-dropdown" class="weather-dropdown-content"></div>
                    </div>
                </div>

                <div class="control-item">
                    <label>Adversário</label>
                    <div class="dps-search-wrapper" style="position: relative; width: 160px;">
                        <img id="opponent-avatar" src="" style="display: none; position: absolute; left: 8px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; object-fit: contain; z-index: 5; pointer-events: none;">
                        <input 
                            type="text" 
                            id="dps-search-input" 
                            class="opponent-selector" 
                            placeholder="🆚 Inimigo..." 
                            autocomplete="off"
                            style="width: 100%; text-align: left; padding-left: 35px; padding-right: 20px;"
                        >
                        <span style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #bdc3c7; pointer-events: none; font-size: 0.8em;">▼</span>
                        <div id="dps-search-results" class="quick-search-results" style="text-align: left;"></div>
                    </div>
                </div>
            </div>
        </div>

        <div id="lista-melhores-combos" class="combos-list" style="min-height: 50px;"></div>

        <div class="pagination-container">
            <span id="info-paginacao"></span>
            <div id="controles-paginacao"></div>
        </div>
    </div>
`;

// =============================================================
    // 🌟 GERAÇÃO DA SEÇÃO DA LINHA EVOLUTIVA
    // =============================================================
    const familiaEvolutiva = buscarArvoreEvolutiva(pokemon);
    let evolutionHTML = "";
    
    if (familiaEvolutiva.length > 1) {
        // Pega o ID da Família Base (usamos o Dex do estágio 1 como referência)
        const familyIdBase = familiaEvolutiva[0].dex;
        let estagiosHTML = "";
        
        familiaEvolutiva.forEach((membro, idx) => {
            // O efeito de "Você está aqui" (apagado e inativo)
            const isCurrent = membro.dex === pokemon.dex;
            const estiloDestaque = isCurrent ? "opacity: 0.35; filter: grayscale(80%); pointer-events: none;" : "cursor: pointer; transition: transform 0.2s;";
            const imgUrl = membro.imgNormal || membro.imgNormalFallback;
            
            // O Avatar do Pokémon
            estagiosHTML += `
                <div class="evo-stage" style="${estiloDestaque} display: flex; flex-direction: column; align-items: center; padding: 10px;" onclick="window.showPokemonDetails('${membro.speciesId.replace(/-/g, '_').split('_')[0]}', null, '${membro.speciesId}')" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <img src="${imgUrl}" style="width: 75px; height: 75px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));">
                    <span style="color: white; font-size: 0.85em; font-weight: bold; margin-top: 8px; text-shadow: 0 1px 2px black;">${membro.nomeParaExibicao}</span>
                </div>
            `;
            
            // A Seta e o Doce Dinâmico (Se não for a última evolução)
            if (idx < familiaEvolutiva.length - 1) {
                const proxMembro = familiaEvolutiva[idx + 1];
                estagiosHTML += `
                    <div class="evo-arrow-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 5px;">
                        <span style="color: #bdc3c7; font-size: 1.2em; font-weight: bold;">➡️</span>
                        <div style="display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 20px; margin-top: 5px; border: 1px solid rgba(255,255,255,0.2);">
                            <img class="candy-icon-dynamic" data-family="${familyIdBase}" src="https://images.weserv.nl/?url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow/refs/heads/main/assets/imagens/icones/doce_para_pintar.png" style="width: 20px; height: 20px; margin-right: 6px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.8));">
                            <span style="color: white; font-size: 0.8em; font-weight: bold;">${proxMembro._evoCusto || "?"}</span>
                        </div>
                    </div>
                `;
            }
        });

        evolutionHTML = `
            <div class="secao-detalhes evolution-section">
                <h3>Linha Evolutiva</h3>
                <div class="evolution-grid" style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 15px; margin-top: 10px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);">
                    ${estagiosHTML}
                </div>
            </div>
        `;
    }

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

                ${evolutionHTML}

                <div class="secao-detalhes">
                    <h3>Movimentos de Ginásio & Reides</h3>
                    <div class="ataques-grid">
                        <div><h4>Ataques Rápidos</h4><ul>${gymFastHtml}</ul></div>
                        <div><h4>Ataques Carregados</h4><ul>${gymChargedHtml}</ul></div>
                    </div>
                </div>

                <div class="secao-detalhes">
                    ${typeof painelSimulacaoHTML !== "undefined" ? painelSimulacaoHTML : ""}
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

    let seletorRaidHTML = `
    <div class="raid-selector-container" style="margin: 10px 0; text-align: center;">
        <label for="raid-tier-select" style="font-size: 0.8em; color: #ccc;">Nível da Raid: </label>
        <select id="raid-tier-select" onchange="atualizarNivelRaid()" style="background: #222; color: #fff; border: 1px solid #444; padding: 5px; border-radius: 5px;">
            <option value="5">Tier 5 (Lendário)</option>
            <option value="mega">Mega Raid</option>
            <option value="3">Tier 3</option>
            <option value="1">Tier 1</option>
            <option value="elite">Elite / Primal</option>
        </select>
    </div>
`;

    // --- 1. GERA AS OPÇÕES DE MOVIMENTOS DO BOSS ---
    const formatarNomeMov = (nome) => {
      const limpo = nome
        .replace(/_FAST$/, "")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return GLOBAL_POKE_DB.moveTranslations[limpo] || limpo;
    };

    let bossMovesOptions = `<option value="average">⚔️ Moveset Médio (Desconhecido)</option>`;
    if (pokemon.fastMoves && pokemon.chargedMoves) {
      pokemon.fastMoves.forEach((fId) => {
        pokemon.chargedMoves.forEach((cId) => {
          bossMovesOptions += `<option value="${fId}|${cId}">${formatarNomeMov(fId)} + ${formatarNomeMov(cId)}</option>`;
        });
      });
    }


    // --- 2. SEÇÃO DE COUNTERS (JSON Pré-calculado) + SIMULADOR MANUAL ---
    const secaoCountersHTML = `
    <div class="secao-detalhes counters-box">
        
        <div class="raid-config-panel">
            <h3 class="raid-config-header">⚔️ Melhores Counters</h3>
            
            <div class="raid-config-row">
                <select id="raid-tier-select" class="raid-config-select select-tier" onchange="atualizarNivelRaid()">
                    <option value="1" ${window.currentRaidTier === "1" ? "selected" : ""}>Tier 1 ⭐ (600 HP)</option>
                    <option value="2" ${window.currentRaidTier === "2" ? "selected" : ""}>Tier 2 ⭐⭐ (1.800 HP)</option>
                    <option value="3" ${window.currentRaidTier === "3" ? "selected" : ""}>Tier 3 ⭐⭐⭐ (3.600 HP)</option>
                    <option value="4" ${window.currentRaidTier === "4" ? "selected" : ""}>Tier 4 ⭐⭐⭐⭐ (9.000 HP)</option>
                    <option value="5" ${window.currentRaidTier === "5" || !window.currentRaidTier ? "selected" : ""}>Tier 5 ⭐⭐⭐⭐⭐ (15.000 HP)</option>
                    <option value="mega" ${window.currentRaidTier === "mega" ? "selected" : ""}>Mega Raid 🧬 (9.000 HP)</option>
                    <option value="mega_lendaria" ${window.currentRaidTier === "mega_lendaria" ? "selected" : ""}>Mega Lendária ✨ (20.000 HP)</option>
                    <option value="primal" ${window.currentRaidTier === "primal" ? "selected" : ""}>Reversão Primitiva 🌋 (22.500 HP)</option>
                    <option value="dmax_1" ${window.currentRaidTier === "dmax_1" ? "selected" : ""}>Dinamax T1 🔴 (1.700 HP)</option>
                    <option value="dmax_3" ${window.currentRaidTier === "dmax_3" ? "selected" : ""}>Dinamax T3 🔴 (10.000 HP)</option>
                    <option value="dmax_5" ${window.currentRaidTier === "dmax_5" ? "selected" : ""}>Dinamax T5 🔴 (15.000 HP)</option>
                    <option value="gmax_6" ${window.currentRaidTier === "gmax_6" ? "selected" : ""}>Gigantamax T6 🟣 (90.000 HP)</option>
                </select>
                
                <select id="boss-moveset-select" class="raid-config-select select-moveset" onchange="atualizarMovesetBoss()">
                    ${bossMovesOptions}
                </select>
            </div>

            <div class="raid-config-row">
                <select id="raid-weather-select" class="raid-config-select select-weather" onchange="atualizarFiltrosGlobaisPVE()">
                    <option value="Extreme" selected>🌤️ Clima: Neutro (Sem bônus)</option>
                    <option value="ensolarado">☀️ Ensolarado (Fogo, Planta, Terrestre)</option>
                    <option value="chovendo">🌧️ Chuvoso (Água, Elétrico, Inseto)</option>
                    <option value="parcialmente_nublado">⛅ Parc. Nublado (Normal, Pedra)</option>
                    <option value="nublado">☁️ Nublado (Fada, Lutador, Venenoso)</option>
                    <option value="ventando">🌬️ Ventando (Dragão, Voador, Psíquico)</option>
                    <option value="nevando">❄️ Nevando (Gelo, Aço)</option>
                    <option value="neblina">🌫️ Neblina (Sombrio, Fantasma)</option>
                </select>

                <select id="raid-friend-select" class="raid-config-select select-friend" onchange="atualizarFiltrosGlobaisPVE()">
                    <option value="1.00" selected>👤 Amizade: Nenhuma (+0% Dano)</option>
                    <option value="1.03">🥉 Bela Amizade (+3% Dano)</option>
                    <option value="1.05">🥈 Grande Amizade (+5% Dano)</option>
                    <option value="1.07">🥇 Ultra Amizade (+7% Dano)</option>
                    <option value="1.10">💎 Amizade Sem Igual (+10% Dano)</option>
                </select>
            </div>
        </div>

        <div id="lista-counters-display" class="combos-list" style="margin-bottom: 20px;"></div>

        <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.1); margin: 20px 0;">

        <h3 style="margin:0 0 10px 0; width: 100%; text-align: center; color: #bdc3c7;">Ou monte sua própria equipe:</h3>

        <div id="custom-team-simulator-container" style="display: none; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 15px;">
        </div>

        <button id="btn-simular-time" class="show-more-button fade-in" style="background-color: #d35400; color: #fff; font-weight: bold; border: none; border-radius: 8px; font-size: 1.1em; padding: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">
            🎒 Montar Meu Time (6 Pokémon)
        </button>
    </div>
    `;

    // Renderiza a página
    datadexContent.innerHTML = finalHTML + secaoCountersHTML;

    // Dispara a busca do JSON assim que a tela abre!
    setTimeout(() => {
        if (typeof window.atualizarListaCountersUI === "function") {
            window.atualizarListaCountersUI(pokemon);
        }
    }, 100);

    // =================================================================
    // 🚀 LÓGICA DO NOVO BOTÃO DE MONTAR TIME
    // =================================================================
    const btnSimularTime = document.getElementById("btn-simular-time");
    const customTeamContainer = document.getElementById("custom-team-simulator-container");

    if (btnSimularTime && customTeamContainer) {
        btnSimularTime.addEventListener("click", () => {
            // Esconde o botão e revela a arena
            btnSimularTime.style.display = "none";
            customTeamContainer.style.display = "block";

            // Monta o "Esqueleto Visual" dos 6 slots COM O BOTÃO DE MODO LIVRE
            customTeamContainer.innerHTML = `
                    <div class="custom-team-header">
                        <img src="${normalSrc}" class="custom-team-boss-img">
                        <h4 class="custom-team-boss-name">Alvo: ${nomeParaExibicao}</h4>
                        <p class="custom-team-instruction">Selecione até 6 Pokémon para a sua equipe:</p>
                        
                        <label class="custom-team-checkbox-label">
                            <input type="checkbox" id="chk-multi-mega" class="custom-team-checkbox">
                            <span class="custom-team-checkbox-text">Modo Livre: Permitir vários Megas</span>
                        </label>
                    </div>
                    
                    <div id="equipe-slots-container" class="custom-team-grid">
                        ${[1, 2, 3, 4, 5, 6].map(slot => `
                            <div class="team-slot" data-slot="${slot}">
                                <span class="team-slot-plus">+</span>
                                <span class="team-slot-text">Slot ${slot}</span>
                            </div>
                        `).join("")}
                    </div>

                    <button id="btn-rodar-simulacao-equipe" class="show-more-button btn-start-battle">
                        ▶️ Iniciar Batalha
                    </button>
                `;
            // Adiciona efeito visual aos slots recém-criados
            // =================================================================
            // 🎒 ARRAY GLOBAL DO TIME (Guarda os 6 Pokémon escolhidos)
            // =================================================================
            window.meuTimeCustomizado = [null, null, null, null, null, null];

            // 1. Adiciona os eventos de clique nos slots para abrir o Menu
            document.querySelectorAll(".team-slot").forEach(slot => {
                slot.addEventListener("mouseover", () => slot.style.borderColor = "#fff");
                slot.addEventListener("mouseout", () => slot.style.borderColor = "#4a637e");
                
                slot.addEventListener("click", function() {
                    const numeroSlot = this.dataset.slot;
                    abrirMenuMontagemDeSlot(numeroSlot);
                });
            });

            // =================================================================
            // 🔍 O MOTOR DO MENU DE SELEÇÃO (COM BOTÃO VOLTAR E TRAVA DE MEGAS)
            // =================================================================
            function abrirMenuMontagemDeSlot(slotIndex) {
                const modalAntigo = document.getElementById("modal-selecao-time");
                if (modalAntigo) modalAntigo.remove();

                // (O que você já tem no código, logo acima do innerHTML)
                const modal = document.createElement("div");
                modal.id = "modal-selecao-time";
                
                // MUDANÇA 1: Troque o modal.style.cssText por modal.className!
                modal.className = "team-modal-overlay"; 

                // MUDANÇA 2: O HTML Limpo
                modal.innerHTML = `
                    <div class="team-modal-content">
                        <div class="team-modal-header">
                            <h3 class="team-modal-title">🎒 Configurar Slot ${slotIndex}</h3>
                            <button id="fechar-modal-time" class="team-modal-close">&times;</button>
                        </div>
                        <div class="team-modal-body">
                            
                            <div id="etapa-busca">
                                <p class="team-modal-help-text">Digite um nome ou escolha um sugerido:</p>
                                <input type="text" id="busca-pokemon-time" class="team-modal-search-input" placeholder="🔍 Ex: Machamp..." autocomplete="off">
                                <div id="resultados-busca-time" class="team-modal-search-results"></div>
                            </div>

                            <div id="etapa-config" class="team-modal-config-wrapper" style="display: none;">
                                
                                <button id="btn-voltar-busca" class="team-modal-back-btn">
                                    ⬅️ Escolher outro Pokémon
                                </button>

                                <div class="team-modal-selected-pokemon">
                                    <img id="config-img" src="" class="team-modal-selected-img">
                                    <h4 id="config-nome" class="team-modal-selected-name">Nome</h4>
                                </div>
                                
                                <div class="team-modal-stats-grid">
                                    <div>
                                        <label class="team-modal-label">Nível</label>
                                        <select id="config-nivel" class="team-modal-select">
                                            ${Array.from({length: 50}, (_, i) => `<option value="${i+1}" ${i+1 === 40 ? 'selected' : ''}>Nv. ${i+1}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="team-modal-label">IVs (Atk/Def/HP)</label>
                                        <select id="config-ivs" class="team-modal-select">
                                            <option value="15">15 / 15 / 15 (100%)</option>
                                            <option value="14">14 / 14 / 14 (93%)</option>
                                            <option value="12">12 / 12 / 12 (80%)</option>
                                            <option value="10">10 / 10 / 10 (Mínimo)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="team-modal-label">Ataque Rápido</label>
                                    <select id="config-fast" class="team-modal-select margin-bot"></select>
                                    
                                    <label class="team-modal-label">Ataque Carregado</label>
                                    <select id="config-charged" class="team-modal-select"></select>
                                </div>
                                
                                <button id="btn-confirmar-pokemon" class="team-modal-confirm-btn">
                                    ✅ Confirmar Neste Slot
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(modal);

                document.getElementById("fechar-modal-time").onclick = () => modal.remove();

                const inputBusca = document.getElementById("busca-pokemon-time");
                const divResultados = document.getElementById("resultados-busca-time");
                const etapaBusca = document.getElementById("etapa-busca");
                const etapaConfig = document.getElementById("etapa-config");
                
                let pokemonSelecionadoParaOSlot = null;

                // ✨ LÓGICA DO BOTÃO VOLTAR ✨
                document.getElementById("btn-voltar-busca").addEventListener("click", () => {
                    pokemonSelecionadoParaOSlot = null;
                    etapaConfig.style.display = "none";
                    etapaBusca.style.display = "block"; // Volta a mostrar a barra de pesquisa!
                });

                const formatarGolpe = (mId) => {
                    const limpo = mId.replace(/_FAST$/, "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                    return (typeof GLOBAL_POKE_DB !== "undefined" && GLOBAL_POKE_DB.moveTranslations[limpo]) ? GLOBAL_POKE_DB.moveTranslations[limpo] : limpo;
                };

                const mostrarSugestoesTop6 = () => {
                    divResultados.innerHTML = "";
                    
                    // 1. Verifica se os dados do Motor 10.0 (JSON) estão carregados na NOVA variável global
                    if (!window.rawPveData || window.rawPveData.length === 0) {
                        return; // Se não carregou ainda, fica em branco
                    }

                    divResultados.innerHTML = "<p style='color:#f1c40f; font-size:0.85em; margin-bottom:8px; font-weight:bold;'>🏆 Top 30 Counters Sugeridos:</p>";
                    
                    // 2. Agrupa o rawPveData pelo ID do Pokémon para pegar só o melhor moveset de cada bicho
                    const agrupado = {};
                    window.rawPveData.forEach(c => {
                        if (!agrupado[c.i]) {
                            agrupado[c.i] = c;
                        } else if (c.e < agrupado[c.i].e) {
                            agrupado[c.i] = c; // Guarda sempre o que tem menor estimador (melhor)
                        }
                    });

                    // 3. Transforma em lista, ordena pelo Estimador ("e") e corta os 30 melhores
                    const top30 = Object.values(agrupado)
                        .sort((a, b) => a.e - b.e)
                        .slice(0, 30);

                    top30.forEach((c, idx) => {
                        // Acha o Pokémon na base de dados
                        let poke = allPokemonDataForList.find(p => p.speciesId === c.i);
                        if (!poke) poke = buscarDadosCompletosPokemon(c.n, GLOBAL_POKE_DB);
                        if (!poke) return;

                        const item = document.createElement("div");
                        item.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(241, 196, 15, 0.1); border: 1px solid rgba(241, 196, 15, 0.3); margin-bottom: 6px; cursor: pointer; border-radius: 8px;";
                        
                        item.innerHTML = `
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span style="color:#f1c40f; font-weight:bold; font-size:1.2em; width: 15px;">${idx+1}</span>
                                <img src="${poke.imgNormal || poke.imgNormalFallback}" style="width:35px; height:35px; object-fit:contain; filter:drop-shadow(0 2px 2px rgba(0,0,0,0.5));">
                                <div style="display:flex; flex-direction:column;">
                                    <span style="color:white; font-size:0.95em; font-weight:bold;">${poke.nomeParaExibicao}</span>
                                    <span style="color:#bdc3c7; font-size:0.7em;">DPS: ${c.d.toFixed(1)} | Est: ${c.e.toFixed(2)}</span>
                                </div>
                            </div>
                            <span style="background:#27ae60; color:white; font-size:0.65em; padding:3px 6px; border-radius:4px; font-weight:bold;">Sugerido</span>
                        `;
                        
                        item.addEventListener("click", () => {
                            pokemonSelecionadoParaOSlot = poke;
                            etapaBusca.style.display = "none";
                            etapaConfig.style.display = "flex";
                            document.getElementById("config-img").src = poke.imgNormal || poke.imgNormalFallback;
                            document.getElementById("config-nome").innerText = poke.nomeParaExibicao;

                            const selectFast = document.getElementById("config-fast");
                            const selectCharged = document.getElementById("config-charged");
                            
                            selectFast.innerHTML = poke.fastMoves.map(m => `<option value="${m}">${formatarGolpe(m)}</option>`).join("");
                            selectCharged.innerHTML = poke.chargedMoves.map(m => `<option value="${m}">${formatarGolpe(m)}</option>`).join("");
                            
                            // Seleciona automaticamente os melhores golpes sugeridos pelo Motor
                            if (c.f) selectFast.value = c.f;
                            if (c.c) selectCharged.value = c.c;
                        });
                        divResultados.appendChild(item);
                    });
                };

                mostrarSugestoesTop6();

                inputBusca.addEventListener("input", (e) => {
                    const termo = e.target.value.toLowerCase().trim();
                    
                    if (termo.length < 2) {
                        mostrarSugestoesTop6();
                        return;
                    }

                    divResultados.innerHTML = "<p style='color:#3498db; font-size:0.85em; margin-bottom:8px;'>🔍 Resultados da busca:</p>";
                    const filtrados = allPokemonDataForList.filter(p => 
                        (p.nomeParaExibicao.toLowerCase().includes(termo) || String(p.dex).includes(termo))
                    ).slice(0, 10);

                    filtrados.forEach(poke => {
                        const item = document.createElement("div");
                        item.style.cssText = "display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.05); margin-bottom: 5px; cursor: pointer; border-radius: 6px;";
                        item.innerHTML = `
                            <img src="${poke.imgNormal || poke.imgNormalFallback}" style="width:30px; height:30px; object-fit:contain;">
                            <span style="color:white; font-size:0.9em;">${poke.nomeParaExibicao}</span>
                        `;
                        
                        item.addEventListener("click", () => {
                            pokemonSelecionadoParaOSlot = poke;
                            etapaBusca.style.display = "none";
                            etapaConfig.style.display = "flex";
                            document.getElementById("config-img").src = poke.imgNormal || poke.imgNormalFallback;
                            document.getElementById("config-nome").innerText = poke.nomeParaExibicao;

                            const selectFast = document.getElementById("config-fast");
                            const selectCharged = document.getElementById("config-charged");
                            selectFast.innerHTML = poke.fastMoves.map(m => `<option value="${m}">${formatarGolpe(m)}</option>`).join("");
                            selectCharged.innerHTML = poke.chargedMoves.map(m => `<option value="${m}">${formatarGolpe(m)}</option>`).join("");
                        });
                        divResultados.appendChild(item);
                    });
                });

                // Confirma e Salva no Slot
                document.getElementById("btn-confirmar-pokemon").addEventListener("click", () => {
                    if (!pokemonSelecionadoParaOSlot) return;

                    const checarSeEhMega = (nome) => {
                        if (!nome) return false;
                        const n = nome.toLowerCase();
                        return n.startsWith("mega ") || n.includes("(mega)") || n.startsWith("primal ") || n.includes("(primal)");
                    };

                    const nomeDoBicho = pokemonSelecionadoParaOSlot.speciesName;
                    const modoLivreAtivado = document.getElementById("chk-multi-mega")?.checked;

                    if (!modoLivreAtivado && checarSeEhMega(nomeDoBicho)) {
                        const jaTemMegaNoTime = window.meuTimeCustomizado.some((slotInfo, indexAtual) => {
                            if (!slotInfo || indexAtual === (slotIndex - 1)) return false;
                            return checarSeEhMega(slotInfo.pokemon.speciesName);
                        });

                        if (jaTemMegaNoTime) {
                            let aviso = document.getElementById("aviso-mega-duplicado");
                            if (!aviso) {
                                aviso = document.createElement("div");
                                aviso.id = "aviso-mega-duplicado";
                                aviso.style.cssText = "background: rgba(231, 76, 60, 0.15); border: 1px solid #e74c3c; color: #ff7979; padding: 12px; border-radius: 8px; font-size: 0.9em; text-align: center; margin-top: 5px; margin-bottom: 10px; animation: shake 0.4s ease-in-out;";
                                aviso.innerHTML = "⚠️ <strong>Ação Bloqueada:</strong><br>Apenas um Mega por time!<br><small style='color:#ccc;'>(Marque o 'Modo Livre' na tela anterior para ignorar isso)</small>";
                                
                                if (!document.getElementById("animacao-shake")) {
                                    const style = document.createElement('style');
                                    style.id = "animacao-shake";
                                    style.innerHTML = `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }`;
                                    document.head.appendChild(style);
                                }

                                const btnConfirmar = document.getElementById("btn-confirmar-pokemon");
                                btnConfirmar.parentNode.insertBefore(aviso, btnConfirmar);
                                setTimeout(() => { if (aviso) aviso.remove(); }, 4000);
                            }
                            return; 
                        }
                    }

                    const configDoUsuario = {
                        pokemon: pokemonSelecionadoParaOSlot,
                        nivel: parseInt(document.getElementById("config-nivel").value),
                        iv: parseInt(document.getElementById("config-ivs").value),
                        fast: document.getElementById("config-fast").value,
                        charged: document.getElementById("config-charged").value
                    };

                    window.meuTimeCustomizado[slotIndex - 1] = configDoUsuario;

                    const slotDiv = document.querySelector(`.team-slot[data-slot="${slotIndex}"]`);
                    slotDiv.style.border = "2px solid #2ecc71";
                    slotDiv.style.background = "rgba(46, 204, 113, 0.1)";
                    slotDiv.innerHTML = `
                        <img src="${pokemonSelecionadoParaOSlot.imgNormal || pokemonSelecionadoParaOSlot.imgNormalFallback}" style="width: 50px; height: 50px; object-fit: contain;">
                        <span style="font-size: 0.7em; color: white; text-align: center; line-height: 1.1; margin-top: 5px;">
                            ${formatarGolpe(configDoUsuario.fast).split(" ")[0]}<br>
                            ${formatarGolpe(configDoUsuario.charged).split(" ")[0]}
                        </span>
                        <div style="position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                            ${configDoUsuario.nivel}
                        </div>
                    `;
                    slotDiv.style.position = "relative";

                    const btnBatalha = document.getElementById("btn-rodar-simulacao-equipe");
                    btnBatalha.style.opacity = "1";
                    btnBatalha.style.pointerEvents = "auto";
                    btnBatalha.style.cursor = "pointer";

                    modal.remove();
                });
            }
            // =================================================================
            // ⚔️ MOTOR DE BATALHA DO TIME CUSTOMIZADO
            // (Cole isso logo abaixo da função abrirMenuMontagemDeSlot)
            // =================================================================
            
            const btnBatalha = document.getElementById("btn-rodar-simulacao-equipe");
            
           // =================================================================
            // ⚔️ MOTOR 10.0 DA MOCHILA: SIMULAÇÃO MONTE CARLO (500x)
            // =================================================================
            btnBatalha.addEventListener("click", async () => {
                const timeAtivo = window.meuTimeCustomizado.filter(p => p !== null);
                
                if (timeAtivo.length === 0) {
                    alert("⚠️ Você precisa colocar pelo menos 1 Pokémon no time para lutar!");
                    return;
                }

                // Efeito visual de carregamento
                btnBatalha.innerHTML = "⏳ Simulando 500 Realidades...";
                btnBatalha.style.opacity = "0.5";
                btnBatalha.style.pointerEvents = "none";

                // Pausa para desenhar o botão
                await new Promise(resolve => setTimeout(resolve, 50));

                // 🌟 TABELA INTELIGENTE DE HP (FRONT-END)
                const tierAtual = window.currentRaidTier || "5";
                const mapaRaidHP = { "1": 600, "2": 1800, "3": 3600, "4": 9000, "5": 15000, "mega": 9000, "mega_lendaria": 22500, "primal": 22500, "dmax_1": 1700, "dmax_3": 10000, "dmax_5": 15000, "gmax_6": 90000 };
                const bossHPMax = mapaRaidHP[tierAtual] || 15000;
                const tempoMaximoRaid = (["1", "2", "3", "4", "dmax_1", "dmax_3"].includes(tierAtual)) ? 180 : 300; 

                const oponenteMock = {
                    nome: window.pokemonParaSimulacao.nomeParaExibicao,
                    tipos: window.pokemonParaSimulacao.types,
                    baseStats: window.pokemonParaSimulacao.baseStats,
                    selectedMoveset: window.currentBossMoveset
                };

                // ==========================================
                // 1. PRÉ-CÁLCULO (Agora com leitura do Motor 10!)
                // ==========================================
                const friendMult = window.currentPveFriendship || 1.0;
                const weather = window.currentWeather || "Extreme";

                const membrosCalculados = timeAtivo.map(membro => {
                    const cpmIndex = Math.round((membro.nivel - 1) * 2);
                    const cpmMembro = cpms[cpmIndex] || 0.7903; 

                    let dpsBase = 0;
                    let tempoDeVidaBase = 0.1;

                    // 🌟 O CÉREBRO: Tenta pegar a matemática perfeita do Motor 10 (JSON)!
                    let achouNoM10 = false;
                    if (window.rawPveData && window.rawPveData.length > 0) {
                        const dadosM10 = window.rawPveData.find(c => 
                            c.i === membro.pokemon.speciesId && 
                            (c.f === membro.fast || c.f === membro.fast.replace("_FAST", "")) && 
                            c.c === membro.charged
                        );

                        if (dadosM10) {
                            // Calcula o Clima igual a Tabela Oficial
                            let fType = "normal", cType = "normal";
                            const fData = GLOBAL_POKE_DB.gymFastMap?.get(membro.fast) || GLOBAL_POKE_DB.moveDataMap?.get(membro.fast);
                            if(fData && fData.type) fType = fData.type.toLowerCase();
                            const cData = GLOBAL_POKE_DB.gymChargedMap?.get(membro.charged) || GLOBAL_POKE_DB.moveDataMap?.get(membro.charged);
                            if(cData && cData.type) cType = cData.type.toLowerCase();

                            const wMultF = (typeof CLIMA_BOOSTS !== "undefined" && CLIMA_BOOSTS[weather] && CLIMA_BOOSTS[weather].includes(fType)) ? 1.2 : 1.0;
                            const wMultC = (typeof CLIMA_BOOSTS !== "undefined" && CLIMA_BOOSTS[weather] && CLIMA_BOOSTS[weather].includes(cType)) ? 1.2 : 1.0;
                            
                            const weatherMult = (wMultF * 0.30) + (wMultC * 0.70); 
                            const finalMult = friendMult * weatherMult;

                            // Converte o Dano do Nível 40 (M10) para o Nível escolhido na Mochila
                            const fatorNivelM10 = cpmMembro / 0.7903; 
                            
                            dpsBase = dadosM10.d * fatorNivelM10 * finalMult;
                            const tdoBase = dadosM10.td * fatorNivelM10 * finalMult;
                            tempoDeVidaBase = dpsBase > 0 ? tdoBase / dpsBase : 0.1;
                            achouNoM10 = true;
                        }
                    }

                    // 🚨 PLANO B: Se não tá no Top Counters do M10, usa a matemática velha reduzida
                    if (!achouNoM10) {
                        const combosGerais = calcularMelhoresCombos(membro.pokemon, oponenteMock, weather);
                        const comboEscolhido = combosGerais.find(c => 
                            (c.fast.moveId === membro.fast || c.fast.name === membro.fast) && 
                            (c.charged.moveId === membro.charged || c.charged.name === membro.charged)
                        ) || combosGerais[0];

                        const fatorNivel = cpmMembro / 0.8403; 
                        
                        dpsBase = (comboEscolhido.dps * 0.75) * fatorNivel * friendMult;
                        const tdoBase = (comboEscolhido.tdo * 0.75) * fatorNivel * friendMult;
                        tempoDeVidaBase = dpsBase > 0 ? tdoBase / dpsBase : 0.1;
                    }

                    return { ...membro, dpsBase, tempoDeVidaBase, danoTotal: 0, tempoTotal: 0, vidas: 0 };
                });

                // ==========================================
                // 🎲 O LOOP DE MONTE CARLO (500 LUTAS MÁGICAS)
                // ==========================================
                const QTD_LUTAS = 500;
                let vitorias = 0;
                let somaTempoTodasLutas = 0;
                let somaDanoTodasLutas = 0;
                let idasAoLobbyTotal = 0;

                for (let i = 0; i < QTD_LUTAS; i++) {
                    let danoNestaLuta = 0;
                    let tempoNestaLuta = 0;
                    let timeFoiDizimado = true;

                    // A batalha corre até o tempo acabar ou o Boss morrer
                    while (tempoNestaLuta < tempoMaximoRaid && danoNestaLuta < bossHPMax) {
                        timeFoiDizimado = true;

                        for (let j = 0; j < membrosCalculados.length; j++) {
                            let stats = membrosCalculados[j];
                            let tempoRestante = tempoMaximoRaid - tempoNestaLuta;
                            let hpRestanteBoss = bossHPMax - danoNestaLuta;

                            if (tempoRestante <= 0 || hpRestanteBoss <= 0) break;

                            // 🎲 RNG DO BOSS: Simula atrasos, ataques antecipados e sorte/azar (Variação de ±20% na sobrevivência)
                            const rng = 0.80 + (Math.random() * 0.40);
                            let tempoQueEleFicaVivo = stats.tempoDeVidaBase * rng;
                            let dpsRealNestaVida = stats.dpsBase; 

                            let tempoParaMatarOBoss = hpRestanteBoss / dpsRealNestaVida;

                            if (tempoQueEleFicaVivo > tempoRestante || tempoQueEleFicaVivo > tempoParaMatarOBoss) {
                                tempoQueEleFicaVivo = Math.min(tempoRestante, tempoParaMatarOBoss);
                                timeFoiDizimado = false; 
                            }

                            let danoQueEleCausa = tempoQueEleFicaVivo * dpsRealNestaVida;

                            danoNestaLuta += danoQueEleCausa;
                            tempoNestaLuta += tempoQueEleFicaVivo;

                            stats.danoTotal += danoQueEleCausa;
                            stats.tempoTotal += tempoQueEleFicaVivo;
                            stats.vidas += 1;
                        }

                        if (timeFoiDizimado && tempoNestaLuta < tempoMaximoRaid && danoNestaLuta < bossHPMax) {
                            idasAoLobbyTotal++;
                            tempoNestaLuta += 15; // Penalidade do Lobby
                        }
                    }

                    somaTempoTodasLutas += tempoNestaLuta;
                    somaDanoTodasLutas += danoNestaLuta;
                    if (danoNestaLuta >= bossHPMax) vitorias++;
                }

                // ==========================================
                // 📊 TIRANDO A MÉDIA EXATA DAS 500 LUTAS
                // ==========================================
                const danoMedioDoTime = somaDanoTodasLutas / QTD_LUTAS;
                const tempoMedioSobrevivido = somaTempoTodasLutas / QTD_LUTAS;
                const mediaIdasAoLobby = idasAoLobbyTotal / QTD_LUTAS;
                
                // Win Rate (% de vitória nas 500 lutas)
                const winRate = ((vitorias / QTD_LUTAS) * 100).toFixed(1);
                const venceu = vitorias > (QTD_LUTAS / 2); // Considera vitória se a Win Rate > 50%
                const classeResultado = venceu ? 'win' : 'loss';

                // Relatório médio dos 6 guerreiros
                let relatorioMembros = membrosCalculados.map(m => {
                    const avgDano = m.danoTotal / QTD_LUTAS;
                    const avgTempo = m.tempoTotal / QTD_LUTAS;
                    return {
                        nome: m.pokemon.nomeParaExibicao,
                        img: m.pokemon.imgNormal || m.pokemon.imgNormalFallback,
                        dano: Math.round(avgDano),
                        tempo: avgTempo.toFixed(1),
                        dps: avgTempo > 0 ? (avgDano / avgTempo).toFixed(1) : "0.0",
                        vidasMedias: (m.vidas / QTD_LUTAS).toFixed(1)
                    };
                }).sort((a, b) => b.dano - a.dano);

                // 🎨 DESENHANDO A TELA DE RELATÓRIO DO MOTOR 10
                let htmlResultado = `
                    <div class="battle-result-container ${classeResultado}">
                        <h2 class="battle-result-title">
                            ${venceu ? '🏆 VITÓRIA!' : '💀 DERROTA...'}
                        </h2>
                        
                        <div class="battle-stats-grid">
                            <div>
                                <span class="battle-stat-label">Taxa de Vitória</span><br>
                                <strong class="battle-stat-value large" style="color:${venceu ? '#2ecc71' : '#f1c40f'};">${winRate}%</strong>
                            </div>
                            <div>
                                <span class="battle-stat-label">Dano Médio</span><br>
                                <strong class="battle-stat-value">${Math.round(danoMedioDoTime)} <span class="battle-stat-sub">/ ${bossHPMax}</span></strong>
                            </div>
                            <div>
                                <span class="battle-stat-label">Relógio (Média)</span><br>
                                <strong class="battle-stat-value">${tempoMedioSobrevivido.toFixed(0)}s <span class="battle-stat-sub">/ ${tempoMaximoRaid}s</span></strong>
                            </div>
                        </div>

                        ${mediaIdasAoLobby > 0 ? `<div class="battle-lobby-warning">🔄 O time precisou visitar o Lobby <strong>${mediaIdasAoLobby.toFixed(1)} vez(es)</strong> em média.</div>` : ''}
                        
                        <h4 class="battle-team-title">📊 Média de Desempenho (500 Lutas)</h4>
                        <div class="battle-team-list">
                `;

                relatorioMembros.forEach((m, idx) => {
                    htmlResultado += `
                        <div class="battle-member-row">
                            <div class="battle-member-info">
                                <span class="battle-member-rank">${idx + 1}</span>
                                <img src="${m.img}" class="battle-member-img">
                                <span class="battle-member-name">${m.nome}</span>
                            </div>
                            <div class="battle-member-stats">
                                <span class="battle-member-dmg">⚔️ ${m.dano} Dano</span><br>
                                <span class="battle-member-details">DPS: ${m.dps} | ⏱️ Mortes Médias: ${m.vidasMedias}</span>
                            </div>
                        </div>
                    `;
                });

                htmlResultado += `
                        </div>
                        <button id="btn-voltar-montagem" class="btn-voltar-montagem">
                            🔄 Ajustar meu Time e Tentar de Novo
                        </button>
                    </div>
                `;

                document.getElementById("equipe-slots-container").style.display = "none";
                btnBatalha.style.display = "none";
                
                const divResultados = document.createElement("div");
                divResultados.id = "tela-resultados-batalha";
                divResultados.innerHTML = htmlResultado;
                document.getElementById("custom-team-simulator-container").appendChild(divResultados);

                document.getElementById("btn-voltar-montagem").addEventListener("click", () => {
                    divResultados.remove();
                    document.getElementById("equipe-slots-container").style.display = "grid";
                    btnBatalha.style.display = "block";
                    btnBatalha.innerHTML = "▶️ Iniciar Batalha";
                    btnBatalha.style.pointerEvents = "auto";
                    btnBatalha.style.opacity = "1";
                });
            });
        });
    }

    // Lista de Climas com Imagens
    const weatherOptions = [
      { id: "Extreme", label: "Neutro", img: "" },
      { id: "ensolarado", label: "Ensolarado", img: "ensolarado.png" },
      { id: "chovendo", label: "Chuvoso", img: "chovendo.png" },
      {
        id: "parcialmente_nublado",
        label: "Parc. Nublado",
        img: "parcialmente_nublado.png",
      },
      { id: "nublado", label: "Nublado", img: "nublado.png" },
      { id: "ventando", label: "Ventando", img: "ventando.png" },
      { id: "nevando", label: "Nevando", img: "nevando.png" },
      { id: "neblina", label: "Neblina", img: "neblina.png" },
    ];

    // --- LÓGICA DO DROPDOWN DE CLIMA (SUBSTITUA O SEU POR ESTE) ---
    const wBtn = document.getElementById("weather-btn");
    const wList = document.getElementById("weather-dropdown");
    const wIcon = document.getElementById("weather-btn-icon");
    const wText = document.getElementById("weather-btn-text");

    // [NOVO] SINCRONIZAÇÃO: Faz o botão mostrar o clima que já estava selecionado
    const climaSalvo =
      weatherOptions.find((o) => o.id === window.currentWeather) ||
      weatherOptions[0];
    if (climaSalvo.img) {
      wIcon.innerHTML = `<img src="https://images.weserv.nl/?url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/clima/${climaSalvo.img}&w=40" style="width: 20px; height: 20px; object-fit: contain;">`;
    } else {
      wIcon.innerHTML = "🚫";
    }
    wText.innerText = climaSalvo.label;

    window.toggleWeatherDropdown = function () {
      if (wList) wList.classList.toggle("show");
    };

    if (wList) {
      wList.innerHTML = ""; // Limpa para não duplicar itens
      weatherOptions.forEach((opt) => {
        const div = document.createElement("div");
        div.className = "weather-option";

        let imgHTML = opt.img
          ? `<img src="https://images.weserv.nl/?url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/clima/${opt.img}&w=40">`
          : `<span style="width: 24px; text-align: center;">🚫</span>`;

        div.innerHTML = `${imgHTML} <span>${opt.label}</span>`;

        div.addEventListener("click", () => {
          window.currentWeather = opt.id; // Salva globalmente

          // Atualiza o visual do botão
          if (opt.img) {
            wIcon.innerHTML = `<img src="https://images.weserv.nl/?url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/clima/${opt.img}&w=40" style="width: 20px; height: 20px; object-fit: contain;">`;
          } else {
            wIcon.innerHTML = "🚫";
          }
          wText.innerText = opt.label;
          wList.classList.remove("show");

          // [CORREÇÃO] DISPARA O RECALCULO:
          // Pegamos o valor que está no input de busca para não perder o oponente atual
          const oponenteAtual =
            document.getElementById("dps-search-input").value;
          window.atualizarSimulacaoUI(oponenteAtual);
        });

        wList.appendChild(div);
      });

      document.addEventListener("click", (e) => {
        if (wBtn && !wBtn.contains(e.target) && !wList.contains(e.target)) {
          wList.classList.remove("show");
        }
      });
    }

    const dpsInput = document.getElementById("dps-search-input");
    const dpsResults = document.getElementById("dps-search-results");

    if (dpsInput && dpsResults) {
      // --- NOVO: LÓGICA PARA LIMPAR AO CLICAR ---
      dpsInput.addEventListener("click", function () {
        this.value = ""; // Limpa o texto

        // Reseta a foto do adversário
        const avatar = document.getElementById("opponent-avatar");
        if (avatar) {
          avatar.style.display = "none";
          this.style.paddingLeft = "10px"; // Volta o padding original
        }

        // Força abrir a lista de sugestões padrão (Neutro, Tipos...)
        this.dispatchEvent(new Event("input"));
      });

      // Função para desenhar a lista
      const renderDPSList = (items) => {
        dpsResults.innerHTML = "";
        if (items.length === 0) {
          dpsResults.style.display = "none";
          return;
        }

        items.forEach((item) => {
          const div = document.createElement("div");
          div.className = "quick-result-item"; // Reutiliza a classe da outra busca

          // Se for Pokémon, tem imagem. Se for Tipo/Neutro, usa ícone genérico ou do tipo.
          let iconHTML = "";
          if (item.img) {
            iconHTML = `<img src="${item.img}" style="width: 25px; height: 25px; object-fit: contain;">`;
          } else if (item.type === "type") {
            const typeIcon = getTypeIcon(
              TYPE_TRANSLATION_MAP[item.value.toLowerCase()] || item.value,
            );
            iconHTML = `<img src="${typeIcon}" style="width: 20px; height: 20px;">`;
          } else {
            iconHTML = `<span style="font-size: 1.2em;">🛡️</span>`; // Ícone para Neutro
          }

          div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        ${iconHTML}
                        <span style="font-size: 0.9em; color: #ecf0f1;">${item.label}</span>
                    </div>
                `;

          div.addEventListener("click", () => {
            dpsInput.value = item.label; // Nome do Pokémon no texto
            dpsResults.style.display = "none"; // Fecha a lista

            const avatar = document.getElementById("opponent-avatar");
            if (avatar) {
              if (item.img) {
                avatar.src = item.img;
                avatar.style.display = "block";
                dpsInput.style.paddingLeft = "35px"; // Abre espaço para a foto
              } else {
                avatar.style.display = "none";
                dpsInput.style.paddingLeft = "10px"; // Volta ao normal se for tipo/neutro
              }
            }

            window.atualizarSimulacaoUI(item.value); // Roda o cálculo
          });

          dpsResults.appendChild(div);
        });
        dpsResults.style.display = "block";
      };

      // Dados Padrão (Tipos e Neutro)
      const defaultOptions = [
        { label: "Neutro (Padrão)", value: "Null", type: "system" },
        ...Object.keys(TYPE_TRANSLATION_MAP)
          .map((k) => ({
            label: TYPE_TRANSLATION_MAP[k],
            value: TYPE_TRANSLATION_MAP[k],
            type: "type",
          }))
          .sort((a, b) => a.label.localeCompare(b.label)), // Ordena alfabeticamente
      ];

      // Evento: Focar no campo (Mostra opções padrão)
      dpsInput.addEventListener("focus", () => {
        if (dpsInput.value.trim() === "") {
          renderDPSList(defaultOptions);
        } else {
          // Se já tem texto, dispara o evento de input para filtrar
          dpsInput.dispatchEvent(new Event("input"));
        }
      });

      // Evento: Digitar
      dpsInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();

        if (term.length < 1) {
          renderDPSList(defaultOptions);
          return;
        }

        // 1. Filtra Tipos
        const filteredTypes = defaultOptions.filter((opt) =>
          opt.label.toLowerCase().includes(term),
        );

        // 2. Filtra Pokémons
        const filteredMons = allPokemonDataForList
          .filter(
            (p) =>
              (p.nomeParaExibicao.toLowerCase().includes(term) ||
                String(p.dex).includes(term)) &&
              !p.speciesName.startsWith("Mega ") &&
              !p.speciesName.includes("Shadow"),
          )
          .slice(0, 5)
          .map((p) => ({
            label: p.nomeParaExibicao,
            value: p.nomeParaExibicao,
            img: p.imgNormal || p.imgNormalFallback,
            type: "pokemon",
          }));

        renderDPSList([...filteredTypes, ...filteredMons]);
      });

      // Fechar ao clicar fora
      document.addEventListener("click", (e) => {
        if (!dpsInput.contains(e.target) && !dpsResults.contains(e.target)) {
          dpsResults.style.display = "none";
        }
      });
    }
    // ▲▲▲ FIM DA NOVA LÓGICA DPS ▲▲▲

    attachImageFallbackHandler(
      datadexContent.querySelector(".imagem-container img"),
      pokemon,
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
        const filtered = allPokemonDataForList
          .filter(
            (p) =>
              (p.nomeParaExibicao.toLowerCase().includes(term) ||
                String(p.dex).includes(term)) &&
              !p.speciesName.startsWith("Mega ") &&
              !p.speciesName.includes("Shadow"),
          )
          .slice(0, 6); // Mostra só 6 resultados

        if (filtered.length > 0) {
          quickResults.style.display = "block";
          filtered.forEach((p) => {
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
              if (
                [
                  "nidoran",
                  "meowstic",
                  "indeedee",
                  "basculegion",
                  "oinkologne",
                  "tapu",
                ].includes(baseId)
              ) {
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
        if (
          !quickInput.contains(e.target) &&
          !quickResults.contains(e.target)
        ) {
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
      if (
        prevBaseId === "nidoran" ||
        prevBaseId === "meowstic" ||
        prevBaseId === "indeedee" ||
        prevBaseId === "basculegion" ||
        prevBaseId === "oinkologne" ||
        prevBaseId === "tapu"
      ) {
        prevBaseId = prevFullId;
      }
      showPokemonDetails(prevBaseId, navigationList, prevFullId);
    });

    document.getElementById("next-pokemon")?.addEventListener("click", () => {
      let nextBaseId = nextPokemon.speciesId.replace("-", "_").split("_")[0];
      const nextFullId = nextPokemon.speciesId;
      if (
        nextBaseId === "nidoran" ||
        nextBaseId === "meowstic" ||
        nextBaseId === "indeedee" ||
        nextBaseId === "basculegion" ||
        nextBaseId === "oinkologne" ||
        nextBaseId === "tapu"
      ) {
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

    // Seed para o dropdown
    const dropdownImgs = datadexContent.querySelectorAll(
      ".form-dropdown-item img, .form-dropdown-selected img",
    );
    dropdownImgs.forEach((img) => {
      if (img.parentElement.classList.contains("form-dropdown-selected")) {
        attachImageFallbackHandler(img, pokemon);
      } else if (img.parentElement.classList.contains("form-dropdown-item")) {
        const index = img.parentElement.dataset.index;
        const formPokemon = allForms[index];
        if (formPokemon) attachImageFallbackHandler(img, formPokemon);
      }
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
    // Dispara a pintura dos doces APÓS a página renderizar para não causar travamentos
    setTimeout(async () => {
        const candyIcons = datadexContent.querySelectorAll(".candy-icon-dynamic");
        for (const icon of candyIcons) {
            const familyId = parseInt(icon.dataset.family);
            if (familyId) {
                const base64Candy = await pintarDoceCanvas(familyId);
                icon.src = base64Candy; // O doce ganha cor na tela!
            }
        }
    }, 150);
  };
  
  renderPage();
  topControls.innerHTML = `<button id="backToListButton">&larr; Voltar à Lista</button>`;
  document
    .getElementById("backToListButton")
    .addEventListener("click", () => displayPokemonList(currentPokemonList));
};

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
          GLOBAL_POKE_DB,
        );
        if (pokemon && pokemon.baseStats) {
          pokemon.maxCP = calculateCP(
            pokemon.baseStats,
            { atk: 15, def: 15, hp: 15 },
            50,
          );
        } else if (pokemon) {
          pokemon.maxCP = 0;
        }
        return pokemon;
      }),
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
      (a, b) => (b.maxCP || 0) - (a.maxCP || 0),
    );
    GLOBAL_POKE_DB.atkRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.baseStats?.atk || 0) - (a.baseStats?.atk || 0),
    );
    GLOBAL_POKE_DB.defRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.baseStats?.def || 0) - (a.baseStats?.def || 0),
    );
    GLOBAL_POKE_DB.hpRankList = [...allPokemonDataForList].sort(
      (a, b) => (b.baseStats?.hp || 0) - (a.baseStats?.hp || 0),
    );
    console.log("Listas de rank prontas.");

    console.log("👍 Interface da Datadex pronta.");

    verificarPokemonsFaltando();

    const lastViewedDex = localStorage.getItem("lastViewedPokemonDex");
    if (lastViewedDex) {
      const lastPokemon = allPokemonDataForList.find(
        (p) => p.dex === parseInt(lastViewedDex, 10),
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
        normal: "Normal",
        fire: "Fogo",
        water: "Água",
        electric: "Elétrico",
        grass: "Planta",
        ice: "Gelo",
        fighting: "Lutador",
        poison: "Venenoso",
        ground: "Terrestre",
        flying: "Voador",
        psychic: "Psíquico",
        bug: "Inseto",
        rock: "Pedra",
        ghost: "Fantasma",
        dragon: "Dragão",
        steel: "Aço",
        dark: "Sombrio",
        fairy: "Fada",
        // Redundância para PT minúsculo
        fogo: "Fogo",
        água: "Água",
        agua: "Água",
        planta: "Planta",
        elétrico: "Elétrico",
        eletrico: "Elétrico",
      };

      // Retorna o valor do dicionário ou capitaliza a primeira letra
      return dict[tLower] || tLower.charAt(0).toUpperCase() + tLower.slice(1);
    };

    // 1. Prepara Ataque
    const ataquePT = formatarTipo(moveType);

    // 2. Prepara Defensor (Remove 'none', traduz e ordena para bater com o JSON)
    const defensorPT = defenderTypes
      .filter((t) => t && t.toLowerCase() !== "none")
      .map((t) => formatarTipo(t))
      .sort();

    // 3. Busca no JSON
    // O JSON tem entradas como: { "tipos": ["Água", "Terrestre"] }
    const dadosMatch = typeData.find((entry) => {
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
          return parseFloat(multKey.replace("x", ""));
        }
      }
      return null;
    };

    const fFraq = check(dadosMatch.defesa.fraqueza);
    if (fFraq !== null) return fFraq;

    const fRes = check(dadosMatch.defesa.resistencia);
    if (fRes !== null) return fRes;

    // Imunidade
    if (
      dadosMatch.defesa.imunidade &&
      dadosMatch.defesa.imunidade.includes(ataquePT)
    ) {
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
  const meusTiposPT = types
    .filter((t) => t && t.toLowerCase() !== "none") // 🔥 O ASPIRADOR DE PÓ: Remove tipos "None", nulos ou vazios
    .map((t) => {
      const tLower = t.toLowerCase();
      // Garante a primeira letra maiúscula para bater com o JSON (ex: "fogo" -> "Fogo")
      let trad = TYPE_TRANSLATION_MAP[tLower] || t;
      return trad.charAt(0).toUpperCase() + trad.slice(1);
    })
    .sort();

  // 2. Procura no JSON a entrada que tem EXATAMENTE esses tipos
  const dadosDefesa = typeData.find((entry) => {
    if (!entry.tipos) return false;
    const jsonTipos = entry.tipos.slice().sort(); // Copia e ordena

    // Compara se os arrays são iguais
    return JSON.stringify(meusTiposPT) === JSON.stringify(jsonTipos);
  });

  if (!dadosDefesa || !dadosDefesa.defesa) {
    console.warn(
      "Combinação de defesa não encontrada no JSON para:",
      meusTiposPT,
    );
    return "";
  }

  // 3. Função auxiliar para extrair dados do JSON e criar linhas
  const processarCategoria = (categoriaObj) => {
    if (!categoriaObj) return [];

    const listaFinal = [];

    // Itera sobre as chaves de multiplicador (ex: "1.6x", "2.56x")
    Object.keys(categoriaObj).forEach((multKey) => {
      const multNum = parseFloat(multKey.replace("x", ""));
      const tiposDaCategoria = categoriaObj[multKey];

      if (tiposDaCategoria && tiposDaCategoria.length > 0) {
        listaFinal.push({
          mult: multNum,
          types: tiposDaCategoria,
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
      resistences.push({ mult: 0, types: imunes }); // 0x de dano
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
    if (item.mult >= 2.56) {
      label = "2.56x";
      classMult = "mult-256";
    } else if (item.mult >= 1.6) {
      label = "1.6x";
      classMult = "mult-160";
    } else if (item.mult <= 0.244) {
      label = "0.24x";
      classMult = "mult-024";
    } // Imunidade dupla
    else if (item.mult <= 0.391) {
      label = "0.39x";
      classMult = "mult-039";
    } // Resistência dupla
    else if (item.mult === 0) {
      label = "0x";
      classMult = "mult-024";
    } // Imunidade total (msg)
    else {
      label = "0.63x";
      classMult = "mult-062";
    } // Resistência normal

    const badges = item.types
      .map((t) => {
        const tLower = t.toLowerCase();
        const color = getTypeColor(tLower);
        const icon = getTypeIcon(tLower);

        return `<span class="pokedex-tipo-badge" style="background-color: ${color}; font-size: 0.8em; padding: 4px 10px;">
                        <img src="${icon}" alt="${t}" style="width: 15px; height: 15px;">
                        ${t}
                    </span>`;
      })
      .join("");

    return `<div class="defense-row">
                    <span class="multiplier-tag ${classMult}">${label}</span>
                    <div class="type-badges-container">${badges}</div>
                </div>`;
  };

  const weakHtml =
    weaknesses.length > 0
      ? weaknesses.map(createRow).join("")
      : "<p style='text-align:center; opacity:0.6; font-size:0.9em;'>Sem fraquezas</p>";
  const resistHtml =
    resistances.length > 0
      ? resistances.map(createRow).join("")
      : "<p style='text-align:center; opacity:0.6; font-size:0.9em;'>Sem resistências</p>";

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
    },
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
window.toggleHeader = function () {
  // Tenta encontrar o cabeçalho ou o menu de navegação
  const header =
    document.querySelector("header") || document.querySelector(".header");
  const nav =
    document.querySelector("nav") || document.querySelector(".nav-links");

  // Alterna a classe 'active' para mostrar/esconder
  if (header) {
    header.classList.toggle("active");
  }
  if (nav) {
    nav.classList.toggle("active");
  }
};

// =============================================================
//  SISTEMA DE PAGINAÇÃO DE COMBOS (MODO INTEGRADO)
// =============================================================

let estadoPaginacao = {
  todosCombos: [],
  paginaAtual: 1,
  itensPorPagina: 5,
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
  const container = document.getElementById("lista-melhores-combos");
  if (!container) return;

  container.innerHTML = "";

  // A nossa função inteligente e segura de tradução fica aqui em cima!
  const fmt = (n) => {
    if (!n) return "Desconhecido";
    const limpo = n
      .replace(/_FAST$/, "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return typeof GLOBAL_POKE_DB !== "undefined" &&
      GLOBAL_POKE_DB.moveTranslations &&
      GLOBAL_POKE_DB.moveTranslations[limpo]
      ? GLOBAL_POKE_DB.moveTranslations[limpo]
      : limpo;
  };

  // 1. Pega o DPS Máximo
  const maxDPS =
    estadoPaginacao.todosCombos.length > 0
      ? estadoPaginacao.todosCombos[0].dps
      : 1;

  const inicio =
    (estadoPaginacao.paginaAtual - 1) * estadoPaginacao.itensPorPagina;
  const fim = inicio + estadoPaginacao.itensPorPagina;
  const combosDaPagina = estadoPaginacao.todosCombos.slice(inicio, fim);

  // Descobre qual imagem de clima usar (pega do window.currentWeather)
  const climaAtual = window.currentWeather || "Extreme";
  let climaImgUrl = "";

  // Procura no array de opções qual a imagem desse clima
  if (climaAtual !== "Extreme") {
    const urlBase =
      "https://images.weserv.nl/?url=https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/clima/";
    climaImgUrl = `${urlBase}${climaAtual}.png&w=15`;
  }

  const htmlCards = combosDaPagina
    .map((c, index) => {
      const globalIndex = inicio + index;
      const isBest = globalIndex === 0 ? "best-combo" : "";

      // Ranking
      const forca = c.dps / maxDPS;
      let rank = "D",
        rankClass = "rank-d";
      if (forca >= 0.98) {
        rank = "S";
        rankClass = "rank-s";
      } else if (forca >= 0.9) {
        rank = "A+";
        rankClass = "rank-a-plus";
      } else if (forca >= 0.8) {
        rank = "A";
        rankClass = "rank-a";
      } else if (forca >= 0.65) {
        rank = "B";
        rankClass = "rank-b";
      } else if (forca >= 0.5) {
        rank = "C";
        rankClass = "rank-c";
      }

      const iconFast = getTypeIcon(c.fast.type);
      const iconCharged = getTypeIcon(c.charged.type);

      // Nomes formatados dos golpes
      const nomeFast = fmt(c.fast.name);
      const nomeCharged = fmt(c.charged.name);

      // --- 🌟 NOVO: GERANDO AS BADGES DE ELITE ---
      // Pegamos o Pokémon atual da tela e limpamos o _FAST do ID para garantir que bata com o JSON
      const pokemonAtual = window.pokemonParaSimulacao;
      const idFastLimpo = (c.fast.moveId || "").replace(/_FAST$/, ""); 
      const idChargedLimpo = c.charged.moveId || "";
      
      const badgeFast = typeof gerarBadgeEliteHTML === 'function' ? gerarBadgeEliteHTML(idFastLimpo, pokemonAtual, true) : "";
      const badgeCharged = typeof gerarBadgeEliteHTML === 'function' ? gerarBadgeEliteHTML(idChargedLimpo, pokemonAtual, false) : "";

      // --- HTML DO ÍCONE DE BOOST DE CLIMA ---
      const boostIcon = (ativo) => {
        if (ativo && climaImgUrl) {
          return `<img src="${climaImgUrl}" style="width: 12px; height: 12px; margin-left: 4px; vertical-align: middle; opacity: 0.8;" title="Boost de Clima (+20%)">`;
        }
        return "";
      };

      return `
        <div class="combo-row ${isBest} fade-in">
            <div class="combo-moves">
                <img src="${iconFast}" class="combo-move-type"> 
                <span>${nomeFast} ${badgeFast} ${boostIcon(c.fastHasBoost)}</span>
                
                <span class="combo-arrow">+</span>
                
                <img src="${iconCharged}" class="combo-move-type"> 
                <span>${nomeCharged} ${badgeCharged} ${boostIcon(c.chargedHasBoost)}</span>
            </div>
            <div class="combo-stats">
                <span>DPS: <span class="dps-val">${c.dps.toFixed(1)}</span></span>
                <span>TDO: <span class="tdo-val">${Math.round(c.tdo)}</span></span>
                <span class="result-tag ${rankClass}">${rank}</span>
            </div>
        </div>`;
    })
    .join("");

  container.innerHTML = htmlCards;

  const infoTexto = document.getElementById("info-paginacao");
  if (infoTexto) {
    infoTexto.innerText = `Mostrando ${inicio + 1}-${Math.min(fim, estadoPaginacao.todosCombos.length)} de ${estadoPaginacao.todosCombos.length}`;
  }
}
function renderizarControles() {
  const containerControles = document.getElementById("controles-paginacao");
  if (!containerControles) return;

  containerControles.innerHTML = "";

  // Dropdown
  const divQtd = document.createElement("div");
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

  const select = divQtd.querySelector("select");
  select.value = estadoPaginacao.itensPorPagina;
  select.addEventListener("change", (e) => {
    estadoPaginacao.itensPorPagina = parseInt(e.target.value);
    estadoPaginacao.paginaAtual = 1;
    renderizarTabela();
    renderizarControles();
  });

  // Botões
  const divBotoes = document.createElement("div");
  divBotoes.className = "pagination-controls";
  divBotoes.style.display = "flex";
  divBotoes.style.gap = "5px";

  const totalPaginas = Math.ceil(
    estadoPaginacao.todosCombos.length / estadoPaginacao.itensPorPagina,
  );

  const criarBotao = (texto, pagDestino, disabled = false, active = false) => {
    const btn = document.createElement("button");
    btn.innerText = texto;
    // Classes simples para facilitar a estilização
    btn.className = `page-btn ${active ? "active" : ""}`;
    // Estilos inline básicos para garantir que apareça bonito
    btn.style.padding = "5px 10px";
    btn.style.cursor = "pointer";
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "4px";
    btn.style.backgroundColor = active ? "#2ecc71" : "#fff";
    btn.style.color = active ? "#fff" : "#333";

    btn.disabled = disabled;
    if (disabled) btn.style.opacity = "0.5";

    btn.onclick = () => {
      estadoPaginacao.paginaAtual = pagDestino;
      renderizarTabela();
      renderizarControles();
    };
    divBotoes.appendChild(btn);
  };

  criarBotao(
    "«",
    estadoPaginacao.paginaAtual - 1,
    estadoPaginacao.paginaAtual === 1,
  );

  let pagsParaMostrar = [];
  if (totalPaginas <= 5) {
    pagsParaMostrar = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  } else {
    if (estadoPaginacao.paginaAtual <= 3) {
      pagsParaMostrar = [1, 2, 3, 4, "...", totalPaginas];
    } else if (estadoPaginacao.paginaAtual >= totalPaginas - 2) {
      pagsParaMostrar = [
        1,
        "...",
        totalPaginas - 3,
        totalPaginas - 2,
        totalPaginas - 1,
        totalPaginas,
      ];
    } else {
      pagsParaMostrar = [
        1,
        "...",
        estadoPaginacao.paginaAtual - 1,
        estadoPaginacao.paginaAtual,
        estadoPaginacao.paginaAtual + 1,
        "...",
        totalPaginas,
      ];
    }
  }

  pagsParaMostrar.forEach((p) => {
    if (p === "...") {
      const span = document.createElement("span");
      span.innerText = "...";
      span.style.padding = "5px";
      span.style.color = "#333";
      divBotoes.appendChild(span);
    } else {
      criarBotao(p, p, false, p === estadoPaginacao.paginaAtual);
    }
  });

  criarBotao(
    "»",
    estadoPaginacao.paginaAtual + 1,
    estadoPaginacao.paginaAtual === totalPaginas,
  );
  containerControles.appendChild(divBotoes);
}

// =========================================================
// CONTROLE DOS SELETORES NO RANKING COMPLETO
// =========================================================
window.atualizarFiltrosRankingCompleto = function () {
  const tierSelect = document.getElementById("full-raid-tier-select");
  const movesetSelect = document.getElementById("full-boss-moveset-select");

  // Atualiza as variáveis globais se os seletores existirem
  if (tierSelect) window.currentRaidTier = tierSelect.value;
  if (movesetSelect) window.currentBossMoveset = movesetSelect.value;

  // Recarrega a tela de Ranking Completo do zero com os novos filtros
  if (window.pokemonParaSimulacao) {
    window.abrirRankingCompleto(window.pokemonParaSimulacao);
  }
};

// =========================================================
// RAIO-X DA BATALHA (MOTOR DE LOOP DUPLO)
// =========================================================
window.verBatalha = function (posicao) {
  if (
    !window.countersFiltradosGlobal ||
    window.countersFiltradosGlobal.length === 0
  ) {
    console.error(
      "❌ O ranking ainda não foi calculado. Carregue a página do Boss primeiro!",
    );
    return;
  }

  const index = posicao - 1;
  if (index < 0 || index >= window.countersFiltradosGlobal.length) {
    console.error(
      "❌ Posição inválida! Tente um número entre 1 e " +
        window.countersFiltradosGlobal.length,
    );
    return;
  }

  const counterInfo = window.countersFiltradosGlobal[index];
  const atacante = counterInfo.pokemon;
  const combo = counterInfo.melhorCombo;
  const boss = window.pokemonParaSimulacao;

  // Limpa o nome dos golpes
  const fmt = (n) => {
    if (!n) return "Desconhecido";
    const limpo = n
      .replace(/_FAST$/, "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return typeof GLOBAL_POKE_DB !== "undefined" &&
      GLOBAL_POKE_DB.moveTranslations &&
      GLOBAL_POKE_DB.moveTranslations[limpo]
      ? GLOBAL_POKE_DB.moveTranslations[limpo]
      : limpo;
  };
  const nomeFast = fmt(combo.fast.name);
  const nomeCharged = fmt(combo.charged.name);

  // Tempos e Energias do Atacante
  let tFast =
    parseFloat(combo.fast.duration) || combo.fast.cooldown / 1000 || 1.0;
  if (tFast > 10) tFast = tFast / 1000;
  if (tFast < 0.1) tFast = 0.5;

  let tCharged =
    parseFloat(combo.charged.duration) || combo.charged.cooldown / 1000 || 2.0;
  if (tCharged > 10) tCharged = tCharged / 1000;
  if (tCharged < 0.1) tCharged = 2.0;

  const enGain = Math.max(1, combo.fast.energy || combo.fast.energyGain || 6);
  const enCost = Math.abs(combo.charged.energy || 50);
  const dmgFast = combo.fast.power || 10;
  const dmgCharged = combo.charged.power || 50;
  // =================================================================
  // 🕵️‍♂️ OLHO BIÔNICO: O QUE O MOTOR LEU DOS GOLPES?
  // =================================================================
  console.log("%c🔍 RAIO-X DOS GOLPES (Leitura Bruta do JSON)", "background: #8e44ad; color: white; font-weight: bold; font-size: 14px; padding: 4px; border-radius: 4px;");
  console.table({
      "Ataque Rápido": {
          "Nome": nomeFast,
          "Dano Lido": dmgFast,
          "Energia Ganha": enGain,
          "TEMPO FINAL (s)": tFast.toFixed(2) + "s",
          "duration (Bruto)": combo.fast.duration,
          "cooldown (Bruto)": combo.fast.cooldown,
          "durationMs (Bruto)": combo.fast.durationMs
      },
      "Ataque Carregado": {
          "Nome": nomeCharged,
          "Dano Lido": dmgCharged,
          "Custo Energia": enCost,
          "TEMPO FINAL (s)": tCharged.toFixed(2) + "s",
          "duration (Bruto)": combo.charged.duration,
          "cooldown (Bruto)": combo.charged.cooldown,
          "durationMs (Bruto)": combo.charged.durationMs
      }
  });
  console.log("Objeto Bruto do Carregado para inspecionar:", combo.charged);
  // =================================================================

  // --- LÓGICA DO BOSS ---
  // Recupera o tempo de vida calculado no motor (apenas para base do DPS do Boss)
  const tempoDeVidaBase = combo.dps > 0 ? combo.tdo / combo.dps : 0.1;
  const attackerHPMax = Math.floor((atacante.baseStats.hp + 15) * 0.8403);
  let hpAtual = attackerHPMax;

  const bossIncomingDPS =
    tempoDeVidaBase > 0 ? attackerHPMax / tempoDeVidaBase : 10;
  const bossFastDmg = bossIncomingDPS * 2.0 * 0.6;
  const bossChargedDmg = bossIncomingDPS * 10.0 * 0.4;

  let energiaAtacante = 0;
  let energiaBoss = 0;
  let danoTotal = 0;

  let relogio = 0;
  let proxAcaoAtacante = 0;
  let proxAcaoBoss = 2.0;

  let fastUsados = 0;
  let chargedUsados = 0;
  let logBatalha = [];
  let motivoMorte = "A Reide acabou antes de morrer.";

  // O loop da morte!
  while (hpAtual > 0 && relogio < 300) {
    relogio = Math.min(proxAcaoAtacante, proxAcaoBoss);

    // ==========================================
    // TURNO DO BOSS
    // ==========================================
    if (relogio >= proxAcaoBoss) {
      if (energiaBoss >= 60) {
        hpAtual -= bossChargedDmg;
        energiaBoss -= 50;
        proxAcaoBoss = relogio + 2.5;

        const ganhoEnergiaAtacante = Math.floor(bossChargedDmg / 2);
        energiaAtacante += ganhoEnergiaAtacante;

        if (logBatalha.length < 25) {
          // Limita o log para não travar o console
          logBatalha.push(
            `💥 [${relogio.toFixed(1)}s] Boss usa Especial! Você toma ${bossChargedDmg.toFixed(0)} de Dano. Energia Ganha: +${ganhoEnergiaAtacante} (Sua Vida: ${Math.max(0, hpAtual).toFixed(0)}/${attackerHPMax})`,
          );
        }
      } else {
        hpAtual -= bossFastDmg;
        energiaBoss += 10;
        proxAcaoBoss = relogio + 2.0;

        const ganhoEnergiaAtacante = Math.floor(bossFastDmg / 2);
        energiaAtacante += ganhoEnergiaAtacante;

        if (logBatalha.length < 25) {
          logBatalha.push(
            `⚡ [${relogio.toFixed(1)}s] Boss ataca! Dano: ${bossFastDmg.toFixed(0)} | Sua Energia Ganha: +${ganhoEnergiaAtacante}`,
          );
        }
      }
      if (energiaAtacante > 100) energiaAtacante = 100;
    }

    if (hpAtual <= 0) {
      motivoMorte = `💀 OVERKILL! O Boss te desintegrou com um ataque forte. Energia jogada no lixo: ${energiaAtacante}`;
      break;
    }

    // ==========================================
    // TURNO DO SEU POKÉMON (ATACANTE)
    // ==========================================
    if (relogio >= proxAcaoAtacante) {
      if (energiaAtacante >= enCost) {
        danoTotal += dmgCharged;
        energiaAtacante -= enCost;
        proxAcaoAtacante = relogio + tCharged;
        chargedUsados++;

        const ganhoEnergiaBoss = Math.floor(dmgCharged / 2);
        energiaBoss += ganhoEnergiaBoss;

        if (logBatalha.length < 25) {
          logBatalha.push(
            `🔥 [${relogio.toFixed(1)}s] VOCÊ usou [${nomeCharged}]! Gasta ${enCost} de Energia. (Energia Restante: ${energiaAtacante})`,
          );
        }
      } else {
        danoTotal += dmgFast;
        energiaAtacante += enGain;
        proxAcaoAtacante = relogio + tFast;
        fastUsados++;

        const ganhoEnergiaBoss = Math.floor(dmgFast / 2);
        energiaBoss += ganhoEnergiaBoss;

        if (logBatalha.length < 25) {
          logBatalha.push(
            `🥊 [${relogio.toFixed(1)}s] Você usou [${nomeFast}] -> Sua Energia: ${energiaAtacante}/100`,
          );
        }
      }
      if (energiaAtacante > 100) energiaAtacante = 100;
      if (energiaBoss > 100) energiaBoss = 100;
    }
  }

  const novoTempoDeVida = relogio;

  // --- IMPRIMINDO O RESULTADO ---
  console.clear();
  console.log(
    `%c⚔️ RAIO-X: RANK ${posicao} (LOOP DUPLO / ATACANTE VS BOSS) ⚔️`,
    "font-size: 16px; font-weight: bold; color: #f1c40f; background: #222; padding: 5px; border-radius: 5px;",
  );
  console.log(
    `%cAtacante:%c ${atacante.nomeParaExibicao} %c(HP: ${attackerHPMax})`,
    "color: #3498db; font-weight: bold;",
    "color: white; font-weight: bold;",
    "color: #aaa;",
  );
  console.log(
    `%cAlvo:%c ${boss.nomeParaExibicao} %c(Tier ${window.currentRaidTier})`,
    "color: #e74c3c; font-weight: bold;",
    "color: white; font-weight: bold;",
    "color: #aaa;",
  );
  console.log("---------------------------------------------------");

  console.log(
    `%c🔄 LINHA DO TEMPO DA LUTA (Primeiros Segundos)`,
    "color: #2ecc71; font-weight: bold; font-size: 14px;",
  );
  logBatalha.forEach((linha) => {
    if (linha.includes("VOCÊ usou") || linha.includes("Você usou")) {
      console.log(`%c${linha}`, "color: #3498db;"); // Azul para os seus ataques
    } else {
      console.log(`%c${linha}`, "color: #e74c3c;"); // Vermelho para os do Boss
    }
  });
  if (logBatalha.length === 25)
    console.log("... (A luta continua até a morte)");

  console.log("---------------------------------------------------");

  console.log(
    `%c🛡️ O MOMENTO DA MORTE`,
    "color: #e67e22; font-weight: bold; font-size: 14px;",
  );
  console.log(`• Sobrevivência Total: ${novoTempoDeVida.toFixed(1)} segundos.`);
  console.log(`• Status da Morte: ${motivoMorte}`);
  console.log(`• Total de Tapas Rápidos Disparados: ${fastUsados}`);
  console.log(`• Total de Especiais Disparados: ${chargedUsados}`);

  console.log("---------------------------------------------------");
  console.log(
    `%c🏆 RESULTADO FINAL DO MOTOR`,
    "color: #9b59b6; font-weight: bold; font-size: 14px;",
  );
  console.log(`• DPS Médio no Rank: ${combo.dps.toFixed(2)}`);
  console.log(`• TDO Final no Rank: ${combo.tdo.toFixed(0)}`);
  console.log(`• Tempo Efetivo (TTW): ${counterInfo.ttw.toFixed(1)}s`);
  console.log(
    `• Jogadores Necessários (Estimador): %c${counterInfo.estimador.toFixed(2)}`,
    "color: #2ecc71; font-weight: bold; font-size: 14px;",
  );
};