// =============================================================
//  SCRIPT POKÉMON UNIFICADO 01/09/2025)
// =============================================================

// --- 1. CONSTANTES E DADOS GLOBAIS ---
const URLS = {
  MAIN_DATA:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/poke_data.json",
  MAIN_DATA_FALLBACK:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/bc872145e179754c43d160bcf429380b3089f935/json/poke_data.json",
  MEGA_DATA:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/mega_reides.json",
  GIGAMAX_DATA:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/poke_data_gigamax.json",
  IMAGES_PRIMARY:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/imagens_pokemon.json",
  IMAGES_ALT:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/imagens_pokemon_alt.json",
  TYPE_DATA:
    "https://raw.githubusercontent.com/nowadraco/bloggerpoke/main/src/data/gamemaster/tipos_poke.json",
  MOVE_TRANSLATIONS:
    "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/movimentos_portugues.json",
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

let GLOBAL_POKE_DB = null;

// ▼▼▼ ADICIONE ESTAS 3 LINHAS AQUI ▼▼▼
let allPokemonDataForList = [];
let currentPokemonList = [];
const topControls = document.getElementById("top-controls");
const datadexContent = document.getElementById("datadex-content");

// --- 2. FUNÇÕES UTILITÁRIAS COMPARTILHADAS ---

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
    ? `https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/${iconName}.png`
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
    ? `https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/${icon}.png`
    : "";
}

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

function formatarNomeParaExibicao(speciesName) {
  if (!speciesName) return "";
  return speciesName
    .replace("(Alolan)", "de Alola")
    .replace("(Galarian)", "de Galar")
    .replace("(Hisuian)", "de Hisui")
    .replace("(Paldean)", "de Paldea")
    .replace("Nidoran Male", "Nidoran♂")
    .replace("Nidoran Female", "Nidoran♀");
}

// --- FUNÇÃO DE BUSCA FLEXÍVEL ATUALIZADA ---
function gerarChavesDeBuscaPossiveis(nomeOriginal) {
  let nomeLimpo = nomeOriginal
    .replace(/(Dinamax|Gigantamax)/i, "")
    .replace(/\*/g, "")
    .trim();

  // Lógica para Flabébé, Floette e Florges (mantida)
  if (nomeLimpo.includes("Flabébé")) {
    nomeLimpo = "Flabebe";
  } else if (nomeLimpo.includes("Floette")) {
    nomeLimpo = "Floette";
  } else if (nomeLimpo.includes("Florges")) {
    nomeLimpo = "Florges";
  }

  const chaves = new Set();

  // 1. Adiciona o nome limpo original à lista de chaves
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
      ["Nidoran♂", "Nidoran Male"],
      ["Nidoran♀", "Nidoran Female"],
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

// --- 3. CARREGAMENTO E PREPARAÇÃO DE DADOS ---
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
      // ▼▼▼ ADICIONA O FETCH DO NOVO ARQUIVO ▼▼▼
      fetch(URLS.MOVE_TRANSLATIONS).then((res) => res.json()),
    ]);

    const [
      mainData,
      fallbackData,
      megaData,
      gigaData,
      primaryImages,
      altImages,
      typeData,
      rawMoveTranslations,
    ] = responses;

    // ▼▼▼ PROCESSA AS TRADUÇÕES PARA UM FORMATO EFICIENTE ▼▼▼
    const moveTranslations = rawMoveTranslations.reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {});

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
      if (
        p.dex &&
        !p.speciesName.includes("(") &&
        !p.speciesName.includes("Mega")
      ) {
        if (!pokemonsByDexMap.has(p.dex)) {
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
      // ▼▼▼ DISPONIBILIZA AS TRADUÇÕES PARA O RESTO DO SCRIPT ▼▼▼
      moveTranslations: moveTranslations,
    };
  } catch (error) {
    console.error("❌ Erro fatal ao carregar os arquivos JSON:", error);
    return null;
  }
}

// --- 4. LÓGICA CENTRAL DE BUSCA (ATUALIZADA E SEGURA) ---
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
    nomeOriginal.includes("Toxtricity") ||
    nomeOriginal.includes("Urshifu") ||
    nomeOriginal.includes("Slakoth de viseira") ||
    nomeOriginal.includes("Oricorio") ||
    nomeOriginal.includes("Zacian") ||
    nomeOriginal.includes("Zamazenta") ||
    nomeOriginal.includes("Pikachu Elegante (detalhes vermelhos)") ||
    nomeOriginal.includes("Pikachu Elegante (detalhes azuis)") ||
    nomeOriginal.includes("Pikachu Elegante (detalhes amarelos)") ||
    nomeOriginal.includes("Falinks em treinamento") ||
    nomeOriginal.includes("Unown")
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
    console.log(
      `[Debug Imagem - Padrão] Procurando imagem com as chaves:`,
      chavesDeBuscaDeImagem
    );
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
  } else {
    console.log(
      `[Debug Imagem] ✅ SUCESSO: Imagem encontrada para "${nomeOriginal}"`,
      infoImagens
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

// ALTERADO: Adicionado 'gorocket' ao objeto de geradores
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
          gorocket: generatePokemonListItemGoRocket, // <-- ESSA É A LINHA NOVA
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

// NOVO: Função para adicionar manipulador de erro à imagem
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

    // Remove o handler após a primeira tentativa de fallback para evitar loops de erro infinitos
    this.onerror = null;
  };
}

// --- 6. GERADORES DE CARDS HTML (ALTERADOS) ---
// ALTERADO: Agora chama attachImageFallbackHandler para configurar o fallback
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
  const isShadow = /\(shadow\)/i.test(nomeOriginal);

  // A imagem inicial tenta carregar a primária, ou a de fallback se a primária não existir no JSON
  const initialImageSrc = pokemon.imgNormal || pokemon.imgNormalFallback || "";

  li.innerHTML = `
    <div class="pokemon-image-container ${isShadow ? "is-shadow" : ""}">
        <img class="imgSelvagem" src="${initialImageSrc}" alt="${
    pokemon.nomeParaExibicao
  }">
    </div>
    <span>${nomeOriginal}</span>
    `;

  // Adiciona o manipulador de erro na imagem
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

  // HTML do card, sem as seções de CP e Boost
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

// --- 7. LÓGICA DE ALTERNÂNCIA SHINY E FRAQUEZAS ---
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
  const { dex, nomeParaExibicao, types, baseStats, fastMoves, chargedMoves } =
    pokemon;
  const imagemSrc = pokemon.imgNormal || pokemon.imgNormalFallback;

  // Calcular o PC Máximo (Nível 50, 100% IVs)
  const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);

  // Gerar HTML para os TIPOS (reutilizando sua função getTypeColor)
  const tiposHTML = types
    .filter((t) => t && t.toLowerCase() !== "none")
    .map((tipo) => {
      const tipoTraduzido = TYPE_TRANSLATION_MAP[tipo.toLowerCase()] || tipo;
      return `<span class="pokedex-tipo" style="background-color: ${getTypeColor(
        tipo
      )}">${tipoTraduzido}</span>`;
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

function displayGenerationSelection() {
  localStorage.removeItem("lastViewedPokemonDex");
  topControls.innerHTML =
    '<h2 class="text-white text-center font-bold">Selecione uma Geração</h2>';
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
  let generationHtml =
    '<div class="p-4"><div class="grid grid-cols-2 md:grid-cols-3 gap-4">';
  for (const gen in generationRanges) {
    generationHtml += `<div class="generation-card bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center text-center fade-in" data-gen="${gen}"><h3 class="text-xl font-bold text-white">Geração ${gen}</h3><p class="text-sm text-gray-400">${generationRanges[gen].region}</p></div>`;
  }
  generationHtml += `<div class="generation-card bg-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-center fade-in col-span-2 md:col-span-3" data-gen="all"><h3 class="text-xl font-bold text-white">Todas as Gerações</h3></div></div></div>`;
  datadexContent.innerHTML = generationHtml;
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
}

function displayPokemonList(pokemonList) {
  localStorage.removeItem("lastViewedPokemonDex");
  topControls.innerHTML = `<div class="flex justify-between items-center"><button id="backToGenButton" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">&larr; Voltar</button><input type="text" id="searchInput" class="w-full max-w-xs p-2 rounded bg-gray-700 text-white border border-gray-600" placeholder="Pesquisar Pokémon..."></div>`;
  datadexContent.innerHTML =
    '<div id="pokemon-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 p-2"></div>';
  const grid = document.getElementById("pokemon-grid");

  const renderList = (list) => {
    grid.innerHTML = "";
    list.forEach((pokemon) => {
      const card = document.createElement("div");
      card.className =
        "pokemon-card-list bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center fade-in";
      const img = document.createElement("img");
      img.src = pokemon.imgNormal || pokemon.imgNormalFallback;
      img.alt = pokemon.nomeParaExibicao;
      img.className = "w-20 h-20 object-contain mb-2";
      attachImageFallbackHandler(img, pokemon);
      card.appendChild(img);
      const p = document.createElement("p");
      p.className = "text-white font-semibold text-sm capitalize";
      p.textContent = pokemon.nomeParaExibicao;
      card.appendChild(p);
      card.addEventListener("click", () => showPokemonDetails(pokemon.dex));
      grid.appendChild(card);
    });
  };

  renderList(pokemonList);

  document
    .getElementById("backToGenButton")
    .addEventListener("click", displayGenerationSelection);
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredList = pokemonList.filter((p) =>
      p.nomeParaExibicao.toLowerCase().includes(searchTerm)
    );
    renderList(filteredList);
  });
}

function showPokemonDetails(dexNumber) {
    localStorage.setItem("lastViewedPokemonDex", dexNumber);

    // Garante que a navegação funcione mesmo após recarregar a página
    if (currentPokemonList.length === 0) {
        currentPokemonList = allPokemonDataForList;
    }
    const currentIndex = currentPokemonList.findIndex((p) => p.dex === dexNumber);

    if (currentIndex === -1) {
        datadexContent.innerHTML = `<p class="text-white text-center">Pokémon não encontrado.</p>`;
        return;
    }

    const pokemon = currentPokemonList[currentIndex];
    const prevPokemon = currentIndex > 0 ? currentPokemonList[currentIndex - 1] : null;
    const nextPokemon = currentIndex < currentPokemonList.length - 1 ? currentPokemonList[currentIndex + 1] : null;

    if (!pokemon) {
        datadexContent.innerHTML = `<p class="text-white text-center">Não foi possível carregar os detalhes.</p>`;
        return;
    }

    topControls.innerHTML = `<button id="backToListButton" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">&larr; Voltar à Lista</button>`;

    // ▼▼▼ ALTERAÇÃO 1: Pegar o array de tipos JÁ TRADUZIDO ▼▼▼
    // Em vez de 'types', pegamos 'typesTranslated' que já processamos na função main.
    const {
      dex,
      nomeParaExibicao,
      types, // Mantemos o original para pegar as cores
      typesTranslated, // Usamos este para exibir o texto
      baseStats,
      fastMovesTranslated,
      chargedMovesTranslated,
    } = pokemon;

    const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);

    // ▼▼▼ ALTERAÇÃO 2: Simplificar a criação do HTML dos tipos ▼▼▼
    // Agora usamos os dois arrays: um para o texto (traduzido) e outro para a cor (original).
    const tiposHTML = typesTranslated
        .map((tipoTraduzido, index) => {
            const tipoOriginal = types[index]; // Pega o tipo em inglês correspondente
            return `<span class="pokedex-tipo-badge" style="background-color: ${getTypeColor(tipoOriginal)}">${tipoTraduzido}</span>`;
        })
        .join("");

    const ataquesRapidosHTML = fastMovesTranslated
        .map((ataque) => `<li>${ataque}</li>`)
        .join("");
    const ataquesCarregadosHTML = chargedMovesTranslated
        .map((ataque) => `<li>${ataque}</li>`)
        .join("");

    // O resto da função continua exatamente igual...
    const prevButtonHTML = prevPokemon ? `<div id="prev-pokemon" class="nav-botao"><img src="${prevPokemon.imgNormal || prevPokemon.imgNormalFallback}" alt="${prevPokemon.nomeParaExibicao}"><div class="nav-texto"><strong>Anterior</strong><span>#${String(prevPokemon.dex).padStart(3, "0")}</span></div></div>` : `<div class="nav-botao hidden"></div>`;
    const nextButtonHTML = nextPokemon ? `<div id="next-pokemon" class="nav-botao"><div class="nav-texto" style="text-align: right;"><strong>Próximo</strong><span>#${String(nextPokemon.dex).padStart(3, "0")}</span></div><img src="${nextPokemon.imgNormal || nextPokemon.imgNormalFallback}" alt="${nextPokemon.nomeParaExibicao}"></div>` : `<div class="nav-botao hidden"></div>`;

    const card = document.createElement("div");
    card.className = "pokedex-card-detalhes";
    card.innerHTML = `
        <div class="imagem-container">
            <img src="${pokemon.imgNormal || pokemon.imgNormalFallback}" alt="${nomeParaExibicao}">
        </div>
        <h2>${nomeParaExibicao} (#${String(dex).padStart(3, "0")})</h2>
        <div class="tipos-container">${tiposHTML}</div>
        <div class="detalhes-navegacao">${prevButtonHTML}${nextButtonHTML}</div>
        <div class="secao-detalhes">
            <h3>Status e CP Máximo</h3>
            <div class="stats-grid">
                <div class="stat-valor"><strong>${baseStats.atk}</strong><span>Ataque</span></div>
                <div class="stat-valor"><strong>${baseStats.def}</strong><span>Defesa</span></div>
                <div class="stat-valor"><strong>${baseStats.hp}</strong><span>Stamina</span></div>
            </div>
            <div class="stat-bar-container"><span class="stat-label">ATK</span><div class="stat-bar"><div style="width: ${(baseStats.atk / 300) * 100}%; background-color: #f34444;"></div></div></div>
            <div class="stat-bar-container"><span class="stat-label">DEF</span><div class="stat-bar"><div style="width: ${(baseStats.def / 300) * 100}%; background-color: #448cf3;"></div></div></div>
            <div class="stat-bar-container"><span class="stat-label">HP</span><div class="stat-bar"><div style="width: ${(baseStats.hp / 300) * 100}%; background-color: #23ce23;"></div></div></div>
            <div class="cp-maximo">CP Máximo (Nível 50): <span>${maxCP}</span></div>
        </div>
        <div class="secao-detalhes">
            <div class="ataques-grid">
                <div><h3>Ataques Rápidos</h3><ul>${ataquesRapidosHTML}</ul></div>
                <div><h3>Ataques Carregados</h3><ul>${ataquesCarregadosHTML}</ul></div>
            </div>
        </div>
    `;

    datadexContent.innerHTML = "";
    datadexContent.appendChild(card);
    attachImageFallbackHandler(card.querySelector("img"), pokemon);

    const backButton = document.getElementById("backToListButton");
    if (backButton) { backButton.addEventListener("click", () => displayPokemonList(currentPokemonList)); }
    const prevButton = document.getElementById("prev-pokemon");
    if (prevButton) { prevButton.addEventListener("click", () => showPokemonDetails(prevPokemon.dex)); }
    const nextButton = document.getElementById("next-pokemon");
    if (nextButton) { nextButton.addEventListener("click", () => showPokemonDetails(nextPokemon.dex)); }
}

// ALTERADO: Adicionado processamento para a nova classe '.go-rocket'
// ▼▼▼ SUBSTITUA SUA FUNÇÃO main ANTIGA POR ESTA ▼▼▼

async function main() {
  console.log("🚀 Iniciando Script Mestre...");

  const datadexScreen = document.getElementById("datadex-screen");
  if (datadexScreen) {
    const datadexContent = document.getElementById("datadex-content");
    datadexContent.innerHTML = `<p class="text-white text-center text-xl p-10">Carregando banco de dados...</p>`;
  }

  GLOBAL_POKE_DB = await carregarTodaABaseDeDados();

  if (!GLOBAL_POKE_DB) {
    // ... (código de erro continua o mesmo) ...
    return;
  }
  console.log("✅ Banco de dados carregado com sucesso.");

  // Tarefa A: Processa as listas antigas (reides, etc.)
  console.log("⚙️ Processando listas automáticas...");
  processarListas(".pokemon-list", "selvagem", GLOBAL_POKE_DB);
  // ... (outras chamadas processarListas) ...

  // Tarefa B: Inicia a Datadex
  if (datadexScreen) {
    console.log("🚀 Iniciando interface da Datadex...");

    // Pré-processa os dados para a lista.
    allPokemonDataForList = await Promise.all(
      Array.from(GLOBAL_POKE_DB.pokemonsByDexMap.values())
        .sort((a, b) => a.dex - b.dex)
        .map(async (p) => {
          const pokemonCompleto = await buscarDadosCompletosPokemon(
            p.speciesName,
            GLOBAL_POKE_DB
          );

          // 1. TRADUZ OS MOVIMENTOS (como já estava)
          const formatarNomeMovimento = (nomeSistema) => {
            const nomeTraduzido =
              GLOBAL_POKE_DB.moveTranslations[nomeSistema] || nomeSistema;
            return nomeTraduzido
              .replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase());
          };
          pokemonCompleto.fastMovesTranslated = pokemonCompleto.fastMoves.map(
            formatarNomeMovimento
          );
          pokemonCompleto.chargedMovesTranslated =
            pokemonCompleto.chargedMoves.map(formatarNomeMovimento);

          // ▼▼▼ 2. ADIÇÃO: TRADUZ OS TIPOS AQUI ▼▼▼
          if (pokemonCompleto.types) {
            pokemonCompleto.typesTranslated = pokemonCompleto.types
              .filter((type) => type && type.toLowerCase() !== "none")
              .map((type) => TYPE_TRANSLATION_MAP[type.toLowerCase()] || type);
          }

          return pokemonCompleto;
        })
    );

    // ▼▼▼ LÓGICA DE VERIFICAÇÃO ADICIONADA ▼▼▼
    const lastViewedDex = localStorage.getItem("lastViewedPokemonDex");

    if (lastViewedDex) {
      // Se encontrou um Pokémon salvo, mostra os detalhes dele diretamente.
      console.log(
        `👍 Encontrado Pokémon salvo: #${lastViewedDex}. Exibindo detalhes.`
      );
      // A lista atual precisa ser a lista completa para a navegação funcionar.
      currentPokemonList = allPokemonDataForList;
      showPokemonDetails(parseInt(lastViewedDex, 10)); // parseInt para garantir que é um número
    } else {
      // Se não, inicia na tela de seleção de geração, como antes.
      console.log("👍 Nenhum Pokémon salvo. Exibindo seleção de geração.");
      displayGenerationSelection();
    }
  }
}

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
