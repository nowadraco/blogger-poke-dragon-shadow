const fs = require('fs');
const path = require('path');

// 📁 PASTA 5: O MOTOR HÍBRIDO (DETERMINÍSTICO + MONTE CARLO)
const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve5');
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

// 📊 FUNÇÃO PARA DESENHAR A BARRA DE PROGRESSO NO TERMINAL
function desenharBarra(atual, total, icone, nomeFase) {
    const tamanhoBarra = 25;
    const progresso = atual / total;
    const blocosPreenchidos = Math.round(tamanhoBarra * progresso);
    const barra = '█'.repeat(blocosPreenchidos) + '░'.repeat(tamanhoBarra - blocosPreenchidos);
    const pct = Math.floor(progresso * 100).toString().padStart(3, ' ');
    
    process.stdout.write(`    ${icone} ${nomeFase.padEnd(16)} [${barra}] ${pct}% | 🥊 ${atual}/${total} Pokes\r`);
}

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

// =====================================================================
// 🧠 CÉREBRO 1: FILTRO DETERMINÍSTICO (RÁPIDO E EXATO)
// =====================================================================
function calcularDanoFiltro(pokemon, oponente, tempoMaximoRaid = 300) {
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

    const combos = [];
    (pokemon.fastMoves || []).forEach(fastId => {
        const fastMove = getMoveData(fastId, true);
        if (!fastMove) return;
        (pokemon.chargedMoves || []).forEach(chargedId => {
            const chargedMove = getMoveData(chargedId, false);
            if (!chargedMove) return;

            let somaDanoTotalGeral = 0; let simulacoesValidas = 0;

            oponente.fastMoves.forEach(bossFastId => {
                const bFast = getMoveData(bossFastId, true);
                if (!bFast) return;
                oponente.chargedMoves.forEach(bossChargedId => {
                    const bCharged = getMoveData(bossChargedId, false);
                    if (!bCharged) return;

                    let mFast = pokemon.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase()) ? 1.2 : 1.0; mFast *= getTypeEffectiveness(fastMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    let mCharged = pokemon.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase()) ? 1.2 : 1.0; mCharged *= getTypeEffectiveness(chargedMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    let mBossFast = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bFast.type).toLowerCase()) ? 1.2 : 1.0; mBossFast *= getTypeEffectiveness(bFast.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);
                    let mBossCharged = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bCharged.type).toLowerCase()) ? 1.2 : 1.0; mBossCharged *= getTypeEffectiveness(bCharged.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDanoAtacante * mFast * damageBonusMult) + 1;
                    const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDanoAtacante * mCharged * damageBonusMult) + 1;
                    const dmgBossFast = Math.floor(0.5 * (bFast.power || 0) * razaoDanoBoss * mBossFast) + 1;
                    const dmgBossCharged = Math.floor(0.5 * (bCharged.power || 0) * razaoDanoBoss * mBossCharged) + 1;

                    let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown ? fastMove.cooldown / 1000 : 0.5); if(tFast > 10) tFast/=1000; if(tFast < 0.1) tFast = 0.5;
                    let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown ? chargedMove.cooldown / 1000 : 2.0); if(tCharged > 10) tCharged/=1000; if(tCharged < 0.1) tCharged = 2.0;
                    let tBossFastBase = parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0);
                    let tBossChargedBase = parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0);

                    const enGain = Math.max(1, fastMove.energyGain || fastMove.energy || 6); const enCost = Math.abs(chargedMove.energyCost || chargedMove.energy || 50);
                    const bossEnCost = Math.abs(bCharged.energyCost || bCharged.energy || 50); const bossEnGain = bFast.energyGain || bFast.energy || 10;

                    let somaDanoDesteCenario = 0;
                    const delaysFixos = [1.5, 2.0, 2.5]; // ⬅️ AS 3 REALIDADES ABSOLUTAS!

                    for (let luta = 0; luta < delaysFixos.length; luta++) {
                        let hpBoss = oponente.baseStats.hp; let hpAtual = attackerHPMax; let energiaAtacante = 0; let energiaBoss = 0;
                        let relogio = 0; let proxAcaoAtacante = 0; let proxAcaoBoss = delaysFixos[luta]; 
                        let mortesTotais = 0; let limitadorInfinito = 0;

                        while (hpBoss > 0 && limitadorInfinito < 15000) {
                            limitadorInfinito++;
                            let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);
                            if (proximoEvento < relogio) proximoEvento = relogio; relogio = proximoEvento;
                            if (relogio > 1500) { hpBoss = 0; break; }
                            
                            if (hpAtual > 0 && relogio >= proxAcaoAtacante) {
                                let danoCausado = 0;
                                if (energiaAtacante >= enCost) { danoCausado = Math.min(hpBoss, dmgCharged); energiaAtacante -= enCost; proxAcaoAtacante = relogio + tCharged; } 
                                else { danoCausado = Math.min(hpBoss, dmgFast); energiaAtacante += enGain; proxAcaoAtacante = relogio + tFast; }
                                hpBoss -= danoCausado; energiaBoss += Math.ceil(danoCausado * 0.1);
                                if (energiaAtacante > 100) energiaAtacante = 100; if (energiaBoss > 100) energiaBoss = 100;
                            }
                            else if (relogio >= proxAcaoBoss) {
                                let usaCarregado = (energiaBoss >= bossEnCost); // O Robô sempre usa especial
                                const delayAtual = delaysFixos[luta]; 

                                if (usaCarregado) { hpAtual -= dmgBossCharged; energiaBoss -= bossEnCost; proxAcaoBoss = relogio + tBossChargedBase + delayAtual; energiaAtacante += Math.ceil(dmgBossCharged * 0.5); } 
                                else { hpAtual -= dmgBossFast; energiaBoss += bossEnGain; proxAcaoBoss = relogio + tBossFastBase + delayAtual; energiaAtacante += Math.ceil(dmgBossFast * 0.5); }
                                if (energiaAtacante > 100) energiaAtacante = 100;
                            }
                            if (hpAtual <= 0 && hpBoss > 0) {
                                mortesTotais++; hpAtual = attackerHPMax; energiaAtacante = 0; 
                                relogio += 2.0; proxAcaoAtacante = relogio + 0.5; proxAcaoBoss = Math.max(proxAcaoBoss, relogio); 
                                if (mortesTotais % 6 === 0) { relogio += 15; energiaBoss = 0; proxAcaoBoss = relogio + 2.0; proxAcaoAtacante = relogio + 0.5; }
                            }
                        }
                        const ttwLuta = relogio; const tempoNaRaid = Math.min(ttwLuta, tempoMaximoRaid);
                        somaDanoDesteCenario += tempoNaRaid > 0 ? ((oponente.baseStats.hp - hpBoss) / tempoNaRaid) : 0; // ⬅️ CORRIGIDO AQUI!
                    }
                    somaDanoTotalGeral += (somaDanoDesteCenario / delaysFixos.length);
                    simulacoesValidas++;
                });
            });
            if (simulacoesValidas > 0) combos.push({ dmgPerc: somaDanoTotalGeral / simulacoesValidas });
        });
    });
    return combos.sort((a, b) => b.dmgPerc - a.dmgPerc); 
}

// =====================================================================
// 🎲 CÉREBRO 2: MOTOR MONTE CARLO COM CURVA DE SINO
// =====================================================================
function calcularMelhoresCombosRNG(pokemon, oponente, tempoMaximoRaid = 300, numLutasRNG = 50) {
    if (!pokemon || !pokemon.baseStats || !oponente.fastMoves || !oponente.chargedMoves) return [];
    const CPM = 0.7903; 
    const atkUser = ((pokemon.baseStats.atk || 10) + 15) * CPM; const defUser = ((pokemon.baseStats.def || 10) + 15) * CPM; const attackerHPMax = Math.floor(((pokemon.baseStats.hp || 10) + 15) * CPM);
    const isShadow = pokemon.speciesName.toLowerCase().includes("shadow"); const atkFinalUser = atkUser * (isShadow ? 1.2 : 1.0); const damageBonusMult = pokemon.speciesName.toLowerCase().startsWith("mega ") ? 1.1 : 1.0;
    const atkBossReal = (oponente.baseStats.atk + 15) * CPM; const defInimigoReal = Math.max(1, (oponente.baseStats.def + 15) * CPM); const defUserFinal = isShadow ? defUser * 0.833 : defUser;
    const razaoDanoAtacante = atkFinalUser / defInimigoReal; const razaoDanoBoss = atkBossReal / defUserFinal;

    const combos = [];
    (pokemon.fastMoves || []).forEach(fastId => {
        const fastMove = getMoveData(fastId, true); if (!fastMove) return;
        (pokemon.chargedMoves || []).forEach(chargedId => {
            const chargedMove = getMoveData(chargedId, false); if (!chargedMove) return;

            let somaDpsGeral = 0; let somaTdoGeral = 0; let somaEstimador = 0; let somaDanoTotalGeral = 0; let simulacoesValidas = 0;
            let dpsMin = 9999, dpsMax = 0; let mortesMin = 9999, mortesMax = 0;

            oponente.fastMoves.forEach(bossFastId => {
                const bFast = getMoveData(bossFastId, true); if (!bFast) return;
                oponente.chargedMoves.forEach(bossChargedId => {
                    const bCharged = getMoveData(bossChargedId, false); if (!bCharged) return;

                    let mFast = pokemon.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase()) ? 1.2 : 1.0; mFast *= getTypeEffectiveness(fastMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    let mCharged = pokemon.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase()) ? 1.2 : 1.0; mCharged *= getTypeEffectiveness(chargedMove.type, oponente.tipos, GLOBAL_POKE_DB.dadosEficacia);
                    let mBossFast = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bFast.type).toLowerCase()) ? 1.2 : 1.0; mBossFast *= getTypeEffectiveness(bFast.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);
                    let mBossCharged = oponente.tipos.some(t => t && String(t).toLowerCase() === String(bCharged.type).toLowerCase()) ? 1.2 : 1.0; mBossCharged *= getTypeEffectiveness(bCharged.type, pokemon.types, GLOBAL_POKE_DB.dadosEficacia);

                    const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDanoAtacante * mFast * damageBonusMult) + 1; const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDanoAtacante * mCharged * damageBonusMult) + 1;
                    const dmgBossFast = Math.floor(0.5 * (bFast.power || 0) * razaoDanoBoss * mBossFast) + 1; const dmgBossCharged = Math.floor(0.5 * (bCharged.power || 0) * razaoDanoBoss * mBossCharged) + 1;

                    let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown ? fastMove.cooldown / 1000 : 0.5); if(tFast > 10) tFast/=1000; if(tFast < 0.1) tFast = 0.5;
                    let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown ? chargedMove.cooldown / 1000 : 2.0); if(tCharged > 10) tCharged/=1000; if(tCharged < 0.1) tCharged = 2.0;
                    let tBossFastBase = parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0); let tBossChargedBase = parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0);

                    const enGain = Math.max(1, fastMove.energyGain || fastMove.energy || 6); const enCost = Math.abs(chargedMove.energyCost || chargedMove.energy || 50);
                    const bossEnCost = Math.abs(bCharged.energyCost || bCharged.energy || 50); const bossEnGain = bFast.energyGain || bFast.energy || 10;

                    let somaDpsDesteCenario = 0; let somaMortesDesteCenario = 0; let somaTdoDesteCenario = 0;
                    let cenarioDpsMax = 0; let cenarioDpsMin = 9999;

                    for (let luta = 0; luta < numLutasRNG; luta++) {
                        let hpBoss = oponente.baseStats.hp; let hpAtual = attackerHPMax; let energiaAtacante = 0; let energiaBoss = 0;
                        let relogio = 0; let proxAcaoAtacante = 0; 
                        
                        // 🎲 CURVA DE SINO (Peso no 2.0s)
                        let proxAcaoBoss = 1.5 + ((Math.random() + Math.random()) / 2); 
                        
                        let mortesTotais = 0; let danoTotalDaLuta = 0; let limitadorInfinito = 0;

                        while (hpBoss > 0 && limitadorInfinito < 15000) {
                            limitadorInfinito++; let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);
                            if (proximoEvento < relogio) proximoEvento = relogio; relogio = proximoEvento;
                            if (relogio > 1500) { hpBoss = 0; break; }
                            
                            if (hpAtual > 0 && relogio >= proxAcaoAtacante) {
                                let danoCausado = 0;
                                if (energiaAtacante >= enCost) { danoCausado = Math.min(hpBoss, dmgCharged); energiaAtacante -= enCost; proxAcaoAtacante = relogio + tCharged; } 
                                else { danoCausado = Math.min(hpBoss, dmgFast); energiaAtacante += enGain; proxAcaoAtacante = relogio + tFast; }
                                hpBoss -= danoCausado; energiaBoss += Math.ceil(danoCausado * 0.1); 
                                if (energiaAtacante > 100) energiaAtacante = 100; if (energiaBoss > 100) energiaBoss = 100;
                            }
                            else if (relogio >= proxAcaoBoss) {
                                let usaCarregado = false;
                                if (energiaBoss >= bossEnCost && Math.random() < 0.5) usaCarregado = true;
                                
                                // 🎲 CURVA DE SINO
                                const delayRNG = 1.5 + ((Math.random() + Math.random()) / 2);

                                if (usaCarregado) { hpAtual -= dmgBossCharged; energiaBoss -= bossEnCost; proxAcaoBoss = relogio + tBossChargedBase + delayRNG; energiaAtacante += Math.ceil(dmgBossCharged * 0.5); } 
                                else { hpAtual -= dmgBossFast; energiaBoss += bossEnGain; proxAcaoBoss = relogio + tBossFastBase + delayRNG; energiaAtacante += Math.ceil(dmgBossFast * 0.5); }
                                if (energiaAtacante > 100) energiaAtacante = 100;
                            }
                            if (relogio <= tempoMaximoRaid) { danoTotalDaLuta = oponente.baseStats.hp - hpBoss; }
                            if (hpAtual <= 0 && hpBoss > 0) {
                                mortesTotais++; hpAtual = attackerHPMax; energiaAtacante = 0; 
                                relogio += 2.0; proxAcaoAtacante = relogio + 0.5; proxAcaoBoss = Math.max(proxAcaoBoss, relogio); 
                                if (mortesTotais % 6 === 0) { relogio += 15; energiaBoss = 0; proxAcaoBoss = relogio + 2.0; proxAcaoAtacante = relogio + 0.5; }
                            }
                        }
                        if (relogio <= tempoMaximoRaid) { danoTotalDaLuta = oponente.baseStats.hp; }
                        const ttwLuta = relogio; const tempoNaRaid = Math.min(ttwLuta, tempoMaximoRaid);
                        const dpsDaLuta = tempoNaRaid > 0 ? (danoTotalDaLuta / tempoNaRaid) : 0; 
                        const mortesDaLuta = ttwLuta > 0 ? (mortesTotais / ttwLuta) * tempoMaximoRaid : 0;
                        const tdoDaLuta = dpsDaLuta * (ttwLuta / Math.max(1, mortesTotais));

                        somaDpsDesteCenario += dpsDaLuta; somaMortesDesteCenario += mortesDaLuta; somaTdoDesteCenario += tdoDaLuta;
                        if (dpsDaLuta > cenarioDpsMax) cenarioDpsMax = dpsDaLuta; if (dpsDaLuta < cenarioDpsMin) cenarioDpsMin = dpsDaLuta;
                    }
                    const dpsMedioDoCenario = somaDpsDesteCenario / numLutasRNG; const mortesMedioDoCenario = somaMortesDesteCenario / numLutasRNG; const tdoMedioDoCenario = somaTdoDesteCenario / numLutasRNG;
                    const ttwMedio = (oponente.baseStats.hp / Math.max(0.1, dpsMedioDoCenario)) + (mortesMedioDoCenario * 2) + (Math.floor(mortesMedioDoCenario/6) * 15);
                    const estimadorMedio = ttwMedio / tempoMaximoRaid; const danoNoTempoLimpo = Math.min(oponente.baseStats.hp, dpsMedioDoCenario * tempoMaximoRaid);

                    somaDpsGeral += dpsMedioDoCenario; somaTdoGeral += tdoMedioDoCenario; somaDanoTotalGeral += danoNoTempoLimpo; somaEstimador += estimadorMedio; simulacoesValidas++;
                    if (dpsMedioDoCenario < dpsMin) dpsMin = dpsMedioDoCenario; if (dpsMedioDoCenario > dpsMax) dpsMax = dpsMedioDoCenario;
                    if (mortesMedioDoCenario < mortesMin) mortesMin = mortesMedioDoCenario; if (mortesMedioDoCenario > mortesMax) mortesMax = mortesMedioDoCenario;
                });
            });
            if (simulacoesValidas > 0) {
                const dpsMedioFinal = somaDpsGeral / simulacoesValidas; const danoTotalMedioFinal = somaDanoTotalGeral / simulacoesValidas; const danoPerc = (danoTotalMedioFinal / oponente.baseStats.hp) * 100; 
                combos.push({
                    id: pokemon.speciesId, name: pokemon.speciesName, f: fastMove.moveId, c: chargedMove.moveId,
                    dps: parseFloat(dpsMedioFinal.toFixed(1)), dpsMin: parseFloat(dpsMin.toFixed(1)), dpsMax: parseFloat(dpsMax.toFixed(1)),
                    dmgPerc: Math.min(100, parseFloat(danoPerc.toFixed(1))), deathsMin: Math.floor(mortesMin), deathsMax: Math.ceil(mortesMax),
                    tdo: parseFloat((somaTdoGeral / simulacoesValidas).toFixed(0)), est: parseFloat((somaEstimador / simulacoesValidas).toFixed(2))
                });
            }
        });
    });
    return combos.sort((a, b) => b.dmgPerc - a.dmgPerc); 
}

// =====================================================================
// 5. FUNÇÃO PRINCIPAL HÍBRIDA
// =====================================================================
async function gerarRankingEmMassa(bossesInput, tiersInput) {
    console.log("📥 Baixando banco de dados...");
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged, resMoves] = await Promise.all([ fetch(URLS.MAIN_DATA).then(r => r.json()), fetch(URLS.MEGA_DATA).then(r => r.json()), fetch(URLS.GIGAMAX_DATA).then(r => r.json()), fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()), fetch(URLS.MOVES_GYM_FAST).then(r => r.json()), fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()), fetch(URLS.MOVE_DATA).then(r => r.json()) ]);
    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    
    GLOBAL_POKE_DB = { dadosEficacia: resEf, gymFastMap: new Map(resFast.map(m => [m.moveId, m])), gymChargedMap: new Map(resCharged.map(m => [m.moveId, m])), moveDataObjMap: new Map(resMoves.map(m => [m.moveId, m])) };

    const atacantesVIP = todosOsPokemons.filter(atacante => {
        if (!atacante || !atacante.baseStats || atacante.speciesName.includes("Purified") || atacante.speciesName === "Smeargle" || atacante.speciesName === "Ditto") return false;
        const maxCP = Math.floor((((atacante.baseStats.atk || 10) + 15) * Math.sqrt((atacante.baseStats.def || 10) + 15) * Math.sqrt((atacante.baseStats.hp || 10) + 15) * (0.8403 * 0.8403)) / 10);
        return maxCP >= 2000 || atacante.baseStats.atk >= 250; 
    });

    const raidConfigs = { "5": { hp: 15000, tempo: 300 } }; 
    const listaBosses = bossesInput.split(",").map(b => b.trim()).filter(b => b !== "");
    let tiersToRun = ["5"]; if (typeof tiersInput === "string") tiersToRun = tiersInput.toLowerCase().split(/[\s,]+/).filter(t => t.trim() !== "");

    // 🌪️ A ESTRUTURA DO FUNIL HÍBRIDO!
    const estagiosDoFunil = [
        { tipo: 'filtro_rapido', manter: 300 },          // Etapa 1: Joga os ~1000 pokes no determinístico
        { tipo: 'monte_carlo', lutas: 50, manter: 100 }, // Etapa 2: Acha médias da Elite
        { tipo: 'monte_carlo', lutas: 300, manter: 40 }, // Etapa 3: Refina
        { tipo: 'monte_carlo', lutas: 500, manter: 30 }  // Etapa 4: Verdade Absoluta
    ];

    for (let i = 0; i < listaBosses.length; i++) {
        const bossData = todosOsPokemons.find(p => p.speciesName.toLowerCase() === listaBosses[i].toLowerCase());
        if (!bossData) continue; 

        const fastBoss = (bossData.fastMoves && bossData.fastMoves.length > 0) ? bossData.fastMoves : ["TACKLE_FAST"];
        const chargedBoss = (bossData.chargedMoves && bossData.chargedMoves.length > 0) ? bossData.chargedMoves : ["STRUGGLE"];
        const cenariosDeLuta = [{ sufixoArquivo: "average", nomeExibicao: "Média", fastMoves: fastBoss, chargedMoves: chargedBoss }];
        fastBoss.forEach(fId => chargedBoss.forEach(cId => cenariosDeLuta.push({ sufixoArquivo: `${fId}_${cId}`.toLowerCase(), fastMoves: [fId], chargedMoves: [cId] })));

        for (const currentTier of tiersToRun) {
            const configRaid = raidConfigs[currentTier] || raidConfigs["5"];
            let dadosAgrupadosDoBoss = {};

            console.log(`\n=============================================================`);
            console.log(`⚔️ INICIANDO O HÍBRIDO PARA: ${bossData.speciesName.toUpperCase()} (Tier ${currentTier})`);
            console.log(`=============================================================`);

            for (let c = 0; c < cenariosDeLuta.length; c++) {
                const cenario = cenariosDeLuta[c];
                console.log(`\n ⚙️ Cenário [${c+1}/${cenariosDeLuta.length}]: ${cenario.sufixoArquivo}`);
                const oponenteRaid = { tipos: bossData.types || ["Normal"], baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: configRaid.hp }, fastMoves: cenario.fastMoves, chargedMoves: cenario.chargedMoves };

                let atacantesAtuais = [...atacantesVIP];
                let resultadosFinaisDesteCenario = [];

                for (let etapa = 0; etapa < estagiosDoFunil.length; etapa++) {
                    const regra = estagiosDoFunil[etapa];
                    let resultadosDestaEtapa = [];
                    const totalPokesEtapa = atacantesAtuais.length;
                    
                    const iconeAtivo = regra.tipo === 'filtro_rapido' ? '⚡' : '🌪️';
                    const nomeFase = regra.tipo === 'filtro_rapido' ? 'Filtro Exato' : `RNG (${regra.lutas}x)`;
                    
                    for (let poke = 0; poke < totalPokesEtapa; poke++) {
                        
                        // ATUALIZADOR VISUAL DA BARRA A CADA X POKÉMONS
                        if ((poke + 1) % Math.max(1, Math.floor(totalPokesEtapa / 30)) === 0 || poke === totalPokesEtapa - 1) {
                            desenharBarra(poke + 1, totalPokesEtapa, iconeAtivo, nomeFase);
                        }

                        const atacante = atacantesAtuais[poke];
                        if (atacante.speciesId === bossData.speciesId) continue;
                        
                        let combos = [];
                        if (regra.tipo === 'filtro_rapido') {
                            combos = calcularDanoFiltro(atacante, oponenteRaid, configRaid.tempo);
                        } else {
                            combos = calcularMelhoresCombosRNG(atacante, oponenteRaid, configRaid.tempo, regra.lutas);
                        }

                        if (combos.length > 0) {
                            resultadosDestaEtapa.push({ pokemon: atacante, melhorDano: combos[0].dmgPerc, todosCombos: combos });
                        }
                    }
                    console.log(); // Quebra de linha da barra

                    resultadosDestaEtapa.sort((a, b) => b.melhorDano - a.melhorDano);
                    const sobreviventes = resultadosDestaEtapa.slice(0, regra.manter);

                    if (etapa === estagiosDoFunil.length - 1) {
                        sobreviventes.forEach(s => resultadosFinaisDesteCenario = resultadosFinaisDesteCenario.concat(s.todosCombos));
                        resultadosFinaisDesteCenario.sort((a, b) => b.dmgPerc - a.dmgPerc);
                        dadosAgrupadosDoBoss[cenario.sufixoArquivo] = resultadosFinaisDesteCenario;
                        console.log(`    🏆 Estágio Final concluído! Salvando os Top ${regra.manter}.`);
                    } else {
                        atacantesAtuais = sobreviventes.map(s => s.pokemon);
                        console.log(`    ✂️  Corte Aplicado: Sobreviveram os ${atacantesAtuais.length} melhores.`);
                    }
                }
            }
            const nomeDoArquivoUnico = `counters_${bossData.speciesName.toLowerCase().replace(/ /g, "_")}_t${currentTier}.json`;
            const arquivoSaida = path.join(pastaDestino, nomeDoArquivoUnico);
            fs.writeFileSync(arquivoSaida, JSON.stringify(dadosAgrupadosDoBoss, null, 4)); 
            console.log(`\n✅ ARQUIVO HÍBRIDO 5.0 SALVO COM SUCESSO! ${nomeDoArquivoUnico}`);
        }
    }
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("====================================================");
console.log("🚀 GERADOR PVE HÍBRIDO 5.0 (DETERMINÍSTICO + RNG) 🚀");
console.log("====================================================\n");
rl.question('🔥 Qual Boss você quer simular? (Deixe vazio para Mewtwo): ', (bossAnswer) => {
    rl.question('⚔️ Qual o Tier da Reide? (Padrão 5): ', (tierAnswer) => {
        rl.close(); gerarRankingEmMassa(bossAnswer || "Mewtwo", tierAnswer || "5");
    });
});