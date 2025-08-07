import os
import json
import re
from PIL import Image
import pytesseract

# --- CONFIGURAÇÃO ---
PASTA_DE_IMAGENS = 'imagens_para_ler'
ARQUIVO_JSON_SAIDA = 'ataques_extraidos.json'
ARQUIVO_TXT_SAIDA = 'ataques_extraidos.txt' # Adicionado para opção de TXT
# --- FIM DA CONFIGURAÇÃO ---

def extrair_ataques_definitivo(texto_bruto):
    """
    Versão definitiva e mais inteligente do extrator.
    Identifica ataques e salva tudo o que consegue, mesmo com erros de OCR.
    """
    # 1. Limpeza inicial de erros comuns de OCR
    # MUDANÇA 1: Adicionado .lower() para tornar a limpeza mais robusta
    texto_limpo = texto_bruto.lower().replace("dma ", "dmg ").replace("'", "/").replace("|", "/")
    linhas = [linha.strip() for linha in texto_limpo.split('\n') if linha.strip()]

    ataques_encontrados = []
    i = 0
    while i < len(linhas):
        linha_atual = linhas[i]
        
        # MUDANÇA 2: Verificação principal agora é case-insensitive (não diferencia maiúsculas/minúsculas)
        # Esta é a correção mais importante!
        if "dmg" in linha_atual and "cd" in linha_atual:
            # Se encontramos stats, a linha ANTERIOR (i-1) deve ser o nome
            if i > 0:
                nome_ataque = linhas[i-1]
                stats_ataque = linha_atual
                
                # Ignora se a linha do nome for lixo do menu
                if any(palavra in nome_ataque for palavra in ["ginásios", "attaques", "reides", "pvp"]):
                    i += 1
                    continue

                # Limpa o nome de possíveis tags, como "neve em pó [5]"
                nome_ataque_limpo = re.split(r'\s*\[', nome_ataque)[0].strip()

                # 3. Tenta extrair cada dado individualmente
                dano, cooldown, valor_energia, tipo_energia = None, None, None, None
                
                try:
                    # Expressões Regulares para encontrar os números, não importa o lixo em volta
                    match_dano = re.search(r'dmg\s*(\d+)', stats_ataque)
                    if match_dano: dano = int(match_dano.group(1))

                    match_cd = re.search(r'cd\s*([\d,.]+)', stats_ataque)
                    if match_cd: cooldown = float(match_cd.group(1).replace(',', '.'))
                    
                    # MUDANÇA 3: Extração de energia muito mais robusta
                    match_energia = re.search(r'energia\s*(\d+)', stats_ataque)
                    if match_energia:
                        valor_energia = int(match_energia.group(1))
                        # Agora determina o tipo de forma mais segura
                        if "ganho" in stats_ataque:
                            tipo_energia = "ganho"
                        elif "custo" in stats_ataque:
                            tipo_energia = "custo"

                    # 4. Adiciona o resultado, mesmo que incompleto.
                    # Inclui o texto original para facilitar a verificação manual.
                    ataques_encontrados.append({
                        "nome": nome_ataque_limpo.title(), # Deixa o nome com a primeira letra maiúscula
                        "dano": dano,
                        "cooldown": cooldown,
                        "valor_energia": valor_energia,
                        "tipo_energia": tipo_energia,
                        "texto_original": f"{nome_ataque}\n{stats_ataque}"
                    })

                except Exception as e:
                    # Se algo der errado, pelo menos salva o nome e o texto original
                    print(f"  -> Erro de parsing para '{nome_ataque_limpo}'. Salvando dados brutos. Erro: {e}")
                    ataques_encontrados.append({
                        "nome": nome_ataque_limpo.title(),
                        "dano": None, "cooldown": None, "valor_energia": None, "tipo_energia": None,
                        "texto_original": f"{nome_ataque}\n{stats_ataque}"
                    })

        i += 1
    return ataques_encontrados

def processar_imagens(pasta_entrada, arquivo_json, arquivo_txt):
    """Função principal que orquestra todo o processo."""
    todos_os_ataques = []
    print(f"\nIniciando processamento da pasta '{pasta_entrada}'...")
    
    try:
        imagens = [f for f in os.listdir(pasta_entrada) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    except FileNotFoundError:
        print(f"ERRO: A pasta de entrada '{pasta_entrada}' não foi encontrada.")
        print("Por favor, crie uma pasta chamada 'imagens_para_ler' e coloque suas screenshots dentro dela.")
        return

    if not imagens:
        print(f"AVISO: Nenhuma imagem encontrada na pasta '{pasta_entrada}'.")
        return

    print(f"Encontradas {len(imagens)} imagens para processar.")

    for nome_imagem in imagens:
        caminho_imagem = os.path.join(pasta_entrada, nome_imagem)
        try:
            # lang='por' para português
            texto_extraido = pytesseract.image_to_string(Image.open(caminho_imagem), lang='por')
            dados_da_imagem = extrair_ataques_definitivo(texto_extraido)
            
            if dados_da_imagem:
                todos_os_ataques.extend(dados_da_imagem)
                print(f"[SUCESSO] Encontrados {len(dados_da_imagem)} ataques na imagem '{nome_imagem}'.")
            else:
                print(f"[IGNORADA] Nenhum padrão de ataque reconhecido em '{nome_imagem}'.")
        except Exception as e:
            print(f"[ERRO CRÍTICO] Falha ao processar a imagem '{nome_imagem}': {e}")
            
    if todos_os_ataques:
        # Remove duplicatas exatas convertendo cada dicionário em uma tupla de itens para poder usar um set
        lista_final_sem_duplicatas = [dict(t) for t in {tuple(d.items()) for d in todos_os_ataques}]
        
        # Ordena a lista final por nome do ataque
        lista_final_sem_duplicatas.sort(key=lambda x: x['nome'])

        # --- Salvar em JSON ---
        with open(arquivo_json, 'w', encoding='utf-8') as f:
            json.dump(lista_final_sem_duplicatas, f, ensure_ascii=False, indent=4)
        print(f"\nPROCESSO CONCLUÍDO! {len(lista_final_sem_duplicatas)} ataques únicos foram salvos em '{arquivo_json}'.")

        # --- Salvar em TXT (Opcional) ---
        with open(arquivo_txt, 'w', encoding='utf-8') as f:
            for ataque in lista_final_sem_duplicatas:
                f.write(f"Nome: {ataque['nome']}\n")
                f.write(f"  Dano: {ataque['dano']}\n")
                f.write(f"  Cooldown: {ataque['cooldown']}s\n")
                if ataque['valor_energia']:
                    f.write(f"  Energia: {ataque['valor_energia']} ({ataque['tipo_energia']})\n")
                f.write("-" * 20 + "\n")
        print(f"Uma versão em texto simples também foi salva em '{arquivo_txt}'.")

    else:
        print("\nPROCESSO CONCLUÍDO, mas nenhum dado foi extraído para salvar.")

# MUDANÇA 4: Corrigido o erro de sintaxe na chamada da função
if __name__ == "__main__":
    # Certifique-se de que a pasta de imagens existe
    if not os.path.exists(PASTA_DE_IMAGENS):
        os.makedirs(PASTA_DE_IMAGENS)
        print(f"Pasta '{PASTA_DE_IMAGENS}' não existia e foi criada. Por favor, adicione suas imagens nela.")
    else:
        processar_imagens(PASTA_DE_IMAGENS, ARQUIVO_JSON_SAIDA, ARQUIVO_TXT_SAIDA)