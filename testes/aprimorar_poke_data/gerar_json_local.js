const fs = require('fs');
const path = require('path');

// 🌟 COLOQUE AQUI O CAMINHO DA SUA PASTA LOCAL
// Exemplo: './assets/imagens/Addressable Assets'
const pastaLocal = './assets/imagens/Addressable Assets'; 

// URL Base onde elas estão hospedadas (para o JSON final)
const baseUrlImg = "https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/";

function gerarJsonLocal() {
    console.log("📂 Lendo arquivos da pasta local...");

    try {
        // Lê todos os nomes de arquivos da pasta
        const arquivos = fs.readdirSync(pastaLocal);
        const mapaDeImagens = new Map();

        arquivos.forEach(nomeArquivo => {
            // Ignora se não for PNG
            if (!nomeArquivo.endsWith(".png")) return;

            const isShiny = nomeArquivo.includes("_shiny");
            const nomeBase = nomeArquivo.replace(".png", "").replace("_shiny", "");

            if (!mapaDeImagens.has(nomeBase)) {
                mapaDeImagens.set(nomeBase, {
                    nome: nomeBase,
                    imgNormal: null,
                    imgShiny: null
                });
            }

            const pokeObj = mapaDeImagens.get(nomeBase);
            const linkPronto = baseUrlImg + nomeArquivo;

            if (isShiny) pokeObj.imgShiny = linkPronto;
            else pokeObj.imgNormal = linkPronto;
        });

        const listaFinal = Array.from(mapaDeImagens.values());

        // Salva o arquivo na pasta
        fs.writeFileSync("pogo_imagens_geradas.json", JSON.stringify(listaFinal, null, 4), "utf-8");

        console.log(`\n=================================================`);
        console.log(`✅ SUCESSO! ${listaFinal.length} pokémons processados.`);
        console.log(`📁 Ficheiro salvo como: pogo_imagens_geradas.json`);
        console.log(`=================================================\n`);

    } catch (erro) {
        console.error("❌ Erro ao ler a pasta. Verifique se o caminho 'pastaLocal' está correto:", erro.message);
    }
}

gerarJsonLocal();