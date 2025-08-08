import json

def extrair_formas_nao_mega(arquivo_entrada='poke_data.json', arquivo_saida='formas_nao_mega.json'):
    """
    Lê um arquivo JSON de dados de Pokémon, encontra todas as formas Mega,
    localiza suas formas base correspondentes e salva os dados completos
    dessas formas base em um novo arquivo JSON.
    """
    try:
        # Abre e lê o arquivo JSON de entrada com codificação UTF-8
        with open(arquivo_entrada, 'r', encoding='utf-8') as f:
            todos_pokemons = json.load(f)
        print(f"Arquivo '{arquivo_entrada}' lido com sucesso.")
    except FileNotFoundError:
        print(f"ERRO: O arquivo '{arquivo_entrada}' não foi encontrado. Verifique o nome e o caminho.")
        return
    except json.JSONDecodeError:
        print(f"ERRO: O arquivo '{arquivo_entrada}' contém um erro de formatação JSON.")
        return

    # --- Passo 1: Encontrar os IDs das formas base que precisamos procurar ---
    # Usamos um 'set' para garantir que cada ID seja único e a busca seja rápida.
    ids_base_a_procurar = set()

    for pokemon in todos_pokemons:
        # A forma mais confiável de identificar um mega é pela tag
        if 'tags' in pokemon and 'mega' in pokemon.get('tags', []):
            species_id = pokemon.get('speciesId', '')
            
            # Converte o ID mega para o ID base (ex: 'venusaur_mega' -> 'venusaur')
            if species_id.endswith('_mega'):
                id_base = species_id.removesuffix('_mega')
                ids_base_a_procurar.add(id_base)

    if not ids_base_a_procurar:
        print("Nenhum Pokémon com a tag 'mega' foi encontrado.")
        return
        
    print(f"Foram encontradas {len(ids_base_a_procurar)} formas Mega. Procurando por suas formas base...")

    # --- Passo 2: Encontrar os dados completos das formas base ---
    formas_nao_mega = []
    for pokemon in todos_pokemons:
        species_id = pokemon.get('speciesId', '')
        # Verifica se o ID do Pokémon atual está na nossa lista de alvos
        if species_id in ids_base_a_procurar:
            # Adiciona o dicionário completo do Pokémon à nossa lista de resultados
            formas_nao_mega.append(pokemon)

    print(f"Foram encontrados os dados de {len(formas_nao_mega)} formas base correspondentes.")

    # --- Passo 3: Salvar os resultados em um novo arquivo JSON ---
    with open(arquivo_saida, 'w', encoding='utf-8') as f:
        # Usa indent=4 para o JSON ficar bem formatado e legível
        # ensure_ascii=False para garantir que caracteres especiais sejam salvos corretamente
        json.dump(formas_nao_mega, f, indent=4, ensure_ascii=False)
        
    print(f"Sucesso! Os dados foram salvos no arquivo '{arquivo_saida}'.")


# --- Execução do script ---
if __name__ == "__main__":
    # Coloque o nome do seu arquivo JSON de entrada aqui
    # O script espera que ele esteja na mesma pasta
    arquivo_json_completo = 'poke_data.json'
    
    # Nome do arquivo de saída que será criado
    arquivo_json_filtrado = 'formas_nao_mega.json'
    
    extrair_formas_nao_mega(arquivo_json_completo, arquivo_json_filtrado)