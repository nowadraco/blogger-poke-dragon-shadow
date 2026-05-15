import json
import re
import os

# A lista de 112 links quebrados que você forneceu.
# O script usará isso como a "verdade" sobre o que precisa ser trocado.
BROKEN_LINKS_TEXT = """
[Drednaw - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm834.s.icon.png
[Drednaw - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm834.icon.png
[Rolycoly - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm837.icon.png
[Rolycoly - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm837.s.icon.png
[Carkol - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm838.s.icon.png
[Carkol - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm838.icon.png
[Silicobra - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm843.icon.png
[Silicobra - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm843.s.icon.png
[Sandaconda - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm844.icon.png
[Sandaconda - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm844.s.icon.png
[Cramorant - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm845.icon.png
[Cramorant - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm845.s.icon.png
[Arrokuda - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm846.icon.png
[Arrokuda - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm846.s.icon.png
[Barraskewda - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm847.icon.png
[Barraskewda - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm847.s.icon.png
[Grapploct - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm853.icon.png
[Clobbopus - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm852.icon.png
[Grapploct - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm853.s.icon.png
[Clobbopus - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm852.s.icon.png
[Milcery - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm868.icon.png
[Pincurchin - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm871.icon.png
[Pincurchin - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm871.s.icon.png
[Snom - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm872.icon.png
[Snom - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm872.s.icon.png
[Milcery - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm868.s.icon.png
[Alcremie - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm869.s.icon.png
[Alcremie - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm869.icon.png
[Frosmoth - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm873.icon.png
[Frosmoth - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm873.s.icon.png
[Morpeko - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm877.s.icon.png
[Cufant - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm878.icon.png
[Cufant - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm878.s.icon.png
[Copperajah - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm879.icon.png
[Copperajah - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm879.s.icon.png
[Dracozolt - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm880.icon.png
[Dracozolt - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm880.s.icon.png
[Arctozolt - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm881.icon.png
[Arctozolt - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm881.s.icon.png
[Dracovish - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm882.icon.png
[Dracovish - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm882.s.icon.png
[Arctovish - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm883.icon.png
[Arctovish - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm883.s.icon.png
[Duraludon - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm884.icon.png
[Duraludon - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm884.s.icon.png
[Kubfu - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm891.s.icon.png
[Zarude - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm893.s.icon.png
[Glastrier - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm896.icon.png
[Glastrier - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm896.s.icon.png
[Spectrier - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm897.icon.png
[Spectrier - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm897.s.icon.png
[Calyrex - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm898.icon.png
[Calyrex - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm898.s.icon.png
[Enamorus Forma Materializada - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm905.fINCARNATE.s.icon.png
[Tarountula - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm917.s.icon.png
[Spidops - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm918.icon.png
[Tarountula - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm917.icon.png
[Spidops - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm918.s.icon.png
[Maushold - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/shiny/10257.png
[Nacli - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm932.icon.png
[Nacli - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm932.s.icon.png
[Naclstack - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm933.icon.png
[Naclstack - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm933.s.icon.png
[Garganacl - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm934.icon.png
[Garganacl - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm934.s.icon.png
[Wattrel - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm940.icon.png
[Wattrel - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm940.s.icon.png
[Kilowattrel - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm941.icon.png
[Kilowattrel - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm941.s.icon.png
[Scovillain - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm952.s.icon.png
[Maschiff - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm942.s.icon.png
[Maschiff - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm942.icon.png
[Mabosstiff - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm943.icon.png
[Mabosstiff - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm943.s.icon.png
[Brambleghast - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm947.icon.png
[Toedscool - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm948.icon.png
[Brambleghast - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm947.s.icon.png
[Klawf - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm950.icon.png
[Bramblin - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm946.icon.png
[Klawf - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm950.s.icon.png
[Capsakid - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm951.icon.png
[Bramblin - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm946.s.icon.png
[Toedscruel - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm949.s.icon.png
[Toedscool - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm948.s.icon.png
[Capsakid - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm951.s.icon.png
[Toedscruel - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm949.icon.png
[Scovillain - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm952.icon.png
[Rellor - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm953.icon.png
[Rabsca - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm954.icon.png
[Rabsca - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm954.s.icon.png
[Rellor - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm953.s.icon.png
[Flittle - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm955.icon.png
[Espathra - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm956.icon.png
[Flittle - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm955.s.icon.png
[Espathra - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm956.s.icon.png
[Finizen - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm963.icon.png
[Finizen - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm963.s.icon.png
[Glimmet - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm969.icon.png
[Glimmora - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm970.icon.png
[Glimmora - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm970.s.icon.png
[Glimmet - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm969.s.icon.png
[Orthworm - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm968.s.icon.png
[Orthworm - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm968.icon.png
[Cyclizar - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm967.icon.png
[Cyclizar - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm967.s.icon.png
[Flamigo - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm973.icon.png
[Flamigo - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm973.s.icon.png
[Veluza - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm976.icon.png
[Veluza - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm976.s.icon.png
[Farigiraf - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm981.s.icon.png
[Farigiraf - Normal]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/nowadraco/pogo_assets/refs/heads/master/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm981.icon.png
[Wo-Chien - Shiny]: https://images.weserv.nl/?&url=https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/prites/pokemon/other/official-artwork/shiny/1001.png
"""

# --- CAMINHOS DOS ARQUIVOS ---
# Garanta que o script e a pasta 'json' estejam no mesmo diretório.
main_file_path = '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon.json'
alt_file_path = '/workspaces/blogger-poke-dragon-shadow/json/imagens_pokemon_alt.json'
output_file_path = 'json/imagens_pokemon_corrigido_final.json'
# -----------------------------

def carregar_json(caminho_arquivo):
    """Carrega um arquivo JSON de forma segura."""
    try:
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"ERRO CRÍTICO: Arquivo não encontrado em '{caminho_arquivo}'.")
        return None
    except json.JSONDecodeError:
        print(f"ERRO CRÍTICO: O arquivo '{caminho_arquivo}' é um JSON inválido.")
        return None

def padronizar_nome(nome_pokemon):
    """Padroniza o nome para a busca (minúsculas, sem parênteses)."""
    nome_padrao = nome_pokemon.lower()
    return re.sub(r'\s*\([^)]*\)', '', nome_padrao).strip()

# 1. Extrair as URLs quebradas da sua lista de texto
broken_links_set = set()
# Padrão para pegar a URL depois de ']: '
url_pattern = re.compile(r'\]: (https?://\S+)')
for line in BROKEN_LINKS_TEXT.strip().split('\n'):
    match = url_pattern.search(line)
    if match:
        broken_links_set.add(match.group(1))

print(f"Lista de {len(broken_links_set)} links quebrados carregada.")

# 2. Carregar os arquivos JSON
dados_principais = carregar_json(main_file_path)
dados_alternativos = carregar_json(alt_file_path)

if dados_principais and dados_alternativos:
    # 3. Criar mapa de referência com os links bons
    mapa_links_corretos = {padronizar_nome(p['name']): p for p in dados_alternativos}
    
    dados_corrigidos = []
    links_substituidos = 0
    
    print("\n--- INICIANDO SUBSTITUIÇÃO BASEADA NA LISTA ---\n")

    # 4. Iterar sobre os dados principais e corrigir
    for pokemon in dados_principais:
        pokemon_corrigido = pokemon.copy()
        nome_original = pokemon.get('nome', 'NOME_NAO_ENCONTRADO')
        nome_chave = padronizar_nome(nome_original)

        # Verifica se o link Normal está na lista de quebrados
        url_normal_original = pokemon_corrigido.get('imgNormal')
        if url_normal_original in broken_links_set:
            if nome_chave in mapa_links_corretos:
                link_novo = mapa_links_corretos[nome_chave].get('imgNormal')
                pokemon_corrigido['imgNormal'] = link_novo
                links_substituidos += 1
                print(f" -> Link Normal de '{nome_original}' substituído.")
            else:
                print(f" -- AVISO: Link Normal de '{nome_original}' quebrado, mas sem substituto na referência.")

        # Verifica se o link Shiny está na lista de quebrados
        url_shiny_original = pokemon_corrigido.get('imgShiny')
        if url_shiny_original in broken_links_set:
            if nome_chave in mapa_links_corretos:
                link_novo = mapa_links_corretos[nome_chave].get('imgShiny')
                pokemon_corrigido['imgShiny'] = link_novo
                links_substituidos += 1
                print(f" -> Link Shiny de '{nome_original}' substituído.")
            else:
                print(f" -- AVISO: Link Shiny de '{nome_original}' quebrado, mas sem substituto na referência.")
        
        dados_corrigidos.append(pokemon_corrigido)

    # 5. Salvar o arquivo final
    try:
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(dados_corrigidos, f, indent=4, ensure_ascii=False)
        print("\n----------------------------------------------------")
        print("✅ Processo de substituição concluído!")
        print(f"Total de links substituídos com sucesso: {links_substituidos}")
        print(f"Novo arquivo salvo em: {output_file_path}")
        print("----------------------------------------------------")
    except Exception as e:
        print(f"\nERRO AO SALVAR O ARQUIVO DE SAÍDA: {e}")