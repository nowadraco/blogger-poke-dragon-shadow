import requests

# Dados do repositório alvo
owner = "nowadraco"
repo = "pogo_assets"
# O endpoint 'trees/master?recursive=1' permite puxar até 100.000 arquivos de uma vez só
url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"

print("Buscando dados da API do GitHub (isso pode levar alguns segundos)...")
response = requests.get(url)

if response.status_code == 200:
    tree_data = response.json().get("tree", [])
    
    # Caminho exato da pasta que você quer filtrar
    target_path = "Images/Pokemon - 256x256/Addressable Assets/"
    
    # Filtrar apenas os arquivos que estão dentro dessa pasta específica
    files_list = [item["path"] for item in tree_data if item["path"].startswith(target_path) and item["type"] == "blob"]
    
    print(f"\nSucesso! Encontrados {len(files_list)} arquivos.")
    
    # Salvar a lista de links brutos (raw) em um arquivo de texto
    with open("lista_pokemon_assets.txt", "w", encoding="utf-8") as f:
        for file_path in files_list:
            # Converte o caminho interno do Git na URL Raw pública
            raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/master/{file_path}"
            f.write(raw_url + "\n")
            
    print("Arquivo 'lista_pokemon_assets.txt' gerado com sucesso!")
else:
    print(f"Erro ao acessar a API: {response.status_code}")
