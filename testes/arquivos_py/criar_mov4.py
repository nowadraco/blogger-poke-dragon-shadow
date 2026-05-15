import json
import os

# --- Configurações dos Arquivos ---

# 1. Arquivo de entrada (Ataques RÁPIDOS que geramos do CSV)
caminho_entrada = 'json/all_movimentos_rapidos.json'

# 2. Arquivo de referência (Onde tem os tipos e IDs corretos)
caminho_referencia = 'json/moves.json'

# 3. Arquivo de saída (O resultado final mesclado)
caminho_saida = 'json/all_movimentos_rapidos_tipo.json'

# --- Verificações ---
if not os.path.exists(caminho_entrada):
    print(f"ERRO: Não encontrei o arquivo: {caminho_entrada}")
    print("Verifique se você já rodou o script de conversão do CSV de ataques rápidos.")
    exit()

if not os.path.exists(caminho_referencia):
    print(f"ERRO: Não encontrei o arquivo de referência: {caminho_referencia}")
    exit()

# --- Carregando os JSONs ---
print("Lendo arquivos...")
with open(caminho_entrada, 'r', encoding='utf-8') as f:
    lista_rapidos = json.load(f)

with open(caminho_referencia, 'r', encoding='utf-8') as f:
    lista_banco_dados = json.load(f)

# --- Criando Mapa de Busca ---
# Transforma a lista do moves.json em um dicionário para busca instantânea pelo nome
mapa_referencia = {}
for item in lista_banco_dados:
    if 'name' in item:
        # Usa minúsculo para evitar erros de Case Sensitive
        nome_chave = item['name'].lower().strip()
        mapa_referencia[nome_chave] = item

print("Iniciando a mesclagem dos ataques rápidos...")

contador_sucesso = 0
dados_finais = []

# --- Loop Principal ---
for movimento in lista_rapidos:
    nome_busca = movimento['name'].lower().strip()
    
    # Tenta achar o ataque no moves.json
    dados_extras = mapa_referencia.get(nome_busca)
    
    if dados_extras:
        # Copia o ID e o Tipo
        movimento['moveId'] = dados_extras.get('moveId')
        
        # Só sobrescreve o tipo se ele for nulo ou se você quiser garantir que o moves.json é a fonte da verdade
        # Aqui vou fazer ele sempre pegar do moves.json se disponível
        if dados_extras.get('type'):
            movimento['type'] = dados_extras.get('type')
            
        contador_sucesso += 1
    else:
        print(f"Aviso: O ataque rápido '{movimento['name']}' não foi achado no moves.json")
    
    dados_finais.append(movimento)

# --- Salvando ---
# Garante que a pasta existe
os.makedirs(os.path.dirname(caminho_saida), exist_ok=True)

with open(caminho_saida, 'w', encoding='utf-8') as f:
    json.dump(dados_finais, f, indent=2, ensure_ascii=False)

print("-" * 30)
print(f"SUCESSO! {contador_sucesso} ataques rápidos atualizados.")
print(f"Salvo em: {caminho_saida}")