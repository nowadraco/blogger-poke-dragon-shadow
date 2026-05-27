const readline = require('readline');
const fs = require('fs');

// Configura o leitor para o terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=========================================");
console.log("🚀 GERADOR DE CDN (jsDelivr)");
console.log("=========================================\n");

rl.question('Cole o link do raw.githubusercontent.com: ', (url) => {
    try {
        // Remove espaços acidentais
        url = url.trim();

        // Valida se é um link do raw
        if (!url.startsWith('https://raw.githubusercontent.com/')) {
            console.log('\n❌ Erro: O link precisa começar com https://raw.githubusercontent.com/');
            rl.close();
            return;
        }

        // Pega a parte depois do domínio
        const pathPart = url.replace('https://raw.githubusercontent.com/', '');
        const parts = pathPart.split('/');

        if (parts.length < 4) {
            console.log('\n❌ Erro: Link inválido. Certifique-se de que é o link completo do arquivo.');
            rl.close();
            return;
        }

        // Extrai as partes para montar o CDN
        const user = parts[0];
        const repo = parts[1];
        const branchOrCommit = parts[2];
        const filePath = parts.slice(3).join('/');

        // Monta o link mágico do jsDelivr
        const cdnUrl = `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branchOrCommit}/${filePath}`;

        // Nome do arquivo onde será salvo
        const txtFilename = 'meus_links_cdn.txt';

        // Salva no txt (o "appendFileSync" adiciona ao final, sem apagar os antigos)
        fs.appendFileSync(txtFilename, cdnUrl + '\n');

        console.log('\n✅ Link CDN gerado com sucesso!');
        console.log(`🔗 CDN: ${cdnUrl}`);
        console.log(`📁 Salvo no arquivo: ${txtFilename}\n`);

    } catch (error) {
        console.error('\n❌ Erro inesperado:', error);
    }

    rl.close();
});