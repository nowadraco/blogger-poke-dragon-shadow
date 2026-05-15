const fs = require('fs');
const path = require('path');

// 📁 PASTA 6: O FUTURO (ARQUIVO ÚNICO + MINIMALISTA + SCORE ER + MIN/MAX)
const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve6');
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

// ==========================================
// 📊 VISOR PROFISSIONAL DE PROGRESSO
// ==========================================
function desenharBarra(atual, total, nomeCenario) {
    const tamanhoBarra = 30; 
    const progresso = atual / total;
    const blocosPreenchidos = Math.round(tamanhoBarra * progresso);
    const barra = '█'.repeat(blocosPreenchidos) + '░'.repeat(tamanhoBarra - blocosPreenchidos);
    const pct = Math.floor(progresso * 100).toString().padStart(3, ' ');
    process.stdout.write(` ⚡ [${nomeCenario.padEnd(20)}] [${barra}] ${pct}% | 🥊 Pokes: ${atual}/${total}\r`);
}

// 2. A SUA FUNÇÃO DE EFICÁCIA
function getTypeEffectiveness(moveType, defenderTypes, typeData) {
    if (!moveType || !defenderTypes || !typeData) return 1.0;
    try {
        const formatarTipo = (t) => {
            if (!t) return "";
            const tNorm = String(t).toUpperCase().replace("POKEMON_TYPE_", "").trim();
            const dict = { NORMAL: "Normal", FIRE: "Fogo", WATER: "Água", ELECTRIC: "Elétrico", GRASS: "Planta", ICE: "Gelo", FIGHTING: "Lutador", POISON: "Venenoso", GROUND: "Terrestre", FLYING: "Voador", PSYCHIC: "Psíquico", BUG: "Inseto", ROCK: "Pedra", GHOST: "Fantasma", DRAGON: "Dragão", STEEL: "Aço", DARK: "Sombrio", FAIRY: "Fada" };
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
            for (const multKey in categoria) { if (categoria[multKey].includes(ataquePT)) return parseFloat(multKey.replace("x", "")); }
            return null;
        };
        const fFraq = check(dadosMatch.defesa.fraqueza); if (fFraq !== null) return fFraq;
        const fRes = check(dadosMatch.defesa.resistencia); if (fRes !== null) return fRes;
        if (dadosMatch.defesa.imunidade && dadosMatch.defesa.imunidade.includes(ataquePT)) return 0.390625;
        return 1.0;
    } catch (e) { return 1.0; }
}

// 3. O CÉREBRO DE BATALHA (COM MIN/MAX DETERMINÍSTICO)
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
        const fastMove = getMoveData(fastId, true); if (!fastMove) return;
        (pokemon.chargedMoves || []).forEach(chargedId => {
            const chargedMove = getMoveData(chargedId, false); if (!chargedMove) return;

            oponente.fastMoves.forEach(bossFastId => {
                const bFast = getMoveData(bossFastId, true); if (!bFast) return;

                oponente.chargedMoves.forEach(bossChargedId => {
                    const bCharged = getMoveData(bossChargedId, false); if (!bCharged) return;

                    let mFast = pokemon.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase()) ? 1.2 : 1.0; mFast *= getTypeEffectiveness(fastMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    let mCharged = pokemon.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase()) ? 1.2 : 1.0; mCharged *= getTypeEffectiveness(chargedMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    let mBossFast = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bFast.type).toLowerCase()) ? 1.2 : 1.0; mBossFast *= getTypeEffectiveness(bFast.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);
                    let mBossCharged = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bCharged.type).toLowerCase()) ? 1.2 : 1.0; mBossCharged *= getTypeEffectiveness(bCharged.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDanoAtacante * mFast * damageBonusMult) + 1;
                    const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDanoAtacante * mCharged * damageBonusMult) + 1;
                    const dmgBossFast = Math.floor(0.5 * (bFast.power || 0) * razaoDanoBoss * mBossFast) + 1;
                    const dmgBossCharged = Math.floor(0.5 * (bCharged.power || 0) * razaoDanoBoss * mBossCharged) + 1;

                    let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown ? fastMove.cooldown / 1000 : 0.5); if(tFast > 10) tFast/=1000; if(tFast < 0.1) tFast = 0.5; tFast += 0.05;
                    let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown ? chargedMove.cooldown / 1000 : 2.0); if(tCharged > 10) tCharged/=1000; if(tCharged < 0.1) tCharged = 2.0; tCharged += 0.5;
                    
                    const enGain = Math.max(1, fastMove.energyGain || fastMove.energy || 6); const enCost = Math.abs(chargedMove.energyCost || chargedMove.energy || 50);
                    const bossEnCost = Math.abs(bCharged.energyCost || bCharged.energy || 50); const bossEnGain = bFast.energyGain || bFast.energy || 10;

                    // ⚙️ SIMULADOR DE CENÁRIOS (0 = Pior/Azar, 1 = Médio, 2 = Melhor/Sorte)
                    const simularCenario = (modo) => {
                        let delayFast = modo === 0 ? 1.5 : (modo === 1 ? 2.0 : 2.5);
                        let delayCharged = modo === 0 ? 2.0 : (modo === 1 ? 2.5 : 3.0);
                        // No melhor cenário (2), o Boss segura energia até o talo (100). No pior (0), solta na hora.
                        let energyThreshold = modo === 2 ? 100 : bossEnCost; 

                        let tBossFastTime = (parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0)) + delayFast;
                        let tBossChargedTime = (parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0)) + delayCharged;

                        let hpBoss = oponente.baseStats.hp; let hpAtual = attackerHPMax;
                        let energiaAtacante = 0; let energiaBoss = 0;
                        let relogio = 0; let proxAcaoAtacante = 0; let proxAcaoBoss = 1.0;
                        let mortesTotais = 0; let danoAos300s = 0; let hpRecorded = false; let limitadorInfinito = 0;

                        while (hpBoss > 0 && limitadorInfinito < 20000) {
                            limitadorInfinito++;
                            let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);
                            
                            if (!hpRecorded && proximoEvento >= tempoMaximoRaid) {
                                danoAos300s = oponente.baseStats.hp - hpBoss;
                                hpRecorded = true;
                            }

                            if (proximoEvento < relogio) proximoEvento = relogio;
                            relogio = proximoEvento;

                            if (relogio > 2000) { hpBoss = 0; break; }

                            if (hpAtual > 0 && relogio >= proxAcaoAtacante) {
                                let danoCausado = 0;
                                if (energiaAtacante >= enCost) { 
                                    danoCausado = Math.min(hpBoss, dmgCharged); energiaAtacante -= enCost; proxAcaoAtacante = relogio + tCharged; 
                                } else { 
                                    danoCausado = Math.min(hpBoss, dmgFast); energiaAtacante += enGain; proxAcaoAtacante = relogio + tFast; 
                                }
                                hpBoss -= danoCausado; energiaBoss += Math.ceil(danoCausado * 0.1); 
                                if (energiaAtacante > 100) energiaAtacante = 100; if (energiaBoss > 100) energiaBoss = 100;
                            }
                            else if (relogio >= proxAcaoBoss) {
                                if (energiaBoss >= energyThreshold) { 
                                    hpAtual -= dmgBossCharged; energiaBoss -= bossEnCost; proxAcaoBoss = relogio + tBossChargedTime; energiaAtacante += Math.ceil(dmgBossCharged * 0.5); 
                                } else { 
                                    hpAtual -= dmgBossFast; energiaBoss += bossEnGain; proxAcaoBoss = relogio + tBossFastTime; energiaAtacante += Math.ceil(dmgBossFast * 0.5); 
                                }
                                if (energiaAtacante > 100) energiaAtacante = 100;
                            }

                            if (hpAtual <= 0 && hpBoss > 0) {
                                mortesTotais++; hpAtual = attackerHPMax; energiaAtacante = 0; 
                                relogio += 1.0; proxAcaoAtacante = relogio + 0.5; proxAcaoBoss = Math.max(proxAcaoBoss, relogio); 
                                if (mortesTotais % 6 === 0) { relogio += 15; energiaBoss = 0; proxAcaoBoss = relogio + 2.0; proxAcaoAtacante = relogio + 0.5; }
                            }
                        }

                        if (!hpRecorded) danoAos300s = oponente.baseStats.hp;

                        const ttw = relogio; 
                        const dpsEfetivo = oponente.baseStats.hp / ttw; 
                        const estimador = ttw / tempoMaximoRaid;
                        const tdo = dpsEfetivo * (ttw / Math.max(1, mortesTotais));
                        const danoPerc = (danoAos300s / oponente.baseStats.hp) * 100;
                        const ER = Math.pow(Math.pow(dpsEfetivo, 3) * tdo, 0.25);

                        return { dpsEfetivo, danoPerc, mortesTotais, tdo, estimador, ttw, ER };
                    };

                    // Rodando as 3 possibilidades de destino!
                    let pior = simularCenario(0);
                    let medio = simularCenario(1);
                    let melhor = simularCenario(2);

                    combos.push({
                        f: fastMove.moveId.replace("_FAST", ""),
                        c: chargedMove.moveId,
                        
                        // Médias Oficiais (O que vai gerar o Rank)
                        d: parseFloat(medio.dpsEfetivo.toFixed(2)),
                        m: medio.mortesTotais,
                        e: parseFloat(medio.estimador.toFixed(2)),
                        dp: parseFloat(medio.danoPerc.toFixed(1)),
                        td: parseFloat(medio.tdo.toFixed(0)),
                        tw: parseFloat(medio.ttw.toFixed(1)),
                        er: parseFloat(medio.ER.toFixed(2)),

                        // Mínimos e Máximos (Sorte e Azar para o HTML)
                        d0: parseFloat(pior.dpsEfetivo.toFixed(2)),   // DPS no Pior Cenário
                        d1: parseFloat(melhor.dpsEfetivo.toFixed(2)), // DPS no Melhor Cenário
                        m0: melhor.mortesTotais,                      // Mortes na Sorte (Mínimo)
                        m1: pior.mortesTotais,                        // Mortes no Azar (Máximo)
                        e0: parseFloat(melhor.estimador.toFixed(2)),  // Estimador na Sorte (Menor)
                        e1: parseFloat(pior.estimador.toFixed(2)),    // Estimador no Azar (Maior)
                        td0: parseFloat(pior.tdo.toFixed(0)),
                        td1: parseFloat(melhor.tdo.toFixed(0))
                    });
                });
            });
        });
    });

    return combos.sort((a, b) => a.e - b.e); 
}

// 4. FUNÇÃO PRINCIPAL
async function gerarRankingEmMassa(bossesInput, tiersInput) {
    console.log("\n📥 [1/3] Baixando Banco de Dados...");
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged, resMoves] = await Promise.all([ fetch(URLS.MAIN_DATA).then(r => r.json()), fetch(URLS.MEGA_DATA).then(r => r.json()), fetch(URLS.GIGAMAX_DATA).then(r => r.json()), fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()), fetch(URLS.MOVES_GYM_FAST).then(r => r.json()), fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()), fetch(URLS.MOVE_DATA).then(r => r.json()) ]);

    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    GLOBAL_POKE_DB = { dadosEficacia: resEf, gymFastMap: new Map(resFast.map(m => [m.moveId, m])), gymChargedMap: new Map(resCharged.map(m => [m.moveId, m])), moveDataObjMap: new Map(resMoves.map(m => [m.moveId, m])) };

    console.log("🛡️ [2/3] Filtrando Elite (Ataque >= 200)...");
    const atacantesVIP = todosOsPokemons.filter(atacante => {
        if (!atacante || !atacante.baseStats || atacante.speciesName.includes("Purified") || atacante.speciesName === "Smeargle" || atacante.speciesName === "Ditto") return false;
        
        const atk50 = (atacante.baseStats.atk || 10) + 15;
        const def50 = (atacante.baseStats.def || 10) + 15;
        const hp50  = (atacante.baseStats.hp || 10) + 15;
        const maxCP = Math.floor((atk50 * Math.sqrt(def50) * Math.sqrt(hp50) * (0.8403 * 0.8403)) / 10);
        
        // 💎 REGRA ATUALIZADA: Ataque Base 200+ (Permite tanques e suportes úteis entrarem)
        return maxCP >= 2000 || atacante.baseStats.atk >= 200; 
    });

    console.log(`✅ Tudo pronto! Iniciando simulações Extremas com ${atacantesVIP.length} Pokémons.`);

    const raidConfigs = { "5": { hp: 15000, tempo: 300 }, "mega": { hp: 9000, tempo: 300 } };
    const listaBosses = bossesInput.split(",").map(b => b.trim()).filter(b => b !== "");
    let tiersToRun = ["5"]; if (typeof tiersInput === "string") tiersToRun = tiersInput.toLowerCase().split(/[\s,]+/).filter(t => t.trim() !== "");

    for (let i = 0; i < listaBosses.length; i++) {
        const bossName = listaBosses[i];
        const bossData = todosOsPokemons.find(p => p.speciesName.toLowerCase() === bossName.toLowerCase());
        if (!bossData) continue; 

        const nomeLimpoBoss = bossName.toLowerCase().replace(/ /g, "_");
        const fastBoss = (bossData.fastMoves && bossData.fastMoves.length > 0) ? bossData.fastMoves : ["TACKLE_FAST"];
        const chargedBoss = (bossData.chargedMoves && bossData.chargedMoves.length > 0) ? bossData.chargedMoves : ["STRUGGLE"];

        const cenariosDeLuta = [{ sufixoArquivo: "average", fastMoves: fastBoss, chargedMoves: chargedBoss }];
        fastBoss.forEach(fId => chargedBoss.forEach(cId => cenariosDeLuta.push({ sufixoArquivo: `${fId}_${cId}`.toLowerCase(), fastMoves: [fId], chargedMoves: [cId] })));

        for (const currentTier of tiersToRun) {
            const configRaid = raidConfigs[currentTier] || raidConfigs["5"];
            let dadosAgrupadosDoBoss = {};
            
            console.log(`\n========================================================`);
            console.log(`⚔️ [3/3] SIMULANDO: ${bossData.speciesName.toUpperCase()} (Tier ${currentTier})`);
            console.log(`========================================================`);

            for (let c = 0; c < cenariosDeLuta.length; c++) {
                const cenario = cenariosDeLuta[c];
                const nomeCurtoCenario = cenario.sufixoArquivo === "average" ? "Média" : cenario.sufixoArquivo;
                const oponenteRaid = { tipos: bossData.types || ["Normal"], baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: configRaid.hp }, fastMoves: cenario.fastMoves, chargedMoves: cenario.chargedMoves };

                let resultados = [];
                let pokesAnalisados = 0; const totalPokes = atacantesVIP.length; 

                atacantesVIP.forEach(atacante => {
                    pokesAnalisados++;
                    
                    if (pokesAnalisados % 10 === 0 || pokesAnalisados === totalPokes) { 
                        desenharBarra(pokesAnalisados, totalPokes, nomeCurtoCenario); 
                    }
                    
                    if (atacante.speciesId === bossData.speciesId) return;

                    const combos = calcularMelhoresCombos(atacante, oponenteRaid, configRaid.tempo);
                    if (combos.length > 0) {
                        combos.forEach(combo => {
                            resultados.push({ i: atacante.speciesId, n: atacante.speciesName, ...combo });
                        });
                    }
                });
                
                console.log();

                if (resultados.length > 0) {
                    const agrupadoPorPokemon = {};
                    resultados.forEach(combo => {
                        if (!agrupadoPorPokemon[combo.i]) { agrupadoPorPokemon[combo.i] = { i: combo.i, n: combo.n, melhorEst: 999, todosCombos: [] }; }
                        agrupadoPorPokemon[combo.i].todosCombos.push(combo);
                        if (combo.e < agrupadoPorPokemon[combo.i].melhorEst) { agrupadoPorPokemon[combo.i].melhorEst = combo.e; }
                    });

                    const rankingPokemons = Object.values(agrupadoPorPokemon).sort((a, b) => a.melhorEst - b.melhorEst);
                    const top30Pokemons = rankingPokemons.slice(0, 30);

                    let resultadosFinais = [];
                    top30Pokemons.forEach(poke => { resultadosFinais = resultadosFinais.concat(poke.todosCombos); });
                    resultadosFinais.sort((a, b) => a.e - b.e);
                    
                    dadosAgrupadosDoBoss[cenario.sufixoArquivo] = resultadosFinais;
                }
            }

            const nomeDoArquivo = `counters_${nomeLimpoBoss}_t${currentTier}.json`;
            const arquivoSaida = path.join(pastaDestino, nomeDoArquivo);
            fs.writeFileSync(arquivoSaida, JSON.stringify(dadosAgrupadosDoBoss)); 
            const tamanhoKB = (fs.statSync(arquivoSaida).size / 1024).toFixed(1);
            console.log(`\n✅ ARQUIVO 6.0 GERADO: ${nomeDoArquivo} (${tamanhoKB} KB)`);
        }
    }
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("====================================================");
console.log("🚀 GERADOR PVE 6.0 (MIN/MAX + SCORE GAMEPRESS) 🚀");
console.log("====================================================\n");
rl.question('🔥 Boss (Ex: Mewtwo): ', (b) => {
    rl.question('⚔️ Tier (Ex: 5): ', (t) => {
        rl.close(); gerarRankingEmMassa(b || "Mewtwo", t || "5");
    });
});