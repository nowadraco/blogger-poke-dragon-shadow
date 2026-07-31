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
    MOVE_DATA: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/moves.json" 
};

let GLOBAL_POKE_DB = {};

// 2. Tabela de CPM
const cpms = [
    0.09399, 0.13513, 0.16639, 0.19265, 0.21573, 0.23657, 0.25572, 0.27353, 0.29024, 0.30605, 
    0.32108, 0.33544, 0.34921, 0.36245, 0.37523, 0.38759, 0.39956, 0.41119, 0.42250, 0.43292, 
    0.44310, 0.45305, 0.46279, 0.47233, 0.48168, 0.49085, 0.49985, 0.50870, 0.51739, 0.52594, 
    0.53435, 0.54263, 0.55079, 0.55883, 0.56675, 0.57456, 0.58227, 0.58988, 0.59740, 0.60482, 
    0.61215, 0.61940, 0.62656, 0.63364, 0.64065, 0.64758, 0.65443, 0.66121, 0.66793, 0.67458, 
    0.68116, 0.68768, 0.69414, 0.70054, 0.70688, 0.71316, 0.71939, 0.72557, 0.73170, 0.73474, 
    0.73776, 0.74078, 0.74378, 0.74678, 0.74976, 0.75272, 0.75568, 0.75863, 0.76156, 0.76448, 
    0.76739, 0.77029, 0.77318, 0.77606, 0.77893, 0.78179, 0.78463, 0.78747, 0.79030, 0.79280, 
    0.79530, 0.79780, 0.80030, 0.80280, 0.80529, 0.80780, 0.81029, 0.81280, 0.81529, 0.81780, 
    0.82029, 0.82280, 0.82529, 0.82780, 0.83029, 0.83280, 0.83530, 0.83780, 0.84030
];

// 3. A SUA FUNÇÃO DE EFICÁCIA (LIMPADOR DE TIPOS ADICIONADO)
function getTypeEffectiveness(moveType, defenderTypes, typeData) {
    if (!moveType || !defenderTypes || !typeData) return 1.0;
    try {
        const formatarTipo = (t) => {
            if (!t) return "";
            // 🚨 LIMPEZA: Remove o POKEMON_TYPE_ e deixa tudo perfeito
            const tNorm = String(t).toUpperCase().replace("POKEMON_TYPE_", "").trim();
            const dict = { 
                NORMAL: "Normal", FIRE: "Fogo", WATER: "Água", ELECTRIC: "Elétrico", GRASS: "Planta", 
                ICE: "Gelo", FIGHTING: "Lutador", POISON: "Venenoso", GROUND: "Terrestre", 
                FLYING: "Voador", PSYCHIC: "Psíquico", BUG: "Inseto", ROCK: "Pedra", 
                GHOST: "Fantasma", DRAGON: "Dragão", STEEL: "Aço", DARK: "Sombrio", FAIRY: "Fada" 
            };
            return dict[tNorm] || tNorm.charAt(0).toUpperCase() + tNorm.slice(1).toLowerCase();
        };
        
        const ataquePT = formatarTipo(moveType);
        const defensorPT = defenderTypes.filter(t => t && String(t).toLowerCase() !== "none").map(t => formatarTipo(t)).sort();
        
        const dadosMatch = typeData.find(entry => {
            let jsonTipos = [];
            if (entry.tipos) jsonTipos = Array.isArray(entry.tipos) ? entry.tipos : [entry.tipos];
            else if (entry.tipo) jsonTipos = Array.isArray(entry.tipo) ? entry.tipo : [entry.tipo];
            jsonTipos = jsonTipos.map(t => formatarTipo(t)).sort();
            return JSON.stringify(defensorPT) === JSON.stringify(jsonTipos);
        });
        
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

// 4. O CÉREBRO DE BATALHA (MOTOR TTW COM RETENÇÃO DE ENERGIA E JANELA DE 300s)
function calcularMelhoresCombos(pokemon, oponente, tempoMaximoRaid = 300) {
    if (!pokemon || !pokemon.baseStats || !oponente.fastMoves || !oponente.chargedMoves) return [];

    const CPM = 0.7903; 
    const atkUser = ((pokemon.baseStats.atk || 10) + 15) * CPM;
    const defUser = ((pokemon.baseStats.def || 10) + 15) * CPM;
    const attackerHPMax = Math.floor(((pokemon.baseStats.hp || 10) + 15) * CPM);

    const isShadow = pokemon.speciesName.toLowerCase().includes("shadow");
    const atkFinalUser = atkUser * (isShadow ? 1.2 : 1.0);
    const damageBonusMult = pokemon.speciesName.toLowerCase().startsWith("mega ") ? 1.1 : 1.0;

    const atkBossReal = (oponente.baseStats.atk + 15) * CPM;
    const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM);
    const defUserFinal = isShadow ? defUser * 0.833 : defUser;
    
    const razaoDanoAtacante = atkFinalUser / defInimigoReal;
    const razaoDanoBoss = atkBossReal / defUserFinal;

    const getMoveData = (id, isFast) => {
        let move = (isFast ? GLOBAL_POKE_DB.gymFastMap : GLOBAL_POKE_DB.gymChargedMap).get(id);
        if (!move && !id.endsWith("_FAST")) move = GLOBAL_POKE_DB.gymFastMap.get(id + "_FAST");
        if (!move && id.endsWith("_FAST")) move = GLOBAL_POKE_DB.gymFastMap.get(id.replace("_FAST", ""));
        
        if (!move || (!move.durationMs && !move.duration)) {
            const fallback = GLOBAL_POKE_DB.moveDataObjMap.get(id) || GLOBAL_POKE_DB.moveDataObjMap.get(id + "_FAST") || GLOBAL_POKE_DB.moveDataObjMap.get(id.replace("_FAST", ""));
            if (fallback) move = fallback;
        }
        return move;
    };

    const combos = [];
    (pokemon.fastMoves || []).forEach(fastId => {
        const fastMove = getMoveData(fastId, true);
        if (!fastMove) return;

        (pokemon.chargedMoves || []).forEach(chargedId => {
            const chargedMove = getMoveData(chargedId, false);
            if (!chargedMove) return;

            let somaDpsGeral = 0; let somaTdoGeral = 0; let somaEstimador = 0; let somaDanoTotalGeral = 0;
            let simulacoesValidas = 0;
            let dpsMin = 9999, dpsMax = 0; let mortesMin = 9999, mortesMax = 0;

            oponente.fastMoves.forEach(bossFastId => {
                const bFast = getMoveData(bossFastId, true);
                if (!bFast) return;

                oponente.chargedMoves.forEach(bossChargedId => {
                    const bCharged = getMoveData(bossChargedId, false);
                    if (!bCharged) return;

                    // LÓGICA DE STAB PURA (Lendo o seu formato exato)
                    let mFast = pokemon.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase()) ? 1.2 : 1.0;
                    mFast *= getTypeEffectiveness(fastMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    
                    let mCharged = pokemon.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase()) ? 1.2 : 1.0;
                    mCharged *= getTypeEffectiveness(chargedMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);

                    let mBossFast = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bFast.type).toLowerCase()) ? 1.2 : 1.0;
                    mBossFast *= getTypeEffectiveness(bFast.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    let mBossCharged = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bCharged.type).toLowerCase()) ? 1.2 : 1.0;
                    mBossCharged *= getTypeEffectiveness(bCharged.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    const pwrFast = fastMove.power || 0;
                    const pwrCharged = chargedMove.power || 0;

                    const dmgFast = Math.floor(0.5 * pwrFast * razaoDanoAtacante * mFast * damageBonusMult) + 1;
                    const dmgCharged = Math.floor(0.5 * pwrCharged * razaoDanoAtacante * mCharged * damageBonusMult) + 1;
                    const dmgBossFast = Math.floor(0.5 * (bFast.power || 0) * razaoDanoBoss * mBossFast) + 1;
                    const dmgBossCharged = Math.floor(0.5 * (bCharged.power || 0) * razaoDanoBoss * mBossCharged) + 1;

                    // LEITURA DOS TEMPOS BASEADO NO SEU JSON (Corrigido para não usar cooldown no Boss)
                    let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown ? fastMove.cooldown / 1000 : 0.5); 
                    if(tFast > 10) tFast/=1000; if(tFast < 0.1) tFast = 0.5; tFast += 0.05;
                    
                    let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown ? chargedMove.cooldown / 1000 : 2.0); 
                    if(tCharged > 10) tCharged/=1000; if(tCharged < 0.1) tCharged = 2.0; tCharged += 0.5;

                    // 🚨 A CORREÇÃO DO BOSS: Agora ele respeita o duration do seu JSON de Gym
                    let tBossFast = (parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0)) + 1.5;
                    let tBossCharged = (parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0)) + 2.0;

                    // EXTRAÇÃO DE ENERGIA FIEL AO JSON
                    const enGain = Math.max(1, fastMove.energyGain || fastMove.energy || 6);
                    const enCost = Math.abs(chargedMove.energyCost || chargedMove.energy || 50);

                    const bossEnCost = Math.abs(bCharged.energyCost || bCharged.energy || 50);
                    const bossEnGain = bFast.energyGain || bFast.energy || 10;

                    // ⚙️ O LOOP DETERMINÍSTICO COM RETENÇÃO DE ENERGIA
                    let hpBoss = oponente.baseStats.hp;
                    let hpAtual = attackerHPMax;
                    
                    let energiaAtacante = 0;
                    let energiaBoss = 0;
                    
                    let relogio = 0;
                    let proxAcaoAtacante = 0;
                    let proxAcaoBoss = 1.0;
                    
                    let mortesTotais = 0;
                    let danoAos300s = 0; 
                    let limitadorInfinito = 0;

                    // A BATALHA
                    while (hpBoss > 0 && limitadorInfinito < 20000) {
                        limitadorInfinito++;
                        
                        let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);
                        
                        if (proximoEvento < relogio) proximoEvento = relogio;
                        relogio = proximoEvento;

                        if (relogio > 1500) {
                            hpBoss = 0;
                            break;
                        }
                        
                        if (hpAtual > 0 && relogio >= proxAcaoAtacante) {
                            let danoCausado = 0;
                            if (energiaAtacante >= enCost) { 
                                danoCausado = Math.min(hpBoss, dmgCharged);
                                energiaAtacante -= enCost; 
                                proxAcaoAtacante = relogio + tCharged; 
                            } else { 
                                danoCausado = Math.min(hpBoss, dmgFast);
                                energiaAtacante += enGain; 
                                proxAcaoAtacante = relogio + tFast; 
                            }
                            
                            hpBoss -= danoCausado;
                            energiaBoss += Math.ceil(danoCausado * 0.1); 
                            
                            if (energiaAtacante > 100) energiaAtacante = 100;
                            if (energiaBoss > 100) energiaBoss = 100;
                        }
                        else if (relogio >= proxAcaoBoss) {
                            if (energiaBoss >= bossEnCost) { 
                                hpAtual -= dmgBossCharged; 
                                energiaBoss -= bossEnCost; 
                                proxAcaoBoss = relogio + tBossCharged; 
                                energiaAtacante += Math.ceil(dmgBossCharged * 0.5); 
                            } else { 
                                hpAtual -= dmgBossFast; 
                                energiaBoss += bossEnGain; 
                                proxAcaoBoss = relogio + tBossFast; 
                                energiaAtacante += Math.ceil(dmgBossFast * 0.5); 
                            }
                            if (energiaAtacante > 100) energiaAtacante = 100;
                        }

                        if (relogio <= tempoMaximoRaid) {
                            danoAos300s = oponente.baseStats.hp - hpBoss;
                        }

                        // --- A MORTE (ONDE A ENERGIA VAI PRO LIXO) ---
                        if (hpAtual <= 0 && hpBoss > 0) {
                            mortesTotais++;
                            hpAtual = attackerHPMax; 
                            energiaAtacante = 0; // A Garra Sombria chora aqui!
                            
                            relogio += 1.0; 
                            proxAcaoAtacante = relogio + 0.5;
                            proxAcaoBoss = Math.max(proxAcaoBoss, relogio); 
                            
                            if (mortesTotais % 6 === 0) {
                                relogio += 15; 
                                energiaBoss = 0; 
                                proxAcaoBoss = relogio + 2.0; 
                                proxAcaoAtacante = relogio + 0.5;
                            }
                        }
                    }

                    if (relogio <= tempoMaximoRaid) {
                        danoAos300s = oponente.baseStats.hp;
                    }

                    const ttw = relogio; 
                    const tempoNaRaid = Math.min(ttw, tempoMaximoRaid);
                    const dpsEfetivo = tempoNaRaid > 0 ? (danoAos300s / tempoNaRaid) : 0; 
                    const estimador = ttw / Math.max(1, tempoMaximoRaid);
                    const mortesNaJanela = ttw > 0 ? (mortesTotais / ttw) * tempoMaximoRaid : 0;
                    
                    somaDpsGeral += dpsEfetivo; 
                    somaTdoGeral += (dpsEfetivo * (ttw / Math.max(1, mortesTotais))); 
                    somaDanoTotalGeral += danoAos300s; 
                    somaEstimador += estimador;
                    simulacoesValidas++;

                    if (dpsEfetivo < dpsMin) dpsMin = dpsEfetivo; 
                    if (dpsEfetivo > dpsMax) dpsMax = dpsEfetivo;
                    if (mortesNaJanela < mortesMin) mortesMin = mortesNaJanela; 
                    if (mortesNaJanela > mortesMax) mortesMax = mortesNaJanela;
                });
            });

            if (simulacoesValidas > 0) {
                const dpsMedio = somaDpsGeral / simulacoesValidas;
                const danoTotalMedio = somaDanoTotalGeral / simulacoesValidas;
                const danoPerc = (danoTotalMedio / oponente.baseStats.hp) * 100; 
                
                combos.push({
                    fast: fastMove.moveId,
                    charged: chargedMove.moveId,
                    dps: parseFloat(dpsMedio.toFixed(1)),
                    dpsMin: parseFloat(dpsMin.toFixed(1)), dpsMax: parseFloat(dpsMax.toFixed(1)),
                    dmgPerc: Math.min(100, parseFloat(danoPerc.toFixed(1))), 
                    deathsMin: Math.floor(mortesMin), deathsMax: Math.ceil(mortesMax),
                    tdo: parseFloat((somaTdoGeral / simulacoesValidas).toFixed(0)),
                    est: parseFloat((somaEstimador / simulacoesValidas).toFixed(2))
                });
            }
        });
    });

    return combos.sort((a, b) => b.dmgPerc - a.dmgPerc); 
}

// 5. FUNÇÃO PRINCIPAL
async function gerarRankingEmMassa(bossesInput, tiersInput) {
    console.log("📥 Baixando e mapeando banco de dados UMA ÚNICA VEZ...");
    
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged, resMoves] = await Promise.all([
        fetch(URLS.MAIN_DATA).then(r => r.json()), fetch(URLS.MEGA_DATA).then(r => r.json()),
        fetch(URLS.GIGAMAX_DATA).then(r => r.json()), fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()),
        fetch(URLS.MOVES_GYM_FAST).then(r => r.json()), fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()),
        fetch(URLS.MOVE_DATA).then(r => r.json())
    ]);

    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    
    GLOBAL_POKE_DB = {
        dadosEficacia: resEf,
        gymFastMap: new Map(resFast.map(m => [m.moveId, m])),
        gymChargedMap: new Map(resCharged.map(m => [m.moveId, m])),
        moveDataObjMap: new Map(resMoves.map(m => [m.moveId, m]))
    };

    console.log("✅ Banco de dados carregado com sucesso na memória!\n");

    console.log("🛡️ Removendo Pokémon fracos, Purificados e Megas da base...");
    const atacantesVIP = todosOsPokemons.filter(atacante => {
        if (!atacante || !atacante.baseStats) return false;

        if (atacante.speciesName.includes("Purified") || 
            atacante.speciesName.startsWith("Mega ") || 
            atacante.speciesName === "Smeargle" || 
            atacante.speciesName === "Ditto") {
            return false;
        }

        const atk50 = (atacante.baseStats.atk || 10) + 15;
        const def50 = (atacante.baseStats.def || 10) + 15;
        const hp50  = (atacante.baseStats.hp || 10) + 15;
        const maxCP = Math.floor((atk50 * Math.sqrt(def50) * Math.sqrt(hp50) * (0.8403 * 0.8403)) / 10);

        return maxCP >= 2900; 
    });
    console.log(`🎯 Ficaram apenas ${atacantesVIP.length} Pokémon de Elite aptos para lutar!\n`);

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

    const listaBosses = bossesInput.split(",").map(b => b.trim()).filter(b => b !== "");
    
    let tiersToRun = ["5"]; 
    if (typeof tiersInput === "string") {
        tiersToRun = tiersInput.toLowerCase().split(/[\s,]+/).filter(t => t.trim() !== "");
    }

    for (let i = 0; i < listaBosses.length; i++) {
        const bossName = listaBosses[i];
        
        const bossData = todosOsPokemons.find(p => p.speciesName.toLowerCase() === bossName.toLowerCase());
        if (!bossData) { 
            console.error(`\n❌ Boss não encontrado: "${bossName}"!`); 
            continue; 
        }

        const nomeLimpoBoss = bossName.toLowerCase().replace(/ /g, "_");
        const fastBoss = (bossData.fastMoves && bossData.fastMoves.length > 0) ? bossData.fastMoves : ["TACKLE_FAST"];
        const chargedBoss = (bossData.chargedMoves && bossData.chargedMoves.length > 0) ? bossData.chargedMoves : ["STRUGGLE"];

        const cenariosDeLuta = [{ sufixoArquivo: "average", nomeExibicao: "Média", fastMoves: fastBoss, chargedMoves: chargedBoss }];
        fastBoss.forEach(fId => chargedBoss.forEach(cId => cenariosDeLuta.push({ sufixoArquivo: `${fId}_${cId}`.toLowerCase(), nomeExibicao: `${fId} + ${cId}`, fastMoves: [fId], chargedMoves: [cId] })));

        console.log(`\n======================================================`);
        console.log(`👑 [${i+1}/${listaBosses.length}] SIMULAÇÃO: ${bossData.speciesName.toUpperCase()}`);
        console.log(`======================================================`);

        for (const currentTier of tiersToRun) {
            const configRaid = raidConfigs[currentTier] || raidConfigs["5"];
            const BOSS_HP = configRaid.hp; 
            const TEMPO_RAID = configRaid.tempo;

            console.log(`\n⚔️ TIER: ${currentTier.toUpperCase()} | HP: ${BOSS_HP} | TEMPO: ${TEMPO_RAID}s`);

            for (let c = 0; c < cenariosDeLuta.length; c++) {
                const cenario = cenariosDeLuta[c];
                console.log(` ⚙️ Gerando [${c+1}/${cenariosDeLuta.length}]: ${cenario.sufixoArquivo}... `);

                const oponenteRaid = { tipos: bossData.types || ["Normal"], baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: BOSS_HP }, fastMoves: cenario.fastMoves, chargedMoves: cenario.chargedMoves };

                let resultados = [];
                let pokesAnalisados = 0; const totalPokes = atacantesVIP.length; 

                atacantesVIP.forEach(atacante => {
                    pokesAnalisados++;
                    if (pokesAnalisados % 50 === 0 || pokesAnalisados === totalPokes) { process.stdout.write(`    🔄 Analisando: ${pokesAnalisados}/${totalPokes}...\r`); }

                    if (atacante.speciesId === bossData.speciesId) return;

                    const combos = calcularMelhoresCombos(atacante, oponenteRaid, TEMPO_RAID);
                    if (combos.length > 0) {
                        combos.forEach(combo => {
                            resultados.push({ id: atacante.speciesId, name: atacante.speciesName, f: combo.fast, c: combo.charged, dps: combo.dps, dpsMin: combo.dpsMin, dpsMax: combo.dpsMax, dmgPerc: combo.dmgPerc, deathsMin: combo.deathsMin, deathsMax: combo.deathsMax, tdo: combo.tdo, est: combo.est });
                        });
                    }
                });

                if (resultados.length > 0) {
                    const agrupadoPorPokemon = {};
                    resultados.forEach(combo => {
                        if (!agrupadoPorPokemon[combo.id]) {
                            agrupadoPorPokemon[combo.id] = { id: combo.id, nome: combo.name, melhorDano: 0, todosCombos: [] };
                        }
                        agrupadoPorPokemon[combo.id].todosCombos.push(combo);
                        if (combo.dmgPerc > agrupadoPorPokemon[combo.id].melhorDano) {
                            agrupadoPorPokemon[combo.id].melhorDano = combo.dmgPerc;
                        }
                    });

                    const rankingPokemons = Object.values(agrupadoPorPokemon).sort((a, b) => b.melhorDano - a.melhorDano);
                    const top30Pokemons = rankingPokemons.slice(0, 30);

                    let resultadosFinais = [];
                    top30Pokemons.forEach(poke => {
                        resultadosFinais = resultadosFinais.concat(poke.todosCombos);
                    });
                    resultadosFinais.sort((a, b) => b.dmgPerc - a.dmgPerc);

                    const nomeDoArquivo = `counters_${nomeLimpoBoss}_t${currentTier}_${cenario.sufixoArquivo}.json`;
                    const arquivoSaida = path.join(pastaDestino, nomeDoArquivo);
                    
                    fs.writeFileSync(arquivoSaida, JSON.stringify(resultadosFinais)); 
                    const tamanhoKB = (fs.statSync(arquivoSaida).size / 1024).toFixed(1);
                    console.log(` ✅ Salvo! ${nomeDoArquivo} (Rank #1: ${resultadosFinais[0].name}) - ${tamanhoKB} KB`);
                }
            }
        }
    }
    console.log(`\n🎉 PROCESSO MESTRE CONCLUÍDO COM SUCESSO!`);
}

const argumentosBosses = process.argv[2] || "Mewtwo"; 
const argumentosTiers = process.argv.slice(3).join(" ") || "5";      

gerarRankingEmMassa(argumentosBosses, argumentosTiers);