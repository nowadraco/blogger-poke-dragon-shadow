const fs = require('fs');
const path = require('path');

// 📁 PASTA 7: O FUNIL HÍBRIDO (FILTRO MOTOR 6 [500] + RNG 20X)
const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve7');
if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino, { recursive: true });
}

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

function desenharBarra(atual, total, icone, nomeFase) {
    const tamanhoBarra = 30; 
    const progresso = atual / total;
    const blocosPreenchidos = Math.round(tamanhoBarra * progresso);
    const barra = '█'.repeat(blocosPreenchidos) + '░'.repeat(tamanhoBarra - blocosPreenchidos);
    const pct = Math.floor(progresso * 100).toString().padStart(3, ' ');
    process.stdout.write(` ${icone} [${nomeFase.padEnd(16)}] [${barra}] ${pct}% | 🥊 ${atual}/${total}\r`);
}

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

// ====================================================================
// 🧠 O CÉREBRO DE COMBATE UNIFICADO (MOTOR 6.0 EMBUTIDO)
// ====================================================================
function instanciarCombate(atacante, oponente, fId, cId, tempoMaximoRaid) {
    const CPM = 0.7903; 
    const atkUser = ((atacante.baseStats.atk || 10) + 15) * CPM; const defUser = ((atacante.baseStats.def || 10) + 15) * CPM; const attackerHPMax = Math.floor(((atacante.baseStats.hp || 10) + 15) * CPM);
    const isShadow = atacante.speciesName.toLowerCase().includes("shadow"); const atkFinalUser = atkUser * (isShadow ? 1.2 : 1.0); const damageBonusMult = atacante.speciesName.toLowerCase().startsWith("mega ") ? 1.1 : 1.0;
    const atkBossReal = (oponente.baseStats.atk + 15) * CPM; const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM); const defUserFinal = isShadow ? defUser * 0.833 : defUser;
    
    const razaoDanoAtacante = atkFinalUser / defInimigoReal; const razaoDanoBoss = atkBossReal / defUserFinal;

    const fastMove = getMoveData(fId, true); const chargedMove = getMoveData(cId, false);
    const bFast = getMoveData(oponente.fastMoves[0], true); const bCharged = getMoveData(oponente.chargedMoves[0], false);
    if (!fastMove || !chargedMove || !bFast || !bCharged) return null;

    let mFast = atacante.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase()) ? 1.2 : 1.0; mFast *= getTypeEffectiveness(fastMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
    let mCharged = atacante.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase()) ? 1.2 : 1.0; mCharged *= getTypeEffectiveness(chargedMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
    let mBossFast = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bFast.type).toLowerCase()) ? 1.2 : 1.0; mBossFast *= getTypeEffectiveness(bFast.type, atacante.types, GLOBAL_POKE_DB.dadosEficacia);
    let mBossCharged = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bCharged.type).toLowerCase()) ? 1.2 : 1.0; mBossCharged *= getTypeEffectiveness(bCharged.type, atacante.types, GLOBAL_POKE_DB.dadosEficacia);

    const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDanoAtacante * mFast * damageBonusMult) + 1; const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDanoAtacante * mCharged * damageBonusMult) + 1;
    const dmgBossFast = Math.floor(0.5 * (bFast.power || 0) * razaoDanoBoss * mBossFast) + 1; const dmgBossCharged = Math.floor(0.5 * (bCharged.power || 0) * razaoDanoBoss * mBossCharged) + 1;

    let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown ? fastMove.cooldown / 1000 : 0.5); if(tFast > 10) tFast/=1000; if(tFast < 0.1) tFast = 0.5; tFast += 0.05;
    let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown ? chargedMove.cooldown / 1000 : 2.0); if(tCharged > 10) tCharged/=1000; if(tCharged < 0.1) tCharged = 2.0; tCharged += 0.5;
    
    const enGain = Math.max(1, fastMove.energyGain || fastMove.energy || 6); const enCost = Math.abs(chargedMove.energyCost || chargedMove.energy || 50);
    const bossEnCost = Math.abs(bCharged.energyCost || bCharged.energy || 50); const bossEnGain = bFast.energyGain || bFast.energy || 10;

    // Retorna uma função que pode ser chamada como Determinística (Motor 6) ou Caótica (RNG)
    return function simularCenario(determMode = 1, isRNG = false) {
        let delayFast = isRNG ? (1.5 + (Math.random() + Math.random()) / 2) : (determMode === 0 ? 1.5 : (determMode === 1 ? 2.0 : 2.5));
        let delayCharged = isRNG ? (1.5 + (Math.random() + Math.random()) / 2) : (determMode === 0 ? 2.0 : (determMode === 1 ? 2.5 : 3.0));
        let energyThreshold = isRNG ? bossEnCost : (determMode === 2 ? 100 : bossEnCost);

        let tBossFastTime = (parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0)) + delayFast;
        let tBossChargedTime = (parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0)) + delayCharged;

        let hpBoss = oponente.baseStats.hp; let hpAtual = attackerHPMax; let energiaAtacante = 0; let energiaBoss = 0;
        let relogio = 0; let proxAcaoAtacante = 0; let proxAcaoBoss = isRNG ? (1.5 + (Math.random() + Math.random()) / 2) : 1.0;
        let mortesTotais = 0; let danoAos300s = 0; let hpRecorded = false; let limitadorInfinito = 0;

        while (hpBoss > 0 && limitadorInfinito < 20000) {
            limitadorInfinito++;
            let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);
            if (!hpRecorded && proximoEvento >= tempoMaximoRaid) { danoAos300s = oponente.baseStats.hp - hpBoss; hpRecorded = true; }
            if (proximoEvento < relogio) proximoEvento = relogio;
            relogio = proximoEvento;

            if (relogio > 2000) { hpBoss = 0; break; }

            if (hpAtual > 0 && relogio >= proxAcaoAtacante) {
                let danoCausado = 0;
                if (energiaAtacante >= enCost) { danoCausado = Math.min(hpBoss, dmgCharged); energiaAtacante -= enCost; proxAcaoAtacante = relogio + tCharged; } 
                else { danoCausado = Math.min(hpBoss, dmgFast); energiaAtacante += enGain; proxAcaoAtacante = relogio + tFast; }
                hpBoss -= danoCausado; energiaBoss += Math.ceil(danoCausado * 0.1); 
                if (energiaAtacante > 100) energiaAtacante = 100; if (energiaBoss > 100) energiaBoss = 100;
            }
            else if (relogio >= proxAcaoBoss) {
                let usaCarregado = isRNG ? (energiaBoss >= bossEnCost && Math.random() < 0.5) : (energiaBoss >= energyThreshold);
                if (usaCarregado) { hpAtual -= dmgBossCharged; energiaBoss -= bossEnCost; proxAcaoBoss = relogio + tBossChargedTime; energiaAtacante += Math.ceil(dmgBossCharged * 0.5); } 
                else { hpAtual -= dmgBossFast; energiaBoss += bossEnGain; proxAcaoBoss = relogio + tBossFastTime; energiaAtacante += Math.ceil(dmgBossFast * 0.5); }
                if (energiaAtacante > 100) energiaAtacante = 100;
            }

            if (hpAtual <= 0 && hpBoss > 0) {
                mortesTotais++; hpAtual = attackerHPMax; energiaAtacante = 0; 
                relogio += 1.0; proxAcaoAtacante = relogio + 0.5; proxAcaoBoss = Math.max(proxAcaoBoss, relogio); 
                if (mortesTotais % 6 === 0) { relogio += 15; energiaBoss = 0; proxAcaoBoss = relogio + 2.0; proxAcaoAtacante = relogio + 0.5; }
            }
        }
        if (!hpRecorded) danoAos300s = oponente.baseStats.hp;

        const dps = oponente.baseStats.hp / relogio; 
        const tdo = dps * (relogio / Math.max(1, mortesTotais));
        return { dps, mortes: mortesTotais, tdo, estimador: relogio / tempoMaximoRaid, danoPerc: (danoAos300s / oponente.baseStats.hp) * 100, ttw: relogio, ER: Math.pow(Math.pow(dps, 3) * tdo, 0.25) };
    };
}

// 4. FUNÇÃO PRINCIPAL (FUNIL 7.0)
async function gerarRankingEmMassa(bossesInput, tiersInput) {
    console.log("\n📥 Baixando Banco de Dados...");
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged, resMoves] = await Promise.all([ fetch(URLS.MAIN_DATA).then(r => r.json()), fetch(URLS.MEGA_DATA).then(r => r.json()), fetch(URLS.GIGAMAX_DATA).then(r => r.json()), fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()), fetch(URLS.MOVES_GYM_FAST).then(r => r.json()), fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()), fetch(URLS.MOVE_DATA).then(r => r.json()) ]);
    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    GLOBAL_POKE_DB = { dadosEficacia: resEf, gymFastMap: new Map(resFast.map(m => [m.moveId, m])), gymChargedMap: new Map(resCharged.map(m => [m.moveId, m])), moveDataObjMap: new Map(resMoves.map(m => [m.moveId, m])) };

    const atacantesVIP = todosOsPokemons.filter(a => {
        if (!a || !a.baseStats || a.speciesName.includes("Purified") || a.speciesName === "Smeargle" || a.speciesName === "Ditto") return false;
        const maxCP = Math.floor((((a.baseStats.atk || 10) + 15) * Math.sqrt((a.baseStats.def || 10) + 15) * Math.sqrt((a.baseStats.hp || 10) + 15) * (0.8403 * 0.8403)) / 10);
        return maxCP >= 2000 || a.baseStats.atk >= 200; 
    });

    const raidConfigs = { "5": { hp: 15000, tempo: 300 }, "mega": { hp: 9000, tempo: 300 } };
    const listaBosses = bossesInput.split(",").map(b => b.trim()).filter(b => b !== "");
    let tiersToRun = ["5"]; if (typeof tiersInput === "string") tiersToRun = tiersInput.toLowerCase().split(/[\s,]+/).filter(t => t.trim() !== "");

    for (let i = 0; i < listaBosses.length; i++) {
        const bossData = todosOsPokemons.find(p => p.speciesName.toLowerCase() === listaBosses[i].toLowerCase());
        if (!bossData) continue; 
        const nomeLimpoBoss = bossData.speciesName.toLowerCase().replace(/ /g, "_");
        const fastBoss = (bossData.fastMoves && bossData.fastMoves.length > 0) ? bossData.fastMoves : ["TACKLE_FAST"];
        const chargedBoss = (bossData.chargedMoves && bossData.chargedMoves.length > 0) ? bossData.chargedMoves : ["STRUGGLE"];
        const cenariosDeLuta = [{ sufixoArquivo: "average", fastMoves: fastBoss, chargedMoves: chargedBoss }];
        fastBoss.forEach(fId => chargedBoss.forEach(cId => cenariosDeLuta.push({ sufixoArquivo: `${fId}_${cId}`.toLowerCase(), fastMoves: [fId], chargedMoves: [cId] })));

        for (const currentTier of tiersToRun) {
            const configRaid = raidConfigs[currentTier] || raidConfigs["5"];
            let dadosAgrupadosDoBoss = {};
            console.log(`\n========================================================`);
            console.log(`⚙️ MOTOR 7.0 (FILTRO 500 + RNG 20x): ${bossData.speciesName.toUpperCase()}`);
            console.log(`========================================================`);

            for (let c = 0; c < cenariosDeLuta.length; c++) {
                const cenario = cenariosDeLuta[c];
                const nomeCurtoCenario = cenario.sufixoArquivo === "average" ? "Média" : cenario.sufixoArquivo;
                const oponenteRaid = { tipos: bossData.types || ["Normal"], baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: configRaid.hp }, fastMoves: cenario.fastMoves, chargedMoves: cenario.chargedMoves };

                // ==============================================================
                // FASE 1: O MOTOR 6.0 COMO FILTRO DETERMINÍSTICO
                // ==============================================================
                let todosOsCombosDeterm = [];
                let contFase1 = 0;

                atacantesVIP.forEach(atacante => {
                    contFase1++;
                    if (contFase1 % 10 === 0 || contFase1 === atacantesVIP.length) desenharBarra(contFase1, atacantesVIP.length, '🔍', `Fase 1: Motor 6`);
                    if (atacante.speciesId === bossData.speciesId) return;

                    (atacante.fastMoves || []).forEach(fId => {
                        (atacante.chargedMoves || []).forEach(cId => {
                            const simular = instanciarCombate(atacante, oponenteRaid, fId, cId, configRaid.tempo);
                            if(simular) {
                                // Roda as 3 realidades fixas do Motor 6.0
                                let pior = simular(0, false);
                                let medio = simular(1, false);
                                let melhor = simular(2, false);

                                todosOsCombosDeterm.push({
                                    id: atacante.speciesId, name: atacante.speciesName, f: fId, c: cId, hash: `${atacante.speciesId}_${fId}_${cId}`,
                                    eMedio: medio.estimador, er: medio.ER, dp: medio.danoPerc, ttw: medio.ttw,
                                    dMax: melhor.dps, tdoMax: melhor.tdo, mMin: melhor.mortes
                                });
                            }
                        });
                    });
                });
                console.log(); 

                // ==============================================================
                // FASE 2: A PENEIRA DOS 500 (O FUNIL)
                // ==============================================================
                let combosAprovados = new Map();
                const limiteFiltro = 500; // Pegando os 500 de Elite

                const adicionarAprovados = (listaOrdenada) => {
                    listaOrdenada.slice(0, limiteFiltro).forEach(combo => combosAprovados.set(combo.hash, combo));
                };

                // Cria o time VIP combinando os 500 melhores de cada modalidade do Motor 6
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => a.eMedio - b.eMedio)); // Velocidade
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => b.er - a.er));         // Score Geral
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => b.dMax - a.dMax));     // Dano Bruto
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => b.dp - a.dp));         // Dano 300s
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => b.tdoMax - a.tdoMax)); // Resistencia
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => a.ttw - b.ttw));       // TTW
                adicionarAprovados([...todosOsCombosDeterm].sort((a, b) => a.mMin - b.mMin));     // Tanques

                const listaFinalParaRNG = Array.from(combosAprovados.values());

                // ==============================================================
                // FASE 3: MONTE CARLO 20X NOS APROVADOS
                // ==============================================================
                let resultadosRNG = [];
                let contFase3 = 0;

                listaFinalParaRNG.forEach(combo => {
                    contFase3++;
                    if (contFase3 % 5 === 0 || contFase3 === listaFinalParaRNG.length) desenharBarra(contFase3, listaFinalParaRNG.length, '🎲', `Fase 2: RNG 20x`);

                    const atacanteObj = atacantesVIP.find(p => p.speciesId === combo.id);
                    if(atacanteObj) {
                        const simular = instanciarCombate(atacanteObj, oponenteRaid, combo.f, combo.c, configRaid.tempo);
                        if(simular) {
                            let sumDPS = 0, sumTDO = 0, sumEst = 0, sumMortes = 0, sumDP = 0, sumTTW = 0;
                            let minDps = 999, maxDps = 0, minMortes = 999, maxMortes = 0, minEst = 999, maxEst = 0, minTdo = 999, maxTdo = 0;

                            for(let i=0; i<20; i++){
                                let r = simular(1, true); // true = Aciona a Inteligência RNG (Sorte/Azar)
                                sumDPS += r.dps; sumTDO += r.tdo; sumEst += r.estimador; sumMortes += r.mortes; sumDP += r.danoPerc; sumTTW += r.ttw;
                                if(r.dps < minDps) minDps = r.dps; if(r.dps > maxDps) maxDps = r.dps;
                                if(r.mortes < minMortes) minMortes = r.mortes; if(r.mortes > maxMortes) maxMortes = r.mortes;
                                if(r.estimador < minEst) minEst = r.estimador; if(r.estimador > maxEst) maxEst = r.estimador;
                                if(r.tdo < minTdo) minTdo = r.tdo; if(r.tdo > maxTdo) maxTdo = r.tdo;
                            }

                            let dpsM = sumDPS/20; let tdoM = sumTDO/20;
                            resultadosRNG.push({
                                i: atacanteObj.speciesId, n: atacanteObj.speciesName, f: combo.f.replace("_FAST", ""), c: combo.c,
                                d: parseFloat(dpsM.toFixed(2)), d0: parseFloat(minDps.toFixed(2)), d1: parseFloat(maxDps.toFixed(2)),
                                dp: parseFloat((sumDP/20).toFixed(1)),
                                m: Math.round(sumMortes/20), m0: minMortes, m1: maxMortes,
                                td: parseFloat(tdoM.toFixed(0)), td0: parseFloat(minTdo.toFixed(0)), td1: parseFloat(maxTdo.toFixed(0)),
                                e: parseFloat((sumEst/20).toFixed(2)), e0: parseFloat(minEst.toFixed(2)), e1: parseFloat(maxEst.toFixed(2)),
                                tw: parseFloat((sumTTW/20).toFixed(1)),
                                er: parseFloat(Math.pow(Math.pow(dpsM, 3) * tdoM, 0.25).toFixed(2))
                            });
                        }
                    }
                });
                console.log();

                const agrupado = {};
                resultadosRNG.forEach(c => {
                    if (!agrupado[c.i]) { agrupado[c.i] = { i: c.i, n: c.n, melhorEst: 999, combos: [] }; }
                    agrupado[c.i].combos.push(c);
                    if (c.e < agrupado[c.i].melhorEst) { agrupado[c.i].melhorEst = c.e; }
                });

                const top30 = Object.values(agrupado).sort((a, b) => a.melhorEst - b.melhorEst).slice(0, 30);
                let jsonGaveta = [];
                top30.forEach(p => { jsonGaveta = jsonGaveta.concat(p.combos); });
                jsonGaveta.sort((a, b) => a.e - b.e);
                
                dadosAgrupadosDoBoss[cenario.sufixoArquivo] = jsonGaveta;
            }

            const nomeDoArquivo = `counters_${nomeLimpoBoss}_t${currentTier}.json`;
            const arquivoSaida = path.join(pastaDestino, nomeDoArquivo);
            fs.writeFileSync(arquivoSaida, JSON.stringify(dadosAgrupadosDoBoss)); 
            const tamanhoKB = (fs.statSync(arquivoSaida).size / 1024).toFixed(1);
            console.log(`\n✅ ARQUIVO 7.0 GERADO: ${nomeDoArquivo} (${tamanhoKB} KB)`);
        }
    }
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("====================================================");
console.log("🚀 GERADOR PVE 7.0 (FILTRO 500 + MONTE CARLO 20x) 🚀");
console.log("====================================================\n");
rl.question('🔥 Boss (Ex: Mewtwo): ', (b) => {
    rl.question('⚔️ Tier (Ex: 5): ', (t) => {
        rl.close(); gerarRankingEmMassa(b || "Mewtwo", t || "5");
    });
});