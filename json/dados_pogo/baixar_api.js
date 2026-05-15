const fs = require('fs/promises');
const path = require('path');

// 1. Configurações Base
const BASE_URL = 'https://pogoapi.net';
// Caminho principal: json/dados_pogo
const pastaPrincipal = path.join(__dirname, 'json', 'dados_pogo'); 
const arquivoDeLinks = path.join(pastaPrincipal, 'links_da_api.txt');

// 2. A lista completa de finais da API que você encontrou
const endpoints = [
    '/api/v1/api_hashes.json',
    '/api/v1/pokemon_names.json',
    '/api/v1/released_pokemon.json',
    '/api/v1/nesting_pokemon.json',
    '/api/v1/shiny_pokemon.json',
    '/api/v1/raid_exclusive_pokemon.json',
    '/api/v1/alolan_pokemon.json',
    '/api/v1/possible_ditto_pokemon.json',
    '/api/v1/pokemon_stats.json',
    '/api/v1/fast_moves.json',
    '/api/v1/charged_moves.json',
    '/api/v1/pokemon_max_cp.json',
    '/api/v1/pokemon_buddy_distances.json',
    '/api/v1/pokemon_candy_to_evolve.json',
    '/api/v1/pokemon_encounter_data.json',
    '/api/v1/pokemon_types.json',
    '/api/v1/weather_boosts.json',
    '/api/v1/type_effectiveness.json',
    '/api/v1/pokemon_rarity.json',
    '/api/v1/pokemon_powerup_requirements.json',
    '/api/v1/pokemon_genders.json',
    '/api/v1/player_xp_requirements.json',
    '/api/v1/pokemon_generations.json',
    '/api/v1/shadow_pokemon.json',
    '/api/v1/pokemon_forms.json',
    '/api/v1/current_pokemon_moves.json',
    '/api/v1/pvp_exclusive_pokemon.json',
    '/api/v1/galarian_pokemon.json',
    '/api/v1/cp_multiplier.json',
    '/api/v1/community_days.json',
    '/api/v1/pokemon_evolutions.json',
    '/api/v1/raid_bosses.json',
    '/api/v1/research_task_exclusive_pokemon.json',
    '/api/v1/mega_pokemon.json',
    '/api/v1/pokemon_height_weight_scale.json',
    '/api/v1/levelup_rewards.json',
    '/api/v1/badges.json',
    '/api/v1/gobattle_league_rewards.json',
    '/api/v1/raid_settings.json',
    '/api/v1/mega_evolution_settings.json',
    '/api/v1/friendship_level_settings.json',
    '/api/v1/gobattle_ranking_settings.json',
    '/api/v1/baby_pokemon.json',
    '/api/v1/pvp_fast_moves.json',
    '/api/v1/pvp_charged_moves.json',
    '/api/v1/time_limited_shiny_pokemon.json',
    '/api/v1/photobomb_exclusive_pokemon.json'
];

async function organizarDadosPoGo() {
    try {
        // Cria a pasta principal 'json/dados_pogo'
        await fs.mkdir(pastaPrincipal, { recursive: true });
        
        // Cria (ou zera) o arquivo de texto com um título
        await fs.writeFile(arquivoDeLinks, '=== Links da API do Pokémon GO ===\n\n');
        console.log('📂 Pasta principal e arquivo de links criados!');

        // Loop por cada link da lista
        for (const endpoint of endpoints) {
            // Separa o nome do arquivo da URL (ex: 'pokemon_names.json')
            const nomeArquivo = endpoint.split('/').pop(); 
            // Tira o '.json' para usar como nome da pasta (ex: 'pokemon_names')
            const nomePasta = nomeArquivo.replace('.json', ''); 

            const urlCompleta = `${BASE_URL}${endpoint}`;

            // Salva a URL no arquivo de texto
            await fs.appendFile(arquivoDeLinks, `${urlCompleta}\n`);

            // Cria a subpasta específica para este JSON
            const caminhoSubpasta = path.join(pastaPrincipal, nomePasta);
            await fs.mkdir(caminhoSubpasta, { recursive: true });

            console.log(`⏳ Baixando: ${nomeArquivo}...`);
            
            // Faz a requisição na API
            const resposta = await fetch(urlCompleta);
            
            if (!resposta.ok) {
                console.error(`❌ Erro no link ${urlCompleta}: Status ${resposta.status}`);
                continue; // Pula para o próximo arquivo se der erro
            }

            const dados = await resposta.json();
            
            // Define o caminho final do arquivo dentro da subpasta recém-criada
            const caminhoArquivoFinal = path.join(caminhoSubpasta, nomeArquivo);

            // Salva o arquivo localmente
            await fs.writeFile(caminhoArquivoFinal, JSON.stringify(dados, null, 2));
            
            console.log(`✅ Salvo em: json/dados_pogo/${nomePasta}/${nomeArquivo}`);
        }
        
        console.log('\n🎉 Sincronização concluída! Todos os arquivos e pastas foram criados.');

    } catch (erro) {
        console.error('Ocorreu um erro geral:', erro);
    }
}

// Executa o script
organizarDadosPoGo();