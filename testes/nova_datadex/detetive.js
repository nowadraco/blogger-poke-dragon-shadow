const fs = require('fs');

// Pega o caminho do arquivo direto do comando no terminal
const NOME_DO_ARQUIVO = process.argv[2];

if (!NOME_DO_ARQUIVO) {
    console.error("❌ ALERTA: Você esqueceu de colocar o nome do arquivo!");
    console.error("👉 Como usar: node detetive.js /caminho/completo/do/arquivo.js");
    process.exit(1);
}

try {
    const codigo = fs.readFileSync(NOME_DO_ARQUIVO, 'utf8');

    // Procura funções no formato: function nomeDaFuncao()
    const matchesPadrao = [...codigo.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);

    // Procura funções no formato: window.nomeDaFuncao = function() ou = async function()
    const matchesWindow = [...codigo.matchAll(/window\.([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?function/g)].map(m => m[1]);

    const todasFuncoes = [...matchesPadrao, ...matchesWindow];
    const contagem = {};

    todasFuncoes.forEach(f => {
        contagem[f] = (contagem[f] || 0) + 1;
    });

    console.log(`\n🔍 ESCANEANDO O ARQUIVO: ${NOME_DO_ARQUIVO}`);
    console.log("====================================================");

    let encontrouDuplicada = false;
    for (let nomeFuncao in contagem) {
        if (contagem[nomeFuncao] > 1) {
            console.log(`🚨 ALERTA: A função "${nomeFuncao}" está escrita ${contagem[nomeFuncao]} vezes!`);
            encontrouDuplicada = true;
        }
    }

    if (!encontrouDuplicada) {
        console.log("✅ Tudo limpo! Nenhuma função duplicada foi encontrada.");
    }
    console.log("====================================================\n");

} catch (erro) {
    console.error(`\n❌ ERRO: Não consegui ler o arquivo.`);
    console.error(`O caminho digitado foi: "${NOME_DO_ARQUIVO}"`);
    console.error(`Tem certeza que o nome do arquivo no final está correto?`);
}