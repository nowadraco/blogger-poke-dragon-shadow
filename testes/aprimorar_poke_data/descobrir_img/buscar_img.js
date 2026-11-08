async function checarLimitesOfficialArtwork() {
  console.log("Consultando o repositório PokeAPI/sprites no GitHub...");
  
  try {
    const res = await fetch("https://api.github.com/repos/PokeAPI/sprites/contents/sprites/pokemon/other/official-artwork");
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    
    const arquivos = await res.json();
    
    // Filtra apenas os IDs numéricos (ex: "10278.png" -> 10278)
    const ids = arquivos
      .map(arq => {
        const m = arq.name.match(/^(\d+)\.png$/);
        return m ? parseInt(m[1], 10) : null;
      })
      .filter(id => id !== null)
      .sort((a, b) => a - b);

    const normais = ids.filter(id => id < 10000);
    const formasEspeciais = ids.filter(id => id >= 10000);

    console.log("=== RELATÓRIO DE ARTES OFICIAIS ===");
    console.log(`Total de artes disponíveis: ${ids.length}`);
    console.log(`Espécies normais: Vai do #${normais[0]} até #${normais[normais.length - 1]}`);
    console.log(`Formas alternativas/Megas (10000+): Vai do #${formasEspeciais[0]} até #${formasEspeciais[formasEspeciais.length - 1]}`);
    console.log("IDs de formas especiais cadastrados:", formasEspeciais);

    return { normais, formasEspeciais, todosIds: ids };
  } catch (err) {
    console.error("Falha ao consultar repositório:", err);
  }
}

checarLimitesOfficialArtwork();