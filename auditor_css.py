import os
import re
from collections import defaultdict

# ====================================================================
# ⚙️ CONFIGURAÇÃO: Coloque os caminhos exatos dos seus arquivos aqui
# ====================================================================
ARQUIVOS_CSS = [
    r"testes/counters/css-datadex21.css",
    r"testes/nova_datadex/css-04-09-blogger.css",
    # Você pode colocar o caminho do gorocket10 aqui também, se quiser!
    # r"testes/counters/css/gorocket10.css" 
]

def extrair_seletores(css_text):
    """Lê o CSS e extrai apenas os nomes das classes e seletores."""
    # 1. Remove todos os comentários do CSS para não sujar a leitura
    css_text = re.sub(r'/\*.*?\*/', '', css_text, flags=re.DOTALL)
    
    seletores = []
    buffer = ""
    depth = 0
    
    for char in css_text:
        if char == '{':
            clean_buffer = buffer.strip()
            if clean_buffer and depth >= 0:
                # Pode haver várias classes na mesma linha separadas por vírgula
                for parte in clean_buffer.split(','):
                    seletor = parte.strip()
                    # Limpa espaços e quebras de linha duplas
                    seletor = re.sub(r'\s+', ' ', seletor)
                    
                    # Filtra: Ignora @media, @keyframes, e as porcentagens do keyframes (0%, 100%)
                    if seletor and not seletor.startswith('@') and not seletor.endswith('%') and seletor not in ["from", "to"]:
                        seletores.append(seletor)
            depth += 1
            buffer = ""
        elif char == '}':
            depth -= 1
            buffer = ""
        else:
            buffer += char
            
    return seletores

def auditar_css(arquivos):
    mapa_seletores = defaultdict(lambda: {"total": 0, "arquivos": set()})
    
    print("\n🔍 Iniciando o Inspetor de CSS...\n")
    
    # 2. Lê cada arquivo listado
    for caminho in arquivos:
        if not os.path.exists(caminho):
            print(f"❌ AVISO: Arquivo não encontrado: {caminho}")
            continue
            
        nome_arquivo = os.path.basename(caminho)
        print(f"📄 Varrendo: {nome_arquivo}...")
        
        with open(caminho, 'r', encoding='utf-8', errors='ignore') as f:
            conteudo = f.read()
            
        seletores_encontrados = extrair_seletores(conteudo)
        
        # 3. Conta e anota em qual arquivo a classe estava
        for seletor in seletores_encontrados:
            mapa_seletores[seletor]["total"] += 1
            mapa_seletores[seletor]["arquivos"].add(nome_arquivo)

    # 4. Filtra apenas os que se repetem (aparecem 2 vezes ou mais)
    duplicados = {sel: dados for sel, dados in mapa_seletores.items() if dados["total"] > 1}
    
    # 5. Ordena do que mais repete para o que menos repete
    duplicados_ordenados = sorted(duplicados.items(), key=lambda x: x[1]["total"], reverse=True)
    
    print("\n" + "="*60)
    print("🚨 RESULTADO: SELETORES DUPLICADOS 🚨")
    print("="*60 + "\n")
    
    if not duplicados_ordenados:
        print("✅ Parabéns! O seu código está limpo, nenhum seletor CSS duplicado foi encontrado.")
        return

    # 6. Cria um arquivo .txt com o relatório completo para você ler depois
    with open("relatorio_duplicidades_css.txt", "w", encoding="utf-8") as f_out:
        f_out.write("🚨 RELATÓRIO DE SELETORES CSS DUPLICADOS 🚨\n")
        f_out.write("Você pode usar essa lista para saber o que deletar!\n")
        f_out.write("="*60 + "\n\n")
        
        for seletor, info in duplicados_ordenados:
            total = info["total"]
            arquivos = ", ".join(info["arquivos"])
            
            # Mostra na tela do VS Code
            linha = f"[{total}x] {seletor}\n    ↳ Arquivos: {arquivos}\n"
            print(linha)
            
            # Salva no arquivo de texto
            f_out.write(linha + "\n")
            
    print(f"\n📁 Pronto! Eu gerei um arquivo chamado 'relatorio_duplicidades_css.txt' na sua pasta para você ir riscando enquanto limpa!")

if __name__ == "__main__":
    auditar_css(ARQUIVOS_CSS)