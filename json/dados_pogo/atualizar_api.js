const fs = require('fs/promises');
const path = require('path');

// Configurações Base
const BASE_URL = 'https://pogoapi.net';
const pastaPrincipal = path.join(__dirname, 'json', 'dados_pogo'); 
const arquivoDeLinks = path.join(pastaPrincipal, 'links_da_api.txt');

async function atualizarDadosPoGo() {
    try {
        await fs.mkdir(pastaPrincipal, { recursive: true });

        console.log('🔍 Buscando hashes atuais no servidor da API...');
        
        // 1. Baixa o arquivo de hashes MAIS RECENTE da internet
        const resHashesAPI = await fetch(`${BASE_URL}/api/v1/api_hashes.json`);
        const hashesAPI = await resHashesAPI.json();

        // 2. Tenta ler o arquivo de hashes LOCAL (para saber o que você já tem)
        let hashesLocais = {};
        const caminhoHashLocal = path.join(pastaPrincipal, 'api_hashes', 'api_hashes.json');
        
        try {
            const arquivoLocal = await fs.readFile(caminhoHashLocal, 'utf-8');
            hashesLocais = JSON.parse(arquivoLocal);
        } catch (e) {
            console.log('📂 Primeiro uso detectado ou arquivo de cache ausente. Baixando tudo...');
        }

        // Prepara o arquivo TXT de links
        await fs.writeFile(arquivoDeLinks, '=== Links da API do Pokémon GO ===\n\n');

        let atualizacoesFeitas = 0;

        // 3. Compara arquivo por arquivo
        // O Object.entries transforma o JSON de hashes em uma lista que podemos percorrer
        for (const [nomeArquivo, dadosHashAPI] of Object.entries(hashesAPI)) {
            
            const endpoint = dadosHashAPI.full_path; // ex: /api/v1/pokemon_names.json
            const urlCompleta = `${BASE_URL}${endpoint}`;
            
            // Salva a URL no arquivo de texto
            await fs.appendFile(arquivoDeLinks, `${urlCompleta}\n`);

            // Pega o código Hash de 256 bits (o mais seguro para comparar)
            const hashNovo = dadosHashAPI.hash_sha256;
            // Se o arquivo já existir no seu cache local, pega o hash dele, senão retorna nulo
            const hashAntigo = hashesLocais[nomeArquivo] ? hashesLocais[nomeArquivo].hash_sha256 : null;

            // Configura os caminhos das pastas (ex: json/dados_pogo/pokemon_names/pokemon_names.json)
            const nomePasta = nomeArquivo.replace('.json', ''); 
            const caminhoSubpasta = path.join(pastaPrincipal, nomePasta);
            const caminhoArquivoFinal = path.join(caminhoSubpasta, nomeArquivo);

            // Verifica se você não deletou o arquivo sem querer
            let arquivoExisteFisicamente = false;
            try {
                await fs.access(caminhoArquivoFinal);
                arquivoExisteFisicamente = true;
            } catch {
                arquivoExisteFisicamente = false;
            }

            // === A COMPARAÇÃO ACONTECE AQUI ===
            if (hashNovo === hashAntigo && arquivoExisteFisicamente) {
                console.log(`⏩ Pulando: ${nomeArquivo} (Já está na versão mais recente)`);
                continue; // O 'continue' faz o loop pular para o próximo arquivo da lista
            }

            // Se chegou até aqui, é porque tem atualização ou o arquivo sumiu!
            console.log(`⏳ Baixando atualização: ${nomeArquivo}...`);
            await fs.mkdir(caminhoSubpasta, { recursive: true });

            const resposta = await fetch(urlCompleta);
            if (!resposta.ok) {
                console.error(`❌ Erro no link ${urlCompleta}`);
                continue;
            }

            const dados = await resposta.json();
            await fs.writeFile(caminhoArquivoFinal, JSON.stringify(dados, null, 2));
            atualizacoesFeitas++;
        }
        
        // 4. Salva o NOVO api_hashes.json localmente para servir de base na próxima vez que você rodar
        const pastaHash = path.join(pastaPrincipal, 'api_hashes');
        await fs.mkdir(pastaHash, { recursive: true });
        await fs.writeFile(caminhoHashLocal, JSON.stringify(hashesAPI, null, 2));

        console.log(`\n🎉 Processo concluído! Arquivos atualizados/baixados nesta sessão: ${atualizacoesFeitas}`);

    } catch (erro) {
        console.error('Ocorreu um erro geral:', erro);
    }
}

// Executa o script
atualizarDadosPoGo();