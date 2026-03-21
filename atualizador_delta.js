const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 📁 ONDE ESTÃO OS ARQUIVOS QUE VAMOS ATUALIZAR
const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve10');

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

// ====================================================================
// 🧠 MATEMÁTICA E LÓGICA DO MOTOR 10.0 (CÓPIA EXATA)
// ====================================================================
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

    return function simularCenario(determMode = 1, isRNG = false) {
        let delayFast = isRNG ? (1.5 + (Math.random() + Math.random()) / 2) : (determMode === 0 ? 1.5 : (determMode === 1 ? 2.0 : 2.5));
        let delayCharged = isRNG ? (1.5 + (Math.random() + Math.random()) / 2) : (determMode === 0 ? 2.0 : (determMode === 1 ? 2.5 : 3.0));
        let energyThreshold = isRNG ? bossEnCost : (determMode === 2 ? 100 : bossEnCost);

        let tBossFastTime = (parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0)) + delayFast;
        let tBossChargedTime = (parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0)) + delayCharged;

        let hpBoss = oponente.baseStats.hp; let hpAtual = attackerHPMax; let energiaAtacante = 0; let energiaBoss = 0;
        let relogio = 0; let proxAcaoAtacante = 0; let proxAcaoBoss = isRNG ? (1.5 + (Math.random() + Math.random()) / 2) : 1.0;
        let mortesTotais = 0; let danoAos300s = 0; let hpRecorded = false; let limitadorInfinito = 0;
        let countBossCharged = 0;

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
                if (usaCarregado) { 
                    hpAtual -= dmgBossCharged; energiaBoss -= bossEnCost; proxAcaoBoss = relogio + tBossChargedTime; energiaAtacante += Math.ceil(dmgBossCharged * 0.5); countBossCharged++; 
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

        const dps = oponente.baseStats.hp / relogio; 
        const tdo = dps * (relogio / Math.max(1, mortesTotais));
        return { 
            dps, mortes: mortesTotais, tdo, estimador: relogio / tempoMaximoRaid, 
            danoPerc: (danoAos300s / oponente.baseStats.hp) * 100, ttw: relogio, 
            ER: Math.pow(Math.pow(dps, 3) * tdo, 0.25), bossUsesC: countBossCharged, bossDmgPerc: (dmgBossCharged / attackerHPMax) * 100 
        };
    };
}

function rodarMonteCarlo(simularFn, qtdLutas) {
    let sumDPS = 0, sumTDO = 0, sumEst = 0, sumMortes = 0, sumDP = 0, sumTTW = 0, sumBossUses = 0;
    let minDps = 999, maxDps = 0, minMortes = 999, maxMortes = 0, minEst = 999, maxEst = 0, minTdo = 999, maxTdo = 0, bDmg = 0;

    for(let i=0; i < qtdLutas; i++){
        let r = simularFn(1, true); 
        sumDPS += r.dps; sumTDO += r.tdo; sumEst += r.estimador; sumMortes += r.mortes; sumDP += r.danoPerc; sumTTW += r.ttw; sumBossUses += r.bossUsesC; 
        if (i === 0) bDmg = r.bossDmgPerc; 
        if(r.dps < minDps) minDps = r.dps; if(r.dps > maxDps) maxDps = r.dps;
        if(r.mortes < minMortes) minMortes = r.mortes; if(r.mortes > maxMortes) maxMortes = r.mortes;
        if(r.estimador < minEst) minEst = r.estimador; if(r.estimador > maxEst) maxEst = r.estimador;
        if(r.tdo < minTdo) minTdo = r.tdo; if(r.tdo > maxTdo) maxTdo = r.tdo;
    }

    let dpsM = sumDPS/qtdLutas; let tdoM = sumTDO/qtdLutas;
    return {
        d: parseFloat(dpsM.toFixed(2)), d0: parseFloat(minDps.toFixed(2)), d1: parseFloat(maxDps.toFixed(2)),
        dp: parseFloat((sumDP/qtdLutas).toFixed(1)), m: Math.round(sumMortes/qtdLutas), m0: minMortes, m1: maxMortes,
        td: parseFloat(tdoM.toFixed(0)), td0: parseFloat(minTdo.toFixed(0)), td1: parseFloat(maxTdo.toFixed(0)),
        e: parseFloat((sumEst/qtdLutas).toFixed(2)), e0: parseFloat(minEst.toFixed(2)), e1: parseFloat(maxEst.toFixed(2)),
        tw: parseFloat((sumTTW/qtdLutas).toFixed(1)), er: parseFloat(Math.pow(Math.pow(dpsM, 3) * tdoM, 0.25).toFixed(2)),
        bu: parseFloat((sumBossUses/qtdLutas).toFixed(1)), bd: parseFloat(bDmg.toFixed(1)) 
    };
}

// ====================================================================
// 🚀 INÍCIO DO ATUALIZADOR DELTA
// ====================================================================
const raidConfigs = {
    "1": { hp: 600, tempo: 180 }, "2": { hp: 1800, tempo: 180 }, "3": { hp: 3600, tempo: 180 },
    "4": { hp: 9000, tempo: 180 }, "5": { hp: 15000, tempo: 300 }, "mega": { hp: 9000, tempo: 300 },
    "mega_lendaria": { hp: 22500, tempo: 300 }, "primal": { hp: 22500, tempo: 300 },
    "dmax_1": { hp: 1700, tempo: 180 }, "dmax_3": { hp: 10000, tempo: 180 }, "dmax_5": { hp: 15000, tempo: 300 },
    "gmax_6": { hp: 90000, tempo: 300 }
};

async function rodarAtualizador(pokeName, novoFast, novoCharged) {
    console.log("\n📥 Baixando Banco de Dados...");
    const [resPokes, resMega, resGiga, resEf, resFast, resCharged, resMoves] = await Promise.all([ fetch(URLS.MAIN_DATA).then(r => r.json()), fetch(URLS.MEGA_DATA).then(r => r.json()), fetch(URLS.GIGAMAX_DATA).then(r => r.json()), fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()), fetch(URLS.MOVES_GYM_FAST).then(r => r.json()), fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()), fetch(URLS.MOVE_DATA).then(r => r.json()) ]);
    const todosOsPokemons = [...resPokes, ...resMega, ...resGiga];
    GLOBAL_POKE_DB = { todosOsPokemons, dadosEficacia: resEf, gymFastMap: new Map(resFast.map(m => [m.moveId, m])), gymChargedMap: new Map(resCharged.map(m => [m.moveId, m])), moveDataObjMap: new Map(resMoves.map(m => [m.moveId, m])) };

    // 1. Encontra o Atacante (ex: Cinderace)
    const atacanteObj = todosOsPokemons.find(p => p.speciesName.toLowerCase() === pokeName.toLowerCase());
    if (!atacanteObj) {
        console.log(`❌ ERRO: Pokémon "${pokeName}" não encontrado na base de dados.`);
        return;
    }

    // 2. Injeta os novos golpes na memória do script (se informados)
    let fastMovesTestar = [...(atacanteObj.fastMoves || [])];
    if (novoFast) fastMovesTestar.push(novoFast.toUpperCase().trim());

    let chargedMovesTestar = [...(atacanteObj.chargedMoves || [])];
    if (novoCharged) chargedMovesTestar.push(novoCharged.toUpperCase().trim());

    // Remove duplicatas
    fastMovesTestar = [...new Set(fastMovesTestar)];
    chargedMovesTestar = [...new Set(chargedMovesTestar)];

    const atk40 = (atacanteObj.baseStats.atk || 10) + 15;
    const def40 = (atacanteObj.baseStats.def || 10) + 15;
    const hp40 = (atacanteObj.baseStats.hp || 10) + 15;
    const cp40 = Math.floor((atk40 * Math.sqrt(def40) * Math.sqrt(hp40) * (0.7903 * 0.7903)) / 10);

    console.log(`\n========================================================`);
    console.log(`🔧 MOTOR DELTA: Avaliando ${atacanteObj.speciesName} (CP 40: ${cp40})`);
    console.log(`🗡️ Fast Moves: ${fastMovesTestar.join(", ")}`);
    console.log(`🛡️ Charged Moves: ${chargedMovesTestar.join(", ")}`);
    console.log(`========================================================\n`);

    // 3. Vasculha a pasta de Raides
    if (!fs.existsSync(pastaDestino)) {
        console.log("❌ ERRO: Pasta 'simulacao_pve10' não encontrada. Você já gerou algum arquivo?");
        return;
    }

    const arquivosRaide = fs.readdirSync(pastaDestino).filter(file => file.endsWith('.json'));
    
    for (const arquivo of arquivosRaide) {
        // Exemplo: counters_mewtwo_t5.json
        const partes = arquivo.replace("counters_", "").replace(".json", "").split("_t");
        if (partes.length < 2) continue;

        let nomeLimpoBoss = partes[0].replace(/_/g, " ");
        const tier = partes[1];
        
        let bossObj = todosOsPokemons.find(p => p.speciesName.toLowerCase() === nomeLimpoBoss);
        if (!bossObj) {
            // Tentativa de fallback para nomes com formas
            bossObj = todosOsPokemons.find(p => p.speciesName.toLowerCase().replace(/ /g, "_") === partes[0]);
        }
        
        if (!bossObj) continue;

        const configRaid = raidConfigs[tier] || raidConfigs["5"];
        const caminhoCompleto = path.join(pastaDestino, arquivo);
        let dadosJSON = JSON.parse(fs.readFileSync(caminhoCompleto, 'utf8'));
        let alterouArquivo = false;

        console.log(`🔎 Escaneando: ${bossObj.speciesName} (Tier ${tier.toUpperCase()})...`);

        // Vasculha cada categoria do Boss ("average", "confusion_psystrike", etc)
        for (const categoria in dadosJSON) {
            let listaCounters = dadosJSON[categoria];
            if (listaCounters.length === 0) continue;

            // Descobre qual é a "nota de corte" (o pior do Top 30 atual)
            const piorEstimadorTop30 = listaCounters[listaCounters.length - 1].e;

            // Define os ataques que o Boss vai usar nesta simulação
            let bFast = bossObj.fastMoves && bossObj.fastMoves.length > 0 ? bossObj.fastMoves : ["TACKLE_FAST"];
            let bCharged = bossObj.chargedMoves && bossObj.chargedMoves.length > 0 ? bossObj.chargedMoves : ["STRUGGLE"];
            
            if (categoria !== "average") {
                const movesInCat = categoria.split("_");
                const mF = bossObj.fastMoves.find(m => m.toLowerCase().includes(movesInCat[0]));
                const mC = bossObj.chargedMoves.find(m => m.toLowerCase().includes(movesInCat[movesInCat.length-1]));
                if (mF) bFast = [mF];
                if (mC) bCharged = [mC];
            }

            const oponenteRaid = { tipos: bossObj.types || ["Normal"], baseStats: { atk: bossObj.baseStats.atk, def: bossObj.baseStats.def, hp: configRaid.hp }, fastMoves: bFast, chargedMoves: bCharged };

            let melhorComboAtacante = null;

            // Testar as combinações do Atacante (Cinderace)
            for (const fId of fastMovesTestar) {
                for (const cId of chargedMovesTestar) {
                    const simular = instanciarCombate(atacanteObj, oponenteRaid, fId, cId, configRaid.tempo);
                    if (simular) {
                        const m10Data = rodarMonteCarlo(simular, 550); // Luta 550x no X1
                        if (!melhorComboAtacante || m10Data.e < melhorComboAtacante.e) {
                            melhorComboAtacante = { i: atacanteObj.speciesId, n: atacanteObj.speciesName, f: fId.replace("_FAST", ""), c: cId, cp: cp40, lv: 40, ...m10Data };
                        }
                    }
                }
            }

            // O JUÍZO FINAL
            if (melhorComboAtacante && (melhorComboAtacante.e < piorEstimadorTop30 || listaCounters.length < 30)) {
                // Ele é digno! Remove o Cinderace antigo (se tiver) para não duplicar
                listaCounters = listaCounters.filter(c => c.i !== atacanteObj.speciesId);
                
                // Insere o novo, ordena e corta em 30
                listaCounters.push(melhorComboAtacante);
                listaCounters.sort((a, b) => a.e - b.e);
                listaCounters = listaCounters.slice(0, 30);
                
                dadosJSON[categoria] = listaCounters;
                alterouArquivo = true;

                // Acha a nova posição dele
                const novaPosicao = listaCounters.findIndex(c => c.i === atacanteObj.speciesId) + 1;
                console.log(`   ✅ SUCESSO! Assumiu o Top ${novaPosicao} contra [${categoria}]!`);
            }
        }

        if (alterouArquivo) {
            fs.writeFileSync(caminhoCompleto, JSON.stringify(dadosJSON));
            console.log(`   💾 Arquivo ${arquivo} salvo com a nova lista!`);
        } else {
            console.log(`   ❌ Muito fraco para entrar no Top 30. Nenhuma mudança feita.`);
        }
    }
    console.log(`\n🎉 ESCANEAMENTO CONCLUÍDO! O Motor Delta finalizou o trabalho.`);
}

// INICIA O PROMPT PARA O USUÁRIO
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("========================================================");
console.log("⚡ MOTOR DELTA (ATUALIZADOR DE DIA DA COMUNIDADE) ⚡");
console.log("========================================================\n");

rl.question('👤 Nome do Pokémon (Ex: Cinderace): ', (poke) => {
    rl.question('🗡️ Novo Ataque Rápido [Deixe em branco se não tiver]: ', (fast) => {
        rl.question('🛡️ Novo Ataque Carregado [Deixe em branco se não tiver]: ', (charged) => {
            rl.close();
            if(!poke) {
                console.log("Você precisa digitar o nome de um Pokémon!");
                return;
            }
            rodarAtualizador(poke.trim(), fast, charged);
        });
    });
});