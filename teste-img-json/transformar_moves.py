import os
import json
from PIL import Image
import pytesseract

# --- CONFIGURAÇÃO ---
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

pasta_de_imagens = 'imagens_para_ler'
arquivo_json_saida = 'ataques_extraidos.json'

# NOVA PASTA PARA GARANTIR QUE TUDO SEJA SALVO
pasta_saida_raw_txt = 'textos_brutos_extraidos'
# --- FIM DA CONFIGURAÇÃO ---

def extrair_dados_do_texto(texto_bruto):
    # Esta é a função que estamos tentando ajustar.
    # Por enquanto, ela continuará sendo a versão "flexível".
    ataques_processados = []
    linhas = [linha for linha in texto_bruto.strip().split('\n') if linha.strip()]
    ataque_atual = {}
    for linha in linhas:
        if ' - ' in linha and 'Dmg' not in linha and 'CD' not in linha:
            if ataque_atual:
                ataques_processados.append(ataque_atual)
            partes = linha.split(' - ')
            ataque_atual = {"nome": partes[0].strip(), "tipo": partes[1].strip() if len(partes) > 1 else None, "dano": None, "cooldown": None, "energia": None}
        elif 'Dmg' in linha or 'CD' in linha or 'Ganho de energia' in linha:
            if not ataque_atual: continue
            stats_partes = linha.split('/')
            for parte in stats_partes:
                parte_limpa = parte.strip()
                try:
                    if 'Dmg' in parte_limpa:
                        ataque_atual['dano'] = int(parte_limpa.replace('Dmg', '').strip())
                    elif 'CD' in parte_limpa:
                        ataque_atual['cooldown'] = float(parte_limpa.replace('CD', '').replace('s', '').replace(',', '.').strip())
                    elif 'Ganho de energia' in parte_limpa:
                        ataque_atual['energia'] = int(parte_limpa.replace('Ganho de energia', '').strip())
                except (ValueError, IndexError):
                    continue
    if ataque_atual:
        ataques_processados.append(ataque_atual)
    return ataques_processados

def processar_ocr_para_json(pasta_entrada, arquivo_saida):
    todos_os_ataques = []
    
    # Cria a pasta para os textos brutos, se não existir
    if not os.path.exists(pasta_saida_raw_txt):
        os.makedirs(pasta_saida_raw_txt)

    print(f"\nIniciando o processamento da pasta '{pasta_entrada}'...")
    
    try:
        imagens = [f for f in os.listdir(pasta_entrada) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    except FileNotFoundError:
        print(f"ERRO: A pasta '{pasta_entrada}' não foi encontrada.")
        return

    print(f"Encontradas {len(imagens)} imagens para processar.")

    for nome_imagem in imagens:
        caminho_imagem = os.path.join(pasta_entrada, nome_imagem)
        try:
            # 1. EXTRAI O TEXTO DA IMAGEM
            texto_extraido = pytesseract.image_to_string(Image.open(caminho_imagem), lang='por')
            
            # 2. SALVA O TEXTO BRUTO IMEDIATAMENTE (GARANTINDO O BACKUP)
            nome_base_arquivo = os.path.splitext(nome_imagem)[0]
            caminho_saida_txt = os.path.join(pasta_saida_raw_txt, f"{nome_base_arquivo}.txt")
            with open(caminho_saida_txt, 'w', encoding='utf-8') as f_txt:
                f_txt.write(texto_extraido)
            
            # 3. TENTA PROCESSAR O TEXTO PARA O JSON
            dados_da_imagem = extrair_dados_do_texto(texto_extraido)
            
            if dados_da_imagem:
                todos_os_ataques.extend(dados_da_imagem)
                print(f"[SUCESSO] Imagem '{nome_imagem}' processada para o JSON.")
            else:
                print(f"[AVISO] Não foi possível estruturar dados da imagem '{nome_imagem}'. O texto bruto foi salvo.")

        except Exception as e:
            print(f"[ERRO] Falha crítica ao processar a imagem '{nome_imagem}': {e}")
            
    if todos_os_ataques:
        with open(arquivo_saida, 'w', encoding='utf-8') as f:
            json.dump(todos_os_ataques, f, ensure_ascii=False, indent=4)
        print(f"\nProcessamento concluído! {len(todos_os_ataques)} ataques foram salvos em '{arquivo_saida}'.")
    else:
        print(f"\nProcessamento concluído. Nenhum dado foi estruturado para o JSON. Verifique os arquivos na pasta '{pasta_saida_raw_txt}'.")

if __name__ == "__main__":
    processar_ocr_para_json(pasta_de_imagens, arquivo_json_saida)