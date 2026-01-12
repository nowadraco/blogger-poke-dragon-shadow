import json
import os

# --- Caminhos dos Arquivos (Ajustados) ---

# 1. O arquivo que tem os dados sem tipo (que você gerou do CSV)
caminho_entrada = 'json/all_movimentos_carregados.json'

# 2. O arquivo de referência que tem os tipos e IDs (o moves.json)
caminho_referencia = 'json/moves.json'

# 3. Onde vamos salvar o arquivo novo e completo
caminho_saida = 'json/all_movimentos_carregados_tipo.json'


# --- Verificações de Segurança ---
if not os.path.exists(caminho_entrada):
    print(f"ERRO: Não encontrei o arquivo de entrada: {caminho_entrada}")
    exit()

if not os.path.exists(caminho_referencia):
    print(f"ERRO: Não encontrei o arquivo de referência: {caminho_referencia}")
    exit()


# --- Carregando os dados ---
print("Lendo arquivos...")
with open(caminho_entrada, 'r', encoding='utf-8') as f:
    lista_original = json.load(f)

with open(caminho_referencia, 'r', encoding='utf-8') as f:
    lista_referencia = json.load(f)


# --- Criando Mapa para Busca Rápida ---
# Isso cria um dicionário onde a chave é o nome do ataque (minúsculo)
# Ex: "acid spray": { ... dados do moves.json ... }
mapa_referencia = {}
for item in lista_referencia:
    if 'name' in item:
        nome_chave = item['name'].lower().strip()
        mapa_referencia[nome_chave] = item


print("Iniciando a mesclagem...")
contador_sucesso = 0
dados_finais = []

# --- Loop de Mesclagem ---
for movimento in lista_original:
    # Nome para buscar (ex: "acid spray")
    nome_busca = movimento['name'].lower().strip()
    
    # Busca os dados extras no mapa
    dados_extras = mapa_referencia.get(nome_busca)
    
    if dados_extras:
        # Se achou, pega APENAS o moveId e o type
        movimento['moveId'] = dados_extras.get('moveId')
        movimento['type'] = dados_extras.get('type')
        contador_sucesso += 1
    else:
        # Se não achou, avisa para você saber
        print(f"Aviso: '{movimento['name']}' não foi encontrado no arquivo moves.json")
    
    dados_finais.append(movimento)


# --- Salvando o Resultado ---
os.makedirs(os.path.dirname(caminho_saida), exist_ok=True)

with open(caminho_saida, 'w', encoding='utf-8') as f:
    json.dump(dados_finais, f, indent=2, ensure_ascii=False)

print("-" * 30)
print(f"SUCESSO! {contador_sucesso} movimentos foram atualizados com tipo e ID.")
print(f"Arquivo salvo em: {caminho_saida}")