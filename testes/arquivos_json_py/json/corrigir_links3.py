import json
import re
import os
import requests

print("Iniciando o script de diagnóstico e correção de links...")

# --- CAMINHOS CORRIGIDOS E SIMPLIFICADOS ---
# O script vai procurar a pasta 'json' no mesmo diretório que ele está.
# Garanta que seu script .py e a pasta json estejam no mesmo nível.
main_file_path = '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon.json'
alt_file_path = '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon_alt.json'
output_file_path = 'json/imagens_pokemon_corrigido_final.json'
# ----------------------------------------------------------------

# Cache para evitar re-verificar a mesma URL
status_cache = {}

def verificar_status_link(url):
    """Verifica se uma URL retorna 404. Retorna True se estiver quebrada."""
    if not url or not url.startswith('http'):
        return False
    if url in status_cache:
        return status_cache[url]
    
    try:
        response = requests.head(url, timeout=7)
        is_broken = response.status_code == 404
        status_cache[url] = is_broken
        return is_broken
    except requests.RequestException:
        status_cache[url] = False
        return False

def carregar_json(caminho_arquivo):
    """Carrega um arquivo JSON."""
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERRO CRÍTICO: Arquivo não encontrado em '{caminho_arquivo}'. Verifique se o nome e a pasta estão corretos.")
        return None
    except json.JSONDecodeError:
        print(f"ERRO CRÍTICO: O arquivo '{caminho_arquivo}' é um JSON inválido.")
        return None

def padronizar_nome(nome_pokemon):
    """Padroniza o nome para a busca."""
    nome_padrao = nome_pokemon.lower()
    return re.sub(r'\s*\([^)]*\)', '', nome_padrao).strip()

# Carregar os arquivos
dados_principais = carregar_json(main_file_path)
dados_alternativos = carregar_json(alt_file_path)

if dados_principais and dados_alternativos:
    mapa_links_corretos = {padronizar_nome(p['name']): p for p in dados_alternativos}
    dados_corrigidos = []
    links_substituidos = 0
    
    print("\n--- INICIANDO DIAGNÓSTICO E CORREÇÃO ---\n")

    for i, pokemon in enumerate(dados_principais):
        nome_original = pokemon.get('nome', 'NOME_NAO_ENCONTRADO')
        nome_chave = padronizar_nome(nome_original)
        pokemon_corrigido = pokemon.copy()
        
        print(f"[{i + 1}/{len(dados_principais)}] Processando: {nome_original}")

        if nome_chave in mapa_links_corretos:
            links_novos = mapa_links_corretos[nome_chave]
            
            # --- Diagnóstico Imagem Normal ---
            url_normal_original = pokemon_corrigido.get('imgNormal')
            if verificar_status_link(url_normal_original):
                pokemon_corrigido['imgNormal'] = links_novos.get('imgNormal')
                links_substituidos += 1
                print(f"  -> Link Normal QUEBRADO. Substituído.")
            elif url_normal_original:
                 print(f"  - Link Normal OK. Mantido.")

            # --- Diagnóstico Imagem Shiny ---
            url_shiny_original = pokemon_corrigido.get('imgShiny')
            if verificar_status_link(url_shiny_original):
                pokemon_corrigido['imgShiny'] = links_novos.get('imgShiny')
                links_substituidos += 1
                print(f"  -> Link Shiny QUEBRADO. Substituído.")
            elif url_shiny_original:
                 print(f"  - Link Shiny OK. Mantido.")

        else:
            print(f"  -- AVISO: '{nome_original}' não encontrado no arquivo de referência. Nenhum link pôde ser corrigido.")
        
        dados_corrigidos.append(pokemon_corrigido)

    # Salvar o arquivo final
    try:
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(dados_corrigidos, f, indent=4, ensure_ascii=False)
        print("\n----------------------------------------------------")
        print("✅ Processo de diagnóstico concluído!")
        print(f"Total de links substituídos: {links_substituidos}")
        print(f"Novo arquivo salvo em: {output_file_path}")
        print("----------------------------------------------------")
    except Exception as e:
        print(f"\nERRO AO SALVAR O ARQUIVO DE SAÍDA: {e}")