const setupScreen = document.getElementById('setupScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const difficultySelect = document.getElementById('difficulty');
const questionCountSelect = document.getElementById('questionCount');
const categorySelect = document.getElementById('category');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreEl = document.getElementById('score');
const questionCounter = document.getElementById('questionCounter');
const skillBadge = document.getElementById('skillBadge');
const questionText = document.getElementById('questionText');
const answerArea = document.getElementById('answerArea');
const feedback = document.getElementById('feedback');
const visualArea = document.getElementById('visualArea');
const finalScore = document.getElementById('finalScore');
const finalMessage = document.getElementById('finalMessage');
const miniGameBtn = document.getElementById('miniGameBtn');
const gameScreen = document.getElementById('gameScreen');
const gameTitle = document.getElementById('gameTitle');
const gameInstructions = document.getElementById('gameInstructions');
const gameTimer = document.getElementById('gameTimer');
const gameScore = document.getElementById('gameScore');
const gameCanvas = document.getElementById('gameCanvas');
const stopGameBtn = document.getElementById('stopGameBtn');
const backToResultsBtn = document.getElementById('backToResultsBtn');

let state = {
  difficulty: 'medium',
  total: 10,
  category: 'arithmetic',
  current: 0,
  score: 0,
  question: null,
  selectedAnswer: null,
  answered: false,
  bonusUnlocked: false,
  bonusGameType: null,
  bonusConsumed: false
};

const names = ['Mia', 'Leo', 'Aisha', 'Noah', 'Sofia', 'Ethan', 'Zara', 'Kai'];
const objects = ['apples', 'stickers', 'marbles', 'stars', 'cookies', 'cards', 'blocks', 'shells'];
const contexts = ['space', 'jungle', 'school', 'sports day', 'bakery', 'toy shop', 'aquarium'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function numberRange() {
  if (state.difficulty === 'easy') return { min: 1, max: 10 };
  if (state.difficulty === 'medium') return { min: 5, max: 40 };
  return { min: 12, max: 120 };
}

function makeChoices(correct) {
  const choices = new Set([String(correct)]);
  while (choices.size < 4) {
    const offset = randInt(-10, 10) || 1;
    const wrong = Number(correct) + offset;
    if (wrong >= 0) choices.add(String(wrong));
  }
  return shuffle([...choices]);
}

function formatOp(op) {
  if (op === '*') return 'x';
  if (op === '/') return '÷';
  return op;
}

function generateMultiExpressionQuestion() {
  const difficulty = state.difficulty;
  const termCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? randInt(3, 4) : randInt(4, 5);
  const maxStart = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 75 : 150;
  const maxTerm = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
  let value = randInt(10, maxStart);
  let expression = String(value);

  for (let i = 1; i < termCount; i++) {
    let op = pick(['+', '-']);
    let n = randInt(1, maxTerm);
    if (op === '-' && value - n < 0) op = '+';
    value = op === '+' ? value + n : value - n;
    expression += ` ${op} ${n}`;
  }

  const styles = ['direct', 'multiple', 'truefalse'];
  const style = pick(styles);

  if (style === 'multiple') {
    return { skill: 'Arithmetic: Multi-Step', type: 'multiple', text: `What is ${expression}?`, answer: String(value), choices: makeChoices(value) };
  }
  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? value : value + randInt(1, 8);
    return { skill: 'Arithmetic: Multi-Step', type: 'truefalse', text: `${expression} = ${shown}`, answer: String(shown === value) };
  }
  return { skill: 'Arithmetic: Multi-Step', type: 'input', text: `Solve: ${expression}`, answer: String(value) };
}

function missingOperandQuestion() {
  const range = numberRange();
  const op = pick(state.difficulty === 'easy' ? ['+', '-'] : ['+', '-', 'x', '÷']);

  if (op === '+') {
    const a = randInt(range.min, Math.min(range.max, 60));
    const b = randInt(range.min, Math.min(range.max, 60));
    const sum = a + b;
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Missing Number', type: 'input', text: `___ + ${b} = ${sum}`, answer: String(a) }
      : { skill: 'Missing Number', type: 'input', text: `${a} + ___ = ${sum}`, answer: String(b) };
  }

  if (op === '-') {
    const result = randInt(1, Math.min(range.max, 60));
    const b = randInt(1, Math.min(range.max, 40));
    const a = result + b;
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Missing Number', type: 'input', text: `___ - ${b} = ${result}`, answer: String(a) }
      : { skill: 'Missing Number', type: 'input', text: `${a} - ___ = ${result}`, answer: String(b) };
  }

  if (op === 'x') {
    const maxFactor = state.difficulty === 'medium' ? 12 : 15;
    const a = randInt(2, maxFactor);
    const b = randInt(2, maxFactor);
    const product = a * b;
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Missing Number', type: 'input', text: `___ x ${b} = ${product}`, answer: String(a) }
      : { skill: 'Missing Number', type: 'input', text: `${a} x ___ = ${product}`, answer: String(b) };
  }

  const maxQuotient = state.difficulty === 'medium' ? 12 : 20;
  const maxDivisor = state.difficulty === 'medium' ? 10 : 12;
  const quotient = randInt(2, maxQuotient);
  const divisor = randInt(2, maxDivisor);
  const dividend = quotient * divisor;
  const style = pick(['missingDividend', 'missingDivisor']);
  return style === 'missingDividend'
    ? { skill: 'Missing Number', type: 'input', text: `___ ÷ ${divisor} = ${quotient}`, answer: String(dividend) }
    : { skill: 'Missing Number', type: 'input', text: `${dividend} ÷ ___ = ${quotient}`, answer: String(divisor) };
}

function divisionQuestion() {
  const maxQuotient = state.difficulty === 'easy' ? 10 : state.difficulty === 'medium' ? 12 : 20;
  const maxDivisor = state.difficulty === 'easy' ? 5 : state.difficulty === 'medium' ? 10 : 12;
  const quotient = randInt(1, maxQuotient);
  const divisor = randInt(2, maxDivisor);
  const dividend = quotient * divisor;
  const styles = ['direct', 'multiple', 'missing', 'truefalse'];
  const style = pick(styles);

  if (style === 'multiple') {
    return { skill: 'Arithmetic: Division', type: 'multiple', text: `What is ${dividend} ÷ ${divisor}?`, answer: String(quotient), choices: makeChoices(quotient) };
  }
  if (style === 'missing') {
    return { skill: 'Missing Number', type: 'input', text: `${dividend} ÷ ___ = ${quotient}`, answer: String(divisor) };
  }
  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? quotient : quotient + randInt(1, 4);
    return { skill: 'Arithmetic: Division', type: 'truefalse', text: `${dividend} ÷ ${divisor} = ${shown}`, answer: String(shown === quotient) };
  }
  return { skill: 'Arithmetic: Division', type: 'input', text: `Solve: ${dividend} ÷ ${divisor}`, answer: String(quotient) };
}

function arithmeticQuestion() {
  if (Math.random() < 0.28) return generateMultiExpressionQuestion();
  if (Math.random() < 0.28) return missingOperandQuestion();
  if (state.difficulty !== 'easy' && Math.random() < 0.22) return divisionQuestion();

  const range = numberRange();
  const ops = state.difficulty === 'easy' ? ['+', '-'] : ['+', '-', 'x'];
  const op = pick(ops);
  let a = randInt(range.min, range.max);
  let b = randInt(range.min, Math.min(range.max, state.difficulty === 'hard' ? 15 : range.max));
  let answer;

  if (op === '+') answer = a + b;
  if (op === '-') {
    if (b > a) [a, b] = [b, a];
    answer = a - b;
  }
  if (op === 'x') answer = a * b;

  const styles = ['direct', 'multiple', 'missing', 'truefalse'];
  const style = pick(styles);

  if (style === 'multiple') {
    return { skill: 'Arithmetic', type: 'multiple', text: `What is ${a} ${op} ${b}?`, answer: String(answer), choices: makeChoices(answer) };
  }
  if (style === 'missing') {
    return missingOperandQuestion();
  }
  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? answer : answer + randInt(1, 5);
    return { skill: 'True / False', type: 'truefalse', text: `${a} ${op} ${b} = ${shown}`, answer: String(shown === answer) };
  }
  return { skill: 'Arithmetic', type: 'input', text: `Solve: ${a} ${op} ${b}`, answer: String(answer) };
}


function multiplicationOnlyQuestion() {
  const a = randInt(1, 12);
  const b = randInt(1, 12);
  const product = a * b;
  const style = pick(['direct', 'missing', 'multiple', 'truefalse']);

  if (style === 'missing') {
    const hideFirst = Math.random() > 0.5;
    return hideFirst
      ? { skill: 'Times Tables: Missing Number', type: 'input', text: `___ x ${b} = ${product}`, answer: String(a) }
      : { skill: 'Times Tables: Missing Number', type: 'input', text: `${a} x ___ = ${product}`, answer: String(b) };
  }

  if (style === 'multiple') {
    return { skill: 'Times Tables', type: 'multiple', text: `What is ${a} x ${b}?`, answer: String(product), choices: makeChoices(product) };
  }

  if (style === 'truefalse') {
    const shown = Math.random() > 0.5 ? product : product + pick([-12, -6, -4, -3, 3, 4, 6, 12]);
    return { skill: 'Times Tables: True / False', type: 'truefalse', text: `${a} x ${b} = ${shown}`, answer: String(shown === product) };
  }

  return { skill: 'Times Tables', type: 'input', text: `Solve: ${a} x ${b}`, answer: String(product) };
}

function wordProblemQuestion() {
  const range = numberRange();
  const name = pick(names);
  const item = pick(objects);
  const place = pick(contexts);
  const extraFact = Math.random() < 0.35;
  const twoStep = Math.random() < 0.4;
  const style = Math.random() > 0.45 ? 'multiple' : 'input';
  const extra = extraFact ? ` There are ${randInt(2, 9)} ${pick(['trees', 'benches', 'posters', 'birds', 'windows'])} nearby.` : '';

  if (twoStep) {
    const start = randInt(Math.max(range.min, 5), Math.min(range.max, 60));
    const gain = randInt(2, Math.min(range.max, 30));
    const loss = randInt(1, Math.min(start + gain - 1, 25));
    const answer = start + gain - loss;
    const text = `${name} is at the ${place}. ${name} starts with ${start} ${item}, gets ${gain} more, then gives away ${loss}.${extra} How many ${item} does ${name} have now?`;
    return { skill: 'Word Problem: Two-Step', type: style, text, answer: String(answer), choices: makeChoices(answer) };
  }

  const a = randInt(range.min, Math.min(range.max, 50));
  const b = randInt(1, Math.min(range.max, 30));
  const add = Math.random() > 0.35;
  const usedB = Math.min(a, b);
  const answer = add ? a + b : a - usedB;
  const text = add
    ? `${name} is at the ${place}. ${name} has ${a} ${item} and gets ${b} more.${extra} How many ${item} does ${name} have now?`
    : `${name} is at the ${place}. ${name} has ${a} ${item} and gives away ${usedB}.${extra} How many ${item} are left?`;
  return { skill: extraFact ? 'Word Problem: Extra Fact' : 'Word Problem', type: style, text, answer: String(answer), choices: makeChoices(answer) };
}

function geometryQuestion() {
  const shapes = [
    { name: 'triangle', sides: 3 },
    { name: 'square', sides: 4 },
    { name: 'rectangle', sides: 4 },
    { name: 'pentagon', sides: 5 },
    { name: 'hexagon', sides: 6 }
  ];
  const shape = pick(shapes);
  const svg = shapeSvg(shape.name);
  const choices = shuffle(['triangle', 'square', 'rectangle', 'pentagon', 'hexagon']);
  return { skill: 'Geometry: Shape ID', type: 'multiple', text: 'What shape is shown?', answer: shape.name, choices, visual: svg };
}

function areaPerimeterQuestion() {
  const maxSide = state.difficulty === 'easy' ? 8 : state.difficulty === 'medium' ? 14 : 24;
  const minSide = state.difficulty === 'easy' ? 2 : 4;
  const length = randInt(minSide + 1, maxSide);
  const width = randInt(minSide, Math.max(minSide, length - 1));
  const askArea = Math.random() > 0.5;
  const answer = askArea ? length * width : 2 * (length + width);
  const label = askArea ? 'area' : 'perimeter';
  const text = `The rectangle has length ${length} and width ${width}. What is its ${label}?`;
  return {
    skill: askArea ? 'Geometry: Area' : 'Geometry: Perimeter',
    type: Math.random() > 0.4 ? 'input' : 'multiple',
    text,
    answer: String(answer),
    choices: makeChoices(answer),
    visual: rectangleSvg(length, width)
  };
}

function rectangleSvg(length, width) {
  return `<svg viewBox="0 0 320 210" width="320" aria-label="rectangle with length ${length} and width ${width}">
    <rect x="70" y="45" width="190" height="110" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="5" />
    <text x="165" y="30" text-anchor="middle" font-size="18" font-weight="700" fill="#14532d">length = ${length}</text>
    <text x="280" y="105" text-anchor="middle" font-size="18" font-weight="700" fill="#14532d" transform="rotate(90 280 105)">width = ${width}</text>
  </svg>`;
}

function shapeSvg(name) {
  const map = {
    triangle: '<polygon points="120,20 220,180 20,180" />',
    square: '<rect x="45" y="35" width="150" height="150" rx="8" />',
    rectangle: '<rect x="25" y="55" width="190" height="115" rx="8" />',
    pentagon: '<polygon points="120,20 215,90 180,190 60,190 25,90" />',
    hexagon: '<polygon points="75,35 165,35 220,110 165,185 75,185 20,110" />'
  };
  return `<svg viewBox="0 0 240 220" width="260" aria-label="${name}"><g fill="#bfdbfe" stroke="#2563eb" stroke-width="6">${map[name]}</g></svg>`;
}

function patternQuestion() {
  const start = randInt(1, 8);
  const step = state.difficulty === 'easy' ? randInt(1, 4) : randInt(2, 9);
  const sequence = [start, start + step, start + step * 2, start + step * 3];
  const answer = start + step * 4;
  return { skill: 'Pattern Recognition', type: Math.random() > 0.5 ? 'multiple' : 'input', text: `What comes next? ${sequence.join(', ')}, ___`, answer: String(answer), choices: makeChoices(answer) };
}

function spatialQuestion() {
  const count = state.difficulty === 'easy' ? randInt(3, 6) : state.difficulty === 'medium' ? randInt(5, 10) : randInt(8, 15);
  return { skill: 'Spatial Reasoning', type: 'input', text: 'How many blocks are shown?', answer: String(count), visual: blocksSvg(count) };
}

function blocksSvg(count) {
  let blocks = '';
  for (let i = 0; i < count; i++) {
    const x = 20 + (i % 5) * 42;
    const y = 25 + Math.floor(i / 5) * 42;
    blocks += `<rect x="${x}" y="${y}" width="34" height="34" rx="5" fill="#fde68a" stroke="#92400e" stroke-width="3" />`;
  }
  return `<svg viewBox="0 0 245 160" width="300" aria-label="blocks">${blocks}</svg>`;
}

function generateQuestion() {
  switch (state.category) {
    case 'multiplication':
      return multiplicationOnlyQuestion();
    case 'mixed':
      return pick([
        wordProblemQuestion,
        wordProblemQuestion,
        geometryQuestion,
        areaPerimeterQuestion,
        areaPerimeterQuestion,
        patternQuestion
      ])();
    case 'arithmetic':
    default:
      return arithmeticQuestion();
  }
}

function startQuiz() {
  state = {
    difficulty: difficultySelect.value,
    total: Number(questionCountSelect.value),
    category: categorySelect.value,
    current: 0,
    score: 0,
    question: null,
    selectedAnswer: null,
    answered: false,
    bonusUnlocked: false,
    bonusGameType: null,
    bonusConsumed: false
  };
  scoreEl.textContent = '0';
  setupScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  loadQuestion();
}

function loadQuestion() {
  state.current += 1;
  state.question = generateQuestion();
  state.selectedAnswer = null;
  state.answered = false;

  questionCounter.textContent = `Question ${state.current} of ${state.total}`;
  skillBadge.textContent = state.question.skill;
  questionText.textContent = state.question.text;
  feedback.textContent = '';
  feedback.className = 'feedback';
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');

  if (state.question.visual) {
    visualArea.innerHTML = state.question.visual;
    visualArea.classList.remove('hidden');
  } else {
    visualArea.innerHTML = '';
    visualArea.classList.add('hidden');
  }

  renderAnswerArea();
}

function renderAnswerArea() {
  answerArea.innerHTML = '';
  const q = state.question;

  if (q.type === 'multiple') {
    q.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.onclick = () => {
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedAnswer = choice;
      };
      answerArea.appendChild(btn);
    });
    return;
  }

  if (q.type === 'truefalse') {
    ['true', 'false'].forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice === 'true' ? 'True' : 'False';
      btn.onclick = () => {
        document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedAnswer = choice;
      };
      answerArea.appendChild(btn);
    });
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type your answer';
  input.id = 'answerInput';
  input.autocomplete = 'off';
  input.oninput = () => state.selectedAnswer = input.value.trim().toLowerCase();
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') submitAnswer();
  });
  answerArea.appendChild(input);
  input.focus();
}

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function submitAnswer() {
  if (state.answered) return;
  const answer = normalize(state.selectedAnswer || '');
  if (!answer) {
    feedback.textContent = 'Choose or type an answer first.';
    feedback.className = 'feedback bad';
    return;
  }

  const correct = answer === normalize(state.question.answer);
  state.answered = true;

  if (correct) {
    state.score += 1;
    scoreEl.textContent = String(state.score);
    feedback.textContent = 'Correct! Great job.';
    feedback.className = 'feedback good';
  } else {
    feedback.textContent = `Not quite. The correct answer is ${state.question.answer}.`;
    feedback.className = 'feedback bad';
  }

  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
}

function nextQuestion() {
  if (state.current >= state.total) {
    showResults();
  } else {
    loadQuestion();
  }
}

function getAccuracyPercent() {
  if (!state.total) return 0;
  return Math.round((state.score / state.total) * 100);
}

function randomBonusGameType() {
  const games = ['breakout', 'pong', 'fruit', 'runner'];
  return games[randInt(0, games.length - 1)];
}

function getBonusGameName(type) {
  const names = {
    breakout: 'Breakout',
    pong: 'Pong',
    fruit: 'Fruit Catcher',
    runner: 'Endless Runner'
  };
  return names[type] || 'Mini Game';
}

function setBonusGameAccess() {
  const pct = getAccuracyPercent();
  state.bonusUnlocked = pct >= 60 && !state.bonusConsumed;
  state.bonusGameType = null;

  if (state.bonusUnlocked) {
    miniGameBtn.classList.remove('hidden');
    miniGameBtn.disabled = false;
    miniGameBtn.textContent = 'Play 1-Minute Random Bonus Game';

    if (pct >= 90) {
      finalMessage.textContent = 'Amazing work! Bonus game unlocked.';
    } else if (pct >= 70) {
      finalMessage.textContent = 'Nice job! Bonus game unlocked.';
    } else {
      finalMessage.textContent = 'Good work! You reached 60% and unlocked the bonus game.';
    }
  } else {
    miniGameBtn.classList.add('hidden');
    miniGameBtn.disabled = true;
    if (state.bonusConsumed) {
      finalMessage.textContent = 'Bonus game used. Start a new quiz to earn another reward.';
    } else {
      finalMessage.textContent = 'You need at least 60% correct to unlock the bonus game. Keep practicing and try again!';
    }
  }
}

function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const pct = getAccuracyPercent();
  finalScore.textContent = `${state.score} / ${state.total} (${pct}%)`;
  setBonusGameAccess();
}

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => {
  stopMiniGame();
  resultScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
});
submitBtn.addEventListener('click', submitAnswer);
nextBtn.addEventListener('click', nextQuestion);


let gameState = null;
let gameLoopId = null;
let gameCountdownId = null;
let keys = {};

function getCanvasPoint(event) {
  const rect = gameCanvas.getBoundingClientRect();
  const source = event.touches && event.touches.length ? event.touches[0] : event;
  return {
    x: (source.clientX - rect.left) * (gameCanvas.width / rect.width),
    y: (source.clientY - rect.top) * (gameCanvas.height / rect.height)
  };
}

function updatePointerControl(event) {
  if (!gameState || !gameState.running) return;
  const point = getCanvasPoint(event);
  gameState.pointerX = point.x;
  gameState.pointerY = point.y;
  gameState.pointerActive = true;
  if (event.cancelable) event.preventDefault();
}

document.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's', ' '].includes(event.key)) {
    keys[event.key] = true;
    event.preventDefault();
  }
});

document.addEventListener('keyup', event => {
  keys[event.key] = false;
});

gameCanvas.addEventListener('mousemove', updatePointerControl);
gameCanvas.addEventListener('touchstart', updatePointerControl, { passive: false });
gameCanvas.addEventListener('touchmove', updatePointerControl, { passive: false });

function startMiniGame() {
  setBonusGameAccess();
  if (!state.bonusUnlocked || state.bonusConsumed) {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    return;
  }

  // A bonus game is a one-time reward. Once launched, the player must
  // complete another quiz to earn access again.
  state.bonusConsumed = true;
  state.bonusUnlocked = false;
  miniGameBtn.classList.add('hidden');
  miniGameBtn.disabled = true;

  const gameType = randomBonusGameType();
  state.bonusGameType = gameType;
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  backToResultsBtn.classList.add('hidden');
  stopGameBtn.classList.remove('hidden');
  miniGameBtn.textContent = `Play 1-Minute Random Bonus Game`;
  setupGame(gameType);
  gameLoopId = requestAnimationFrame(gameLoop);
  gameCountdownId = setInterval(() => {
    if (!gameState) return;
    gameState.timeLeft -= 1;
    gameTimer.textContent = String(gameState.timeLeft);
    if (gameState.timeLeft <= 0) finishMiniGame();
  }, 1000);
}

function setupGame(type) {
  const ctx = gameCanvas.getContext('2d');
  gameState = {
    type,
    ctx,
    width: gameCanvas.width,
    height: gameCanvas.height,
    timeLeft: 60,
    score: 0,
    running: true,
    pointerActive: false,
    pointerX: gameCanvas.width / 2,
    pointerY: gameCanvas.height / 2
  };
  gameTimer.textContent = '60';
  gameScore.textContent = '0';

  if (type === 'breakout') setupBreakout();
  else if (type === 'pong') setupPong();
  else if (type === 'fruit') setupFruitCatcher();
  else setupEndlessRunner();
}

function setupBreakout() {
  gameTitle.textContent = 'Block Breakout';
  gameInstructions.textContent = 'Move your mouse or finger to control the paddle. Keyboard backup: Left/Right arrows or A/D.';
  const bricks = [];
  const rows = 5;
  const cols = 9;
  const brickW = 70;
  const brickH = 22;
  const gap = 9;
  const startX = 38;
  const startY = 42;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push({ x: startX + c * (brickW + gap), y: startY + r * (brickH + gap), w: brickW, h: brickH, alive: true });
    }
  }
  Object.assign(gameState, {
    paddle: { x: 320, y: 382, w: 120, h: 16, speed: 8 },
    ball: { x: 380, y: 320, r: 9, vx: 4, vy: -5 },
    bricks
  });
}

function setupPong() {
  gameTitle.textContent = 'Pong Rally';
  gameInstructions.textContent = 'Move your mouse or finger up and down to control your paddle. Keyboard backup: Up/Down arrows or W/S.';
  Object.assign(gameState, {
    player: { x: 28, y: 160, w: 16, h: 96, speed: 7 },
    computer: { x: 716, y: 160, w: 16, h: 96, speed: 4.7 },
    ball: { x: 380, y: 210, r: 9, vx: 5, vy: 3.2 }
  });
}


function setupFruitCatcher() {
  gameTitle.textContent = 'Fruit Catcher';
  gameInstructions.textContent = 'Move your mouse or finger to slide the basket. Catch fruit, avoid bombs. Keyboard backup: Left/Right arrows or A/D.';
  Object.assign(gameState, {
    basket: { x: 330, y: 365, w: 110, h: 34, speed: 8 },
    items: [],
    spawnTick: 0
  });
}

function setupEndlessRunner() {
  gameTitle.textContent = 'Endless Runner';
  gameInstructions.textContent = 'Press Space, Up Arrow, click, or tap to jump over obstacles. Survive and collect stars.';
  Object.assign(gameState, {
    runner: { x: 95, y: 326, w: 34, h: 48, vy: 0, onGround: true },
    groundY: 374,
    obstacles: [],
    stars: [],
    spawnTick: 0,
    starTick: 0,
    speed: 5,
    lastPointerY: null
  });
}

function gameLoop() {
  if (!gameState || !gameState.running) return;
  if (gameState.type === 'breakout') updateBreakout();
  else if (gameState.type === 'pong') updatePong();
  else if (gameState.type === 'fruit') updateFruitCatcher();
  else updateEndlessRunner();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function drawBackground(ctx) {
  ctx.clearRect(0, 0, gameState.width, gameState.height);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, gameState.width, gameState.height);
}

function updateBreakout() {
  const s = gameState;
  const ctx = s.ctx;
  const p = s.paddle;
  const b = s.ball;
  if (s.pointerActive) {
    p.x = s.pointerX - p.w / 2;
  }
  if (keys.ArrowLeft || keys.a) {
    p.x -= p.speed;
    s.pointerActive = false;
  }
  if (keys.ArrowRight || keys.d) {
    p.x += p.speed;
    s.pointerActive = false;
  }
  p.x = Math.max(0, Math.min(s.width - p.w, p.x));
  b.x += b.vx;
  b.y += b.vy;
  if (b.x < b.r || b.x > s.width - b.r) b.vx *= -1;
  if (b.y < b.r) b.vy *= -1;
  if (b.y > s.height + 20) resetBreakoutBall();
  if (circleRectCollision(b, p) && b.vy > 0) {
    b.vy *= -1;
    b.y = p.y - b.r;
    b.vx += ((b.x - (p.x + p.w / 2)) / (p.w / 2)) * 1.8;
  }
  s.bricks.forEach(brick => {
    if (brick.alive && circleRectCollision(b, brick)) {
      brick.alive = false;
      b.vy *= -1;
      addGameScore(10);
    }
  });
  if (s.bricks.every(brick => !brick.alive)) setupBreakout();
  drawBackground(ctx);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = '#f97316';
  ctx.fill();
  s.bricks.forEach((brick, idx) => {
    if (!brick.alive) return;
    ctx.fillStyle = ['#bfdbfe', '#bbf7d0', '#fde68a', '#fecaca', '#ddd6fe'][idx % 5];
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
  });
}

function resetBreakoutBall() {
  gameState.ball.x = gameState.width / 2;
  gameState.ball.y = 320;
  gameState.ball.vx = Math.random() > 0.5 ? 4 : -4;
  gameState.ball.vy = -5;
}

function updatePong() {
  const s = gameState;
  const ctx = s.ctx;
  const p = s.player;
  const c = s.computer;
  const b = s.ball;
  if (s.pointerActive) {
    p.y = s.pointerY - p.h / 2;
  }
  if (keys.ArrowUp || keys.w) {
    p.y -= p.speed;
    s.pointerActive = false;
  }
  if (keys.ArrowDown || keys.s) {
    p.y += p.speed;
    s.pointerActive = false;
  }
  p.y = Math.max(0, Math.min(s.height - p.h, p.y));
  const target = b.y - c.h / 2;
  if (c.y < target) c.y += c.speed;
  if (c.y > target) c.y -= c.speed;
  c.y = Math.max(0, Math.min(s.height - c.h, c.y));
  b.x += b.vx;
  b.y += b.vy;
  if (b.y < b.r || b.y > s.height - b.r) b.vy *= -1;
  if (circleRectCollision(b, p) && b.vx < 0) {
    b.vx = Math.abs(b.vx) + 0.15;
    b.vy += ((b.y - (p.y + p.h / 2)) / (p.h / 2)) * 2;
    addGameScore(2);
  }
  if (circleRectCollision(b, c) && b.vx > 0) {
    b.vx = -Math.abs(b.vx) - 0.05;
    b.vy += ((b.y - (c.y + c.h / 2)) / (c.h / 2)) * 1.5;
    addGameScore(1);
  }
  if (b.x < -20) resetPongBall(1);
  if (b.x > s.width + 20) {
    addGameScore(15);
    resetPongBall(-1);
  }
  drawBackground(ctx);
  ctx.setLineDash([10, 12]);
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(s.width / 2, 0);
  ctx.lineTo(s.width / 2, s.height);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(c.x, c.y, c.w, c.h);
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fillStyle = '#f97316';
  ctx.fill();
}


function updateFruitCatcher() {
  const s = gameState;
  const ctx = s.ctx;
  const basket = s.basket;

  if (s.pointerActive) {
    basket.x = s.pointerX - basket.w / 2;
  }
  if (keys.ArrowLeft || keys.a) {
    basket.x -= basket.speed;
    s.pointerActive = false;
  }
  if (keys.ArrowRight || keys.d) {
    basket.x += basket.speed;
    s.pointerActive = false;
  }
  basket.x = Math.max(0, Math.min(s.width - basket.w, basket.x));

  s.spawnTick += 1;
  if (s.spawnTick > 26) {
    s.spawnTick = 0;
    const isBomb = Math.random() < 0.18;
    s.items.push({
      x: randInt(24, s.width - 24),
      y: -20,
      r: isBomb ? 15 : 13,
      vy: randInt(3, 6),
      type: isBomb ? 'bomb' : 'fruit',
      label: isBomb ? '💣' : ['🍎', '🍌', '🍓', '🍊'][randInt(0, 3)]
    });
  }

  s.items.forEach(item => item.y += item.vy);
  s.items = s.items.filter(item => {
    const caught = item.y + item.r >= basket.y && item.y - item.r <= basket.y + basket.h && item.x >= basket.x && item.x <= basket.x + basket.w;
    if (caught) {
      addGameScore(item.type === 'bomb' ? -15 : 10);
      return false;
    }
    return item.y < s.height + 30;
  });

  drawBackground(ctx);
  ctx.fillStyle = '#2563eb';
  roundRect(ctx, basket.x, basket.y, basket.w, basket.h, 12, true, false);
  ctx.fillStyle = '#1e293b';
  ctx.font = '24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  s.items.forEach(item => ctx.fillText(item.label, item.x, item.y + 8));
}

function updateEndlessRunner() {
  const s = gameState;
  const ctx = s.ctx;
  const r = s.runner;

  const jumpPressed = keys.ArrowUp || keys.w || keys[' '] || s.pointerActive;
  if (jumpPressed && r.onGround) {
    r.vy = -14;
    r.onGround = false;
    s.pointerActive = false;
  }

  r.vy += 0.75;
  r.y += r.vy;
  if (r.y + r.h >= s.groundY) {
    r.y = s.groundY - r.h;
    r.vy = 0;
    r.onGround = true;
  }

  s.spawnTick += 1;
  if (s.spawnTick > randInt(65, 105)) {
    s.spawnTick = 0;
    s.obstacles.push({ x: s.width + 20, y: s.groundY - 38, w: 24, h: 38 });
  }
  s.starTick += 1;
  if (s.starTick > randInt(90, 140)) {
    s.starTick = 0;
    s.stars.push({ x: s.width + 20, y: randInt(155, 275), r: 10 });
  }

  s.obstacles.forEach(o => o.x -= s.speed);
  s.stars.forEach(star => star.x -= s.speed);
  s.obstacles = s.obstacles.filter(o => o.x + o.w > -20);
  s.stars = s.stars.filter(star => star.x + star.r > -20);

  s.obstacles.forEach(o => {
    if (rectsOverlap(r, o)) {
      addGameScore(-5);
      o.x = -100;
    }
  });
  s.stars = s.stars.filter(star => {
    const runnerCenterX = r.x + r.w / 2;
    const runnerCenterY = r.y + r.h / 2;
    const dx = runnerCenterX - star.x;
    const dy = runnerCenterY - star.y;
    if (dx * dx + dy * dy < (star.r + 25) * (star.r + 25)) {
      addGameScore(12);
      return false;
    }
    return true;
  });

  if (Math.floor((60 - s.timeLeft) * 10) % 10 === 0) {
    s.speed = Math.min(8, s.speed + 0.002);
  }

  drawBackground(ctx);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, s.groundY);
  ctx.lineTo(s.width, s.groundY);
  ctx.stroke();

  drawCatRunner(ctx, r);
  ctx.fillStyle = '#f97316';
  s.obstacles.forEach(o => roundRect(ctx, o.x, o.y, o.w, o.h, 5, true, false));
  ctx.fillStyle = '#facc15';
  ctx.font = '24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  s.stars.forEach(star => ctx.fillText('⭐', star.x, star.y + 8));
}


function drawCatRunner(ctx, r) {
  const cx = r.x + r.w / 2;
  const bodyY = r.y + 26;

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(cx, bodyY + 5, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx + 7, r.y + 14, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - 4, r.y + 3);
  ctx.lineTo(cx + 2, r.y - 9);
  ctx.lineTo(cx + 8, r.y + 5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 13, r.y + 4);
  ctx.lineTo(cx + 21, r.y - 6);
  ctx.lineTo(cx + 22, r.y + 9);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(r.x + 2, bodyY + 2);
  ctx.quadraticCurveTo(r.x - 20, bodyY - 16, r.x - 7, bodyY - 30);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx + 12, r.y + 12, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 22, r.y + 12, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 17, r.y + 18, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 8, bodyY + 15);
  ctx.lineTo(cx - 14, r.y + r.h);
  ctx.moveTo(cx + 8, bodyY + 15);
  ctx.lineTo(cx + 15, r.y + r.h);
  ctx.stroke();
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function resetPongBall(direction) {
  gameState.ball.x = gameState.width / 2;
  gameState.ball.y = gameState.height / 2;
  gameState.ball.vx = 5 * direction;
  gameState.ball.vy = Math.random() > 0.5 ? 3 : -3;
}

function circleRectCollision(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < circle.r * circle.r;
}

function addGameScore(points) {
  gameState.score += points;
  gameScore.textContent = String(gameState.score);
}

function finishMiniGame() {
  if (!gameState) return;
  const finalMiniScore = gameState.score;
  gameState.running = false;
  clearInterval(gameCountdownId);
  cancelAnimationFrame(gameLoopId);
  gameState = null;

  gameScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
  miniGameBtn.classList.add('hidden');
  miniGameBtn.disabled = true;
  finalMessage.textContent = `Mini-game finished! Score: ${finalMiniScore}. Start a new quiz to earn another reward.`;
}

function stopMiniGame() {
  if (!gameState) return;
  gameState.running = false;
  clearInterval(gameCountdownId);
  cancelAnimationFrame(gameLoopId);
  gameState = null;
}

function backToResults() {
  finishMiniGame();
}

miniGameBtn.addEventListener('click', startMiniGame);
stopGameBtn.addEventListener('click', finishMiniGame);
backToResultsBtn.addEventListener('click', backToResults);
