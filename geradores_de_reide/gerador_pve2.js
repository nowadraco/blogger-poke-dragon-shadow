const fs = require('fs');
const path = require('path');

// 📁 CRIANDO A PASTA NOVA PARA TESTE
const pastaDestino = path.join(__dirname, 'json', 'simulacao_pve2');
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

// 2. A SUA FUNÇÃO DE EFICÁCIA
function getTypeEffectiveness(moveType, defenderTypes, typeData) {
    if (!moveType || !defenderTypes || !typeData) return 1.0;
    try {
        const formatarTipo = (t) => {
            if (!t) return "";
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

// 3. O CÉREBRO DE BATALHA
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

                    let tFast = parseFloat(fastMove.duration) || (fastMove.cooldown ? fastMove.cooldown / 1000 : 0.5); 
                    if(tFast > 10) tFast/=1000; if(tFast < 0.1) tFast = 0.5; tFast += 0.05;
                    
                    let tCharged = parseFloat(chargedMove.duration) || (chargedMove.cooldown ? chargedMove.cooldown / 1000 : 2.0); 
                    if(tCharged > 10) tCharged/=1000; if(tCharged < 0.1) tCharged = 2.0; tCharged += 0.5;

                    let tBossFast = (parseFloat(bFast.duration) || (bFast.cooldown ? bFast.cooldown / 1000 : 1.0)) + 1.5;
                    let tBossCharged = (parseFloat(bCharged.duration) || (bCharged.cooldown ? bCharged.cooldown / 1000 : 2.0)) + 2.0;

                    const enGain = Math.max(1, fastMove.energyGain || fastMove.energy || 6);
                    const enCost = Math.abs(chargedMove.energyCost || chargedMove.energy || 50);
                    const bossEnCost = Math.abs(bCharged.energyCost || bCharged.energy || 50);
                    const bossEnGain = bFast.energyGain || bFast.energy || 10;

                    // A BATALHA
                    let hpBoss = oponente.baseStats.hp;
                    let hpAtual = attackerHPMax;
                    let energiaAtacante = 0; let energiaBoss = 0;
                    let relogio = 0; let proxAcaoAtacante = 0; let proxAcaoBoss = 1.0;
                    let mortesTotais = 0; let danoAos300s = 0; let limitadorInfinito = 0;

                    while (hpBoss > 0 && limitadorInfinito < 20000) {
                        limitadorInfinito++;
                        let proximoEvento = Math.min(proxAcaoAtacante, proxAcaoBoss);
                        
                        if (proximoEvento < relogio) proximoEvento = relogio;
                        relogio = proximoEvento;

                        if (relogio > 1500) { hpBoss = 0; break; }
                        
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

                        if (relogio <= tempoMaximoRaid) { danoAos300s = oponente.baseStats.hp - hpBoss; }

                        if (hpAtual <= 0 && hpBoss > 0) {
                            mortesTotais++;
                            hpAtual = attackerHPMax; 
                            energiaAtacante = 0; 
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

                    if (relogio <= tempoMaximoRaid) { danoAos300s = oponente.baseStats.hp; }

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
                    fast: fastMove.moveId, charged: chargedMove.moveId,
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

// 4. FUNÇÃO PRINCIPAL (AGRUPAMENTO POR BOSS)
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

    // 🚨 AQUI ESTÁ O NOVO PORTEIRO (O FILTRO ATUALIZADO)
    const atacantesVIP = todosOsPokemons.filter(atacante => {
        if (!atacante || !atacante.baseStats) return false;
        
        // Corta lixos e Purificados (Mantém os Megas!)
        if (atacante.speciesName.includes("Purified") || 
            atacante.speciesName === "Smeargle" || 
            atacante.speciesName === "Ditto") return false;

        const atk50 = (atacante.baseStats.atk || 10) + 15;
        const def50 = (atacante.baseStats.def || 10) + 15;
        const hp50  = (atacante.baseStats.hp || 10) + 15;
        const maxCP = Math.floor((atk50 * Math.sqrt(def50) * Math.sqrt(hp50) * (0.8403 * 0.8403)) / 10);
        
        // 💎 REGRA DE ELITE: Deixa passar quem tem 2000+ de CP OU quem tem Ataque Base Monstro (>= 250)
        return maxCP >= 2000 || atacante.baseStats.atk >= 250; 
    });

    console.log(`🎯 Ficaram ${atacantesVIP.length} Pokémons de Elite aptos para a simulação!\n`);

    const raidConfigs = { "5": { hp: 15000, tempo: 300 } }; 
    const listaBosses = bossesInput.split(",").map(b => b.trim()).filter(b => b !== "");
    let tiersToRun = ["5"]; if (typeof tiersInput === "string") tiersToRun = tiersInput.toLowerCase().split(/[\s,]+/).filter(t => t.trim() !== "");

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

        for (const currentTier of tiersToRun) {
            const configRaid = raidConfigs[currentTier] || raidConfigs["5"];
            
            // 📦 AQUI ESTÁ A GAVETA GIGANTE! Vai guardar todos os cenários num objeto só.
            let dadosAgrupadosDoBoss = {};

            console.log(`\n⚔️ CALCULANDO: ${bossData.speciesName.toUpperCase()} (Tier ${currentTier})`);

            for (let c = 0; c < cenariosDeLuta.length; c++) {
                const cenario = cenariosDeLuta[c];
                console.log(`\n ⚙️ Iniciando cenário [${c+1}/${cenariosDeLuta.length}]: ${cenario.sufixoArquivo}`);

                const oponenteRaid = { tipos: bossData.types || ["Normal"], baseStats: { atk: bossData.baseStats.atk, def: bossData.baseStats.def, hp: configRaid.hp }, fastMoves: cenario.fastMoves, chargedMoves: cenario.chargedMoves };

                let resultados = [];
                
                // ⏱️ VARIÁVEIS DO MOSTRADOR
                let pokesAnalisados = 0; 
                const totalPokes = atacantesVIP.length;

                atacantesVIP.forEach(atacante => {
                    pokesAnalisados++;
                    
                    // 📊 O MOSTRADOR AO VIVO NO TERMINAL!
                    if (pokesAnalisados % 10 === 0 || pokesAnalisados === totalPokes) { 
                        const porcentagem = Math.floor((pokesAnalisados / totalPokes) * 100);
                        process.stdout.write(`    🥊 Lutas simuladas: ${pokesAnalisados}/${totalPokes} [${porcentagem}%]\r`); 
                    }

                    if (atacante.speciesId === bossData.speciesId) return;
                    
                    const combos = calcularMelhoresCombos(atacante, oponenteRaid, configRaid.tempo);
                    if (combos.length > 0) {
                        combos.forEach(combo => resultados.push({ id: atacante.speciesId, name: atacante.speciesName, f: combo.fast, c: combo.charged, dps: combo.dps, dpsMin: combo.dpsMin, dpsMax: combo.dpsMax, dmgPerc: combo.dmgPerc, deathsMin: combo.deathsMin, deathsMax: combo.deathsMax, tdo: combo.tdo, est: combo.est }));
                    }
                });

                if (resultados.length > 0) {
                    const agrupadoPorPokemon = {};
                    resultados.forEach(combo => {
                        if (!agrupadoPorPokemon[combo.id]) agrupadoPorPokemon[combo.id] = { id: combo.id, name: combo.name, melhorDano: 0, todosCombos: [] };
                        agrupadoPorPokemon[combo.id].todosCombos.push(combo);
                        if (combo.dmgPerc > agrupadoPorPokemon[combo.id].melhorDano) agrupadoPorPokemon[combo.id].melhorDano = combo.dmgPerc;
                    });

                    const rankingPokemons = Object.values(agrupadoPorPokemon).sort((a, b) => b.melhorDano - a.melhorDano);
                    const top30Pokemons = rankingPokemons.slice(0, 30); // Pega só os 30 melhores
                    
                    let resultadosFinais = [];
                    top30Pokemons.forEach(poke => { resultadosFinais = resultadosFinais.concat(poke.todosCombos); });
                    resultadosFinais.sort((a, b) => b.dmgPerc - a.dmgPerc);

                    // 📥 Guarda o Top 30 desse cenário dentro da Gaveta!
                    dadosAgrupadosDoBoss[cenario.sufixoArquivo] = resultadosFinais;
                }
            }

            // 💾 AGORA SIM! Ele salva a gaveta inteira num arquivo único!
            const nomeDoArquivoUnico = `counters_${nomeLimpoBoss}_t${currentTier}.json`;
            const arquivoSaida = path.join(pastaDestino, nomeDoArquivoUnico);
            
            fs.writeFileSync(arquivoSaida, JSON.stringify(dadosAgrupadosDoBoss)); 
            const tamanhoKB = (fs.statSync(arquivoSaida).size / 1024).toFixed(1);
            console.log(`\n✅ ARQUIVO ÚNICO SALVO! ${nomeDoArquivoUnico} - Tamanho Super Leve: ${tamanhoKB} KB`);
        }
    }
}

// ====================================================================
// 🎮 MENU INTERATIVO NO TERMINAL
// ====================================================================
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("====================================================");
console.log("🌟 GERADOR DE COUNTERS PVE (JSON AGRUPADO) 🌟");
console.log("====================================================\n");

rl.question('🔥 Qual Boss você quer simular? (Deixe vazio para Mewtwo): ', (bossAnswer) => {
    const boss = bossAnswer.trim() || "Mewtwo";
    
    rl.question('⚔️ Qual o Tier da Reide? (Ex: 1, 3, 5, mega, primal - Padrão é 5): ', (tierAnswer) => {
        const tier = tierAnswer.trim() || "5";
        
        // Fecha o prompt de perguntas e inicia o motor pesado
        rl.close();
        
        console.log(`\n🚀 Iniciando Super Computador para: ${boss} (Tier ${tier})...\n`);
        gerarRankingEmMassa(boss, tier);
    });
});