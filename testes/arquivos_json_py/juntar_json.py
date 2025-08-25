import json

def combinar_imagens(arquivo_normal, arquivo_shiny, arquivo_saida):
    """
    Combina dois arquivos JSON de imagens (normal e shiny) em um único
    arquivo JSON, associando as imagens pelo campo 'nome'.
    """
    try:
        # Carrega os dados dos arquivos de entrada
        with open(arquivo_normal, 'r', encoding='utf-8') as f:
            dados_normais = json.load(f)
        print(f"Lido com sucesso: {len(dados_normais)} registros de '{arquivo_normal}'")

        with open(arquivo_shiny, 'r', encoding='utf-8') as f:
            dados_shiny = json.load(f)
        print(f"Lido com sucesso: {len(dados_shiny)} registros de '{arquivo_shiny}'")

    except FileNotFoundError as e:
        print(f"ERRO: Arquivo não encontrado - {e.filename}")
        return
    except json.JSONDecodeError as e:
        print(f"ERRO: O arquivo contém um erro de formatação JSON - {e}")
        return

    # Usamos um dicionário para combinar os dados de forma eficiente.
    # A chave será o nome do Pokémon.
    dados_combinados = {}

    # Passo 1: Processar todas as imagens normais primeiro
    for item in dados_normais:
        nome = item.get('nome')
        if not nome:
            continue  # Ignora registros sem nome

        # Cria a entrada para este Pokémon, definindo a imagem normal
        # e inicializando a shiny como None (nula)
        dados_combinados[nome] = {
            "nome": nome,
            "imgNormal": item.get('img'),
            "imgShiny": None
        }

    # Passo 2: Processar as imagens shiny e adicioná-las aos registros existentes
    for item in dados_shiny:
        nome = item.get('nome')
        if not nome:
            continue

        # Se o Pokémon já existe no nosso dicionário (veio do arquivo normal)...
        if nome in dados_combinados:
            # ...apenas adicionamos a URL da imagem shiny.
            dados_combinados[nome]['imgShiny'] = item.get('img')
        else:
            # Se não existir, é um Pokémon que só tem imagem shiny no seu JSON.
            # Criamos um novo registro para ele.
            dados_combinados[nome] = {
                "nome": nome,
                "imgNormal": None, # Não tinha imagem normal
                "imgShiny": item.get('img')
            }
    
    # Converte o dicionário de volta para uma lista, que é o formato JSON final desejado
    lista_final = list(dados_combinados.values())
    
    print(f"\nProcessamento concluído. Total de {len(lista_final)} registros únicos combinados.")

    # Passo 3: Salvar a lista final no arquivo de saída
    with open(arquivo_saida, 'w', encoding='utf-8') as f:
        json.dump(lista_final, f, indent=4, ensure_ascii=False)

    print(f"Sucesso! Arquivo combinado salvo como '{arquivo_saida}'.")


# --- BLOCO PRINCIPAL DE EXECUÇÃO ---
if __name__ == "__main__":
    # Nomes dos arquivos de entrada
    arquivo_imagens_normais = 'nomes_e_imagens.json'
    arquivo_imagens_shiny = 'nomes_e_imagens_shiny.json'

    # Nome do arquivo de saída que será criado
    arquivo_final_combinado = 'imagens_pokemon.json'

    combinar_imagens(arquivo_imagens_normais, arquivo_imagens_shiny, arquivo_final_combinado)