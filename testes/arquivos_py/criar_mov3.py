import json
import os

# --- Caminhos dos Arquivos ---
# O arquivo que criamos antes (sem tipos)
caminho_entrada = 'json/all_movimentos_carregados.json'

# O arquivo novo com os dados extras (que tem moveId e type)
caminho_referencia = 'json/referencia_tipos.json' 

# Onde vamos salvar o resultado final
caminho_saida = 'json/all_movimentos_carregados_tipo.json'

# --- Verificações ---
if not os.path.exists(caminho_entrada):
    print(f"Erro: Não achei o arquivo {caminho_entrada}")
    exit()

if not os.path.exists(caminho_referencia):
    print(f"Erro: Não achei o arquivo {caminho_referencia}")
    print("Crie esse arquivo com os dados que têm 'moveId' e 'type' antes de rodar.")
    exit()

# --- Carregando os dados ---
with open(caminho_entrada, 'r', encoding='utf-8') as f:
    lista_original = json.load(f)

with open(caminho_referencia, 'r', encoding='utf-8') as f:
    lista_referencia = json.load(f)

# --- Criando um "Mapa" para busca rápida ---
# Isso transforma a lista de referência em um dicionário onde a chave é o NOME.
# Facilita muito achar o Acid Spray sem ter que varrer a lista toda hora.
mapa_referencia = {item['name'].lower().strip(): item for item in lista_referencia}

print("Iniciando a mesclagem...")
contador_sucesso = 0

# --- Mesclando ---
dados_finais = []

for movimento in lista_original:
    # Padroniza o nome para busca (minúsculo e sem espaços extras)
    nome_busca = movimento['name'].lower().strip()
    
    # Procura no mapa de referência
    dados_extras = mapa_referencia.get(nome_busca)
    
    if dados_extras:
        # Se achou, copia o moveId e o type
        movimento['moveId'] = dados_extras.get('moveId')
        movimento['type'] = dados_extras.get('type') # Substitui o null pelo tipo real (ex: poison)
        contador_sucesso += 1
    else:
        # Se não achou, avisa no console (útil para ver se algum nome está escrito diferente)
        print(f"Aviso: Não encontrei dados extras para '{movimento['name']}'")
    
    dados_finais.append(movimento)

# --- Salvando ---
with open(caminho_saida, 'w', encoding='utf-8') as f:
    json.dump(dados_finais, f, indent=2, ensure_ascii=False)

print("-" * 30)
print(f"SUCESSO! {contador_sucesso} movimentos atualizados.")
print(f"Arquivo salvo em: {caminho_saida}")