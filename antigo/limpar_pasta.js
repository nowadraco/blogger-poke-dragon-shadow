const fs = require('fs');
const path = require('path');

const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve');

console.log("Iniciando varredura na pasta...");

if (fs.existsSync(pastaDestino)) {
    const arquivos = fs.readdirSync(pastaDestino);
    let deletados = 0;

    arquivos.forEach(arquivo => {
        // Garante que só vai apagar os arquivos .json
        if (arquivo.endsWith('.json')) {
            fs.unlinkSync(path.join(pastaDestino, arquivo));
            deletados++;
        }
    });

    console.log(`✅ Limpeza concluída! ${deletados} arquivos pesados foram deletados e viraram poeira.`);
} else {
    console.log("⚠️ A pasta 'json/simulacao_pve' não existe. Não há nada para limpar.");
}