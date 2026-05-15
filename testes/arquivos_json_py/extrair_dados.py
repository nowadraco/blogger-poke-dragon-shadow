import json

def extrair_nome_e_imagem(arquivo_entrada, arquivo_saida):
    """
    Lê um arquivo JSON, extrai apenas os campos 'nome' e 'img' de cada 
    objeto na lista e salva o resultado em um novo arquivo JSON.
    """
    try:
        # Tenta abrir e ler o arquivo JSON de entrada
        with open(arquivo_entrada, 'r', encoding='utf-8') as f:
            dados_originais = json.load(f)
        print(f"Arquivo '{arquivo_entrada}' lido com sucesso.")
    except FileNotFoundError:
        print(f"ERRO: O arquivo de entrada '{arquivo_entrada}' não foi encontrado.")
        return
    except json.JSONDecodeError:
        print(f"ERRO: O arquivo '{arquivo_entrada}' não parece ser um JSON válido.")
        return

    # Lista vazia para guardar os dados que vamos extrair
    dados_extraidos = []

    # Passa por cada item (cada Pokémon) na lista de dados originais
    for item in dados_originais:
        # Verifica se as chaves 'nome' e 'img' existem no item atual
        # para evitar erros caso algum item não tenha esses dados
        if 'nome' in item and 'img' in item:
            
            # Cria um novo dicionário apenas com as informações que queremos
            novo_dicionario = {
                "nome": item['nome'],
                "img": item['img']
            }
            # Adiciona o novo dicionário à nossa lista de dados extraídos
            dados_extraidos.append(novo_dicionario)
    
    # Agora, salva a lista com os dados extraídos no novo arquivo
    with open(arquivo_saida, 'w', encoding='utf-8') as f:
        # json.dump escreve os dados no arquivo
        # indent=4 formata o arquivo de saída para ser fácil de ler
        # ensure_ascii=False permite caracteres como "ç" e acentos
        json.dump(dados_extraidos, f, indent=4, ensure_ascii=False)
    
    print(f"\nSucesso! Os dados foram extraídos e salvos em '{arquivo_saida}'.")


# --- BLOCO DE EXECUÇÃO ---
# É aqui que você define os nomes dos arquivos
if __name__ == "__main__":
    # Nome do arquivo JSON que o script vai ler
    arquivo_de_leitura = 'poke_reide_shiny.json'

    # Nome do novo arquivo JSON que o script vai criar
    arquivo_de_saida = 'nomes_e_imagens_shiny.json'

    # Chama a função principal com os nomes dos arquivos
    extrair_nome_e_imagem(arquivo_de_leitura, arquivo_de_saida)