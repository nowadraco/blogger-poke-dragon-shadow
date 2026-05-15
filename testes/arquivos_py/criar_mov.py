import csv
import json
import os

# --- Configurações ---
arquivo_csv = 'arquivo_cvs/Mov Carregados.csv'
arquivo_json = 'json/all_movimentos_carregados.json'

dados_convertidos = []

# Verifica se o arquivo existe
if os.path.exists(arquivo_csv):
    try:
        # 'utf-8-sig' é importante para CSVs feitos no Excel/Google Sheets
        with open(arquivo_csv, mode='r', encoding='utf-8-sig') as f:
            leitor = csv.DictReader(f)
            
            print("Convertendo...")
            
            for linha in leitor:
                # Tratamento para remover o 's' da duração, caso exista
                duracao = linha['Duration'].lower().replace('s', '').strip()
                
                movimento = {
                    "name": linha['Name'].strip(),
                    "power": int(linha['PWR']),
                    "energy": int(linha['ENG']),
                    "duration": float(duracao),
                    "dps": float(linha['DPS']),
                    # AQUI ESTÁ O TRUQUE: None em Python vira null no JSON
                    "type": None 
                }
                dados_convertidos.append(movimento)

        # Cria a pasta json se não existir
        os.makedirs(os.path.dirname(arquivo_json), exist_ok=True)

        # Salva o arquivo final
        with open(arquivo_json, 'w', encoding='utf-8') as f:
            json.dump(dados_convertidos, f, indent=2, ensure_ascii=False)

        print(f"Pronto! Arquivo salvo em: {arquivo_json}")
        print(f"Total de movimentos: {len(dados_convertidos)}")

    except Exception as e:
        print(f"Erro ao processar: {e}")
else:
    print(f"Não encontrei o arquivo: {arquivo_csv}")