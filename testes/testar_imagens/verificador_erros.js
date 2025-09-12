// --- CONFIGURAÇÕES ---
// Coloque o endereço base do seu site ou servidor aqui, se necessário.
// Se as imagens com caminho relativo (ex: /src/...) estiverem na mesma pasta do projeto,
// pode deixar em branco.
const BASE_URL = ''; // Ex: 'http://localhost:8000' ou 'https://meusite.com'

// Caminho para o seu arquivo JSON
const JSON_FILE_PATH = '/json/imagens_pokemon.json';
// --- FIM DAS CONFIGURAÇÕES ---


// Elementos da página
const titleElement = document.getElementById('title');
const statusElement = document.getElementById('status');
const errorList = document.getElementById('error-list');

// Array para guardar os links quebrados
const brokenLinks = [];

// Função que testa uma URL
async function testUrl(pokemonName, imageType, url) {
    if (!url) return;

    // Constrói a URL completa se for um caminho relativo
    let fullUrl = url;
    if (url.startsWith('/') && BASE_URL) {
        fullUrl = new URL(url, BASE_URL).href;
    }

    try {
        const response = await fetch(fullUrl, { method: 'HEAD' });

        // A MUDANÇA PRINCIPAL ESTÁ AQUI:
        // Só faz algo se o status for 404
        if (response.status === 404) {
            const errorMessage = `[${pokemonName} - ${imageType}]: ${fullUrl}`;
            brokenLinks.push(errorMessage);
        }
    } catch (error) {
        // Ignora erros de conexão para focar apenas nos 404
        console.error(`Erro de conexão para ${fullUrl}:`, error);
    }
}

// Função para exibir os resultados na tela
function renderResults() {
    errorList.innerHTML = ''; // Limpa a lista

    if (brokenLinks.length === 0) {
        titleElement.textContent = '✅ Nenhum link quebrado (404) encontrado!';
        titleElement.style.color = '#5cb85c'; // Verde
        statusElement.textContent = 'Todos os links foram verificados e estão funcionando.';
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
        
        // Cria uma lista de promessas para todos os testes
        const testPromises = pokemons.flatMap(pokemon => [
            testUrl(pokemon.nome, 'Normal', pokemon.imgNormal),
            testUrl(pokemon.nome, 'Shiny', pokemon.imgShiny)
        ]);
        
        // Espera todos os testes terminarem
        await Promise.all(testPromises);

        // Exibe os resultados finais
        renderResults();

    } catch (error) {
        titleElement.textContent = 'Erro Crítico';
        statusElement.textContent = `Não foi possível carregar ou processar o arquivo JSON. Verifique o caminho e o conteúdo do arquivo. Detalhes: ${error.message}`;
    }
});
