# Importa as bibliotecas necessárias
import requests
import json
import os

# URL da PokeAPI para buscar a lista de todos os Pokémon
# Pegamos um limite alto para garantir que todos sejam incluídos
TOTAL_POKEMON_URL = "https://pokeapi.co/api/v2/pokemon?limit=1300"

# O modelo da URL do sprite que você quer
SPRITE_URL_TEMPLATE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{}.png"

# Nome do arquivo de saída
OUTPUT_FILE = "pokemon_sprites.json"

def criar_json_de_sprites():
    """
    Busca todos os Pokémon da PokeAPI e cria um arquivo JSON com seus nomes, IDs e URLs de sprites.
    """
    print("Iniciando a busca pela lista completa de Pokémon...")
    
    try:
        # Faz a chamada para a API
        response = requests.get(TOTAL_POKEMON_URL)
        response.raise_for_status()  # Lança um erro se a requisição falhar (ex: erro 404, 500)
        
        # Converte a resposta para JSON
        data = response.json()
        pokemon_list = data.get("results", [])
        
        if not pokemon_list:
            print("Não foi possível obter a lista de Pokémon da API.")
            return

        print(f"Encontrados {len(pokemon_list)} Pokémon. Processando e montando as URLs dos sprites...")
        
        lista_final_de_sprites = []

        # Itera sobre cada Pokémon da lista
        for pokemon in pokemon_list:
            nome = pokemon.get("name")
            url_detalhes = pokemon.get("url")
            
            if nome and url_detalhes:
                # Extrai o ID do Pokémon da URL de detalhes (ex: .../pokemon/25/)
                pokemon_id = url_detalhes.split('/')[-2]
                
                # Monta a URL final do sprite
                sprite_url = SPRITE_URL_TEMPLATE.format(pokemon_id)
                
                # Cria um dicionário com as informações
                pokemon_info = {
                    "id": int(pokemon_id),
                    "name": nome,
                    "sprite_url": sprite_url
                }
                
                # Adiciona na nossa lista final
                lista_final_de_sprites.append(pokemon_info)

        print(f"Processamento concluído. Salvando no arquivo '{OUTPUT_FILE}'...")

        # Salva a lista completa em um arquivo JSON
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(lista_final_de_sprites, f, ensure_ascii=False, indent=4)
            
        # Pega o caminho completo do arquivo para mostrar ao usuário
        caminho_absoluto = os.path.abspath(OUTPUT_FILE)
        print(f"\n✅ Sucesso! O arquivo '{OUTPUT_FILE}' foi criado em:")
        print(caminho_absoluto)

    except requests.exceptions.RequestException as e:
        print(f"Ocorreu um erro de conexão: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

# Executa a função principal
if __name__ == "__main__":
    criar_json_de_sprites()