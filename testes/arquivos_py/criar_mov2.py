import csv
import json
import os

# --- Configurações dos Caminhos ---
arquivo_csv = 'arquivo_cvs/Mov Rapidos.csv'
arquivo_json = 'json/all_movimentos_rapidos.json'

dados_convertidos = []

# Verifica se o arquivo CSV existe
if os.path.exists(arquivo_csv):
    try:
        # 'utf-8-sig' remove caracteres invisíveis do início (comum em Excel)
        with open(arquivo_csv, mode='r', encoding='utf-8-sig') as f:
            leitor = csv.DictReader(f)
            
            print(f"Lendo '{arquivo_csv}'...")
            
            for linha in leitor:
                try:
                    # Remove o 's' da duração se houver e converte
                    duracao = linha['Duration'].lower().replace('s', '').strip()
                    
                    # Tenta ler o 'tipo' se ele já existir na planilha, senão fica null
                    # Se na planilha a coluna estiver vazia, vai ficar string vazia "", 
                    # então forçamos None se não tiver valor útil.
                    tipo_valor = linha.get('tipo', '').strip()
                    tipo_final = tipo_valor if tipo_valor else None

                    movimento = {
                        "name": linha['Name'].strip(),
                        "power": int(linha['PWR']),
                        "energy": int(linha['ENG']),
                        "duration": float(duracao),
                        "eps": float(linha['EPS']), # Coluna nova (Energia por Segundo)
                        "dps": float(linha['DPS']),
                        "type": tipo_final 
                    }
                    dados_convertidos.append(movimento)
                except ValueError as ve:
                    print(f"Aviso: Linha ignorada por erro de valor (pode ser cabeçalho ou linha vazia): {ve}")

        # Cria a pasta json se não existir
        os.makedirs(os.path.dirname(arquivo_json), exist_ok=True)

        # Salva o arquivo JSON final
        with open(arquivo_json, 'w', encoding='utf-8') as f:
            json.dump(dados_convertidos, f, indent=2, ensure_ascii=False)

        print("-" * 40)
        print(f"SUCESSO! JSON gerado em: {arquivo_json}")
        print(f"Total de movimentos rápidos processados: {len(dados_convertidos)}")
        print("-" * 40)

    except Exception as e:
        print(f"Erro crítico ao processar o arquivo: {e}")
else:
    print(f"ERRO: Não encontrei o arquivo CSV no caminho: {arquivo_csv}")
    print("Verifique se o nome do arquivo é exatamente 'Mov Rapidos.csv' e se está na pasta 'arquivo_cvs'.")