import json
import os
import copy

# Lista dos Pokémon que possuem uma forma Gigantamax (em minúsculas).
POKEMON_COM_GIGAMAX = {
    "venusaur", "charizard", "blastoise", "butterfree", "pikachu", "meowth",
    "machamp", "gengar", "kingler", "lapras", "eevee", "snorlax", "garbodor",
    "melmetal", "rillaboom", "cinderace", "inteleon", "corviknight", "orbeetle",
    "drednaw", "coalossal", "flapple", "appletun", "sandaconda", "toxtricity",
    "centiskorch", "hatterene", "grimmsnarl", "alcremie", "copperajah",
    "duraludon", "urshifu"
}

def criar_formas_gigamax():
    """
    Lê um arquivo JSON de dados de Pokémon, cria variantes Gigamax para os Pokémon
    aplicáveis e salva em um novo arquivo JSON.
    """
    # --- MODIFICAÇÃO PRINCIPAL AQUI ---
    # Encontra o diretório onde o script está localizado.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Constrói o caminho para os arquivos de entrada e saída a partir da localização do script.
    caminho_entrada = os.path.join(script_dir, 'json', '/workspace/blogger-poke-dragon-shadow/json/poke_data.json')
    caminho_saida = os.path.join(script_dir, 'json', '/workspace/blogger-poke-dragon-shadow/testes/json/poke_data_gigamax.json')
    # --- FIM DA MODIFICAÇÃO ---

    print(f"Tentando ler o arquivo de entrada: {caminho_entrada}")

    if not os.path.exists(caminho_entrada):
        print(f"ERRO: O arquivo '{caminho_entrada}' não foi encontrado.")
        print("Verifique se a sua estrutura de pastas é a seguinte:")
        print(f"{script_dir}/")
        print("├── criar_gigamax.py")
        print("└── json/")
        print("    └── poke_data.json")
        return

    try:
        with open(caminho_entrada, 'r', encoding='utf-8') as f:
            lista_pokemon_original = json.load(f)

        lista_gigamax = []
        print(f"Analisando {len(lista_pokemon_original)} Pokémon do arquivo original...")

        for pokemon in lista_pokemon_original:
            if pokemon.get("speciesId") in POKEMON_COM_GIGAMAX:
                print(f"Encontrado Pokémon com forma Gigamax: {pokemon['speciesName']}")
                pokemon_gigamax = copy.deepcopy(pokemon)
                pokemon_gigamax["speciesName"] = f"{pokemon['speciesName']} Gigamax"
                pokemon_gigamax["speciesId"] = f"{pokemon['speciesId']}-gigamax"
                
                if "tags" in pokemon_gigamax:
                    pokemon_gigamax["tags"].append("gigantamax")
                else:
                    pokemon_gigamax["tags"] = ["gigantamax"]
                
                lista_gigamax.append(pokemon_gigamax)

        if not lista_gigamax:
            print("Nenhum Pokémon com forma Gigamax foi encontrado no seu arquivo JSON.")
            return

        with open(caminho_saida, 'w', encoding='utf-8') as f:
            json.dump(lista_gigamax, f, indent=4, ensure_ascii=False)

        print("-" * 30)
        print(f"Sucesso! {len(lista_gigamax)} formas Gigamax foram criadas.")
        print(f"O novo arquivo foi salvo em: {caminho_saida}")

    except json.JSONDecodeError:
        print(f"ERRO: O arquivo '{caminho_entrada}' não é um JSON válido.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

if __name__ == "__main__":
    criar_formas_gigamax()
