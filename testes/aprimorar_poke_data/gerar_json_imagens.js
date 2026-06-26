const fs = require('fs');

// URL Base da API do GitHub
const repoUrl = "https://api.github.com/repos/nowadraco/pogo_assets/contents/Images/Pokemon%20-%20256x256/Addressable%20Assets?ref=master";
const baseUrlImg = "https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/";

async function capturarTodosArquivos() {
    let todosOsArquivos = [];
    let pagina = 1;
    let continuar = true;

    console.log("🚀 Iniciando caçada profunda (com paginação)...");

    while (continuar) {
        console.log(`📡 Consultando página ${pagina}...`);
        // Adicionamos o ?page=${pagina} na URL
        const resposta = await fetch(`${repoUrl}&page=${pagina}&per_page=100`);
        
        if (!resposta.ok) throw new Error("Erro na API do GitHub.");
        
        const dados = await resposta.json();
        
        // Se a página retornou arquivos, adiciona à nossa lista
        if (dados.length > 0) {
            todosOsArquivos = todosOsArquivos.concat(dados);
            pagina++;
        } else {
            // Se a página veio vazia, acabaram os arquivos
            continuar = false;
        }
    }

    console.log(`✅ Total de arquivos encontrados no GitHub: ${todosOsArquivos.length}`);
    
    // Agora processa o agrupamento (Normal + Shiny)
    const mapaDeImagens = new Map();
    
    todosOsArquivos.forEach(arq => {
        if (!arq.name.endsWith(".png")) return;

        const isShiny = arq.name.includes("_shiny");
        const nomeBase = arq.name.replace(".png", "").replace("_shiny", "");

        if (!mapaDeImagens.has(nomeBase)) {
            mapaDeImagens.set(nomeBase, { nome: nomeBase, imgNormal: null, imgShiny: null });
        }

        const pokeObj = mapaDeImagens.get(nomeBase);
        const linkPronto = baseUrlImg + arq.name;

        if (isShiny) pokeObj.imgShiny = linkPronto;
        else pokeObj.imgNormal = linkPronto;
    });

    const listaFinal = Array.from(mapaDeImagens.values());
    fs.writeFileSync("pogo_imagens_geradas.json", JSON.stringify(listaFinal, null, 4), "utf-8");
    console.log(`✨ JSON gerado com sucesso: ${listaFinal.length} entradas.`);
}

capturarTodosArquivos();
