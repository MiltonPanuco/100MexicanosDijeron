import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('./script.js', import.meta.url), 'utf8');
const questionsJs = readFileSync(new URL('./questions.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
assert.ok(existsSync(new URL('./icon.jpg', import.meta.url)), 'Falta el icono icon.jpg');

assert.doesNotThrow(() => new Function(js), 'script.js debe tener sintaxis válida');
assert.doesNotThrow(() => new Function(questionsJs), 'questions.js debe tener sintaxis válida');

const questionWindow = {};
new Function('window', questionsJs)(questionWindow);
const { normal: defaultQuestions, wildcard: wildcardQuestions } = questionWindow.QUESTION_BANK;

function functionSource(name) {
    const start = js.indexOf(`function ${name}(`);
    assert.notEqual(start, -1, `Falta la función ${name}`);
    const bodyStart = js.indexOf('{', start);
    let depth = 0;
    for (let index = bodyStart; index < js.length; index++) {
        if (js[index] === '{') depth++;
        if (js[index] === '}' && --depth === 0) return js.slice(start, index + 1);
    }
    assert.fail(`La función ${name} no está balanceada`);
}

const tournamentHelpers = new Function(`
    ${functionSource('createDefaultTournamentTeams')}
    ${functionSource('sanitizeTournamentTeams')}
    ${functionSource('normalizeBracketSlots')}
    return { sanitizeTournamentTeams, normalizeBracketSlots };
`)();
const sanitizedTeams = tournamentHelpers.sanitizeTournamentTeams([
    { id: 1, name: ' A ', wildcardStatus: 'used' },
    { id: 1, name: '', wildcardStatus: 'invalid' },
    ...Array.from({ length: 6 }, (_, index) => ({ id: index + 3, name: `Equipo ${index + 3}` }))
]);
assert.equal(new Set(sanitizedTeams.map(team => team.id)).size, 8, 'Los equipos deben conservar id únicos');
assert.equal(sanitizedTeams[0].name, 'A');
assert.equal(sanitizedTeams[1].wildcardStatus, 'available');
const normalizedSlots = tournamentHelpers.normalizeBracketSlots({ semifinal: [1, 1, 3, 99] }, sanitizedTeams);
assert.deepEqual(normalizedSlots.semifinal, [1, null, 3, null], 'Una ronda no debe repetir equipos ni aceptar ids desconocidos');

assert.equal(defaultQuestions.length, 40, 'Debe haber exactamente 40 preguntas normales');
assert.ok(defaultQuestions.every(question =>
    question.answers.length === 5 && question.answers.reduce((total, answer) => total + answer.points, 0) === 100
), 'Cada pregunta normal debe tener 5 respuestas y sumar 100 puntos');

assert.equal(Object.keys(wildcardQuestions).length, 10, 'Debe haber exactamente 10 categorías de comodín');
assert.ok(Object.values(wildcardQuestions).every(questions => questions.length === 2), 'Cada categoría debe tener exactamente 2 preguntas');
assert.ok(Object.values(wildcardQuestions).flat().every(question =>
    question.answers.reduce((total, answer) => total + answer.points, 0) === 100
), 'Cada pregunta de comodín debe sumar 100 puntos');
for (const requiredCategory of ['Cine', 'Deportes', 'UAN', 'Videojuegos']) {
    assert.ok(wildcardQuestions[requiredCategory], `Falta la categoría ${requiredCategory}`);
}
assert.ok(wildcardQuestions.Cine.some(question => question.answers.some(answer => answer.text === 'Drake & Josh')));
assert.ok(wildcardQuestions.Videojuegos.some(question => question.answers.some(answer => answer.text === 'PAC-MAN')));
assert.ok(wildcardQuestions.UAN.some(question => question.answers.some(answer => answer.text === 'Se me atravesó el tren')));
assert.ok(wildcardQuestions.Música.some(question => question.answers.some(answer => answer.text === 'Natanael Cano')));

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(htmlIds).size, htmlIds.length, 'Los id del HTML deben ser únicos');

const staticIdReferences = [...js.matchAll(/getElementById\('([^'$]+)'\)/g)].map(match => match[1]);
for (const id of new Set(staticIdReferences)) {
    assert.ok(htmlIds.includes(id), `Falta el elemento #${id} usado por script.js`);
}

assert.equal((html.match(/<div\b/g) || []).length, (html.match(/<\/div>/g) || []).length, 'Las etiquetas div deben estar balanceadas');
assert.equal((css.match(/{/g) || []).length, (css.match(/}/g) || []).length, 'Las llaves de styles.css deben estar balanceadas');
assert.doesNotMatch(html, /\sonclick=/, 'Los eventos deben enlazarse desde script.js');
assert.match(html, /<link rel="icon" type="image\/jpeg" href="icon\.jpg">/);
assert.ok(html.indexOf('src="questions.js"') < html.indexOf('src="script.js"'), 'El banco debe cargar antes que la lógica');
assert.match(js, /window\.QUESTION_BANK\.normal/);
assert.doesNotMatch(js, /Menciona un dato que se pregunta en un censo/, 'Las preguntas no deben vivir en script.js');
assert.match(js, /document\.title = `100 Mexicanos Dijeron ·/);
assert.doesNotMatch(html, /id="tournament-stage"/, 'No debe existir un selector de ronda actual');
assert.doesNotMatch(js, /gameState\.tournamentStage/, 'El cronograma no debe bloquearse por una ronda actual');
assert.match(html, /id="strike-overlay"/);
assert.match(js, /'X'\.repeat\(gameState\.strikes\)/);
assert.match(css, /\.answer-card--very-long/);
assert.match(css, /-webkit-line-clamp:\s*2/);
assert.match(js, /createElement\('button'\)/);
assert.match(css, /\.control-card/);
assert.match(js, /function undoLastPoints\(\)/);
assert.match(js, /usedQuestionIndexes\.includes\(index\)/);
assert.match(js, /function loadUsedQuestions\(\)/);
assert.match(css, /\.question-item--used::after/);
assert.match(html, /id="tournament-screen"/);
assert.match(html, /id="toggle-wildcard-btn"/);
assert.match(html, /id="normal-questions-tab"/);
assert.match(html, /id="wildcard-questions-tab"/);
assert.match(html, /<details class="wildcard-panel">/);
assert.match(js, /function toggleWildcardStatus\(\)/);
assert.match(js, /function selectWildcardQuestion\(index\)/);
assert.match(js, /function resetStoredDataOnce\(\)/);
assert.match(js, /removeItem\('mexicanos_questions'\)/);
assert.match(js, /mexicanos_custom_questions/);
assert.match(js, /removeItem\('mexicanos_tournament'\)/);
assert.match(js, /removeItem\('mexicanos_used_questions'\)/);
assert.match(js, /crypto\.getRandomValues/);
assert.match(js, /wildcardStatus = 'expired'/);
assert.match(js, /type: 'tournament_update'/);
assert.match(js, /type: 'match_selection'/);
assert.match(js, /function normalizeBracketSlots\(/);
assert.match(js, /function sanitizeTournamentTeams\(/);
assert.match(js, /function resetRoundState\(/);
assert.match(js, /game-question--wildcard/);
assert.match(html, /class="bracket-slot-select"/);
assert.match(html, /id="operator-status"[^>]*aria-live="polite"/);
assert.match(css, /@keyframes jackpot-shift/);
assert.match(js, /bracket-node--path-out/);
assert.match(js, /bracket-node--tracked/);
assert.match(css, /\.bracket-node--path-in/);
assert.match(css, /\.bracket-round--tracked-route/);
console.log(`OK: sintaxis, ${htmlIds.length} elementos, tablero, panel, comodines y torneo verificados.`);
