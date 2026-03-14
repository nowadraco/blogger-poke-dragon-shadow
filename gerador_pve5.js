const fs = require('fs');
const path = require('path');

// 📁 PASTA 5: MOTOR INFINITO + FORÇA BRUTA (SEM FUNIL)
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

// 📊 Barra de Progresso
function desenharBarra(atual, total, icone, nomeFase) {
    const tamanhoBarra = 25;
    const progresso = atual / total;
    const blocosPreenchidos = Math.round(tamanhoBarra * progresso);
    const barra = '█'.repeat(blocosPreenchidos) + '░'.repeat(tamanhoBarra - blocosPreenchidos);
    const pct = Math.floor(progresso * 100).toString().padStart(3, ' ');
    process.stdout.write(`    ${icone} ${nomeFase.padEnd(16)} [${barra}] ${pct}% | 🥊 ${atual}/${total} Pokes\r`);
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

// =====================================================================
// 🎲 O CÉREBRO INFINITO (Calcula TTW Real e Raio-X)
// =====================================================================
function calcularMelhoresCombosBruto(pokemon, oponente, tempoMaximoRaid = 300, numLutasRNG = 50) {
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

            let simulacoesValidas = 0;
            let dpsMin = 9999, dpsMax = 0; let mortesMin = 9999, mortesMax = 0;

            // Acumuladores do Modo Infinito
            let inf_somaDanoAos300s = 0; let inf_somaDpsAos300s = 0;
            let inf_somaTempoParaMatar = 0; let inf_somaDpsParaMatar = 0; let inf_somaMortesParaMatar = 0;
            let inf_somaVidasDano = [0,0,0,0,0,0]; let inf_somaVidasTempo = [0,0,0,0,0,0];

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

                    let cenarioDpsMax = 0; let cenarioDpsMin = 9999;

                    for (let luta = 0; luta < numLutasRNG; luta++) {
                        let hpBoss = oponente.baseStats.hp; let hpAtual = attackerHPMax; let energiaAtacante = 0; let energiaBoss = 0;
                        let relogio = 0; let proxAcaoAtacante = 0; 
                        let proxAcaoBoss = 1.5 + ((Math.random() + Math.random()) / 2); 
                        
                        let mortesTotais = 0; let limitadorInfinito = 0;
                        let hpRecorded300 = false; let danoAos300s = 0;
                        let vidasDano = [0,0,0,0,0,0]; let vidasTempo = [0,0,0,0,0,0];

                        // LUTA ATÉ O BOSS MORRER (Sem limite de 300s)
                        while (hpBoss > 0 && limitadorInfinito < 50000) {
                            limitadorInfinito++; 
                            let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);

                            // Grava como estava o dano exatamente na marca de 300s
                            if (!hpRecorded300 && proximoEvento >= tempoMaximoRaid) {
                                danoAos300s = oponente.baseStats.hp - hpBoss;
                                hpRecorded300 = true;
                            }

                            let deltaT = proximoEvento - relogio;
                            relogio = proximoEvento;

                            if (relogio > 3000) { hpBoss = 0; break; } // Fail-safe (50 minutos max)

                            // Registra o tempo de vida do Pokémon atual (Slot 1 ao 6)
                            if (mortesTotais < 6) vidasTempo[mortesTotais] += deltaT;
                            
                            if (hpAtual > 0 && relogio >= proxAcaoAtacante) {
                                let danoCausado = 0;
                                if (energiaAtacante >= enCost) { 
                                    danoCausado = Math.min(hpBoss, dmgCharged); 
                                    energiaAtacante -= enCost; proxAcaoAtacante = relogio + tCharged; 
                                } else { 
                                    danoCausado = Math.min(hpBoss, dmgFast); 
                                    energiaAtacante += enGain; proxAcaoAtacante = relogio + tFast; 
                                }
                                hpBoss -= danoCausado; energiaBoss += Math.ceil(danoCausado * 0.1); 
                                
                                if (mortesTotais < 6) vidasDano[mortesTotais] += danoCausado;

                                if (energiaAtacante > 100) energiaAtacante = 100; if (energiaBoss > 100) energiaBoss = 100;
                            }
                            else if (relogio >= proxAcaoBoss) {
                                let usaCarregado = false;
                                if (energiaBoss >= bossEnCost && Math.random() < 0.5) usaCarregado = true;
                                const delayRNG = 1.5 + ((Math.random() + Math.random()) / 2);

                                if (usaCarregado) { 
                                    hpAtual -= dmgBossCharged; energiaBoss -= bossEnCost; proxAcaoBoss = relogio + tBossChargedBase + delayRNG; energiaAtacante += Math.ceil(dmgBossCharged * 0.5); 
                                } else { 
                                    hpAtual -= dmgBossFast; energiaBoss += bossEnGain; proxAcaoBoss = relogio + tBossFastBase + delayRNG; energiaAtacante += Math.ceil(dmgBossFast * 0.5); 
                                }
                                if (energiaAtacante > 100) energiaAtacante = 100;
                            }
                            
                            if (hpAtual <= 0 && hpBoss > 0) {
                                mortesTotais++; hpAtual = attackerHPMax; energiaAtacante = 0; 
                                relogio += 2.0; // Animação de Morte 2.0s
                                proxAcaoAtacante = relogio + 0.5; proxAcaoBoss = Math.max(proxAcaoBoss, relogio); 
                                if (mortesTotais % 6 === 0) { relogio += 15; energiaBoss = 0; proxAcaoBoss = relogio + 2.0; proxAcaoAtacante = relogio + 0.5; }
                            }
                        }

                        // Trata dados da luta
                        if (!hpRecorded300) { danoAos300s = oponente.baseStats.hp; } // Boss morreu rápido!
                        const dps300s = danoAos300s / Math.min(relogio, tempoMaximoRaid);
                        
                        inf_somaDanoAos300s += danoAos300s;
                        inf_somaDpsAos300s += dps300s;
                        inf_somaTempoParaMatar += relogio;
                        inf_somaDpsParaMatar += (oponente.baseStats.hp / relogio);
                        inf_somaMortesParaMatar += mortesTotais;

                        for(let v=0; v<6; v++){
                            inf_somaVidasDano[v] += vidasDano[v];
                            inf_somaVidasTempo[v] += vidasTempo[v];
                        }
                        
                        if (dps300s > cenarioDpsMax) cenarioDpsMax = dps300s; if (dps300s < cenarioDpsMin) cenarioDpsMin = dps300s;
                        if (mortesTotais < mortesMin) mortesMin = mortesTotais; if (mortesTotais > mortesMax) mortesMax = mortesTotais;
                    }
                    simulacoesValidas++;
                });
            });

            if (simulacoesValidas > 0) {
                const danoPerc300 = ((inf_somaDanoAos300s / numLutasRNG / simulacoesValidas) / oponente.baseStats.hp) * 100;
                const dps300 = (inf_somaDpsAos300s / numLutasRNG / simulacoesValidas);
                const tempoParaMatarFinal = (inf_somaTempoParaMatar / numLutasRNG / simulacoesValidas);
                const dpsParaMatarFinal = (inf_somaDpsParaMatar / numLutasRNG / simulacoesValidas);
                const mortesReaisParaMatar = (inf_somaMortesParaMatar / numLutasRNG / simulacoesValidas);

                let vidasArray = [];
                for(let v=0; v<6; v++){
                    let d = (inf_somaVidasDano[v] / numLutasRNG / simulacoesValidas);
                    let t = (inf_somaVidasTempo[v] / numLutasRNG / simulacoesValidas);
                    vidasArray.push({
                        slot: v + 1, dano: Math.floor(d), tempoVivo: parseFloat(t.toFixed(1)),
                        dpsSlot: t > 0 ? parseFloat((d/t).toFixed(1)) : 0
                    });
                }

                combos.push({
                    f: fastMove.moveId, c: chargedMove.moveId,
                    dps: parseFloat(dps300.toFixed(1)), dpsMin: parseFloat(dpsMin.toFixed(1)), dpsMax: parseFloat(dpsMax.toFixed(1)),
                    dmgPerc: Math.min(100, parseFloat(danoPerc300.toFixed(1))), deathsMin: Math.floor(mortesMin), deathsMax: Math.ceil(mortesMax),
                    tempoRealParaMatar: parseFloat(tempoParaMatarFinal.toFixed(1)),
                    dpsRealParaMatar: parseFloat(dpsParaMatarFinal.toFixed(1)),
                    mortesParaMatar: parseFloat(mortesReaisParaMatar.toFixed(1)),
                    desempenhoPorVida: vidasArray
                });
            }
        });
    });
    return combos.sort((a, b) => b.dmgPerc - a.dmgPerc); 
}

// =====================================================================
// A ESTRUTURA DA GERAÇÃO 3.0 (FORÇA BRUTA EM TODOS OS VIPS)
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

    // ⚙️ PARÂMETRO DA FORÇA BRUTA (50 LUTAS PARA TODO MUNDO)
    const NUM_LUTAS_BRUTAS = 50; 

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
            console.log(`⚔️ FORÇA BRUTA 5.0: ${bossData.speciesName.toUpperCase()} (Tier ${currentTier})`);
            console.log(`=============================================================`);

            for (let c = 0; c < cenariosDeLuta.length; c++) {
                const cenario = cenariosDeLuta[c];
                console.log(`\n ⚙️ Cenário [${c+1}/${cenariosDeLuta.length}]: ${cenario.sufixoArquivo}`);
                const oponenteRaid = { tipos: bossData.types || ["Normal"], baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: configRaid.hp }, fastMoves: cenario.fastMoves, chargedMoves: cenario.chargedMoves };

                let resultadosDoCenario = [];
                let pokesAnalisados = 0;
                const totalPokes = atacantesVIP.length;

                // LOOP BRUTO DA GERAÇÃO 3 (Nenhum Pokémon fica para trás)
                atacantesVIP.forEach(atacante => {
                    pokesAnalisados++;
                    
                    if (pokesAnalisados % Math.max(1, Math.floor(totalPokes / 50)) === 0 || pokesAnalisados === totalPokes) {
                        desenharBarra(pokesAnalisados, totalPokes, '🔥', `Bruto ${NUM_LUTAS_BRUTAS}x`);
                    }

                    if (atacante.speciesId === bossData.speciesId) return;

                    const combos = calcularMelhoresCombosBruto(atacante, oponenteRaid, configRaid.tempo, NUM_LUTAS_BRUTAS);

                    if (combos.length > 0) {
                        combos.forEach(combo => {
                            resultadosDoCenario.push({ id: atacante.speciesId, name: atacante.speciesName, ...combo });
                        });
                    }
                });
                console.log(); 

                // AGRUPAMENTO E SELEÇÃO DOS 30 MELHORES
                const agrupadoPorPokemon = {};
                resultadosDoCenario.forEach(combo => {
                    if (!agrupadoPorPokemon[combo.id]) agrupadoPorPokemon[combo.id] = { id: combo.id, name: combo.name, melhorDano: 0, todosCombos: [] };
                    agrupadoPorPokemon[combo.id].todosCombos.push(combo);
                    if (combo.dmgPerc > agrupadoPorPokemon[combo.id].melhorDano) agrupadoPorPokemon[combo.id].melhorDano = combo.dmgPerc;
                });

                const rankingPokemons = Object.values(agrupadoPorPokemon).sort((a, b) => b.melhorDano - a.melhorDano);
                const top30Pokemons = rankingPokemons.slice(0, 30);
                
                let resultadosFinais = [];
                top30Pokemons.forEach(poke => { resultadosFinais = resultadosFinais.concat(poke.todosCombos); });
                resultadosFinais.sort((a, b) => b.dmgPerc - a.dmgPerc);

                dadosAgrupadosDoBoss[cenario.sufixoArquivo] = resultadosFinais;
            }
            
            const nomeDoArquivoUnico = `counters_${bossData.speciesName.toLowerCase().replace(/ /g, "_")}_t${currentTier}.json`;
            const arquivoSaida = path.join(pastaDestino, nomeDoArquivoUnico);
            fs.writeFileSync(arquivoSaida, JSON.stringify(dadosAgrupadosDoBoss, null, 4)); 
            console.log(`\n✅ ARQUIVO FORÇA BRUTA 5.0 SALVO! ${nomeDoArquivoUnico}`);
        }
    }
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("====================================================");
console.log("🚀 GERADOR PVE 5.0 (FORÇA BRUTA TOTAL + RAIOS-X) 🚀");
console.log("====================================================\n");
rl.question('🔥 Qual Boss você quer simular? (Deixe vazio para Mewtwo): ', (bossAnswer) => {
    rl.question('⚔️ Qual o Tier da Reide? (Padrão 5): ', (tierAnswer) => {
        rl.close(); gerarRankingEmMassa(bossAnswer || "Mewtwo", tierAnswer || "5");
    });
});