// =====================================================================
// 📸 GERADOR DE JSON DE IMAGENS (Evita requisições infinitas à API)
// =====================================================================
const fs = require('fs');

// O URL da API do GitHub para listar a pasta "Pokemon - 256x256"
const urlAPI = "https://api.github.com/repos/nowadraco/pogo_assets/contents/Images/Pokemon%20-%20256x256?ref=master";

// O URL Base bruto do Weserv + Raw GitHub para montar os links finais
const baseUrlImg = "https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/";

async function gerarJsonDeImagens() {
    try {
        console.log("🛰️ Ligando aos satélites do GitHub...");
        
        // Faz a requisição ÚNICA à API
        const resposta = await fetch(urlAPI);
        if (!resposta.ok) throw new Error("Falha ao acessar o GitHub. Limite de API atingido?");
        
        const arquivos = await resposta.json();
        const mapaDeImagens = new Map();

        console.log(`📦 Encontrados ${arquivos.length} arquivos. Agrupando Normais e Shinies...`);

        arquivos.forEach(arq => {
            // Ignora se não for PNG
            if (!arq.name.endsWith(".png")) return;

            // Descobre se é shiny olhando para o nome do arquivo
            const isShiny = arq.name.includes("_shiny");
            
            // Cria o "nome" base. Ex: "pokemon_icon_023_00_shiny.png" vira "pokemon_icon_023_00"
            const nomeBase = arq.name.replace(".png", "").replace("_shiny", "");

            // Se o Pokémon ainda não existe no mapa, cria a estrutura em branco
            if (!mapaDeImagens.has(nomeBase)) {
                mapaDeImagens.set(nomeBase, {
                    nome: nomeBase,
                    imgNormal: null,
                    imgShiny: null
                });
            }

            // Puxa o objeto do mapa para preencher
            const pokeObj = mapaDeImagens.get(nomeBase);
            const linkPronto = baseUrlImg + arq.name;

            // Joga o link na caixinha correta
            if (isShiny) {
                pokeObj.imgShiny = linkPronto;
            } else {
                pokeObj.imgNormal = linkPronto;
            }
        });

        // Transforma o Mapa num Array normal para salvar
        const listaFinal = Array.from(mapaDeImagens.values());

        // Escreve o ficheiro final na sua pasta!
        fs.writeFileSync("pogo_imagens_geradas.json", JSON.stringify(listaFinal, null, 4), "utf-8");

        console.log("\n=================================================");
        console.log(`✅ SUCESSO! Foram gerados ${listaFinal.length} pares de imagens.`);
        console.log(`📁 Ficheiro salvo como: pogo_imagens_geradas.json`);
        console.log("=================================================");

    } catch (erro) {
        console.error("❌ Ocorreu um erro:", erro);
    }
}

gerarJsonDeImagens();