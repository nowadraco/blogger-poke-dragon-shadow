const fs = require('fs');
const path = require('path');

// ========================================================
// ⚙️ CONFIGURAÇÃO DOS CAMINHOS DOS ARQUIVOS
// ========================================================
const fileBlogger = './testes/nova_gorocket/css-blogger.css';
const fileDatadex = './testes/nova_gorocket/css-datadex.css'; // Ou css-datadex21.css
const fileOutput = './testes/nova_gorocket/nao-achei.css';

console.log("=========================================");
console.log("🕵️‍♂️ DETETIVE DE CSS - Iniciando Comparação");
console.log("=========================================\n");

// 1. Verifica se os arquivos existem antes de começar
if (!fs.existsSync(fileBlogger)) {
    console.error(`❌ ERRO: Arquivo não encontrado -> ${fileBlogger}`);
    process.exit(1);
}
if (!fs.existsSync(fileDatadex)) {
    console.error(`❌ ERRO: Arquivo não encontrado -> ${fileDatadex}`);
    process.exit(1);
}

// 2. Lê o conteúdo dos arquivos
const cssBlogger = fs.readFileSync(fileBlogger, 'utf-8');
const cssDatadex = fs.readFileSync(fileDatadex, 'utf-8');

// ========================================================
// 🧠 FUNÇÕES INTELIGENTES DE ANÁLISE
// ========================================================

// Função para extrair cada bloco individual (Ex: .classe { regras })
function extractCssBlocks(cssText) {
    // Primeiro removemos todos os comentários para eles não atrapalharem
    let cleanCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
    const blocks = [];
    let buffer = "";
    let depth = 0;

    for (let i = 0; i < cleanCss.length; i++) {
        buffer += cleanCss[i];
        if (cleanCss[i] === '{') depth++;
        if (cleanCss[i] === '}') {
            depth--;
            if (depth === 0) {
                blocks.push(buffer.trim());
                buffer = "";
            }
        }
    }
    return blocks.filter(b => b.trim().length > 0);
}

// Função para "esmagar" o CSS (tira espaços, quebras de linha e pontos-e-vírgula) 
// Assim a comparação fica à prova de erros de digitação!
function normalizeForCompare(cssString) {
    return cssString
        .replace(/\/\*[\s\S]*?\*\//g, '') // Tira comentários
        .replace(/\s+/g, '')              // Tira todos os espaços e quebras
        .replace(/;/g, '')                // Tira os ; do final
        .toLowerCase();                   // Tudo minúsculo
}

// ========================================================
// 🚀 EXECUÇÃO DA COMPARAÇÃO
// ========================================================

console.log("⏳ Lendo e extraindo blocos do Blogger...");
const blocksBlogger = extractCssBlocks(cssBlogger);

console.log("⏳ Preparando o CSS do Datadex para leitura...");
const datadexNormalized = normalizeForCompare(cssDatadex);

const missingBlocks = [];

console.log("🔍 Comparando regras...\n");

// Para cada bloco no Blogger, verifica se o "irmão gêmeo" dele está no Datadex
blocksBlogger.forEach(block => {
    const blockNormalized = normalizeForCompare(block);
    
    // Se não encontrou o bloco esmagado dentro do arquivo esmagado do Datadex
    if (!datadexNormalized.includes(blockNormalized)) {
        missingBlocks.push(block);
    }
});

// ========================================================
// 💾 SALVANDO O RESULTADO
// ========================================================

if (missingBlocks.length > 0) {
    const cabecalho = `/* ========================================================
 * ARQUIVO GERADO AUTOMATICAMENTE
 * Estes estilos estavam no Blogger mas NÃO foram encontrados no Datadex.
 * Total de blocos faltando: ${missingBlocks.length}
 * ======================================================== */\n\n`;

    const conteudoFinal = cabecalho + missingBlocks.join('\n\n');
    
    // Cria ou sobrescreve o arquivo nao-achei.css
    fs.writeFileSync(fileOutput, conteudoFinal, 'utf-8');
    
    console.log(`✅ COMPARAÇÃO CONCLUÍDA!`);
    console.log(`⚠️ Foram encontrados ${missingBlocks.length} blocos de CSS faltando.`);
    console.log(`📁 Verifique o arquivo: ${fileOutput}`);
} else {
    // Se achou tudo, cria um arquivo dizendo que tá tudo certo
    fs.writeFileSync(fileOutput, '/* Parabéns! Todo o CSS do Blogger já está no Datadex! */', 'utf-8');
    
    console.log(`✅ COMPARAÇÃO CONCLUÍDA!`);
    console.log(`🎉 O CSS do Datadex está 100% atualizado. Nenhum bloco faltando!`);
}

console.log("\n=========================================");