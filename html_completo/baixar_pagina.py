import requests
import sys

def baixar_html(url, nome_arquivo="pagina.html"):
    """
    Baixa o conteúdo HTML de uma URL e o salva em um arquivo.

    :param url: A URL da página da web que você deseja baixar.
    :param nome_arquivo: O nome do arquivo onde o HTML será salvo.
    """
    print(f"Tentando baixar o conteúdo de: {url}")

    try:
        # --- MUDANÇA AQUI ---
        # Atualizamos o User-Agent para um mais moderno,
        # fingindo ser um navegador Chrome 120 no Windows 10.
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        # ---------------------

        # A URL que você está tentando acessar agora
        url_alvo = "https://pokemongohub.net/post/guide/pokemon-go-level-1-to-80-guide-xp-level-up-tasks-and-rewards/"
        nome_do_arquivo = "pokemongohub_guide.html"


        resposta = requests.get(url_alvo, headers=headers, timeout=10) # Timeout de 10 segundos

        # Verifica se a requisição foi bem-sucedida (código de status 200)
        resposta.raise_for_status()

        # Define a codificação correta
        resposta.encoding = resposta.apparent_encoding

        # Salva o conteúdo HTML em um arquivo
        with open(nome_do_arquivo, 'w', encoding='utf-8') as arquivo:
            arquivo.write(resposta.text)

        print(f"HTML baixado com sucesso e salvo como '{nome_do_arquivo}'")

    except requests.exceptions.HTTPError as errh:
        print(f"Erro HTTP: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Erro de Conexão: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Tempo de requisição esgotado: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Ocorreu um erro inesperado: {err}")
    except IOError:
        print(f"Erro: Não foi possível escrever no arquivo '{nome_do_arquivo}'.")

# --- Como Usar o Script ---
if __name__ == "__main__":
    # A URL agora está definida dentro da função, mas poderíamos passá-la aqui.
    # Vamos chamar a função diretamente.
    
    # Pega a URL da linha de comando, se fornecida
    if len(sys.argv) > 1:
        url_pela_linha_de_comando = sys.argv[1]
        nome_arquivo_saida = "pagina_baixada.html"
        if len(sys.argv) > 2:
            nome_arquivo_saida = sys.argv[2]
            
        baixar_html(url_pela_linha_de_comando, nome_arquivo_saida)
    else:
        # Se nenhuma URL for passada, baixa a do Pokemon GO Hub como padrão
        url_padrao = "https://pokemongohub.net/post/guide/pokemon-go-level-1-to-80-guide-xp-level-up-tasks-and-rewards/"
        arquivo_padrao = "pokemongohub_guide.html"
        baixar_html(url_padrao, arquivo_padrao)