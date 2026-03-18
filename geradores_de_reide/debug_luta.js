const fs = require('fs');

const URLS = {
    MAIN_DATA: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/poke_data.json",
    TYPE_EFFECTIVENESS: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/eficacia_tipos_poke.json",
    MOVES_GYM_FAST: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_rapidos_gym.json",
    MOVES_GYM_CHARGED: "https://cdn.jsdelivr.net/gh/nowadraco/blogger-poke-dragon-shadow@main/json/movimentos_carregados_gym.json",
};

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
            const tLower = t.toLowerCase().trim();
            const dict = { normal: "Normal", fire: "Fogo", water: "Água", electric: "Elétrico", grass: "Planta", ice: "Gelo", fighting: "Lutador", poison: "Venenoso", ground: "Terrestre", flying: "Voador", psychic: "Psíquico", bug: "Inseto", rock: "Pedra", ghost: "Fantasma", dragon: "Dragão", steel: "Aço", dark: "Sombrio", fairy: "Fada", fogo: "Fogo", água: "Água", agua: "Água", planta: "Planta", elétrico: "Elétrico", eletrico: "Elétrico" };
            return dict[tLower] || tLower.charAt(0).toUpperCase() + tLower.slice(1);
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

async function simularUmXUm() {
    console.log("📥 Baixando banco de dados para Debug...");
    const [resPokes, resEf, resFast, resCharged] = await Promise.all([
        fetch(URLS.MAIN_DATA).then(r => r.json()),
        fetch(URLS.TYPE_EFFECTIVENESS).then(r => r.json()),
        fetch(URLS.MOVES_GYM_FAST).then(r => r.json()),
        fetch(URLS.MOVES_GYM_CHARGED).then(r => r.json()),
    ]);

    const gymFastMap = new Map(resFast.map(m => [m.moveId, m]));
    const gymChargedMap = new Map(resCharged.map(m => [m.moveId, m]));

    // 1. Encontra Necrozma e Mewtwo
    const necrozma = resPokes.find(p => p.speciesId === "necrozma_dawn_wings");
    const mewtwo = resPokes.find(p => p.speciesId === "mewtwo");

    if (!necrozma || !mewtwo) {
        console.error("❌ Necrozma ou Mewtwo não encontrados no JSON!");
        return;
    }

    console.log(`\n======================================================`);
    console.log(`⚔️ DEBUG DE LUTA: ${necrozma.speciesName} VS ${mewtwo.speciesName} ⚔️`);
    console.log(`======================================================`);

    const CPM_40 = 0.7903;
    const atkUser = ((necrozma.baseStats.atk) + 15) * CPM_40;
    const defInimigoReal = ((mewtwo.baseStats.def) + 15) * CPM_40;
    const razaoDano = atkUser / defInimigoReal;

    console.log(`\n📊 STATUS BASE:`);
    console.log(`- Ataque Real Necrozma: ${atkUser.toFixed(1)}`);
    console.log(`- Defesa Real Mewtwo: ${defInimigoReal.toFixed(1)}`);
    console.log(`- Razão de Dano Bruto: ${razaoDano.toFixed(3)}\n`);

    const getMoveData = (id, isFast) => {
        const map = isFast ? gymFastMap : gymChargedMap;
        let move = map.get(id);
        if (!move && !id.endsWith("_FAST")) move = map.get(id + "_FAST");
        return move;
    };

    // Filtra apenas para comparar os dois principais que estão brigando
    const ataquesRapidosTeste = ["SHADOW_CLAW", "PSYCHO_CUT", "METAL_CLAW"];
    
    ataquesRapidosTeste.forEach(fastId => {
        const fastMove = getMoveData(fastId, true);
        if (!fastMove) { console.log(`❌ Golpe Rápido ${fastId} não encontrado no banco!`); return; }

        const chargedMove = getMoveData("MOONGEIST_BEAM", false);
        if (!chargedMove) { console.log(`❌ Moongeist Beam não encontrado!`); return; }

        // --- MATEMÁTICA DE MULTIPLICADORES ---
        let mFast_STAB = necrozma.types.some(t => t && String(t).toLowerCase() === String(fastMove.type).toLowerCase()) ? 1.2 : 1.0;
        let mFast_Efetivo = getTypeEffectiveness(fastMove.type, mewtwo.types, resEf);
        let mFast_Total = mFast_STAB * mFast_Efetivo;

        let mCharged_STAB = necrozma.types.some(t => t && String(t).toLowerCase() === String(chargedMove.type).toLowerCase()) ? 1.2 : 1.0;
        let mCharged_Efetivo = getTypeEffectiveness(chargedMove.type, mewtwo.types, resEf);
        let mCharged_Total = mCharged_STAB * mCharged_Efetivo;

        // --- CÁLCULO DE DANO REAL DO JOGO ---
        const dmgFast = Math.floor(0.5 * (fastMove.power || 0) * razaoDano * mFast_Total) + 1;
        const dmgCharged = Math.floor(0.5 * (chargedMove.power || 0) * razaoDano * mCharged_Total) + 1;

        // --- ENERGIA E TEMPO ---
        let tFast = (parseFloat(fastMove.duration) || (fastMove.cooldown / 1000) || 0.5); if(tFast > 10) tFast/=1000;
        let tCharged = (parseFloat(chargedMove.duration) || (chargedMove.cooldown / 1000) || 2.0); if(tCharged > 10) tCharged/=1000;
        const enGain = fastMove.energy || fastMove.energyGain || 6;
        const enCost = Math.abs(chargedMove.energy || chargedMove.energyCost || 50);

        // --- DADOS NA TELA ---
        console.log(`🥊 TESTANDO: ${fastMove.name} + ${chargedMove.name}`);
        console.log(`  [RÁPIDO - ${fastMove.type}]`);
        console.log(`    STAB: ${mFast_STAB}x | Efetividade: ${mFast_Efetivo}x | Mult. Final: ${mFast_Total.toFixed(2)}x`);
        console.log(`    Poder Base: ${fastMove.power} -> Dano Real no Mewtwo: ${dmgFast}`);
        console.log(`    Gera Energia: +${enGain} | Tempo: ${tFast}s | EPS: ${(enGain/tFast).toFixed(1)}`);
        
        console.log(`  [CARREGADO - ${chargedMove.type}]`);
        console.log(`    STAB: ${mCharged_STAB}x | Efetividade: ${mCharged_Efetivo}x | Mult. Final: ${mCharged_Total.toFixed(2)}x`);
        console.log(`    Poder Base: ${chargedMove.power} -> Dano Real no Mewtwo: ${dmgCharged}`);
        console.log(`    Custa Energia: -${enCost} | Tempo: ${tCharged}s\n`);
    });
}

simularUmXUm();