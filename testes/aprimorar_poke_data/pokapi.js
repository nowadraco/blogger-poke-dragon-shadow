async function obterPokemonPorId(idOuNome) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${idOuNome}/`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    // Extraindo as informações principais
    const info = {
      id: data.id,
      nome: data.name, // "terapagos-terastal"
      tipos: data.types.map(t => t.type.name), // ["normal"]
      imagemOficial: data.sprites.other['official-artwork'].front_default,
      altura: data.height / 10 + ' m',
      peso: data.weight / 10 + ' kg'
    };

    console.log("Dados recebidos:", info);
    return info;
  } catch (error) {
    console.error("Falha ao buscar dados:", error);
  }
}

// Chamando para o ID 10278:
obterPokemonPorId(10278);