document.addEventListener('DOMContentLoaded', () => {

    const defaultQuestions = window.QUESTION_BANK.normal;
    const wildcardQuestions = window.QUESTION_BANK.wildcard;
    const wildcardQuestionList = Object.entries(wildcardQuestions).flatMap(([category, questions]) =>
        questions.map((question, index) => ({
            ...question,
            wildcardCategory: category,
            wildcardId: `${category}:${index}`
        }))
    );

    // ================== CANAL ==================
    const bc = new BroadcastChannel('100_mexicanos_dijeron_channel');

    // ================== ESTADO ==================
    let gameState = {
        team1Name: 'Equipo 1',
        team2Name: 'Equipo 2',
        team1Score: 0,
        team2Score: 0,
        questions: [],
        currentQuestionIndex: null,
        currentQuestionData: null,
        revealedAnswers: [],
        strikes: 0,
        pendingPoints: null,
        roundPoints: 0,
        usedQuestionIndexes: [],
        usedWildcardQuestionIds: [],
        lastScoreChange: null,
        tournamentTeams: createDefaultTournamentTeams(),
        bracketSlots: {
            semifinal: Array(4).fill(null),
            final: Array(2).fill(null),
            champion: [null]
        }
    };

    // ================== SONIDOS ==================
    const soundReveal = new Audio('sounds/reveal.mp3');
    const soundStrike = new Audio('sounds/strike.mp3');
    const soundQuestion = new Audio('sounds/new_question.mp3');
    const soundRepeated = new Audio('sounds/repeated.mp3');
    let renderedStrikes = 0;
    let strikeOverlayTimer;
    let selectedMatchTeamIds = [];
    let selectedMatchRound = null;
    let isTournamentShuffling = false;
    let questionListMode = 'normal';

    function createDefaultTournamentTeams() {
        return Array.from({ length: 8 }, (_, index) => ({
            id: index + 1,
            name: `Equipo ${index + 1}`,
            wildcardStatus: 'available'
        }));
    }

    function sanitizeTournamentTeams(teams) {
        const statuses = new Set(['available', 'used', 'expired']);
        const usedIds = new Set();
        return createDefaultTournamentTeams().map((fallback, index) => {
            const team = teams?.[index];
            const candidateId = Number.isInteger(team?.id) && team.id > 0 ? team.id : null;
            const fallbackId = Array.from({ length: 8 }, (_, teamIndex) => teamIndex + 1)
                .find(value => !usedIds.has(value));
            const id = candidateId !== null && !usedIds.has(candidateId) ? candidateId : fallbackId;
            usedIds.add(id);
            return {
                id,
                name: typeof team?.name === 'string' && team.name.trim()
                    ? team.name.trim().slice(0, 40)
                    : fallback.name,
                wildcardStatus: statuses.has(team?.wildcardStatus) ? team.wildcardStatus : 'available'
            };
        });
    }

    function playSound(audio) {
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }

    function resetStoredDataOnce() {
        // ponytail: cambia esta versión únicamente cuando se requiera otro reinicio deliberado de datos.
        const resetVersion = '2026-10-22-demografia-reset-3';
        try {
            if (localStorage.getItem('mexicanos_data_version') === resetVersion) return;
            localStorage.removeItem('mexicanos_questions');
            localStorage.removeItem('mexicanos_custom_questions');
            localStorage.removeItem('mexicanos_tournament');
            sessionStorage.removeItem('mexicanos_used_questions');
            sessionStorage.removeItem('mexicanos_used_wildcards');
            localStorage.setItem('mexicanos_data_version', resetVersion);
        } catch {
            // El juego sigue funcionando con el estado en memoria si el navegador bloquea el almacenamiento.
        }
    }

    resetStoredDataOnce();

    // ================== PANTALLAS ==================
    const homeScreen = document.getElementById('home-screen');
    const controlScreen = document.getElementById('control-screen');
    const gameScreen = document.getElementById('game-screen');
    const tournamentScreen = document.getElementById('tournament-screen');

    const urlParams = new URLSearchParams(window.location.search);
    const screenType = urlParams.get('screen');
    const screenTitles = { control: 'Control', game: 'Juego', tournament: 'Torneo' };
    document.title = `100 Mexicanos Dijeron · ${screenTitles[screenType] || 'Inicio'}`;

    const openScreen = (type) => {
        window.open(`${window.location.pathname}?screen=${type}`, '_blank');
    };

    document.querySelectorAll('[data-open-screen]').forEach(button => {
        button.addEventListener('click', () => openScreen(button.dataset.openScreen));
    });

    if (screenType === 'control') {
        homeScreen.classList.add('hidden');
        controlScreen.classList.remove('hidden');
        initControl();
    } else if (screenType === 'game') {
        homeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        initGame();
    } else if (screenType === 'tournament') {
        homeScreen.classList.add('hidden');
        tournamentScreen.classList.remove('hidden');
        initTournament();
    }

    // ================== BROADCAST ==================
    bc.onmessage = (event) => {
        if (event.data === 'request_state') {
            if (screenType === 'control') bc.postMessage(gameState);
            return;
        }
        if (!event.data || typeof event.data !== 'object') return;
        if (event.data?.type === 'match_selection') {
            if (screenType !== 'control' || !Array.isArray(event.data.teamIds) || event.data.teamIds.length !== 2) return;
            const selectedTeams = event.data.teamIds.map(id => gameState.tournamentTeams.find(team => team.id === id));
            if (selectedTeams.some(team => !team) || selectedTeams[0].id === selectedTeams[1].id) return;

            gameState.team1Name = selectedTeams[0].name;
            gameState.team2Name = selectedTeams[1].name;
            gameState.team1Score = 0;
            gameState.team2Score = 0;
            gameState.currentQuestionIndex = null;
            gameState.currentQuestionData = null;
            gameState.revealedAnswers = [];
            gameState.strikes = 0;
            gameState.pendingPoints = null;
            gameState.roundPoints = 0;
            gameState.lastScoreChange = null;
            syncControl(`Partido cargado: ${selectedTeams[0].name} vs ${selectedTeams[1].name}.`);
            return;
        }
        if (event.data?.type === 'tournament_update') {
            if (!Array.isArray(event.data.teams) || event.data.teams.length !== 8) return;
            gameState.tournamentTeams = sanitizeTournamentTeams(event.data.teams);
            gameState.bracketSlots = normalizeBracketSlots(event.data.bracketSlots, gameState.tournamentTeams);
            saveTournamentState();
            if (screenType === 'control') renderControl();
            if (screenType === 'tournament') renderTournament();
            return;
        }
        if (!Array.isArray(event.data.questions)) return;
        gameState = { ...gameState, ...event.data };
        gameState.team1Name = typeof gameState.team1Name === 'string' ? gameState.team1Name.slice(0, 40) : 'Equipo 1';
        gameState.team2Name = typeof gameState.team2Name === 'string' ? gameState.team2Name.slice(0, 40) : 'Equipo 2';
        gameState.team1Score = Number.isInteger(gameState.team1Score) && gameState.team1Score >= 0 ? gameState.team1Score : 0;
        gameState.team2Score = Number.isInteger(gameState.team2Score) && gameState.team2Score >= 0 ? gameState.team2Score : 0;
        gameState.revealedAnswers = Array.isArray(gameState.revealedAnswers) ? gameState.revealedAnswers : [];
        gameState.usedQuestionIndexes = Array.isArray(gameState.usedQuestionIndexes) ? gameState.usedQuestionIndexes : [];
        gameState.usedWildcardQuestionIds = Array.isArray(gameState.usedWildcardQuestionIds) ? gameState.usedWildcardQuestionIds : [];
        gameState.lastScoreChange ??= null;
        gameState.currentQuestionData ??= gameState.currentQuestionIndex !== null
            ? gameState.questions[gameState.currentQuestionIndex]
            : null;
        gameState.tournamentTeams = sanitizeTournamentTeams(gameState.tournamentTeams);
        gameState.bracketSlots = normalizeBracketSlots(gameState.bracketSlots, gameState.tournamentTeams);
        if (screenType === 'control') renderControl();
        if (screenType === 'game') renderGame();
        if (screenType === 'tournament') renderTournament();
    };

    const broadcast = () => bc.postMessage(gameState);

    function announce(message) {
        const status = document.getElementById('operator-status');
        if (status) status.textContent = message;
    }

    function syncControl(message) {
        broadcast();
        renderControl();
        if (message) announce(message);
    }

    function resetRoundState() {
        gameState.revealedAnswers = [];
        gameState.strikes = 0;
        gameState.pendingPoints = null;
        gameState.roundPoints = 0;
        gameState.lastScoreChange = null;
    }

    // ================== CONTROL ==================
    function initControl() {
        loadQuestions();
        loadUsedQuestions();
        loadTournamentState();
        buildModalInputs();
        buildTournamentTeamInputs();
        renderControl();
        bindControlEvents();
    }

    function bindControlEvents() {
        document.getElementById('incorrect-answer-btn').onclick = addStrike;
        document.getElementById('reset-round-btn').onclick = resetRound;
        document.getElementById('repeated-btn').onclick = () => playSound(soundRepeated);
        document.getElementById('prepare-question-btn').onclick = prepareNextQuestion;
        document.getElementById('wildcard-team').onchange = renderWildcardControls;
        document.getElementById('toggle-wildcard-btn').onclick = toggleWildcardStatus;
        document.getElementById('save-tournament-btn').onclick = saveTournamentConfiguration;

        document.getElementById('questions-list').onclick = (e) => {
            const question = e.target.closest('[data-question-index]');
            if (!question) return;
            const index = Number(question.dataset.questionIndex);
            if (question.dataset.questionType === 'wildcard') selectWildcardQuestion(index);
            else selectQuestion(index);
        };

        document.querySelector('.question-tabs').onclick = event => {
            const tab = event.target.closest('[data-question-list]');
            if (!tab) return;
            questionListMode = tab.dataset.questionList;
            renderQuestionList();
        };

        // Botones de asignación de puntos finales (Unificados)
        document.getElementById('give-team1-points').onclick = () => addPoints(1);
        document.getElementById('give-team2-points').onclick = () => addPoints(2);
        document.getElementById('undo-points-btn').onclick = undoLastPoints;

        // Eventos del Modal de Preguntas
        const modal = document.getElementById('question-modal');
        document.getElementById('add-question-btn').onclick = () => {
            document.getElementById('question-text').value = '';
            for (let i = 0; i < 8; i++) {
                document.getElementById(`modal-ans-${i}`).value = '';
                document.getElementById(`modal-pts-${i}`).value = '';
            }
            modal.classList.remove('hidden');
            document.getElementById('question-text').focus();
        };

        document.getElementById('cancel-question-btn').onclick = () => {
            modal.classList.add('hidden');
        };

        modal.addEventListener('click', event => {
            if (event.target === modal) modal.classList.add('hidden');
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !modal.classList.contains('hidden')) modal.classList.add('hidden');
        });

        document.getElementById('save-question-btn').onclick = () => {
            const questionText = document.getElementById('question-text').value.trim().slice(0, 160);
            if (!questionText) {
                alert('Por favor inserta el texto de la pregunta.');
                return;
            }

            const answers = [];
            for (let i = 0; i < 8; i++) {
                const t = document.getElementById(`modal-ans-${i}`).value.trim();
                const pointInput = document.getElementById(`modal-pts-${i}`).value;
                const p = pointInput === '' ? NaN : Number(pointInput);
                if ((t || pointInput) && (!t || !Number.isInteger(p) || p < 0 || p > 999)) {
                    alert(`Revisa la respuesta ${i + 1}: necesita texto y puntos entre 0 y 999.`);
                    return;
                }
                if (t && Number.isInteger(p) && p >= 0 && p <= 999) {
                    answers.push({ text: t.slice(0, 80), points: p });
                }
            }

            if (answers.length === 0) {
                alert('Debes agregar al menos una respuesta válida con sus puntos.');
                return;
            }

            // Ordenar respuestas de mayor a menor puntuación como en el programa original
            answers.sort((a, b) => b.points - a.points);

            gameState.questions.push({ text: questionText, answers: answers });
            saveQuestionsToStorage();
            modal.classList.add('hidden');
            renderControl();
            announce(`Pregunta creada con ${answers.length} respuestas.`);
        };
    }

    function buildModalInputs() {
        const container = document.getElementById('answers-container-inputs');
        container.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const row = document.createElement('div');
            row.className = 'flex gap-2 items-center';
            row.innerHTML = `
                 <span class="text-slate-400 font-bold w-6">${i + 1}.</span>
                 <input type="text" id="modal-ans-${i}" maxlength="80" placeholder="Respuesta" class="flex-grow bg-slate-700 rounded p-2 text-white text-sm">
                 <input type="number" id="modal-pts-${i}" min="0" max="999" placeholder="Puntos" class="w-20 bg-slate-700 rounded p-2 text-white text-sm text-center">
             `;
            container.appendChild(row);
        }
    }

    function buildTournamentTeamInputs() {
        const container = document.getElementById('tournament-team-inputs');
        container.innerHTML = '';
        gameState.tournamentTeams.forEach((team, index) => {
            const input = document.createElement('input');
            input.id = `tournament-team-${index}`;
            input.type = 'text';
            input.maxLength = 40;
            input.value = team.name;
            input.setAttribute('aria-label', `Nombre del equipo ${index + 1}`);
            container.appendChild(input);
        });
    }

    function renderControl() {
        const hasActiveQuestion = Boolean(gameState.currentQuestionData);
        document.getElementById('active-game-placeholder').classList.toggle('hidden', hasActiveQuestion);
        document.getElementById('active-game-controls').classList.toggle('hidden', !hasActiveQuestion);
        document.getElementById('current-match-label').textContent = `${gameState.team1Name} vs ${gameState.team2Name}`;
        document.getElementById('team1-score').textContent = gameState.team1Score;
        document.getElementById('team2-score').textContent = gameState.team2Score;
        document.getElementById('round-points-display').textContent = gameState.roundPoints;
        document.getElementById('incorrect-answer-btn').disabled = !hasActiveQuestion || gameState.strikes >= 3;
        document.getElementById('reset-round-btn').disabled = !hasActiveQuestion;
        document.getElementById('repeated-btn').disabled = !hasActiveQuestion;
        document.getElementById('prepare-question-btn').disabled = !hasActiveQuestion;

        renderQuestionList();

        renderActiveQuestionControl();
        renderAssignPointsBox();
        renderStrikesControl();
        renderUndoPointsButton();
        renderTournamentConfiguration();
        renderWildcardControls();
    }

    function renderQuestionList() {
        const list = document.getElementById('questions-list');
        const listScroll = list.parentElement.scrollTop;
        const isWildcardList = questionListMode === 'wildcard';
        const questions = isWildcardList ? wildcardQuestionList : gameState.questions;
        list.innerHTML = '';

        document.querySelectorAll('[data-question-list]').forEach(tab => {
            const selected = tab.dataset.questionList === questionListMode;
            tab.classList.toggle('question-tab--active', selected);
            tab.setAttribute('aria-selected', String(selected));
        });
        document.getElementById('normal-questions-tab').textContent = `Normales (${gameState.questions.length})`;
        document.getElementById('wildcard-questions-tab').textContent = `Comodines (${wildcardQuestionList.length})`;
        document.getElementById('add-question-btn').classList.toggle('hidden', isWildcardList);

        questions.forEach((question, index) => {
            const button = document.createElement('button');
            const isUsed = isWildcardList
                ? gameState.usedWildcardQuestionIds.includes(question.wildcardId)
                : gameState.usedQuestionIndexes.includes(index);
            const isActive = isWildcardList
                ? gameState.currentQuestionData?.wildcardId === question.wildcardId
                : gameState.currentQuestionIndex === index;
            button.className = `question-item ${isWildcardList ? 'question-item--wildcard' : ''} ${isActive ? 'question-item--active' : ''} ${isUsed ? 'question-item--used' : ''}`;
            button.type = 'button';
            button.dataset.questionIndex = String(index);
            button.dataset.questionType = isWildcardList ? 'wildcard' : 'normal';
            button.setAttribute('aria-current', isActive ? 'true' : 'false');
            button.setAttribute('aria-label', `${isWildcardList ? `${question.wildcardCategory}. ` : `${index + 1}. `}${question.text}${isUsed ? ', pregunta usada' : ''}`);

            if (isWildcardList) {
                const content = document.createElement('span');
                const category = document.createElement('span');
                const text = document.createElement('span');
                content.className = 'question-item__content';
                category.className = 'question-item__category';
                category.textContent = question.wildcardCategory;
                text.textContent = question.text;
                content.append(category, text);
                button.appendChild(content);
            } else {
                button.textContent = `${index + 1}. ${question.text}`;
            }
            list.appendChild(button);
        });
        list.parentElement.scrollTop = listScroll;
    }

    function renderTournamentConfiguration() {
        gameState.tournamentTeams.forEach((team, index) => {
            const input = document.getElementById(`tournament-team-${index}`);
            if (input && document.activeElement !== input) input.value = team.name;
        });
    }

    function renderWildcardControls() {
        const teamSelect = document.getElementById('wildcard-team');
        const previousTeam = teamSelect.value;
        teamSelect.innerHTML = '';

        gameState.tournamentTeams.forEach((team, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = `${team.name} — ${team.wildcardStatus === 'available' ? 'Disponible' : team.wildcardStatus === 'used' ? 'Usado' : 'Perdido'}`;
            teamSelect.appendChild(option);
        });

        if ([...teamSelect.options].some(option => option.value === previousTeam)) {
            teamSelect.value = previousTeam;
        }

        const status = document.getElementById('wildcard-team-status');
        status.innerHTML = '';
        gameState.tournamentTeams.forEach(team => {
            const chip = document.createElement('span');
            chip.className = `wildcard-status wildcard-status--${team.wildcardStatus}`;
            chip.textContent = `${team.name}: ${team.wildcardStatus === 'available' ? '★' : team.wildcardStatus === 'used' ? '✓' : '×'}`;
            status.appendChild(chip);
        });

        const available = gameState.tournamentTeams.filter(team => team.wildcardStatus === 'available').length;
        document.getElementById('wildcard-available-count').textContent = `${available} disponible${available === 1 ? '' : 's'}`;

        const selectedTeam = gameState.tournamentTeams[Number(teamSelect.value)];
        const button = document.getElementById('toggle-wildcard-btn');
        button.disabled = !selectedTeam || selectedTeam.wildcardStatus === 'expired';
        button.textContent = selectedTeam?.wildcardStatus === 'available' ? 'Marcar como usado' : 'Restaurar comodín';

        const note = document.getElementById('wildcard-note');
        note.textContent = selectedTeam?.wildcardStatus === 'expired'
            ? 'Este comodín se perdió al comenzar la final.'
            : selectedTeam?.wildcardStatus === 'used'
                ? `${selectedTeam.name} ya no tiene comodín. Puedes restaurarlo si fue un error.`
                : `${selectedTeam?.name || 'El equipo'} todavía tiene su comodín.`;
    }

    function saveTournamentConfiguration() {
        gameState.tournamentTeams = gameState.tournamentTeams.map((team, index) => ({
            ...team,
            name: document.getElementById(`tournament-team-${index}`).value.trim().slice(0, 40) || `Equipo ${index + 1}`
        }));
        saveTournamentState();
        syncControl('Nombres de los ocho equipos guardados.');
    }

    function toggleWildcardStatus() {
        const teamIndex = Number(document.getElementById('wildcard-team').value);
        const team = gameState.tournamentTeams[teamIndex];
        if (!team || team.wildcardStatus === 'expired') return;
        team.wildcardStatus = team.wildcardStatus === 'available' ? 'used' : 'available';
        saveTournamentState();
        syncControl(team.wildcardStatus === 'used'
            ? `${team.name} quedó marcado sin comodín.`
            : `Comodín de ${team.name} restaurado.`);
    }

    function selectQuestion(index) {
        if (!Number.isInteger(index) || !gameState.questions[index]) return;
        playSound(soundQuestion);
        gameState.currentQuestionIndex = index;
        gameState.currentQuestionData = gameState.questions[index];
        if (!gameState.usedQuestionIndexes.includes(index)) {
            gameState.usedQuestionIndexes.push(index);
            sessionStorage.setItem('mexicanos_used_questions', JSON.stringify(gameState.usedQuestionIndexes));
        }
        resetRoundState();
        syncControl(`Pregunta ${index + 1} cargada. Revela respuestas o registra strikes.`);
    }

    function selectWildcardQuestion(index) {
        const question = wildcardQuestionList[index];
        if (!Number.isInteger(index) || !question) return;
        playSound(soundQuestion);
        gameState.currentQuestionIndex = null;
        gameState.currentQuestionData = question;
        if (!gameState.usedWildcardQuestionIds.includes(question.wildcardId)) {
            gameState.usedWildcardQuestionIds.push(question.wildcardId);
            sessionStorage.setItem('mexicanos_used_wildcards', JSON.stringify(gameState.usedWildcardQuestionIds));
        }
        resetRoundState();
        syncControl(`Comodín · ${question.wildcardCategory}: pregunta cargada.`);
    }

    function renderActiveQuestionControl() {
        if (!gameState.currentQuestionData) return;

        const q = gameState.currentQuestionData;
        document.getElementById('active-question-title').textContent = q.text;
        document.getElementById('team1-score-display').textContent = gameState.team1Name;
        document.getElementById('team2-score-display').textContent = gameState.team2Name;

        const list = document.getElementById('active-answers-list');
        list.innerHTML = '';

        q.answers.forEach((a, i) => {
            const isRevealed = gameState.revealedAnswers.includes(i);
            const btn = document.createElement('button');
            btn.className = `control-answer ${isRevealed ? 'control-answer--revealed' : ''}`;
            const label = document.createElement('span');
            const points = document.createElement('span');
            label.textContent = a.text;
            points.textContent = a.points;
            points.className = 'bg-black/30 px-2 py-0.5 rounded';
            btn.append(label, points);
            btn.type = 'button';
            btn.disabled = isRevealed;
            btn.setAttribute('aria-label', isRevealed
                ? `${a.text}, ${a.points} puntos, ya revelada`
                : `Revelar ${a.text}, ${a.points} puntos`);
            btn.onclick = () => revealAnswer(i, a.points);
            list.appendChild(btn);
        });
    }

    function renderAssignPointsBox() {
        const pointsDiv = document.getElementById('points-buttons');
        if (gameState.pendingPoints !== null) {
            pointsDiv.classList.remove('hidden');
            document.getElementById('pending-points-value').textContent = gameState.pendingPoints;
            document.getElementById('give-team1-points').textContent = `Asignar a ${gameState.team1Name}`;
            document.getElementById('give-team2-points').textContent = `Asignar a ${gameState.team2Name}`;
        } else {
            pointsDiv.classList.add('hidden');
        }
    }

    function renderStrikesControl() {
        const strikesDiv = document.getElementById('strikes-display');
        strikesDiv.innerHTML = '';
        const label = document.createElement('span');
        label.className = gameState.strikes ? 'text-red-500' : 'text-slate-500 text-lg font-normal';
        label.textContent = gameState.strikes ? 'X'.repeat(gameState.strikes) : 'Ninguno';
        strikesDiv.appendChild(label);
    }

    function renderUndoPointsButton() {
        const button = document.getElementById('undo-points-btn');
        const change = gameState.lastScoreChange;
        button.classList.toggle('hidden', !change);
        if (!change) return;
        const teamName = change.team === 1 ? gameState.team1Name : gameState.team2Name;
        button.textContent = `↶ Deshacer +${change.points} a ${teamName}`;
    }

    function resetRound() {
        resetRoundState();
        syncControl('Ronda reiniciada: respuestas, strikes y puntos parciales quedaron en cero.');
    }

    function prepareNextQuestion() {
        gameState.currentQuestionIndex = null;
        gameState.currentQuestionData = null;
        resetRoundState();
        syncControl('Pregunta cerrada. Elige la siguiente pregunta o usa un comodín.');
    }

    function addStrike() {
        if (gameState.currentQuestionData && gameState.strikes < 3) {
            gameState.strikes++;
            playSound(soundStrike);

            if (gameState.strikes === 3) {
                gameState.pendingPoints = gameState.roundPoints;
            }

            syncControl(gameState.strikes === 3
                ? 'Tercer strike: asigna los puntos acumulados al equipo que corresponda.'
                : `Strike ${gameState.strikes} de 3 registrado.`);
        }
    }

    function revealAnswer(index, points) {
        if (!gameState.currentQuestionData || gameState.revealedAnswers.includes(index)) return;

        gameState.revealedAnswers.push(index);
        gameState.roundPoints += points;
        playSound(soundReveal);

        const totalAnswers = gameState.currentQuestionData.answers.length;

        // Si se revelaron todas o si ya tenían 3 strikes y el otro equipo robó con éxito
        if (gameState.revealedAnswers.length === totalAnswers) {
            gameState.pendingPoints = gameState.roundPoints;
        }

        syncControl(gameState.pendingPoints !== null
            ? 'Todas las respuestas están visibles. Asigna los puntos acumulados.'
            : `Respuesta revelada. La ronda suma ${gameState.roundPoints} puntos.`);
    }

    function addPoints(team) {
        if (gameState.pendingPoints === null) return;

        const awardedPoints = gameState.pendingPoints;

        if (team === 1) gameState.team1Score += awardedPoints;
        if (team === 2) gameState.team2Score += awardedPoints;

        gameState.lastScoreChange = { team, points: awardedPoints };
        gameState.pendingPoints = null;
        gameState.roundPoints = 0;

        const teamName = team === 1 ? gameState.team1Name : gameState.team2Name;
        syncControl(`${awardedPoints} puntos asignados a ${teamName}. Puedes deshacer esta acción.`);
    }

    function undoLastPoints() {
        const change = gameState.lastScoreChange;
        if (!change) return;

        if (change.team === 1) gameState.team1Score = Math.max(0, gameState.team1Score - change.points);
        if (change.team === 2) gameState.team2Score = Math.max(0, gameState.team2Score - change.points);

        gameState.pendingPoints = change.points;
        gameState.roundPoints = change.points;
        gameState.lastScoreChange = null;
        syncControl(`Asignación corregida. Vuelve a elegir quién recibe ${change.points} puntos.`);
    }

    // ================== TORNEO ==================
    function initTournament() {
        loadTournamentState();
        renderTournament();
        document.getElementById('shuffle-teams-btn').onclick = animateTournamentShuffle;
        document.querySelector('.tournament-bracket').onclick = handleBracketPick;
        document.querySelector('.tournament-bracket').onchange = handleBracketSlotChange;
        bc.postMessage('request_state');
    }

    function renderTournament(teams = gameState.tournamentTeams) {
        const shuffleButton = document.getElementById('shuffle-teams-btn');
        const tournamentStarted = Object.values(gameState.bracketSlots).some(slots => slots.some(id => id !== null));
        const semifinalIds = new Set(gameState.bracketSlots.semifinal.filter(id => id !== null));
        const finalIds = new Set(gameState.bracketSlots.final.filter(id => id !== null));
        const championId = gameState.bracketSlots.champion[0];
        const trackedIds = new Set(selectedMatchTeamIds);
        shuffleButton.disabled = isTournamentShuffling || tournamentStarted;
        shuffleButton.title = tournamentStarted
            ? 'El torneo ya tiene resultados registrados'
            : 'Mezcla los ocho equipos antes de iniciar el torneo';

        document.querySelectorAll('.bracket-team').forEach((node, index) => {
            const team = teams[index];
            node.textContent = team.name;
            node.dataset.wildcard = team.wildcardStatus;
            node.dataset.teamId = String(team.id);
            node.disabled = false;
            const isSelected = selectedMatchRound === 'quarterfinal' && selectedMatchTeamIds.includes(team.id);
            node.classList.toggle('bracket-node--selected', isSelected);
            node.classList.toggle('bracket-node--path-out', semifinalIds.has(team.id));
            node.classList.toggle('bracket-node--tracked', trackedIds.has(team.id));
            node.setAttribute('aria-pressed', String(isSelected));
            node.setAttribute('aria-label', `${team.name}, comodín ${team.wildcardStatus === 'available' ? 'disponible' : team.wildcardStatus === 'used' ? 'usado' : 'perdido'}`);
        });

        document.querySelectorAll('[data-slot-round]').forEach(node => {
            const round = node.dataset.slotRound;
            const index = Number(node.dataset.slotIndex);
            const selectedId = gameState.bracketSlots[round][index];
            const selectedInRound = new Set(gameState.bracketSlots[round].filter((id, slotIndex) => id !== null && slotIndex !== index));
            const select = node.querySelector('.bracket-slot-select');
            const pick = node.querySelector('.bracket-pick');
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = round === 'semifinal' ? `Ganador ${index + 1}` : round === 'final' ? `Finalista ${index + 1}` : 'Elegir campeón';
            select.innerHTML = '';
            select.appendChild(placeholder);
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = String(team.id);
                option.textContent = team.name;
                option.disabled = selectedInRound.has(team.id);
                select.appendChild(option);
            });
            select.value = selectedId === null ? '' : String(selectedId);
            node.dataset.teamId = selectedId === null ? '' : String(selectedId);
            node.classList.toggle('bracket-node--selected', selectedMatchRound === round && selectedId !== null && selectedMatchTeamIds.includes(selectedId));
            node.classList.toggle('bracket-node--path-in', selectedId !== null);
            node.classList.toggle('bracket-node--path-out', selectedId !== null && (
                (round === 'semifinal' && finalIds.has(selectedId)) ||
                (round === 'final' && championId === selectedId)
            ));
            node.classList.toggle('bracket-node--tracked', selectedId !== null && trackedIds.has(selectedId));
            if (pick) {
                pick.disabled = selectedId === null;
                pick.setAttribute('aria-label', selectedId === null ? 'Primero selecciona un equipo' : `Elegir ${teams.find(team => team.id === selectedId)?.name || 'equipo'} para el partido`);
            }
        });

        document.querySelectorAll('.bracket-match').forEach(match => {
            match.classList.toggle('bracket-match--route', Boolean(match.querySelector('.bracket-node--path-out')));
            match.classList.toggle('bracket-match--tracked', Boolean(match.querySelector('.bracket-node--tracked')));
        });
        document.querySelectorAll('.bracket-round:not(.bracket-round--teams)').forEach(round => {
            round.classList.toggle('bracket-round--has-route', Boolean(round.querySelector('.bracket-node--path-in')));
            round.classList.toggle('bracket-round--tracked-route', Boolean(round.querySelector('.bracket-node--tracked')));
        });
    }

    function handleBracketSlotChange(event) {
        const select = event.target.closest('.bracket-slot-select');
        if (!select) return;
        const node = select.closest('[data-slot-round]');
        const value = select.value === '' ? null : Number(select.value);
        gameState.bracketSlots[node.dataset.slotRound][Number(node.dataset.slotIndex)] = value;
        saveTournamentState();
        broadcastTournamentUpdate();
        renderTournament();
    }

    function handleBracketPick(event) {
        const trigger = event.target.closest('.bracket-team, .bracket-pick');
        if (!trigger || trigger.disabled) return;
        const node = trigger.classList.contains('bracket-team') ? trigger : trigger.closest('[data-slot-round]');
        const round = trigger.classList.contains('bracket-team') ? 'quarterfinal' : node.dataset.slotRound;
        const teamId = Number(node.dataset.teamId);
        if (!Number.isInteger(teamId)) return;

        if (selectedMatchRound !== null && selectedMatchRound !== round) selectedMatchTeamIds = [];
        selectedMatchRound = round;

        if (selectedMatchTeamIds.includes(teamId)) {
            selectedMatchTeamIds = selectedMatchTeamIds.filter(id => id !== teamId);
        } else {
            selectedMatchTeamIds = selectedMatchTeamIds.length < 2 ? [...selectedMatchTeamIds, teamId] : [teamId];
        }
        if (selectedMatchTeamIds.length === 0) selectedMatchRound = null;

        renderTournament();
        if (selectedMatchTeamIds.length !== 2) {
            document.getElementById('tournament-match-status').textContent = selectedMatchTeamIds.length === 1
                ? 'Selecciona el segundo equipo del enfrentamiento.'
                : 'Selecciona dos equipos de la misma ronda para enviarlos al juego.';
            return;
        }

        if (selectedMatchRound === 'final') {
            gameState.tournamentTeams.forEach(team => {
                if (team.wildcardStatus === 'available') team.wildcardStatus = 'expired';
            });
            saveTournamentState();
            broadcastTournamentUpdate();
        }
        const selectedNames = selectedMatchTeamIds.map(id => gameState.tournamentTeams.find(team => team.id === id)?.name);
        document.getElementById('tournament-match-status').textContent = `${selectedNames[0]} vs ${selectedNames[1]} enviado al panel.`;
        bc.postMessage({ type: 'match_selection', teamIds: selectedMatchTeamIds });
    }

    function normalizeBracketSlots(slots, teams) {
        const validIds = new Set(teams.map(team => team.id));
        const clean = (values, length) => {
            const used = new Set();
            return Array.from({ length }, (_, index) => {
                const value = Array.isArray(values) ? values[index] : null;
                if (!validIds.has(value) || used.has(value)) return null;
                used.add(value);
                return value;
            });
        };
        return {
            semifinal: clean(slots?.semifinal, 4),
            final: clean(slots?.final, 2),
            champion: clean(slots?.champion, 1)
        };
    }

    function broadcastTournamentUpdate() {
        bc.postMessage({
            type: 'tournament_update',
            teams: gameState.tournamentTeams,
            bracketSlots: gameState.bracketSlots
        });
    }

    function shuffledCopy(items) {
        const result = [...items];
        const random = new Uint32Array(1);
        for (let i = result.length - 1; i > 0; i--) {
            const range = i + 1;
            const limit = Math.floor(0x100000000 / range) * range;
            do crypto.getRandomValues(random); while (random[0] >= limit);
            const j = random[0] % range;
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    function animateTournamentShuffle() {
        const button = document.getElementById('shuffle-teams-btn');
        const bracket = document.querySelector('.tournament-bracket');
        if (button.disabled || isTournamentShuffling) return;
        isTournamentShuffling = true;
        button.disabled = true;
        bracket.classList.add('bracket-shuffling');

        let spins = 0;
        const animation = setInterval(() => {
            renderTournament(shuffledCopy(gameState.tournamentTeams));
            spins++;
            if (spins < 22) return;

            clearInterval(animation);
            gameState.tournamentTeams = shuffledCopy(gameState.tournamentTeams);
            gameState.bracketSlots = normalizeBracketSlots(null, gameState.tournamentTeams);
            selectedMatchTeamIds = [];
            selectedMatchRound = null;
            saveTournamentState();
            isTournamentShuffling = false;
            renderTournament();
            broadcastTournamentUpdate();
            bracket.classList.remove('bracket-shuffling');
        }, 75);
    }

    // ================== GAME ==================
    function initGame() {
        bc.postMessage('request_state');
    }

    function renderGame() {
        document.getElementById('game-team1-name').textContent = gameState.team1Name.toUpperCase();
        document.getElementById('game-team2-name').textContent = gameState.team2Name.toUpperCase();
        document.getElementById('game-team1-score').textContent = gameState.team1Score;
        document.getElementById('game-team2-score').textContent = gameState.team2Score;
        document.getElementById('game-round-points').textContent = gameState.roundPoints;

        const strikeOverlay = document.getElementById('strike-overlay');
        if (gameState.strikes > renderedStrikes) {
            const label = `${gameState.strikes} ${gameState.strikes === 1 ? 'strike' : 'strikes'}`;
            document.getElementById('strike-overlay-marks').textContent = 'X'.repeat(gameState.strikes);
            strikeOverlay.setAttribute('aria-label', label);
            strikeOverlay.setAttribute('aria-hidden', 'false');
            strikeOverlay.classList.remove('strike-overlay--visible');
            void strikeOverlay.offsetWidth;
            strikeOverlay.classList.add('strike-overlay--visible');
            clearTimeout(strikeOverlayTimer);
            strikeOverlayTimer = setTimeout(() => {
                strikeOverlay.classList.remove('strike-overlay--visible');
                strikeOverlay.setAttribute('aria-hidden', 'true');
            }, 1400);
        } else if (gameState.strikes === 0) {
            strikeOverlay.classList.remove('strike-overlay--visible');
            strikeOverlay.setAttribute('aria-hidden', 'true');
        }
        renderedStrikes = gameState.strikes;

        const board = document.getElementById('game-board');

        if (!gameState.currentQuestionData) {
            board.innerHTML = '';
            const questionTitle = document.getElementById('game-question-title');
            questionTitle.textContent = 'Esperando pregunta...';
            questionTitle.classList.remove('game-question--wildcard');
            return;
        }

        const q = gameState.currentQuestionData;
        const questionTitle = document.getElementById('game-question-title');
        questionTitle.textContent = q.text;
        questionTitle.classList.toggle('game-question--wildcard', Boolean(q.wildcardCategory));
        board.innerHTML = '';

        q.answers.forEach((a, i) => {
            const div = document.createElement('div');
            const isRevealed = gameState.revealedAnswers.includes(i);
            const answerLengthClass = a.text.length > 60 ? 'answer-card--very-long' : a.text.length > 34 ? 'answer-card--long' : '';

            div.className = `answer-card ${answerLengthClass} ${isRevealed ? 'revealed' : ''}`;

            const front = document.createElement('div');
            const number = document.createElement('span');
            const back = document.createElement('div');
            const answer = document.createElement('span');
            const points = document.createElement('span');
            front.className = 'front';
            number.className = 'answer-number';
            number.textContent = i + 1;
            back.className = 'back';
            answer.className = 'answer-text';
            answer.textContent = a.text;
            points.className = 'answer-points';
            points.textContent = a.points;
            front.appendChild(number);
            back.append(answer, points);
            div.append(front, back);
            board.appendChild(div);
        });

        for (let i = 1; i <= 3; i++) {
            document.getElementById(`strike-${i}`).classList.toggle('opacity-0', i > gameState.strikes);
        }
    }

    // ================== STORAGE ==================
    function loadQuestions() {
        const local = localStorage.getItem('mexicanos_custom_questions');
        try {
            const saved = local ? JSON.parse(local) : [];
            const valid = Array.isArray(saved) && saved.every(question =>
                typeof question.text === 'string' &&
                Array.isArray(question.answers) &&
                question.answers.length > 0 &&
                question.answers.length <= 8 &&
                question.answers.every(answer =>
                    typeof answer.text === 'string' &&
                    Number.isInteger(answer.points) &&
                    answer.points >= 0 &&
                    answer.points <= 999
                )
            );
            if (valid) {
                gameState.questions = [...defaultQuestions, ...saved];
                return;
            }
        } catch {
            localStorage.removeItem('mexicanos_custom_questions');
        }

        gameState.questions = [...defaultQuestions];
        saveQuestionsToStorage();
    }

    function loadUsedQuestions() {
        try {
            const used = JSON.parse(sessionStorage.getItem('mexicanos_used_questions') || '[]');
            const usedWildcards = JSON.parse(sessionStorage.getItem('mexicanos_used_wildcards') || '[]');
            gameState.usedQuestionIndexes = Array.isArray(used)
                ? used.filter(index => Number.isInteger(index) && index >= 0 && index < gameState.questions.length)
                : [];
            const validWildcardIds = new Set(wildcardQuestionList.map(question => question.wildcardId));
            gameState.usedWildcardQuestionIds = Array.isArray(usedWildcards)
                ? usedWildcards.filter(id => validWildcardIds.has(id))
                : [];
        } catch {
            gameState.usedQuestionIndexes = [];
            gameState.usedWildcardQuestionIds = [];
            sessionStorage.removeItem('mexicanos_used_questions');
            sessionStorage.removeItem('mexicanos_used_wildcards');
        }
    }

    function loadTournamentState() {
        try {
            const saved = JSON.parse(localStorage.getItem('mexicanos_tournament') || 'null');
            if (!saved || !Array.isArray(saved.teams) || saved.teams.length !== 8) return;

            gameState.tournamentTeams = sanitizeTournamentTeams(saved.teams);
            gameState.bracketSlots = normalizeBracketSlots(saved.bracketSlots, gameState.tournamentTeams);
        } catch {
            localStorage.removeItem('mexicanos_tournament');
        }
    }

    function saveTournamentState() {
        localStorage.setItem('mexicanos_tournament', JSON.stringify({
            teams: gameState.tournamentTeams,
            bracketSlots: gameState.bracketSlots
        }));
    }

    function saveQuestionsToStorage() {
        localStorage.setItem('mexicanos_custom_questions', JSON.stringify(gameState.questions.slice(defaultQuestions.length)));
    }
});
