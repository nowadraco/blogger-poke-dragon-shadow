// =====================================================================
// 🧬 CLONADOR DE POKÉMON: GERADOR DE ESQUELETOS EXTRA (Com Indentação)
// Lê o relatório de faltantes, busca a base, clona e cria os novos!
// =====================================================================
const fs = require('fs');

const TXT_PATH = './relatorio_formas_faltantes.txt';
const JSON_BASE_PATH = './json/poke_data.json'; 
const JSON_SAIDA_PATH = './poke_data_extra.json'; 

// Formata "raichu-mega-x" em "Raichu Mega X"
function capitalizarNome(nomeComTracos) {
    return nomeComTracos
        .split('-')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}

// A Inteligência para encontrar a base correta
function encontrarBase(nomeFaltante, bancoBase) {
    const dicionarioEspecial = {
        'nidoran-f': 'nidoran_female',
        'nidoran-m': 'nidoran_male',
        'mr-mime': 'mr_mime',
        'mr-rime': 'mr_rime',
        'mime-jr': 'mime_jr',
        'ho-oh': 'ho_oh',
        'porygon-z': 'porygon_z',
        'jangmo-o': 'jangmo_o',
        'hakamo-o': 'hakamo_o',
        'kommo-o': 'kommo_o',
        'tapu-': 'tapu_' 
    };

    for (const [prefixo, idOriginal] of Object.entries(dicionarioEspecial)) {
        if (nomeFaltante.startsWith(prefixo)) {
            if (prefixo === 'tapu-') return bancoBase.find(p => p.speciesId === nomeFaltante.split('-').slice(0,2).join('_'));
            return bancoBase.find(p => p.speciesId === idOriginal);
        }
    }

    const palavraBase = nomeFaltante.split('-')[0];
    return bancoBase.find(p => p.speciesId === palavraBase || p.speciesId.startsWith(palavraBase + '_'));
}

// 🪄 MÁGICA DA INDENTAÇÃO: Compacta arrays simples para 1 linha
function formatarJsonCompacto(objeto) {
    let jsonGerado = JSON.stringify(objeto, null, 4);
    
    // Procura todos os arrays [...] e colapsa o que está dentro deles
    jsonGerado = jsonGerado.replace(/\[\n\s+(.*?)\n\s+\]/gs, (match, conteudoInterno) => {
        // Se o array tiver um objeto '{' dentro, não mexe nele
        if (conteudoInterno.includes('{')) return match;
        
        // Remove as quebras de linha e alinha os itens
        const conteudoEmUmaLinha = conteudoInterno.replace(/\s*\n\s*/g, ' ').trim();
        return `[${conteudoEmUmaLinha}]`;
    });

    return jsonGerado;
}

function iniciarClonagem() {
    try {
        console.log("📂 Lendo arquivos locais...");
        
        if (!fs.existsSync(TXT_PATH)) throw new Error(`Arquivo não encontrado: ${TXT_PATH}`);
        if (!fs.existsSync(JSON_BASE_PATH)) throw new Error(`Arquivo não encontrado: ${JSON_BASE_PATH}`);

        const txtFaltantes = fs.readFileSync(TXT_PATH, 'utf-8');
        const bancoOriginal = JSON.parse(fs.readFileSync(JSON_BASE_PATH, 'utf-8'));
        
        const novosPokemons = [];
        let naoEncontrados = [];

        const linhas = txtFaltantes.split('\n');
        console.log("🧬 Iniciando processo de clonagem...");

        linhas.forEach(linha => {
            if (linha.includes('- Faltando:')) {
                const nomeRaw = linha.replace('- Faltando: ', '').trim();
                const pokeBase = encontrarBase(nomeRaw, bancoOriginal);

                if (pokeBase) {
                    const novoPoke = JSON.parse(JSON.stringify(pokeBase));
                    
                    novoPoke.speciesId = nomeRaw.replace(/-/g, '_'); 
                    novoPoke.speciesName = capitalizarNome(nomeRaw); 
                    
                    if (!novoPoke.tags) novoPoke.tags = [];
                    if (!novoPoke.tags.includes('clone_automatico')) {
                        novoPoke.tags.push('clone_automatico');
                    }

                    novosPokemons.push(novoPoke);
                } else {
                    naoEncontrados.push(nomeRaw);
                }
            }
        });

        // 🌟 Usamos o nosso novo formatador inteligente aqui!
        const jsonFinalCompacto = formatarJsonCompacto(novosPokemons);
        fs.writeFileSync(JSON_SAIDA_PATH, jsonFinalCompacto, 'utf-8');

        console.log("\n=================================================");
        console.log(`✅ SUCESSO! ${novosPokemons.length} "Esqueletos" foram gerados!`);
        console.log(`📁 Arquivo salvo como: ${JSON_SAIDA_PATH}`);
        console.log("=================================================");

        if (naoEncontrados.length > 0) {
            console.log(`\n⚠️ Aviso: O script não conseguiu deduzir a base de ${naoEncontrados.length} nomes:`);
            console.log(naoEncontrados.join(', '));
        }

    } catch (erro) {
        console.error("❌ Ops! Algo deu errado:", erro.message);
    }
}

iniciarClonagem();