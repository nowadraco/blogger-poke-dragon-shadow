const fs = require('fs');
const path = require('path');

const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve');
if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino, { recursive: true });
}

// 1. URLs da Base de Dados
const URLS = {
    MAIN_DATA: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data.json",
    MEGA_DATA: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/mega_reides.json",
    GIGAMAX_DATA: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data_gigamax.json",
    TYPE_EFFECTIVENESS: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/eficacia_tipos_poke.json",
    MOVES_GYM_FAST: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_rapidos_gym.json",
    MOVES_GYM_CHARGED: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_carregados_gym.json",
};

// Variável Global para o Node.js usar
let GLOBAL_POKE_DB = {};

// 2. Tabela de CPM (Usaremos a posição 79 para o Nível 40)
const cpms = [
    0.0939999967813491, 0.135137430784308, 0.166397869586944, 0.192650914456886,
    0.215732470154762, 0.236572655026622, 0.255720049142837, 0.273530381100769,
    0.29024988412857, 0.306057381335773, 0.321087598800659, 0.335445032295077,
    0.349212676286697, 0.36245774877879, 0.375235587358474, 0.387592411085168,
    0.399567276239395, 0.41119354951725, 0.422500014305114, 0.432926413410414,
    0.443107545375824, 0.453059953871985, 0.46279838681221, 0.472336077786704,
    0.481684952974319, 0.490855810259008, 0.499858438968658, 0.508701756943992,
    0.517393946647644, 0.525942508771329, 0.534354329109191, 0.542635762230353,
    0.550792694091796, 0.558830599438087, 0.566754519939422, 0.574569148039264,
    0.582278907299041, 0.589887911977272, 0.59740000963211, 0.604823657502073,
    0.61215728521347, 0.61940411056605, 0.626567125320434, 0.633649181622743,
    0.640652954578399, 0.647580963301656, 0.654435634613037, 0.661219263506722,
    0.667934000492096, 0.674581899290818, 0.681164920330047, 0.687684905887771,
    0.694143652915954, 0.700542893277978, 0.706884205341339, 0.713169102333341,
    0.719399094581604, 0.725575616972598, 0.731700003147125, 0.734741011137376,
    0.737769484519958, 0.740785574597326, 0.743789434432983, 0.746781208702482,
    0.749761044979095, 0.752729105305821, 0.75568550825119, 0.758630366519684,
    0.761563837528228, 0.764486065255226, 0.767397165298461, 0.77029727397159,
    0.77318650484085, 0.776064945942412, 0.778932750225067, 0.781790064808426,
    0.784636974334716, 0.787473583646825, 0.790300011634826, 0.792803950958807,
    0.795300006866455, 0.79780392148697, 0.800300002098083, 0.802803892322847,
    0.805299997329711, 0.807803863460723, 0.81029999256134, 0.812803834895026,
    0.815299987792968, 0.817803806620319, 0.820299983024597, 0.822803778631297,
    0.825299978256225, 0.827803750922782, 0.830299973487854, 0.832803753381377,
    0.835300028324127, 0.837803755931569, 0.840300023555755
];

// 3. Funções Utilitárias Blindadas (Copiadas do seu front-end)
function getTypeEffectiveness(moveType, defenderTypes, typeData) {
    if (!moveType || !defenderTypes || !typeData) return 1.0;
    try {
        const formatarTipo = (t) => {
            if (!t) return "";
            const tLower = t.toLowerCase().trim();
            const dict = { normal: "Normal", fire: "Fogo", water: "Água", electric: "Elétrico", grass: "Planta", ice: "Gelo", fighting: "Lutador", poison: "Venenoso", ground: "Terrestre", flying: "Voador", psychic: "Psíquico", bug: "Inseto", rock: "Pedra", ghost: "Fantasma", dragon: "Dragão", steel: "Aço", dark: "Sombrio", fairy: "Fada", fogo: "Fogo", água: "Água", agua: "Água", planta: "Planta", elétrico: "Elétrico", eletrico: "Elétrico" };
            return dict[tLower] || tLower.charAt(0).toUpperCase() + tLower.slice(1);
        };
        const ataquePT = formatarTipo(moveType);
        const defensorPT = defenderTypes.filter(t => t && t.toLowerCase() !== "none").map(t => formatarTipo(t)).sort();
        const dadosMatch = typeData.find(entry => entry.tipos && JSON.stringify(defensorPT) === JSON.stringify(entry.tipos.slice().sort()));
        
        if (!dadosMatch || !dadosMatch.defesa) return 1.0;
        
        const check = (categoria) => {
            if (!categoria) return null;
            for (const multKey in categoria) {
                if (categoria[multKey].includes(ataquePT)) return parseFloat(multKey.replace("x", ""));
            }
            return null;
        };
        
        const fFraq = check(dadosMatch.defesa.fraqueza); if (fFraq !== null) return fFraq;
        const fRes = check(dadosMatch.defesa.resistencia); if (fRes !== null) return fRes;
        if (dadosMatch.defesa.imunidade && dadosMatch.defesa.imunidade.includes(ataquePT)) return 0.390625;
        
        return 1.0;
    } catch (e) { return 1.0; }
}

// 4. O CÉREBRO: O MOTOR DE MONTE CARLO (Aleatoriedade Real)
function calcularMelhoresCombos(pokemon, oponente) {
    if (!pokemon || !pokemon.baseStats) return [];

    // === CONFIGURAÇÃO DA SIMULAÇÃO ===
    const NUM_SIMULACOES = 50; // Joga a mesma batalha 50 vezes e tira a média!
    const ATACKER_LEVEL = 40;
    const cpmIndex = Math.round((ATACKER_LEVEL - 1) * 2);
    const CPM = cpms[cpmIndex] || 0.7903; 

    // Calcula seus Status
    const atkUser = ((pokemon.baseStats.atk || 10) + 15) * CPM;
    const defUser = ((pokemon.baseStats.def || 10) + 15) * CPM;
    const attackerHPMax = Math.floor(((pokemon.baseStats.hp || 10) + 15) * CPM);

    const isShadow = pokemon.speciesName.toLowerCase().includes("shadow");
    const isMega = pokemon.speciesName.toLowerCase().startsWith("mega ");

    const bonusShadowAtk = isShadow ? 1.2 : 1.0;
    const atkFinalUser = atkUser * bonusShadowAtk;
    let damageBonusMult = isMega ? 1.1 : 1.0;

    // Calcula a Defesa do Boss
    const CPM_BOSS = 0.7903; 
    const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM_BOSS);
    const defUserFinal = isShadow ? defUser * 0.833 : defUser;
    const razaoDano = atkFinalUser / defInimigoReal;

    const getMoveData = (id, isFast) => {
        const map = isFast ? GLOBAL_POKE_DB.gymFastMap : GLOBAL_POKE_DB.gymChargedMap;
        let move = map.get(id);
        if (!move && !id.endsWith("_FAST")) move = map.get(id + "_FAST");
        if (!move && id.endsWith("_FAST")) move = map.get(id.replace("_FAST", ""));
        return move;
    };

    // Força bruta do Boss (Aproximada para a simulação fluir rápido)
    const bossIncomingDPS = (160 * (oponente.baseStats.atk / Math.max(1, defUserFinal))) / 20.0 * 0.75;
    const bossFastDmg = bossIncomingDPS * 2.0 * 0.6; 
    const bossChargedDmg = bossIncomingDPS * 10.0 * 0.4; 
    
    const combos = [];
    const fastMoves = pokemon.fastMoves || [];
    const chargedMoves = pokemon.chargedMoves || [];

    fastMoves.forEach(fastId => {
        const fastMove = getMoveData(fastId, true);
        if (!fastMove) return;

        chargedMoves.forEach(chargedId => {
            const chargedMove = getMoveData(chargedId, false);
            if (!chargedMove) return;

            const rawTempoRapido = parseFloat(fastMove.duration) || (fastMove.cooldown / 1000) || 0;
            const rawEnergiaRapido = fastMove.energy || fastMove.energyGain || 0;
            const rawTempoCarregado = parseFloat(chargedMove.duration) || (chargedMove.cooldown / 1000) || 0;
            const rawEnergiaCarregado = Math.abs(chargedMove.energy || chargedMove.energyCost || 0);
            const rawDanoCarregado = chargedMove.power || 0;

            if (rawTempoRapido <= 0 || rawEnergiaRapido <= 0 || rawTempoCarregado <= 0 || rawEnergiaCarregado <= 0 || rawDanoCarregado <= 0) return;

            const getMult = (moveType) => {
                let m = 1.0;
                if (moveType && pokemon.types && Array.isArray(pokemon.types)) {
                    if (pokemon.types.some(t => t && String(t).toLowerCase() === String(moveType).toLowerCase())) m *= 1.2;
                }
                let ef = getTypeEffectiveness(moveType, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                return m * ef;
            };

            const mFast = getMult(fastMove.type);
            const mCharged = getMult(chargedMove.type);

            const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDano * mFast * damageBonusMult) + 1;
            const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDano * mCharged * damageBonusMult) + 1;

            let tFast = rawTempoRapido > 10 ? rawTempoRapido / 1000 : rawTempoRapido; if (tFast < 0.1) tFast = 0.5;
            let tCharged = rawTempoCarregado > 10 ? rawTempoCarregado / 1000 : rawTempoCarregado; if (tCharged < 0.1) tCharged = 2.0;

            const enGain = Math.max(1, rawEnergiaRapido);
            const enCost = rawEnergiaCarregado;

            // ========================================================
            // 🎲 O LOOP MONTE CARLO (Roda a batalha várias vezes)
            // ========================================================
            let danoTotalAcumulado = 0;
            let tempoTotalAcumulado = 0;

            for (let sim = 0; sim < NUM_SIMULACOES; sim++) {
                let hpAtual = attackerHPMax;
                let energiaAtacante = 0; 
                let energiaBoss = 0; 
                let danoNaSimulacao = 0;
                
                let relogio = 0; 
                let proxAcaoAtacante = 0; 
                
                // RNG 1: O Boss demora aleatoriamente entre 1.0s e 2.0s para dar o primeiro golpe (O Rugido)
                let proxAcaoBoss = (Math.random() * 1.0) + 1.0; 

                while (hpAtual > 0 && relogio < 300) {
                    relogio = Math.min(proxAcaoAtacante, proxAcaoBoss);

                    // TURNO DO BOSS
                    if (relogio >= proxAcaoBoss) {
                        let usouCarregado = false;
                        
                        // RNG 2: Se o Boss tem energia, ele joga uma moeda (50% chance) para decidir se usa o Especial
                        if (energiaBoss >= 50 && Math.random() > 0.5) { 
                            hpAtual -= bossChargedDmg; 
                            energiaBoss -= 50; 
                            
                            // RNG 3: Tempo do Golpe (aprox 2.0s) + Delay Aleatório (1.5s a 2.5s)
                            const delayAleatorio = (Math.random() * 1.0) + 1.5;
                            proxAcaoBoss = relogio + 2.0 + delayAleatorio; 
                            
                            energiaAtacante += Math.floor(bossChargedDmg / 2); 
                            usouCarregado = true;
                        }
                        
                        // Se decidiu não usar o especial ou não tem energia, usa o ataque rápido
                        if (!usouCarregado) { 
                            hpAtual -= bossFastDmg; 
                            energiaBoss += 10; 
                            
                            // RNG 4: Tempo do Golpe (aprox 1.0s) + Delay Aleatório (1.5s a 2.5s)
                            const delayAleatorio = (Math.random() * 1.0) + 1.5;
                            proxAcaoBoss = relogio + 1.0 + delayAleatorio; 
                            
                            energiaAtacante += Math.floor(bossFastDmg / 2); 
                        }
                        if (energiaAtacante > 100) energiaAtacante = 100;
                    }

                    if (hpAtual <= 0) break;

                    // TURNO DO JOGADOR (Atacante perfeito, não tem delay aleatório)
                    if (relogio >= proxAcaoAtacante) {
                        if (energiaAtacante >= enCost) { 
                            danoNaSimulacao += dmgCharged; 
                            energiaAtacante -= enCost; 
                            proxAcaoAtacante = relogio + tCharged; 
                            energiaBoss += Math.floor(dmgCharged / 2); 
                        } else { 
                            danoNaSimulacao += dmgFast; 
                            energiaAtacante += enGain; 
                            proxAcaoAtacante = relogio + tFast; 
                            energiaBoss += Math.floor(dmgFast / 2); 
                        }
                        if (energiaAtacante > 100) energiaAtacante = 100;
                        if (energiaBoss > 100) energiaBoss = 100;
                    }
                }

                // Soma o resultado desta linha do tempo nas estatísticas gerais
                danoTotalAcumulado += danoNaSimulacao;
                tempoTotalAcumulado += relogio;
            }

            // 🧮 TIRA A MÉDIA DAS 50 SIMULAÇÕES
            const danoMedio = danoTotalAcumulado / NUM_SIMULACOES;
            const tempoMedio = tempoTotalAcumulado / NUM_SIMULACOES;
            const dpsMedio = tempoMedio > 0 ? (danoMedio / tempoMedio) : 0;

            combos.push({
                fast: fastMove.moveId,
                charged: chargedMove.moveId,
                dps: parseFloat(dpsMedio.toFixed(3)),
                tdo: parseFloat(danoMedio.toFixed(1)) // O TDO agora é a média do dano de 50 vidas
            });
        });
    });

    return combos.sort((a, b) => b.dps - a.dps);
}

// 5. FUNÇÃO PRINCIPAL DE GERAR O ARQUIVO DE UM BOSS
async function gerarRankingParaBoss(bossName) {
    console.log("📥 Baixando e mapeando banco de dados...");
    
    // Download parelelo de tudo que importa
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged] = await Promise.all([
        fetch(URLS.MAIN_DATA).then(r => r.json()),
        fetch(URLS.MEGA_DATA).then(r => r.json()),
        fetch(URLS.GIGAMAX_DATA).then(r => r.json()),
        fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()),
        fetch(URLS.MOVES_GYM_FAST).then(r => r.json()),
        fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()),
    ]);

    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    
    // Alimenta o objeto Global
    GLOBAL_POKE_DB = {
        dadosEficacia: resEf,
        gymFastMap: new Map(resFast.map(m => [m.moveId, m])),
        gymChargedMap: new Map(resCharged.map(m => [m.moveId, m]))
    };

    // Localiza o Boss Alvo
    const bossData = todosOsPokemons.find(p => p.speciesName.toLowerCase() === bossName.toLowerCase());
    
    if (!bossData) {
        console.error(`❌ Boss ${bossName} não encontrado no banco de dados!`);
        return;
    }

    console.log(`\n⚔️ ALVO ENCONTRADO: ${bossData.speciesName}`);
    console.log(`⏳ Calculando simulações contra os ${todosOsPokemons.length} Pokémon... Isso vai levar uns 10 segundos.\n`);

    // Configuração da Reide
    const BOSS_HP_TIER_5 = 15000;
    const TEMPO_RAID = 300;

    const oponenteRaid = {
        tipos: bossData.types,
        baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: BOSS_HP_TIER_5 }
    };

    let resultados = [];

    // O Loop Duplo em todos os Pokémons
    todosOsPokemons.forEach(atacante => {
        // Ignora duplicados ou inúteis
        if (atacante.speciesId === bossData.speciesId || atacante.speciesName.includes("Purified") || atacante.speciesName.startsWith("Mega ")) {
            return;
        }

        const combos = calcularMelhoresCombos(atacante, oponenteRaid);

        if (combos.length > 0) {
            const melhor = combos[0];
            const dps = Math.max(0.1, melhor.dps);
            const tdo = Math.max(1, melhor.tdo);

            const tempoLuta = BOSS_HP_TIER_5 / dps;
            const mortesReais = BOSS_HP_TIER_5 / tdo;
            const wipesDeTime = Math.floor(mortesReais / 6);
            const ttw = tempoLuta + 2 * Math.floor(mortesReais) + 15 * wipesDeTime;
            const estimador = ttw / TEMPO_RAID;

            resultados.push({
                id: atacante.speciesId,
                name: atacante.speciesName,
                f: melhor.fast,
                c: melhor.charged,
                dps: melhor.dps,
                tdo: melhor.tdo,
                est: parseFloat(estimador.toFixed(2))
            });
        }
    });

    // Ordena pelo Estimador (Menor é melhor)
    resultados.sort((a, b) => a.est - b.est);

    // Agora não cortamos mais nada! A lista vai inteira.
    const arquivoSaida = path.join(pastaDestino, `counters_${bossName.toLowerCase().replace(/ /g, "_")}_t5.json`);
    
    // Passamos a variável 'resultados' inteira para o arquivo (já está ordenada do 1º ao último)
    fs.writeFileSync(arquivoSaida, JSON.stringify(resultados, null, 2));

    console.log(`🏆 RANKING COMPLETO GERADO COM SUCESSO!`);
    console.log(`📊 Total de Pokémons na lista: ${resultados.length}`);
    console.log(`📁 Salvo em: ${arquivoSaida}`);
    
    console.log("\n🥇 TOP 3:");
    console.log(`1. ${resultados[0].name} (Est: ${resultados[0].est})`);
    console.log(`2. ${resultados[1].name} (Est: ${resultados[1].est})`);
    console.log(`3. ${resultados[2].name} (Est: ${resultados[2].est})`);
}

// INICIA A GERAÇÃO CONTRA O MEWTWO!
gerarRankingParaBoss("Mewtwo");