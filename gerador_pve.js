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

// 4. O CÉREBRO PADRÃO POKÉ GENIE: MÉDIA DE TODOS OS GOLPES E TEMPO DE LOBBY
function calcularMelhoresCombos(pokemon, oponente, tempoMaximoRaid = 300) {
    if (!pokemon || !pokemon.baseStats || !oponente.fastMoves || !oponente.chargedMoves) return [];

    const ATACKER_LEVEL = 40;
    const cpmIndex = Math.round((ATACKER_LEVEL - 1) * 2);
    const CPM = cpms[cpmIndex] || 0.7903; 

    const atkUser = ((pokemon.baseStats.atk || 10) + 15) * CPM;
    const defUser = ((pokemon.baseStats.def || 10) + 15) * CPM;
    const attackerHPMax = Math.floor(((pokemon.baseStats.hp || 10) + 15) * CPM);

    const isShadow = pokemon.speciesName.toLowerCase().includes("shadow");
    const isMega = pokemon.speciesName.toLowerCase().startsWith("mega ");

    const bonusShadowAtk = isShadow ? 1.2 : 1.0;
    const atkFinalUser = atkUser * bonusShadowAtk;
    let damageBonusMult = isMega ? 1.1 : 1.0;

    const CPM_BOSS = 0.7903; 
    const atkBossReal = (oponente.baseStats.atk + 15) * CPM_BOSS;
    const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM_BOSS);
    const defUserFinal = isShadow ? defUser * 0.833 : defUser;
    
    const razaoDanoAtacante = atkFinalUser / defInimigoReal;
    const razaoDanoBoss = atkBossReal / defUserFinal;

    const getMoveData = (id, isFast) => {
        const map = isFast ? GLOBAL_POKE_DB.gymFastMap : GLOBAL_POKE_DB.gymChargedMap;
        let move = map.get(id);
        if (!move && !id.endsWith("_FAST")) move = map.get(id + "_FAST");
        if (!move && id.endsWith("_FAST")) move = map.get(id.replace("_FAST", ""));
        return move;
    };

    const combos = [];
    const fastMoves = pokemon.fastMoves || [];
    const chargedMoves = pokemon.chargedMoves || [];

    fastMoves.forEach(fastId => {
        const fastMove = getMoveData(fastId, true);
        if (!fastMove) return;

        chargedMoves.forEach(chargedId => {
            const chargedMove = getMoveData(chargedId, false);
            if (!chargedMove) return;

            let somaDpsGeral = 0;
            let somaTdoGeral = 0;
            let somaEstimador = 0;
            let simulacoesValidas = 0;

            oponente.fastMoves.forEach(bossFastId => {
                const bFast = getMoveData(bossFastId, true);
                if (!bFast) return;

                oponente.chargedMoves.forEach(bossChargedId => {
                    const bCharged = getMoveData(bossChargedId, false);
                    if (!bCharged) return;

                    let mFast = 1.0; if (pokemon.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase())) mFast *= 1.2;
                    mFast *= getTypeEffectiveness(fastMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    
                    let mCharged = 1.0; if (pokemon.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase())) mCharged *= 1.2;
                    mCharged *= getTypeEffectiveness(chargedMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);

                    let mBossFast = 1.0; if (oponente.tipos.some(t => t && String(t).toLowerCase() === String(bFast.type).toLowerCase())) mBossFast *= 1.2;
                    mBossFast *= getTypeEffectiveness(bFast.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    let mBossCharged = 1.0; if (oponente.tipos.some(t => t && String(t).toLowerCase() === String(bCharged.type).toLowerCase())) mBossCharged *= 1.2;
                    mBossCharged *= getTypeEffectiveness(bCharged.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDanoAtacante * mFast * damageBonusMult) + 1;
                    const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDanoAtacante * mCharged * damageBonusMult) + 1;
                    
                    const dmgBossFast = Math.floor(0.5 * (bFast.power || 0) * razaoDanoBoss * mBossFast) + 1;
                    const dmgBossCharged = Math.floor(0.5 * (bCharged.power || 0) * razaoDanoBoss * mBossCharged) + 1;

                    let tFast = (parseFloat(fastMove.duration) || (fastMove.cooldown / 1000) || 0); if(tFast > 10) tFast/=1000; if(tFast<0.1) tFast=0.5; tFast += 0.05;
                    let tCharged = (parseFloat(chargedMove.duration) || (chargedMove.cooldown / 1000) || 0); if(tCharged > 10) tCharged/=1000; if(tCharged<0.1) tCharged=2.0; tCharged += 0.1;
                    let tBossFast = (bFast.cooldown || 1000) / 1000;
                    let tBossCharged = (bCharged.cooldown || 2000) / 1000;

                    const enGain = Math.max(1, fastMove.energy || fastMove.energyGain || 6);
                    const enCost = Math.abs(chargedMove.energy || chargedMove.energyCost || 50);

                    let hpAtual = attackerHPMax;
                    let energiaAtacante = 0; let energiaBoss = 0; let danoTotalVida = 0;
                    let relogio = 0; let proxAcaoAtacante = 0; let proxAcaoBoss = 1.5;

                    // 🌟 O relógio agora respeita o tempo da Reide (180s ou 300s)
                    while (hpAtual > 0 && relogio < tempoMaximoRaid) {
                        relogio = Math.min(proxAcaoAtacante, proxAcaoBoss);
                        
                        if (relogio >= proxAcaoBoss) {
                            if (energiaBoss >= 50 && Math.random() > 0.5) { 
                                hpAtual -= dmgBossCharged; energiaBoss -= 50; proxAcaoBoss = relogio + tBossCharged + 2.0; energiaAtacante += Math.floor(dmgBossCharged / 2); 
                            } else { 
                                hpAtual -= dmgBossFast; energiaBoss += 10; proxAcaoBoss = relogio + tBossFast + 1.5; energiaAtacante += Math.floor(dmgBossFast / 2); 
                            }
                            if (energiaAtacante > 100) energiaAtacante = 100;
                        }
                        if (hpAtual <= 0) break;
                        
                        if (relogio >= proxAcaoAtacante) {
                            if (energiaAtacante >= enCost) { 
                                danoTotalVida += dmgCharged; energiaAtacante -= enCost; proxAcaoAtacante = relogio + tCharged; energiaBoss += Math.floor(dmgCharged / 2); 
                            } else { 
                                danoTotalVida += dmgFast; energiaAtacante += enGain; proxAcaoAtacante = relogio + tFast; energiaBoss += Math.floor(dmgFast / 2); 
                            }
                            if (energiaAtacante > 100) energiaAtacante = 100;
                            if (energiaBoss > 100) energiaBoss = 100;
                        }
                    }

                    // 🌟 Projeta baseado no tempo da Tier (180s ou 300s)
                    const tempoDeVida = Math.max(0.1, relogio);
                    const mortesNoTempoBase = tempoMaximoRaid / tempoDeVida; 
                    const idasAoLobby = Math.floor(mortesNoTempoBase / 6); 
                    
                    const tempoRealBatendo = Math.max(0, tempoMaximoRaid - (idasAoLobby * 15)); 
                    const dpsCiclo = danoTotalVida / tempoDeVida; 
                    
                    const danoTotalNoTempo = dpsCiclo * tempoRealBatendo;
                    const dpsEfetivo = danoTotalNoTempo / tempoMaximoRaid; 

                    const mortesParaMatarBoss = oponente.baseStats.hp / danoTotalVida;
                    const ttw = (oponente.baseStats.hp / dpsCiclo) + (Math.floor(mortesParaMatarBoss / 6) * 15);
                    const estimador = ttw / tempoMaximoRaid;

                    somaDpsGeral += dpsEfetivo;
                    somaTdoGeral += danoTotalVida; 
                    somaEstimador += estimador;
                    simulacoesValidas++;
                });
            });

            if (simulacoesValidas > 0) {
                const dpsMedio = somaDpsGeral / simulacoesValidas;
                
                combos.push({
                    fast: fastMove.moveId,
                    charged: chargedMove.moveId,
                    dps: parseFloat(dpsMedio.toFixed(2)),
                    tdo: parseFloat((somaTdoGeral / simulacoesValidas).toFixed(0)),
                    est: parseFloat((somaEstimador / simulacoesValidas).toFixed(2))
                });
            }
        });
    });

    return combos.sort((a, b) => a.est - b.est); 
}

// 5. FUNÇÃO PRINCIPAL (FÁBRICA SOB DEMANDA COM TIER)
async function gerarRankingParaBoss(bossName, tier) {
    console.log("📥 Baixando e mapeando banco de dados...");
    
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged] = await Promise.all([
        fetch(URLS.MAIN_DATA).then(r => r.json()), fetch(URLS.MEGA_DATA).then(r => r.json()),
        fetch(URLS.GIGAMAX_DATA).then(r => r.json()), fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()),
        fetch(URLS.MOVES_GYM_FAST).then(r => r.json()), fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()),
    ]);

    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    
    GLOBAL_POKE_DB = {
        dadosEficacia: resEf,
        gymFastMap: new Map(resFast.map(m => [m.moveId, m])),
        gymChargedMap: new Map(resCharged.map(m => [m.moveId, m]))
    };

    const bossData = todosOsPokemons.find(p => p.speciesName.toLowerCase() === bossName.toLowerCase());
    
    if (!bossData) {
        console.error(`❌ Boss "${bossName}" não encontrado no banco de dados!`);
        return;
    }

    // 🌟 TABELA DE REIDES (Define a Vida e o Tempo pelo Tier) 🌟
    const raidConfigs = {
        "1": { hp: 600, tempo: 180 },
        "2": { hp: 1800, tempo: 180 },
        "3": { hp: 3600, tempo: 180 },
        "4": { hp: 9000, tempo: 180 },
        "5": { hp: 15000, tempo: 300 },
        "mega": { hp: 9000, tempo: 300 },
        "mega_lendaria": { hp: 20000, tempo: 300 },
        "primal": { hp: 22500, tempo: 300 },
        "dmax_1": { hp: 1700, tempo: 180 },
        "dmax_3": { hp: 10000, tempo: 180 },
        "dmax_5": { hp: 15000, tempo: 300 },
        "gmax_6": { hp: 90000, tempo: 300 }
    };

    // Se o usuário digitar errado, força Tier 5
    const configRaid = raidConfigs[tier] || raidConfigs["5"];
    const BOSS_HP = configRaid.hp;
    const TEMPO_RAID = configRaid.tempo;

    const nomeLimpoBoss = bossName.toLowerCase().replace(/ /g, "_");

    const fastBoss = (bossData.fastMoves && bossData.fastMoves.length > 0) ? bossData.fastMoves : ["TACKLE_FAST"];
    const chargedBoss = (bossData.chargedMoves && bossData.chargedMoves.length > 0) ? bossData.chargedMoves : ["STRUGGLE"];

    const cenariosDeLuta = [];

    // Cenário Média
    cenariosDeLuta.push({
        sufixoArquivo: "average",
        nomeExibicao: "Média de Todos os Ataques",
        fastMoves: fastBoss,
        chargedMoves: chargedBoss
    });

    // Cenários Específicos
    fastBoss.forEach(fId => {
        chargedBoss.forEach(cId => {
            const sufixo = `${fId}_${cId}`.toLowerCase(); 
            cenariosDeLuta.push({
                sufixoArquivo: sufixo,
                nomeExibicao: `${fId} + ${cId}`,
                fastMoves: [fId],     
                chargedMoves: [cId]   
            });
        });
    });

    console.log(`\n⚔️ ALVO: ${bossData.speciesName} | TIER: ${tier.toUpperCase()}`);
    console.log(`❤️ HP do Boss: ${BOSS_HP} | ⏱️ Tempo de Reide: ${TEMPO_RAID}s`);
    console.log(`📋 Total de Arquivos a gerar: ${cenariosDeLuta.length}. Aguarde...\n`);

    for (let c = 0; c < cenariosDeLuta.length; c++) {
        const cenario = cenariosDeLuta[c];
        
        // Só imprime o progresso para não poluir demais
        process.stdout.write(`⚙️ Gerando [${c+1}/${cenariosDeLuta.length}]: ${cenario.sufixoArquivo}... `);

        const oponenteRaid = {
            tipos: bossData.types || ["Normal"],
            baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: BOSS_HP },
            fastMoves: cenario.fastMoves,
            chargedMoves: cenario.chargedMoves
        };

        let resultados = [];

        todosOsPokemons.forEach(atacante => {
            if (atacante.speciesId === bossData.speciesId || 
                atacante.speciesName.includes("Purified") || 
                atacante.speciesName.startsWith("Mega ") ||
                atacante.speciesName === "Smeargle" ||
                atacante.speciesName === "Ditto") {
                return;
            }

            const combos = calcularMelhoresCombos(atacante, oponenteRaid, TEMPO_RAID);

            if (combos.length > 0) {
                const melhor = combos[0];
                resultados.push({
                    id: atacante.speciesId,
                    name: atacante.speciesName,
                    f: melhor.fast,
                    c: melhor.charged,
                    dps: melhor.dps,
                    tdo: melhor.tdo,
                    est: melhor.est
                });
            }
        });

        if (resultados.length > 0) {
            resultados.sort((a, b) => a.est - b.est);

            // 🌟 AQUI O NOME DO ARQUIVO PEGA O TIER DINÂMICO 🌟
            const nomeDoArquivo = `counters_${nomeLimpoBoss}_t${tier}_${cenario.sufixoArquivo}.json`;
            const arquivoSaida = path.join(pastaDestino, nomeDoArquivo);
            
            fs.writeFileSync(arquivoSaida, JSON.stringify(resultados, null, 2));
            console.log(`✅ Salvo! (Top 1: ${resultados[0].name})`);
        }
    }

    console.log(`\n🎉 PROCESSO CONCLUÍDO PARA O TIER ${tier.toUpperCase()}!`);
}

// =================================================================
// 🚀 LEITOR DE COMANDOS DO TERMINAL (A MÁGICA FINAL!)
// =================================================================
// Pega o que você digitar depois de "node gerador_pve.js"
const argumentoBoss = process.argv[2] || "Mewtwo"; // Por padrão, faz o Mewtwo
const argumentoTier = process.argv[3] || "5";      // Por padrão, faz a Tier 5

gerarRankingParaBoss(argumentoBoss, argumentoTier);