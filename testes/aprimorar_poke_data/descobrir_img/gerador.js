const fs = require('fs');
const path = require('path');

const esperar = (ms) => new Promise(r => setTimeout(r, ms));

function formatarNome(nomeOriginal) {
  const partes = nomeOriginal.split('-');
  
  if (partes.includes('mega')) {
    const semMega = partes.filter(p => p !== 'mega');
    return 'Mega ' + semMega.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  
  return partes.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

async function coletarTodasAsArtes() {
  console.log("1/3 - Mapeando TODOS os arquivos reais via Git Trees...");

  const urlTree = "https://api.github.com/repos/PokeAPI/sprites/git/trees/master?recursive=1";
  const resTree = await fetch(urlTree);
  if (!resTree.ok) throw new Error("Erro ao consultar árvore do GitHub");

  const dadosTree = await resTree.json();

  const regex = /^sprites\/pokemon\/other\/official-artwork\/(\d+)\.png$/;
  const idsDisponiveis = dadosTree.tree
    .map(item => {
      const match = item.path.match(regex);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter(id => id !== null)
    .sort((a, b) => a - b);

  console.log(`2/3 - Encontrados ${idsDisponiveis.length} arquivos reais de arte oficial.`);
  console.log("Iniciando requisições dos nomes na PokéAPI...");

  const listaFinal = [];

  for (let i = 0; i < idsDisponiveis.length; i++) {
    const id = idsDisponiveis[i];

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      if (res.ok) {
        const data = await res.json();
        const nomeFormatado = formatarNome(data.name);

        listaFinal.push({
          nome: nomeFormatado,
          imgNormal: `https://images.weserv.nl/?&url=https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${id}.png`,
          imgShiny: `https://images.weserv.nl/?&url=https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
        });

        if (i % 25 === 0 || i === idsDisponiveis.length - 1) {
          console.log(`Processados: ${i + 1}/${idsDisponiveis.length} (${nomeFormatado})`);
        }
      }
    } catch (err) {
      console.warn(`Falha na API no ID ${id}:`, err);
    }

    await esperar(80);
  }

  console.log("3/3 - Concluído! Salvando arquivo JSON no disco...");

  // Define onde o arquivo será salvo (na mesma pasta do script)
  const caminhoArquivo = path.join(__dirname, 'pokemon_artworks_completo.json');
  
  // Escreve direto no disco
  fs.writeFileSync(caminhoArquivo, JSON.stringify(listaFinal, null, 2), 'utf-8');

  console.log(`Arquivo salvo com sucesso em: ${caminhoArquivo}`);
}

coletarTodasAsArtes();