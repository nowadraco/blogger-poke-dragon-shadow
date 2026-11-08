const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const caminhoOrigem = path.join(__dirname, 'pokemon_artworks_completo.json');
const caminhoDestino = path.join(__dirname, 'pokemon_artworks_com_megas_parenteses.json');

function processarMegas() {
  console.log("Lendo arquivo original...");
  
  if (!fs.existsSync(caminhoOrigem)) {
    console.error(`Arquivo não encontrado em: ${caminhoOrigem}`);
    return;
  }

  const dadosOriginais = JSON.parse(fs.readFileSync(caminhoOrigem, 'utf-8'));
  const listaFinal = [];
  let contadorMegas = 0;

  for (const item of dadosOriginais) {
    // 1. Adiciona o item atual na lista
    listaFinal.push(item);

    // 2. Verifica se começa com "Mega "
    if (item.nome && item.nome.startsWith('Mega ')) {
      // Remove o "Mega " da frente (ex: "Mega Clefable" -> "Clefable", "Mega Charizard X" -> "Charizard X")
      const nomeBase = item.nome.replace(/^Mega\s+/, '').trim();
      const nomeComParenteses = `${nomeBase} (Mega)`;

      // Cria a cópia com o novo nome mantendo as mesmas imagens
      const itemDuplicado = {
        nome: nomeComParenteses,
        imgNormal: item.imgNormal,
        imgShiny: item.imgShiny
      };

      // Insere logo abaixo do original
      listaFinal.push(itemDuplicado);
      contadorMegas++;
    }
  }

  // Salva o novo arquivo
  fs.writeFileSync(caminhoDestino, JSON.stringify(listaFinal, null, 2), 'utf-8');

  console.log("=== PROCESSAMENTO CONCLUÍDO ===");
  console.log(`Total de registros no arquivo original: ${dadosOriginais.length}`);
  console.log(`Formas Mega duplicadas com sucesso: ${contadorMegas}`);
  console.log(`Total de registros no novo arquivo: ${listaFinal.length}`);
  console.log(`Novo arquivo salvo em: ${caminhoDestino}`);
}

processarMegas();