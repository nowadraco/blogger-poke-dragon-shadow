async function carregarPokemons() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/f195b360d4cdf757ba02bfc79156fa433a1b1467/json/poke_reide.json');
        const shinyResponse = await fetch('https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/8ecf913e73ced8b24a5d05aaaa79c0c19d5eb66e/json/poke_reide_shiny.json');
        const pokemons = await response.json();
        const shinyPokemons = await shinyResponse.json();
        return { pokemons, shinyPokemons };
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
        return { pokemons: [], shinyPokemons: [] };
    }
}

const cpms = [0.0939999967813491, 0.135137430784308, 0.166397869586944, 0.192650914456886, 0.215732470154762, 0.236572655026622, 0.255720049142837, 0.273530381100769, 0.290249884128570, 0.306057381335773, 0.321087598800659, 0.335445032295077, 0.349212676286697, 0.362457748778790, 0.375235587358474, 0.387592411085168, 0.399567276239395, 0.411193549517250, 0.422500014305114, 0.432926413410414, 0.443107545375824, 0.453059953871985, 0.462798386812210, 0.472336077786704, 0.481684952974319, 0.490855810259008, 0.499858438968658, 0.508701756943992, 0.517393946647644, 0.525942508771329, 0.534354329109191, 0.542635762230353, 0.550792694091796, 0.558830599438087, 0.566754519939422, 0.574569148039264, 0.582278907299041, 0.589887911977272, 0.597400009632110, 0.604823657502073, 0.612157285213470, 0.619404110566050, 0.626567125320434, 0.633649181622743, 0.640652954578399, 0.647580963301656, 0.654435634613037, 0.661219263506722, 0.667934000492096, 0.674581899290818, 0.681164920330047, 0.687684905887771, 0.694143652915954, 0.700542893277978, 0.706884205341339, 0.713169102333341, 0.719399094581604, 0.725575616972598, 0.731700003147125, 0.734741011137376, 0.737769484519958, 0.740785574597326, 0.743789434432983, 0.746781208702482, 0.749761044979095, 0.752729105305821, 0.755685508251190, 0.758630366519684, 0.761563837528228, 0.764486065255226, 0.767397165298461, 0.770297273971590, 0.773186504840850, 0.776064945942412, 0.778932750225067, 0.781790064808426, 0.784636974334716, 0.787473583646825, 0.790300011634826, 0.792803950958807, 0.795300006866455, 0.797803921486970, 0.800300002098083, 0.802803892322847, 0.805299997329711, 0.807803863460723, 0.810299992561340, 0.812803834895026, 0.815299987792968, 0.817803806620319, 0.820299983024597, 0.822803778631297, 0.825299978256225, 0.827803750922782, 0.830299973487854, 0.832803753381377, 0.835300028324127, 0.837803755931569, 0.840300023555755, 0.842803729034748, 0.845300018787384, 0.847803702398935, 0.850300014019012, 0.852803676019539, 0.855300009250640, 0.857803649892077, 0.860300004482269, 0.862803624012168, 0.865299999713897];;

function getTypeColor(tipo) {
    switch (tipo.toLowerCase()) {
        case 'normal': return '#A8A77A';
        case 'fogo': return '#FF4500';
        case 'água': return '#1E90FF';
        case 'elétrico': return '#F7D02C';
        case 'planta': return '#32CD32';
        case 'gelo': return '#96D9D6';
        case 'lutador': return '#C22E28';
        case 'venenoso': return '#A33EA1';
        case 'terrestre': return '#E2BF65';
        case 'voador': return '#A98FF3';
        case 'psíquico': return '#F95587';
        case 'inseto': return '#A6B91A';
        case 'pedra': return '#B6A136';
        case 'fantasma': return '#735797';
        case 'dragão': return '#6F35FC';
        case 'sombrio': return '#705746';
        case 'aço': return '#B7B7CE';
        case 'fada': return '#D685AD';
        case 'substitute': return '#000';
        default: return '#FFFFFF';
    }
}

function getTypeIcon(tipo) {
    switch (tipo.toLowerCase()) {
        case 'aço': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/aco.png';
        case 'água': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/agua.png';
        case 'dragão': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/dragao.png';
        case 'elétrico': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/eletrico.png';
        case 'fada': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fada.png';
        case 'fantasma': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fantasma.png';
        case 'fogo': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fogo.png';
        case 'gelo': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/gelo.png';
        case 'inseto': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/inseto.png';
        case 'lutador': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/lutador.png';
        case 'normal': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/normal.png';
        case 'pedra': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/pedra.png';
        case 'planta': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/planta.png';
        case 'psíquico': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/psiquico.png';
        case 'sombrio': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/sombrio.png';
        case 'terrestre': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/terrestre.png';
        case 'venenoso': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/venenoso.png';
        case 'voador': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/voador.png';
        default: return '';
    }
}

function getWeatherIcon(tipo) {
    switch (tipo.toLowerCase()) {
        case 'planta':
        case 'fogo':
        case 'terrestre':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ensolarado.png';
        case 'água':
        case 'elétrico':
        case 'inseto':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/chovendo.png';
        case 'normal':
        case 'pedra':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/parcialmente_nublado.png';
        case 'fada':
        case 'lutador':
        case 'venenoso':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nublado.png';
        case 'voador':
        case 'dragão':
        case 'psíquico':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ventando.png';
        case 'gelo':
        case 'aço':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nevando.png';
        case 'sombrio':
        case 'fantasma':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/neblina.png';
        default:
            return '';
    }
}

function calculateCP(baseStats, ivs, level) {
    const cpmIndex = Math.round((level - 1) * 2);
    const cpm = cpms[cpmIndex];
    const cp = Math.floor(((baseStats.atk + ivs.atk) *
        Math.sqrt(baseStats.def + ivs.def) *
        Math.sqrt(baseStats.hp + ivs.hp) *
        cpm ** 2) / 10);
    return cp;
}

function buscarPokemon(pokemons, nome) {
    const nomeNormalizado = nome.replace('*', '').toLowerCase();
    return pokemons.find(pokemon => pokemon.nome.toLowerCase() === nomeNormalizado);
}

function buscarShinyPokemon(shinyPokemons, nome) {
    const nomeNormalizado = nome.replace('*', '').toLowerCase();
    return shinyPokemons.find(shiny => shiny.nome.toLowerCase() === nomeNormalizado);
}

function alternarImagens(pokemons, shinyPokemons) {
    const listas = document.querySelectorAll('.pokemon-list li');

    listas.forEach(item => {
        const span = item.querySelector('span'); // Busca o <span> dentro do <li>
        if (!span) return; // Sai se não encontrar o <span>

        const nomeOriginal = span.textContent.trim(); // Captura o nome do Pokémon do <span>
        const nomeSemAsterisco = nomeOriginal.replace('*', '').trim();
        const img = item.querySelector('img');

        if (img && nomeOriginal.includes('*')) {
            let pokemon = buscarPokemon(pokemons, nomeSemAsterisco);
            let shinyPokemon = buscarShinyPokemon(shinyPokemons, nomeSemAsterisco);

            if (!pokemon || !shinyPokemon) {
                img.src = 'placeholder.png';
                return;
            }

            let showShiny = false;

            setInterval(() => {
                img.style.transition = 'opacity 0.5s';
                img.style.opacity = 0;

                setTimeout(() => {
                    img.src = showShiny ? shinyPokemon.img : pokemon.img;
                    img.style.opacity = 1;
                    showShiny = !showShiny;
                }, 500);
            }, 2500);
        }
    });
}

function generatePokemonListItem(pokemon, shinyPokemon, nomeExibicao) { // Novo parâmetro
    const validTipos = pokemon.tipos.filter(tipo => tipo !== "null");
    const typeColors = validTipos.map(tipo => getTypeColor(tipo));

    let gradientBackground;
    if (typeColors.length === 1) {
        gradientBackground = typeColors[0];
    } else {
        gradientBackground = `linear-gradient(to right, ${typeColors.join(', ')})`;
    }

    const baseStats = pokemon.statusBase;
    const cpInfo = {
        normal: calculateCP(baseStats, { atk: 10, def: 10, hp: 10 }, 20),
        perfect: calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 20)
    };
    const cpBoost = {
        normal: calculateCP(baseStats, { atk: 10, def: 10, hp: 10 }, 25),
        perfect: calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 25)
    };

    const typeIcons = validTipos.map(tipo =>
        `<img src="${getTypeIcon(tipo)}" alt="${tipo}">`
    ).join('');

    const weatherIcons = validTipos.map(tipo =>
        `<img class="clima-boost" src="${getWeatherIcon(tipo)}">`
    ).join('');


    return `<li class="Selvagem ${validTipos.map(t => t.toLowerCase()).join(' ')}" 
                style="background: ${gradientBackground};">
                <img class="imgSelvagem" src="${pokemon.img}" alt="${nomeExibicao}"> 
                <span>${nomeExibicao}</span> <div class="tipo-icons">${typeIcons}</div>
                <div class="pc-info">PC: ${cpInfo.normal} - ${cpInfo.perfect}</div>
                <div class="boost">
                    ${weatherIcons}
                    <div class="pc-boost"> ${cpBoost.normal} - ${cpBoost.perfect}</div>
                </div>
            </li>`;
}

async function processSpecificPokemonList() {
    try {
        const { pokemons, shinyPokemons } = await carregarPokemons();

        const pokemonLists = document.querySelectorAll('.pokemon-list');

        for (const pokemonListElement of pokemonLists) {
            const pokemonNames = Array.from(pokemonListElement.getElementsByTagName('li'))
                .map(li => li.textContent.trim());

            const pokemonNamesComAsterisco = pokemonNames.map(name => ({
                nome: name.replace('*', '').trim(),
                temAsterisco: name.includes('*')
            }));

            const filteredPokemon = pokemons.filter(pokemon => {
                return pokemonNamesComAsterisco.some(item => item.nome === pokemon.nome.trim());
            });

            const pokemonListHTML = filteredPokemon.map(pokemon => {
                const nomeOriginal = pokemonNamesComAsterisco.find(item => item.nome === pokemon.nome.trim());
                const nomeExibicao = nomeOriginal.temAsterisco ? `${pokemon.nome}*` : pokemon.nome;

                const shinyPokemon = shinyPokemons.find(shiny => shiny.nome.toLowerCase() === pokemon.nome.toLowerCase());

                return generatePokemonListItem(pokemon, shinyPokemon, nomeExibicao);
            }).join('');

            pokemonListElement.innerHTML = pokemonListHTML;

            if (!pokemonListElement.classList.contains('selvagens')) {
                pokemonListElement.classList.add('selvagens');
            }
        }

        alternarImagens(pokemons, shinyPokemons);

    } catch (error) {
        console.error('Erro ao processar as listas de Pokémon:', error);
    }
}

processSpecificPokemonList();