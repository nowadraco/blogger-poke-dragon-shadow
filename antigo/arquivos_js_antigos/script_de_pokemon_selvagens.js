
    /*
    =================================================
      SCRIPT DE POKEMON SELVAGENS (CORREÇÃO FINAL)
    =================================================
    */

    // FUNÇÃO CORRIGIDA: Apenas remove os modificadores, sem alterar nomes regionais.
    function limparNomeSelvagem(nome) {
        if (!nome) return '';
        
        // Remove *, (shadow) e Dinamax, mas mantém "de Alola", "de Galar", etc.
        return nome
            .replace(/\*/g, '')
            .replace(/\s*\(shadow\)\s*/i, '') 
            .replace(/\s*Dinamax\s*/i, '')
            .trim();
    }

    async function carregarPokemons() {
        try {
            // ▼▼▼ URLS CORRIGIDAS ▼▼▼
            const response = await fetch('https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_selvagens.json');
            const shinyResponse = await fetch('https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_reide_shiny.json');
            // ▲▲▲ URLS CORRIGIDAS ▲▲▲
            
            const pokemons = await response.json();
            const shinyPokemons = await shinyResponse.json();
            return { pokemons, shinyPokemons };
        } catch (error) {
            console.error('Erro ao carregar o arquivo JSON:', error);
            return { pokemons: [], shinyPokemons: [] };
        }
    }

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
            default: return '#FFFFFF';
        }
    }

    function criarElementoPokemon(pokemon, nomeExibicao) {
        const li = document.createElement('li');
        let classList = `Selvagem ${pokemon.tipo1.toLowerCase()}`;
        if (pokemon.tipo2) {
            classList += ` ${pokemon.tipo2.toLowerCase()}`;
        }
        li.className = classList;

        if (pokemon.tipo2 && pokemon.tipo2.toLowerCase() !== 'null') {
            li.style.background = `linear-gradient(to right, ${getTypeColor(pokemon.tipo1)}, ${getTypeColor(pokemon.tipo2)})`;
        } else {
            li.style.backgroundColor = getTypeColor(pokemon.tipo1);
        }

        const isShadow = /\(shadow\)/i.test(nomeExibicao);
        const isDynamax = /Dinamax/i.test(nomeExibicao);

        const shadowClass = isShadow ? 'is-shadow' : '';
        const dynamaxClass = isDynamax ? 'is-dynamax' : '';

        const imageContainer = document.createElement('div');
        imageContainer.className = `pokemon-image-container ${shadowClass} ${dynamaxClass}`;

        const img = document.createElement('img');
        img.src = pokemon.img;
        img.alt = nomeExibicao;
        img.classList.add('imgSelvagem');
        imageContainer.appendChild(img);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = nomeExibicao;

        li.appendChild(imageContainer);
        li.appendChild(nameSpan);

        return li;
    }

    function buscarPokemon(pokemons, nome) {
        const nomeLimpo = limparNomeSelvagem(nome);
        return pokemons.find(pokemon => pokemon.nome.toLowerCase() === nomeLimpo.toLowerCase());
    }

    function buscarShinyPokemon(shinyPokemons, nome) {
        const nomeLimpo = limparNomeSelvagem(nome);
        return shinyPokemons.find(shiny => shiny.nome.toLowerCase() === nomeLimpo.toLowerCase());
    }

    function alternarImagens(pokemons, shinyPokemons) {
        const listas = document.querySelectorAll('.pokemon-list li');

        listas.forEach(item => {
            const nomeOriginal = item.querySelector('span')?.textContent.trim();
            if (!nomeOriginal) return;

            const img = item.querySelector('img');
            const pokemon = buscarPokemon(pokemons, nomeOriginal);

            if (!img || !pokemon) return;

            if (nomeOriginal.includes('*')) {
                const shinyPokemon = buscarShinyPokemon(shinyPokemons, nomeOriginal);

                if (shinyPokemon) {
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
                } else {
                    console.warn(`Shiny marcado para "${limparNomeSelvagem(nomeOriginal)}", mas não encontrado nos dados de shiny.`);
                }
            }
        });
    }
    
    async function preencherLista() {
        const { pokemons, shinyPokemons } = await carregarPokemons();
        const substitute = pokemons.find(p => p.nome.toLowerCase() === 'substitute') || {
            nome: 'Substitute',
            tipo1: 'normal',
            // ▼▼▼ URL CORRIGIDA ▼▼▼
            img: 'https://cdn.jsdelivr.net/gh/nowadraco/pokedragonshadow.site@main/img/assets/substitute.png'
            // ▲▲▲ URL CORRIGIDA ▲▲▲
        };

        const listas = document.querySelectorAll('.pokemon-list');

        listas.forEach(lista => {
            const itensOriginais = Array.from(lista.querySelectorAll('li'));

            itensOriginais.forEach(item => {
                const nomeOriginal = item.textContent.trim();
                let pokemon = buscarPokemon(pokemons, nomeOriginal);

                if (!pokemon) {
                    console.warn(`Pokémon "${nomeOriginal}" não encontrado. Usando substituto.`);
                    pokemon = substitute;
                }
                
                const novoItem = criarElementoPokemon(pokemon, nomeOriginal);
                item.replaceWith(novoItem);
            });

            alternarImagens(pokemons, shinyPokemons);
        });
    }

    window.addEventListener('load', preencherLista);
