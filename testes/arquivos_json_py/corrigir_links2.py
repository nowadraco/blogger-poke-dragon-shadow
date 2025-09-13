import json
import re
import os
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

print("Iniciando o script de correção seletiva de links (apenas 404)...")

# --- CAMINHOS DINÂMICOS E SEGUROS ---
script_dir = os.path.dirname(os.path.abspath(__file__))
main_file_path = os.path.join(script_dir, 'json', '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon.json')
alt_file_path = os.path.join(script_dir, 'json', '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon_alt.json')
output_file_path = os.path.join(script_dir, 'json', 'imagens_pokemon_corrigido_seletivo.json')
# ----------------------------------------------------------------

# Dicionário para guardar o status dos links já verificados e evitar testes repetidos
status_cache = {}

def verificar_status_link(url):
    """Verifica o status de uma URL. Retorna True se for 404, False caso contrário."""
    if not url:
        return False
    if url in status_cache:
        return status_cache[url]
    
    try:
        # Usamos HEAD para não baixar a imagem, apenas verificar o status (mais rápido)
        response = requests.head(url, timeout=5)
        is_broken = response.status_code == 404
        status_cache[url] = is_broken
        return is_broken
    except requests.RequestException:
        # Se houver qualquer erro de conexão, consideramos o link como "não quebrado"
        # para evitar substituições incorretas por falha de internet.
        status_cache[url] = False
        return False

def carregar_json(caminho_arquivo):
    """Carrega um arquivo JSON."""
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERRO: Arquivo não encontrado em '{caminho_arquivo}'.")
        return None
    except json.JSONDecodeError:
        print(f"ERRO: O arquivo '{caminho_arquivo}' é um JSON inválido.")
        return None

def padronizar_nome(nome_pokemon):
    """Padroniza o nome para a busca."""
    nome_padrao = nome_pokemon.lower()
    return re.sub(r'\s*\([^)]*\)', '', nome_padrao).strip()

# Carregar os arquivos
dados_principais = carregar_json(main_file_path)
dados_alternativos = carregar_json(alt_file_path)

if dados_principais and dados_alternativos:
    # Cria o mapa de referência com os links alternativos
    mapa_links_corretos = {padronizar_nome(p['name']): p for p in dados_alternativos}
    
    dados_corrigidos = []
    links_substituidos = 0

    # Itera sobre a lista principal para corrigir
    for i, pokemon in enumerate(dados_principais):
        nome_original = pokemon['nome']
        nome_chave = padronizar_nome(nome_original)
        
        # Faz uma cópia para modificação segura
        pokemon_corrigido = pokemon.copy()
        
        # Verifica se há um substituto disponível para este Pokémon
        if nome_chave in mapa_links_corretos:
            links_novos = mapa_links_corretos[nome_chave]
            
            # --- LÓGICA DE VERIFICAÇÃO E TROCA ---
            # Verifica a imagem Normal
            if verificar_status_link(pokemon_corrigido.get('imgNormal')):
                pokemon_corrigido['imgNormal'] = links_novos.get('imgNormal')
                links_substituidos += 1
                print(f" -> Trocando 'imgNormal' de '{nome_original}' (era 404).")
            
            # Verifica a imagem Shiny
            if verificar_status_link(pokemon_corrigido.get('imgShiny')):
                pokemon_corrigido['imgShiny'] = links_novos.get('imgShiny')
                links_substituidos += 1
                print(f" -> Trocando 'imgShiny' de '{nome_original}' (era 404).")
        
        dados_corrigidos.append(pokemon_corrigido)
        # Mostra o progresso
        print(f"Processado {i + 1}/{len(dados_principais)}: {nome_original}")

    # Salva o arquivo final
    try:
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(dados_corrigidos, f, indent=4, ensure_ascii=False)

        print("\n----------------------------------------------------")
        print("✅ Processo seletivo concluído com sucesso!")
        print(f"Total de links quebrados e substituídos: {links_substituidos}")
        print(f"Novo arquivo salvo em: {output_file_path}")
        print("----------------------------------------------------")
    except Exception as e:
        print(f"\nERRO AO SALVAR O ARQUIVO DE SAÍDA: {e}")