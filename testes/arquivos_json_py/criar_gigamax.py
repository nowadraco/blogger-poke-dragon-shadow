import json
import os
import copy

# Lista dos Pokémon que possuem uma forma Gigantamax.
# Usamos o 'speciesId' (nome em minúsculas) para a verificação.
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
    caminho_entrada = os.path.join('json', 'https://raw.githubusercontent.com/nowadraco/blogger-poke-dragon-shadow/refs/heads/main/testes/poke_data.json')
    caminho_saida = os.path.join('json', 'poke_data_gigamax.json')

    print(f"Tentando ler o arquivo de entrada: {caminho_entrada}")

    # Verifica se o arquivo de entrada existe
    if not os.path.exists(caminho_entrada):
        print(f"ERRO: O arquivo '{caminho_entrada}' não foi encontrado.")
        print("Certifique-se de que o script está na pasta correta e que o arquivo JSON existe.")
        return

    try:
        # Abre e lê o arquivo JSON original
        with open(caminho_entrada, 'r', encoding='utf-8') as f:
            lista_pokemon_original = json.load(f)

        lista_gigamax = []

        print(f"Analisando {len(lista_pokemon_original)} Pokémon do arquivo original...")

        # Itera sobre cada Pokémon na lista original
        for pokemon in lista_pokemon_original:
            # Verifica se o 'speciesId' do Pokémon está na nossa lista de Gigamax
            if pokemon.get("speciesId") in POKEMON_COM_GIGAMAX:
                
                print(f"Encontrado Pokémon com forma Gigamax: {pokemon['speciesName']}")

                # Cria uma cópia profunda para não alterar o objeto original
                pokemon_gigamax = copy.deepcopy(pokemon)

                # Modifica os campos para a forma Gigamax
                pokemon_gigamax["speciesName"] = f"{pokemon['speciesName']} Gigamax"
                pokemon_gigamax["speciesId"] = f"{pokemon['speciesId']}-gigamax"
                
                # Adiciona uma tag para fácil identificação (opcional)
                if "tags" in pokemon_gigamax:
                    pokemon_gigamax["tags"].append("gigantamax")
                else:
                    pokemon_gigamax["tags"] = ["gigantamax"]
                
                # Adiciona a nova forma à nossa lista de Gigamax
                lista_gigamax.append(pokemon_gigamax)

        # Verifica se alguma forma foi criada
        if not lista_gigamax:
            print("Nenhum Pokémon com forma Gigamax foi encontrado no seu arquivo JSON.")
            return

        # Salva a nova lista em um novo arquivo JSON
        with open(caminho_saida, 'w', encoding='utf-8') as f:
            # `indent=4` para formatar o JSON de forma legível
            # `ensure_ascii=False` para garantir a codificação correta de caracteres
            json.dump(lista_gigamax, f, indent=4, ensure_ascii=False)

        print("-" * 30)
        print(f"Sucesso! {len(lista_gigamax)} formas Gigamax foram criadas.")
        print(f"O novo arquivo foi salvo em: {caminho_saida}")

    except json.JSONDecodeError:
        print(f"ERRO: O arquivo '{caminho_entrada}' não é um JSON válido.")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")

# Executa a função principal
if __name__ == "__main__":
    criar_formas_gigamax()