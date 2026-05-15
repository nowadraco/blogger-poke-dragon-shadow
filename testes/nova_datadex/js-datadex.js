// =================================================================================
// SCRIPT POKÉMON UNIFICADO E ADAPTADO PARA A INTERFACE DATADEX
// =================================================================================

// --- 1. CONSTANTES E DADOS GLOBAIS ---
const URLS = {
  MAIN_DATA: "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/poke_data.json",
  MAIN_DATA_FALLBACK: "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/bc872145e179754c43d160bcf429380b3089f935/json/poke_data.json",
  MEGA_DATA: "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/mega_reides.json",
  GIGAMAX_DATA: "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/poke_data_gigamax.json",
  IMAGES_PRIMARY: "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/imagens_pokemon.json",
  IMAGES_ALT: "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/imagens_pokemon_alt.json",
  TYPE_DATA: "https://raw.githubusercontent.com/nowadraco/bloggerpoke/main/src/data/gamemaster/tipos_poke.json",
};
const cpms = [0.0939999967813491, 0.135137430784308, 0.166397869586944, 0.192650914456886, 0.215732470154762, 0.236572655026622, 0.255720049142837, 0.273530381100769, 0.29024988412857, 0.306057381335773, 0.321087598800659, 0.335445032295077, 0.349212676286697, 0.36245774877879, 0.375235587358474, 0.387592411085168, 0.399567276239395, 0.41119354951725, 0.422500014305114, 0.432926413410414, 0.443107545375824, 0.453059953871985, 0.46279838681221, 0.472336077786704, 0.481684952974319, 0.490855810259008, 0.499858438968658, 0.508701756943992, 0.517393946647644, 0.525942508771329, 0.534354329109191, 0.542635762230353, 0.550792694091796, 0.558830599438087, 0.566754519939422, 0.574569148039264, 0.582278907299041, 0.589887911977272, 0.59740000963211, 0.604823657502073, 0.61215728521347, 0.61940411056605, 0.626567125320434, 0.633649181622743, 0.640652954578399, 0.647580963301656, 0.654435634613037, 0.661219263506722, 0.667934000492096, 0.674581899290818, 0.681164920330047, 0.687684905887771, 0.694143652915954, 0.700542893277978, 0.706884205341339, 0.713169102333341, 0.719399094581604, 0.725575616972598, 0.731700003147125, 0.734741011137376, 0.737769484519958, 0.740785574597326, 0.743789434432983, 0.746781208702482, 0.749761044979095, 0.752729105305821, 0.75568550825119, 0.758630366519684, 0.761563837528228, 0.764486065255226, 0.767397165298461, 0.77029727397159, 0.77318650484085, 0.776064945942412, 0.778932750225067, 0.781790064808426, 0.784636974334716, 0.787473583646825, 0.790300011634826, 0.792803950958807, 0.795300006866455, 0.79780392148697, 0.800300002098083, 0.802803892322847, 0.805299997329711, 0.807803863460723, 0.81029999256134, 0.812803834895026, 0.815299987792968, 0.817803806620319, 0.820299983024597, 0.822803778631297, 0.825299978256225, 0.827803750922782, 0.830299973487854, 0.832803753381377, 0.835300028324127, 0.837803755931569, 0.840300023555755, 0.842803729034748, 0.845300018787384, 0.847803702398935, 0.850300014019012, 0.852803676019539, 0.85530000925064, 0.857803649892077, 0.860300004482269, 0.862803624012168, 0.865299999713897, ];
const TYPE_TRANSLATION_MAP = { grass: "Planta", poison: "Venenoso", fire: "Fogo", water: "Água", electric: "Elétrico", ice: "Gelo", fighting: "Lutador", ground: "Terrestre", flying: "Voador", psychic: "Psíquico", bug: "Inseto", rock: "Pedra", ghost: "Fantasma", dragon: "Dragão", dark: "Sombrio", steel: "Aço", fairy: "Fada", normal: "Normal", };

let GLOBAL_POKE_DB = null;
let allPokemonDataForList = [];
let currentPokemonList = [];

const topControls = document.getElementById('top-controls');
const datadexContent = document.getElementById('datadex-content');

// --- 2. FUNÇÕES DO SCRIPT UNIFICADO ---

function getTypeColor(tipo) {
    const typeColors = { normal: "#A8A77A", fogo: "#FF4500", água: "#1E90FF", elétrico: "#F7D02C", planta: "#32CD32", gelo: "#96D9D6", lutador: "#C22E28", venenoso: "#A33EA1", terrestre: "#E2BF65", voador: "#A98FF3", psíquico: "#F95587", inseto: "#A6B91A", pedra: "#B6A136", fantasma: "#735797", dragão: "#6F35FC", sombrio: "#705746", aço: "#B7B7CE", fada: "#D685AD", grass: "#32CD32", poison: "#A33EA1", fire: "#FF4500", water: "#1E90FF", electric: "#F7D02C", ice: "#96D9D6", fighting: "#C22E28", ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A", rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746", steel: "#B7B7CE", fairy: "#D685AD", };
    return typeColors[tipo.toLowerCase()] || "#FFFFFF";
}

function calculateCP(baseStats, ivs, level) {
    const cpm = cpms[Math.round((level - 1) * 2)];
    return Math.floor(((baseStats.atk + ivs.atk) * Math.sqrt(baseStats.def + ivs.def) * Math.sqrt(baseStats.hp + ivs.hp) * cpm * cpm) / 10);
}

function formatarNomeParaExibicao(speciesName) {
    if (!speciesName) return "";
    return speciesName.replace("(Alolan)", "de Alola").replace("(Galarian)", "de Galar").replace("(Hisuian)", "de Hisui").replace("(Paldean)", "de Paldea").replace("Nidoran Male", "Nidoran♂").replace("Nidoran Female", "Nidoran♀");
}

function gerarChavesDeBuscaPossiveis(nomeOriginal) {
    let nomeLimpo = nomeOriginal.replace(/(Dinamax|Gigantamax)/i, "").replace(/\*/g, "").trim();
    if (nomeLimpo.includes("Flabébé")) { nomeLimpo = "Flabebe"; } else if (nomeLimpo.includes("Floette")) { nomeLimpo = "Floette"; } else if (nomeLimpo.includes("Florges")) { nomeLimpo = "Florges"; }
    const chaves = new Set();
    chaves.add(nomeLimpo);
    if (nomeLimpo.startsWith("Mega ")) { const nomeBase = nomeLimpo.substring(5); chaves.add(`${nomeBase} (Mega)`); } else if (nomeLimpo.endsWith(" (Mega)")) { const nomeBase = nomeLimpo.replace(" (Mega)", ""); chaves.add(`Mega ${nomeBase}`); }
    return Array.from(chaves);
}

async function carregarTodaABaseDeDados() {
    try {
        const responses = await Promise.all([fetch(URLS.MAIN_DATA).then((res) => res.json()), fetch(URLS.MAIN_DATA_FALLBACK).then((res) => res.json()), fetch(URLS.MEGA_DATA).then((res) => res.json()), fetch(URLS.GIGAMAX_DATA).then((res) => res.json()), fetch(URLS.IMAGES_PRIMARY).then((res) => res.json()), fetch(URLS.IMAGES_ALT).then((res) => res.json()), fetch(URLS.TYPE_DATA).then((res) => res.json()), ]);
        const [mainData, fallbackData, megaData, gigaData, primaryImages, altImages, typeData, ] = responses;
        const todosOsPokemons = [...mainData, ...fallbackData, ...megaData, ...gigaData, ];
        const pokemonsByNameMap = new Map();
        const pokemonsByDexMap = new Map();
        todosOsPokemons.forEach(p => { if (p.speciesName) { pokemonsByNameMap.set(p.speciesName.toLowerCase(), p); } if (p.dex && !p.speciesName.includes("(") && !p.speciesName.includes("Mega")) { if (!pokemonsByDexMap.has(p.dex)) { pokemonsByDexMap.set(p.dex, p); } } });
        return { pokemonsByNameMap, pokemonsByDexMap, mapaImagensPrimario: new Map(primaryImages.map((item) => [item.nome, item])), mapaImagensAlternativo: new Map(altImages.map((item) => [item.name, item])), dadosDosTipos: typeData, };
    } catch (error) {
        console.error("❌ Erro fatal ao carregar os arquivos JSON:", error);
        return null;
    }
}

function buscarDadosCompletosPokemon(nomeOriginal, database) {
    const chavesPossiveis = gerarChavesDeBuscaPossiveis(nomeOriginal);
    let pokemonData = null;
    for (const chave of chavesPossiveis) { pokemonData = database.pokemonsByNameMap.get(chave.toLowerCase()); if (pokemonData) break; }
    if (!pokemonData) { console.error(`Dados não encontrados para: ${nomeOriginal}`); return null; }
    const nomeParaExibicao = formatarNomeParaExibicao(pokemonData.speciesName);
    let infoImagens = null;
    for (const chave of chavesPossiveis) { infoImagens = database.mapaImagensPrimario.get(chave); if (infoImagens) break; }
    const imgNormal = infoImagens?.imgNormal;
    const imgShiny = infoImagens?.imgShiny;
    const infoImagensAlt = database.mapaImagensAlternativo.get(pokemonData.speciesId);
    const imgNormalFallback = infoImagensAlt?.imgNormal;
    const imgShinyFallback = infoImagensAlt?.imgShiny;
    return { ...pokemonData, imgNormal, imgShiny, imgNormalFallback, imgShinyFallback, nomeParaExibicao, };
}

// --- 3. FUNÇÕES DA INTERFACE DATADEX (ADAPTADAS) ---

function displayGenerationSelection() {
    topControls.innerHTML = '<h2 class="text-white text-center font-bold">Selecione uma Geração</h2>';
    const generationRanges = { 1: { start: 1, end: 151, region: "Kanto" }, 2: { start: 152, end: 251, region: "Johto" }, 3: { start: 252, end: 386, region: "Hoenn" }, 4: { start: 387, end: 493, region: "Sinnoh" }, 5: { start: 494, end: 649, region: "Unova" }, 6: { start: 650, end: 721, region: "Kalos" }, 7: { start: 722, end: 809, region: "Alola" }, 8: { start: 810, end: 905, region: "Galar" }, 9: { start: 906, end: 1025, region: "Paldea" }, };
    let generationHtml = '<div class="p-4"><div class="grid grid-cols-2 md:grid-cols-3 gap-4">';
    for (const gen in generationRanges) {
        generationHtml += `<div class="generation-card bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center text-center fade-in" data-gen="${gen}"><h3 class="text-xl font-bold text-white">Geração ${gen}</h3><p class="text-sm text-gray-400">${generationRanges[gen].region}</p></div>`;
    }
    generationHtml += `<div class="generation-card bg-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-center fade-in col-span-2 md:col-span-3" data-gen="all"><h3 class="text-xl font-bold text-white">Todas as Gerações</h3></div>`;
    generationHtml += '</div></div>';
    datadexContent.innerHTML = generationHtml;
    document.querySelectorAll('.generation-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const gen = e.currentTarget.dataset.gen;
            if (gen === 'all') { currentPokemonList = allPokemonDataForList; } else { const range = generationRanges[gen]; currentPokemonList = allPokemonDataForList.filter(p => p.dex >= range.start && p.dex <= range.end); }
            displayPokemonList(currentPokemonList);
        });
    });
}

function displayPokemonList(pokemonList) {
    topControls.innerHTML = `<div class="flex justify-between items-center"><button id="backToGenButton" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">&larr; Voltar</button><input type="text" id="searchInput" class="w-full max-w-xs p-2 rounded bg-gray-700 text-white border border-gray-600" placeholder="Pesquisar Pokémon..."></div>`;
    datadexContent.innerHTML = '<div id="pokemon-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 p-2"></div>';
    const grid = document.getElementById('pokemon-grid');
    
    const renderList = (list) => {
        grid.innerHTML = '';
        list.forEach(pokemon => {
            const pokemonCompleto = buscarDadosCompletosPokemon(pokemon.speciesName, GLOBAL_POKE_DB);
            if (!pokemonCompleto) return;
            
            const card = document.createElement('div');
            card.className = 'pokemon-card-list bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center fade-in';
            card.innerHTML = `<img src="${pokemonCompleto.imgNormal || pokemonCompleto.imgNormalFallback}" alt="${pokemonCompleto.nomeParaExibicao}" class="w-20 h-20 object-contain mb-2"><p class="text-white font-semibold text-sm capitalize">${pokemonCompleto.nomeParaExibicao}</p>`;
            card.addEventListener('click', () => showPokemonDetails(pokemon.dex));
            grid.appendChild(card);
        });
    };
    
    renderList(pokemonList);

    document.getElementById('backToGenButton').addEventListener('click', displayGenerationSelection);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredList = pokemonList.filter(p => formatarNomeParaExibicao(p.speciesName).toLowerCase().includes(searchTerm));
        renderList(filteredList);
    });
}

function showPokemonDetails(dexNumber) {
    const pokemonBase = allPokemonDataForList.find(p => p.dex === dexNumber);
    if(!pokemonBase) return;
    const pokemon = buscarDadosCompletosPokemon(pokemonBase.speciesName, GLOBAL_POKE_DB);
    if (!pokemon) { datadexContent.innerHTML = `<p class="text-white text-center">Não foi possível carregar os detalhes.</p>`; return; }

    topControls.innerHTML = `<button id="backToListButton" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">&larr; Voltar à Lista</button>`;
    
    const { dex, nomeParaExibicao, types, baseStats, fastMoves, chargedMoves } = pokemon;
    const imagemSrc = pokemon.imgNormal || pokemon.imgNormalFallback;
    const maxCP = calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 50);
    const tiposHTML = types.filter(t => t && t.toLowerCase() !== 'none').map(tipo => `<span class="pokedex-tipo" style="background-color: ${getTypeColor(tipo)}">${TYPE_TRANSLATION_MAP[tipo.toLowerCase()] || tipo}</span>`).join('');
    const formatarNomeMovimento = (nome) => nome.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    const ataquesRapidosHTML = fastMoves.map(ataque => `<li>${formatarNomeMovimento(ataque)}</li>`).join('');
    const ataquesCarregadosHTML = chargedMoves.map(ataque => `<li>${formatarNomeMovimento(ataque)}</li>`).join('');

    const cardHTML = `
        <div class="pokedex-card p-4 text-white fade-in" style="border-color: ${getTypeColor(types[0])}">
            <div class="flex flex-col items-center">
                <img src="${imagemSrc}" alt="${nomeParaExibicao}" class="w-48 h-48 mx-auto">
                <h2 class="text-3xl font-bold capitalize mb-2">${nomeParaExibicao} (#${String(dex).padStart(3, '0')})</h2>
                <div class="flex justify-center gap-2 mb-4">${tiposHTML}</div>
                <div class="w-full max-w-lg bg-gray-900/50 p-3 rounded-lg">
                    <h3 class="font-bold text-lg mb-2 text-center">Status e CP Máximo</h3>
                    <div class="grid grid-cols-3 gap-x-4 text-center mb-2">
                        <p><strong>Ataque:</strong> ${baseStats.atk}</p>
                        <p><strong>Defesa:</strong> ${baseStats.def}</p>
                        <p><strong>Stamina:</strong> ${baseStats.hp}</p>
                    </div>
                    <div class="stat-item mb-1"><span>ATK</span><div class="stat-bar"><div style="width: ${(baseStats.atk / 300) * 100}%; background-color: #f34444;"></div></div></div>
                    <div class="stat-item mb-1"><span>DEF</span><div class="stat-bar"><div style="width: ${(baseStats.def / 300) * 100}%; background-color: #448cf3;"></div></div></div>
                    <div class="stat-item mb-1"><span>HP</span><div class="stat-bar"><div style="width: ${(baseStats.hp / 300) * 100}%; background-color: #23ce23;"></div></div></div>
                    <p class="text-center mt-3"><strong>CP Máximo (Nível 50):</strong> ${maxCP}</p>
                </div>
                <div class="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-4">
                    <div class="bg-gray-900/50 p-3 rounded-lg">
                        <h3 class="font-bold text-lg mb-2">Ataques Rápidos</h3>
                        <ul class="space-y-2 text-sm list-disc list-inside">${ataquesRapidosHTML}</ul>
                    </div>
                    <div class="bg-gray-900/50 p-3 rounded-lg">
                        <h3 class="font-bold text-lg mb-2">Ataques Carregados</h3>
                        <ul class="space-y-2 text-sm list-disc list-inside">${ataquesCarregadosHTML}</ul>
                    </div>
                </div>
            </div>
        </div>`;
    
    datadexContent.innerHTML = cardHTML;
    document.getElementById('backToListButton').addEventListener('click', () => displayPokemonList(currentPokemonList));
}

// --- 4. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO (main) ---

async function main() {
    console.log("🚀 Iniciando Datadex Unificada...");
    datadexContent.innerHTML = `<p class="text-white text-center text-xl p-10">Carregando banco de dados...</p>`;

    GLOBAL_POKE_DB = await carregarTodaABaseDeDados();
    
    if (!GLOBAL_POKE_DB) {
        datadexContent.innerHTML = `<p class="text-red-500 text-center text-xl p-10">Falha ao carregar o banco de dados. Tente recarregar a página.</p>`;
        return;
    }

    allPokemonDataForList = Array.from(GLOBAL_POKE_DB.pokemonsByDexMap.values()).sort((a, b) => a.dex - b.dex);
    console.log("✅ Banco de dados carregado. Iniciando interface...");
    displayGenerationSelection();
}

window.addEventListener("load", main);