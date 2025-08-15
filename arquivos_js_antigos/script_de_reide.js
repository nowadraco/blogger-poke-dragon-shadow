
    /*
    =================================================
          SCRIPT DE REIDE
    =================================================
    */
    function limparNomePokemonReide(nome) {
        if (!nome) return '';
        return nome
            .replace(/\s*\(shadow\)\s*/i, '') 
            .replace(/\s*Dinamax\s*/i, '') 
            .replace(/\*/g, '')
            .trim();
    }

    async function carregarPokemonsReide() {
        try {
            // ▼▼▼ URLS CORRIGIDAS ▼▼▼
            const response = await fetch('https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_reide.json');
            const shinyResponse = await fetch('https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_reide_shiny.json');
            // ▲▲▲ URLS CORRIGIDAS ▲▲▲
            const pokemons = await response.json();
            const shinyPokemons = await shinyResponse.json();
            return { pokemons, shinyPokemons };
        } catch (error) {
            console.error('Erro ao carregar o arquivo JSON de Reide:', error);
            return { pokemons: [], shinyPokemons: [] };
        }
    }

    const cpmsReide = [0.0939999967813491, 0.135137430784308, 0.166397869586944, 0.192650914456886, 0.215732470154762, 0.236572655026622, 0.255720049142837, 0.273530381100769, 0.290249884128570, 0.306057381335773, 0.321087598800659, 0.335445032295077, 0.349212676286697, 0.362457748778790, 0.375235587358474, 0.387592411085168, 0.399567276239395, 0.411193549517250, 0.422500014305114, 0.432926413410414, 0.443107545375824, 0.453059953871985, 0.462798386812210, 0.472336077786704, 0.481684952974319, 0.490855810259008, 0.499858438968658, 0.508701756943992, 0.517393946647644, 0.525942508771329, 0.534354329109191, 0.542635762230353, 0.550792694091796, 0.558830599438087, 0.566754519939422, 0.574569148039264, 0.582278907299041, 0.589887911977272, 0.597400009632110, 0.604823657502073, 0.612157285213470, 0.619404110566050, 0.626567125320434, 0.633649181622743, 0.640652954578399, 0.647580963301656, 0.654435634613037, 0.661219263506722, 0.667934000492096, 0.674581899290818, 0.681164920330047, 0.687684905887771, 0.694143652915954, 0.700542893277978, 0.706884205341339, 0.713169102333341, 0.719399094581604, 0.725575616972598, 0.731700003147125, 0.734741011137376, 0.737769484519958, 0.740785574597326, 0.743789434432983, 0.746781208702482, 0.749761044979095, 0.752729105305821, 0.755685508251190, 0.758630366519684, 0.761563837528228, 0.764486065255226, 0.767397165298461, 0.770297273971590, 0.773186504840850, 0.776064945942412, 0.778932750225067, 0.781790064808426, 0.784636974334716, 0.787473583646825, 0.790300011634826, 0.792803950958807, 0.795300006866455, 0.797803921486970, 0.800300002098083, 0.802803892322847, 0.805299997329711, 0.807803863460723, 0.810299992561340, 0.812803834895026, 0.815299987792968, 0.817803806620319, 0.820299983024597, 0.822803778631297, 0.825299978256225, 0.827803750922782, 0.830299973487854, 0.832803753381377, 0.835300028324127, 0.837803755931569, 0.840300023555755, 0.842803729034748, 0.845300018787384, 0.847803702398935, 0.850300014019012, 0.852803676019539, 0.855300009250640, 0.857803649892077, 0.860300004482269, 0.862803624012168, 0.865299999713897];

    function getTypeColorReide(tipo) { switch (tipo.toLowerCase()) { case 'normal': return '#A8A77A'; case 'fogo': return '#FF4500'; case 'água': return '#1E90FF'; case 'elétrico': return '#F7D02C'; case 'planta': return '#32CD32'; case 'gelo': return '#96D9D6'; case 'lutador': return '#C22E28'; case 'venenoso': return '#A33EA1'; case 'terrestre': return '#E2BF65'; case 'voador': return '#A98FF3'; case 'psíquico': return '#F95587'; case 'inseto': return '#A6B91A'; case 'pedra': return '#B6A136'; case 'fantasma': return '#735797'; case 'dragão': return '#6F35FC'; case 'sombrio': return '#705746'; case 'aço': return '#B7B7CE'; case 'fada': return '#D685AD'; default: return '#FFFFFF'; } }
    
    // ▼▼▼ URLS CORRIGIDAS ▼▼▼
    function getTypeIconReide(tipo) { switch (tipo.toLowerCase()) { case 'aço': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/aco.png'; case 'água': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/agua.png'; case 'dragão': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/dragao.png'; case 'elétrico': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/eletrico.png'; case 'fada': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/fada.png'; case 'fantasma': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/fantasma.png'; case 'fogo': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/fogo.png'; case 'gelo': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/gelo.png'; case 'inseto': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/inseto.png'; case 'lutador': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/lutador.png'; case 'normal': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/normal.png'; case 'pedra': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/pedra.png'; case 'planta': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/planta.png'; case 'psíquico': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/psiquico.png'; case 'sombrio': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/sombrio.png'; case 'terrestre': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/terrestre.png'; case 'venenoso': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/venenoso.png'; case 'voador': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/src/imagens/tipos/voador.png'; default: return ''; } }
    function getWeatherIconReide(tipo) { switch (tipo.toLowerCase()) { case 'planta': case 'fogo': case 'terrestre': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ensolarado.png'; case 'água': case 'elétrico': case 'inseto': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/chovendo.png'; case 'normal': case 'pedra': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/parcialmente_nublado.png'; case 'fada': case 'lutador': case 'venenoso': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nublado.png'; case 'voador': case 'dragão': case 'psíquico': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ventando.png'; case 'gelo': case 'aço': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nevando.png'; case 'sombrio': case 'fantasma': return 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/neblina.png'; default: return ''; } }
    // ▲▲▲ URLS CORRIGIDAS ▲▲▲

    function calculateCPReide(baseStats, ivs, level) { const cpmIndex = Math.round((level - 1) * 2); const cpm = cpmsReide[cpmIndex]; return Math.floor(((baseStats.atk + ivs.atk) * Math.sqrt(baseStats.def + ivs.def) * Math.sqrt(baseStats.hp + ivs.hp) * cpm ** 2) / 10); }

    function buscarPokemonReide(pokemons, nomeLimpo) {
        return pokemons.find(pokemon => pokemon.nome.toLowerCase() === nomeLimpo.toLowerCase());
    }
    function buscarShinyPokemonReide(shinyPokemons, nomeLimpo) {
        return shinyPokemons.find(shiny => shiny.nome.toLowerCase() === nomeLimpo.toLowerCase());
    }

    function alternarImagensReide(pokemons, shinyPokemons) {
        const listas = document.querySelectorAll('.reide-list li');
        listas.forEach(item => {
            const span = item.querySelector('span');
            if (!span) return;

            const nomeOriginal = span.textContent.trim();
            const img = item.querySelector('img.pokemon-reide-img');

            if (img && nomeOriginal.includes('*')) {

                const nomeLimpo = limparNomePokemonReide(nomeOriginal);

                let pokemon = buscarPokemonReide(pokemons, nomeLimpo);
                let shinyPokemon = buscarShinyPokemonReide(shinyPokemons, nomeLimpo);

                if (!pokemon || !shinyPokemon) {
                    console.warn(`Dados de Pokémon ou Shiny não encontrados para ${nomeLimpo} após limpeza.`);
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

    function generatePokemonListItemReide(pokemon, shinyPokemon, nomeExibicao) {
        const validTipos = pokemon.tipos.filter(tipo => tipo !== "null");
        const typeColors = validTipos.map(tipo => getTypeColorReide(tipo));
        let gradientBackground = typeColors.length === 1 ? typeColors[0] : `linear-gradient(to right, ${typeColors.join(', ')})`;
        const baseStats = pokemon.statusBase;

        const isShadow = /\(shadow\)/i.test(nomeExibicao);

        const minIVs = isShadow
            ? { atk: 6, def: 6, hp: 6 }
            : { atk: 10, def: 10, hp: 10 };

        const cpInfo = {
            normal: calculateCPReide(baseStats, minIVs, 20),
            perfect: calculateCPReide(baseStats, { atk: 15, def: 15, hp: 15 }, 20)
        };
        const cpBoost = {
            normal: calculateCPReide(baseStats, minIVs, 25), 
            perfect: calculateCPReide(baseStats, { atk: 15, def: 15, hp: 15 }, 25)
        };
        // ==========================================================

        const typeIcons = validTipos.map(tipo => `<img src="${getTypeIconReide(tipo)}" alt="${tipo}">`).join('');
        const weatherIcons = validTipos.map(tipo => `<img class="clima-boost" src="${getWeatherIconReide(tipo)}">`).join('');

        const isDynamax = /Dinamax/i.test(nomeExibicao);
        const shadowClass = isShadow ? 'is-shadow' : '';
        const dynamaxClass = isDynamax ? 'is-dynamax' : '';

        const pokemonImageHTML = `
            <div class="pokemon-image-container ${shadowClass} ${dynamaxClass}">
                <img class="pokemon-reide-img" src="${pokemon.img}" alt="${nomeExibicao}">
            </div>
        `;

        return `<li class="PokemonReideItem ${validTipos.map(t => t.toLowerCase()).join(' ')}"
                     style="background: ${gradientBackground};">
                    ${pokemonImageHTML}
                    <span>${nomeExibicao}</span> <div class="tipo-icons">${typeIcons}</div>
                    <div class="pc-info">PC: ${cpInfo.normal} - ${cpInfo.perfect}</div>
                    <div class="boost">
                        ${weatherIcons}
                        <div class="pc-boost"> ${cpBoost.normal} - ${cpBoost.perfect}</div>
                    </div>
                </li>`;
    }

    async function processReideList() {
        try {
            const { pokemons, shinyPokemons } = await carregarPokemonsReide();
            const reideLists = document.querySelectorAll('.reide-list');

            for (const reideListElement of reideLists) {
                const pokemonNames = Array.from(reideListElement.getElementsByTagName('li'))
                    .map(li => li.textContent.trim());

                const processedPokemonNames = pokemonNames.map(originalName => ({
                    original: originalName,

                    cleaned: limparNomePokemonReide(originalName)
                }));

                const filteredPokemon = pokemons.filter(pokemon => {
                    return processedPokemonNames.some(item => item.cleaned.toLowerCase() === pokemon.nome.trim().toLowerCase());
                });

                const pokemonListHTML = filteredPokemon.map(pokemon => {
                    const processedInfo = processedPokemonNames.find(item => item.cleaned.toLowerCase() === pokemon.nome.trim().toLowerCase());
                    if (processedInfo) {
                        const nomeExibicao = processedInfo.original;
                        const shinyPokemon = shinyPokemons.find(shiny => shiny.nome.toLowerCase() === pokemon.nome.toLowerCase());
                        return generatePokemonListItemReide(pokemon, shinyPokemon, nomeExibicao);
                    }
                    return '';
                }).join('');
                reideListElement.innerHTML = pokemonListHTML;
            }
            alternarImagensReide(pokemons, shinyPokemons);
        } catch (error) {
            console.error('Erro ao processar a lista de Pokémon de Reide:', error);
        }
    }

    processReideList();