import json
import urllib.parse
import requests

# Dados do repositório alvo
owner = "nowadraco"
repo = "pogo_assets"
branch = "master"

# 🌟 CORREÇÃO 1: Endpoint correto da API do GitHub para buscar a árvore de arquivos de forma recursiva
url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"

# 🌟 CORREÇÃO 2: O GitHub EXIGE um User-Agent no cabeçalho, caso contrário retorna erro 403
headers = {
    "User-Agent": "PokeDragonShadow-AssetTagger"
}

print("Buscando dados da API do GitHub (isso pode levar alguns segundos)...")
response = requests.get(url, headers=headers)

if response.status_code == 200:
    tree_data = response.json().get("tree", [])

    # Caminho base da pasta dentro do repositório
    target_path = "Images/Pokemon - 256x256/Addressable Assets/"
    
    # 🌟 CORREÇÃO 3: URL base correta do GitHub Raw (com owner, repo e branch)
    base_raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{target_path}"
    base_weserv_url = "https://images.weserv.nl/?&url="

    # Separar apenas os nomes de arquivos que estão na pasta desejada
    all_files = set()
    for item in tree_data:
        if item["path"].startswith(target_path) and item["type"] == "blob":
            # Pega apenas o nome do arquivo final (ex: pm1.icon.png)
            filename = item["path"].split("/")[-1]
            all_files.add(filename)

    pokemon_json_list = []

    print(f"Processando {len(all_files)} arquivos encontrados...")

    # Processar os arquivos para parear Normal com Shiny
    for filename in sorted(all_files):
        # Ignora arquivos que já são shiny na listagem principal para não duplicar o objeto no JSON
        if ".s.icon.png" in filename or "_shiny.png" in filename:
            continue

        shiny_filename = ""
        is_valid_candidate = False

        # 🌟 GANHO DE INTELIGÊNCIA: Suporta os dois padrões de nomenclatura do seu repositório
        if filename.endswith(".icon.png"):
            shiny_filename = filename.replace(".icon.png", ".s.icon.png")
            is_valid_candidate = True
        elif filename.endswith(".png") and not "_shiny" in filename:
            shiny_filename = filename.replace(".png", "_shiny.png")
            is_valid_candidate = True

        if not is_valid_candidate:
            continue

        # Formata os nomes para a URL (corrige espaços e caracteres especiais como %20)
        encoded_normal = urllib.parse.quote(filename)
        encoded_shiny = urllib.parse.quote(shiny_filename)

        # Monta os links finais com o proxy correto do weserv.nl
        img_normal_url = f"{base_weserv_url}{base_raw_url}{encoded_normal}"

        # Se o arquivo Shiny correspondente existir na pasta, linka ele; caso contrário, deixa null
        if shiny_filename in all_files:
            img_shiny_url = f"{base_weserv_url}{base_raw_url}{encoded_shiny}"
        else:
            img_shiny_url = None

        # Cria o dicionário no formato exato que a sua Datadex e ferramentas de auditoria precisam
        pokemon_entry = {
            "nome": filename,
            "imgNormal": img_normal_url,
            "imgShiny": img_shiny_url,
        }
        pokemon_json_list.append(pokemon_entry)

    # Salva o resultado final em um arquivo .json formatado com recuo de 4 espaços
    output_filename = "pokemon_assets.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(pokemon_json_list, f, indent=4, ensure_ascii=False)

    print("\n=================================================")
    print(f"✅ SUCESSO! Gerado o arquivo '{output_filename}'")
    print(f"🧬 Total de {len(pokemon_json_list)} Pokémons pareados com sucesso!")
    print("=================================================")
else:
    print(f"❌ Erro ao acessar a API do GitHub. Código de status: {response.status_code}")
    if response.status_code == 403:
        print("Aviso: Limite de requisições anônimas atingido para o seu IP. Aguarde um momento ou use um Token.")