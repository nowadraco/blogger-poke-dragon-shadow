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
        # Faz a requisição GET para a URL especificada.
        # O cabeçalho 'User-Agent' simula o acesso de um navegador comum,
        # o que pode ajudar a evitar bloqueios por parte de alguns sites.
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        resposta = requests.get(url, headers=headers, timeout=10) # Timeout de 10 segundos

        # Verifica se a requisição foi bem-sucedida (código de status 200)
        resposta.raise_for_status()

        # Define a codificação correta para evitar problemas com caracteres especiais
        resposta.encoding = resposta.apparent_encoding

        # Salva o conteúdo HTML em um arquivo
        with open(nome_arquivo, 'w', encoding='utf-8') as arquivo:
            arquivo.write(resposta.text)

        print(f"HTML baixado com sucesso e salvo como '{nome_arquivo}'")

    except requests.exceptions.HTTPError as errh:
        print(f"Erro HTTP: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Erro de Conexão: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Tempo de requisição esgotado: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Ocorreu um erro inesperado: {err}")
    except IOError:
        print(f"Erro: Não foi possível escrever no arquivo '{nome_arquivo}'.")

# --- Como Usar o Script ---
if __name__ == "__main__":
    # URL que você pediu para usar
    url_alvo = "https://leekduck.com/rocket-lineups/"

    # Nome do arquivo onde o HTML será salvo
    nome_do_arquivo = "rockt.html"

    # Chama a função para baixar o conteúdo
    baixar_html(url_alvo, nome_do_arquivo)

    #python baixar_pagina.py