// --- CONFIGURAÇÕES ---
const BASE_URL = ''; // Ex: 'http://localhost:8000' ou 'https://meusite.com'
const JSON_FILE_PATH = '/json/imagens_pokemon.json';

// NOVO: Defina o tamanho do lote de verificação
const TAMANHO_DO_LOTE = 50; // Menos requisições simultâneas para não sobrecarregar
// --- FIM DAS CONFIGURAÇÕES ---


// Elementos da página
const titleElement = document.getElementById('title');
const statusElement = document.getElementById('status');
const errorList = document.getElementById('error-list');

// Array para guardar os links quebrados
const brokenLinks = [];

// A função que testa a URL (sem alterações)
async function testUrl(pokemonName, imageType, url) {
    if (!url) return;

    let fullUrl = url;
    if (url.startsWith('/') && BASE_URL) {
        fullUrl = new URL(url, BASE_URL).href;
    }

    try {
        const response = await fetch(fullUrl, { method: 'HEAD' });
        if (response.status === 404) {
            const errorMessage = `[${pokemonName} - ${imageType}]: ${fullUrl}`;
            brokenLinks.push(errorMessage);
        }
    } catch (error) {
        console.error(`Erro de conexão para ${fullUrl}:`, error);
    }
}

// Função para exibir os resultados finais na tela (sem alterações)
function renderResults() {
    errorList.innerHTML = '';
    if (brokenLinks.length === 0) {
        titleElement.textContent = '✅ Nenhum link quebrado (404) encontrado!';
        titleElement.style.color = '#5cb85c';
        statusElement.textContent = `Todos os links foram verificados com sucesso.`;
    } else {
        titleElement.textContent = `🚨 ${brokenLinks.length} link(s) quebrado(s) encontrado(s):`;
        statusElement.textContent = 'A lista abaixo mostra as URLs que retornaram erro 404.';
        brokenLinks.forEach(link => {
            const li = document.createElement('li');
            li.textContent = link;
            errorList.appendChild(li);
        });
    }
}

// Inicia o processo
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(JSON_FILE_PATH);
        if (!response.ok) throw new Error(`Não foi possível carregar o JSON.`);
        
        const pokemons = await response.json();
        const totalPokemons = pokemons.length;
        
        statusElement.textContent = `Carregado! Iniciando verificação de ${totalPokemons * 2} links em lotes...`;

        // --- LÓGICA DE LOTES ---
        for (let i = 0; i < totalPokemons; i += TAMANHO_DO_LOTE) {
            // Pega uma "fatia" do array de pokémons
            const lote = pokemons.slice(i, i + TAMANHO_DO_LOTE);
            
            // Atualiza o status na tela
            statusElement.textContent = `Verificando lote ${i / TAMANHO_DO_LOTE + 1}... (${i + lote.length} de ${totalPokemons} Pokémon)`;
            
            // Cria as promessas de teste apenas para o lote atual
            const promisesDoLote = lote.flatMap(pokemon => [
                testUrl(pokemon.nome, 'Normal', pokemon.imgNormal),
                testUrl(pokemon.nome, 'Shiny', pokemon.imgShiny)
            ]);
            
            // Espera o lote atual terminar antes de ir para o próximo
            await Promise.all(promisesDoLote);
        }

        // Exibe os resultados finais
        renderResults();

    } catch (error) {
        titleElement.textContent = 'Erro Crítico';
        statusElement.textContent = `Não foi possível carregar ou processar o arquivo JSON. Detalhes: ${error.message}`;
    }
});