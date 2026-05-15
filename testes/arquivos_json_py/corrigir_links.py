import json
import re
import os

print("Iniciando o script de correção de links...")

# --- Nomes dos arquivos ---
main_file_path = os.path.join('json', '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon.json')
alt_file_path = os.path.join('json', '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon_alt.json')
output_file_path = os.path.join('json', 'imagens_pokemon_corrigido.json')
# -------------------------

def carregar_json(caminho_arquivo):
    """Carrega um arquivo JSON e retorna os dados."""
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            print(f"Lendo o arquivo: {caminho_arquivo}")
            return json.load(f)
    except FileNotFoundError:
        print(f"ERRO: Arquivo não encontrado em '{caminho_arquivo}'. Verifique o caminho.")
        return None
    except json.JSONDecodeError:
        print(f"ERRO: O arquivo '{caminho_arquivo}' contém um erro de formatação JSON.")
        return None

def padronizar_nome(nome_pokemon):
    """Converte o nome para minúsculas e remove texto entre parênteses."""
    nome_padrao = nome_pokemon.lower()
    nome_padrao = re.sub(r'\s*\([^)]*\)', '', nome_padrao).strip()
    return nome_padrao

# 1. Carregar os dois arquivos JSON
dados_principais = carregar_json(main_file_path)
dados_alternativos = carregar_json(alt_file_path)

if dados_principais is None or dados_alternativos is None:
    print("Script interrompido devido a erro na leitura dos arquivos.")
else:
    # 2. Criar um dicionário de referência para busca rápida
    mapa_links_corretos = {
        padronizar_nome(p['name']): {
            'imgNormal': p['imgNormal'],
            'imgShiny': p['imgShiny']
        } for p in dados_alternativos
    }
    print(f"{len(mapa_links_corretos)} Pokémon de referência carregados.")

    dados_corrigidos = []
    links_substituidos = 0

    # 3. Iterar sobre o arquivo principal e corrigir os links
    for pokemon in dados_principais:
        nome_original = pokemon['nome']
        nome_chave = padronizar_nome(nome_original)
        pokemon_corrigido = pokemon.copy()

        if nome_chave in mapa_links_corretos:
            links_novos = mapa_links_corretos[nome_chave]
            pokemon_corrigido['imgNormal'] = links_novos['imgNormal']
            pokemon_corrigido['imgShiny'] = links_novos['imgShiny']
            links_substituidos += 1
            print(f" -> Links para '{nome_original}' foram atualizados.")
        else:
             print(f" !! Links para '{nome_original}' não encontrados, mantendo os originais.")

        dados_corrigidos.append(pokemon_corrigido)

    # 5. Salvar o novo arquivo JSON corrigido
    try:
        # --- MUDANÇA IMPORTANTE AQUI ---
        # Garante que o diretório de saída exista antes de tentar salvar
        output_dir = os.path.dirname(output_file_path)
        if output_dir: # Garante que não é o diretório raiz
            os.makedirs(output_dir, exist_ok=True)
        # --- FIM DA MUDANÇA ---

        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(dados_corrigidos, f, indent=4, ensure_ascii=False)

        print("\n----------------------------------------------------")
        print("✅ Processo concluído com sucesso!")
        print(f"Total de links substituídos: {links_substituidos}")
        print(f"Novo arquivo salvo em: {output_file_path}")
        print("----------------------------------------------------")
    except Exception as e:
        print(f"\nERRO AO SALVAR O ARQUIVO DE SAÍDA: {e}")