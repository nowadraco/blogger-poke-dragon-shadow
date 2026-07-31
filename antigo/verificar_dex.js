// =====================================================================
// 🕵️ RASTREADOR AVANÇADO DE FORMAS (GERADOR DE TXT)
// =====================================================================
const fs = require('fs'); // Módulo do Node para criar arquivos

const MEU_JSON_URL = "https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/json/poke_data.json";
// Essa rota /pokemon puxa TUDO: Megas, Alolan, Galarian, Gmax, etc.
const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon?limit=10000"; 

// 🛡️ FUNÇÃO DE NORMALIZAÇÃO
// Como você usa "pikachu_libre" e a API usa "pikachu-libre", 
// nós tiramos os traços e underlines para comparar de forma justa: "pikachulibre"
function normalizar(nome) {
    if (!nome) return "";
    return nome.toLowerCase().replace(/[-_ \*\.]/g, "");
}

async function caçarTudo() {
    console.log("📡 Baixando o seu banco de dados...");
    try {
        const meuResponse = await fetch(MEU_JSON_URL);
        const meuBanco = await meuResponse.json();
        
        // Salva os IDs do seu JSON já normalizados
        const meusIdsNormalizados = new Set(
            meuBanco.map(p => normalizar(p.speciesId || p.speciesName))
        );
        console.log(`✅ Você tem ${meusIdsNormalizados.size} registros (incluindo formas) no seu JSON.\n`);

        console.log("📡 Baixando a lista COMPLETA da PokéAPI (todas as formas)...");
        const apiResponse = await fetch(POKEAPI_URL);
        const apiBanco = await apiResponse.json();
        console.log(`✅ A PokéAPI tem ${apiBanco.results.length} registros no total!\n`);

        console.log("🔍 Cruzando os dados...");
        const faltantes = [];

        apiBanco.results.forEach(poke => {
            const apiNameNorm = normalizar(poke.name);
            
            // Se o nome da API não existe no seu JSON, adiciona na lista
            if (!meusIdsNormalizados.has(apiNameNorm)) {
                faltantes.push(`- Faltando: ${poke.name}`);
            }
        });

        // =========================================================
        // 📝 GERADOR DO ARQUIVO TXT
        // =========================================================
        const conteudoTxt = 
`=============================================================
 🕵️ RELATÓRIO DE POKÉMON E FORMAS FALTANTES (VS PokéAPI)
=============================================================
Seu JSON atual: ${meusIdsNormalizados.size} registros
PokéAPI Total: ${apiBanco.results.length} registros
=============================================================

⚠️ ATENÇÃO: A PokéAPI inclui formas que não existem no Pokémon GO 
(ex: formas "totem", Pikachu com bonés específicos, etc).
Use esta lista apenas como guia visual!

Encontramos ${faltantes.length} possíveis formas que você ainda não cadastrou:

${faltantes.join('\n')}
`;

        // Escreve o arquivo no seu computador
        fs.writeFileSync('relatorio_formas_faltantes.txt', conteudoTxt, 'utf-8');
        
        console.log("=================================================");
        console.log(`🎯 SUCESSO! O arquivo "relatorio_formas_faltantes.txt" foi criado!`);
        console.log(`Abra ele aí no explorador de arquivos do VS Code para ver.`);
        console.log("=================================================\n");

    } catch (erro) {
        console.error("❌ Ops! Ocorreu um erro:", erro);
    }
}

caçarTudo();