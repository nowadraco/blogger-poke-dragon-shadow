document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const container = document.getElementById('move-list-container');
    const nameFilterInput = document.getElementById('name-filter');
    const typeFilterSelect = document.getElementById('type-filter');
    const tabFastButton = document.getElementById('tab-fast');
    const tabChargedButton = document.getElementById('tab-charged');
    const sortingContainer = document.getElementById('sorting-container');

    // Variáveis de estado
    let allMoves = [];
    let moveTranslationMap = {};
    let typeTranslationMap = {};
    let activeCategory = 'fast';
    let sortState = {
        key: 'name',
        direction: 'asc'
    };

    const movesFilePath = '/json/moves.json';
    const moveTranslationsFilePath = '/json/movimentos_portugues.json';
    const typeTranslationsFilePath = '/json/tipo_portugues.json';

    function loadData() {
        Promise.all([
            fetch(movesFilePath),
            fetch(moveTranslationsFilePath),
            fetch(typeTranslationsFilePath)
        ])
        .then(responses => Promise.all(responses.map(res => res.ok ? res.json() : Promise.reject(res.statusText))))
        .then(([movesData, moveTranslationsData, typeTranslations]) => {
            allMoves = movesData;
            typeTranslationMap = typeTranslations;
            moveTranslationMap = moveTranslationsData.reduce((acc, item) => {
                const key = Object.keys(item)[0];
                acc[key] = item[key];
                return acc;
            }, {});

            populateTypeFilter(); // Agora esta função tem conteúdo!
            renderSortButtons();
            applyFiltersAndSort();
        })
        .catch(error => {
            console.error('Houve um problema:', error);
            container.innerHTML = `<p style="color: red; text-align: center;">Não foi possível carregar os dados.</p>`;
        });
    }

    // ############ FUNÇÃO CORRIGIDA ############
    function populateTypeFilter() {
        typeFilterSelect.innerHTML = '<option value="">Todos os Tipos</option>';
        
        const types = [...new Set(allMoves.map(move => move.type))];
        types.sort();

        types.forEach(type => {
            const translatedType = typeTranslationMap[type] || type;
            const option = document.createElement('option');
            option.value = type;
            option.textContent = translatedType;
            typeFilterSelect.appendChild(option);
        });
    }

    function renderSortButtons() {
        sortingContainer.innerHTML = '';
        const sortOptions = {
            fast: { 'Tipo': 'type', 'Poder': 'power', 'Ganho de Energia': 'energyGain', 'Cooldown': 'cooldown', 'Turnos': 'turns' },
            charged: { 'Tipo': 'type', 'Poder': 'power', 'Energia': 'energy', 'Cooldown': 'cooldown', 'Turnos': 'turns' }
        };

        const currentOptions = sortOptions[activeCategory];
        for (const label in currentOptions) {
            const key = currentOptions[label];
            const button = document.createElement('button');
            button.className = 'sort-button';
            button.dataset.sortKey = key;
            button.textContent = label;

            if (sortState.key === key) {
                button.classList.add('active');
                const arrow = document.createElement('span');
                arrow.className = 'sort-arrow';
                arrow.textContent = sortState.direction === 'desc' ? '↑' : '↓';
                button.appendChild(arrow);
            }

            button.addEventListener('click', () => handleSortClick(key));
            sortingContainer.appendChild(button);
        }
    }
    
    function handleSortClick(key) {
        if (sortState.key === key) {
            sortState.direction = sortState.direction === 'desc' ? 'asc' : 'desc';
        } else {
            sortState.key = key;
            sortState.direction = 'desc';
        }
        applyFiltersAndSort();
    }
    
    function applyFiltersAndSort() {
        const nameQuery = nameFilterInput.value.toLowerCase().trim();
        const typeQuery = typeFilterSelect.value;

        let filteredMoves = allMoves.filter(move => {
            const isFastMove = move.energyGain > 0;
            const isChargedMove = move.energy > 0;
            if ((activeCategory === 'fast' && !isFastMove) || (activeCategory === 'charged' && !isChargedMove)) {
                return false;
            }
            const translatedName = (moveTranslationMap[move.name] || move.name).toLowerCase();
            const nameMatch = translatedName.includes(nameQuery);
            const typeMatch = !typeQuery || move.type === typeQuery;
            return nameMatch && typeMatch;
        });

        filteredMoves.sort((a, b) => {
            const key = sortState.key;
            let valA, valB;

            if (key === 'name') {
                valA = moveTranslationMap[a.name] || a.name;
                valB = moveTranslationMap[b.name] || b.name;
            } else {
                valA = a[key];
                valB = b[key];
            }
            
            let comparison = 0;
            if (typeof valA === 'string') {
                comparison = valA.localeCompare(valB, 'pt-BR');
            } else {
                comparison = valA - valB;
            }

            return sortState.direction === 'asc' ? comparison : -comparison;
        });
        
        renderMoves(filteredMoves);
        renderSortButtons();
    }
    
    function renderMoves(movesToRender) {
        container.innerHTML = '';
        if (movesToRender.length === 0) {
            container.innerHTML = '<p class="no-results">Nenhum movimento encontrado com estes filtros.</p>';
            return;
        }
        movesToRender.forEach(move => {
            const translatedName = moveTranslationMap[move.name] || move.name;
            const translatedType = typeTranslationMap[move.type] || move.type;
            const cooldownInSeconds = move.cooldown / 1000;
            const moveCard = document.createElement('div');
            moveCard.className = 'move-card';
            moveCard.innerHTML = `
                <div class="move-name type-${move.type}">${translatedName}</div>
                <ul class="move-details">
                    <li><strong>Tipo:</strong> <span>${translatedType}</span></li>
                    <li><strong>Poder:</strong> <span>${move.power}</span></li>
                    ${move.energy > 0 ? `<li><strong>Energia:</strong> <span>${move.energy}</span></li>` : ''}
                    ${move.energyGain > 0 ? `<li><strong>Ganho de Energia:</strong> <span>${move.energyGain}</span></li>` : ''}
                    <li><strong>Cooldown:</strong> <span>${cooldownInSeconds.toFixed(1)}s</span></li>
                    <li><strong>Turnos:</strong> <span>${move.turns}</span></li>
                </ul>
            `;
            container.appendChild(moveCard);
        });
    }

    function setupTabListener(button, category) {
        button.addEventListener('click', () => {
            if (activeCategory === category) return;
            activeCategory = category;
            sortState = { key: 'name', direction: 'asc' };
            
            document.querySelector('.tab-button.active').classList.remove('active');
            button.classList.add('active');
            
            applyFiltersAndSort();
        });
    }
    setupTabListener(tabFastButton, 'fast');
    setupTabListener(tabChargedButton, 'charged');
    
    nameFilterInput.addEventListener('input', applyFiltersAndSort);
    typeFilterSelect.addEventListener('change', applyFiltersAndSort);

    loadData();
});