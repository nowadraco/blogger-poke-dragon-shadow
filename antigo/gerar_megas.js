// =====================================================================
// 🧬 CLONADOR ESPECIALIZADO: APENAS MEGARREIDES (Nome Corrigido)
// Lê o relatório, filtra apenas os "Megas" e gera os clones alinhados.
// =====================================================================
const fs = require('fs');

const TXT_PATH = './relatorio_formas_faltantes.txt';
const JSON_BASE_PATH = './json/poke_data.json'; 
const JSON_SAIDA_PATH = './poke_data_megas.json'; 

// 🌟 NOVA FUNÇÃO: Coloca o "Mega" sempre na frente!
function capitalizarNomeMega(nomeComTracos) {
    let palavras = nomeComTracos.split('-');
    
    // Encontra e remove a palavra 'mega' de onde ela estiver no array
    const indexMega = palavras.findIndex(p => p.toLowerCase() === 'mega');
    if (indexMega !== -1) {
        palavras.splice(indexMega, 1);
    }
    
    // Capitaliza o que sobrou (ex: ['mewtwo', 'x'] vira ['Mewtwo', 'X'])
    palavras = palavras.map(p => p.charAt(0).toUpperCase() + p.slice(1));
    
    // Adiciona o "Mega" na primeira posição
    palavras.unshift('Mega');
    
    return palavras.join(' ');
}

function encontrarBase(nomeFaltante, bancoBase) {
    const palavraBase = nomeFaltante.split('-')[0];
    return bancoBase.find(p => p.speciesId === palavraBase || p.speciesId.startsWith(palavraBase + '_'));
}

// Compacta arrays simples para 1 linha
function formatarJsonCompacto(objeto) {
    let jsonGerado = JSON.stringify(objeto, null, 4);
    jsonGerado = jsonGerado.replace(/\[\n\s+(.*?)\n\s+\]/gs, (match, conteudoInterno) => {
        if (conteudoInterno.includes('{')) return match;
        const conteudoEmUmaLinha = conteudoInterno.replace(/\s*\n\s*/g, ' ').trim();
        return `[${conteudoEmUmaLinha}]`;
    });
    return jsonGerado;
}

function iniciarClonagemMegas() {
    try {
        console.log("🔍 Procurando Megarreides perdidas...");
        
        if (!fs.existsSync(TXT_PATH)) throw new Error(`Arquivo não encontrado: ${TXT_PATH}`);
        if (!fs.existsSync(JSON_BASE_PATH)) throw new Error(`Arquivo não encontrado: ${JSON_BASE_PATH}`);

        const txtFaltantes = fs.readFileSync(TXT_PATH, 'utf-8');
        const bancoOriginal = JSON.parse(fs.readFileSync(JSON_BASE_PATH, 'utf-8'));
        
        const novosPokemons = [];
        let naoEncontrados = [];

        const linhas = txtFaltantes.split('\n');

        linhas.forEach(linha => {
            if (linha.includes('- Faltando:')) {
                const nomeRaw = linha.replace('- Faltando: ', '').trim();
                
                // Só passa se tiver "mega" no nome
                if (nomeRaw.toLowerCase().includes('mega')) {
                    const pokeBase = encontrarBase(nomeRaw, bancoOriginal);

                    if (pokeBase) {
                        const novoPoke = JSON.parse(JSON.stringify(pokeBase));
                        
                        novoPoke.speciesId = nomeRaw.replace(/-/g, '_'); 
                        
                        // 🌟 Usando a nova função inteligente de nomes aqui!
                        novoPoke.speciesName = capitalizarNomeMega(nomeRaw); 
                        
                        if (!novoPoke.tags) novoPoke.tags = [];
                        if (!novoPoke.tags.includes('clone_mega_automatico')) {
                            novoPoke.tags.push('clone_mega_automatico');
                        }

                        novosPokemons.push(novoPoke);
                    } else {
                        naoEncontrados.push(nomeRaw);
                    }
                }
            }
        });

        if (novosPokemons.length > 0) {
            const jsonFinalCompacto = formatarJsonCompacto(novosPokemons);
            fs.writeFileSync(JSON_SAIDA_PATH, jsonFinalCompacto, 'utf-8');

            console.log("\n=================================================");
            console.log(`✨ SUCESSO! ${novosPokemons.length} Megas formatados perfeitamente!`);
            console.log(`📁 Salvo em: ${JSON_SAIDA_PATH}`);
            console.log("=================================================");
        } else {
            console.log("🛑 Nenhum Pokémon com 'mega' no nome foi encontrado no seu TXT.");
        }

        if (naoEncontrados.length > 0) {
            console.log(`\n⚠️ Aviso: O script não achou a base destes megas: ${naoEncontrados.join(', ')}`);
        }

    } catch (erro) {
        console.error("❌ Ops! Algo deu errado:", erro.message);
    }
}

iniciarClonagemMegas();